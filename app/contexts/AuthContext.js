'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService, DEMO_ACCOUNTS, isDemoModeEnabled, mapAuthUser } from '@/services/authService';
import { userService } from '@/services/userService';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/app/contexts/ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const { pushToast } = useToast();
  const [currentUser, setCurrentUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const persistUser = useCallback((user) => {
    const normalizedUser = mapAuthUser(user);
    setCurrentUser(normalizedUser);
    window.dispatchEvent(new CustomEvent('adminpro:auth-updated', { detail: normalizedUser }));
    return normalizedUser;
  }, []);

  useEffect(() => {
    let active = true;
    const initialize = async () => {
      let initialUser = null;
      try {
        // A profile cached in localStorage is display data, never proof of identity.
        // Only a Supabase Auth session can restore an authenticated workspace session.
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        const authUser = data?.session?.user;
        if (authUser?.id && authUser.email) {
          const profile = await authService.findPublicUserByEmail(authUser.email);
          if (profile && String(profile.id) === String(authUser.id)) {
            const mapped = mapAuthUser(profile);
            if (mapped.status.toLowerCase() !== 'suspended' && profile.is_deleted !== true) initialUser = mapped;
          }
        }
      } catch (error) {
        // Fail closed when the persisted session or its workspace profile cannot be verified.
        console.error('Could not verify the saved Supabase session:', error.message);
      }
      if (!active) return;
      setCurrentUser(initialUser);
      try { localStorage.removeItem('adminpro_auth_user'); } catch { /* legacy profile cache is optional */ }
      try { localStorage.removeItem('adminpro_signed_out'); } catch { /* legacy sign-out marker is optional */ }
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
    if (!isDemoModeEnabled) throw new Error('Demo access is disabled for this deployment.');
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
      options: { data: { full_name: userData.name, role: 'user', department: userData.department } },
    });
    if (authError) throw authError;
    if (!authData?.user?.id) throw new Error('Supabase Auth did not return a new account.');
    const created = await userService.createUser({ ...userData, role: 'user', id: authData.user?.id });
    const user = mapAuthUser(created);
    if (!authData.session) return { requiresEmailConfirmation: true };
    await establishSession(user, 'User Account Registered');
    router.replace('/');
    return user;
  }, [establishSession, router]);

  const updateCurrentUser = useCallback((user) => persistUser(user), [persistUser]);

  const signOut = useCallback(async () => {
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
    if (!isDemoModeEnabled) throw new Error('Demo access is disabled for this deployment.');
    const user = await authService.getDemoAccount(DEMO_ACCOUNTS[0]);
    await establishSession(user, 'User Login');
    router.replace('/');
  }, [establishSession, router]);

  const switchDemoRole = useCallback(async (account) => {
    if (!isDemoModeEnabled) throw new Error('Demo access is disabled for this deployment.');
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
    currentUser, authReady, isAdmin, isManager, isUser, isDemoModeEnabled, signInWithEmail, switchDemoAccount, switchDemoRole, signUp, signOut, resumeDemo, updateCurrentUser,
  }), [currentUser, authReady, isAdmin, isManager, isUser, signInWithEmail, switchDemoAccount, switchDemoRole, signUp, signOut, resumeDemo, updateCurrentUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider.');
  return context;
}
