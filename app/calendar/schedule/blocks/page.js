'use client';
import { motion, AnimatePresence } from 'framer-motion';

import { useState, useEffect } from 'react';


import { Calendar, Search, Filter, Clock, Plus, X, Save, Repeat, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';


const mockTimeBlocks = [
  { id: 1, type: 'Focus', start: '09:00', end: '11:00', days: ['Mon', 'Wed', 'Fri'], color: 'bg-muted0', description: 'Deep work session' },
  { id: 2, type: 'Meeting', start: '14:00', end: '15:00', days: ['Tue', 'Thu'], color: 'bg-muted0', description: 'Team sync' },
  { id: 3, type: 'Break', start: '12:00', end: '13:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], color: 'bg-muted0', description: 'Lunch break' },
  { id: 4, type: 'Personal', start: '17:00', end: '18:00', days: ['Mon', 'Wed'], color: 'bg-muted0', description: 'Gym time' },
];

const blockTypes = ['Focus', 'Meeting', 'Break', 'Personal'];

export default function TimeBlocks() {
    const t = () => null;
const [blocks, setBlocks] = useState(mockTimeBlocks);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    start: '',
    end: '',
    days: [],
    description: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleDay = (day) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.type || !formData.start || !formData.end || formData.days.length === 0) {
      setError(t('required_fields') || 'Please fill in all required fields.');
      return;
    }
    const newBlock = { ...formData, id: Date.now(), color: getBlockColor(formData.type) };
    setBlocks(prev => [...prev, newBlock]);
    setSuccess(t('block_added') || 'Time block added successfully!');
    setError('');
    setFormData({ type: '', start: '', end: '', days: [], description: '' });
    setShowForm(false);
  };

  const deleteBlock = (id) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  };

  const getBlockColor = (type) => {
    switch (type) {
      case 'Focus': return 'bg-muted0';
      case 'Meeting': return 'bg-muted0';
      case 'Break': return 'bg-muted0';
      case 'Personal': return 'bg-muted0';
      default: return 'bg-muted0';
    }
  };

  const filteredBlocks = blocks.filter(block => 
    (block.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
     block.type.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterType === 'all' || block.type === filterType)
  );

  return (
    <div className={`min-h-screen bg-muted text-foreground`}>
      {/* Header */}
      <div className="p-6 border-b border-border dark:border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-lg sm:text-xl font-semibold tracking-tight flex items-center gap-3 text-foreground`}>
              <Clock className="w-8 h-8" />
              {t('time_blocks') || 'Time Blocks'}
            </h1>
            <p className={`text-muted-foreground`}>
              Manage your recurring time blocks for better productivity. {blocks.length} blocks configured.
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg hover:opacity-90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            {t('add_block') || 'Add Time Block'}
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground`} />
            <input
              type="text"
              placeholder={t('search_blocks') || 'Search by type or description...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-card border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:outline-none focus:ring-1 focus:ring-ring`}
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className={`w-5 h-5 text-muted-foreground`} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={`px-4 py-3 rounded-lg border bg-card border-border text-foreground focus:outline-none focus:outline-none focus:ring-1 focus:ring-ring`}
            >
              <option value="all">All Types</option>
              {blockTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Blocks List */}
        <AnimatePresence>
          {filteredBlocks.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredBlocks.map((block, index) => (
                <motion.div
                  key={block.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className={`p-6 rounded-xl shadow-card bg-card border border-border transition-all duration-300 hover:shadow-dropdown`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`px-3 py-1 text-xs font-medium rounded-full text-background ${block.color}`}>
                      {block.type}
                    </div>
                    <button onClick={() => deleteBlock(block.id)} className="text-red-500 hover:text-red-600">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    {block.start} - {block.end}
                  </h3>
                  <p className={`text-muted-foreground text-sm mb-3`}>{block.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {block.days.map(day => (
                      <span key={day} className={`px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground`}>
                        {day}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-muted-foreground">
                    <Repeat className="w-4 h-4" />
                    Recurring weekly
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-12 text-center rounded-xl bg-card border border-dashed border-border`}
            >
              <Clock className={`w-16 h-16 mx-auto mb-4 text-muted-foreground`} />
              <h3 className="text-lg font-semibold mb-2">{t('no_blocks_found') || 'No time blocks found'}</h3>
              <p className={`text-muted-foreground`}>Add some time blocks to organize your schedule.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-md p-6 rounded-xl bg-card shadow-card`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-semibold">{t('add_time_block') || 'Add Time Block'}</h2>
                <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-muted-foreground">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Type */}
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 text-foreground`}>
                    {t('type') || 'Type'} *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleFormChange}
                    className={`w-full px-4 py-3 rounded-lg border bg-card border-border text-foreground focus:outline-none focus:outline-none focus:ring-1 focus:ring-ring`}
                  >
                    <option value="">{t('select_type') || 'Select type'}</option>
                    {blockTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Times */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 text-foreground`}>
                      {t('start') || 'Start'} *
                    </label>
                    <input
                      type="time"
                      name="start"
                      value={formData.start}
                      onChange={handleFormChange}
                      className={`w-full px-4 py-3 rounded-lg border bg-card border-border text-foreground focus:outline-none focus:outline-none focus:ring-1 focus:ring-ring`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 text-foreground`}>
                      {t('end') || 'End'} *
                    </label>
                    <input
                      type="time"
                      name="end"
                      value={formData.end}
                      onChange={handleFormChange}
                      className={`w-full px-4 py-3 rounded-lg border bg-card border-border text-foreground focus:outline-none focus:outline-none focus:ring-1 focus:ring-ring`}
                    />
                  </div>
                </div>

                {/* Days */}
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 text-foreground`}>
                    {t('days') || 'Days'} *
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`p-2 text-sm rounded-lg transition-colors ${
                          formData.days.includes(day)
                            ? 'bg-muted0 text-background'
                            : 'bg-muted text-foreground hover:bg-muted'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label className={`block text-sm font-medium mb-2 text-foreground`}>
                    {t('description') || 'Description'}
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows={3}
                    placeholder={t('enter_description') || 'Add details about this time block...'}
                    className={`w-full px-4 py-3 rounded-lg border bg-card border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:outline-none focus:ring-1 focus:ring-ring`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-foreground text-background font-medium hover:opacity-90 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  {t('save_block') || 'Save Time Block'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}