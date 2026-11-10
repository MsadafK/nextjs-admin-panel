import { supabase } from '@/lib/supabase';

// PostgreSQL timestamps without an offset are UTC in the events schema.
export const parseSupabaseDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  const normalized = typeof value === 'string' && !/[zZ]|[+-]\d{2}:?\d{2}$/.test(value)
    ? `${value.replace(' ', 'T')}Z`
    : value;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatEventDate = (value, options = {}) => {
  const date = parseSupabaseDate(value);
  return date ? new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', ...options }).format(date) : 'Not set';
};

const localISTDateTimeToUTC = (date, time) => {
  // Interpret form inputs as IST wall time, then serialize an unambiguous UTC instant.
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  return new Date(Date.UTC(year, month - 1, day, hour - 5, minute - 30)).toISOString();
};

let hasLocationColumn;
const supportsLocation = async () => {
  if (hasLocationColumn !== undefined) return hasLocationColumn;
  const { error } = await supabase.from('events').select('location').limit(0);
  hasLocationColumn = !error;
  return hasLocationColumn;
};
const withLocationDescription = (description, location) => {
  const cleanDescription = String(description || '').replace(/\n?\[LOCATION:[\s\S]*?\]$/, '').trim();
  return location ? `${cleanDescription}${cleanDescription ? '\n' : ''}[LOCATION:${String(location).replace(/\]/g, '')}]` : cleanDescription || null;
};

const toEvent = (row) => {
  const rawDescription = row.description || '';
  const locationMatch = rawDescription.match(/(?:\n)?\[LOCATION:([\s\S]*?)\]$/);
  return ({
  id: row.id,
  title: row.title || 'Untitled Event',
  description: locationMatch ? rawDescription.replace(/\n?\[LOCATION:[\s\S]*?\]$/, '').trim() : rawDescription,
  location: row.location || row.meeting_link || locationMatch?.[1] || '',
  startTime: row.start_date || row.start_time || row.event_date || row.created_at,
  endTime: row.end_date || row.end_time || null,
  category: row.event_type || row.category || row.type || 'Meeting',
  recurring: Boolean(row.is_recurring),
  recurrencePattern: row.recurrence_pattern || '',
  createdAt: row.created_at,
  });
};

export const eventService = {
  async getEvents() {
    const { data, error } = await supabase.from('events').select('*').order('start_date', { ascending: true });
    if (error) throw error;
    return (data || []).map(toEvent);
  },

  async createEvent(form) {
    const locationColumn = await supportsLocation();
    const payload = {
      title: form.title.trim(),
      description: locationColumn ? (form.description?.trim() || null) : withLocationDescription(form.description, form.location),
      start_date: localISTDateTimeToUTC(form.date, form.startTime),
      end_date: form.endTime ? localISTDateTimeToUTC(form.date, form.endTime) : null,
      event_type: form.category || 'Meeting',
      is_recurring: Boolean(form.recurring),
      recurrence_pattern: form.recurring ? (form.recurrencePattern || 'weekly') : null,
    };
    if (locationColumn) payload.location = form.location?.trim() || null;
    const { data, error } = await supabase.from('events').insert(payload).select('*').single();
    if (error) throw error;
    return toEvent(data);
  },

  async updateEvent(id, form) {
    const locationColumn = await supportsLocation();
    const payload = {
      title: form.title.trim(),
      description: locationColumn ? (form.description?.trim() || null) : withLocationDescription(form.description, form.location),
      start_date: localISTDateTimeToUTC(form.date, form.startTime),
      end_date: form.endTime ? localISTDateTimeToUTC(form.date, form.endTime) : null,
      event_type: form.category || 'Meeting',
      is_recurring: Boolean(form.recurring),
      recurrence_pattern: form.recurring ? (form.recurrencePattern || 'weekly') : null,
    };
    if (locationColumn) payload.location = form.location?.trim() || null;
    const { data, error } = await supabase.from('events').update(payload).eq('id', id).select('*').single();
    if (error) throw error;
    return toEvent(data);
  },

  async deleteEvent(id) {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw error;
    return true;
  },
};
