// services/userService.js
import { supabase } from '@/lib/supabase';

// Format DB row to UI friendly object
const mapUserFromDB = (row) => {
  const name = row.full_name || row.email?.split('@')[0] || 'Unknown';
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Capitalize role & status for UI badges (e.g., 'admin' -> 'Admin')
  const formatCap = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

  return {
    id: row.id,
    name,
    email: row.email,
    role: formatCap(row.role || 'user'),
    status: formatCap(row.status || 'active'),
    department: row.department || 'General',
    phone: row.phone || '',
    avatar: initials,
    lastLogin: row.last_login
      ? new Date(row.last_login).toLocaleDateString()
      : 'Never',
    createdAt: row.created_at,
  };
};

export const userService = {
  async getUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapUserFromDB);
  },

  async createUser(userData) {
    const payload = {
      id: crypto.randomUUID(),
      full_name: userData.name,
      email: userData.email,
      role: (userData.role || 'User').toLowerCase(),
      status: (userData.status || 'Active').toLowerCase(),
      department: userData.department || 'General',
      is_deleted: false,
    };

    const { data, error } = await supabase
      .from('users')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return mapUserFromDB(data);
  },

  async updateUser(id, updates) {
    const payload = {
      full_name: updates.name,
      email: updates.email,
      role: updates.role?.toLowerCase(),
      status: updates.status?.toLowerCase(),
      department: updates.department,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('users')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapUserFromDB(data);
  },

  async SoftDeleteUser(id) {
    const { error } = await supabase
      .from('users')
      .update({ is_deleted: true, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
    return true;
  },
};