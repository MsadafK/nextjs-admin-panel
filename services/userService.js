// services/userService.js
import { supabase } from '@/lib/supabase';

// services/userService.js ke top par:
const parseSupabaseDate = (dateStr) => {
  if (!dateStr) return new Date();
  // Agar Supabase timestamp me 'Z' ya timezone offset (+00:00) nahi hai, toh 'Z' (UTC) add karein
  const normalized =
    typeof dateStr === 'string' && !dateStr.endsWith('Z') && !dateStr.includes('+')
      ? `${dateStr.replace(' ', 'T')}Z`
      : dateStr;
  return new Date(normalized);
};

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return 'Just now';
  const diff = Math.max(0, Math.floor((new Date() - parseSupabaseDate(dateStr)) / 1000));
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
};

const mapUserFromDB = (row) => {
  const name = row.full_name || row.email?.split('@')[0] || 'Unknown';
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

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
    bio: row.bio || '',
    avatarUrl: row.avatar_url || null,
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
      phone: userData.phone || null,
      bio: userData.bio || null,
      avatar_url: userData.avatarUrl || null,
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
      phone: updates.phone || null,
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

  async getActivityData() {
    const [logsRes, usersRes, ordersRes, productsRes] = await Promise.all([
      supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(20),
      supabase.from('users').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(10),
      supabase.from('products').select('*').order('created_at', { ascending: false }).limit(10),
    ]);

    const auditLogs = logsRes.data || [];
    const users = usersRes.data || [];
    const orders = ordersRes.data || [];
    const products = productsRes.data || [];

    const activities = [];

    // 1. Map audit_logs if present
    auditLogs.forEach((log) => {
      const rawAction = (log.action || 'System Event').toLowerCase();
      let type = 'view';
      if (rawAction.includes('login')) type = 'login';
      else if (rawAction.includes('logout')) type = 'logout';
      else if (rawAction.includes('create') || rawAction.includes('add')) type = 'create';
      else if (rawAction.includes('update') || rawAction.includes('edit')) type = 'edit';
      else if (rawAction.includes('delete') || rawAction.includes('suspend')) type = 'delete';

      activities.push({
        id: `log-${log.id}`,
        user: log.user_name || log.user_email?.split('@')[0] || 'System Admin',
        email: log.user_email || 'admin@example.com',
        role: 'Admin',
        action: log.action || 'System Audit Event',
        type,
        time: formatTimeAgo(log.created_at),
        rawDate: log.created_at,
        details: log.details || log.ip_address ? `IP: ${log.ip_address || '127.0.0.1'}` : 'Recorded in public.audit_logs',
        ip: log.ip_address || '192.168.1.1',
        severity: type === 'delete' ? 'Critical' : type === 'edit' ? 'Warning' : 'Info',
      });
    });

    // 2. Map Users activity (Account Created / Suspended / Active)
    users.forEach((u) => {
      const isSuspended = (u.status || '').toLowerCase() === 'suspended' || u.is_deleted;
      const roleCap = u.role ? u.role.charAt(0).toUpperCase() + u.role.slice(1).toLowerCase() : 'User';

      activities.push({
        id: `user-${u.id}`,
        user: u.full_name || u.email?.split('@')[0] || 'User',
        email: u.email,
        role: roleCap,
        action: isSuspended ? 'Account Suspended / Removed' : 'User Account Registered',
        type: isSuspended ? 'delete' : 'create',
        time: formatTimeAgo(u.updated_at || u.created_at),
        rawDate: u.updated_at || u.created_at,
        details: `Department: ${u.department || 'General'} • Role: ${roleCap}${u.bio ? ` • ${u.bio}` : ''}`,
        ip: '192.168.1.10',
        severity: isSuspended ? 'Critical' : 'Info',
      });

      if (u.last_login) {
        activities.push({
          id: `login-${u.id}`,
          user: u.full_name || u.email?.split('@')[0],
          email: u.email,
          role: roleCap,
          action: 'Logged In',
          type: 'login',
          time: formatTimeAgo(u.last_login),
          rawDate: u.last_login,
          details: `Authenticated session (${roleCap})`,
          ip: '192.168.1.15',
          severity: 'Info',
        });
      }
    });

    // 3. Map Orders activity
    orders.forEach((o, idx) => {
      const linkedUser = users[idx % Math.max(1, users.length)];
      activities.push({
        id: `order-${o.id}`,
        user: o.customer_name || linkedUser?.full_name || 'Customer',
        email: o.customer_email || linkedUser?.email || 'customer@example.com',
        role: 'Customer',
        action: 'Placed Order',
        type: 'create',
        time: formatTimeAgo(o.created_at),
        rawDate: o.created_at,
        details: `Order #${String(o.order_number || o.id).slice(0, 8)} — ₹${Number(o.total_amount ?? o.amount ?? 0).toLocaleString()} (${o.status || 'completed'})`,
        ip: '192.168.1.25',
        severity: 'Info',
      });
    });

    // 4. Map Products activity
    products.forEach((p) => {
      activities.push({
        id: `prod-${p.id}`,
        user: 'Catalog Admin',
        email: 'admin@example.com',
        role: 'Admin',
        action: `Updated Catalog: ${p.name}`,
        type: 'edit',
        time: formatTimeAgo(p.updated_at || p.created_at),
        rawDate: p.updated_at || p.created_at,
        details: `SKU: ${p.sku || 'N/A'} • Stock: ${p.stock_quantity ?? 0} units • Price: ₹${Number(p.price ?? 0).toLocaleString()}`,
        ip: '192.168.1.1',
        severity: Number(p.stock_quantity ?? 0) === 0 ? 'Warning' : 'Info',
      });
    });

    activities.sort((a, b) => parseSupabaseDate(b.rawDate) - parseSupabaseDate(a.rawDate));

    const activeUsersCount = users.filter(
      (u) => !u.is_deleted && (u.status || '').toLowerCase() === 'active'
    ).length;

    return {
      activities,
      activeUsersCount,
      totalUsersCount: users.filter((u) => !u.is_deleted).length,
    };
  },
};