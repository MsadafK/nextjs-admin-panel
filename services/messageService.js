// services/messageService.js
import { supabase } from '@/lib/supabase';

const parseSupabaseDate = (dateStr) => {
  if (!dateStr) return new Date();
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

const getInitials = (name = 'System') =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

export const messageService = {
  async getMessages() {
    const [notifRes, usersRes] = await Promise.all([
      supabase.from('notifications').select('*').order('created_at', { ascending: false }),
      supabase.from('users').select('id, full_name, email, role').eq('is_deleted', false),
    ]);

    if (notifRes.error) throw notifRes.error;

    const notifications = notifRes.data || [];
    const users = usersRes.data || [];
    const userMap = {};
    users.forEach((u) => {
      userMap[u.id] = u;
    });

    return notifications.map((row, idx) => {
      const linkedUser = userMap[row.user_id] || users[idx % Math.max(1, users.length)] || {};
      const sender = row.sender_name || linkedUser.full_name || 'System Notification';
      const email = row.sender_email || linkedUser.email || 'system@adminpro.com';
      const rawType = (row.type || row.priority || 'normal').toLowerCase();

      let priority = 'normal';
      if (rawType.includes('high') || rawType.includes('error') || rawType.includes('warning') || rawType.includes('urgent')) {
        priority = 'high';
      } else if (rawType.includes('low') || rawType.includes('info')) {
        priority = 'low';
      }

      const isRead = Boolean(row.is_read ?? row.read ?? false);

      return {
        id: row.id,
        sender,
        email,
        subject: row.title || row.subject || 'New Notification',
        preview: row.message || row.content || row.body || 'No message content provided.',
        time: formatTimeAgo(row.created_at),
        rawDate: row.created_at,
        priority,
        hasAttachment: Boolean(row.has_attachment),
        starred: Boolean(row.is_starred ?? false),
        avatar: getInitials(sender),
        unread: !isRead,
      };
    });
  },

  async createMessage({ title, message, priority = 'normal', userId = null }) {
    // Inspect existing columns in notifications to avoid unknown column errors
    const { data: sample } = await supabase.from('notifications').select('*').limit(1);
    const cols = sample && sample[0] ? Object.keys(sample[0]) : null;

    let targetUserId = userId;
    if (!targetUserId) {
      const { data: uData } = await supabase.from('users').select('id').limit(1);
      targetUserId = uData?.[0]?.id || null;
    }

    const candidate = {
      title,
      message,
      type: priority === 'high' ? 'warning' : 'info',
      is_read: false,
      user_id: targetUserId,
    };

    const payload = {};
    if (cols) {
      Object.keys(candidate).forEach((k) => {
        if (cols.includes(k) && candidate[k] !== undefined) {
          payload[k] = candidate[k];
        }
      });
      if (cols.includes('subject') && !payload.title) payload.subject = title;
      if (cols.includes('content') && !payload.message) payload.content = message;
    } else {
      Object.assign(payload, candidate);
    }

    const { data, error } = await supabase
      .from('notifications')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async markAsRead(id) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  async deleteMessages(ids) {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .in('id', ids);

    if (error) throw error;
    return true;
  },
};