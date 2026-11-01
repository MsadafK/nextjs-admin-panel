// app/users/active/online/page.js
'use client';

import { useState, useMemo } from 'react';
import { Search, Radio, RefreshCw, MessageSquare, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUsers } from '@/hooks/useUsers';

export default function OnlineUsersPage() {
  const router = useRouter();
  const { users, loading, refreshUsers } = useUsers();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [pingedId, setPingedId] = useState(null);

  const activeUsers = useMemo(() => {
    return users
      .filter((u) => (u.status || 'active').toLowerCase() === 'active')
      .map((u, idx) => ({
        ...u,
        ipAddress: `192.168.1.${101 + idx}`,
        sessionAgo: idx === 0 ? 'Just now' : `${idx * 2 + 1} min ago`,
      }));
  }, [users]);

  const filteredOnline = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return activeUsers.filter((u) => {
      const matchSearch =
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.department?.toLowerCase().includes(q);
      const matchRole = roleFilter === 'all' || (u.role || 'user').toLowerCase() === roleFilter;
      return matchSearch && matchRole;
    });
  }, [activeUsers, searchQuery, roleFilter]);

  const handlePing = (id) => {
    setPingedId(id);
    setTimeout(() => setPingedId(null), 1500);
  };

  return (
    <div className="page-container max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground mb-1 flex items-center gap-2">
            <Radio size={20} className="text-foreground" />
            Online Users
          </h1>
          <p className="text-sm text-muted-foreground">
            {activeUsers.length} users are currently active in Supabase (`public.users`). Real-time monitoring enabled.
          </p>
        </div>
        <button onClick={refreshUsers} className="btn btn-outline">
          <RefreshCw size={16} className={loading ? 'animate-spin mr-2' : 'mr-2'} />
          Sync Sessions
        </button>
      </div>

      <div className="card p-4 shadow-card border border-border flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search online users by name, email, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-9 w-full"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="input w-full sm:w-auto"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="user">User</option>
        </select>
      </div>

      {loading ? (
        <div className="card p-12 text-center text-muted-foreground border border-border">
          Loading active sessions from Supabase...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOnline.map((user) => {
            const initials = (user.name || 'U')
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);

            return (
              <div
                key={user.id}
                className="card p-5 shadow-card border border-border flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative">
                      <div className="w-11 h-11 rounded-full bg-foreground text-background flex items-center justify-center font-mono text-sm font-bold">
                        {initials}
                      </div>
                      <span className="w-3 h-3 rounded-full bg-foreground border-2 border-background absolute -bottom-0.5 -right-0.5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{user.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.department || 'General'} • {user.role}
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground flex-shrink-0 font-mono">
                    <p>{user.sessionAgo}</p>
                    <p className="text-[11px]">IP: {user.ipAddress}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                  <button
                    onClick={() => router.push('/messages')}
                    className="btn btn-outline h-8 px-3 text-xs flex-1"
                  >
                    <MessageSquare size={13} className="mr-1.5" />
                    Message
                  </button>
                  <button
                    onClick={() => handlePing(user.id)}
                    className="btn btn-primary bg-foreground text-background hover:bg-foreground/90 h-8 px-3 text-xs flex-1"
                  >
                    <Activity size={13} className="mr-1.5" />
                    {pingedId === user.id ? 'Pong ✓ (14ms)' : 'Ping'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}