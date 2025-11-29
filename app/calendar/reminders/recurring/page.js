'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Repeat, Calendar, Clock, Filter, Search, Plus, X, Edit3, Trash2, Bell, RotateCcw, Play, Pause, MoreVertical, Zap, Settings, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mockRecurringReminders = [
  {
    id: 1,
    title: 'Morning Standup',
    description: 'Daily team sync meeting with development team',
    frequency: 'daily',
    time: '09:30',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    priority: 'high',
    category: 'work',
    active: true,
    nextOccurrence: '2024-01-16',
    sound: true,
    createdAt: '2024-01-01',
    color: 'bg-blue-500'
  },
  {
    id: 2,
    title: 'Gym Workout',
    description: 'Evening workout session at fitness center',
    frequency: 'weekly',
    time: '18:00',
    days: ['Mon', 'Wed', 'Fri'],
    priority: 'medium',
    category: 'health',
    active: true,
    nextOccurrence: '2024-01-17',
    sound: true,
    createdAt: '2024-01-05',
    color: 'bg-green-500'
  },
  {
    id: 3,
    title: 'Client Report',
    description: 'Generate and send weekly client progress report',
    frequency: 'weekly',
    time: '16:00',
    days: ['Fri'],
    priority: 'high',
    category: 'work',
    active: true,
    nextOccurrence: '2024-01-19',
    sound: false,
    createdAt: '2024-01-03',
    color: 'bg-purple-500'
  },
  {
    id: 4,
    title: 'Meditation',
    description: 'Morning meditation and mindfulness practice',
    frequency: 'daily',
    time: '07:00',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    priority: 'low',
    category: 'health',
    active: false,
    nextOccurrence: '2024-01-16',
    sound: true,
    createdAt: '2024-01-08',
    color: 'bg-yellow-500'
  },
  {
    id: 5,
    title: 'Budget Review',
    description: 'Monthly personal finance and budget tracking',
    frequency: 'monthly',
    time: '20:00',
    days: ['01'],
    priority: 'medium',
    category: 'personal',
    active: true,
    nextOccurrence: '2024-02-01',
    sound: true,
    createdAt: '2024-01-10',
    color: 'bg-indigo-500'
  },
  {
    id: 6,
    title: 'Team Retrospective',
    description: 'Bi-weekly team retrospective and feedback session',
    frequency: 'bi-weekly',
    time: '15:00',
    days: ['Fri'],
    priority: 'medium',
    category: 'work',
    active: true,
    nextOccurrence: '2024-01-26',
    sound: true,
    createdAt: '2024-01-07',
    color: 'bg-pink-500'
  }
];

const frequencyOptions = ['all', 'daily', 'weekly', 'bi-weekly', 'monthly', 'yearly'];
const categoryOptions = ['all', 'work', 'health', 'personal', 'family', 'finance'];

