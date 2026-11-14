'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/app/components/Auth/AuthLayout';
import { useAuth } from '@/app/contexts/AuthContext';

const inputClass = 'h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground';

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', department: 'Engineering', role: 'User', password: '' });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const initials = form.name.trim().split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'U';

  const submit = async (event) => {
    event.preventDefault(); setPending(true); setError('');
    try { await signUp(form); router.replace('/'); }
    catch (signupError) { setError(signupError.message || 'Could not create the workspace account.'); }
    finally { setPending(false); }
  };

  return <AuthLayout eyebrow="CREATE A WORKSPACE ACCOUNT">
    <div className="space-y-5"><div><p className="text-[10px] font-mono font-semibold uppercase tracking-[0.18em] text-muted-foreground lg:hidden">ADMINPRO PRO</p><h1 className="mt-2 text-2xl font-semibold tracking-tight">Create your account</h1><p className="mt-1 text-sm text-muted-foreground">Set up a workspace profile and start collaborating.</p></div>
      {error && <div role="alert" className="rounded-lg border border-border bg-muted p-3 text-xs text-foreground">{error}</div>}
      <form onSubmit={submit} className="space-y-4"><div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><label className="block space-y-1.5 text-xs font-medium sm:col-span-2">Full Name *<input required autoComplete="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your full name" className={inputClass}/></label><label className="block space-y-1.5 text-xs font-medium sm:col-span-2">Work Email *<input required type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@company.com" className={inputClass}/></label><label className="block space-y-1.5 text-xs font-medium">Department<select value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} className={inputClass}>{['Engineering', 'Management', 'Sales', 'Marketing', 'Support'].map((department) => <option key={department}>{department}</option>)}</select></label><label className="block space-y-1.5 text-xs font-medium">Role<select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} className={inputClass}>{['User', 'Manager', 'Admin'].map((role) => <option key={role}>{role}</option>)}</select></label><label className="block space-y-1.5 text-xs font-medium sm:col-span-2">Password *<input required minLength={8} type="password" autoComplete="new-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="At least 8 characters" className={inputClass}/></label></div>
        <section className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground font-mono text-xs font-semibold text-background">{initials}</span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold">{form.name || 'Your Name'}</span><span className="block truncate text-[10px] text-muted-foreground">{form.email || 'you@company.com'} · {form.department}</span></span><span className="rounded border border-border bg-background px-2 py-1 font-mono text-[9px] uppercase">{form.role}</span></section>
        <button disabled={pending} className="h-10 w-full rounded-md bg-foreground text-xs font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60">{pending ? 'Creating account…' : 'Create Workspace Account'}</button>
      </form><p className="text-center text-xs text-muted-foreground">Already have an account? <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">Sign in</Link></p>
    </div>
  </AuthLayout>;
}
