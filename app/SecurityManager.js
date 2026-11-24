'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Activity, Download, KeyRound, Lock, RefreshCw, Search, Shield, Users, UserX, Bell } from 'lucide-react';
import { securityService } from '@/services/securityService';
import { useAuth } from '@/app/contexts/AuthContext';
import RbacStatusBanner from '@/app/components/RbacStatusBanner';
import { useToast } from '@/app/contexts/ToastContext';

const TITLES = {
  'audit/security': 'Security Audit Logs', 'audit/system': 'System Audit Logs', 'audit/users': 'User Audit Logs',
  'permissions/roles': 'Role Management', 'permissions/users': 'User Permissions', 'permissions/access': 'Access Controls',
  'api-keys/active': 'Active API Keys', 'api-keys/usage': 'API Key Usage', 'api-keys/generate': 'Generate API Key',
};
const csvValue = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
const exportRows = (rows) => {
  if (!rows.length) return;
  const keys = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  const csv = [keys.map(csvValue).join(','), ...rows.map((row) => keys.map((key) => csvValue(row[key])).join(','))].join('\r\n');
  const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a'); link.href = url; link.download = 'security-report.csv'; link.click(); URL.revokeObjectURL(url);
};

export default function SecurityManager({ mode }) {
  const { isAdmin, isManager } = useAuth();
  const { pushToast } = useToast();
  const [data, setData] = useState({ users: [], auditLogs: [], notifications: [], apiKeys: [], permissions: [], errors: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [error, setError] = useState('');
  const [permissionForm, setPermissionForm] = useState({ userId: '', permissionName: '', resourceType: 'calendar', accessLevel: 'view' });
  const [keyForm, setKeyForm] = useState({ keyName: '', scope: 'read', environment: 'development' });
  const [createdSecret, setCreatedSecret] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    try { setData(await securityService.getSecurityData()); }
    catch (err) { setError(err.message || 'Could not load security data.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    if (!permissionForm.userId && data.users.length) setPermissionForm((current) => ({ ...current, userId: data.users[0].id }));
  }, [data.users, permissionForm.userId]);

  const userMap = useMemo(() => new Map(data.users.map((user) => [String(user.id), user])), [data.users]);
  const auditRows = useMemo(() => data.auditLogs.map((log) => ({
    id: log.id, Date: log.created_at || '', User: userMap.get(String(log.user_id))?.full_name || userMap.get(String(log.user_id))?.email || 'System',
    Action: log.action || '', Resource: log.resource_type || '', Severity: log.severity || 'info', IP: log.ip_address || '',
  })).sort((a, b) => String(b.Date).localeCompare(String(a.Date))), [data.auditLogs, userMap]);
  const permissionRows = data.permissions.map((permission) => ({
    id: permission.id, User: userMap.get(String(permission.user_id))?.full_name || userMap.get(String(permission.user_id))?.email || 'Unknown',
    Permission: permission.permission_name || '', Resource: permission.resource_type || '', Access: permission.access_level || '', Granted: permission.granted_at || '',
  }));
  const keyRows = data.apiKeys.map((key) => ({
    id: key.id, Name: key.key_name || '', Prefix: key.prefix || '', Scope: key.scope || '', Environment: key.environment || '',
    Status: key.is_revoked ? 'Revoked' : 'Active', 'Last Used': key.last_used || '', Created: key.created_at || '',
  }));
  const securityNotifications = data.notifications.map((notification) => ({
    id: notification.id, Date: notification.createdAt || '', Title: notification.title || '', Type: notification.type || '',
    Status: notification.isRead ? 'Read' : 'Unread',
  }));

  const family = mode.startsWith('audit/') ? 'audit' : mode.startsWith('permissions/') ? 'permissions' : 'api-keys';
  const hasPermissionActions = family === 'permissions' && mode !== 'permissions/roles';
  let rows = family === 'audit' ? auditRows : family === 'permissions' ? permissionRows : keyRows;
  if (mode === 'audit/security') rows = auditRows.filter((row) => /critical|error|warning/i.test(row.Severity));
  if (mode === 'audit/users') rows = auditRows.filter((row) => row.User !== 'System');
  if (mode === 'permissions/roles') rows = data.users.map((user) => ({ id: user.id, Name: user.full_name || user.email, Email: user.email, Role: user.role || 'user', Status: user.status || 'active', Department: user.department || 'General' }));
  if (mode === 'permissions/users') rows = permissionRows;
  if (mode === 'permissions/access') rows = permissionRows;
  if (mode === 'api-keys/active') rows = keyRows.filter((row) => row.Status === 'Active');
  if (mode === 'api-keys/usage') rows = keyRows.filter((row) => row['Last Used']);
  if (mode === 'api-keys/generate') rows = keyRows;
  if (mode === 'audit/system') rows = [...auditRows, ...securityNotifications.map((row) => ({ ...row, Action: row.Title, Resource: 'Notification', Severity: row.Type }))];
  const filteredRows = rows.filter((row) => {
    const text = Object.values(row).join(' ').toLowerCase();
    return text.includes(search.toLowerCase())
      && (statusFilter === 'all' || text.includes(statusFilter))
      && (roleFilter === 'all' || text.includes(roleFilter));
  });

  const activeKeys = data.apiKeys.filter((key) => !key.is_revoked).length;
  const revokedKeys = data.apiKeys.length - activeKeys;
  const severeLogs = data.auditLogs.filter((log) => /critical|error/i.test(log.severity || '')).length;
  const warningLogs = data.auditLogs.filter((log) => /warning/i.test(log.severity || '')).length;
  const noPermissions = data.users.filter((user) => !data.permissions.some((permission) => String(permission.user_id) === String(user.id))).length;
  const kpis = [
    ['Total Audit Events', data.auditLogs.length, Activity],
    ['Privileged Admins / Managers', data.users.filter((user) => /admin|manager/i.test(user.role || '')).length, Users],
    ['Suspended / Restricted Accounts', data.users.filter((user) => /suspend|inactive|restrict/i.test(user.status || '')).length, UserX],
    ['Unread Security Alerts', data.notifications.filter((item) => !item.isRead && /security|alert|critical|warning/i.test(`${item.type} ${item.title}`)).length, Bell],
  ];

  const columns = filteredRows.length ? Object.keys(filteredRows[0]).filter((key) => key !== 'id') : [];
  const updateUserField = async (user, field, value) => {
    if (field === 'role' && !isAdmin) return;
    if (field === 'status' && !isAdmin) return;
    setError('');
    const updater = field === 'role' ? securityService.updateUserRole : securityService.updateUserStatus;
    try {
      await updater(user.id, value);
      await refresh();
      if (field === 'status') pushToast({ title: value === 'suspended' ? 'User suspended' : 'User status updated', subtitle: user.full_name || user.email, onUndo: async () => { await updater(user.id, user.status || 'active'); await refresh(); } });
    }
    catch (err) { setError(err.message || 'Could not update user access.'); }
  };
  const savePermission = async (event) => {
    if (!isAdmin) return;
    event.preventDefault(); setError('');
    try { await securityService.savePermission({ userId: permissionForm.userId, permissionName: permissionForm.permissionName, resourceType: permissionForm.resourceType, accessLevel: permissionForm.accessLevel }); await refresh(); }
    catch (err) { setError(err.message || 'Could not save permission.'); }
  };
  const createKey = async (event) => {
    event.preventDefault(); setError(''); setCreatedSecret('');
    if (!isManager) return;
    try {
      const admin = data.users.find((user) => user.role === 'admin') || data.users[0];
      const created = await securityService.createApiKey({ ...keyForm, createdBy: admin?.id || null });
      setCreatedSecret(created.secret); setKeyForm((current) => ({ ...current, keyName: '' })); await refresh();
    } catch (err) { setError(err.message || 'Could not create API key.'); }
  };
  const revoke = async (id) => {
    if (!isAdmin) return;
    setError('');
    try { await securityService.revokeApiKey(id); await refresh(); }
    catch (err) { setError(err.message || 'Could not revoke API key.'); }
  };
  const removePermission = async (id) => {
    if (!isAdmin) return;
    setError('');
    try { await securityService.removePermission(id); await refresh(); }
    catch (err) { setError(err.message || 'Could not remove permission.'); }
  };
  const logSecurityCheck = async () => {
    setError('');
    try { await securityService.logSecurityCheck(); await refresh(); }
    catch (err) { setError(err.message || 'Could not log security check.'); }
  };
  const resetFilters = () => { setSearch(''); setStatusFilter('all'); setRoleFilter('all'); };
  const roleOptions = [...new Set(data.users.map((user) => String(user.role || '').toLowerCase()).filter(Boolean))];

  return <div className="mx-auto min-h-full max-w-7xl space-y-5 bg-background p-4 text-foreground sm:p-6">
    <header className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight sm:text-2xl">{TITLES[mode] || 'Security'}<span className="h-2 w-2 rounded-full bg-foreground" title="Live Supabase data"/></h1><p className="mt-1 text-sm text-muted-foreground">Live users, permissions, audit logs, notifications, and API keys.</p></div><div className="flex flex-wrap gap-2"><button onClick={refresh} disabled={loading} className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3.5 text-xs font-medium hover:bg-muted"><RefreshCw size={14} className={loading ? 'animate-spin' : ''}/>Refresh</button><button onClick={logSecurityCheck} className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3.5 text-xs font-medium hover:bg-muted"><Shield size={14}/>Log Security Check</button><button onClick={() => exportRows(filteredRows)} disabled={!filteredRows.length} className="inline-flex h-9 items-center gap-2 rounded-md bg-foreground px-3.5 text-xs font-medium text-background"><Download size={14}/>Export CSV</button></div></header>
    <RbacStatusBanner/>
    {(error || data.errors.length > 0) && <div role="status" className="rounded-md border border-border bg-muted p-3 text-sm">{error} {data.errors.join(' ')}</div>}
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{kpis.map(([label, value, Icon]) => <article key={label} className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5"><div className="flex items-start justify-between gap-2"><p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted/70 text-foreground"><Icon size={15}/></span></div><p className="mt-3 break-words font-mono text-2xl font-bold tracking-tight">{value.toLocaleString('en-IN')}</p><span className="mt-3 inline-flex rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] uppercase">LIVE</span></article>)}</section>
    {mode === 'permissions/access' && <form onSubmit={savePermission} className="grid grid-cols-1 gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-2 xl:grid-cols-5"><select required value={permissionForm.userId} onChange={(event) => setPermissionForm({ ...permissionForm, userId: event.target.value })} className="h-9 min-w-0 rounded-md border border-border bg-background px-3 text-xs">{data.users.map((user) => <option key={user.id} value={user.id}>{user.full_name || user.email}</option>)}</select><input required placeholder="Permission name" value={permissionForm.permissionName} onChange={(event) => setPermissionForm({ ...permissionForm, permissionName: event.target.value })} className="h-9 min-w-0 rounded-md border border-border bg-background px-3 text-xs"/><input required placeholder="Resource" value={permissionForm.resourceType} onChange={(event) => setPermissionForm({ ...permissionForm, resourceType: event.target.value })} className="h-9 min-w-0 rounded-md border border-border bg-background px-3 text-xs"/><select value={permissionForm.accessLevel} onChange={(event) => setPermissionForm({ ...permissionForm, accessLevel: event.target.value })} className="h-9 min-w-0 rounded-md border border-border bg-background px-3 text-xs">{['view', 'create', 'edit', 'delete', 'admin'].map((value) => <option key={value}>{value}</option>)}</select><button disabled={!isAdmin} title={!isAdmin ? 'Requires Admin privileges' : undefined} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-foreground px-4 text-xs text-background disabled:cursor-not-allowed disabled:opacity-50">{!isAdmin && <Lock size={12}/>}Save Permission</button></form>}
    {mode === 'api-keys/generate' && <form onSubmit={createKey} className="grid grid-cols-1 gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-2 xl:grid-cols-4"><input required placeholder="Key name" value={keyForm.keyName} onChange={(event) => setKeyForm({ ...keyForm, keyName: event.target.value })} className="h-9 min-w-0 rounded-md border border-border bg-background px-3 text-xs"/><select value={keyForm.scope} onChange={(event) => setKeyForm({ ...keyForm, scope: event.target.value })} className="h-9 min-w-0 rounded-md border border-border bg-background px-3 text-xs">{['read', 'write', 'full'].map((value) => <option key={value}>{value}</option>)}</select><select value={keyForm.environment} onChange={(event) => setKeyForm({ ...keyForm, environment: event.target.value })} className="h-9 min-w-0 rounded-md border border-border bg-background px-3 text-xs">{['development', 'staging', 'production'].map((value) => <option key={value}>{value}</option>)}</select><button disabled={!isManager} title={!isManager ? 'Requires Manager or Admin privileges' : undefined} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-foreground px-4 text-xs text-background disabled:cursor-not-allowed disabled:opacity-50">{!isManager && <Lock size={12}/>}Generate Key</button>{createdSecret && <p className="break-all rounded-md border border-border bg-muted p-3 text-sm sm:col-span-2 xl:col-span-4"><KeyRound className="mr-2 inline" size={16}/>Copy this key now: <strong>{createdSecret}</strong></p>}</form>}
    <section className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-muted/20 p-3.5 sm:grid-cols-2 xl:grid-cols-4"><div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/><input aria-label="Search security data" placeholder="Search users, actions, keys, or audit events" value={search} onChange={(event) => setSearch(event.target.value)} className="h-9 w-full rounded-md border border-border bg-background px-3 pl-9 text-xs text-foreground"/></div><select aria-label="Severity or status filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground"><option value="all">All Severity / Status</option>{['critical', 'error', 'warning', 'info', 'active', 'suspended', 'revoked'].map((value) => <option key={value} value={value}>{value}</option>)}</select><select aria-label="Role or event type filter" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground"><option value="all">All Roles / Event Types</option>{roleOptions.map((role) => <option key={role} value={role}>{role}</option>)}{['security', 'user', 'system', 'api'].map((value) => <option key={value} value={value}>{value}</option>)}</select><button type="button" onClick={resetFilters} className="h-9 rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground hover:bg-muted">Reset Filters</button></section>
    {mode === 'permissions/roles' && <section className="grid gap-3 md:grid-cols-2">{data.users.map((user) => <article key={user.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4"><div><h2 className="font-medium">{user.full_name || user.email}</h2><p className="text-sm text-muted-foreground">{user.department || 'General'} · {user.email}</p></div><label className="text-sm">Role<select disabled={!isAdmin} title={!isAdmin ? 'Requires Admin privileges' : undefined} value={user.role || 'user'} onChange={(event) => updateUserField(user, 'role', event.target.value)} className="ml-2 rounded-md border border-border bg-background px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50">{['admin', 'manager', 'user'].map((role) => <option key={role}>{role}</option>)}</select>{!isAdmin && <Lock size={12} className="ml-1 inline"/>}</label></article>)}</section>}
    {mode === 'permissions/users' && <section className="grid gap-3 md:grid-cols-2">{data.users.map((user) => <article key={user.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4"><div><h2 className="font-medium">{user.full_name || user.email}</h2><p className="text-sm text-muted-foreground">{user.email} · {user.role}</p></div><label className="text-sm">Status<select disabled={!isAdmin} title={!isAdmin ? 'Requires Admin privileges' : undefined} value={user.status || 'active'} onChange={(event) => updateUserField(user, 'status', event.target.value)} className="ml-2 rounded-md border border-border bg-background px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50">{['active', 'inactive', 'suspended'].map((status) => <option key={status}>{status}</option>)}</select>{!isAdmin && <Lock size={12} className="ml-1 inline"/>}</label></article>)}</section>}
    <section className="overflow-hidden rounded-xl border border-border bg-card"><div className="flex items-center justify-between gap-3 border-b border-border p-4"><div className="flex items-center gap-2"><Shield size={18}/><div><h2 className="font-semibold">{TITLES[mode]} Records</h2><p className="text-sm text-muted-foreground">{filteredRows.length} live records</p></div></div><span className="rounded border border-border bg-muted px-2 py-1 font-mono text-[10px] uppercase">{loading ? 'Syncing' : 'Live Data'}</span></div><div className="w-full overflow-x-auto"><table className="w-full min-w-[780px] border-collapse text-left text-sm"><thead className="bg-muted text-muted-foreground"><tr>{columns.map((column) => <th key={column} className="whitespace-nowrap px-4 py-3 font-medium">{column}</th>)}{(family === 'api-keys' || hasPermissionActions) && <th className="whitespace-nowrap px-4 py-3 font-medium">Action</th>}</tr></thead><tbody className="divide-y divide-border">{filteredRows.map((row) => <tr key={row.id}>{columns.map((column) => <td key={column} className="whitespace-nowrap px-4 py-3">{column.toLowerCase().includes('date') || column === 'Created' || column === 'Granted' || column === 'Last Used' ? (row[column] ? new Date(row[column]).toLocaleString() : '—') : row[column] ?? '—'}</td>)}{(family === 'api-keys' || hasPermissionActions) && <td className="whitespace-nowrap px-4 py-3">{family === 'api-keys' ? row.Status === 'Active' && <button disabled={!isAdmin} title={!isAdmin ? 'Requires Admin privileges' : undefined} onClick={() => revoke(row.id)} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50">{!isAdmin && <Lock size={12}/>}Revoke</button> : <button disabled={!isAdmin} title={!isAdmin ? 'Requires Admin privileges' : undefined} onClick={() => removePermission(row.id)} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50">{!isAdmin && <Lock size={12}/>}Remove</button>}</td>}</tr>)}{!filteredRows.length && <tr><td colSpan={columns.length + (family === 'api-keys' || hasPermissionActions ? 1 : 0)} className="px-4 py-10 text-center text-muted-foreground">{loading ? 'Loading records…' : 'No live records found.'}</td></tr>}</tbody></table></div></section>
  </div>;
}
