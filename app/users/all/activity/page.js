'use client';

import { useState } from 'react';
import {
  Activity, TrendingUp, Clock, Filter, Download, Search,
  User, FileText, LogIn, LogOut, Edit, Trash2, Eye,
  MessageSquare, Settings, ChevronDown, BarChart3, Users,
  ArrowUp, ArrowDown, Minus, X
} from 'lucide-react';
import { auditLogs, summaryStats } from '../../../data/mockData';

/* ── Activity type → icon + label ── */
const TYPE_META = {
  login:    { icon: LogIn,        label: 'Login'    },
  logout:   { icon: LogOut,       label: 'Logout'   },
  edit:     { icon: Edit,         label: 'Edit'     },
  create:   { icon: FileText,     label: 'Create'   },
  delete:   { icon: Trash2,       label: 'Delete'   },
  view:     { icon: Eye,          label: 'View'     },
  message:  { icon: MessageSquare,label: 'Message'  },
  settings: { icon: Settings,     label: 'Settings' },
};

/* ── Severity badge ── */
const SEVERITY_STYLES = {
  Info:     'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700',
  Warning:  'bg-zinc-200 text-zinc-700 border-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:border-zinc-600',
  Critical: 'bg-zinc-900 text-zinc-50  border-zinc-800 dark:bg-zinc-50  dark:text-zinc-900 dark:border-zinc-200',
};

/* ── Shared input class ── */
const inputCls = `px-3 py-2 text-sm bg-background border border-border rounded-md
  text-foreground placeholder:text-muted-foreground
  focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-colors`;

/* ── Extend auditLogs with richer activity data ── */
const activities = [
  { id: 1,  user: 'Sarah Johnson', email: 'sarah.j@gmail.com',    action: 'Logged In',        type: 'login',    time: '2 min ago',   details: 'IP: 192.168.1.1',                    severity: 'Info'    },
  { id: 2,  user: 'Mike Chen',     email: 'mike.chen@outlook.com', action: 'Updated Profile',  type: 'edit',     time: '15 min ago',  details: 'Changed shipping address',           severity: 'Info'    },
  { id: 3,  user: 'Emily Brown',   email: 'emily.b@yahoo.com',     action: 'Placed Order',     type: 'create',   time: '1 hour ago',  details: 'Order ORD-1008 — $1,799.99',        severity: 'Info'    },
  { id: 4,  user: 'Tom Harris',    email: 'tom.h@icloud.com',      action: 'Sent Message',     type: 'message',  time: '2 hours ago', details: 'Support ticket #MSG004',             severity: 'Warning' },
  { id: 5,  user: 'Lisa Anderson', email: 'lisa.a@gmail.com',      action: 'Account Suspended',type: 'delete',   time: '3 hours ago', details: 'Flagged for suspicious activity',    severity: 'Critical'},
  { id: 6,  user: 'Amy Martinez',  email: 'amy.m@gmail.com',       action: 'Viewed Dashboard', type: 'view',     time: '4 hours ago', details: 'Browsed product catalog',            severity: 'Info'    },
  { id: 7,  user: 'James Wilson',  email: 'james.w@outlook.com',   action: 'Changed Settings', type: 'settings', time: '5 hours ago', details: 'Updated notification preferences',   severity: 'Info'    },
  { id: 8,  user: 'David Lee',     email: 'david.lee@gmail.com',   action: 'Logged Out',       type: 'logout',   time: '6 hours ago', details: 'Session ended after 24m',            severity: 'Info'    },
];

const stats = [
  { label: 'Total Activities', value: '2,847', change: '+12.5%', trend: 'up',      icon: Activity },
  { label: 'Active Users',     value: '234',   change: '+8.2%',  trend: 'up',      icon: Users    },
  { label: 'Avg. Session',     value: '24m',   change: '-2.4%',  trend: 'down',    icon: Clock    },
  { label: 'Actions Today',    value: '486',   change: '0%',     trend: 'neutral', icon: TrendingUp},
];

const breakdown = [
  { type: 'Logins',   count: 156, pct: 32 },
  { type: 'Views',    count: 203, pct: 42 },
  { type: 'Edits',    count: 98,  pct: 20 },
  { type: 'Messages', count: 29,  pct: 6  },
];

