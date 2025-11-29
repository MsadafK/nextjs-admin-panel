'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Mail, CheckCircle, XCircle, Clock, Search, Filter, User, RefreshCw, Eye, Reply, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mockDeliveryStatus = [
  { id: 1, recipient: { name: 'Alice Johnson', avatar: 'AJ', email: 'alice@company.com' }, subject: 'Project Update - Q4 Goals', sentTime: '2 hours ago', status: 'delivered', statusIcon: CheckCircle, deliveryTime: 'Delivered at 10:30 AM' },
  { id: 2, recipient: { name: 'Bob Smith', avatar: 'BS', email: 'bob@company.com' }, subject: 'Meeting Tomorrow?', sentTime: '4 hours ago', status: 'failed', statusIcon: XCircle, reason: 'Invalid email address' },
  { id: 3, recipient: { name: 'Carol Davis', avatar: 'CD', email: 'carol@company.com' }, subject: 'Feedback on Report', sentTime: '1 day ago', status: 'pending', statusIcon: Clock, deliveryTime: 'Pending since 9:15 AM' },
  { id: 4, recipient: { name: 'David Wilson', avatar: 'DW', email: 'david@company.com' }, subject: 'Resource Allocation', sentTime: '1 day ago', status: 'delivered', statusIcon: CheckCircle, deliveryTime: 'Delivered at 2:45 PM' },
  { id: 5, recipient: { name: 'Eva Brown', avatar: 'EB', email: 'eva@company.com' }, subject: 'Vacation Approval', sentTime: '2 days ago', status: 'failed', statusIcon: XCircle, reason: 'Server timeout' },
  { id: 6, recipient: { name: 'Frank Miller', avatar: 'FM', email: 'frank@company.com' }, subject: 'Budget Review', sentTime: '3 days ago', status: 'delivered', statusIcon: CheckCircle, deliveryTime: 'Delivered at 11:20 AM' },
];

const statusColors = {
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
};

export default function DeliveryStatus() {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [messages, setMessages] = useState(mockDeliveryStatus);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deliveryCount, setDeliveryCount] = useState(0);

  useEffect(() => {
    // Simulate status updates
    const interval = setInterval(() => {
      setMessages(prev => prev.map(msg => {
        if (msg.status === 'pending' && Math.random() > 0.7) {
          return { ...msg, status: 'delivered', deliveryTime: 'Delivered just now' };
        }
        if (msg.status === 'failed' && Math.random() > 0.5) {
          return { ...msg, status: 'delivered', deliveryTime: 'Delivered after retry' };
        }
        return msg;
      }));
    }, 25000);

    setDeliveryCount(messages.filter(m => m.status === 'delivered').length);

    return () => clearInterval(interval);
  }, [messages]);

  const filteredMessages = messages.filter(message => 
    (message.recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     message.subject.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterStatus === 'all' || message.status === filterStatus)
  );

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Mail className="w-8 h-8" />
              {t('delivery_status') || 'Delivery Status'}
            </h1>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Track the delivery of your sent messages. {deliveryCount} successfully delivered.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 text-sm font-medium`}>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                {deliveryCount} Delivered
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
              placeholder={t('search_messages') || 'Search by recipient or subject...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-green-500`}
            >
              <option value="all">All Status</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
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
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm`}>
                          {message.recipient.avatar}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-sm truncate">{message.recipient.name}</h3>
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs truncate`}>{message.recipient.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[message.status]}`}>
                        <message.statusIcon className="w-3 h-3 mr-1" />
                        {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                      </div>
                      <p className={`text-xs font-medium mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {message.sentTime}
                      </p>
                    </div>
                  </div>
                  <div className="ml-13 border-l-4 border-green-200 dark:border-green-800 pl-4">
                    <h4 className="font-medium text-sm mb-1 line-clamp-1">{message.subject}</h4>
                    {message.deliveryTime && (
                      <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm mb-3`}>{message.deliveryTime}</p>
                    )}
                    {message.reason && (
                      <div className="flex items-center gap-1 text-xs text-red-500 mb-3">
                        <XCircle className="w-3 h-3" />
                        {message.reason}
                      </div>
                    )}
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-1 text-gray-500 hover:text-green-500 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      {message.status === 'failed' && (
                        <button className="p-1 text-gray-500 hover:text-blue-500 transition-colors flex items-center">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
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
              <h3 className="text-lg font-semibold mb-2">{t('no_status_found') || 'No delivery status available'}</h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Try searching or adjust your status filter.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}