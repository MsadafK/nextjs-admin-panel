// app/users/all/list/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  UserCheck,
  UserX,
  Lock,
  Search,
  Filter,
  Plus,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  X,
  Check,
} from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';

export default function UserListPage() {
  const router = useRouter();
  const { users, stats, loading, error, refreshUsers, editUser, removeUser } = useUsers();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // View / Edit Modal State
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'view' | 'edit'
  const [submitting, setSubmitting] = useState(false);

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.department?.toLowerCase().includes(q);
    const matchRole = roleFilter === 'all' || (u.role || 'user').toLowerCase() === roleFilter;
    const matchStatus =
      statusFilter === 'all' || (u.status || 'active').toLowerCase() === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const handleToggleSuspend = async (user) => {
    const nextStatus = (user.status || '').toLowerCase() === 'suspended' ? 'active' : 'suspended';
    try {
      await editUser(user.id, { ...user, status: nextStatus });
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete user "${user.name}" from Supabase?`)) return;
    try {
      await removeUser(user.id);
    } catch (err) {
      alert('Failed to delete user: ' + err.message);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      setSubmitting(true);
      await editUser(selectedUser.id, selectedUser);
      setModalMode(null);
      setSelectedUser(null);
    } catch (err) {
      alert('Failed to update user: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Name,Email,Role,Department,Status,Last Login'];
    const rows = filteredUsers.map(
      (u) =>
        `"${u.name}","${u.email}","${u.role}","${u.department || 'General'}","${u.status}","${u.lastLogin || 'Never'}"`
    );
    const csv = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', 'users_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-container max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground mb-1">
            User List
          </h1>
          <p className="text-sm text-muted-foreground">
            Connected to Supabase PostgreSQL (`public.users`)
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={refreshUsers} className="btn btn-outline" title="Sync Users">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => router.push('/users/add/single')}
            className="btn btn-primary bg-foreground text-background hover:bg-foreground/90"
          >
            <Plus size={16} className="mr-2" />
            Add User
          </button>
          <button onClick={handleExportCSV} className="btn btn-outline">
            <Download size={16} className="mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="card p-4 border border-foreground bg-muted text-foreground text-sm">
          <strong>Database Error:</strong> {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: stats?.total ?? users.length, icon: Users },
          {
            label: 'Active',
            value:
              stats?.active ??
              users.filter((u) => (u.status || 'active').toLowerCase() === 'active').length,
            icon: UserCheck,
          },
          {
            label: 'Inactive',
            value:
              stats?.inactive ??
              users.filter((u) => (u.status || '').toLowerCase() === 'inactive').length,
            icon: UserX,
          },
          {
            label: 'Suspended',
            value:
              stats?.suspended ??
              users.filter((u) => (u.status || '').toLowerCase() === 'suspended').length,
            icon: Lock,
          },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="card p-5 shadow-card border border-border flex items-start justify-between"
            >
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {card.label}
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {loading ? '…' : card.value}
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-muted border border-border">
                <Icon size={18} className="text-foreground" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Search & Filters */}
      <div className="card p-4 shadow-card border border-border space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, email, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-9 w-full"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-outline"
          >
            <Filter size={15} className="mr-2" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-border">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input w-full"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input w-full"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="card p-0 overflow-hidden shadow-card border border-border">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground flex items-center justify-center gap-2">
            <RefreshCw className="animate-spin" size={18} />
            Loading users from Supabase...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No users match your search.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase text-xs">
                    User
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase text-xs">
                    Role
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase text-xs">
                    Department
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase text-xs">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase text-xs">
                    Last Login
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground uppercase text-xs">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => {
                  const initials = (user.name || 'U')
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);
                  const role = (user.role || 'User').toLowerCase();
                  const status = (user.status || 'Active').toLowerCase();

                  return (
                    <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center font-mono text-xs font-bold text-foreground">
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${
                            role === 'admin'
                              ? 'bg-foreground text-background border-foreground'
                              : 'bg-muted text-foreground border-border'
                          }`}
                        >
                          {user.role || 'User'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-foreground">
                        {user.department || 'General'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${
                            status === 'active'
                              ? 'bg-foreground text-background border-foreground'
                              : status === 'suspended'
                              ? 'bg-background text-foreground border-foreground'
                              : 'bg-muted text-muted-foreground border-border'
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground text-xs">
                        {user.lastLogin || 'Never'}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setModalMode('view');
                            }}
                            className="btn btn-ghost h-8 w-8 p-0 text-foreground"
                            title="View Details"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser({ ...user });
                              setModalMode('edit');
                            }}
                            className="btn btn-ghost h-8 w-8 p-0 text-foreground"
                            title="Edit User"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={() => handleToggleSuspend(user)}
                            className="btn btn-ghost h-8 w-8 p-0 text-foreground"
                            title={status === 'suspended' ? 'Activate User' : 'Suspend User'}
                          >
                            <Lock size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            className="btn btn-ghost h-8 w-8 p-0 text-foreground"
                            title="Delete User"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View / Edit Modal */}
      {modalMode && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="card w-full max-w-md p-6 shadow-modal space-y-4 border border-border bg-background">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-lg font-semibold text-foreground">
                {modalMode === 'view' ? 'User Profile Details' : 'Edit User'}
              </h2>
              <button onClick={() => setModalMode(null)} className="btn btn-ghost h-8 w-8 p-0">
                <X size={16} />
              </button>
            </div>

            {modalMode === 'view' ? (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-semibold text-foreground">{selectedUser.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Email</span>
                  <span className="text-foreground">{selectedUser.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Role</span>
                  <span className="font-mono uppercase text-foreground">{selectedUser.role}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Department</span>
                  <span className="text-foreground">{selectedUser.department || 'General'}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-mono uppercase text-foreground">{selectedUser.status}</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="label block mb-1 text-xs uppercase font-semibold">Name</label>
                  <input
                    type="text"
                    required
                    value={selectedUser.name || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="label block mb-1 text-xs uppercase font-semibold">
                    Department
                  </label>
                  <input
                    type="text"
                    value={selectedUser.department || ''}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, department: e.target.value })
                    }
                    className="input w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label block mb-1 text-xs uppercase font-semibold">Role</label>
                    <select
                      value={(selectedUser.role || 'user').toLowerCase()}
                      onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                      className="input w-full"
                    >
                      <option value="user">User</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="label block mb-1 text-xs uppercase font-semibold">
                      Status
                    </label>
                    <select
                      value={(selectedUser.status || 'active').toLowerCase()}
                      onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value })}
                      className="input w-full"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setModalMode(null)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary bg-foreground text-background hover:bg-foreground/90"
                  >
                    <Check size={15} className="mr-1.5" />
                    {submitting ? 'Saving...' : 'Save Changes'}
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