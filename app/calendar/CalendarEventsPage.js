'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarDays, Clock3, Pencil, Plus, RefreshCw, Search, Trash2, X } from 'lucide-react';
import { eventService, formatEventDate, parseSupabaseDate } from '@/services/eventService';

const emptyForm = { title: '', date: '', startTime: '', endTime: '', description: '', category: 'Meeting', recurring: false, recurrencePattern: 'weekly' };
const istParts = (value) => {
  const date = parseSupabaseDate(value);
  if (!date) return { date: '', time: '' };
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(date);
  const get = (type) => parts.find((part) => part.type === type)?.value || '';
  return { date: `${get('year')}-${get('month')}-${get('day')}`, time: `${get('hour')}:${get('minute')}` };
};

const MODES = {
  events: { title: 'Events', description: 'Create and manage calendar events from Supabase.' },
  upcoming: { title: 'Upcoming Events', description: 'Events scheduled from today onward, shown in India Standard Time.' },
  createEvent: { title: 'Create Event', description: 'Add a calendar event.' },
  team: { title: 'Team Events', description: 'Shared team events stored in the events table.' },
  reminders: { title: 'Reminders', description: 'Manage reminders as calendar events.' },
  createReminder: { title: 'Create Reminder', description: 'Add a calendar reminder.' },
  recurring: { title: 'Recurring Reminders', description: 'Recurring reminders saved as recurring calendar events.' },
  schedule: { title: 'My Schedule', description: 'Your schedule, managed as calendar events.' },
  teamSchedule: { title: 'Team Schedule', description: 'Team schedule entries stored as calendar events.' },
  blocks: { title: 'Time Blocks', description: 'Manage time blocks as calendar events.' },
};

