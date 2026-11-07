'use client';

import { useMemo, useState } from 'react';
import { MessageSquare, Search, UserCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUsers } from '@/hooks/useUsers';
import UserPageHeader from '@/app/components/Users/UserPageHeader';
import UserKpiSummary from '@/app/components/Users/UserKpiSummary';

const controlClass = 'h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground';

export default function OnlineUsersPage() {
  const router = useRouter();
  const { users, loading, refreshUsers } = useUsers();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [department, setDepartment] = useState('all');
  const activeUsers = users.filter((user) => (user.status || 'active').toLowerCase() === 'active');
  const filtered = useMemo(() => activeUsers.filter((user) => {
    const q = search.toLowerCase();
    return (!q || `${user.name} ${user.email} ${user.department}`.toLowerCase().includes(q)) && (role === 'all' || (user.role || 'user').toLowerCase() === role) && (department === 'all' || (user.department || 'General').toLowerCase() === department.toLowerCase());
  }), [activeUsers, search, role, department]);

  return <div className="page-container mx-auto max-w-7xl space-y-6">
    <UserPageHeader title="Active Users" description="Accounts currently marked active in the live users directory." loading={loading} onRefresh={refreshUsers} users={activeUsers}/>
    <UserKpiSummary users={users} loading={loading}/>
    <section className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-muted/20 p-3.5 sm:grid-cols-2 xl:grid-cols-4"><div className="relative xl:col-span-2"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search active users…" className={`${controlClass} pl-9`}/></div><select value={role} onChange={(event) => setRole(event.target.value)} className={controlClass}><option value="all">All Roles</option><option value="admin">Admin</option><option value="manager">Manager</option><option value="user">User</option></select><select value={department} onChange={(event) => setDepartment(event.target.value)} className={controlClass}><option value="all">All Departments</option><option>Engineering</option><option>Management</option><option>Marketing</option><option>Support</option><option>General</option></select></section>
    <section className="overflow-hidden rounded-xl border border-border bg-card"><div className="flex items-center justify-between border-b border-border px-4 py-3.5"><div><h2 className="text-sm font-semibold text-foreground">Active Accounts</h2><p className="mt-1 text-xs text-muted-foreground">{filtered.length} matching active users</p></div><UserCheck size={16} className="text-muted-foreground"/></div>
      {loading ? <p className="p-10 text-center text-sm text-muted-foreground">Loading users…</p> : filtered.length ? <div className="w-full overflow-x-auto"><table className="w-full min-w-[680px] border-collapse text-left text-sm"><thead><tr className="border-b border-border bg-muted/40 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"><th className="px-4 py-3">User</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Department</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Quick Action</th></tr></thead><tbody className="divide-y divide-border">{filtered.map((user) => <tr key={user.id} className="hover:bg-muted/30"><td className="whitespace-nowrap px-4 py-3"><p className="font-medium text-foreground">{user.name}</p><p className="text-xs text-muted-foreground">{user.email}</p></td><td className="px-4 py-3"><span className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-[11px] uppercase text-foreground">{user.role}</span></td><td className="px-4 py-3 text-xs text-foreground">{user.department || 'General'}</td><td className="px-4 py-3"><span className="rounded-full bg-foreground px-2 py-1 text-[11px] font-medium text-background">Active</span></td><td className="px-4 py-3 text-right"><button onClick={() => router.push('/messages/compose')} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium text-foreground hover:bg-muted"><MessageSquare size={13}/>Message</button></td></tr>)}</tbody></table></div> : <p className="p-10 text-center text-sm text-muted-foreground">No active users match these filters.</p>}
    </section>
  </div>;
}
