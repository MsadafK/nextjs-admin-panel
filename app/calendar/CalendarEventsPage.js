'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarDays, Clock3, Pencil, Plus, RefreshCw, Search, Trash2, X, Download, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { eventService, formatEventDate, parseSupabaseDate } from '@/services/eventService';

const emptyForm = { title: '', date: '', startTime: '', endTime: '', description: '', category: 'Meeting', recurring: false, recurrencePattern: 'weekly' };
const control = 'h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground outline-none';
const istParts = (value) => {
  const date = parseSupabaseDate(value);
  if (!date) return { date: '', time: '' };
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(date);
  const get = (type) => parts.find((part) => part.type === type)?.value || '';
  return { date: `${get('year')}-${get('month')}-${get('day')}`, time: `${get('hour')}:${get('minute')}` };
};
const todayKey = () => istParts(new Date()).date;
const asDate = (key) => new Date(`${key}T00:00:00`);
const shiftDate = (key, amount) => { const date = asDate(key); date.setDate(date.getDate() + amount); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; };
const safeType = (value) => String(value || 'Meeting').toLowerCase();

const MODES = {
  calendar: { title: 'Workspace Calendar', description: 'A live view of meetings, launches, reminders, and team events.' },
  events: { title: 'All Calendar Events', description: 'Search and manage events stored in public.events.' },
  upcoming: { title: 'Upcoming Events', description: 'Events on or after today in India Standard Time.' },
  createEvent: { title: 'Schedule New Event', description: 'Create an event and see it appear in the calendar immediately.' },
  team: { title: 'Team Events', description: 'Meetings and team events from the shared workspace calendar.' },
  reminders: { title: 'Reminders', description: 'Manage reminder events in the shared calendar.' },
  createReminder: { title: 'Schedule New Reminder', description: 'Create a reminder in the shared workspace calendar.' },
  recurring: { title: 'Recurring Reminders', description: 'Recurring reminders saved in the live calendar.' },
  schedule: { title: 'My Schedule', description: 'All live events in chronological order.' },
  teamSchedule: { title: 'Team Schedule', description: 'Meetings and team events from the shared schedule.' },
  blocks: { title: 'Time Blocks', description: 'Manage time blocks in the calendar.' },
  categories: { title: 'Event Categories & Types', description: 'Review live events by their category and type.' },
};