export default function RecurringReminders() {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [reminders, setReminders] = useState(mockRecurringReminders);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFrequency, setFilterFrequency] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    frequency: 'weekly',
    time: '',
    days: [],
    priority: 'medium',
    category: 'personal',
    sound: true
  });

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
    if (!formData.title || !formData.time || formData.days.length === 0) {
      return;
    }

    const newReminder = {
      ...formData,
      id: Date.now(),
      active: true,
      nextOccurrence: calculateNextOccurrence(formData.frequency, formData.days),
      createdAt: new Date().toISOString().split('T')[0],
      color: getCategoryColor(formData.category)
    };

    setReminders(prev => [newReminder, ...prev]);
    setFormData({
      title: '',
      description: '',
      frequency: 'weekly',
      time: '',
      days: [],
      priority: 'medium',
      category: 'personal',
      sound: true
    });
    setShowForm(false);
  };

  const calculateNextOccurrence = (frequency, days) => {
    const today = new Date();
    switch (frequency) {
      case 'daily':
        return today.toISOString().split('T')[0];
      case 'weekly':
        // Return next occurrence based on days
        return new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0];
      case 'monthly':
        return new Date(today.getFullYear(), today.getMonth() + 1, 1).toISOString().split('T')[0];
      default:
        return today.toISOString().split('T')[0];
    }
  };

  const deleteReminder = (id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    setActiveDropdown(null);
  };

  const toggleReminderStatus = (id) => {
    setReminders(prev => prev.map(reminder =>
      reminder.id === id ? { ...reminder, active: !reminder.active } : reminder
    ));
    setActiveDropdown(null);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'work': return 'bg-blue-500';
      case 'health': return 'bg-green-500';
      case 'personal': return 'bg-purple-500';
      case 'family': return 'bg-pink-500';
      case 'finance': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getFrequencyColor = (frequency) => {
    switch (frequency) {
      case 'daily': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'weekly': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'bi-weekly': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'monthly': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'yearly': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium': return <Zap className="w-4 h-4 text-yellow-500" />;
      case 'low': return <Bell className="w-4 h-4 text-green-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatFrequency = (frequency) => {
    return frequency.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('-');
  };

  const filteredReminders = reminders.filter(reminder =>
    (reminder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     reminder.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterFrequency === 'all' || reminder.frequency === filterFrequency) &&
    (filterCategory === 'all' || reminder.category === filterCategory) &&
    (filterStatus === 'all' || 
     (filterStatus === 'active' && reminder.active) ||
     (filterStatus === 'inactive' && !reminder.active))
  );

  const activeCount = reminders.filter(r => r.active).length;
  const dailyCount = reminders.filter(r => r.frequency === 'daily').length;
  const weeklyCount = reminders.filter(r => r.frequency === 'weekly').length;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' : 'bg-gradient-to-br from-purple-50 to-blue-50 text-gray-900'}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${isDark ? 'bg-gradient-to-br from-purple-600 to-pink-600' : 'bg-gradient-to-br from-purple-500 to-pink-500'} shadow-lg`}>
              <Repeat className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {t('recurring_reminders') || 'Recurring Reminders'}
              </h1>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} flex items-center gap-4 mt-1`}>
                <span className="flex items-center gap-1">
                  <Play className="w-4 h-4 text-green-500" />
                  {activeCount} active
                </span>
                • 
                <span className="flex items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-blue-500" />
                  {dailyCount} daily • {weeklyCount} weekly
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            {t('add_recurring') || 'Add Recurring'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg border-l-4 border-purple-500`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Recurring</p>
                <p className="text-3xl font-bold text-purple-500">{reminders.length}</p>
              </div>
              <Repeat className="w-8 h-8 text-purple-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg border-l-4 border-green-500`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Active</p>
                <p className="text-3xl font-bold text-green-500">{activeCount}</p>
              </div>
              <Play className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg border-l-4 border-blue-500`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Daily</p>
                <p className="text-3xl font-bold text-blue-500">{dailyCount}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg border-l-4 border-pink-500`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Weekly+</p>
                <p className="text-3xl font-bold text-pink-500">{weeklyCount + reminders.filter(r => r.frequency === 'bi-weekly').length}</p>
              </div>
              <RotateCcw className="w-8 h-8 text-pink-500" />
            </div>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder={t('search_recurring') || 'Search recurring reminders...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'} focus:outline-none focus:border-purple-500 transition-colors`}
            />
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <select
              value={filterFrequency}
              onChange={(e) => setFilterFrequency(e.target.value)}
              className={`px-4 py-4 rounded-xl border-2 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'} focus:outline-none focus:border-purple-500 transition-colors`}
            >
              <option value="all">All Frequencies</option>
              {frequencyOptions.slice(1).map(freq => (
                <option key={freq} value={freq} className="capitalize">
                  {formatFrequency(freq)}
                </option>
              ))}
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`px-4 py-4 rounded-xl border-2 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'} focus:outline-none focus:border-purple-500 transition-colors`}
            >
              <option value="all">All Categories</option>
              {categoryOptions.slice(1).map(category => (
                <option key={category} value={category} className="capitalize">
                  {category}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-4 py-4 rounded-xl border-2 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'} focus:outline-none focus:border-purple-500 transition-colors`}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Reminders Grid */}
        <AnimatePresence>
          {filteredReminders.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {filteredReminders.map((reminder, index) => (
                <motion.div
                  key={reminder.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`p-6 rounded-2xl shadow-lg backdrop-blur-sm ${
                    isDark 
                      ? 'bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600' 
                      : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
                  } transition-all duration-300 hover:shadow-xl relative overflow-hidden`}
                >
                  {/* Status Indicator */}
                  <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${reminder.active ? 'bg-green-500' : 'bg-gray-500'}`} />

                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-3 h-3 rounded-full ${reminder.color}`} />
                        <h3 className="font-bold text-lg truncate">{reminder.title}</h3>
                      </div>
                      
                      {/* Dropdown Menu */}
                      <div className="relative">
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === reminder.id ? null : reminder.id)}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        <AnimatePresence>
                          {activeDropdown === reminder.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className={`absolute right-0 top-10 w-48 rounded-xl shadow-lg border ${
                                isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
                              } z-10`}
                            >
                              <button
                                onClick={() => toggleReminderStatus(reminder.id)}
                                className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors first:rounded-t-xl"
                              >
                                {reminder.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                {reminder.active ? 'Pause' : 'Activate'}
                              </button>
                              <button className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <Edit3 className="w-4 h-4" />
                                Edit
                              </button>
                              <button
                                onClick={() => deleteReminder(reminder.id)}
                                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors last:rounded-b-xl"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Description */}
                    <p className={`mb-4 line-clamp-2 flex-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {reminder.description}
                    </p>

                    {/* Time and Frequency */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {reminder.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Repeat className="w-4 h-4 text-purple-500" />
                        <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {formatFrequency(reminder.frequency)}
                        </span>
                      </div>
                    </div>

                    {/* Next Occurrence */}
                    <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className={`text-sm font-medium ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                        Next: {reminder.nextOccurrence}
                      </span>
                    </div>

                    {/* Tags and Days */}
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getFrequencyColor(reminder.frequency)}`}>
                          {formatFrequency(reminder.frequency)}
                        </span>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} capitalize`}>
                          {reminder.category}
                        </span>
                        <div className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                          {getPriorityIcon(reminder.priority)}
                          {reminder.priority}
                        </div>
                      </div>

                      {/* Days */}
                      <div className="flex flex-wrap gap-1">
                        {reminder.days.map(day => (
                          <span 
                            key={day} 
                            className={`px-2 py-1 text-xs rounded-full ${
                              isDark 
                                ? 'bg-purple-900/30 text-purple-300 border border-purple-700' 
                                : 'bg-purple-100 text-purple-700 border border-purple-200'
                            }`}
                          >
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-12 text-center rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} border-2 border-dashed ${isDark ? 'border-gray-700' : 'border-gray-300'}`}
            >
              <Repeat className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <h3 className="text-xl font-semibold mb-2">{t('no_recurring_found') || 'No recurring reminders found'}</h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
                {searchTerm || filterFrequency !== 'all' || filterCategory !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Create your first recurring reminder to automate your schedule'}
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-colors"
              >
                <Plus className="w-5 h-5 inline mr-2" />
                Add Recurring Reminder
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Recurring Reminder Modal */}
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
              className={`w-full max-w-2xl p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-2xl max-h-[90vh] overflow-y-auto`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {t('add_recurring') || 'Add Recurring Reminder'}
                </h2>
                <button 
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title and Description */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      placeholder="Enter reminder title"
                      className={`w-full px-4 py-3 rounded-xl border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'} focus:outline-none focus:border-purple-500 transition-colors`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      rows={3}
                      placeholder="Add details about this recurring reminder..."
                      className={`w-full px-4 py-3 rounded-xl border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'} focus:outline-none focus:border-purple-500 transition-colors`}
                    />
                  </div>
                </div>

                {/* Frequency and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Frequency *
                    </label>
                    <select
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleFormChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'} focus:outline-none focus:border-purple-500 transition-colors`}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="bi-weekly">Bi-Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Time *
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleFormChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'} focus:outline-none focus:border-purple-500 transition-colors`}
                    />
                  </div>
                </div>

                {/* Days Selection */}
                <div>
                  <label className={`block text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Days *
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`p-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                          formData.days.includes(day)
                            ? 'bg-purple-500 text-white shadow-lg transform scale-105'
                            : isDark 
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority and Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleFormChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'} focus:outline-none focus:border-purple-500 transition-colors`}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'} focus:outline-none focus:border-purple-500 transition-colors`}
                    >
                      <option value="personal">Personal</option>
                      <option value="work">Work</option>
                      <option value="health">Health</option>
                      <option value="family">Family</option>
                      <option value="finance">Finance</option>
                    </select>
                  </div>
                </div>

                {/* Sound Toggle */}
                <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-600">
                  <input
                    type="checkbox"
                    name="sound"
                    checked={formData.sound}
                    onChange={handleFormChange}
                    className="w-5 h-5 text-purple-500 rounded focus:ring-purple-500"
                  />
                  <div>
                    <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Enable sound notification</span>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Play sound when reminder triggers</p>
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={!formData.title || !formData.time || formData.days.length === 0}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Create Recurring Reminder
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}