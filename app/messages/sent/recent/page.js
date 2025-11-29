'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Mail, Send, Search, Filter, Clock, User, Eye, Reply, Trash2, Paperclip, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mockRecentSent = [
  { id: 1, recipient: { name: 'Alice Johnson', avatar: 'AJ', email: 'alice@company.com' }, subject: 'Project Update - Q4 Goals', preview: 'Hi Alice, just wanted to share the latest progress on our Q4 targets. We\'ve hit 85% completion...', timestamp: '2 hours ago', attachments: 1, starred: true },
  { id: 2, recipient: { name: 'Bob Smith', avatar: 'BS', email: 'bob@company.com' }, subject: 'Meeting Tomorrow?', preview: 'Hey Bob, confirming our 10 AM sync on the dashboard redesign. Let me know if the time works...', timestamp: '4 hours ago', attachments: 0, starred: false },
  { id: 3, recipient: { name: 'Carol Davis', avatar: 'CD', email: 'carol@company.com' }, subject: 'Feedback on Report', preview: 'Carol, thanks for the detailed feedback! I\'ll incorporate those changes by EOD today...', timestamp: '1 day ago', attachments: 2, starred: true },
  { id: 4, recipient: { name: 'David Wilson', avatar: 'DW', email: 'david@company.com' }, subject: 'Resource Allocation', preview: 'David, regarding the dev team allocation for next sprint. We need to prioritize the API endpoints first...', timestamp: '1 day ago', attachments: 0, starred: false },
  { id: 5, recipient: { name: 'Eva Brown', avatar: 'EB', email: 'eva@company.com' }, subject: 'Vacation Approval', preview: 'Eva, your vacation request has been approved for next week. Enjoy your time off!', timestamp: '2 days ago', attachments: 0, starred: false },
  { id: 6, recipient: { name: 'Frank Miller', avatar: 'FM', email: 'frank@company.com' }, subject: 'Budget Review', preview: 'Frank, please review the attached budget proposal for the marketing campaign...', timestamp: '3 days ago', attachments: 3, starred: true },
];

export default function RecentSent() {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [messages, setMessages] = useState(mockRecentSent);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('all');
  const [sentCount, setSentCount] = useState(0);

  useEffect(() => {
    // Simulate new sent messages
    const interval = setInterval(() => {
      const newMessage = {
        id: Date.now(),
        recipient: { name: 'New Recipient', avatar: 'NR', email: 'new@company.com' },
        subject: 'Quick Update',
        preview: 'Just sent a new message...',
        timestamp: 'Just now',
        attachments: 0,
        starred: false,
      };
      setMessages(prev => [newMessage, ...prev.slice(0, 9)]); // Keep top 10
    }, 20000);

    setSentCount(messages.length);

    return () => clearInterval(interval);
  }, [messages]);

  const filteredMessages = messages.filter(message => 
    (message.recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
     message.preview.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterDate === 'all' || message.timestamp.includes(filterDate))
  );

  const getDateFilterLabel = (date) => {
    switch (date) {
      case 'all': return 'All Time';
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
              <Send className="w-8 h-8" />
              {t('recent_sent') || 'Recent Sent'}
            </h1>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {sentCount} messages sent recently. Stay connected!
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-sm font-medium`}>
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {sentCount} Sent
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
              placeholder={t('search_messages') || 'Search by recipient, subject, or content...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className={`px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="all">All Time</option>
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
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm`}>
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
                      <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {message.timestamp}
                      </p>
                      {message.attachments > 0 && (
                        <div className="flex items-center gap-1 text-xs text-blue-500 mt-1">
                          <Paperclip className="w-3 h-3" />
                          {message.attachments}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="ml-13 border-l-4 border-blue-200 dark:border-blue-800 pl-4">
                    <h4 className="font-medium text-sm mb-1 line-clamp-1">{message.subject}</h4>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm line-clamp-2 mb-3`}>{message.preview}</p>
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-1 text-gray-500 hover:text-blue-500 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-green-500 transition-colors">
                        <Reply className="w-4 h-4" />
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
              <Mail className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <h3 className="text-lg font-semibold mb-2">{t('no_messages_found') || 'No messages found'}</h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Try searching or adjust your date filter.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}