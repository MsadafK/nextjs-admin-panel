'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Clock, Filter, Search,
  User, FileText, LogIn, LogOut, Edit, Trash2, Eye,
  MessageSquare, Settings, BarChart3, X, RefreshCw
} from 'lucide-react';
import { userService } from '@/services/userService';
import { useUsers } from '@/hooks/useUsers';
import UserPageHeader from '@/app/components/Users/UserPageHeader';
import UserKpiSummary from '@/app/components/Users/UserKpiSummary';

/* ── Activity type → icon + label ── */
const TYPE_META = {
  login:    { icon: LogIn,         label: 'Login'    },
  logout:   { icon: LogOut,        label: 'Logout'   },
  edit:     { icon: Edit,          label: 'Edit'     },
  create:   { icon: FileText,      label: 'Create'   },
  delete:   { icon: Trash2,        label: 'Delete'   },
  view:     { icon: Eye,           label: 'View'     },
  message:  { icon: MessageSquare, label: 'Message'  },
  settings: { icon: Settings,      label: 'Settings' },
};

/* ── Severity badge ── */
const SEVERITY_STYLES = {
  Info:     'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700',
  Warning:  'bg-zinc-200 text-zinc-700 border-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:border-zinc-600',
  Critical: 'bg-zinc-900 text-zinc-50 border-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:border-zinc-200',
};

const inputCls = `px-3 py-2 text-sm bg-background border border-border rounded-md
  text-foreground placeholder:text-muted-foreground
  focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-colors`;

