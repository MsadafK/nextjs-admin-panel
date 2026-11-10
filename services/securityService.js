import { supabase } from '@/lib/supabase';
import { notificationService } from '@/services/notificationService';

const resultOrEmpty = async (promise) => {
  const { data, error } = await promise;
  if (error) return { data: [], error };
  return { data: data || [], error: null };
};

export const securityService = {
  async getSecurityData() {
    const [users, auditLogs, notifications, apiKeys, permissions] = await Promise.all([
      resultOrEmpty(supabase.from('users').select('*')),
      resultOrEmpty(supabase.from('audit_logs').select('*')),
      notificationService.getNotifications().then((data) => ({ data, error: null })).catch((error) => ({ data: [], error })),
      resultOrEmpty(supabase.from('api_keys').select('*')),
      resultOrEmpty(supabase.from('user_permissions').select('*')),
    ]);
    return {
      users: users.data.filter((user) => user.is_deleted !== true), auditLogs: auditLogs.data,
      notifications: notifications.data, apiKeys: apiKeys.data, permissions: permissions.data,
      errors: [users, auditLogs, notifications, apiKeys, permissions].filter((item) => item.error).map((item) => item.error.message || 'Could not load security records.'),
    };
  },

  async logSecurityCheck() {
    const { data: sample, error: inspectError } = await supabase.from('audit_logs').select('*').limit(1);
    if (inspectError) throw inspectError;
    const columns = sample?.length ? Object.keys(sample[0]) : ['id', 'action', 'event_type', 'resource_type', 'severity', 'details', 'created_at'];
    const candidates = {
      action: 'Manual security check', event_type: 'security_check', resource_type: 'workspace',
      severity: 'info', details: 'Security review initiated from the admin console.', created_at: new Date().toISOString(),
    };
    const payload = Object.fromEntries(Object.entries(candidates).filter(([key]) => columns.includes(key)));
    const { error } = await supabase.from('audit_logs').insert(payload);
    if (error) throw error;
  },

  async updateUserRole(id, role) {
    const { data, error } = await supabase.from('users').update({ role: role.toLowerCase() }).eq('id', id).select('*').single();
    if (error) throw error;
    return data;
  },

  async updateUserStatus(id, status) {
    const { data, error } = await supabase.from('users').update({ status: status.toLowerCase() }).eq('id', id).select('*').single();
    if (error) throw error;
    return data;
  },

  async savePermission(permission) {
    const { data, error } = await supabase.from('user_permissions').upsert({
      user_id: permission.userId,
      permission_name: permission.permissionName,
      resource_type: permission.resourceType,
      access_level: permission.accessLevel,
    }, { onConflict: 'user_id,permission_name,resource_type' }).select('*').single();
    if (error) throw error;
    return data;
  },

  async removePermission(id) {
    const { error } = await supabase.from('user_permissions').delete().eq('id', id);
    if (error) throw error;
  },

  async createApiKey({ keyName, scope, environment, createdBy }) {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    const secret = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret));
    const keyHash = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
    const { data, error } = await supabase.from('api_keys').insert({
      key_name: keyName, key_hash: keyHash, prefix: secret.slice(0, 8), scope, environment, created_by: createdBy,
    }).select('*').single();
    if (error) throw error;
    return { data, secret };
  },

  async revokeApiKey(id) {
    const { data, error } = await supabase.from('api_keys').update({ is_revoked: true }).eq('id', id).select('*').single();
    if (error) throw error;
    return data;
  },
};
