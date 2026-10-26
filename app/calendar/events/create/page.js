'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Calendar, Clock, MapPin, Users, FileText, Save, X,
  Plus, CheckCircle, AlertCircle, Trash2, RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { eventService } from '@/services/eventService';

export default function CreateEvent() {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    participants: [],
    category: 'Meeting',
  });
  const [participantInput, setParticipantInput] = useState('');
  const [submitting, setSubmitting]             = useState(false);
  const [successMessage, setSuccessMessage]     = useState('');
  const [errorMessage, setErrorMessage]         = useState('');

  // Live Events List State
  const [events, setEvents]                     = useState([]);
  const [loadingEvents, setLoadingEvents]       = useState(true);

  const fetchEvents = useCallback(async () => {
    try {
      setLoadingEvents(true);
      const data = await eventService.getEvents();
      setEvents(data);
    } catch (err) {
      console.error('Error loading events:', err);
    } finally {
      setLoadingEvents(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addParticipant = () => {
    if (participantInput.trim() && !formData.participants.includes(participantInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        participants: [...prev.participants, participantInput.trim()],
      }));
      setParticipantInput('');
    }
  };

  const removeParticipant = (index) => {
    setFormData((prev) => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.startTime) {
      setErrorMessage('Please fill in required fields: Title, Date, and Start Time.');
      setSuccessMessage('');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage('');
      await eventService.createEvent(formData);
      setSuccessMessage('Event scheduled in Supabase (`public.events`) successfully!');
      setFormData({
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        description: '',
        participants: [],
        category: 'Meeting',
      });
      setParticipantInput('');
      await fetchEvents();
    } catch (err) {
      console.error('Error creating event:', err);
      setErrorMessage(err.message || 'Failed to create event in Supabase.');
      setSuccessMessage('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await eventService.deleteEvent(id);
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
    } catch (err) {
      alert('Failed to delete event: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-muted text-foreground">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 max-w-4xl mx-auto">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight flex items-center gap-3 text-foreground">
              <Plus className="w-7 h-7" />
              Create Event
            </h1>
            <p className="text-sm text-muted-foreground">
              Schedule new events directly in Supabase PostgreSQL (`public.events`)
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-4xl mx-auto space-y-8">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          onSubmit={handleSubmit}
          className="p-6 sm:p-8 rounded-xl shadow-card bg-card border border-border"
        >
          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-foreground">
              Event Title *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter event title (e.g. Sprint Planning)"
                className="w-full pl-10 pr-4 py-3 rounded-lg border bg-card border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border bg-card border-border text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Start Time *</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border bg-card border-border text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">End Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border bg-card border-border text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-foreground">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter location or Google Meet / Zoom link"
                className="w-full pl-10 pr-4 py-3 rounded-lg border bg-card border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>

          {/* Participants */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-foreground">Participants</label>
            <div className="relative">
              <Users className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={participantInput}
                onChange={(e) => setParticipantInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addParticipant();
                  }
                }}
                placeholder="Add email or name and press Enter"
                className="w-full pl-10 pr-12 py-3 rounded-lg border bg-card border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <button
                type="button"
                onClick={addParticipant}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {formData.participants.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.participants.map((part, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-muted text-foreground"
                  >
                    {part}
                    <button
                      type="button"
                      onClick={() => removeParticipant(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-foreground">Description</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide event details..."
                rows={3}
                className="w-full pl-10 pr-4 py-3 rounded-lg border bg-card border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-foreground">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border bg-card border-border text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="Meeting">Meeting</option>
              <option value="Webinar">Webinar</option>
              <option value="Social">Social</option>
              <option value="Training">Training</option>
              <option value="Brainstorm">Brainstorm</option>
            </select>
          </div>

          {/* Messages */}
          {successMessage && (
            <div className="mb-4 p-4 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mb-4 p-4 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {errorMessage}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-foreground text-background font-medium hover:opacity-90 transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {submitting ? 'Saving to Supabase...' : 'Create Event'}
          </button>
        </motion.form>

        {/* Live Scheduled Events List */}
        <div className="p-6 rounded-xl shadow-card bg-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">
              Scheduled Events in Database ({events.length})
            </h2>
            <button
              onClick={fetchEvents}
              className="p-2 border border-border rounded-lg hover:bg-muted transition-colors"
              title="Refresh Events"
            >
              <RefreshCw size={16} className={loadingEvents ? 'animate-spin' : ''} />
            </button>
          </div>

          {loadingEvents ? (
            <p className="text-sm text-muted-foreground py-4">Loading events from Supabase...</p>
          ) : events.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">
              No events scheduled yet. Use the form above to create your first event!
            </p>
          ) : (
            <div className="divide-y divide-border">
              {events.map((ev) => (
                <div key={ev.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground truncate">{ev.title}</p>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
                        {ev.category}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {ev.location} • {ev.startTime ? new Date(ev.startTime).toLocaleString() : 'Scheduled'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteEvent(ev.id)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete Event"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}