'use client';

import { useState } from 'react';
import {
  Search, Filter, Download, Mail, MoreVertical,
  Edit2, Trash2, Lock, Unlock, UserCheck, UserX,
  ChevronDown, ChevronUp, Eye, X
} from 'lucide-react';

/* ── Static Data ── */
const roles    = ['all', 'Admin', 'Manager', 'User'];
const statuses = ['all', 'Active', 'Inactive', 'Suspended'];

/* ── Badge tokens using semantic variables ── */
const STATUS_STYLES = {
  Active:    'bg-foreground text-background border-foreground',
  Inactive:  'bg-muted text-muted-foreground border-border',
  Suspended: 'bg-secondary text-secondary-foreground border-border',
};

const ROLE_STYLES = {
  Admin:   'bg-foreground text-background border-foreground',
  Manager: 'bg-secondary text-secondary-foreground border-border',
  User:    'bg-muted text-muted-foreground border-border',
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
    { label: 'Total Users', value: users.length,                                      icon: UserCheck },
    { label: 'Active',      value: users.filter(u => u.status === 'Active').length,    icon: UserCheck },
    { label: 'Inactive',    value: users.filter(u => u.status === 'Inactive').length,  icon: UserX     },
    { label: 'Suspended',   value: users.filter(u => u.status === 'Suspended').length, icon: Lock      },
  ];

  return (
    <div className="page-container space-y-5">
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
        <button className="btn btn-primary self-start sm:self-auto">
          <Download size={16} />
          Export
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card p-4 sm:p-5 shadow-card hover:shadow-dropdown transition-shadow duration-150">
              <div className="flex items-center justify-between">
                <div className="space-y-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">
                    {s.label}
                  </p>
                  <p className="text-2xl font-semibold tracking-tight text-foreground">{s.value}</p>
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
      <div className="card p-0 shadow-card">
        <div className="p-3 sm:p-4 flex flex-col sm:flex-row gap-2 sm:gap-3 border-b border-border">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="input pl-9 w-full"
            />
          </div>

          <div className="flex gap-2">
            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn ${showFilters ? 'btn-primary' : 'btn-outline'}`}
            >
              <Filter size={16} />
              <span className="hidden sm:inline">Filters</span>
              {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {/* Bulk email */}
            <button className="btn btn-outline">
              <Mail size={16} />
              <span className="hidden sm:inline">Email</span>
              {selectedUsers.length > 0 && (
                <span className="bg-foreground text-background text-xs px-1.5 py-0.5 rounded-full font-semibold ml-1">
                  {selectedUsers.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="px-3 sm:px-4 pb-4 bg-muted/20">
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <div className="flex-1">
                <label className="label uppercase tracking-wide text-xs text-muted-foreground mb-1.5 block">Status</label>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="input w-full">
                  {statuses.map(s => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="label uppercase tracking-wide text-xs text-muted-foreground mb-1.5 block">Role</label>
                <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="input w-full">
                  {roles.map(r => <option key={r} value={r}>{r === 'all' ? 'All Roles' : r}</option>)}
                </select>
              </div>
              <div className="flex sm:items-end">
                <button
                  onClick={() => { setFilterStatus('all'); setFilterRole('all'); setSearchTerm(''); }}
                  className="btn btn-ghost text-muted-foreground hover:text-foreground"
                >
                  <X size={14} /> Clear all
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Table ── */}
      <div className="card p-0 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-border accent-foreground cursor-pointer"
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
                        className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors"
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
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
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
                      className="w-4 h-4 rounded border-border accent-foreground cursor-pointer"
                    />
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 min-w-[160px]">
                      <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-foreground text-xs font-semibold flex-shrink-0">
                        {user.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span className={`badge ${ROLE_STYLES[user.role] ?? ROLE_STYLES.User}`}>
                      {user.role}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span className={`badge ${STATUS_STYLES[user.status] ?? STATUS_STYLES.Inactive}`}>
                      {user.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                    {user.lastLogin}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="btn btn-ghost h-8 w-8 p-0" title="View">
                        <Eye size={16} />
                      </button>
                      <button className="btn btn-ghost h-8 w-8 p-0" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button className="btn btn-ghost h-8 w-8 p-0" title="Toggle status">
                        {user.status === 'Active' ? <Lock size={16} /> : <Unlock size={16} />}
                      </button>

                      <div className="relative">
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                          className="btn btn-ghost h-8 w-8 p-0"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {activeDropdown === user.id && (
                          <div className="absolute right-0 mt-1 w-44 card p-1 shadow-dropdown z-20">
                            <button className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors">
                              <Mail size={14} className="text-muted-foreground" />
                              Send Email
                            </button>
                            <button className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors">
                              <Eye size={14} className="text-muted-foreground" />
                              View Activity
                            </button>
                            <div className="border-t border-border my-1" />
                            <button className="w-full px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10 rounded-md flex items-center gap-2 transition-colors">
                              <Trash2 size={14} />
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
        <div className="px-4 py-3 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-muted/10">
          <p className="text-xs text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filteredUsers.length}</span> of <span className="font-medium text-foreground">{users.length}</span> users
          </p>
          <div className="flex items-center gap-1">
            {['Previous', '1', '2', 'Next'].map((label) => (
              <button key={label}
                className={`btn h-8 px-3 text-xs ${label === '1' ? 'btn-primary' : 'btn-outline'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}