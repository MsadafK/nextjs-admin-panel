'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Bell, BellOff, Calendar, Clock, Filter, Search, Plus, X, Edit3, Trash2, CheckCircle, AlertCircle, MoreVertical, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mockReminders = [
  {
    id: 1,
    title: 'Team Meeting',
    description: 'Weekly team sync with design and development teams',
    date: '2024-01-15',
    time: '14:30',
    priority: 'high',
    category: 'work',
    recurring: true,
    active: true,
    sound: true,
    createdAt: '2024-01-10',
    color: 'bg-blue-500'
  },
  {
    id: 2,
    title: 'Dentist Appointment',
    description: 'Regular dental checkup at Smile Clinic',
    date: '2024-01-16',
    time: '10:00',
    priority: 'medium',
    category: 'personal',
    recurring: false,
    active: true,
    sound: true,
    createdAt: '2024-01-08',
    color: 'bg-green-500'
  },
  {
    id: 3,
    title: 'Project Deadline',
    description: 'Submit final project deliverables to client',
    date: '2024-01-20',
    time: '17:00',
    priority: 'high',
    category: 'work',
    recurring: false,
    active: true,
    sound: false,
    createdAt: '2024-01-05',
    color: 'bg-red-500'
  },
  {
    id: 4,
    title: 'Gym Session',
    description: 'Evening workout at fitness center',
    date: '2024-01-15',
    time: '18:30',
    priority: 'low',
    category: 'health',
    recurring: true,
    active: true,
    sound: true,
    createdAt: '2024-01-12',
    color: 'bg-purple-500'
  },
  {
    id: 5,
    title: 'Book Return',
    description: 'Return borrowed books to library',
    date: '2024-01-18',
    time: '15:00',
    priority: 'low',
    category: 'personal',
    recurring: false,
    active: true,
    sound: false,
    createdAt: '2024-01-09',
    color: 'bg-yellow-500'
  }
];

const priorityOptions = ['all', 'high', 'medium', 'low'];
const categoryOptions = ['all', 'work', 'personal', 'health', 'shopping'];

