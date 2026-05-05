'use client';

import { useState } from 'react';
import {
  Shield, Search, ChevronDown, Plus,
  Edit, Eye, Crown, Users, Settings,
  FileText, BarChart3, Database,
  RotateCcw, Save, User
} from 'lucide-react';
import { staff, roles as mockRoles } from '../../../data/mockData';

/* ── Permission categories ── */
const PERMISSION_CATEGORIES = [
  {
    name: 'Dashboard', icon: BarChart3,
    permissions: [
      { id: 'dash_view',   name: 'View Dashboard',  description: 'Access to main dashboard'   },
      { id: 'dash_edit',   name: 'Edit Widgets',    description: 'Modify dashboard widgets'   },
      { id: 'dash_export', name: 'Export Data',     description: 'Export dashboard data'      },
    ],
  },
  {
    name: 'Users Management', icon: Users,
    permissions: [
      { id: 'user_view',   name: 'View Users',    description: 'View user list and profiles' },
      { id: 'user_create', name: 'Create Users',  description: 'Add new users to system'     },
      { id: 'user_edit',   name: 'Edit Users',    description: 'Modify user information'     },
      { id: 'user_delete', name: 'Delete Users',  description: 'Remove users from system'    },
    ],
  },
  {
    name: 'Products', icon: FileText,
    permissions: [
      { id: 'prod_view',   name: 'View Products',   description: 'Access product catalog'    },
      { id: 'prod_create', name: 'Add Products',    description: 'Add new products'          },
      { id: 'prod_edit',   name: 'Edit Products',   description: 'Modify product details'    },
      { id: 'prod_delete', name: 'Delete Products', description: 'Remove products'           },
    ],
  },
  {
    name: 'Reports', icon: BarChart3,
    permissions: [
      { id: 'report_view',   name: 'View Reports',   description: 'Access all reports'       },
      { id: 'report_create', name: 'Create Reports', description: 'Generate new reports'     },
      { id: 'report_export', name: 'Export Reports', description: 'Download report data'     },
    ],
  },
  {
    name: 'Settings', icon: Settings,
    permissions: [
      { id: 'settings_view',     name: 'View Settings',     description: 'Access system settings'  },
      { id: 'settings_edit',     name: 'Edit Settings',     description: 'Modify system settings'  },
      { id: 'settings_security', name: 'Security Settings', description: 'Manage security options' },
    ],
  },
  {
    name: 'Database', icon: Database,
    permissions: [
      { id: 'db_view',    name: 'View Database',    description: 'Access database records'  },
      { id: 'db_backup',  name: 'Backup Database',  description: 'Create database backups'  },
      { id: 'db_restore', name: 'Restore Database', description: 'Restore from backups'     },
    ],
  },
];

const ALL_PERMISSIONS = PERMISSION_CATEGORIES.flatMap(c => c.permissions.map(p => p.id));

/* ── Build users from mockData staff ── */
const USERS = staff.map(s => ({
  id:          s.id,
  name:        s.name,
  email:       s.email,
  role:        s.role,
  avatar:      s.avatar,
  lastActive:  s.lastLogin,
  permissions: s.permissions.includes('all') ? ALL_PERMISSIONS : s.permissions,
}));

/* ── Role badge tokens ── */
const ROLE_STYLES = {
  Admin:   'bg-zinc-900 text-zinc-50 border-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:border-zinc-200',
  Manager: 'bg-zinc-200 text-zinc-700 border-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:border-zinc-600',
  Staff:   'bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700',
};

const ROLE_ICONS = { Admin: Crown, Manager: Shield, Staff: User };

const inputCls = `w-full px-3 py-2 text-sm bg-background border border-border rounded-md
  text-foreground placeholder:text-muted-foreground
  focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-colors`;

