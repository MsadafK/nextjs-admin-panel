'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService, DEMO_ACCOUNTS, mapAuthUser } from '@/services/authService';
import { userService } from '@/services/userService';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/app/contexts/ToastContext';

const STORAGE_KEY = 'adminpro_auth_user';
const SIGNED_OUT_KEY = 'adminpro_signed_out';
const AuthContext = createContext(null);

const loadStoredUser = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); }
  catch { return null; }
};

export function AuthProvider({ children }) {
  const router = useRouter();
  const { pushToast } = useToast();
  const [currentUser, setCurrentUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const persistUser = useCallback((user) => {
    const normalizedUser = mapAuthUser(user);
    setCurrentUser(normalizedUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedUser));
      localStorage.removeItem(SIGNED_OUT_KEY);
    } catch { /* keep in-memory session when browser storage is unavailable */ }
    window.dispatchEvent(new CustomEvent('adminpro:auth-updated', { detail: normalizedUser }));
    return normalizedUser;
  }, []);

  useEffect(() => {
    let active = true;
    const initialize = async () => {
      let initialUser = null;
      const signedOut = localStorage.getItem(SIGNED_OUT_KEY) === 'true';
      if (!signedOut) {
        const stored = loadStoredUser();
        if (stored?.email) {
          const latest = await authService.findPublicUserByEmail(stored.email).catch(() => null);
          initialUser = latest ? mapAuthUser(latest) : mapAuthUser(stored);
        } else {
          initialUser = await authService.getDemoAccount(DEMO_ACCOUNTS[0]);
        }
        if (initialUser?.status?.toLowerCase() === 'suspended') initialUser = null;
      }
      if (!active) return;
      setCurrentUser(initialUser);
      if (initialUser) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(initialUser)); } catch { /* storage is optional */ }
      } else if (signedOut) {
        try { localStorage.removeItem(STORAGE_KEY); } catch { /* storage is optional */ }
      }
      setAuthReady(true);
    };
    initialize();
    return () => { active = false; };
  }, []);

  const establishSession = useCallback(async (user, auditAction = 'User Login') => {
    const normalizedUser = persistUser(user);
    try { await authService.logAuditEvent(normalizedUser, auditAction); }
    catch (error) { console.warn(`Session started, but the ${auditAction} audit entry could not be written:`, error.message); }
    setAuthReady(true);
    return normalizedUser;
  }, [persistUser]);

  const signInWithEmail = useCallback(async (email, password) => {
    const user = await authService.signInWithEmail(email, password);
    await establishSession(user, 'User Login');
    return user;
  }, [establishSession]);

  const switchDemoAccount = useCallback(async (account) => {
    const user = await authService.getDemoAccount(account);
    if (user.status.toLowerCase() === 'suspended') throw new Error('This account is suspended. Contact a workspace administrator.');
    await establishSession(user, 'User Login');
    router.replace('/');
    return user;
  }, [establishSession, router]);

  const signUp = useCallback(async (userData) => {
    const existing = await authService.findPublicUserByEmail(userData.email);
    if (existing) throw new Error('An account already uses this email. Please sign in instead.');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: { data: { full_name: userData.name, role: userData.role, department: userData.department } },
    });
    if (authError) throw authError;
    const created = await userService.createUser({ ...userData, id: authData.user?.id });
    const user = mapAuthUser(created);
    await establishSession(user, 'User Account Registered');
    router.replace('/');
    return user;
  }, [establishSession, router]);

  const updateCurrentUser = useCallback((user) => persistUser(user), [persistUser]);

  const signOut = useCallback(async () => {
    try { localStorage.setItem(SIGNED_OUT_KEY, 'true'); localStorage.removeItem(STORAGE_KEY); } catch { /* explicit sign out remains in memory */ }
    setCurrentUser(null);
    window.dispatchEvent(new CustomEvent('adminpro:auth-updated', { detail: null }));
    router.replace('/login');
    try { await supabase.auth.signOut(); } catch { /* directory-only demo sessions have no Auth token */ }
  }, [router]);

  useEffect(() => {
    if (!currentUser?.id) return undefined;
    const channel = supabase.channel(`auth-profile-${currentUser.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users', filter: `id=eq.${currentUser.id}` }, (payload) => {
        const row = payload.new;
        if (payload.eventType === 'DELETE' && String(payload.old?.id) === String(currentUser.id)) {
          signOut();
          return;
        }
        if (!row || String(row.id) !== String(currentUser.id)) return;
        if (row.is_deleted === true || String(row.status || '').toLowerCase() === 'suspended') {
          signOut();
          return;
        }
        persistUser(row);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [currentUser?.id, persistUser, signOut]);

  const resumeDemo = useCallback(async () => {
    const user = await authService.getDemoAccount(DEMO_ACCOUNTS[0]);
    await establishSession(user, 'User Login');
    router.replace('/');
  }, [establishSession, router]);

  const switchDemoRole = useCallback(async (account) => {
    const user = await authService.getDemoAccount(account);
    if (user.status.toLowerCase() === 'suspended') throw new Error('This account is suspended. Contact a workspace administrator.');
    const activeUser = await establishSession(user, 'Demo Role Switched');
    pushToast({ title: `Switched active role to ${String(activeUser.role || 'user').toUpperCase()}`, subtitle: activeUser.name });
    return activeUser;
  }, [establishSession, pushToast]);

  const role = String(currentUser?.role || '').trim().toLowerCase();
  const isAdmin = role === 'admin';
  const isManager = isAdmin || role === 'manager';
  const isUser = role === 'user';

  const value = useMemo(() => ({
    currentUser, authReady, isAdmin, isManager, isUser, signInWithEmail, switchDemoAccount, switchDemoRole, signUp, signOut, resumeDemo, updateCurrentUser,
  }), [currentUser, authReady, isAdmin, isManager, isUser, signInWithEmail, switchDemoAccount, switchDemoRole, signUp, signOut, resumeDemo, updateCurrentUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider.');
  return context;
}