export default function UserActivityPage() {
  const { users: directoryUsers, loading: usersLoading, refreshUsers } = useUsers();
  const [activities, setActivities]         = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);

  const [timeFilter, setTimeFilter]         = useState('all');
  const [activityType, setActivityType]     = useState('all');
  const [roleFilter, setRoleFilter]         = useState('all');
  const [ipFilter, setIpFilter]             = useState('');
  const [searchQuery, setSearchQuery]       = useState('');
  const [showFilters, setShowFilters]       = useState(false);
  const [visibleCount, setVisibleCount]     = useState(10);

  const fetchActivity = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getActivityData();
      setActivities(data.activities);
    } catch (err) {
      console.error('Error loading user activity:', err);
      setError(err.message || 'Failed to load activity feed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  const filtered = useMemo(() => {
    return activities.filter((a) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        (a.user || '').toLowerCase().includes(q) ||
        (a.email || '').toLowerCase().includes(q) ||
        (a.action || '').toLowerCase().includes(q) ||
        (a.details || '').toLowerCase().includes(q);

      const matchType = activityType === 'all' || a.type === activityType;
      const matchRole =
        roleFilter === 'all' || (a.role || '').toLowerCase() === roleFilter.toLowerCase();
      const matchIp = !ipFilter || (a.ip || '').includes(ipFilter);

      return matchSearch && matchType && matchRole && matchIp;
    });
  }, [activities, searchQuery, activityType, roleFilter, ipFilter]);

  const breakdown = useMemo(() => {
    const total = Math.max(1, activities.length);
    const counts = {
      Creates: activities.filter((a) => a.type === 'create').length,
      Edits: activities.filter((a) => a.type === 'edit').length,
      Logins: activities.filter((a) => a.type === 'login').length,
      Critical: activities.filter((a) => a.type === 'delete').length,
    };

    return Object.entries(counts).map(([type, count]) => ({
      type,
      count,
      pct: Math.round((count / total) * 100),
    }));
  }, [activities]);

  const handleExportCSV = () => {
    const headers = ['ID,User,Email,Role,Action,Type,Severity,Details,Time'];
    const rows = filtered.map(
      (a) =>
        `${a.id},"${a.user}","${a.email}","${a.role || ''}","${a.action}",${a.type},${a.severity},"${a.details}","${a.time}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'user_activity_logs.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-container mx-auto max-w-7xl space-y-5">
      <UserPageHeader title="User Activity" description="Live activity feed synced with Supabase users and audit records." loading={loading || usersLoading} onRefresh={() => { fetchActivity(); refreshUsers(); }} users={directoryUsers} onExport={handleExportCSV}/>
      <UserKpiSummary users={directoryUsers} loading={usersLoading}/>

      {error && (
        <div className="card p-4 border-destructive/40 bg-destructive/10 text-destructive text-sm flex items-center justify-between">
          <span><strong>Database Error:</strong> {error}</span>
          <button onClick={fetchActivity} className="btn btn-outline h-8 text-xs">Retry</button>
        </div>
      )}

      {/* ── Activity breakdown ── */}
      <div className="bg-card border border-border rounded-lg shadow-card p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-foreground">Activity Breakdown (Live)</h2>
          <BarChart3 size={15} className="text-muted-foreground" />
        </div>
        <div className="space-y-4">
          {breakdown.map((item) => (
            <div key={item.type}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-foreground">{item.type}</span>
                <span className="text-xs text-muted-foreground">{item.count} ({item.pct}%)</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-foreground rounded-full transition-all duration-500"
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="bg-card border border-border rounded-lg shadow-card">
        <div className="p-3 sm:p-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users, emails, or activities…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${inputCls} w-full pl-8`}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md
                border transition-colors ${
                  showFilters
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                }`}
            >
              <Filter size={14} />
              <span className="hidden sm:inline">Filters</span>
            </button>

            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className={`${inputCls} pr-8`}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>

            <select
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              className={`${inputCls} pr-8 hidden sm:block`}
            >
              <option value="all">All Types</option>
              {Object.entries(TYPE_META).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Extended filters */}
        {showFilters && (
          <div className="px-3 sm:px-4 pb-4 border-t border-border">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                  Role
                </label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className={`${inputCls} w-full`}
                >
                  <option value="all">All Roles</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="User">User</option>
                  <option value="Customer">Customer</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                  Activity Type
                </label>
                <select
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value)}
                  className={`${inputCls} w-full`}
                >
                  <option value="all">All Types</option>
                  {Object.entries(TYPE_META).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                  IP Address
                </label>
                <input
                  type="text"
                  value={ipFilter}
                  onChange={(e) => setIpFilter(e.target.value)}
                  placeholder="Filter by IP…"
                  className={`${inputCls} w-full`}
                />
              </div>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setActivityType('all');
                setRoleFilter('all');
                setIpFilter('');
                setTimeFilter('all');
              }}
              className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={12} /> Clear all
            </button>
          </div>
        )}
      </div>

      {/* ── Activity timeline ── */}
      <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Recent Activity Timeline</h2>
          <span className="text-xs text-muted-foreground">{filtered.length} events</span>
        </div>

        <div className="divide-y divide-border">
          {loading ? (
            <div className="p-8 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
              <RefreshCw size={16} className="animate-spin" /> Loading live activity from Supabase...
            </div>
          ) : (
            filtered.slice(0, visibleCount).map((activity, index) => {
              const meta = TYPE_META[activity.type] ?? TYPE_META.view;
              const Icon = meta.icon;
              const isLast = index === Math.min(filtered.length, visibleCount) - 1;

              return (
                <div key={activity.id} className="px-5 py-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="relative flex flex-col items-center flex-shrink-0">
                      <div className="p-2 rounded-md bg-muted z-10">
                        <Icon size={14} className="text-muted-foreground" strokeWidth={1.75} />
                      </div>
                      {!isLast && (
                        <div className="w-px flex-1 bg-border mt-1 min-h-[20px]" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 pb-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">{activity.action}</p>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                            <div className="flex items-center gap-1.5">
                              <div className="w-5 h-5 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
                                <User size={10} className="text-background" />
                              </div>
                              <span className="text-xs font-medium text-foreground">{activity.user}</span>
                            </div>
                            <span className="text-muted-foreground/40 text-xs hidden sm:inline">•</span>
                            <span className="text-xs text-muted-foreground">{activity.email}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${
                              SEVERITY_STYLES[activity.severity] ?? SEVERITY_STYLES.Info
                            }`}
                          >
                            {activity.severity}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                            <Clock size={11} />
                            {activity.time}
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 px-3 py-2 bg-muted/50 rounded-md">
                        <p className="text-xs text-muted-foreground">{activity.details}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {!loading && filtered.length === 0 && (
            <div className="px-5 py-16 text-center text-sm text-muted-foreground">
              No activities match your search or filters.
            </div>
          )}
        </div>

        {/* Footer */}
        {filtered.length > visibleCount && (
          <div className="px-5 py-3 border-t border-border">
            <button
              onClick={() => setVisibleCount((prev) => prev + 10)}
              className="text-xs font-medium text-foreground hover:text-muted-foreground transition-colors underline-offset-2 hover:underline"
            >
              Load more activities ({filtered.length - visibleCount} remaining) →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
