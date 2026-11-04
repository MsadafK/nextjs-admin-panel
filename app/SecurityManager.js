'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Download, KeyRound, RefreshCw, Search, Shield } from 'lucide-react';
import { securityService } from '@/services/securityService';

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
  const [data, setData] = useState({ users: [], auditLogs: [], notifications: [], apiKeys: [], permissions: [], errors: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
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
  const filteredRows = rows.filter((row) => Object.values(row).join(' ').toLowerCase().includes(search.toLowerCase()));

  const activeKeys = data.apiKeys.filter((key) => !key.is_revoked).length;
  const revokedKeys = data.apiKeys.length - activeKeys;
  const severeLogs = data.auditLogs.filter((log) => /critical|error/i.test(log.severity || '')).length;
  const warningLogs = data.auditLogs.filter((log) => /warning/i.test(log.severity || '')).length;
  const noPermissions = data.users.filter((user) => !data.permissions.some((permission) => String(permission.user_id) === String(user.id))).length;
  const kpis = family === 'audit'
    ? [['Audit Records', data.auditLogs.length], ['Critical / Error', severeLogs], ['Warnings', warningLogs], ['Unread Notifications', data.notifications.filter((item) => !item.isRead).length]]
    : family === 'permissions'
      ? [['Users', data.users.length], ['Permission Grants', data.permissions.length], ['Admins', data.users.filter((user) => user.role === 'admin').length], ['Users Without Grants', noPermissions]]
      : [['API Keys', data.apiKeys.length], ['Active Keys', activeKeys], ['Revoked Keys', revokedKeys], ['Recently Used', data.apiKeys.filter((key) => key.last_used).length]];

  const columns = filteredRows.length ? Object.keys(filteredRows[0]).filter((key) => key !== 'id') : [];
  const updateUserField = async (user, field, value) => {
    setError('');
    const updater = field === 'role' ? securityService.updateUserRole : securityService.updateUserStatus;
    try { await updater(user.id, value); await refresh(); }
    catch (err) { setError(err.message || 'Could not update user access.'); }
  };
  const savePermission = async (event) => {
    event.preventDefault(); setError('');
    try { await securityService.savePermission({ userId: permissionForm.userId, permissionName: permissionForm.permissionName, resourceType: permissionForm.resourceType, accessLevel: permissionForm.accessLevel }); await refresh(); }
    catch (err) { setError(err.message || 'Could not save permission.'); }
  };
  const createKey = async (event) => {
    event.preventDefault(); setError(''); setCreatedSecret('');
    try {
      const admin = data.users.find((user) => user.role === 'admin') || data.users[0];
      const created = await securityService.createApiKey({ ...keyForm, createdBy: admin?.id || null });
      setCreatedSecret(created.secret); setKeyForm((current) => ({ ...current, keyName: '' })); await refresh();
    } catch (err) { setError(err.message || 'Could not create API key.'); }
  };
  const revoke = async (id) => {
    setError('');
    try { await securityService.revokeApiKey(id); await refresh(); }
    catch (err) { setError(err.message || 'Could not revoke API key.'); }
  };
  const removePermission = async (id) => {
    setError('');
    try { await securityService.removePermission(id); await refresh(); }
    catch (err) { setError(err.message || 'Could not remove permission.'); }
  };

  return <main className="min-h-screen space-y-6 bg-background p-6 text-foreground">
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5"><div><h1 className="text-2xl font-semibold">{TITLES[mode] || 'Security'}</h1><p className="mt-1 text-sm text-muted-foreground">Live users, permissions, audit logs, notifications, and API keys.</p></div><div className="flex gap-2"><button onClick={refresh} disabled={loading} className="inline-flex items-center gap-2 rounded-md border border-border bg-muted px-4 py-2"><RefreshCw size={16}/> Refresh</button><button onClick={() => exportRows(filteredRows)} disabled={!filteredRows.length} className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-background"><Download size={16}/> Export CSV</button></div></header>
    {(error || data.errors.length > 0) && <div role="status" className="rounded-md border border-border bg-muted p-3 text-sm">{error} {data.errors.join(' ')}</div>}
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{kpis.map(([label, value]) => <article key={label} className="rounded-lg border border-border bg-card p-4"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p></article>)}</section>
    {mode === 'permissions/access' && <form onSubmit={savePermission} className="grid gap-3 rounded-lg border border-border bg-card p-4 md:grid-cols-5"><select required value={permissionForm.userId} onChange={(event) => setPermissionForm({ ...permissionForm, userId: event.target.value })} className="rounded-md border border-border bg-background px-3 py-2">{data.users.map((user) => <option key={user.id} value={user.id}>{user.full_name || user.email}</option>)}</select><input required placeholder="Permission name" value={permissionForm.permissionName} onChange={(event) => setPermissionForm({ ...permissionForm, permissionName: event.target.value })} className="rounded-md border border-border bg-background px-3 py-2"/><input required placeholder="Resource" value={permissionForm.resourceType} onChange={(event) => setPermissionForm({ ...permissionForm, resourceType: event.target.value })} className="rounded-md border border-border bg-background px-3 py-2"/><select value={permissionForm.accessLevel} onChange={(event) => setPermissionForm({ ...permissionForm, accessLevel: event.target.value })} className="rounded-md border border-border bg-background px-3 py-2">{['view', 'create', 'edit', 'delete', 'admin'].map((value) => <option key={value}>{value}</option>)}</select><button className="rounded-md bg-foreground px-4 py-2 text-background">Save Permission</button></form>}
    {mode === 'api-keys/generate' && <form onSubmit={createKey} className="grid gap-3 rounded-lg border border-border bg-card p-4 md:grid-cols-4"><input required placeholder="Key name" value={keyForm.keyName} onChange={(event) => setKeyForm({ ...keyForm, keyName: event.target.value })} className="rounded-md border border-border bg-background px-3 py-2"/><select value={keyForm.scope} onChange={(event) => setKeyForm({ ...keyForm, scope: event.target.value })} className="rounded-md border border-border bg-background px-3 py-2">{['read', 'write', 'full'].map((value) => <option key={value}>{value}</option>)}</select><select value={keyForm.environment} onChange={(event) => setKeyForm({ ...keyForm, environment: event.target.value })} className="rounded-md border border-border bg-background px-3 py-2">{['development', 'staging', 'production'].map((value) => <option key={value}>{value}</option>)}</select><button className="rounded-md bg-foreground px-4 py-2 text-background">Generate Key</button>{createdSecret && <p className="md:col-span-4 break-all rounded-md border border-border bg-muted p-3 text-sm"><KeyRound className="mr-2 inline" size={16}/>Copy this key now: <strong>{createdSecret}</strong></p>}</form>}
    <section className="relative"><Search size={16} className="absolute left-3 top-3 text-muted-foreground"/><input aria-label="Search security data" placeholder="Search security data" value={search} onChange={(event) => setSearch(event.target.value)} className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3"/></section>
    {mode === 'permissions/roles' && <section className="grid gap-3 md:grid-cols-2">{data.users.map((user) => <article key={user.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4"><div><h2 className="font-medium">{user.full_name || user.email}</h2><p className="text-sm text-muted-foreground">{user.department || 'General'} · {user.email}</p></div><label className="text-sm">Role<select value={user.role || 'user'} onChange={(event) => updateUserField(user, 'role', event.target.value)} className="ml-2 rounded-md border border-border bg-background px-3 py-2">{['admin', 'manager', 'user'].map((role) => <option key={role}>{role}</option>)}</select></label></article>)}</section>}
    {mode === 'permissions/users' && <section className="grid gap-3 md:grid-cols-2">{data.users.map((user) => <article key={user.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4"><div><h2 className="font-medium">{user.full_name || user.email}</h2><p className="text-sm text-muted-foreground">{user.email} · {user.role}</p></div><label className="text-sm">Status<select value={user.status || 'active'} onChange={(event) => updateUserField(user, 'status', event.target.value)} className="ml-2 rounded-md border border-border bg-background px-3 py-2">{['active', 'inactive', 'suspended'].map((status) => <option key={status}>{status}</option>)}</select></label></article>)}</section>}
    <section className="overflow-hidden rounded-lg border border-border bg-card"><div className="flex items-center justify-between border-b border-border p-4"><div className="flex items-center gap-2"><Shield size={18}/><div><h2 className="font-semibold">{TITLES[mode]} Records</h2><p className="text-sm text-muted-foreground">{filteredRows.length} records</p></div></div>{loading && <span className="text-sm text-muted-foreground">Loading…</span>}</div><div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-muted text-muted-foreground"><tr>{columns.map((column) => <th key={column} className="px-4 py-3 font-medium">{column}</th>)}{(family === 'api-keys' || hasPermissionActions) && <th className="px-4 py-3 font-medium">Action</th>}</tr></thead><tbody className="divide-y divide-border">{filteredRows.map((row) => <tr key={row.id}>{columns.map((column) => <td key={column} className="px-4 py-3">{column.toLowerCase().includes('date') || column === 'Created' || column === 'Granted' || column === 'Last Used' ? (row[column] ? new Date(row[column]).toLocaleString() : '—') : row[column] ?? '—'}</td>)}{(family === 'api-keys' || hasPermissionActions) && <td className="px-4 py-3">{family === 'api-keys' ? row.Status === 'Active' && <button onClick={() => revoke(row.id)} className="rounded-md border border-border bg-muted px-3 py-1">Revoke</button> : <button onClick={() => removePermission(row.id)} className="rounded-md border border-border bg-muted px-3 py-1">Remove</button>}</td>}</tr>)}{!filteredRows.length && <tr><td colSpan={columns.length + (family === 'api-keys' || hasPermissionActions ? 1 : 0)} className="px-4 py-10 text-center text-muted-foreground">{loading ? 'Loading records…' : 'No live records found.'}</td></tr>}</tbody></table></div></section>
  </main>;
}
