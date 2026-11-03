'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Archive, Check, Mail, Pencil, RefreshCw, Search, Send, Star, Trash2 } from 'lucide-react';
import { notificationService } from '@/services/notificationService';
import { supabase } from '@/lib/supabase';

const TITLES = {
  inbox: 'Inbox', 'inbox/unread': 'Unread Messages', 'inbox/team': 'Team Messages', 'inbox/priority': 'Priority Messages',
  sent: 'Sent Messages', 'sent/recent': 'Recent Sent', 'sent/scheduled': 'Scheduled Messages', 'sent/status': 'Delivery Status',
  drafts: 'Drafts', archived: 'Archived Messages', 'archived/conversations': 'Archived Conversations', 'archived/date': 'Archived by Date', 'archived/tags': 'Archived by Tags', compose: 'Compose Message', all: 'Messages & Notifications',
};

export default function MessagesManager({ mode = 'all' }) {
  const composeMode = mode === 'compose';
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [formOpen, setFormOpen] = useState(composeMode);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true); setError('');
    try { setMessages(await notificationService.getMessages()); }
    catch (err) { setError(err.message || 'Could not load notifications.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);

  const syncMessages = useCallback(async () => {
    try { setMessages(await notificationService.getNotifications()); }
    catch (err) { setError(err.message || 'Could not sync notifications.'); }
  }, []);
  useEffect(() => {
    const handleUpdated = () => { syncMessages(); };
    window.addEventListener('notifications:updated', handleUpdated);
    const channel = supabase.channel('notifications-sync-messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, handleUpdated)
      .subscribe();
    return () => {
      window.removeEventListener('notifications:updated', handleUpdated);
      supabase.removeChannel(channel);
    };
  }, [syncMessages]);

  const stats = useMemo(() => [
    ['Total Messages', messages.length],
    ['Unread', messages.filter((m) => !m.isRead && !m.draft && !m.archived && !m.sent).length],
    ['Sent', messages.filter((m) => m.sent).length],
    ['Archived', messages.filter((m) => m.archived).length],
  ], [messages]);

  const visible = useMemo(() => messages.filter((m) => {
    const q = query.toLowerCase();
    const matches = `${m.title} ${m.body}`.toLowerCase().includes(q);
    if (!matches) return false;
    if (mode === 'compose') return true;
    if (mode === 'drafts') return m.draft;
    if (mode.startsWith('archived')) return m.archived;
    if (mode === 'sent' || mode.startsWith('sent/')) return m.sent && !m.draft;
    if (mode === 'inbox/unread') return !m.isRead && !m.archived && !m.sent && !m.draft;
    if (mode === 'inbox/team') return /team/i.test(m.title + m.body) && !m.archived;
    if (mode === 'inbox/priority') return /urgent|high|priority/i.test(m.type + m.title + m.body) && !m.archived;
    if (mode === 'inbox') return !m.archived && !m.sent && !m.draft;
    return !m.archived && !m.draft;
  }), [messages, mode, query]);

  const save = async (status) => {
    if (!title.trim() || !body.trim()) return;
    setSaving(true); setError('');
    try {
      await notificationService.createMessage({ title: title.trim(), body: body.trim(), status });
      setTitle(''); setBody('');
      if (!composeMode) setFormOpen(false);
      await refresh();
    } catch (err) { setError(err.message || 'Could not save message.'); }
    finally { setSaving(false); }
  };

  const update = async (message, patch) => {
    setError('');
    const previous = message;
    setMessages((current) => current.map((item) => item.id === message.id ? { ...item, ...patch } : item));
    try {
      const updated = await notificationService.updateMessage(message.id, patch);
      setMessages((current) => current.map((item) => item.id === message.id ? updated : item));
    } catch (err) {
      setMessages((current) => current.map((item) => item.id === message.id ? previous : item));
      setError(err.message || 'Could not update message.');
    }
  };
  const remove = async (message) => {
    setError('');
    setMessages((current) => current.filter((item) => item.id !== message.id));
    try { await notificationService.deleteNotification(message.id); }
    catch (err) { setError(err.message || 'Could not delete message.'); }
  };

  return <main className="min-h-screen space-y-5 bg-background p-6 text-foreground">
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5"><div><h1 className="text-2xl font-semibold">{TITLES[mode] || TITLES.all}</h1><p className="mt-1 text-sm text-muted-foreground">Messages and notifications stored in Supabase.</p></div><div className="flex gap-2"><button onClick={refresh} disabled={loading} className="inline-flex items-center gap-2 rounded-md border border-border bg-muted px-4 py-2"><RefreshCw size={16} className={loading ? 'animate-spin' : ''}/> Refresh</button><button onClick={() => setFormOpen(true)} className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-background"><Pencil size={16}/> Compose</button></div></header>
    <section aria-label="Message summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{stats.map(([label, value]) => <article key={label} className="rounded-lg border border-border bg-muted p-4"><p className="text-sm">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p></article>)}</section>
    {error && <p role="alert" className="rounded-md border border-border bg-muted p-3 text-sm">{error}</p>}
    {(formOpen || composeMode) && <form onSubmit={(e) => { e.preventDefault(); save('SENT'); }} className="space-y-3 rounded-lg border border-border bg-muted p-5"><h2 className="text-lg font-semibold">Compose message</h2><label className="block text-sm">Subject<input required maxLength={255} value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-background p-3"/></label><label className="block text-sm">Message<textarea required rows={5} value={body} onChange={(e) => setBody(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-background p-3"/></label><div className="flex justify-end gap-2">{!composeMode && <button type="button" onClick={() => setFormOpen(false)} className="rounded-md border border-border px-4 py-2">Cancel</button>}<button type="button" disabled={saving} onClick={() => save('DRAFT')} className="rounded-md border border-border px-4 py-2">Save draft</button><button disabled={saving} className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-background"><Send size={15}/>{saving ? 'Saving…' : 'Send'}</button></div></form>}
    <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3"><Search size={16}/><input aria-label="Search messages" placeholder="Search messages" value={query} onChange={(e) => setQuery(e.target.value)} className="w-full bg-background px-2 py-3 outline-none"/></div>
    {loading ? <p className="py-10 text-center">Loading messages…</p> : visible.length === 0 ? <div className="rounded-lg border border-border bg-muted p-10 text-center"><Mail className="mx-auto mb-3"/><p>No messages found.</p></div> : <section className="space-y-3">{visible.map((message) => <article key={message.id} className="rounded-lg border border-border bg-background p-4"><div className="flex flex-wrap items-start justify-between gap-4"><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h2 className="truncate font-semibold">{message.title}</h2>{!message.isRead && <span className="rounded-full bg-foreground px-2 py-0.5 text-xs text-background">Unread</span>}{message.starred && <Star size={15} fill="currentColor"/>}</div><p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{message.body}</p><p className="mt-2 text-xs text-muted-foreground">{message.createdAt ? new Date(message.createdAt).toLocaleString() : 'Date unavailable'}{message.draft ? ' · Draft' : message.archived ? ' · Archived' : message.sent ? ' · Sent' : ''}</p></div><div className="flex flex-wrap gap-2"><button title={message.isRead ? 'Mark unread' : 'Mark read'} onClick={() => update(message, { isRead: !message.isRead })} className="rounded-md border border-border p-2">{message.isRead ? <Mail size={16}/> : <Check size={16}/>}</button><button title={message.archived ? 'Unarchive' : 'Archive'} onClick={() => update(message, { archived: !message.archived })} className="rounded-md border border-border p-2"><Archive size={16}/></button><button title={message.starred ? 'Unstar' : 'Star'} onClick={() => update(message, { starred: !message.starred })} className="rounded-md border border-border p-2"><Star size={16}/></button><button title="Delete" onClick={() => remove(message)} className="rounded-md border border-border p-2"><Trash2 size={16}/></button></div></div></article>)}</section>}
  </main>;
}
