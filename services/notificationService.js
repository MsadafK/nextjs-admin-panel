import { supabase } from '@/lib/supabase';

const FALLBACK_COLUMNS = ['id', 'user_id', 'title', 'message', 'type', 'is_read', 'action_url', 'created_at', 'read_at'];
let columnsCache;
const tags = ['SENT', 'DRAFT', 'ARCHIVED', 'STARRED'];
const DELETED_IDS_KEY = 'deleted_notification_ids';

export const emitNotificationsUpdated = () => {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('notifications:updated'));
};

const readDeletedIds = () => {
  if (typeof window === 'undefined') return [];
  try {
    const value = window.localStorage.getItem(DELETED_IDS_KEY);
    return value ? JSON.parse(value).map(String) : [];
  } catch { return []; }
};

const rememberDeletedId = (id) => {
  if (typeof window === 'undefined') return;
  try {
    const ids = new Set(readDeletedIds());
    ids.add(String(id));
    window.localStorage.setItem(DELETED_IDS_KEY, JSON.stringify([...ids]));
  } catch { /* local suppression is best-effort when storage is unavailable */ }
};

const inspectColumns = async () => {
  if (columnsCache) return columnsCache;
  const { data, error } = await supabase.from('notifications').select('*').limit(1);
  if (error) throw error;
  columnsCache = data?.length ? Object.keys(data[0]) : FALLBACK_COLUMNS;
  return columnsCache;
};

const parseRow = (row) => {
  let body = row.message ?? row.content ?? row.body ?? '';
  const flags = {};
  for (const tag of tags) {
    const pattern = new RegExp(`\\[${tag}\\]`, 'i');
    const key = tag.toLowerCase();
    const dedicated = key === 'starred' ? row.is_starred ?? row.starred : key === 'archived' ? row.is_archived ?? row.archived : row[key];
    flags[key] = Boolean(dedicated ?? pattern.test(body));
    body = body.replace(new RegExp(`\\[${tag}\\]\\s*`, 'ig'), '');
  }
  return {
    id: row.id,
    title: row.title ?? row.subject ?? 'Untitled message',
    body,
    type: row.type ?? 'info',
    isRead: Boolean(row.is_read ?? row.read ?? row.read_at ?? false),
    createdAt: row.created_at ?? row.createdAt ?? null,
    userId: row.user_id ?? null,
    recipientId: row.recipient_id ?? null,
    category: row.category ?? row.type ?? 'General',
    actionUrl: row.action_url ?? '',
    ...flags,
  };
};

const existingTag = (body, tag) => new RegExp(`\\[${tag}\\]`, 'i').test(body || '');

