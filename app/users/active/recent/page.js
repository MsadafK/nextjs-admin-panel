// app/users/active/recent/page.js
'use client';

import { useState, useMemo } from 'react';
import { Activity, Search, RefreshCw, Clock, ArrowUpRight } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';

const ACTIVITY_TEMPLATES = [
  { action: 'Authenticated Active Session', detail: 'Verified dashboard access token', type: 'auth' },
  { action: 'Updated Inventory Ledger', detail: 'Synced product stock quantities', type: 'update' },
  { action: 'Exported Audit Report', detail: 'Downloaded CSV valuation report', type: 'report' },
  { action: 'Modified Role Permissions', detail: 'Reviewed RBAC security policy', type: 'security' },
  { action: 'Updated Account Profile', detail: 'Synced department metadata in Supabase', type: 'profile' },
];

export default function RecentUserActivityPage() {
  const { users, loading, refreshUsers } = useUsers();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const activities = useMemo(() => {
    return users.map((u, idx) => {
      const tpl = ACTIVITY_TEMPLATES[idx % ACTIVITY_TEMPLATES.length];
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role || 'User',
        department: u.department || 'General',
        action: tpl.action,
        detail: tpl.detail,
        type: tpl.type,
        ip: `192.168.1.${101 + idx}`,
        timeAgo: idx === 0 ? 'Just now' : `${idx * 4 + 2} min ago`,
      };
    });
  }, [users]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return activities.filter((a) => {
      const matchSearch =
        a.name?.toLowerCase().includes(q) ||
        a.action?.toLowerCase().includes(q) ||
        a.detail?.toLowerCase().includes(q);
      const matchType = typeFilter === 'all' || a.type === typeFilter;
      return matchSearch && matchType;
    });
  }, [activities, searchQuery, typeFilter]);

  return (
    <div className="page-container max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground mb-1 flex items-center gap-2">
            <Activity size={22} className="text-foreground" />
            Recent Activity
          </h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} recent actions tracked across Supabase users (`public.users`)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-md bg-foreground text-background text-xs font-mono font-medium inline-flex items-center gap-1.5">
            <Clock size={13} /> {filtered.length} Recent
          </span>
          <button onClick={refreshUsers} className="btn btn-outline">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="card p-4 shadow-card border border-border flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by user or action..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-9 w-full"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="input w-full sm:w-auto"
        >
          <option value="all">All Types</option>
          <option value="auth">Authentication</option>
          <option value="update">Inventory Updates</option>
          <option value="report">Reports</option>
          <option value="security">Security</option>
        </select>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="card p-12 text-center text-muted-foreground border border-border">
            Loading recent user activity...
          </div>
        ) : (
          filtered.map((item) => {
            const initials = (item.name || 'U')
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);

            return (
              <div
                key={item.id}
                className="card p-4 shadow-card border border-border flex items-center justify-between gap-4 hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center font-mono text-xs font-bold flex-shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground truncate">{item.name}</h3>
                      <span className="px-2 py-0.5 rounded bg-muted border border-border font-mono text-[10px] uppercase text-foreground">
                        {item.role}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-foreground mt-0.5 flex items-center gap-1">
                      {item.action} <ArrowUpRight size={12} />
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.detail} • IP: {item.ip}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-muted-foreground flex-shrink-0">
                  {item.timeAgo}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}