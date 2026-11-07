'use client';

import { Shield, UserCheck, UserRoundX, Users } from 'lucide-react';

export default function UserKpiSummary({ users = [], loading = false }) {
  const active = users.filter((user) => (user.status || 'active').toLowerCase() === 'active').length;
  const privileged = users.filter((user) => ['admin', 'manager'].includes((user.role || '').toLowerCase())).length;
  const restricted = users.filter((user) => ['suspended', 'inactive', 'restricted'].includes((user.status || '').toLowerCase())).length;
  const cards = [
    { label: 'Total Users', value: users.length, detail: 'Live public.users records', icon: Users },
    { label: 'Active Accounts', value: active, detail: `${users.length ? (active / users.length * 100).toFixed(1) : '0.0'}% of directory`, icon: UserCheck },
    { label: 'Admins & Managers', value: privileged, detail: 'Privileged roles', icon: Shield },
    { label: 'Suspended / Restricted', value: restricted, detail: 'Access limited', icon: UserRoundX },
  ];
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {cards.map(({ label, value, detail, icon: Icon }) => <article key={label} className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3"><p className="min-w-0 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted/70 text-foreground"><Icon size={16} strokeWidth={1.75}/></span></div>
      <p className="mt-3 font-mono text-2xl font-bold tracking-tight text-foreground">{loading ? '…' : value.toLocaleString('en-IN')}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2"><span className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] font-medium text-foreground">LIVE</span><span className="text-xs text-muted-foreground">{detail}</span></div>
    </article>)}
  </div>;
}
