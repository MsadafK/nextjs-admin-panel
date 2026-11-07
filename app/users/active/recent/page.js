'use client';

import { useMemo, useState } from 'react';
import { Search, UserRound } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import UserPageHeader from '@/app/components/Users/UserPageHeader';
import UserKpiSummary from '@/app/components/Users/UserKpiSummary';

const formatDate = (value) => value ? new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Date unavailable';

export default function RecentUserActivityPage() {
  const { users, loading, refreshUsers } = useUsers();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const recentUsers = useMemo(() => [...users].sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0)), [users]);
  const filtered = recentUsers.filter((user) => (!search || `${user.name} ${user.email} ${user.department}`.toLowerCase().includes(search.toLowerCase())) && (role === 'all' || (user.role || 'user').toLowerCase() === role));

  return <div className="page-container mx-auto max-w-7xl space-y-6">
    <UserPageHeader title="Recent User Updates" description="Latest account records ordered by their live database timestamps." loading={loading} onRefresh={refreshUsers} users={filtered}/>
    <UserKpiSummary users={users} loading={loading}/>
    <section className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-muted/20 p-3.5 sm:grid-cols-2"><div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by user, email, or department…" className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-xs text-foreground"/></div><select value={role} onChange={(event) => setRole(event.target.value)} className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground"><option value="all">All Roles</option><option value="admin">Admin</option><option value="manager">Manager</option><option value="user">User</option></select></section>
    <section className="overflow-hidden rounded-xl border border-border bg-card"><div className="flex items-center justify-between border-b border-border px-4 py-3.5"><div><h2 className="text-sm font-semibold text-foreground">Latest User Records</h2><p className="mt-1 text-xs text-muted-foreground">{filtered.length} matching records</p></div><UserRound size={16} className="text-muted-foreground"/></div>{loading ? <p className="p-10 text-center text-sm text-muted-foreground">Loading users…</p> : <div className="w-full overflow-x-auto"><table className="w-full min-w-[720px] border-collapse text-left text-sm"><thead><tr className="border-b border-border bg-muted/40 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"><th className="px-4 py-3">User</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Department</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Joined / Updated</th></tr></thead><tbody className="divide-y divide-border">{filtered.map((user) => <tr key={user.id} className="hover:bg-muted/30"><td className="whitespace-nowrap px-4 py-3"><p className="font-medium text-foreground">{user.name}</p><p className="text-xs text-muted-foreground">{user.email}</p></td><td className="px-4 py-3"><span className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-[11px] uppercase text-foreground">{user.role}</span></td><td className="px-4 py-3 text-xs text-foreground">{user.department || 'General'}</td><td className="px-4 py-3 text-xs text-foreground">{user.status}</td><td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">{formatDate(user.updatedAt || user.createdAt)}</td></tr>)}</tbody></table></div>}</section>
  </div>;
}
