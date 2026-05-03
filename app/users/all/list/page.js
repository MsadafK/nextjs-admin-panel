'use client';

import { useState } from 'react';
import {
  Search, Filter, Download, Mail, MoreVertical,
  Edit2, Trash2, Lock, Unlock, UserCheck, UserX,
  ChevronDown, ChevronUp, Eye, X
} from 'lucide-react';

/* ── Badge tokens — monochrome ── */
const STATUS_STYLES = {
  Active:    'bg-zinc-900 text-zinc-50 border-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:border-zinc-200',
  Inactive:  'bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700',
  Suspended: 'bg-zinc-200 text-zinc-700 border-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:border-zinc-600',
};

const ROLE_STYLES = {
  Admin:   'bg-zinc-900 text-zinc-50 border-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:border-zinc-200',
  Manager: 'bg-zinc-200 text-zinc-700 border-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:border-zinc-600',
  User:    'bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700',
};

export default function UserList() {
  const [searchTerm, setSearchTerm]         = useState('');
  const [filterStatus, setFilterStatus]     = useState('all');
  const [filterRole, setFilterRole]         = useState('all');
  const [sortBy, setSortBy]                 = useState('name');
  const [sortOrder, setSortOrder]           = useState('asc');
  const [selectedUsers, setSelectedUsers]   = useState([]);
  const [showFilters, setShowFilters]       = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const [users] = useState([
    { id: 1, name: 'John Doe',      email: 'john.doe@example.com', role: 'Admin',   status: 'Active',    lastLogin: '2 hours ago',    avatar: 'JD' },
    { id: 2, name: 'Sarah Wilson',  email: 'sarah.w@example.com',  role: 'Manager', status: 'Active',    lastLogin: '1 day ago',      avatar: 'SW' },
    { id: 3, name: 'Mike Johnson',  email: 'mike.j@example.com',   role: 'User',    status: 'Inactive',  lastLogin: '1 week ago',     avatar: 'MJ' },
    { id: 4, name: 'Emily Brown',   email: 'emily.b@example.com',  role: 'User',    status: 'Active',    lastLogin: '5 minutes ago',  avatar: 'EB' },
    { id: 5, name: 'David Lee',     email: 'david.l@example.com',  role: 'Manager', status: 'Active',    lastLogin: '3 hours ago',    avatar: 'DL' },
    { id: 6, name: 'Lisa Anderson', email: 'lisa.a@example.com',   role: 'User',    status: 'Suspended', lastLogin: '2 weeks ago',    avatar: 'LA' },
    { id: 7, name: 'Tom Harris',    email: 'tom.h@example.com',    role: 'Admin',   status: 'Active',    lastLogin: '30 minutes ago', avatar: 'TH' },
    { id: 8, name: 'Amy Martinez',  email: 'amy.m@example.com',    role: 'User',    status: 'Active',    lastLogin: '4 hours ago',    avatar: 'AM' },
  ]);

  const roles    = ['all', 'Admin', 'Manager', 'User'];
  const statuses = ['all', 'Active', 'Inactive', 'Suspended'];

  const filteredUsers = users
    .filter(u => {
      const q = searchTerm.toLowerCase();
      return (
        (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
        (filterStatus === 'all' || u.status === filterStatus) &&
        (filterRole   === 'all' || u.role   === filterRole)
      );
    })
    .sort((a, b) => {
      const va = typeof a[sortBy] === 'string' ? a[sortBy].toLowerCase() : a[sortBy];
      const vb = typeof b[sortBy] === 'string' ? b[sortBy].toLowerCase() : b[sortBy];
      return sortOrder === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });

  const toggleSort = (field) => {
    if (sortBy === field) setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortOrder('asc'); }
  };

  const toggleUserSelection = (id) =>
    setSelectedUsers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const toggleSelectAll = () =>
    setSelectedUsers(selectedUsers.length === filteredUsers.length ? [] : filteredUsers.map(u => u.id));

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <ChevronDown size={12} className="text-muted-foreground/40" />;
    return sortOrder === 'asc'
      ? <ChevronUp size={12} className="text-foreground" />
      : <ChevronDown size={12} className="text-foreground" />;
  };

  const stats = [
    { label: 'Total Users', value: users.length,                                       icon: UserCheck },
    { label: 'Active',      value: users.filter(u => u.status === 'Active').length,    icon: UserCheck },
    { label: 'Inactive',    value: users.filter(u => u.status === 'Inactive').length,  icon: UserX     },
    { label: 'Suspended',   value: users.filter(u => u.status === 'Suspended').length, icon: Lock      },
  ];

  const inputCls = `w-full px-3 py-2 text-sm bg-background border border-border rounded-md
    text-foreground placeholder:text-muted-foreground
    focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-colors`;

  return (
    <div className="p-4 sm:p-6 space-y-5">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            User List
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage and monitor all users in your system
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
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-card border border-border rounded-lg p-4 sm:p-5 shadow-card">
              <div className="flex items-center justify-between">
                <div className="space-y-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">
                    {s.label}
                  </p>
                  <p className="text-2xl font-semibold text-foreground">{s.value}</p>
                </div>
                <div className="p-2 rounded-md bg-muted flex-shrink-0">
                  <Icon size={16} className="text-muted-foreground" strokeWidth={1.75} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Toolbar ── */}
      <div className="bg-card border border-border rounded-lg shadow-card">
        <div className="p-3 sm:p-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className={`${inputCls} pl-8`}
            />
          </div>

          <div className="flex gap-2">
            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md
                border transition-colors
                ${showFilters
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                }`}
            >
              <Filter size={14} />
              <span className="hidden sm:inline">Filters</span>
              {showFilters ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {/* Bulk email */}
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium
              bg-background border border-border text-muted-foreground rounded-md
              hover:bg-muted hover:text-foreground transition-colors">
              <Mail size={14} />
              <span className="hidden sm:inline">Email</span>
              {selectedUsers.length > 0 && (
                <span className="bg-foreground text-background text-xs px-1.5 py-0.5
                  rounded-full font-semibold">
                  {selectedUsers.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="px-3 sm:px-4 pb-4 border-t border-border">
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <div className="flex-1">
                <label className="block text-xs font-medium text-muted-foreground
                  uppercase tracking-wide mb-1.5">Status</label>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                  className={inputCls}>
                  {statuses.map(s => (
                    <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-muted-foreground
                  uppercase tracking-wide mb-1.5">Role</label>
                <select value={filterRole} onChange={e => setFilterRole(e.target.value)}
                  className={inputCls}>
                  {roles.map(r => (
                    <option key={r} value={r}>{r === 'all' ? 'All Roles' : r}</option>
                  ))}
                </select>
              </div>
              <div className="flex sm:items-end">
                <button
                  onClick={() => { setFilterStatus('all'); setFilterRole('all'); setSearchTerm(''); }}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm
                    text-muted-foreground hover:text-foreground transition-colors">
                  <X size={13} /> Clear all
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Table ── */}
      <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-border accent-foreground"
                  />
                </th>
                {[
                  { label: 'User',       field: 'name'   },
                  { label: 'Role',       field: 'role'   },
                  { label: 'Status',     field: 'status' },
                  { label: 'Last Login', field: null     },
                ].map(col => (
                  <th key={col.label} className="px-4 py-3 text-left">
                    {col.field ? (
                      <button
                        onClick={() => toggleSort(col.field)}
                        className="flex items-center gap-1.5 text-xs font-semibold
                          text-muted-foreground uppercase tracking-wide
                          hover:text-foreground transition-colors"
                      >
                        {col.label}
                        <SortIcon field={col.field} />
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        {col.label}
                      </span>
                    )}
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-xs font-semibold
                  text-muted-foreground uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">

                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      className="w-4 h-4 rounded border-border accent-foreground"
                    />
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 min-w-[160px]">
                      <div className="w-8 h-8 rounded-full bg-foreground flex items-center
                        justify-center text-background text-xs font-semibold flex-shrink-0">
                        {user.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md
                      text-xs font-medium border ${ROLE_STYLES[user.role] ?? ROLE_STYLES.User}`}>
                      {user.role}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md
                      text-xs font-medium border ${STATUS_STYLES[user.status] ?? STATUS_STYLES.Inactive}`}>
                      {user.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                    {user.lastLogin}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 text-muted-foreground hover:text-foreground
                        hover:bg-muted rounded-md transition-colors" title="View">
                        <Eye size={14} />
                      </button>
                      <button className="p-1.5 text-muted-foreground hover:text-foreground
                        hover:bg-muted rounded-md transition-colors" title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button className="p-1.5 text-muted-foreground hover:text-foreground
                        hover:bg-muted rounded-md transition-colors" title="Toggle status">
                        {user.status === 'Active' ? <Lock size={14} /> : <Unlock size={14} />}
                      </button>

                      <div className="relative">
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                          className="p-1.5 text-muted-foreground hover:text-foreground
                            hover:bg-muted rounded-md transition-colors">
                          <MoreVertical size={14} />
                        </button>

                        {activeDropdown === user.id && (
                          <div className="absolute right-0 mt-1 w-44 bg-card border border-border
                            rounded-lg shadow-dropdown z-20 overflow-hidden py-1">
                            <button className="w-full px-3 py-2 text-left text-sm text-foreground
                              hover:bg-muted flex items-center gap-2 transition-colors">
                              <Mail size={13} className="text-muted-foreground" />
                              Send Email
                            </button>
                            <button className="w-full px-3 py-2 text-left text-sm text-foreground
                              hover:bg-muted flex items-center gap-2 transition-colors">
                              <Eye size={13} className="text-muted-foreground" />
                              View Activity
                            </button>
                            <div className="border-t border-border my-1" />
                            <button className="w-full px-3 py-2 text-left text-sm
                              text-red-600 dark:text-red-400
                              hover:bg-muted flex items-center gap-2 transition-colors">
                              <Trash2 size={13} />
                              Delete User
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-sm text-muted-foreground">
                    No users match your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="px-4 py-3 border-t border-border flex flex-col sm:flex-row
          items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Showing{' '}
            <span className="font-medium text-foreground">{filteredUsers.length}</span>
            {' '}of{' '}
            <span className="font-medium text-foreground">{users.length}</span>
            {' '}users
          </p>
          <div className="flex items-center gap-1">
            {['Previous', '1', '2', 'Next'].map((label) => (
              <button key={label}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors
                  ${label === '1'
                    ? 'bg-foreground text-background hover:opacity-80'
                    : 'border border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}