export default function UserPermissionsPage() {
  const [selectedUser, setSelectedUser]     = useState(null);
  const [searchQuery, setSearchQuery]       = useState('');
  const [roleFilter, setRoleFilter]         = useState('all');
  const [userPerms, setUserPerms]           = useState(
    USERS.reduce((acc, u) => { acc[u.id] = [...u.permissions]; return acc; }, {})
  );

  const togglePerm = (userId, permId) => {
    setUserPerms(prev => ({
      ...prev,
      [userId]: prev[userId].includes(permId)
        ? prev[userId].filter(p => p !== permId)
        : [...prev[userId], permId],
    }));
  };

  const hasPerm = (userId, permId) => userPerms[userId]?.includes(permId) ?? false;

  const getStats = (userId) => {
    const total   = ALL_PERMISSIONS.length;
    const granted = userPerms[userId]?.length ?? 0;
    return { total, granted, pct: Math.round((granted / total) * 100) };
  };

  const roleCounts = ['Admin', 'Manager', 'Staff'].map(r => ({
    role:  r,
    count: USERS.filter(u => u.role === r).length,
    icon:  ROLE_ICONS[r] ?? User,
  }));

  const filteredUsers = USERS.filter(u =>
    (roleFilter === 'all' || u.role === roleFilter) &&
    (u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-4 sm:p-6 space-y-5">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
            <span>Users</span>
            <ChevronDown size={12} className="-rotate-90" />
            <span>All Users</span>
            <ChevronDown size={12} className="-rotate-90" />
            <span className="text-foreground font-medium">Permissions</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            User Permissions
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage staff access and permissions across NexStore
          </p>
        </div>
        <button className="self-start sm:self-auto flex items-center gap-2 px-3 py-2 text-sm
          font-medium bg-foreground text-background rounded-md hover:opacity-80 transition-opacity">
          <Plus size={14} />
          Add Role
        </button>
      </div>

      {/* ── Role overview cards ── */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {roleCounts.map(({ role, count, icon: Icon }) => (
          <div key={role} className="bg-card border border-border rounded-lg p-4 sm:p-5 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-md bg-muted">
                <Icon size={15} className="text-muted-foreground" strokeWidth={1.75} />
              </div>
              <span className="text-2xl font-semibold text-foreground">{count}</span>
            </div>
            <p className="text-sm font-medium text-foreground">{role}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {count} {count === 1 ? 'member' : 'members'}
            </p>
          </div>
        ))}
      </div>

      {/* ── Main panel ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">

        {/* Users list */}
        <div className="lg:col-span-1 bg-card border border-border rounded-lg shadow-card flex flex-col">
          {/* List header */}
          <div className="px-4 py-4 border-b border-border space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Staff Members</h2>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search staff…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={`${inputCls} pl-8`}
              />
            </div>
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className={inputCls}
            >
              <option value="all">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          {/* User rows */}
          <div className="divide-y divide-border overflow-y-auto max-h-[520px] no-scrollbar">
            {filteredUsers.map(user => {
              const s       = getStats(user.id);
              const isActive = selectedUser?.id === user.id;
              return (
                <button
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`w-full p-4 text-left transition-colors ${
                    isActive ? 'bg-muted' : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-foreground flex items-center
                      justify-center text-background text-xs font-semibold flex-shrink-0">
                      {user.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs
                          font-medium border flex-shrink-0 ${ROLE_STYLES[user.role] ?? ROLE_STYLES.Staff}`}>
                          {user.role}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Permissions</span>
                          <span className="font-medium text-foreground">{s.granted}/{s.total}</span>
                        </div>
                        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-foreground rounded-full transition-all duration-300"
                            style={{ width: `${s.pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Permissions panel */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg shadow-card flex flex-col">
          {selectedUser ? (
            <>
              {/* Selected user header */}
              <div className="px-5 py-4 border-b border-border">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-foreground flex items-center
                      justify-center text-background text-sm font-semibold flex-shrink-0">
                      {selectedUser.avatar}
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-foreground">{selectedUser.name}</h2>
                      <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs
                          font-medium border ${ROLE_STYLES[selectedUser.role] ?? ROLE_STYLES.Staff}`}>
                          {selectedUser.role}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Active {selectedUser.lastActive}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-md text-muted-foreground hover:bg-muted
                      hover:text-foreground transition-colors" title="Reset permissions">
                      <RotateCcw size={14} />
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium
                      bg-foreground text-background rounded-md hover:opacity-80 transition-opacity">
                      <Save size={14} />
                      Save
                    </button>
                  </div>
                </div>

                {/* Stats row */}
                {(() => {
                  const s = getStats(selectedUser.id);
                  return (
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      {[
                        { label: 'Total',       value: s.total   },
                        { label: 'Granted',     value: s.granted },
                        { label: 'Access Level',value: `${s.pct}%` },
                      ].map(item => (
                        <div key={item.label} className="bg-muted/50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground">{item.label}</p>
                          <p className="text-xl font-semibold text-foreground mt-0.5">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Permissions list */}
              <div className="p-5 overflow-y-auto max-h-[480px] no-scrollbar space-y-4">
                {PERMISSION_CATEGORIES.map(category => {
                  const CatIcon      = category.icon;
                  const grantedCount = category.permissions.filter(p =>
                    hasPerm(selectedUser.id, p.id)
                  ).length;

                  return (
                    <div key={category.name} className="border border-border rounded-lg overflow-hidden">
                      {/* Category header */}
                      <div className="px-4 py-3 bg-muted/40 border-b border-border
                        flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CatIcon size={14} className="text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">{category.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {grantedCount}/{category.permissions.length} granted
                        </span>
                      </div>

                      {/* Permission rows */}
                      <div className="divide-y divide-border">
                        {category.permissions.map(perm => {
                          const isGranted = hasPerm(selectedUser.id, perm.id);
                          return (
                            <div key={perm.id}
                              className="px-4 py-3 flex items-center justify-between gap-4">
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-foreground">{perm.name}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{perm.description}</p>
                              </div>
                              {/* Toggle */}
                              <button
                                onClick={() => togglePerm(selectedUser.id, perm.id)}
                                className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center
                                  rounded-full transition-colors focus:outline-none ${
                                  isGranted
                                    ? 'bg-foreground'
                                    : 'bg-zinc-300 dark:bg-zinc-700'
                                }`}
                              >
                                <span className={`inline-block h-3.5 w-3.5 transform rounded-full
                                  bg-white shadow transition-transform ${
                                  isGranted ? 'translate-x-[18px]' : 'translate-x-[3px]'
                                }`} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* Empty state */
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <div className="p-4 rounded-full bg-muted mb-4">
                <Shield size={28} className="text-muted-foreground" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">Select a Staff Member</h3>
              <p className="text-xs text-muted-foreground max-w-xs">
                Choose a staff member from the list to view and manage their permissions
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}