// services/eventService.js
import { supabase } from '@/lib/supabase';

export const eventService = {
  async getEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map((row) => ({
      id: row.id,
      title: row.title || row.name || 'Untitled Event',
      description: row.description || '',
      startTime: row.start_time || row.start_date || row.event_date || row.created_at,
      endTime: row.end_time || row.end_date || null,
      location: row.location || 'Online / General',
      category: row.event_type || row.category || row.type || 'Meeting',
      status: row.status || 'scheduled',
    }));
  },

  async createEvent(formData) {
    const startISO = `${formData.date}T${formData.startTime}:00`;
    const endISO = formData.endTime
      ? `${formData.date}T${formData.endTime}:00`
      : `${formData.date}T23:59:00`;

    // Check existing table columns dynamically so insert never fails on schema differences
    const { data: sample } = await supabase.from('events').select('*').limit(1);
    const cols = sample && sample[0] ? Object.keys(sample[0]) : null;

    const fullDescription = [
      formData.description,
      formData.participants?.length
        ? `Participants: ${formData.participants.join(', ')}`
        : null,
    ]
      .filter(Boolean)
      .join('\n\n');

    const payload = {
      title: formData.title,
      description: fullDescription,
    };

    if (cols) {
      if (cols.includes('start_time')) payload.start_time = startISO;
      else if (cols.includes('start_date')) payload.start_date = startISO;
      else if (cols.includes('event_date')) payload.event_date = formData.date;

      if (cols.includes('end_time')) payload.end_time = endISO;
      else if (cols.includes('end_date')) payload.end_date = endISO;

      if (cols.includes('location')) payload.location = formData.location || 'Online';
      if (cols.includes('event_type')) payload.event_type = (formData.category || 'meeting').toLowerCase();
      if (cols.includes('category')) payload.category = formData.category || 'Meeting';
      if (cols.includes('type')) payload.type = (formData.category || 'meeting').toLowerCase();
      if (cols.includes('participants') && Array.isArray(sample[0].participants)) {
        payload.participants = formData.participants;
      }
    } else {
      // Standard fallback if events table is currently empty
      payload.start_time = startISO;
      payload.end_time = endISO;
      payload.location = formData.location || 'Online';
    }

    const { data, error } = await supabase
      .from('events')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteEvent(id) {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw error;
    return true;
  },
};