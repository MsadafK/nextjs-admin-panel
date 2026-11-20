import { supabase } from '@/lib/supabase';

// Production demo access is opt-in and should only be enabled on an isolated showcase project.
export const isDemoModeEnabled = process.env.NODE_ENV === 'development'
  || process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE === 'true';

export const DEMO_ACCOUNTS = [
  { name: 'John Doe', email: 'john@nexstore.com', role: 'Admin', department: 'Management', initials: 'JD' },
  { name: 'Sarah Smith', email: 'manager@example.com', role: 'Manager', department: 'Management', initials: 'SS' },
  { name: 'Mohd Sadaf', email: 'mssadaf0@gmail.com', role: 'User', department: 'Engineering', initials: 'MS' },
];

export const mapAuthUser = (row = {}) => {
  const name = row.full_name || row.name || row.email?.split('@')[0] || 'Workspace User';
  const initials = name.trim().split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  return {
    id: row.id || null,
    name,
    email: row.email || '',
    role: String(row.role || 'user').replace(/^./, (letter) => letter.toUpperCase()),
    department: row.department || 'General',
    status: row.is_deleted === true ? 'Suspended' : String(row.status || 'active').replace(/^./, (letter) => letter.toUpperCase()),
    initials: row.initials || initials || 'U',
  };
};

export const authService = {
  async findPublicUserByEmail(email) {
    if (!email) return null;
    const target = email.trim().toLowerCase();
    const { data, error } = await supabase.from('users').select('*').ilike('email', target).limit(1);
    if (error) throw error;
    const row = (data || []).find((user) => String(user.email || '').toLowerCase() === target);
    return row || null;
  },

  async getDemoAccount(account) {
    if (!isDemoModeEnabled) throw new Error('Demo access is disabled for this deployment.');
    const preset = typeof account === 'string'
      ? DEMO_ACCOUNTS.find((item) => item.email.toLowerCase() === account.toLowerCase())
      : account;
    if (!preset) throw new Error('This demo account is not available.');
    const row = await this.findPublicUserByEmail(preset.email).catch(() => null);
    if (!row) return mapAuthUser(preset);
    return { ...mapAuthUser(row), initials: preset.initials || mapAuthUser(row).initials };
  },

  async signInWithEmail(email, password) {
    const normalizedEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
    if (error) throw error;
    if (!data?.user) throw new Error('Supabase Auth did not return a signed-in user.');

    const publicRow = await this.findPublicUserByEmail(normalizedEmail).catch(() => null);
    const user = publicRow ? mapAuthUser(publicRow) : mapAuthUser({
      id: data.user.id,
      email: data.user.email,
      full_name: data.user.user_metadata?.full_name,
      // Auth user metadata is user-editable and must never grant a privileged role.
      role: 'user',
      department: data.user.user_metadata?.department,
    });
    if (user.status.toLowerCase() === 'suspended' || publicRow?.is_deleted) {
      throw new Error('This account is suspended. Contact a workspace administrator.');
    }
    return user;
  },

  async logAuditEvent(user, action, details = '') {
    const { data: sample, error: inspectError } = await supabase.from('audit_logs').select('*').limit(1);
    if (inspectError) throw inspectError;
    const columns = sample?.length ? Object.keys(sample[0]) : [
      'id', 'user_id', 'user_name', 'user_email', 'action', 'module', 'resource_type', 'severity', 'details', 'created_at',
    ];
    const candidate = {
      user_id: user?.id || null,
      user_name: user?.name || 'Workspace User',
      user_email: user?.email || null,
      action,
      module: 'Auth',
      resource_type: 'session',
      severity: 'info',
      details: details || `${action} for ${user?.email || 'workspace user'}`,
      created_at: new Date().toISOString(),
    };
    const payload = Object.fromEntries(Object.entries(candidate).filter(([key]) => columns.includes(key)));
    if (!Object.keys(payload).length) return;
    const { error } = await supabase.from('audit_logs').insert(payload);
    if (error) throw error;
  },
};