export default function UserActivityPage() {
  const [timeFilter, setTimeFilter]     = useState('today');
  const [activityType, setActivityType] = useState('all');
  const [searchQuery, setSearchQuery]   = useState('');
  const [showFilters, setShowFilters]   = useState(false);

  const filtered = activities.filter(a => {
    const q = searchQuery.toLowerCase();
    const matchSearch = a.user.toLowerCase().includes(q) || a.action.toLowerCase().includes(q);
    const matchType   = activityType === 'all' || a.type === activityType;
    return matchSearch && matchType;
  });

  return (
    <div className="p-4 sm:p-6 space-y-5">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
            <span>Users</span>
            <ChevronDown size={12} className="-rotate-90" />
            <span>All Users</span>
            <ChevronDown size={12} className="-rotate-90" />
            <span className="text-foreground font-medium">Activity</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            User Activity
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Monitor and analyze customer actions in real-time
          </p>
        </div>
        <button className="self-start sm:self-auto flex items-center gap-2 px-3 py-2 text-sm
          font-medium bg-foreground text-background rounded-md hover:opacity-80 transition-opacity">
          <Download size={14} />
          Export
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s) => {
          const Icon      = s.icon;
          const TrendIcon = s.trend === 'up' ? ArrowUp : s.trend === 'down' ? ArrowDown : Minus;
          const trendCls  = s.trend === 'up' ? 'text-foreground' : s.trend === 'down' ? 'text-muted-foreground' : 'text-muted-foreground';
          return (
            <div key={s.label} className="bg-card border border-border rounded-lg p-4 sm:p-5 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-md bg-muted">
                  <Icon size={15} className="text-muted-foreground" strokeWidth={1.75} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold ${trendCls}`}>
                  <TrendIcon size={12} strokeWidth={2.5} />
                  {s.change}
                </div>
              </div>
              <p className="text-2xl font-semibold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* ── Activity breakdown ── */}
      <div className="bg-card border border-border rounded-lg shadow-card p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-foreground">Activity Breakdown</h2>
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
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users or activities…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`${inputCls} w-full pl-8`}
            />
          </div>

          <div className="flex gap-2">
            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md
                border transition-colors ${showFilters
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                }`}
            >
              <Filter size={14} />
              <span className="hidden sm:inline">Filters</span>
            </button>

            {/* Time select */}
            <select
              value={timeFilter}
              onChange={e => setTimeFilter(e.target.value)}
              className={`${inputCls} pr-8`}
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>

            {/* Type select */}
            <select
              value={activityType}
              onChange={e => setActivityType(e.target.value)}
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
                <select className={`${inputCls} w-full`}>
                  <option>All Roles</option>
                  <option>Admin</option>
                  <option>Manager</option>
                  <option>Customer</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                  Date Range
                </label>
                <input type="date" className={`${inputCls} w-full`} />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                  IP Address
                </label>
                <input type="text" placeholder="Filter by IP…" className={`${inputCls} w-full`} />
              </div>
            </div>
            <button
              onClick={() => { setSearchQuery(''); setActivityType('all'); setTimeFilter('today'); }}
              className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={12} /> Clear all
            </button>
          </div>
        )}
      </div>

      {/* ── Activity timeline ── */}
      <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Recent Activity Timeline</h2>
        </div>

        <div className="divide-y divide-border">
          {filtered.map((activity, index) => {
            const meta = TYPE_META[activity.type] ?? TYPE_META.view;
            const Icon = meta.icon;
            const isLast = index === filtered.length - 1;

            return (
              <div key={activity.id} className="px-5 py-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Icon + connector */}
                  <div className="relative flex flex-col items-center flex-shrink-0">
                    <div className="p-2 rounded-md bg-muted z-10">
                      <Icon size={14} className="text-muted-foreground" strokeWidth={1.75} />
                    </div>
                    {!isLast && (
                      <div className="w-px flex-1 bg-border mt-1 min-h-[20px]" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pb-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">{activity.action}</p>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-foreground flex items-center
                              justify-center flex-shrink-0">
                              <User size={10} className="text-background" />
                            </div>
                            <span className="text-xs font-medium text-foreground">{activity.user}</span>
                          </div>
                          <span className="text-muted-foreground/40 text-xs hidden sm:inline">•</span>
                          <span className="text-xs text-muted-foreground">{activity.email}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs
                          font-medium border ${SEVERITY_STYLES[activity.severity] ?? SEVERITY_STYLES.Info}`}>
                          {activity.severity}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                          <Clock size={11} />
                          {activity.time}
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="mt-2 px-3 py-2 bg-muted/50 rounded-md">
                      <p className="text-xs text-muted-foreground">{activity.details}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="px-5 py-16 text-center text-sm text-muted-foreground">
              No activities match your search or filters.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border">
          <button className="text-xs font-medium text-foreground hover:text-muted-foreground
            transition-colors underline-offset-2 hover:underline">
            Load more activities →
          </button>
        </div>
      </div>

    </div>
  );
}