export default function CalendarEventsPage({ mode = 'events' }) {
  const config = MODES[mode] || MODES.events;
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);

  useEffect(() => {
    if (mode === 'createEvent' || mode === 'createReminder') {
      setForm({ ...emptyForm, category: mode === 'createReminder' ? 'Reminder' : 'Meeting' });
      setShowForm(true);
    }
  }, [mode]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try { setEvents(await eventService.getEvents()); }
    catch (err) { setError(err.message || 'Could not load events from Supabase.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const visibleEvents = useMemo(() => {
    const todayIST = istParts(new Date()).date;
    return events.filter((event) => {
      const title = event.title.toLowerCase();
      const desc = event.description.toLowerCase();
      const matchesQuery = `${title} ${desc} ${event.category.toLowerCase()}`.includes(query.toLowerCase());
      const isReminder = /reminder/i.test(event.category);
      const isSchedule = /schedule|time block/i.test(event.category);
      if (!matchesQuery) return false;
      if (mode === 'upcoming') return istParts(event.startTime).date >= todayIST;
      if (mode === 'reminders') return isReminder;
      if (mode === 'recurring') return isReminder && event.recurring;
      if (mode === 'schedule') return true;
      if (mode === 'team' || mode === 'teamSchedule') return /meeting|team/i.test(event.category);
      if (mode === 'blocks') return isSchedule;
      return true;
    }).sort((a, b) => (parseSupabaseDate(a.startTime)?.getTime() || 0) - (parseSupabaseDate(b.startTime)?.getTime() || 0));
  }, [events, mode, query]);

  const kpis = useMemo(() => {
    const todayIST = istParts(new Date()).date;
    return [
      ['Total Events', events.length],
      ["Today's Events", events.filter((event) => istParts(event.startTime).date === todayIST).length],
      ['Meetings / Team', events.filter((event) => /meeting|team/i.test(event.category)).length],
      ['Reminders & Blocks', events.filter((event) => /reminder|block/i.test(event.category)).length],
    ];
  }, [events]);

  const openCreate = () => { setEditingId(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (event) => {
    const start = istParts(event.startTime);
    const end = istParts(event.endTime);
    setEditingId(event.id);
    setForm({ ...emptyForm, title: event.title, date: start.date, startTime: start.time, endTime: end.date === start.date ? end.time : '', description: event.description, category: event.category, recurring: event.recurring, recurrencePattern: event.recurrencePattern || 'weekly' });
    setShowForm(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const saved = editingId ? await eventService.updateEvent(editingId, form) : await eventService.createEvent(form);
      setEvents((current) => editingId ? current.map((event) => event.id === editingId ? saved : event) : [...current, saved]);
      setShowForm(false); setForm(emptyForm); setEditingId(null);
    } catch (err) { setError(err.message || 'Could not save event.'); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    setError('');
    try { await eventService.deleteEvent(id); setEvents((current) => current.filter((event) => event.id !== id)); }
    catch (err) { setError(err.message || 'Could not delete event.'); }
  };

  return <div className="min-h-screen bg-background text-foreground">
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-6">
      <div><h1 className="text-2xl font-semibold">{config.title}</h1><p className="mt-1 text-sm">{config.description}</p></div>
      <div className="flex gap-2">
        <button onClick={refresh} className="inline-flex items-center gap-2 rounded-md border border-border bg-muted px-4 py-2" disabled={loading}><RefreshCw size={16} className={loading ? 'animate-spin' : ''}/> Refresh</button>
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-background"><Plus size={16}/> Add event</button>
      </div>
    </header>
    <main className="space-y-5 p-6">
      <section aria-label="Calendar summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{kpis.map(([label, value]) => <article key={label} className="rounded-lg border border-border bg-muted p-4"><p className="text-sm">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p></article>)}</section>
      {error && <div role="alert" className="rounded-md border border-border bg-muted p-3 text-sm">{error}</div>}
      <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3"><Search size={16}/><input aria-label="Search events" className="w-full bg-background px-2 py-3 outline-none" placeholder="Search events" value={query} onChange={(e) => setQuery(e.target.value)}/></div>
      {showForm && <div className="rounded-lg border border-border bg-muted p-5"><form onSubmit={submit} className="mx-auto max-w-3xl space-y-4">
        <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">{editingId ? 'Edit event' : mode === 'createReminder' ? 'Create Reminder' : 'Create Event'}</h2>{mode !== 'createEvent' && mode !== 'createReminder' && <button type="button" aria-label="Close" onClick={() => setShowForm(false)} className="rounded p-2 hover:bg-muted"><X size={18}/></button>}</div>
        <label className="block text-sm">Title<input required maxLength={255} className="mt-1 w-full rounded-md border border-border bg-background p-3" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}/></label>
        <div className="grid gap-3 sm:grid-cols-3"><label className="text-sm">Date (IST)<input required type="date" className="mt-1 w-full rounded-md border border-border bg-background p-3" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}/></label><label className="text-sm">Start time (IST)<input required type="time" className="mt-1 w-full rounded-md border border-border bg-background p-3" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })}/></label><label className="text-sm">End time (IST)<input type="time" className="mt-1 w-full rounded-md border border-border bg-background p-3" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })}/></label></div>
        <label className="block text-sm">Type<select className="mt-1 w-full rounded-md border border-border bg-background p-3" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option>Meeting</option><option>Team Event</option><option>Reminder</option><option>Schedule</option><option>Time Block</option></select></label>
        <label className="block text-sm">Description<textarea rows={4} className="mt-1 w-full rounded-md border border-border bg-background p-3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}/></label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.recurring} onChange={(e) => setForm({ ...form, recurring: e.target.checked })}/> Repeat this event</label>
        {form.recurring && <label className="block text-sm">Repeat<select className="mt-1 w-full rounded-md border border-border bg-background p-3" value={form.recurrencePattern} onChange={(e) => setForm({ ...form, recurrencePattern: e.target.value })}><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select></label>}
        <div className="flex justify-end gap-2">{mode !== 'createEvent' && mode !== 'createReminder' && <button type="button" onClick={() => setShowForm(false)} className="rounded-md border border-border bg-background px-4 py-2">Cancel</button>}<button disabled={saving} className="rounded-md bg-foreground px-4 py-2 text-background">{saving ? 'Saving…' : editingId ? 'Save changes' : 'Create event'}</button></div>
      </form></div>}
      {loading ? <p className="py-10 text-center">Loading events…</p> : visibleEvents.length === 0 && !showAllEvents ? <div className="rounded-lg border border-border bg-muted p-10 text-center"><CalendarDays className="mx-auto mb-3"/><p>{events.length ? `No ${config.title.toLowerCase()} match this filter.` : 'No events found.'}</p>{events.length > 0 && <><p className="mt-1 text-sm">There are {events.length} events in your calendar.</p><button className="mt-3 rounded-md border border-border px-4 py-2" onClick={() => setShowAllEvents(!showAllEvents)}>{showAllEvents ? 'Hide' : `View all calendar events (${events.length})`}</button></>}</div> :
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{(showAllEvents ? events : visibleEvents).map((event) => <article key={event.id} className="rounded-lg border border-border bg-background p-5">
          <div className="mb-3 flex items-start justify-between gap-3"><div><span className="inline-flex rounded-full bg-foreground px-2.5 py-1 text-xs text-background">{event.category || 'Meeting'}</span><h2 className="mt-3 text-lg font-semibold">{event.title}</h2></div><div className="flex gap-1"><button aria-label={`Edit ${event.title}`} onClick={() => openEdit(event)} className="rounded p-2 hover:bg-muted"><Pencil size={16}/></button><button aria-label={`Delete ${event.title}`} onClick={() => remove(event.id)} className="rounded p-2 hover:bg-muted"><Trash2 size={16}/></button></div></div>
          <p className="mb-4 whitespace-pre-wrap text-sm">{event.description || 'No description'}</p>
          <div className="flex items-center gap-2 text-sm"><CalendarDays size={15}/>{formatEventDate(event.startTime, { dateStyle: 'medium' })}</div>
          <div className="mt-1 flex items-center gap-2 text-sm"><Clock3 size={15}/>{formatEventDate(event.startTime, { timeStyle: 'short' })} IST{event.endTime ? ` – ${formatEventDate(event.endTime, { timeStyle: 'short' })} IST` : ''}</div>
          {event.recurring && <span className="mt-3 inline-flex rounded-full bg-foreground px-2.5 py-1 text-xs text-background">Recurring · {event.recurrencePattern || 'weekly'}</span>}
        </article>)}</div>}
    </main>

  </div>;
}
