'use client';

import { Lock, Shield } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';

export default function RbacStatusBanner() {
  const { currentUser, isAdmin, isManager, switchDemoRole } = useAuth();
  if (isAdmin || !currentUser) return null;

  const role = isManager ? 'MANAGER' : 'USER';
  const description = isManager
    ? ' — Some destructive actions and role changes require Admin privileges.'
    : ' (Read-Only Mode) — Destructive actions require Admin privileges.';

  return <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted/50 px-3.5 py-3 text-xs text-foreground">
    <p className="flex min-w-0 items-center gap-2"><Lock size={14} className="shrink-0"/><span>Viewing as {role}{description}</span></p>
    <button type="button" onClick={() => switchDemoRole({ name: 'John Doe', email: 'john@nexstore.com', role: 'Admin', department: 'Management', initials: 'JD' })} className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 font-medium text-foreground hover:bg-muted"><Shield size={13}/>Switch to Admin</button>
  </div>;
}
