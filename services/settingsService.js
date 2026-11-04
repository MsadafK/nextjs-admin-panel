import { supabase } from '@/lib/supabase';

export const settingsService = {
  async getAdminProfile() {
    let authUserId = null;
    try {
      const { data } = await supabase.auth.getUser();
      authUserId = data?.user?.id || null;
    } catch { /* use the first admin profile when auth is unavailable */ }

    const { data: users, error } = await supabase.from('users').select('*');
    if (error) throw error;
    const rows = (users || []).filter((user) => user.is_deleted !== true);
    const profile = rows.find((user) => String(user.id) === String(authUserId))
      || rows.find((user) => String(user.role || '').toLowerCase() === 'admin')
      || rows[0]
      || null;
    return profile;
  },

  async updateAdminProfile(id, updates) {
    const payload = {
      full_name: updates.name.trim(),
      email: updates.email.trim(),
      department: updates.department.trim(),
      role: updates.role.toLowerCase(),
    };
    const { data, error } = await supabase.from('users').update(payload).eq('id', id).select('*').single();
    if (error) throw error;
    return data;
  },
};
