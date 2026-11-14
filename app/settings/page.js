'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, Moon, RotateCcw, Save, Settings, Sun, UserRound, SlidersHorizontal, Database } from 'lucide-react';
import { useTheme } from '@/app/contexts/ThemeContext';
import { settingsService } from '@/services/settingsService';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/app/contexts/AuthContext';

const STORAGE_KEY = 'workspace_preferences';
const DEFAULT_PREFERENCES = { workspaceName: 'AdminPro Workspace', supportEmail: '', currency: 'INR', timezone: 'Asia/Kolkata', dateFormat: 'DD MMM YYYY', emailAlerts: true, securityAuditLogging: true, autoRefresh: true };
const control = 'mt-1 h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground outline-none';
const Toggle = ({ checked, onChange, label }) => <label className="flex cursor-pointer items-center justify-between gap-4 border-b border-border py-3 last:border-0"><span className="text-sm text-foreground">{label}</span><button type="button" role="switch" aria-label={label} aria-checked={checked} onClick={onChange} className={`relative h-6 w-11 shrink-0 rounded-full border border-border transition-colors ${checked ? 'bg-foreground' : 'bg-muted'}`}><span className={`absolute top-0.5 h-4 w-4 rounded-full transition-all ${checked ? 'left-5 bg-background' : 'left-1 bg-foreground'}`}/></button></label>;

