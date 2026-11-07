'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Archive, Bell, Check, Eye, Mail, RefreshCw, Search, Send, Star, Trash2, X } from 'lucide-react';
import { notificationService } from '@/services/notificationService';
import { userService } from '@/services/userService';
import { supabase } from '@/lib/supabase';

const TITLES = {
  inbox: 'Workspace Inbox', 'inbox/unread': 'Unread Messages', 'inbox/team': 'Team Messages', 'inbox/priority': 'Priority Messages',
  sent: 'Sent & Dispatched', 'sent/recent': 'Recent Sent', 'sent/scheduled': 'Scheduled Messages', 'sent/status': 'Delivery Status',
  drafts: 'Draft Messages', archived: 'Archived / Read', 'archived/conversations': 'Archived Conversations', 'archived/date': 'Archived by Date', 'archived/tags': 'Archived by Tags',
  compose: 'Compose Message', all: 'Messages & Notifications', notifications: 'Notification Center',
};
const control = 'h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground outline-none';
const moneylessDate = (value) => value ? new Date(value).toLocaleString() : 'Date unavailable';

export default function MessagesManager({ mode = 'all' }) {
  const composeMode = mode === 'compose';
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [readFilter, setReadFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [formOpen, setFormOpen] = useState(composeMode);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [recipient, setRecipient] = useState('all');
  const [category, setCategory] = useState('General');
  const [isUnread, setIsUnread] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true); setError('');
    try { setMessages(await notificationService.getMessages()); }
    catch (err) { setError(err.message || 'Could not load notifications.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { refresh(); userService.getUsers().then(setUsers).catch(() => setUsers([])); }, [refresh]);

  const syncMessages = useCallback(async () => {
    try { setMessages(await notificationService.getMessages()); }
    catch (err) { setError(err.message || 'Could not sync notifications.'); }
  }, []);
  useEffect(() => {
    const handleUpdated = () => { syncMessages(); };
    window.addEventListener('notifications:updated', handleUpdated);
    const channel = supabase.channel('notifications-sync-messages-page')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, handleUpdated)
      .subscribe();
    return () => { window.removeEventListener('notifications:updated', handleUpdated); supabase.removeChannel(channel); };
  }, [syncMessages]);

  const stats = useMemo(() => [
    ['Total Messages', messages.length, 'LIVE'],
    ['Unread Inbox', messages.filter((m) => !m.isRead && !m.draft && !m.archived && !m.sent).length, 'LIVE'],
    ['Read / Resolved', `${messages.filter((m) => m.isRead).length} · ${messages.length ? Math.round(messages.filter((m) => m.isRead).length / messages.length * 100) : 0}%`, 'LIVE'],
    ['Priority / System Alerts', messages.filter((m) => /system|security|priority|urgent|alert/i.test(`${m.type} ${m.title}`)).length, 'LIVE'],
  ], [messages]);

  const visible = useMemo(() => messages.filter((m) => {
    const q = query.toLowerCase();
    const sender = users.find((user) => String(user.id) === String(m.userId));
    const haystack = `${m.title} ${m.body} ${m.type} ${sender?.name || ''} ${sender?.email || ''}`.toLowerCase();
    if (!haystack.includes(q)) return false;
    if (readFilter === 'unread' && m.isRead) return false;
    if (readFilter === 'read' && !m.isRead) return false;
    if (typeFilter !== 'all' && !`${m.type} ${m.title}`.toLowerCase().includes(typeFilter)) return false;
    if (mode === 'compose') return false;
    if (mode === 'drafts') return m.draft;
    if (mode.startsWith('archived')) return m.archived;
    if (mode === 'sent' || mode.startsWith('sent/')) return m.sent && !m.draft;
    if (mode === 'inbox/unread') return !m.isRead && !m.archived && !m.sent && !m.draft;
    if (mode === 'inbox/team') return /team/i.test(m.title + m.body) && !m.archived;
    if (mode === 'inbox/priority') return /urgent|high|priority|alert/i.test(m.type + m.title + m.body) && !m.archived;
    if (mode === 'inbox' || mode === 'notifications') return !m.archived && !m.sent && !m.draft;
    return !m.archived && !m.draft;
  }).sort((a, b) => {
    const aTime = new Date(a.createdAt || 0).getTime(); const bTime = new Date(b.createdAt || 0).getTime();
    return sort === 'oldest' ? aTime - bTime : bTime - aTime;
  }), [messages, mode, query, readFilter, typeFilter, sort, users]);

  const save = async (status) => {
    if (!title.trim() || !body.trim()) return;
    setSaving(true); setError('');
    try {
      await notificationService.createMessage({ title: title.trim(), body: body.trim(), status, userId: recipient === 'all' ? null : recipient, type: category.toLowerCase(), isRead: !isUnread });
      setTitle(''); setBody(''); setRecipient('all'); setCategory('General'); setIsUnread(true);
      if (!composeMode) setFormOpen(false);
      await refresh();
    } catch (err) { setError(err.message || 'Could not save message.'); }
    finally { setSaving(false); }
  };

  const update = async (message, patch) => {
    setError(''); const previous = message;
    setMessages((current) => current.map((item) => item.id === message.id ? { ...item, ...patch } : item));
    try { const updated = await notificationService.updateMessage(message.id, patch); setMessages((current) => current.map((item) => item.id === message.id ? updated : item)); setSelected((current) => current?.id === message.id ? updated : current); }
    catch (err) { setMessages((current) => current.map((item) => item.id === message.id ? previous : item)); setError(err.message || 'Could not update message.'); }
  };
  const remove = async (message) => {
    setMessages((current) => current.filter((item) => item.id !== message.id));
    setSelected((current) => current?.id === message.id ? null : current);
    try { await notificationService.deleteNotification(message.id); }
    catch (err) { setError(err.message || 'Could not delete message.'); }
  };
  const markAllRead = async () => {
    const unread = visible.filter((message) => !message.isRead);
    setMessages((current) => current.map((message) => unread.some((item) => item.id === message.id) ? { ...message, isRead: true } : message));
    await Promise.all(unread.map((message) => notificationService.updateMessage(message.id, { isRead: true }).catch((err) => setError(err.message || 'Could not mark messages read.'))));
  };
  const exportCsv = () => {
    const rows = visible.map((m) => [m.title, m.body, m.type, m.isRead ? 'Read' : 'Unread', m.createdAt].map((v) => `"${String(v ?? '').replaceAll('"', '""')}"`).join(','));
    const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([['Subject,Message,Type,Status,Created At', ...rows].join('\n')], { type: 'text/csv;charset=utf-8' })); link.download = 'messages.csv'; link.click(); URL.revokeObjectURL(link.href);
  };

  return <main className="mx-auto min-h-full max-w-7xl space-y-5 bg-background p-4 text-foreground sm:p-6">
    <header className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight sm:text-2xl">{TITLES[mode] || TITLES.all}<span className="h-2 w-2 rounded-full bg-foreground" title="Live Supabase data"/></h1><p className="mt-1 text-sm text-muted-foreground">Live workspace messages and notifications from Supabase.</p></div><div className="flex flex-wrap gap-2"><button onClick={refresh} disabled={loading} className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-xs font-medium hover:bg-muted"><RefreshCw size={14} className={loading ? 'animate-spin' : ''}/>Refresh</button><button onClick={markAllRead} className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-xs font-medium hover:bg-muted"><Check size={14}/>Mark All Read</button><button onClick={exportCsv} className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-xs font-medium hover:bg-muted">Export CSV</button><button onClick={() => setFormOpen(true)} className="inline-flex h-9 items-center gap-2 rounded-md bg-foreground px-4 text-xs font-medium text-background"><Send size={14}/>Compose</button></div></header>
    <section aria-label="Message summary" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(([label, value, badge], index) => <article key={label} className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5"><div className="flex items-start justify-between gap-2"><p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted/70 text-foreground">{index === 0 ? <Mail size={15}/> : index === 1 ? <Bell size={15}/> : index === 2 ? <Check size={15}/> : <Star size={15}/>}</span></div><p className="mt-3 break-words font-mono text-2xl font-bold tracking-tight text-foreground">{value}</p><span className="mt-3 inline-flex rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground">{badge}</span></article>)}</section>
    {error && <p role="alert" className="rounded-md border border-border bg-muted p-3 text-sm">{error}</p>}
    {(formOpen || composeMode) && <section className="grid grid-cols-1 gap-6 xl:grid-cols-3"><form onSubmit={(e) => { e.preventDefault(); save('SENT'); }} className="space-y-4 rounded-xl border border-border bg-card p-5 sm:p-6 xl:col-span-2"><div><h2 className="text-base font-semibold">Compose Message</h2><p className="mt-1 text-xs text-muted-foreground">Create a live notification for a workspace recipient.</p></div><label className="block space-y-1.5 text-xs font-medium">Recipient<select value={recipient} onChange={(e) => setRecipient(e.target.value)} className={control}><option value="all">All Workspace Users</option>{users.map((user) => <option key={user.id} value={user.id}>{user.name} · {user.email}</option>)}</select></label><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><label className="block space-y-1.5 text-xs font-medium">Category / Priority<select value={category} onChange={(e) => setCategory(e.target.value)} className={control}>{['System', 'Security', 'Order', 'User', 'General', 'Priority'].map((item) => <option key={item}>{item}</option>)}</select></label><label className="block space-y-1.5 text-xs font-medium">Subject / Title<input required maxLength={255} value={title} onChange={(e) => setTitle(e.target.value)} className={control}/></label></div><label className="block space-y-1.5 text-xs font-medium">Message Body<textarea required rows={6} value={body} onChange={(e) => setBody(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground outline-none"/></label><label className="inline-flex items-center gap-2 text-xs text-foreground"><input type="checkbox" checked={isUnread} onChange={(e) => setIsUnread(e.target.checked)} className="accent-foreground"/>Send as Unread Alert</label><div className="flex flex-wrap justify-end gap-2 border-t border-border pt-4"><button type="button" onClick={() => { setTitle(''); setBody(''); }} className="h-9 rounded-md border border-border px-4 text-xs font-medium hover:bg-muted">Reset</button><button type="button" disabled={saving} onClick={() => save('DRAFT')} className="h-9 rounded-md border border-border px-4 text-xs font-medium hover:bg-muted">Save Draft</button><button disabled={saving} className="inline-flex h-9 items-center gap-2 rounded-md bg-foreground px-5 text-xs font-medium text-background"><Send size={14}/>{saving ? 'Sending…' : 'Send Message'}</button></div></form><aside className="space-y-4 rounded-xl border border-border bg-card p-5"><div><h2 className="text-sm font-semibold">Live Message Preview</h2><p className="mt-1 text-xs text-muted-foreground">Inbox appearance</p></div><article className="rounded-lg border border-border bg-background p-4"><p className="text-[10px] font-mono uppercase text-muted-foreground">{category} · {isUnread ? 'Unread' : 'Read'}</p><h3 className="mt-2 font-semibold">{title || 'Message subject'}</h3><p className="mt-1 whitespace-pre-wrap text-xs text-muted-foreground">{body || 'Your message preview appears here.'}</p></article><div><h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recent Dispatched Messages</h3><div className="divide-y divide-border">{messages.filter((m) => m.sent).slice(0, 4).map((m) => <div key={m.id} className="py-2"><p className="truncate text-xs font-medium">{m.title}</p><p className="text-[10px] text-muted-foreground">{moneylessDate(m.createdAt)}</p></div>)}{!messages.some((m) => m.sent) && <p className="py-3 text-xs text-muted-foreground">No dispatched messages yet.</p>}</div></div></aside></section>}
    {!composeMode && <><section className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-muted/20 p-3.5 sm:grid-cols-2 xl:grid-cols-4"><div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/><input aria-label="Search messages" placeholder="Search subject, sender, recipient, or message body..." value={query} onChange={(e) => setQuery(e.target.value)} className={`${control} pl-9`}/></div><select aria-label="Read status" value={readFilter} onChange={(e) => setReadFilter(e.target.value)} className={control}><option value="all">All Messages</option><option value="unread">Unread Only</option><option value="read">Read Only</option></select><select aria-label="Type or category" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={control}><option value="all">All Types</option>{['system', 'security', 'order', 'user', 'general'].map((item) => <option key={item} value={item}>{item[0].toUpperCase() + item.slice(1)}</option>)}</select><select aria-label="Sort messages" value={sort} onChange={(e) => setSort(e.target.value)} className={control}><option value="newest">Newest First</option><option value="oldest">Oldest First</option></select></section>
    {loading ? <p className="py-10 text-center text-sm text-muted-foreground">Loading messages…</p> : visible.length === 0 ? <div className="rounded-xl border border-border bg-muted p-10 text-center"><Mail className="mx-auto mb-3"/><p className="text-sm">No messages found.</p></div> : <div className="w-full overflow-x-auto rounded-xl border border-border bg-card"><table className="w-full min-w-[900px] border-collapse text-left text-sm"><thead><tr className="border-b border-border bg-muted/40 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"><th className="px-4 py-3">Status</th><th className="px-4 py-3">Sender / Recipient</th><th className="px-4 py-3">Subject & Preview</th><th className="px-4 py-3">Category / Type</th><th className="px-4 py-3">Timestamp</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-border">{visible.map((message) => { const sender = users.find((user) => String(user.id) === String(message.userId)); const initials = (sender?.name || 'Workspace').split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase(); return <tr key={message.id} onClick={() => setSelected(message)} className="cursor-pointer hover:bg-muted/30"><td className="whitespace-nowrap px-4 py-3.5"><div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${message.isRead ? 'border border-border bg-muted' : 'bg-foreground'}`}/><span className={`rounded-full px-2 py-1 text-[11px] ${message.isRead ? 'border border-border bg-muted text-muted-foreground' : 'bg-foreground text-background'}`}>{message.isRead ? 'Read' : 'Unread'}</span></div></td><td className="whitespace-nowrap px-4 py-3.5"><div className="flex items-center gap-2.5"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground font-mono text-xs font-semibold text-background">{initials}</span><span><span className="block text-xs font-medium">{sender?.name || 'Workspace'}</span><span className="block text-[10px] text-muted-foreground">{sender?.email || 'Workspace notification'}</span></span></div></td><td className="max-w-[360px] px-4 py-3.5"><p className={`truncate ${message.isRead ? 'font-medium' : 'font-semibold'}`}>{message.title}</p><p className="mt-0.5 truncate text-xs text-muted-foreground">{message.body}</p></td><td className="whitespace-nowrap px-4 py-3.5"><span className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-[10px] uppercase">{message.type}</span></td><td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs text-muted-foreground">{moneylessDate(message.createdAt)}</td><td className="whitespace-nowrap px-4 py-3.5" onClick={(e) => e.stopPropagation()}><div className="flex justify-end gap-1.5"><button title="View" onClick={() => setSelected(message)} className="inline-flex h-8 items-center gap-1 rounded-md border border-border px-2.5 text-xs hover:bg-muted"><Eye size={13}/>View</button><button title={message.isRead ? 'Mark unread' : 'Mark read'} onClick={() => update(message, { isRead: !message.isRead })} className="inline-flex h-8 items-center gap-1 rounded-md border border-border px-2.5 text-xs hover:bg-muted">{message.isRead ? 'Unread' : 'Read'}</button><button title="Delete" onClick={() => remove(message)} className="inline-flex h-8 items-center gap-1 rounded-md border border-border px-2.5 text-xs hover:bg-muted"><Trash2 size={13}/>Delete</button></div></td></tr>; })}</tbody></table></div>}</>}
    {selected && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm" onMouseDown={(e) => { if (e.target === e.currentTarget) setSelected(null); }}><section role="dialog" aria-modal="true" className="max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-background p-5 shadow-2xl"><div className="flex items-start justify-between gap-4 border-b border-border pb-3"><div><p className="font-mono text-[10px] uppercase text-muted-foreground">{selected.type} · {moneylessDate(selected.createdAt)}</p><h2 className="mt-1 text-lg font-semibold">{selected.title}</h2></div><button onClick={() => setSelected(null)} aria-label="Close reader" className="rounded-md border border-border p-2 hover:bg-muted"><X size={15}/></button></div><p className="whitespace-pre-wrap py-5 text-sm text-foreground">{selected.body}</p><div className="flex flex-wrap justify-end gap-2 border-t border-border pt-3"><button onClick={() => update(selected, { isRead: !selected.isRead })} className="h-9 rounded-md border border-border px-3 text-xs hover:bg-muted">Mark {selected.isRead ? 'Unread' : 'Read'}</button><button onClick={() => update(selected, { archived: !selected.archived })} className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-xs hover:bg-muted"><Archive size={14}/>{selected.archived ? 'Unarchive' : 'Archive'}</button><button onClick={() => update(selected, { starred: !selected.starred })} className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-xs hover:bg-muted"><Star size={14}/>{selected.starred ? 'Unstar' : 'Star'}</button><button onClick={() => remove(selected)} className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-xs hover:bg-muted"><Trash2 size={14}/>Delete</button></div></section></div>}
  </main>;
}
