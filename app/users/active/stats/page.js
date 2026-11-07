'use client';

import { useMemo, useState } from 'react';
import { Search, Users } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import UserPageHeader from '@/app/components/Users/UserPageHeader';
import UserKpiSummary from '@/app/components/Users/UserKpiSummary';

const distribution = (users, field, fallback) => Object.entries(users.reduce((counts, user) => { const key = user[field] || fallback; counts[key] = (counts[key] || 0) + 1; return counts; }, {})).sort((a, b) => b[1] - a[1]);

export default function UserEngagementStatsPage() {
  const { users, loading, refreshUsers } = useUsers();
  const [search, setSearch] = useState('');
  const activeCount = users.filter((user) => (user.status || 'active').toLowerCase() === 'active').length;
  const departments = useMemo(() => distribution(users, 'department', 'General'), [users]);
  const roles = useMemo(() => distribution(users, 'role', 'User'), [users]);
  const filtered = users.filter((user) => `${user.name} ${user.email} ${user.department}`.toLowerCase().includes(search.toLowerCase()));

  return <div className="page-container mx-auto max-w-7xl space-y-6">
    <UserPageHeader title="User Engagement & Breakdown" description="Live account distribution by department, role, and status." loading={loading} onRefresh={refreshUsers} users={users}/>
    <UserKpiSummary users={users} loading={loading}/>
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-3"><section className="rounded-xl border border-border bg-card p-5 xl:col-span-2"><h2 className="text-sm font-semibold text-foreground">Department Breakdown</h2><p className="mt-1 text-xs text-muted-foreground">Active accounts: {activeCount} of {users.length}</p><div className="mt-5 space-y-4">{departments.map(([name, count]) => <div key={name}><div className="mb-1.5 flex justify-between gap-3 text-xs"><span className="text-foreground">{name}</span><span className="font-mono text-muted-foreground">{count} · {users.length ? (count / users.length * 100).toFixed(1) : '0.0'}%</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-foreground" style={{ width: `${users.length ? count / users.length * 100 : 0}%` }}/></div></div>)}</div></section>
      <section className="rounded-xl border border-border bg-card p-5"><h2 className="text-sm font-semibold text-foreground">Role Breakdown</h2><p className="mt-1 text-xs text-muted-foreground">Members per assigned role</p><div className="mt-4 space-y-2">{roles.map(([name, count]) => <div key={name} className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-3"><span className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-[10px] uppercase text-foreground">{name}</span><span className="font-mono text-sm font-semibold text-foreground">{count}</span></div>)}</div></section></div>
    <section className="overflow-hidden rounded-xl border border-border bg-card"><div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-2"><Users size={16} className="text-muted-foreground"/><div><h2 className="text-sm font-semibold text-foreground">User Directory</h2><p className="mt-1 text-xs text-muted-foreground">Live user records ({filtered.length})</p></div></div><div className="relative w-full sm:max-w-xs"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search users…" className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-xs text-foreground"/></div></div><div className="w-full overflow-x-auto"><table className="w-full min-w-[640px] border-collapse text-left text-sm"><thead><tr className="border-b border-border bg-muted/40 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"><th className="px-4 py-3">User</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Department</th><th className="px-4 py-3">Status</th></tr></thead><tbody className="divide-y divide-border">{filtered.map((user) => <tr key={user.id}><td className="whitespace-nowrap px-4 py-3"><p className="font-medium text-foreground">{user.name}</p><p className="text-xs text-muted-foreground">{user.email}</p></td><td className="px-4 py-3"><span className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-[11px] uppercase text-foreground">{user.role}</span></td><td className="px-4 py-3 text-xs text-foreground">{user.department || 'General'}</td><td className="px-4 py-3 text-xs text-foreground">{user.status}</td></tr>)}</tbody></table></div>{!loading && filtered.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">No users found.</p>}</section>
  </div>;
}
