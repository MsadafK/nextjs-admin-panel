'use client';

import { useEffect, useState } from 'react';
import { Moon, Save, Settings, Sun } from 'lucide-react';
import { useTheme } from '@/app/contexts/ThemeContext';
import { settingsService } from '@/services/settingsService';

const STORAGE_KEY = 'workspace_preferences';
const DEFAULT_PREFERENCES = { desktopNotifications: true, compactSidebar: false, autoRefresh: true };

export default function SettingsPage() {
  const { isDark, toggleDarkMode } = useTheme();
  const [profileId, setProfileId] = useState(null);
  const [profile, setProfile] = useState({ name: '', email: '', department: '', role: 'admin' });
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [user, savedPreferences] = await Promise.all([
          settingsService.getAdminProfile(),
          Promise.resolve().then(() => {
            try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch { return null; }
          }),
        ]);
        if (!active) return;
        if (user) {
          setProfileId(user.id);
          setProfile({ name: user.full_name || '', email: user.email || '', department: user.department || '', role: user.role || 'admin' });
        }
        if (savedPreferences) setPreferences({ ...DEFAULT_PREFERENCES, ...savedPreferences });
      } catch (loadError) { if (active) setError(loadError.message || 'Could not load admin settings.'); }
      finally { if (active) setLoading(false); }
    };
    load();
    return () => { active = false; };
  }, []);

  const changePreference = (key) => setPreferences((current) => ({ ...current, [key]: !current[key] }));
  const save = async (event) => {
    event.preventDefault(); setSaving(true); setError(''); setSuccess('');
    try {
      if (!profileId) throw new Error('No admin user profile is available to update.');
      const updated = await settingsService.updateAdminProfile(profileId, profile);
      setProfile({ name: updated.full_name || '', email: updated.email || '', department: updated.department || '', role: updated.role || 'admin' });
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...preferences, darkMode: isDark }));
      setSuccess('Profile and workspace preferences saved.');
    } catch (saveError) { setError(saveError.message || 'Could not save settings.'); }
    finally { setSaving(false); }
  };

  const inputClass = 'mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground';
  const toggleClass = 'relative h-6 w-11 rounded-full border border-border bg-muted transition-colors';

  return <main className="min-h-screen space-y-6 bg-background p-6 text-foreground">
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5"><div><h1 className="flex items-center gap-2 text-2xl font-semibold"><Settings size={21}/> Settings</h1><p className="mt-1 text-sm text-muted-foreground">Admin profile from Supabase and workspace preferences stored in this browser.</p></div><button onClick={toggleDarkMode} className="inline-flex items-center gap-2 rounded-md border border-border bg-muted px-4 py-2">{isDark ? <Sun size={16}/> : <Moon size={16}/>} {isDark ? 'Light mode' : 'Dark mode'}</button></header>
    {error && <p role="alert" className="rounded-md border border-border bg-muted p-3 text-sm">{error}</p>}{success && <p role="status" className="rounded-md border border-border bg-muted p-3 text-sm">{success}</p>}
    <form onSubmit={save} className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
      <section className="space-y-4 rounded-lg border border-border bg-card p-5"><div><h2 className="text-lg font-semibold">Admin Profile</h2><p className="text-sm text-muted-foreground">Changes update the matching row in public.users.</p></div>{loading ? <p className="py-8 text-center text-muted-foreground">Loading profile…</p> : <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm">Admin Name<input required value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} className={inputClass}/></label><label className="text-sm">Email<input required type="email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} className={inputClass}/></label><label className="text-sm">Department<input value={profile.department} onChange={(event) => setProfile({ ...profile, department: event.target.value })} className={inputClass}/></label><label className="text-sm">Role<select value={profile.role} onChange={(event) => setProfile({ ...profile, role: event.target.value })} className={inputClass}>{['admin', 'manager', 'user'].map((role) => <option key={role} value={role}>{role}</option>)}</select></label></div>}</section>
      <section className="space-y-4 rounded-lg border border-border bg-card p-5"><div><h2 className="text-lg font-semibold">Workspace Preferences</h2><p className="text-sm text-muted-foreground">Saved in localStorage for this workspace.</p></div>{[['desktopNotifications', 'Desktop notifications'], ['compactSidebar', 'Compact sidebar'], ['autoRefresh', 'Auto refresh data']].map(([key, label]) => <label key={key} className="flex cursor-pointer items-center justify-between gap-3 border-b border-border py-3 text-sm last:border-0"><span>{label}</span><button type="button" role="switch" aria-checked={Boolean(preferences[key])} onClick={() => changePreference(key)} className={toggleClass}><span className={`absolute top-0.5 h-4 w-4 rounded-full bg-foreground transition-all ${preferences[key] ? 'left-5' : 'left-1'}`}/></button></label>)}</section>
      <div className="flex justify-end xl:col-span-2"><button disabled={loading || saving} className="inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-2.5 text-background disabled:opacity-50"><Save size={16}/>{saving ? 'Saving…' : 'Save Settings'}</button></div>
    </form>
  </main>;
}