export const notificationService = {
  async getMessages() {
    const columns = await inspectColumns();
    let request = supabase.from('notifications').select('*');
    const sortColumn = ['created_at', 'createdAt', 'timestamp'].find((column) => columns.includes(column));
    if (sortColumn) request = request.order(sortColumn, { ascending: false });
    const { data, error } = await request;
    if (error) throw error;
    columnsCache = data?.length ? Object.keys(data[0]) : columnsCache;
    const deletedIds = new Set(readDeletedIds());
    return (data || [])
      .filter((row) => !deletedIds.has(String(row.id)) && !/\[DELETED\]/i.test(`${row.message ?? row.content ?? row.body ?? ''} ${row.title ?? row.subject ?? ''}`))
      .map(parseRow);
  },

  async getNotifications() { return this.getMessages(); },

  async getUnreadCount() {
    const messages = await this.getMessages();
    return messages.filter((message) => !message.isRead && !message.draft && !message.archived).length;
  },

  async createMessage({ title, body, status = 'SENT', userId = null, type = 'info', isRead = false }) {
    const columns = await inspectColumns();
    const markers = tags.filter((tag) => tag !== 'STARRED' && (tag === status || (status === 'SENT' && tag === 'SENT'))).map((tag) => `[${tag}]`).join(' ');
    const messageBody = `${markers}${markers ? '\n' : ''}${body || ''}`;
    const candidate = { title, subject: title, message: messageBody, content: messageBody, body: messageBody, type, category: type, is_read: isRead, read: isRead, user_id: userId, recipient_id: userId, action_url: null };
    const payload = Object.fromEntries(Object.entries(candidate).filter(([key, value]) => columns.includes(key) && value !== undefined));
    const { data, error } = await supabase.from('notifications').insert(payload).select('*').single();
    if (error) throw error;
    if (data) columnsCache = Object.keys(data);
    const result = parseRow(data);
    emitNotificationsUpdated();
    return result;
  },

  async updateMessage(id, updates) {
    const columns = await inspectColumns();
    const { data: raw, error: fetchError } = await supabase.from('notifications').select('*').eq('id', id).single();
    if (fetchError) throw fetchError;
    const current = parseRow(raw);
    const nextBody = updates.body ?? current.body;
    const flagState = { sent: current.sent, draft: current.draft, archived: current.archived, starred: current.starred, ...updates };
    let body = nextBody;
    for (const tag of tags) {
      const key = tag.toLowerCase();
      body = body.replace(new RegExp(`\\[${tag}\\]\\s*`, 'ig'), '');
      if (flagState[key]) body = `[${tag}] ${body}`;
    }
    const candidate = {
      title: updates.title ?? current.title,
      subject: updates.title ?? current.title,
      message: body, content: body, body,
      type: updates.type ?? current.type,
      category: updates.type ?? current.category,
      is_read: updates.isRead ?? current.isRead, read: updates.isRead ?? current.isRead,
      read_at: updates.isRead === true ? new Date().toISOString() : updates.isRead === false ? null : undefined,
      is_starred: flagState.starred, is_archived: flagState.archived,
    };
    const payload = Object.fromEntries(Object.entries(candidate).filter(([key, value]) => columns.includes(key) && value !== undefined));
    const { data, error } = await supabase.from('notifications').update(payload).eq('id', id).select('*').single();
    if (error) throw error;
    const result = parseRow(data);
    emitNotificationsUpdated();
    return result;
  },

  async deleteNotification(id) {
    rememberDeletedId(id);
    let columns;
    try { columns = await inspectColumns(); }
    catch (error) {
      console.warn('Notification delete is suppressed locally because its schema could not be inspected:', error.message);
      emitNotificationsUpdated();
      return;
    }
    let existing = null;
    try {
      const result = await supabase.from('notifications').select('*').eq('id', id).maybeSingle();
      existing = result.data;
    } catch { /* continue with the id-based suppression fallback */ }
    let data = null;
    let error = null;
    try {
      const result = await supabase.from('notifications').delete().eq('id', id).select();
      data = result.data;
      error = result.error;
    } catch (deleteError) { error = deleteError; }
    if (error || !data?.length) {
      const source = existing || {};
      const body = source.message ?? source.content ?? source.body ?? '';
      const title = source.title ?? source.subject ?? '';
      const deletedBody = /^\[DELETED\]/i.test(body) ? body : `[DELETED] ${body}`;
      const deletedTitle = /^\[DELETED\]/i.test(title) ? title : `[DELETED] ${title}`;
      const fallback = {
        message: deletedBody, content: deletedBody, body: deletedBody,
        title: deletedTitle, subject: deletedTitle,
        is_read: true, read: true, read_at: new Date().toISOString(),
      };
      const payload = Object.fromEntries(Object.entries(fallback).filter(([key]) => columns.includes(key)));
      if (payload && Object.keys(payload).length) {
        try {
          const { error: softDeleteError } = await supabase.from('notifications').update(payload).eq('id', id);
          if (softDeleteError) console.warn('Notification soft-delete was suppressed locally:', softDeleteError.message);
        } catch (softDeleteError) { console.warn('Notification soft-delete was suppressed locally:', softDeleteError.message); }
      }
    }
    emitNotificationsUpdated();
  },

  async deleteMessage(id) { return this.deleteNotification(id); },
};

export const messageService = notificationService;
