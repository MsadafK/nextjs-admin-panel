'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Pencil, Search, Trash2, UserRound, X } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import UserPageHeader from '@/app/components/Users/UserPageHeader';
import UserKpiSummary from '@/app/components/Users/UserKpiSummary';

const controlClass = 'h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground outline-none transition-colors focus:border-foreground';
const displayDate = (value) => value ? new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

export default function UserListPage() {
  const router = useRouter();
  const { users, loading, error, refreshUsers, editUser, removeUser } = useUsers();
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const filteredUsers = useMemo(() => users.filter((user) => {
    const needle = query.trim().toLowerCase();
    const matchesQuery = !needle || [user.name, user.email, user.department].some((value) => String(value || '').toLowerCase().includes(needle));
    const matchesRole = roleFilter === 'all' || (user.role || 'user').toLowerCase() === roleFilter;
    const status = (user.status || 'active').toLowerCase();
    const matchesStatus = statusFilter === 'all' || status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || (user.department || 'General').toLowerCase() === departmentFilter.toLowerCase();
    return matchesQuery && matchesRole && matchesStatus && matchesDepartment;
  }), [users, query, roleFilter, statusFilter, departmentFilter]);

  const toggleStatus = async (user) => {
    const nextStatus = (user.status || 'active').toLowerCase() === 'suspended' ? 'active' : 'suspended';
    try { await editUser(user.id, { ...user, status: nextStatus }); }
    catch (updateError) { window.alert(`Failed to update status: ${updateError.message}`); }
  };
  const deleteUser = async (user) => {
    if (!window.confirm(`Delete user “${user.name}”?`)) return;
    try { await removeUser(user.id); }
    catch (deleteError) { window.alert(`Failed to delete user: ${deleteError.message}`); }
  };
  const saveUser = async (event) => {
    event.preventDefault();
    if (!selectedUser) return;
    setSubmitting(true);
    try { await editUser(selectedUser.id, selectedUser); setSelectedUser(null); }
    catch (updateError) { window.alert(`Failed to update user: ${updateError.message}`); }
    finally { setSubmitting(false); }
  };

  return <div className="page-container mx-auto max-w-7xl space-y-6">
    <UserPageHeader title="User Directory" description="Manage live accounts synced from public.users." loading={loading} onRefresh={refreshUsers} users={filteredUsers}/>
    {error && <div role="alert" className="rounded-lg border border-border bg-muted p-4 text-sm text-foreground">{error}</div>}
    <UserKpiSummary users={users} loading={loading}/>

    <section aria-label="User filters" className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-muted/20 p-3.5 sm:grid-cols-2 xl:grid-cols-4">
      <div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/><input aria-label="Search users" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, email, or department..." className={`${controlClass} pl-9`}/></div>
      <select aria-label="Filter by role" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className={controlClass}><option value="all">All Roles</option><option value="admin">Admin</option><option value="manager">Manager</option><option value="user">User</option></select>
      <select aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className={controlClass}><option value="all">All Statuses</option><option value="active">Active</option><option value="suspended">Suspended</option></select>
      <select aria-label="Filter by department" value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)} className={controlClass}><option value="all">All Departments</option><option>Engineering</option><option>Management</option><option>Marketing</option><option>Support</option><option>General</option></select>
    </section>

    <section className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3.5"><div><h2 className="text-sm font-semibold text-foreground">Directory</h2><p className="mt-0.5 text-xs text-muted-foreground">{filteredUsers.length} matching accounts</p></div><span className="rounded border border-border bg-muted px-2 py-1 font-mono text-[10px] text-foreground">LIVE DATA</span></div>
      {loading ? <div className="p-12 text-center text-sm text-muted-foreground">Loading users…</div> : filteredUsers.length === 0 ? <div className="p-12 text-center text-sm text-muted-foreground">No users match the selected filters.</div> : <div className="w-full overflow-x-auto"><table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead><tr className="border-b border-border bg-muted/40 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"><th className="px-4 py-3">User</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Department</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Joined / Updated</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
        <tbody className="divide-y divide-border">{filteredUsers.map((user) => {
          const status = (user.status || 'active').toLowerCase();
          const active = status === 'active';
          const initials = (user.name || user.email || 'U').split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
          return <tr key={user.id} className="transition-colors hover:bg-muted/30">
            <td className="px-4 py-3.5"><div className="flex items-center gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground font-mono text-xs font-semibold text-background">{initials}</span><span><span className="block whitespace-nowrap font-medium text-foreground">{user.name}</span><span className="block whitespace-nowrap text-xs text-muted-foreground">{user.email}</span></span></div></td>
            <td className="whitespace-nowrap px-4 py-3.5"><span className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-[11px] uppercase text-foreground">{user.role || 'User'}</span></td>
            <td className="whitespace-nowrap px-4 py-3.5 text-xs text-foreground">{user.department || 'General'}</td>
            <td className="whitespace-nowrap px-4 py-3.5"><span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-medium ${active ? 'bg-foreground text-background' : 'border border-border bg-muted text-muted-foreground line-through'}`}><span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-background' : 'bg-muted-foreground'}`}/>{active ? 'Active' : status === 'suspended' ? 'Suspended' : user.status}</span></td>
            <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs text-muted-foreground">{displayDate(user.updatedAt || user.createdAt)}</td>
            <td className="whitespace-nowrap px-4 py-3.5"><div className="flex justify-end gap-1.5"><button type="button" onClick={() => setSelectedUser({ ...user })} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium text-foreground hover:bg-muted"><Pencil size={13}/>Edit</button><button type="button" onClick={() => toggleStatus(user)} className="h-8 rounded-md border border-border px-2.5 text-xs font-medium text-foreground hover:bg-muted">{active ? 'Suspend' : 'Activate'}</button><button type="button" onClick={() => deleteUser(user)} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium text-foreground hover:bg-muted"><Trash2 size={13}/>Delete</button></div></td>
          </tr>;
        })}</tbody>
      </table></div>}
    </section>

    {selectedUser && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedUser(null); }}><form onSubmit={saveUser} className="max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-xl border border-border bg-background p-5 shadow-2xl sm:p-6">
      <div className="mb-5 flex items-center justify-between border-b border-border pb-4"><div><h2 className="text-lg font-semibold text-foreground">Edit User</h2><p className="mt-1 text-xs text-muted-foreground">Changes save directly to public.users.</p></div><button type="button" onClick={() => setSelectedUser(null)} aria-label="Close edit user" className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted"><X size={15}/></button></div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2"><label className="space-y-1.5 text-xs font-medium text-foreground">Full Name<input required value={selectedUser.name || ''} onChange={(event) => setSelectedUser({ ...selectedUser, name: event.target.value })} className={controlClass}/></label><label className="space-y-1.5 text-xs font-medium text-foreground">Email Address<input type="email" required value={selectedUser.email || ''} onChange={(event) => setSelectedUser({ ...selectedUser, email: event.target.value })} className={controlClass}/></label><label className="space-y-1.5 text-xs font-medium text-foreground">Role<select value={(selectedUser.role || 'user').toLowerCase()} onChange={(event) => setSelectedUser({ ...selectedUser, role: event.target.value })} className={controlClass}><option value="admin">Admin</option><option value="manager">Manager</option><option value="user">User</option></select></label><label className="space-y-1.5 text-xs font-medium text-foreground">Department<select value={selectedUser.department || 'General'} onChange={(event) => setSelectedUser({ ...selectedUser, department: event.target.value })} className={controlClass}><option>Engineering</option><option>Management</option><option>Marketing</option><option>Support</option><option>General</option></select></label><label className="space-y-1.5 text-xs font-medium text-foreground">Status<select value={(selectedUser.status || 'active').toLowerCase()} onChange={(event) => setSelectedUser({ ...selectedUser, status: event.target.value })} className={controlClass}><option value="active">Active</option><option value="suspended">Suspended</option></select></label></div>
      <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-border pt-4"><button type="button" onClick={() => setSelectedUser(null)} className="h-9 rounded-md border border-border px-4 text-xs font-medium text-foreground hover:bg-muted">Cancel</button><button type="submit" disabled={submitting} className="inline-flex h-9 items-center gap-2 rounded-md bg-foreground px-5 text-xs font-medium text-background disabled:opacity-60"><Check size={14}/>{submitting ? 'Saving…' : 'Save User'}</button></div>
    </form></div>}
  </div>;
}
