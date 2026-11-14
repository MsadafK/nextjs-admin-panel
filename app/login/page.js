'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import AuthLayout from '@/app/components/Auth/AuthLayout';
import { DEMO_ACCOUNTS } from '@/services/authService';
import { useAuth } from '@/app/contexts/AuthContext';

const inputClass = 'h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground';

export default function LoginPage() {
  const router = useRouter();
  const { signInWithEmail, switchDemoAccount } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [pending, setPending] = useState('');
  const [error, setError] = useState('');

  const selectDemo = async (account) => {
    setError(''); setPending(account.email);
    try { await switchDemoAccount(account); }
    catch (signInError) { setError(signInError.message || 'Could not open this demo account.'); }
    finally { setPending(''); }
  };
  const submit = async (event) => {
    event.preventDefault(); setError(''); setPending('form');
    try {
      await signInWithEmail(email, password);
      try { localStorage.setItem('adminpro_remember_session', String(remember)); } catch { /* optional preference */ }
      router.replace('/');
    } catch (signInError) { setError(signInError.message || 'Could not sign in. Check your account details.'); }
    finally { setPending(''); }
  };

  return <AuthLayout eyebrow="LIVE DEMO & WORKSPACE SIGN IN">
    <div className="space-y-6">
      <div><p className="text-[10px] font-mono font-semibold uppercase tracking-[0.18em] text-muted-foreground lg:hidden">ADMINPRO PRO</p><h1 className="mt-2 text-2xl font-semibold tracking-tight">Sign in to AdminPro</h1><p className="mt-1 text-sm text-muted-foreground">Choose a live demo role or sign in with your workspace account.</p></div>
      {error && <div role="alert" className="rounded-lg border border-border bg-muted p-3 text-xs text-foreground">{error}</div>}
      <section className="space-y-2.5"><div className="flex items-center justify-between gap-2"><h2 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Instant 1-Click Demo Access (Live Supabase Users)</h2><ShieldCheck size={14} className="shrink-0 text-muted-foreground"/></div>{DEMO_ACCOUNTS.map((account) => <button key={account.email} type="button" onClick={() => selectDemo(account)} disabled={Boolean(pending)} className="flex min-h-[58px] w-full items-center gap-3 rounded-lg border border-border bg-background px-3 py-2.5 text-left transition-colors hover:bg-muted/60 disabled:opacity-60"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground font-mono text-xs font-semibold text-background">{account.initials}</span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold text-foreground">{account.name}</span><span className="block truncate text-[10px] text-muted-foreground">{account.email}</span></span><span className="shrink-0 rounded border border-border bg-muted px-2 py-1 font-mono text-[9px] uppercase text-foreground">{account.role}{account.role === 'User' ? ' / Engineering' : ''}</span></button>)}</section>
      <div className="flex items-center gap-3"><span className="h-px flex-1 bg-border"/><span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Or continue with email</span><span className="h-px flex-1 bg-border"/></div>
      <form onSubmit={submit} className="space-y-3.5"><label className="block space-y-1.5 text-xs font-medium text-foreground">Email Address<input required type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" className={inputClass}/></label><label className="block space-y-1.5 text-xs font-medium text-foreground">Password<span className="relative block"><input required type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" className={`${inputClass} pr-11`}/><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground">{showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}</button></span></label><div className="flex flex-wrap items-center justify-between gap-2"><label className="inline-flex items-center gap-2 text-xs text-muted-foreground"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="accent-foreground"/>Remember session</label><Link href="/forgot-password" className="text-xs font-medium text-foreground underline-offset-4 hover:underline">Forgot password?</Link></div><button disabled={Boolean(pending)} className="h-10 w-full rounded-md bg-foreground text-xs font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60">{pending === 'form' ? 'Signing in…' : 'Sign In to Workspace'}</button></form>
      <p className="text-center text-xs text-muted-foreground">Don’t have an account? <Link href="/signup" className="font-medium text-foreground underline-offset-4 hover:underline">Create a workspace account →</Link></p>
    </div>
  </AuthLayout>;
}
