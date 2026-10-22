'use client';

import { useState, useMemo } from 'react';
import {
  Search, Filter, Download, Mail, MoreVertical,
  Edit2, Trash2, Lock, Unlock, UserCheck, UserX,
  ChevronDown, ChevronUp, Eye, X, Plus, RefreshCw
} from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';

const roles    = ['all', 'Admin', 'Manager', 'User'];
const statuses = ['all', 'Active', 'Inactive', 'Suspended'];

const STATUS_STYLES = {
  Active:    'bg-foreground text-background border-foreground',
  Inactive:  'bg-muted text-muted-foreground border-border',
  Suspended: 'bg-destructive/10 text-destructive border-destructive/20',
};

const ROLE_STYLES = {
  Admin:   'bg-primary text-primary-foreground border-primary',
  Manager: 'bg-secondary text-secondary-foreground border-border',
  User:    'bg-muted text-muted-foreground border-border',
};

export default function UserList() {
  const { users, loading, error, refreshUsers, addUser, editUser, removeUser } = useUsers();

  const [searchTerm, setSearchTerm]         = useState('');
  const [filterStatus, setFilterStatus]     = useState('all');
  const [filterRole, setFilterRole]         = useState('all');
  const [sortBy, setSortBy]                 = useState('name');
  const [sortOrder, setSortOrder]           = useState('asc');
  const [selectedUsers, setSelectedUsers]   = useState([]);
  const [showFilters, setShowFilters]       = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [submitting, setSubmitting]         = useState(false);

  /* ── Pagination State ── */
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  /* ── Modal State ('view' | 'edit' | 'create' | null) ── */
  const [modalMode, setModalMode]     = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const filteredUsers = useMemo(() => {
    return users
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
  }, [users, searchTerm, filterStatus, filterRole, sortBy, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const toggleSort = (field) => {
    if (sortBy === field) setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortOrder('asc'); }
  };

  const toggleUserSelection = (id) =>
    setSelectedUsers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const toggleSelectAll = () =>
    setSelectedUsers(selectedUsers.length === paginatedUsers.length ? [] : paginatedUsers.map(u => u.id));

  /* ── Database Actions ── */
  const handleToggleStatus = async (user) => {
    try {
      const nextStatus = user.status === 'Active' ? 'Suspended' : 'Active';
      await editUser(user.id, { ...user, status: nextStatus });
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await removeUser(id);
      setSelectedUsers(prev => prev.filter(item => item !== id));
      setActiveDropdown(null);
    } catch (err) {
      alert('Failed to delete user: ' + err.message);
    }
  };

  const handleOpenModal = (user, mode) => {
    setCurrentUser(
      user
        ? { ...user }
        : { name: '', email: '', role: 'User', status: 'Active', department: 'General' }
    );
    setModalMode(mode);
    setActiveDropdown(null);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    try {
      setSubmitting(true);
      if (modalMode === 'create') {
        await addUser(currentUser);
      } else {
        await editUser(currentUser.id, currentUser);
      }
      setModalMode(null);
      setCurrentUser(null);
    } catch (err) {
      alert('Error saving user: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    const targetList = selectedUsers.length > 0
      ? users.filter(u => selectedUsers.includes(u.id))
      : filteredUsers;

    const headers = ['ID,Name,Email,Role,Department,Status,Last Login'];
    const rows = targetList.map(
      u => `${u.id},"${u.name}","${u.email}",${u.role},"${u.department || ''}",${u.status},"${u.lastLogin}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'users_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <ChevronDown size={12} className="text-muted-foreground/40" />;
    return sortOrder === 'asc'
      ? <ChevronUp size={12} className="text-foreground" />
      : <ChevronDown size={12} className="text-foreground" />;
  };

  const stats = [
    { label: 'Total Users', value: users.length,                                        icon: UserCheck },
    { label: 'Active',      value: users.filter(u => u.status === 'Active').length,     icon: UserCheck },
    { label: 'Inactive',    value: users.filter(u => u.status === 'Inactive').length,   icon: UserX     },
    { label: 'Suspended',   value: users.filter(u => u.status === 'Suspended').length,  icon: Lock      },
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
            Connected to Supabase PostgreSQL (`public.users`)
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button onClick={refreshUsers} className="btn btn-outline" title="Refresh from Database">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => handleOpenModal(null, 'create')} className="btn btn-primary">
            <Plus size={16} />
            Add User
          </button>
          <button onClick={handleExportCSV} className="btn btn-outline">
            <Download size={16} />
            Export {selectedUsers.length > 0 ? `(${selectedUsers.length})` : 'CSV'}
          </button>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="card p-4 border-destructive/40 bg-destructive/10 text-destructive text-sm flex items-center justify-between">
          <span><strong>Database Error:</strong> {error}</span>
          <button onClick={refreshUsers} className="btn btn-outline h-8 text-xs">Retry</button>
        </div>
      )}

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
                  <p className="text-2xl font-semibold tracking-tight text-foreground">
                    {loading ? '…' : s.value}
                  </p>
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
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="input pl-9 w-full"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn ${showFilters ? 'btn-primary' : 'btn-outline'}`}
            >
              <Filter size={16} />
              <span className="hidden sm:inline">Filters</span>
              {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {selectedUsers.length > 0 && (
              <button
                onClick={async () => {
                  for (const id of selectedUsers) {
                    await removeUser(id);
                  }
                  setSelectedUsers([]);
                }}
                className="btn btn-outline text-destructive hover:bg-destructive/10"
              >
                <Trash2 size={16} />
                <span className="hidden sm:inline">Delete</span>
                <span className="bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-full font-semibold ml-1">
                  {selectedUsers.length}
                </span>
              </button>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="px-3 sm:px-4 pb-4 bg-muted/20">
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <div className="flex-1">
                <label className="label uppercase tracking-wide text-xs text-muted-foreground mb-1.5 block">Status</label>
                <select
                  value={filterStatus}
                  onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                  className="input w-full"
                >
                  {statuses.map(s => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="label uppercase tracking-wide text-xs text-muted-foreground mb-1.5 block">Role</label>
                <select
                  value={filterRole}
                  onChange={e => { setFilterRole(e.target.value); setCurrentPage(1); }}
                  className="input w-full"
                >
                  {roles.map(r => <option key={r} value={r}>{r === 'all' ? 'All Roles' : r}</option>)}
                </select>
              </div>
              <div className="flex sm:items-end">
                <button
                  onClick={() => { setFilterStatus('all'); setFilterRole('all'); setSearchTerm(''); setCurrentPage(1); }}
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
                    checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-border accent-foreground cursor-pointer"
                  />
                </th>
                {[
                  { label: 'User',       field: 'name'       },
                  { label: 'Role',       field: 'role'       },
                  { label: 'Department', field: 'department' },
                  { label: 'Status',     field: 'status'     },
                  { label: 'Last Login', field: null         },
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
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx}>
                    <td colSpan={7} className="px-4 py-4">
                      <div className="skeleton h-8 w-full" />
                    </td>
                  </tr>
                ))
              ) : (
                paginatedUsers.map(user => (
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

                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {user.department}
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
                        <button
                          onClick={() => handleOpenModal(user, 'view')}
                          className="btn btn-ghost h-8 w-8 p-0"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenModal(user, 'edit')}
                          className="btn btn-ghost h-8 w-8 p-0"
                          title="Edit User"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className="btn btn-ghost h-8 w-8 p-0"
                          title={user.status === 'Active' ? 'Suspend User' : 'Activate User'}
                        >
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
                              <button
                                onClick={() => {
                                  window.location.href = `mailto:${user.email}`;
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors"
                              >
                                <Mail size={14} className="text-muted-foreground" />
                                Send Email
                              </button>
                              <button
                                onClick={() => handleOpenModal(user, 'view')}
                                className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors"
                              >
                                <Eye size={14} className="text-muted-foreground" />
                                View Profile
                              </button>
                              <div className="border-t border-border my-1" />
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="w-full px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10 rounded-md flex items-center gap-2 transition-colors"
                              >
                                <Trash2 size={14} />
                                Delete User
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}

              {!loading && paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-sm text-muted-foreground">
                    No users found in database matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="px-4 py-3 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-muted/10">
          <p className="text-xs text-muted-foreground">
            Showing <span className="font-medium text-foreground">{paginatedUsers.length}</span> of{' '}
            <span className="font-medium text-foreground">{filteredUsers.length}</span> users
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="btn btn-outline h-8 px-3 text-xs disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`btn h-8 px-3 text-xs ${currentPage === page ? 'btn-primary' : 'btn-outline'}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="btn btn-outline h-8 px-3 text-xs disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ── View / Edit / Create Modal ── */}
      {modalMode && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="card w-full max-w-md p-6 shadow-modal space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-lg font-semibold text-foreground">
                {modalMode === 'view' ? 'User Details' : modalMode === 'create' ? 'Create New User' : 'Edit User'}
              </h2>
              <button
                onClick={() => { setModalMode(null); setCurrentUser(null); }}
                className="btn btn-ghost h-8 w-8 p-0"
              >
                <X size={16} />
              </button>
            </div>

            {modalMode === 'view' ? (
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 pb-2">
                  <div className="w-12 h-12 rounded-full bg-muted border border-border flex items-center justify-center text-foreground font-semibold">
                    {currentUser.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-base text-foreground">{currentUser.name}</p>
                    <p className="text-muted-foreground">{currentUser.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Role</p>
                    <p className="font-medium text-foreground mt-0.5">{currentUser.role}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Status</p>
                    <p className="font-medium text-foreground mt-0.5">{currentUser.status}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Department</p>
                    <p className="font-medium text-foreground mt-0.5">{currentUser.department}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Last Login</p>
                    <p className="font-medium text-foreground mt-0.5">{currentUser.lastLogin}</p>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-border">
                  <button onClick={() => setModalMode('edit')} className="btn btn-primary">
                    <Edit2 size={14} /> Edit User
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveUser} className="space-y-4">
                <div>
                  <label className="label block mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={currentUser.name}
                    onChange={e => setCurrentUser({ ...currentUser, name: e.target.value })}
                    className="input w-full"
                    placeholder="e.g. Mohd Sadaf"
                  />
                </div>
                <div>
                  <label className="label block mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={currentUser.email}
                    onChange={e => setCurrentUser({ ...currentUser, email: e.target.value })}
                    className="input w-full"
                    placeholder="user@example.com"
                  />
                </div>
                <div>
                  <label className="label block mb-1.5">Department</label>
                  <input
                    type="text"
                    value={currentUser.department || ''}
                    onChange={e => setCurrentUser({ ...currentUser, department: e.target.value })}
                    className="input w-full"
                    placeholder="e.g. Engineering, Sales, Support"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label block mb-1.5">Role</label>
                    <select
                      value={currentUser.role}
                      onChange={e => setCurrentUser({ ...currentUser, role: e.target.value })}
                      className="input w-full"
                    >
                      {roles.filter(r => r !== 'all').map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label block mb-1.5">Status</label>
                    <select
                      value={currentUser.status}
                      onChange={e => setCurrentUser({ ...currentUser, status: e.target.value })}
                      className="input w-full"
                    >
                      {statuses.filter(s => s !== 'all').map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => { setModalMode(null); setCurrentUser(null); }}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn btn-primary">
                    {submitting ? 'Saving…' : modalMode === 'create' ? 'Create User' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}