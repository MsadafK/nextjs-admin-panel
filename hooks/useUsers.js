// hooks/useUsers.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { userService } from '@/services/userService';

export function useUsers() {
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
    const created = await userService.createUser(newUser);
    setUsers((prev) => [created, ...prev]);
    return created;
  };

  const editUser = async (id, updates) => {
    const updated = await userService.updateUser(id, updates);
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    return updated;
  };

  const removeUser = async (id) => {
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