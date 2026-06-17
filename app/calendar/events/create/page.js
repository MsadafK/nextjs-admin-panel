'use client';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';


import { Calendar, Clock, MapPin, Users, FileText, Save, X, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CreateEvent() {
    const t = () => null;
const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    participants: [],
    category: '',
  });
  const [participantInput, setParticipantInput] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addParticipant = () => {
    if (participantInput.trim() && !formData.participants.includes(participantInput.trim())) {
      setFormData(prev => ({
        ...prev,
        participants: [...prev.participants, participantInput.trim()],
      }));
      setParticipantInput('');
    }
  };

  const removeParticipant = (index) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.startTime) {
      setErrorMessage(t('required_fields') || 'Please fill in required fields: Title, Date, and Start Time.');
      setSuccessMessage('');
      return;
    }
    // Simulate API call
    console.log('Creating event:', formData);
    setSuccessMessage(t('event_created') || 'Event created successfully!');
    setErrorMessage('');
    // Reset form
    setFormData({
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      description: '',
      participants: [],
      category: '',
    });
    setParticipantInput('');
  };

  return (
    <div className={`min-h-screen bg-muted text-foreground`}>
      {/* Header */}
      <div className="p-6 border-b border-border dark:border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-lg sm:text-xl font-semibold tracking-tight flex items-center gap-3 text-foreground`}>
              <Plus className="w-8 h-8" />
              {t('create_event') || 'Create Event'}
            </h1>
            <p className={`text-muted-foreground`}>
              Schedule new events and invite your team. All fields are optional except marked ones.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-6 max-w-2xl mx-auto">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className={`p-8 rounded-xl shadow-xl bg-card border border-border`}
        >
          {/* Title */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 text-foreground`}>
              {t('event_title') || 'Event Title'} *
            </label>
            <div className="relative">
              <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder={t('enter_title') || 'Enter event title'}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-card border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:outline-none focus:ring-1 focus:ring-ring`}
              />
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className={`block text-sm font-medium mb-2 text-foreground`}>
                {t('date') || 'Date'} *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border bg-card border-border text-foreground focus:outline-none focus:outline-none focus:ring-1 focus:ring-ring`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 text-foreground`}>
                {t('start_time') || 'Start Time'} *
              </label>
              <div className="relative">
                <Clock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-card border-border text-foreground focus:outline-none focus:outline-none focus:ring-1 focus:ring-ring`}
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 text-foreground`}>
                {t('end_time') || 'End Time'}
              </label>
              <div className="relative">
                <Clock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-card border-border text-foreground focus:outline-none focus:outline-none focus:ring-1 focus:ring-ring`}
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 text-foreground`}>
              {t('location') || 'Location'}
            </label>
            <div className="relative">
              <MapPin className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder={t('enter_location') || 'Enter location or online link'}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-card border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:outline-none focus:ring-1 focus:ring-ring`}
              />
            </div>
          </div>

          {/* Participants */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 text-foreground`}>
              {t('participants') || 'Participants'}
            </label>
            <div className="relative">
              <Users className={`absolute left-3 top-3 w-5 h-5 text-muted-foreground`} />
              <input
                type="text"
                value={participantInput}
                onChange={(e) => setParticipantInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
                placeholder={t('add_participant') || 'Add email or name and press Enter'}
                className={`w-full pl-10 pr-12 py-3 rounded-lg border bg-card border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:outline-none focus:ring-1 focus:ring-ring`}
              />
              <button
                type="button"
                onClick={addParticipant}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-600"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {formData.participants.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.participants.map((part, index) => (
                  <span key={index} className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-muted text-foreground`}>
                    {part}
                    <button onClick={() => removeParticipant(index)} className="text-red-500 hover:text-red-600">
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 text-foreground`}>
              {t('description') || 'Description'}
            </label>
            <div className="relative">
              <FileText className={`absolute left-3 top-3 w-5 h-5 text-muted-foreground`} />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder={t('enter_description') || 'Provide event details...'}
                rows={4}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-card border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:outline-none focus:ring-1 focus:ring-ring`}
              />
            </div>
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 text-foreground`}>
              {t('category') || 'Category'}
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border bg-card border-border text-foreground focus:outline-none focus:outline-none focus:ring-1 focus:ring-ring`}
            >
              <option value="">{t('select_category') || 'Select category'}</option>
              <option value="Meeting">Meeting</option>
              <option value="Webinar">Webinar</option>
              <option value="Social">Social</option>
              <option value="Training">Training</option>
              <option value="Brainstorm">Brainstorm</option>
            </select>
          </div>

          {/* Messages */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-4 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              {successMessage}
            </motion.div>
          )}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-4 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 flex items-center gap-2"
            >
              <AlertCircle className="w-5 h-5" />
              {errorMessage}
            </motion.div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-foreground text-background font-medium hover:opacity-90 transition-colors focus:outline-none focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-2"
          >
            <Save className="w-5 h-5" />
            {t('create_event') || 'Create Event'}
          </button>
        </motion.form>
      </div>
    </div>
  );
}