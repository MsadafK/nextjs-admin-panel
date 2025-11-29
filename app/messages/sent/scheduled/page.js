'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Mail, Clock, Search, Filter, Calendar, User, Edit2, Trash2, Play, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mockScheduledMessages = [
  { id: 1, recipient: { name: 'Alice Johnson', avatar: 'AJ', email: 'alice@company.com' }, subject: 'Weekly Team Update', preview: 'Hi team, here\'s the weekly roundup of achievements and next steps for the sprint...', scheduledTime: 'Tomorrow at 9:00 AM', status: 'pending', starred: true },
  { id: 2, recipient: { name: 'Bob Smith', avatar: 'BS', email: 'bob@company.com' }, subject: 'Reminder: Budget Meeting', preview: 'Don\'t forget the budget review meeting on Friday. Agenda attached...', scheduledTime: 'Friday at 2:00 PM', status: 'pending', starred: false },
  { id: 3, recipient: { name: 'Carol Davis', avatar: 'CD', email: 'carol@company.com' }, subject: 'Performance Review Feedback', preview: 'Carol, following up on your Q3 performance review. Great job on the client deliverables!', scheduledTime: 'Next Monday at 10:00 AM', status: 'pending', starred: true },
  { id: 4, recipient: { name: 'David Wilson', avatar: 'DW', email: 'david@company.com' }, subject: 'API Documentation Update', preview: 'David, the latest API docs are ready for your review. Please check the endpoints section...', scheduledTime: 'In 2 days at 3:00 PM', status: 'pending', starred: false },
  { id: 5, recipient: { name: 'Eva Brown', avatar: 'EB', email: 'eva@company.com' }, subject: 'Holiday Schedule', preview: 'Eva, updated holiday schedule for the team. Let me know if there are any conflicts...', scheduledTime: 'Today at 5:00 PM', status: 'pending', starred: false },
];

export default function ScheduledMessages() {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [messages, setMessages] = useState(mockScheduledMessages);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('all');
  const [scheduledCount, setScheduledCount] = useState(0);

  useEffect(() => {
    // Simulate scheduling changes or countdown
    const interval = setInterval(() => {
      setMessages(prev => prev.map(msg => ({
        ...msg,
        status: Math.random() > 0.8 ? 'sending' : msg.status
      })));
    }, 30000);

    setScheduledCount(messages.length);

    return () => clearInterval(interval);
  }, [messages]);

  const filteredMessages = messages.filter(message => 
    (message.recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
     message.preview.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterDate === 'all' || message.scheduledTime.includes(filterDate))
  );

  const getDateFilterLabel = (date) => {
    switch (date) {
      case 'all': return 'All Scheduled';
      case 'today': return 'Today';
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      default: return date;
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Clock className="w-8 h-8" />
              {t('scheduled_messages') || 'Scheduled Messages'}
            </h1>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {scheduledCount} messages queued for delivery. Manage your future sends!
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-200 text-sm font-medium`}>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {scheduledCount} Scheduled
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder={t('search_scheduled') || 'Search by recipient, subject, or content...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className={`px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              <option value="all">All Scheduled</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {/* Messages List */}
        <AnimatePresence>
          {filteredMessages.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {filteredMessages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  className={`p-4 rounded-xl shadow-md ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} transition-all duration-300 hover:shadow-lg`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="relative">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm`}>
                          {message.recipient.avatar}
                        </div>
                        {message.starred && (
                          <Star className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 fill-current" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-sm truncate">{message.recipient.name}</h3>
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs truncate`}>{message.recipient.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        message.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200' 
                          : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                      }`}>
                        {message.status === 'pending' ? 'Pending' : 'Sending'}
                      </div>
                      <p className={`text-xs font-medium mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {message.scheduledTime}
                      </p>
                    </div>
                  </div>
                  <div className="ml-13 border-l-4 border-indigo-200 dark:border-indigo-800 pl-4">
                    <h4 className="font-medium text-sm mb-1 line-clamp-1">{message.subject}</h4>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm line-clamp-2 mb-3`}>{message.preview}</p>
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-1 text-gray-500 hover:text-indigo-500 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-green-500 transition-colors">
                        <Play className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-12 text-center rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} border border-dashed ${isDark ? 'border-gray-700' : 'border-gray-300'}`}
            >
              <Clock className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <h3 className="text-lg font-semibold mb-2">{t('no_scheduled_found') || 'No scheduled messages'}</h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Schedule some messages to see them here.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}