export default function CalendarEventsPage({ mode = 'calendar' }) {
  const config = MODES[mode] || MODES.calendar;
  const calendarMode = mode === 'calendar' || mode.startsWith('view/');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState(mode === 'upcoming' ? 'upcoming' : 'all');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(mode === 'createEvent' || mode === 'createReminder');
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [selectedDate, setSelectedDate] = useState(todayKey());
  const [month, setMonth] = useState(() => { const d = asDate(todayKey()); return new Date(d.getFullYear(), d.getMonth(), 1); });

  useEffect(() => {
    if (mode === 'createEvent' || mode === 'createReminder') setForm({ ...emptyForm, category: mode === 'createReminder' ? 'Reminder' : 'Meeting', date: todayKey(), startTime: '09:00' });
  }, [mode]);

  const refresh = useCallback(async () => {
    setLoading(true); setError('');
    try { setEvents(await eventService.getEvents()); }
    catch (err) { setError(err.message || 'Could not load events from Supabase.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);

  const kpis = useMemo(() => {
    const today = todayKey(); const now = asDate(today); const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const categories = new Set(events.map((event) => event.category || 'Meeting'));
    return [
      ['Total Scheduled Events', events.length, 'LIVE'],
      ['Upcoming (from today IST)', events.filter((event) => istParts(event.startTime).date >= today).length, 'LIVE'],
      ["This Month's Events", events.filter((event) => istParts(event.startTime).date.startsWith(monthKey)).length, 'LIVE'],
      ['Event Categories', categories.size, `${[...categories].slice(0, 2).join(' · ') || 'No types yet'}`],
    ];
  }, [events]);

  const visibleEvents = useMemo(() => events.filter((event) => {
    const dateKey = istParts(event.startTime).date;
    const text = `${event.title} ${event.description} ${event.category}`.toLowerCase();
    const matchesQuery = text.includes(query.toLowerCase());
    const matchesType = typeFilter === 'all' || safeType(event.category).includes(typeFilter);
    const matchesTime = timeFilter === 'all' || (timeFilter === 'upcoming' && dateKey >= todayKey()) || (timeFilter === 'past' && dateKey < todayKey());
    if (!matchesQuery || !matchesType || !matchesTime) return false;
    if (mode === 'upcoming') return dateKey >= todayKey();
    if (mode === 'reminders') return /reminder/i.test(event.category);
    if (mode === 'recurring') return /reminder/i.test(event.category) && event.recurring;
    if (mode === 'schedule') return true;
    if (mode === 'team' || mode === 'teamSchedule') return /meeting|team/i.test(event.category);
    if (mode === 'blocks') return /schedule|time block|block/i.test(event.category);
    return true;
  }).sort((a, b) => (parseSupabaseDate(a.startTime)?.getTime() || 0) - (parseSupabaseDate(b.startTime)?.getTime() || 0)), [events, query, typeFilter, timeFilter, mode]);

  const openCreate = (date = todayKey(), category = 'Meeting') => { setEditingId(null); setForm({ ...emptyForm, date, startTime: '09:00', category: mode === 'createReminder' ? 'Reminder' : category }); setShowForm(true); };
  const openEdit = (event) => {
    const start = istParts(event.startTime); const end = istParts(event.endTime);
    setEditingId(event.id); setForm({ ...emptyForm, title: event.title, date: start.date, startTime: start.time, endTime: end.date === start.date ? end.time : '', description: event.description, category: event.category, recurring: event.recurring, recurrencePattern: event.recurrencePattern || 'weekly' }); setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const submit = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const saved = editingId ? await eventService.updateEvent(editingId, form) : await eventService.createEvent(form);
      setEvents((current) => editingId ? current.map((event) => event.id === editingId ? saved : event).sort((a, b) => (parseSupabaseDate(a.startTime)?.getTime() || 0) - (parseSupabaseDate(b.startTime)?.getTime() || 0)) : [...current, saved].sort((a, b) => (parseSupabaseDate(a.startTime)?.getTime() || 0) - (parseSupabaseDate(b.startTime)?.getTime() || 0)));
      setShowForm(mode === 'createEvent' || mode === 'createReminder'); setForm(emptyForm); setEditingId(null);
    } catch (err) { setError(err.message || 'Could not save event.'); }
    finally { setSaving(false); }
  };
  const remove = async (id) => {
    const event = events.find((item) => item.id === id);
    if (event && !window.confirm(`Delete “${event.title}”?`)) return;
    setError(''); setEvents((current) => current.filter((item) => item.id !== id));
    try { await eventService.deleteEvent(id); }
    catch (err) { setError(err.message || 'Could not delete event.'); await refresh(); }
  };
  const exportCsv = (list = visibleEvents) => {
    const rows = list.map((event) => [event.title, event.category, event.startTime, event.endTime, event.description].map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(','));
    const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([['Title,Type,Start,End,Description', ...rows].join('\n')], { type: 'text/csv;charset=utf-8' })); link.download = 'calendar_events.csv'; link.click(); URL.revokeObjectURL(link.href);
  };
  const jumpToday = () => { const today = todayKey(); setSelectedDate(today); const date = asDate(today); setMonth(new Date(date.getFullYear(), date.getMonth(), 1)); };
  const changeMonth = (offset) => setMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  const selectedEvents = events.filter((event) => istParts(event.startTime).date === selectedDate).sort((a, b) => (parseSupabaseDate(a.startTime)?.getTime() || 0) - (parseSupabaseDate(b.startTime)?.getTime() || 0));
  const agendaEvents = selectedEvents.length ? selectedEvents : visibleEvents.filter((event) => istParts(event.startTime).date >= todayKey()).slice(0, 5);
  const monthCells = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1); const offset = first.getDay(); const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    return Array.from({ length: Math.ceil((offset + count) / 7) * 7 }, (_, index) => { const day = index - offset + 1; if (day < 1 || day > count) return null; return `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`; });
  }, [month]);

  const eventForm = <form onSubmit={submit} className="space-y-4 rounded-xl border border-border bg-card p-5 sm:p-6 xl:col-span-2"><div className="flex items-start justify-between"><div><h2 className="text-base font-semibold">{editingId ? 'Edit Event' : mode === 'createReminder' ? 'Schedule Reminder' : 'Schedule Event'}</h2><p className="mt-1 text-xs text-muted-foreground">Saved to the live workspace calendar in IST.</p></div>{mode !== 'createEvent' && mode !== 'createReminder' && <button type="button" onClick={() => setShowForm(false)} aria-label="Close form" className="rounded-md border border-border p-2 hover:bg-muted"><X size={15}/></button>}</div><label className="block space-y-1.5 text-xs font-medium">Event Title *<input required maxLength={255} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={control}/></label><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><label className="block space-y-1.5 text-xs font-medium">Event Type / Category<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={control}>{['Meeting', 'Team Event', 'Launch', 'Review', 'Deadline', 'Reminder', 'Schedule', 'Time Block'].map((type) => <option key={type}>{type}</option>)}</select></label><label className="block space-y-1.5 text-xs font-medium">Date *<input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={control}/></label><label className="block space-y-1.5 text-xs font-medium">Start Time (IST)<input required type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className={control}/></label><label className="block space-y-1.5 text-xs font-medium">End Time (IST)<input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className={control}/></label></div><label className="block space-y-1.5 text-xs font-medium">Location / Meeting Link<input value={form.location || ''} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Add location or meeting link" className={control}/></label><label className="block space-y-1.5 text-xs font-medium">Description<textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground outline-none"/></label><label className="inline-flex items-center gap-2 text-xs"><input type="checkbox" checked={form.recurring} onChange={(e) => setForm({ ...form, recurring: e.target.checked })} className="accent-foreground"/>Repeat this event</label>{form.recurring && <select value={form.recurrencePattern} onChange={(e) => setForm({ ...form, recurrencePattern: e.target.value })} className={control}><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select>}<div className="flex flex-wrap justify-end gap-2 border-t border-border pt-4"><button type="button" onClick={() => { setForm({ ...emptyForm, category: mode === 'createReminder' ? 'Reminder' : 'Meeting', date: todayKey(), startTime: '09:00' }); setEditingId(null); }} className="h-9 rounded-md border border-border px-4 text-xs font-medium hover:bg-muted">Cancel / Reset</button><button disabled={saving} className="h-9 rounded-md bg-foreground px-5 text-xs font-medium text-background hover:opacity-90">{saving ? 'Saving…' : 'Save Event'}</button></div></form>;

  return <div className="mx-auto min-h-full max-w-7xl space-y-5 bg-background p-4 text-foreground sm:p-6">
    <header className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight sm:text-2xl">{config.title}<span className="h-2 w-2 rounded-full bg-foreground" title="Live Supabase data"/></h1><p className="mt-1 text-sm text-muted-foreground">{config.description}</p></div><div className="flex flex-wrap gap-2"><button onClick={refresh} disabled={loading} className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-xs font-medium hover:bg-muted"><RefreshCw size={14} className={loading ? 'animate-spin' : ''}/>Refresh</button><button onClick={jumpToday} className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-xs font-medium hover:bg-muted">Today</button><button onClick={() => exportCsv()} className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-xs font-medium hover:bg-muted"><Download size={14}/>Export CSV</button><button onClick={() => openCreate()} className="inline-flex h-9 items-center gap-2 rounded-md bg-foreground px-4 text-xs font-medium text-background"><Plus size={14}/>Schedule Event</button></div></header>
    <section aria-label="Calendar summary" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{kpis.map(([label, value, sub], index) => <article key={label} className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5"><div className="flex items-start justify-between gap-2"><p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted/70"><CalendarDays size={15}/></span></div><p className="mt-3 break-words font-mono text-2xl font-bold tracking-tight">{value}</p><span className="mt-3 inline-flex rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">{sub}</span></article>)}</section>
    {error && <p role="alert" className="rounded-md border border-border bg-muted p-3 text-sm">{error}</p>}
    {showForm && (calendarMode || mode === 'createEvent' || mode === 'createReminder') && <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">{eventForm}<aside className="space-y-4 rounded-xl border border-border bg-card p-5"><div><h2 className="text-sm font-semibold">Live Event Preview</h2><p className="mt-1 text-xs text-muted-foreground">Preview of your calendar entry</p></div><article className="rounded-lg border border-border bg-background p-4"><span className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-[10px] uppercase">{form.category}</span><h3 className="mt-3 font-semibold">{form.title || 'Event title'}</h3><p className="mt-2 text-xs text-muted-foreground">{form.date || 'Select a date'} {form.startTime && `· ${form.startTime} IST`}</p><p className="mt-2 whitespace-pre-wrap text-xs text-muted-foreground">{form.description || 'Event description preview.'}</p></article><h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Upcoming Scheduled Events</h3><div className="divide-y divide-border">{events.filter((event) => istParts(event.startTime).date >= todayKey()).slice(0, 4).map((event) => <div key={event.id} className="py-2"><p className="truncate text-xs font-medium">{event.title}</p><p className="text-[10px] text-muted-foreground">{formatEventDate(event.startTime, { dateStyle: 'medium' })}</p></div>)}{!events.some((event) => istParts(event.startTime).date >= todayKey()) && <p className="py-2 text-xs text-muted-foreground">No upcoming events yet.</p>}</div></aside></div>}
    {calendarMode ? <div className="grid grid-cols-1 gap-6 xl:grid-cols-3"><section className="min-w-0 overflow-hidden rounded-xl border border-border bg-card xl:col-span-2"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4"><div className="flex items-center gap-2"><button onClick={() => changeMonth(-1)} aria-label="Previous month" className="rounded-md border border-border p-2 hover:bg-muted"><ChevronLeft size={15}/></button><button onClick={jumpToday} className="h-8 rounded-md border border-border px-3 text-xs hover:bg-muted">Today</button><button onClick={() => changeMonth(1)} aria-label="Next month" className="rounded-md border border-border p-2 hover:bg-muted"><ChevronRight size={15}/></button></div><h2 className="text-sm font-semibold">{month.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</h2></div><div className="overflow-x-auto"><div className="min-w-[600px]"><div className="grid grid-cols-7 border-b border-border bg-muted/40">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <div key={day} className="px-2 py-2 text-center text-[10px] font-semibold uppercase text-muted-foreground">{day}</div>)}</div><div className="grid grid-cols-7">{monthCells.map((date, index) => { const dayEvents = date ? events.filter((event) => istParts(event.startTime).date === date) : []; const isToday = date === todayKey(); const isSelected = date === selectedDate; return <button key={date || `blank-${index}`} disabled={!date} onClick={() => date && setSelectedDate(date)} className={`min-h-24 border-b border-r border-border p-1.5 text-left transition-colors ${date ? 'hover:bg-muted/40' : 'bg-muted/10'} ${isSelected ? 'bg-foreground text-background' : ''} ${isToday && !isSelected ? 'ring-2 ring-inset ring-foreground' : ''}`}><span className={`inline-flex h-6 w-6 items-center justify-center rounded-full font-mono text-xs ${isSelected ? 'bg-background text-foreground' : ''}`}>{date ? Number(date.slice(-2)) : ''}</span><span className="mt-1 block space-y-1">{dayEvents.slice(0, 2).map((event) => <span key={event.id} className={`block truncate rounded border px-1 py-0.5 text-[9px] ${isSelected ? 'border-background/40 text-background' : 'border-border bg-muted text-foreground'}`}>{event.title}</span>)}{dayEvents.length > 2 && <span className="block text-[9px]">+{dayEvents.length - 2} more</span>}</span></button>; })}</div></div></div></section><aside className="rounded-xl border border-border bg-card"><div className="flex items-start justify-between gap-2 border-b border-border p-4"><div><h2 className="text-sm font-semibold">Selected Date Agenda</h2><p className="mt-1 text-xs text-muted-foreground">{asDate(selectedDate).toLocaleDateString('en-IN', { dateStyle: 'full' })}</p></div><button onClick={() => openCreate(selectedDate)} className="inline-flex h-8 shrink-0 items-center gap-1 rounded-md bg-foreground px-2.5 text-[11px] font-medium text-background"><Plus size={13}/>Add Event</button></div><div className="divide-y divide-border">{agendaEvents.length ? agendaEvents.map((event) => <article key={event.id} className="p-4"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><span className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-[10px] uppercase">{event.category}</span><h3 className="mt-2 text-sm font-semibold">{event.title}</h3><p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><Clock3 size={12}/>{formatEventDate(event.startTime, { timeStyle: 'short' })} IST</p>{event.location && <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin size={12}/>{event.location}</p>}</div><div className="flex shrink-0 gap-1"><button onClick={() => openEdit(event)} title="Edit" className="rounded border border-border p-1.5 hover:bg-muted"><Pencil size={13}/></button><button onClick={() => remove(event.id)} title="Delete" className="rounded border border-border p-1.5 hover:bg-muted"><Trash2 size={13}/></button></div></div></article>) : <p className="p-6 text-sm text-muted-foreground">No upcoming events scheduled.</p>}</div></aside></div> : <>
      {showForm && eventForm}
      <section className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-muted/20 p-3.5 sm:grid-cols-2 xl:grid-cols-4"><div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search event title, location, or description..." className={`${control} pl-9`}/></div><select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={control}><option value="all">All Types</option>{['Meeting', 'Deadline', 'Launch', 'Reminder', 'Team Event', 'Review'].map((type) => <option key={type} value={type.toLowerCase()}>{type}</option>)}</select><select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} className={control}><option value="all">All Events</option><option value="upcoming">Upcoming</option><option value="past">Past</option></select><div className="flex h-9 items-center rounded-md border border-border bg-background px-3 text-xs text-muted-foreground">{visibleEvents.length} matching events</div></section>
      {loading ? <p className="py-10 text-center text-sm text-muted-foreground">Loading events…</p> : visibleEvents.length === 0 && !showAllEvents ? <div className="rounded-xl border border-border bg-muted p-10 text-center"><CalendarDays className="mx-auto mb-3"/><p className="text-sm">{events.length ? `No ${config.title.toLowerCase()} match these filters.` : 'No events found.'}</p>{events.length > 0 && <><p className="mt-1 text-sm text-muted-foreground">There are {events.length} events in your calendar.</p><button className="mt-3 h-9 rounded-md border border-border px-4 text-xs font-medium hover:bg-background" onClick={() => setShowAllEvents(true)}>View all calendar events ({events.length})</button></>}</div> : <div className="w-full overflow-x-auto rounded-xl border border-border bg-card"><table className="w-full min-w-[780px] border-collapse text-left text-sm"><thead><tr className="border-b border-border bg-muted/40 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"><th className="px-4 py-3">Event Title & Description</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Date & Time</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-border">{(showAllEvents ? events : visibleEvents).map((event) => { const dateKey = istParts(event.startTime).date; const status = dateKey === todayKey() ? 'Today' : dateKey > todayKey() ? 'Upcoming' : 'Past'; return <tr key={event.id} className="hover:bg-muted/30"><td className="max-w-[360px] px-4 py-3.5"><p className="truncate font-semibold">{event.title}</p><p className="mt-0.5 truncate text-xs text-muted-foreground">{event.description || 'No description'}</p></td><td className="whitespace-nowrap px-4 py-3.5"><span className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-[10px] uppercase">{event.category}</span></td><td className="whitespace-nowrap px-4 py-3.5"><p className="text-xs">{formatEventDate(event.startTime, { day: '2-digit', month: 'short', year: 'numeric' })}</p><p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{formatEventDate(event.startTime, { timeStyle: 'short' })}–{event.endTime ? formatEventDate(event.endTime, { timeStyle: 'short' }) : ''} IST</p></td><td className="whitespace-nowrap px-4 py-3.5"><span className={`rounded-full px-2 py-1 text-[10px] font-medium ${status === 'Past' ? 'border border-border bg-muted text-muted-foreground' : 'bg-foreground text-background'} ${status === 'Today' ? 'underline underline-offset-2' : ''}`}>{status === 'Past' ? 'Completed / Past' : status}</span></td><td className="whitespace-nowrap px-4 py-3.5"><div className="flex justify-end gap-1.5"><button onClick={() => openEdit(event)} className="h-8 rounded-md border border-border px-2.5 text-xs font-medium hover:bg-muted">Edit</button><button onClick={() => remove(event.id)} className="h-8 rounded-md border border-border px-2.5 text-xs font-medium hover:bg-muted">Delete</button></div></td></tr>; })}</tbody></table></div>}
    </>}
  </div>;
}
