'use client';

import { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Bell, Calendar, Clock, MapPin, Users, Tag, Repeat, Volume2, VolumeX, Paperclip, Send, Zap, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CreateReminder() {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'personal',
    priority: 'medium',
    recurring: false,
    recurringType: 'none',
    sound: true,
    attendees: '',
    attachments: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Reset form after success
    setTimeout(() => {
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: 'personal',
        priority: 'medium',
        recurring: false,
        recurringType: 'none',
        sound: true,
        attendees: '',
        attachments: []
      });
      setShowSuccess(false);
    }, 3000);
  };

  const getCategoryColor = (category) => {
    const colors = {
      work: 'bg-blue-500',
      personal: 'bg-green-500',
      health: 'bg-red-500',
      family: 'bg-purple-500',
      finance: 'bg-yellow-500',
      social: 'bg-pink-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'medium': return <Zap className="w-5 h-5 text-yellow-500" />;
      case 'low': return <Bell className="w-5 h-5 text-green-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const categories = [
    { value: 'personal', label: 'Personal', color: 'bg-green-500' },
    { value: 'work', label: 'Work', color: 'bg-blue-500' },
    { value: 'health', label: 'Health', color: 'bg-red-500' },
    { value: 'family', label: 'Family', color: 'bg-purple-500' },
    { value: 'finance', label: 'Finance', color: 'bg-yellow-500' },
    { value: 'social', label: 'Social', color: 'bg-pink-500' }
  ];

  const recurringOptions = [
    { value: 'none', label: 'No Repeat' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
    { value: 'custom', label: 'Custom' }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} py-8`}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg mb-4">
            <Bell className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Create New Reminder
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Set up your reminder with all the important details
          </p>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="mb-6 p-4 bg-green-500 text-white rounded-2xl shadow-lg flex items-center gap-3"
            >
              <CheckCircle2 className="w-6 h-6" />
              <div>
                <p className="font-semibold">Reminder Created Successfully!</p>
                <p className="text-green-100 text-sm">Your reminder has been scheduled</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className={`rounded-3xl shadow-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} p-8`}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Reminder Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    placeholder="What do you want to be reminded about?"
                    className={`w-full px-4 py-4 text-lg rounded-2xl border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'} focus:outline-none focus:border-blue-500 transition-colors`}
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows={4}
                    placeholder="Add any additional details or notes..."
                    className={`w-full px-4 py-4 rounded-2xl border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'} focus:outline-none focus:border-blue-500 transition-colors resize-none`}
                  />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleFormChange}
                      className={`w-full px-4 py-4 rounded-2xl border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'} focus:outline-none focus:border-blue-500 transition-colors`}
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <Clock className="w-4 h-4 inline mr-2" />
                      Time *
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleFormChange}
                      className={`w-full px-4 py-4 rounded-2xl border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'} focus:outline-none focus:border-blue-500 transition-colors`}
                      required
                    />
                  </div>
                </div>

                {/* Location and Attendees */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleFormChange}
                      placeholder="Add location"
                      className={`w-full px-4 py-4 rounded-2xl border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'} focus:outline-none focus:border-blue-500 transition-colors`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <Users className="w-4 h-4 inline mr-2" />
                      Attendees
                    </label>
                    <input
                      type="text"
                      name="attendees"
                      value={formData.attendees}
                      onChange={handleFormChange}
                      placeholder="Add people (comma separated)"
                      className={`w-full px-4 py-4 rounded-2xl border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'} focus:outline-none focus:border-blue-500 transition-colors`}
                    />
                  </div>
                </div>

                {/* Category and Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <Tag className="w-4 h-4 inline mr-2" />
                      Category
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {categories.map(category => (
                        <button
                          key={category.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, category: category.value }))}
                          className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                            formData.category === category.value
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 transform scale-105'
                              : isDark 
                                ? 'border-gray-600 bg-gray-700 hover:border-gray-500' 
                                : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${category.color}`} />
                            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              {category.label}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Priority Level
                    </label>
                    <div className="space-y-3">
                      {['low', 'medium', 'high'].map(priority => (
                        <button
                          key={priority}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, priority }))}
                          className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                            formData.priority === priority
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 transform scale-105'
                              : isDark 
                                ? 'border-gray-600 bg-gray-700 hover:border-gray-500' 
                                : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {getPriorityIcon(priority)}
                              <span className={`font-medium capitalize ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                {priority} Priority
                              </span>
                            </div>
                            {formData.priority === priority && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recurring Options */}
                <div>
                  <label className={`flex items-center gap-3 mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <input
                      type="checkbox"
                      name="recurring"
                      checked={formData.recurring}
                      onChange={handleFormChange}
                      className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
                    />
                    <Repeat className="w-5 h-5" />
                    <span className="font-semibold">Make this a recurring reminder</span>
                  </label>

                  {formData.recurring && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="overflow-hidden"
                    >
                      <select
                        name="recurringType"
                        value={formData.recurringType}
                        onChange={handleFormChange}
                        className={`w-full px-4 py-4 rounded-2xl border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'} focus:outline-none focus:border-blue-500 transition-colors`}
                      >
                        {recurringOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </motion.div>
                  )}
                </div>

                {/* Sound Toggle */}
                <div className="flex items-center justify-between p-4 rounded-2xl border-2 border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-3">
                    {formData.sound ? (
                      <Volume2 className="w-6 h-6 text-blue-500" />
                    ) : (
                      <VolumeX className="w-6 h-6 text-gray-500" />
                    )}
                    <div>
                      <p className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Sound Notification
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formData.sound ? 'Sound will play when reminder triggers' : 'Reminder will be silent'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, sound: !prev.sound }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.sound ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.sound ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.title || !formData.date || !formData.time}
                  className="w-full py-5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Reminder...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Create Reminder
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Preview Card */}
              <div className={`rounded-3xl shadow-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} p-6`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Reminder Preview
                </h3>
                
                <div className="space-y-4">
                  {/* Title Preview */}
                  {formData.title && (
                    <div>
                      <h4 className={`font-bold text-xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {formData.title}
                      </h4>
                      {formData.description && (
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {formData.description}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Date & Time Preview */}
                  {(formData.date || formData.time) && (
                    <div className="flex items-center gap-4 text-sm">
                      {formData.date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                            {new Date(formData.date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {formData.time && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-green-500" />
                          <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                            {formData.time}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Location & Attendees Preview */}
                  {(formData.location || formData.attendees) && (
                    <div className="space-y-2">
                      {formData.location && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-red-500" />
                          <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                            {formData.location}
                          </span>
                        </div>
                      )}
                      {formData.attendees && (
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-purple-500" />
                          <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                            With: {formData.attendees}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tags Preview */}
                  <div className="flex flex-wrap gap-2">
                    {formData.category && (
                      <span className={`px-3 py-1 text-xs rounded-full ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} capitalize`}>
                        {formData.category}
                      </span>
                    )}
                    {formData.priority && (
                      <span className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 ${
                        formData.priority === 'high' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                          : formData.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                      } capitalize`}>
                        {getPriorityIcon(formData.priority)}
                        {formData.priority}
                      </span>
                    )}
                    {formData.recurring && formData.recurringType !== 'none' && (
                      <span className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300 flex items-center gap-1">
                        <Repeat className="w-3 h-3" />
                        {formData.recurringType}
                      </span>
                    )}
                  </div>

                  {!formData.title && !formData.date && !formData.time && (
                    <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Fill in the form to see preview</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Tips */}
              <div className={`rounded-3xl shadow-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} p-6`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  💡 Quick Tips
                </h3>
                <ul className={`space-y-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                    <span>Be specific with your reminder titles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5" />
                    <span>Set reminders 15 minutes before actual events</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5" />
                    <span>Use categories to organize your reminders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5" />
                    <span>High priority reminders will notify you multiple times</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// AnimatePresence component for the success message
const AnimatePresence = ({ children }) => children;