export default function ActiveReminders() {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [reminders, setReminders] = useState(mockReminders);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    priority: 'medium',
    category: 'personal',
    recurring: false,
    sound: true
  });

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.time) {
      return;
    }

    const newReminder = {
      ...formData,
      id: Date.now(),
      active: true,
      createdAt: new Date().toISOString().split('T')[0],
      color: getCategoryColor(formData.category)
    };

    setReminders(prev => [newReminder, ...prev]);
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      priority: 'medium',
      category: 'personal',
      recurring: false,
      sound: true
    });
    setShowForm(false);
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

  const toggleSound = (id) => {
    setReminders(prev => prev.map(reminder =>
      reminder.id === id ? { ...reminder, sound: !reminder.sound } : reminder
    ));
    setActiveDropdown(null);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'work': return 'bg-blue-500';
      case 'personal': return 'bg-green-500';
      case 'health': return 'bg-purple-500';
      case 'shopping': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const isUpcoming = (dateString) => {
    const today = new Date();
    const reminderDate = new Date(dateString);
    return reminderDate >= today;
  };

  const filteredReminders = reminders.filter(reminder =>
    reminder.active &&
    (reminder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     reminder.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterPriority === 'all' || reminder.priority === filterPriority) &&
    (filterCategory === 'all' || reminder.category === filterCategory)
  );

  const activeCount = reminders.filter(r => r.active).length;
  const upcomingCount = reminders.filter(r => r.active && isUpcoming(r.date)).length;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' : 'bg-gradient-to-br from-blue-50 to-gray-100 text-gray-900'}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${isDark ? 'bg-blue-600' : 'bg-blue-500'} shadow-lg`}>
              <Bell className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('active_reminders') || 'Active Reminders'}
              </h1>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} flex items-center gap-2 mt-1`}>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {activeCount} active
                </span>
                • 
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  {upcomingCount} upcoming
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            {t('add_reminder') || 'Add Reminder'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg border-l-4 border-blue-500`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Active</p>
                <p className="text-3xl font-bold text-blue-500">{activeCount}</p>
              </div>
              <Bell className="w-8 h-8 text-blue-500" />
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
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Upcoming</p>
                <p className="text-3xl font-bold text-green-500">{upcomingCount}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg border-l-4 border-purple-500`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>High Priority</p>
                <p className="text-3xl font-bold text-purple-500">
                  {reminders.filter(r => r.active && r.priority === 'high').length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-purple-500" />
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
              placeholder={t('search_reminders') || 'Search reminders...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'} focus:outline-none focus:border-blue-500 transition-colors`}
            />
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Filter className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className={`px-4 py-4 rounded-xl border-2 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'} focus:outline-none focus:border-blue-500 transition-colors`}
              >
                <option value="all">All Priorities</option>
                {priorityOptions.slice(1).map(priority => (
                  <option key={priority} value={priority} className="capitalize">
                    {priority}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`px-4 py-4 rounded-xl border-2 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'} focus:outline-none focus:border-blue-500 transition-colors`}
            >
              <option value="all">All Categories</option>
              {categoryOptions.slice(1).map(category => (
                <option key={category} value={category} className="capitalize">
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reminders List */}
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
                  {/* Priority Indicator */}
                  <div className={`absolute top-0 left-0 w-2 h-full ${reminder.priority === 'high' ? 'bg-red-500' : reminder.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />

                  <div className="ml-3">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
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
                                onClick={() => toggleSound(reminder.id)}
                                className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors first:rounded-t-xl last:rounded-b-xl"
                              >
                                {reminder.sound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                                {reminder.sound ? 'Mute Sound' : 'Enable Sound'}
                              </button>
                              <button
                                onClick={() => toggleReminderStatus(reminder.id)}
                                className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              >
                                <BellOff className="w-4 h-4" />
                                Deactivate
                              </button>
                              <button
                                onClick={() => deleteReminder(reminder.id)}
                                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
                    <p className={`mb-4 line-clamp-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {reminder.description}
                    </p>

                    {/* Date and Time */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {formatDate(reminder.date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-500" />
                        <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {reminder.time}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(reminder.priority)} capitalize`}>
                        {reminder.priority} priority
                      </span>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} capitalize`}>
                        {reminder.category}
                      </span>
                      {reminder.recurring && (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300 flex items-center gap-1">
                          <RotateCcw className="w-3 h-3" />
                          recurring
                        </span>
                      )}
                      {reminder.sound ? (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 flex items-center gap-1">
                          <Volume2 className="w-3 h-3" />
                          sound on
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 flex items-center gap-1">
                          <VolumeX className="w-3 h-3" />
                          muted
                        </span>
                      )}
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
              <Bell className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <h3 className="text-xl font-semibold mb-2">{t('no_reminders_found') || 'No reminders found'}</h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
                {searchTerm || filterPriority !== 'all' || filterCategory !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Create your first reminder to get started'}
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-5 h-5 inline mr-2" />
                Add Reminder
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Reminder Modal */}
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
              className={`w-full max-w-md p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  {t('add_reminder') || 'Add New Reminder'}
                </h2>
                <button 
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
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
                    className={`w-full px-4 py-3 rounded-xl border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'} focus:outline-none focus:border-blue-500 transition-colors`}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows={3}
                    placeholder="Add details about this reminder..."
                    className={`w-full px-4 py-3 rounded-xl border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'} focus:outline-none focus:border-blue-500 transition-colors`}
                  />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleFormChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'} focus:outline-none focus:border-blue-500 transition-colors`}
                    />
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
                      className={`w-full px-4 py-3 rounded-xl border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'} focus:outline-none focus:border-blue-500 transition-colors`}
                    />
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
                      className={`w-full px-4 py-3 rounded-xl border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'} focus:outline-none focus:border-blue-500 transition-colors`}
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
                      className={`w-full px-4 py-3 rounded-xl border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'} focus:outline-none focus:border-blue-500 transition-colors`}
                    >
                      <option value="personal">Personal</option>
                      <option value="work">Work</option>
                      <option value="health">Health</option>
                      <option value="shopping">Shopping</option>
                    </select>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="recurring"
                      checked={formData.recurring}
                      onChange={handleFormChange}
                      className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
                    />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Recurring reminder</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="sound"
                      checked={formData.sound}
                      onChange={handleFormChange}
                      className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
                    />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Enable sound notification</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Create Reminder
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}