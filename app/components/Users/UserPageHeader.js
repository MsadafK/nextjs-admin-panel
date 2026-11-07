'use client';

import { Download, Plus, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function exportUsersCsv(users = [], filename = 'users_export.csv') {
  const columns = ['Name', 'Email', 'Role', 'Department', 'Status', 'Joined'];
  const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  const rows = users.map((user) => [user.name, user.email, user.role, user.department || 'General', user.status, user.createdAt].map(escape).join(','));
  const blob = new Blob([[columns.map(escape).join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

export default function UserPageHeader({ title, description, loading, onRefresh, users = [], onExport = () => exportUsersCsv(users) }) {
  const router = useRouter();
  return <header className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="min-w-0"><div className="flex items-center gap-2"><h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{title}</h1><span className="h-2 w-2 shrink-0 rounded-full bg-foreground" title="Live database sync"/></div><p className="mt-1 text-sm text-muted-foreground">{description}</p></div>
    <div className="flex flex-wrap gap-2">
      {onRefresh && <button type="button" onClick={onRefresh} className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"><RefreshCw size={14} className={loading ? 'animate-spin' : ''}/>Refresh</button>}
      <button type="button" onClick={onExport} className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"><Download size={14}/>Export CSV</button>
      <button type="button" onClick={() => router.push('/users/add/single')} className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-foreground px-4 text-xs font-medium text-background transition-opacity hover:opacity-90"><Plus size={14}/>Add User</button>
    </div>
  </header>;
}
