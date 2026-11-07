'use client';

import { useMemo, useState } from 'react';
import { Check, Minus, Search, Shield, Users } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import UserPageHeader from '@/app/components/Users/UserPageHeader';
import UserKpiSummary from '@/app/components/Users/UserKpiSummary';

const ROLES = ['admin', 'manager', 'user'];
const CAPABILITIES = [
  { key: 'view', label: 'View directory' },
  { key: 'create', label: 'Create accounts' },
  { key: 'edit', label: 'Edit profiles' },
  { key: 'assign', label: 'Assign roles' },
  { key: 'delete', label: 'Suspend / remove' },
];
const access = { admin: ['view', 'create', 'edit', 'assign', 'delete'], manager: ['view', 'create', 'edit'], user: ['view'] };
const titleCase = (value) => value.charAt(0).toUpperCase() + value.slice(1);

export default function UserPermissionsPage() {
  const { users, loading, refreshUsers, editUser } = useUsers();
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');
  const roleCounts = useMemo(() => Object.fromEntries(ROLES.map((role) => [role, users.filter((user) => (user.role || 'user').toLowerCase() === role).length])), [users]);
  const filtered = users.filter((user) => `${user.name} ${user.email} ${user.department}`.toLowerCase().includes(search.toLowerCase()));

  const assignRole = async (user, role) => {
    setUpdatingId(user.id); setError('');
    try { await editUser(user.id, { ...user, role }); }
    catch (updateError) { setError(updateError.message || 'Unable to update role.'); }
    finally { setUpdatingId(null); }
  };

  return <div className="page-container mx-auto max-w-7xl space-y-6">
    <UserPageHeader title="User Roles & Permissions" description="Role assignments and capabilities based on live public.users records." loading={loading} onRefresh={refreshUsers} users={users}/>
    <UserKpiSummary users={users} loading={loading}/>
    {error && <p role="alert" className="rounded-lg border border-border bg-muted p-3 text-sm text-foreground">{error}</p>}

    <section className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center gap-3 border-b border-border px-4 py-4"><span className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-muted text-foreground"><Shield size={16}/></span><div><h2 className="text-sm font-semibold text-foreground">Role Breakdown Matrix</h2><p className="mt-1 text-xs text-muted-foreground">Current user totals and baseline access capabilities by role.</p></div></div>
      <div className="w-full overflow-x-auto"><table className="w-full min-w-[720px] border-collapse text-left text-sm"><thead><tr className="border-b border-border bg-muted/40 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"><th className="px-4 py-3">Role</th><th className="px-4 py-3">Members</th>{CAPABILITIES.map((capability) => <th key={capability.key} className="px-3 py-3 text-center">{capability.label}</th>)}</tr></thead><tbody className="divide-y divide-border">{ROLES.map((role) => <tr key={role}><td className="px-4 py-3"><span className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-[11px] uppercase text-foreground">{titleCase(role)}</span></td><td className="px-4 py-3 font-mono text-foreground">{loading ? '…' : roleCounts[role]}</td>{CAPABILITIES.map((capability) => { const granted = access[role].includes(capability.key); return <td key={capability.key} className="px-3 py-3 text-center">{granted ? <Check size={15} className="mx-auto text-foreground"/> : <Minus size={15} className="mx-auto text-muted-foreground"/>}</td>; })}</tr>)}</tbody></table></div>
    </section>

    <section className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-2"><Users size={16} className="text-muted-foreground"/><div><h2 className="text-sm font-semibold text-foreground">Role Assignments</h2><p className="mt-0.5 text-xs text-muted-foreground">Change a role and save directly to Supabase.</p></div></div><div className="relative w-full sm:max-w-xs"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search users…" className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-xs text-foreground"/></div></div>
      <div className="w-full overflow-x-auto"><table className="w-full min-w-[620px] border-collapse text-left text-sm"><thead><tr className="border-b border-border bg-muted/40 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"><th className="px-4 py-3">User</th><th className="px-4 py-3">Department</th><th className="px-4 py-3">Role Assignment</th><th className="px-4 py-3">Capabilities</th></tr></thead><tbody className="divide-y divide-border">{filtered.map((user) => { const role = (user.role || 'user').toLowerCase(); return <tr key={user.id}><td className="whitespace-nowrap px-4 py-3"><p className="font-medium text-foreground">{user.name}</p><p className="text-xs text-muted-foreground">{user.email}</p></td><td className="whitespace-nowrap px-4 py-3 text-xs text-foreground">{user.department || 'General'}</td><td className="px-4 py-3"><select aria-label={`Role for ${user.name}`} disabled={updatingId === user.id} value={role} onChange={(event) => assignRole(user, event.target.value)} className="h-9 rounded-md border border-border bg-background px-3 text-xs text-foreground"><option value="admin">Admin</option><option value="manager">Manager</option><option value="user">User</option></select></td><td className="px-4 py-3 text-xs text-muted-foreground">{access[role]?.length || 1} of {CAPABILITIES.length} baseline capabilities</td></tr>; })}</tbody></table></div>
      {!loading && filtered.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">No users match this search.</p>}
    </section>
  </div>;
}
