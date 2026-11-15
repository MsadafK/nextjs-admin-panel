// hooks/useUsers.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { userService } from '@/services/userService';
import { useAuth } from '@/app/contexts/AuthContext';

export function useUsers() {
  const { isAdmin, isManager } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to load users from Supabase');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const addUser = async (newUser) => {
    if (!isManager) throw new Error('Creating users requires Manager or Admin privileges.');
    const safeUser = isAdmin ? newUser : { ...newUser, role: 'user', status: 'active' };
    const created = await userService.createUser(safeUser);
    setUsers((prev) => [created, ...prev]);
    return created;
  };

  const editUser = async (id, updates) => {
    if (!isManager) throw new Error('Editing users requires Manager or Admin privileges.');
    const current = users.find((user) => String(user.id) === String(id));
    if (!isAdmin && current && ((updates.role && String(updates.role).toLowerCase() !== String(current.role || 'user').toLowerCase()) || (updates.status && String(updates.status).toLowerCase() !== String(current.status || 'active').toLowerCase()))) {
      throw new Error('Changing user roles or status requires Admin privileges.');
    }
    const updated = await userService.updateUser(id, updates);
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    return updated;
  };

  const removeUser = async (id) => {
    if (!isAdmin) throw new Error('Deleting users requires Admin privileges.');
    await userService.SoftDeleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return {
    users,
    loading,
    error,
    refreshUsers: fetchUsers,
    addUser,
    editUser,
    removeUser,
  };
}
