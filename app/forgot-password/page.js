'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Mail } from 'lucide-react';
import AuthLayout from '@/app/components/Auth/AuthLayout';
import { supabase } from '@/lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const submit = async (event) => {
    event.preventDefault(); setPending(true); setError('');
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/login` });
      if (resetError) throw resetError;
      setSent(true);
    } catch (resetError) { setError(resetError.message || 'Could not request a password reset.'); }
    finally { setPending(false); }
  };

  return <AuthLayout eyebrow="ACCOUNT RECOVERY">
    <div className="space-y-5"><div className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-muted"><Mail size={18}/></div><div><h1 className="text-2xl font-semibold tracking-tight">Forgot your password?</h1><p className="mt-1 text-sm text-muted-foreground">Enter your account email and we’ll send a reset link if it’s registered with Supabase Auth.</p></div>
      {error && <div role="alert" className="rounded-lg border border-border bg-muted p-3 text-xs">{error}</div>}
      {sent ? <div role="status" className="rounded-lg border border-border bg-muted p-4"><p className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 size={16}/>Reset request sent</p><p className="mt-2 text-xs text-muted-foreground">If this email has an Auth account, a reset message is on its way. Check your inbox and spam folder.</p></div> : <form onSubmit={submit} className="space-y-4"><label className="block space-y-1.5 text-xs font-medium">Email Address<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground"/></label><button disabled={pending} className="h-10 w-full rounded-md bg-foreground text-xs font-medium text-background hover:opacity-90 disabled:opacity-60">{pending ? 'Sending…' : 'Send Reset Link'}</button></form>}
      <p className="text-center text-xs text-muted-foreground"><Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">← Back to sign in</Link></p>
    </div>
  </AuthLayout>;
}