export default function SettingsPage() {
  const { isDark } = useTheme();
  const { currentUser, updateCurrentUser } = useAuth();
  const [profileId, setProfileId] = useState(null);
  const [profile, setProfile] = useState({ name: '', email: '', department: '', role: 'admin', status: 'active' });
  const [savedProfile, setSavedProfile] = useState(null);
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [savedPreferences, setSavedPreferences] = useState(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [connectedTables, setConnectedTables] = useState(0);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [user, saved, tableResults] = await Promise.all([
        settingsService.getAdminProfile(currentUser?.email || ''),
        Promise.resolve().then(() => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch { return null; } }),
        Promise.all(['products', 'categories', 'users', 'orders', 'events', 'notifications'].map((table) => supabase.from(table).select('*', { count: 'exact', head: true }))),
      ]);
      if (user) {
        setProfileId(user.id);
        const next = { name: user.full_name || '', email: user.email || '', department: user.department || '', role: user.role || 'admin', status: user.status || 'active' };
        setProfile(next); setSavedProfile(next);
      }
      const nextPreferences = { ...DEFAULT_PREFERENCES, ...(saved || {}) };
      setPreferences(nextPreferences); setSavedPreferences(nextPreferences);
      setConnectedTables(tableResults.filter((result) => !result.error).length);
    } catch (loadError) { setError(loadError.message || 'Could not load workspace settings.'); }
    finally { setLoading(false); }
  }, [currentUser?.email]);
  useEffect(() => { load(); }, [load]);

  const changePreference = (key, value) => setPreferences((current) => {
    const next = { ...current, [key]: value === undefined ? !current[key] : value };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...next, darkMode: isDark })); } catch { /* browser storage may be disabled */ }
    return next;
  });
  const resetChanges = () => { setProfile(savedProfile || { name: '', email: '', department: '', role: 'admin', status: 'active' }); setPreferences(savedPreferences); setError(''); setSuccess('Unsaved changes reset.'); };
  const save = async (event) => {
    event.preventDefault(); setSaving(true); setError(''); setSuccess('');
    try {
      if (!profileId) throw new Error('No admin user profile is available to update.');
      const updated = await settingsService.updateAdminProfile(profileId, profile);
      const nextProfile = { name: updated.full_name || '', email: updated.email || '', department: updated.department || '', role: updated.role || 'admin', status: updated.status || 'active' };
      const nextPreferences = { ...preferences, darkMode: isDark };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPreferences));
      setProfile(nextProfile); setSavedProfile(nextProfile); setSavedPreferences(preferences); setSuccess('Admin profile and workspace preferences saved.');
      updateCurrentUser({ id: updated.id, ...nextProfile });
    } catch (saveError) { setError(saveError.message || 'Could not save workspace settings.'); }
    finally { setSaving(false); }
  };
  const openCustomizer = () => document.querySelector('[title="Workspace Customizer"]')?.click();

  return <main className="mx-auto min-h-full max-w-7xl space-y-5 bg-background p-4 text-foreground sm:p-6">
    <form id="settings-form" onSubmit={save} className="space-y-5">
      <header className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight sm:text-2xl">Workspace &amp; Account Settings<span className="h-2 w-2 rounded-full bg-foreground" title="Live Supabase sync"/></h1><p className="mt-1 text-sm text-muted-foreground">Admin profile syncs with Supabase; workspace preferences are saved in this browser.</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={resetChanges} className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-4 text-xs font-medium hover:bg-muted"><RotateCcw size={14}/>Reset Changes</button><button type="submit" disabled={loading || saving} className="inline-flex h-9 items-center gap-2 rounded-md bg-foreground px-4 text-xs font-medium text-background"><Save size={14}/>{saving ? 'Saving…' : 'Save Changes'}</button></div></header>
      {error && <p role="alert" className="rounded-md border border-border bg-muted p-3 text-sm">{error}</p>}{success && <p role="status" className="rounded-md border border-border bg-muted p-3 text-sm">{success}</p>}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="min-w-0 space-y-5 xl:col-span-2">
          <section className="rounded-xl border border-border bg-card p-5 sm:p-6"><div className="mb-5"><h2 className="flex items-center gap-2 text-base font-semibold"><UserRound size={16}/>Admin Profile (Synced with public.users)</h2><p className="mt-1 text-xs text-muted-foreground">Changes update the selected admin record.</p></div>{loading ? <p className="py-8 text-center text-sm text-muted-foreground">Loading profile…</p> : <div className="grid grid-cols-1 gap-4 md:grid-cols-2"><label className="text-xs font-medium">Full Name<input required value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} className={control}/></label><label className="text-xs font-medium">Email Address<input required type="email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} className={control}/></label><label className="text-xs font-medium">Role<select value={profile.role} onChange={(event) => setProfile({ ...profile, role: event.target.value })} className={control}>{['admin', 'manager', 'user'].map((role) => <option key={role} value={role}>{role}</option>)}</select></label><label className="text-xs font-medium">Department<input value={profile.department} onChange={(event) => setProfile({ ...profile, department: event.target.value })} className={control}/></label><label className="text-xs font-medium">Status<select value={profile.status} onChange={(event) => setProfile({ ...profile, status: event.target.value })} className={control}>{['active', 'inactive', 'suspended'].map((status) => <option key={status} value={status}>{status}</option>)}</select></label><div className="flex items-end"><button type="submit" disabled={loading || saving} className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-4 text-xs font-medium hover:bg-muted"><Check size={14}/>Save Profile</button></div></div>}</section>
          <section className="rounded-xl border border-border bg-card p-5 sm:p-6"><div className="mb-5"><h2 className="flex items-center gap-2 text-base font-semibold"><SlidersHorizontal size={16}/>Workspace &amp; Regional Preferences</h2><p className="mt-1 text-xs text-muted-foreground">Saved locally for this workspace.</p></div><div className="grid grid-cols-1 gap-4 md:grid-cols-2"><label className="text-xs font-medium">Workspace Name<input value={preferences.workspaceName} onChange={(event) => changePreference('workspaceName', event.target.value)} className={control}/></label><label className="text-xs font-medium">Support Email<input type="email" value={preferences.supportEmail} onChange={(event) => changePreference('supportEmail', event.target.value)} className={control}/></label><label className="text-xs font-medium">Default Currency<select value={preferences.currency} onChange={(event) => changePreference('currency', event.target.value)} className={control}><option value="INR">INR ₹</option></select></label><label className="text-xs font-medium">Timezone<select value={preferences.timezone} onChange={(event) => changePreference('timezone', event.target.value)} className={control}><option value="Asia/Kolkata">Asia/Kolkata (IST)</option><option value="UTC">UTC</option></select></label><label className="text-xs font-medium">Date Format<select value={preferences.dateFormat} onChange={(event) => changePreference('dateFormat', event.target.value)} className={control}>{['DD MMM YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'].map((format) => <option key={format}>{format}</option>)}</select></label></div></section>
          <section className="rounded-xl border border-border bg-card p-5 sm:p-6"><div className="mb-3"><h2 className="text-base font-semibold">Notification &amp; Security Toggles</h2><p className="mt-1 text-xs text-muted-foreground">Preferences apply immediately and persist locally.</p></div><Toggle label="Email Alerts" checked={Boolean(preferences.emailAlerts)} onChange={() => changePreference('emailAlerts')}/><Toggle label="Security Audit Logging" checked={Boolean(preferences.securityAuditLogging)} onChange={() => changePreference('securityAuditLogging')}/><Toggle label="Auto-Refresh" checked={Boolean(preferences.autoRefresh)} onChange={() => changePreference('autoRefresh')}/></section>
        </div>
        <aside className="min-w-0 space-y-5"><section className="rounded-xl border border-border bg-card p-5"><p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Live Profile Preview</p><div className="mt-4 flex items-center gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-foreground font-mono text-sm font-semibold text-background">{(profile.name || 'Admin').trim().split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</span><span className="min-w-0"><span className="block truncate text-sm font-semibold">{profile.name || 'Admin Name'}</span><span className="block truncate text-xs text-muted-foreground">{profile.email || 'admin@example.com'}</span></span></div><div className="mt-4 flex flex-wrap gap-2"><span className="rounded border border-border bg-muted px-2 py-1 font-mono text-[10px] uppercase">{profile.role}</span><span className="rounded border border-border bg-muted px-2 py-1 font-mono text-[10px] uppercase">{profile.status}</span></div><p className="mt-3 text-xs text-muted-foreground">{profile.department || 'General'} · {preferences.workspaceName}</p></section><section className="rounded-xl border border-border bg-card p-5"><h2 className="flex items-center gap-2 text-sm font-semibold"><Database size={15}/>Connected Supabase Environment</h2><div className="mt-4 space-y-3 text-xs"><div className="flex justify-between gap-3"><span className="text-muted-foreground">Active tables</span><span className="font-mono font-semibold">{connectedTables} / 6</span></div><div className="flex justify-between gap-3"><span className="text-muted-foreground">Theme mode</span><span className="font-mono font-semibold">{isDark ? 'Dark' : 'Light'}</span></div><div className="flex justify-between gap-3"><span className="text-muted-foreground">Region</span><span className="font-mono font-semibold">{preferences.timezone}</span></div></div><div className="mt-4 space-y-2 border-t border-border pt-4"><button type="button" onClick={openCustomizer} className="block w-full rounded-md border border-border px-3 py-2 text-left text-xs font-medium hover:bg-muted">Open Workspace Customizer</button><Link href="/security/audit/security" className="block rounded-md border border-border px-3 py-2 text-xs font-medium hover:bg-muted">View Security Logs</Link></div></section></aside>
      </div>
    </form>
  </main>;
}
