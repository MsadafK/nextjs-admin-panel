'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Archive, Search, Filter, Clock, User, Eye, Trash2, Star, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mockArchivedConversations = [
  { id: 1, participant: { name: 'Alice Johnson', avatar: 'AJ', email: 'alice@company.com' }, subject: 'Project Collaboration Thread', lastMessage: 'Looking forward to the next phase...', messageCount: 15, archivedDate: '1 week ago', starred: true },
  { id: 2, participant: { name: 'Bob Smith', avatar: 'BS', email: 'bob@company.com' }, subject: 'Design Feedback Discussion', lastMessage: 'Changes look great, approved!', messageCount: 8, archivedDate: '2 weeks ago', starred: false },
  { id: 3, participant: { name: 'Carol Davis', avatar: 'CD', email: 'carol@company.com' }, subject: 'Team Meeting Notes', lastMessage: 'Action items assigned to all members.', messageCount: 22, archivedDate: '1 month ago', starred: true },
  { id: 4, participant: { name: 'David Wilson', avatar: 'DW', email: 'david@company.com' }, subject: 'API Integration Queries', lastMessage: 'Resolved the endpoint issues.', messageCount: 12, archivedDate: '3 weeks ago', starred: false },
  { id: 5, participant: { name: 'Eva Brown', avatar: 'EB', email: 'eva@company.com' }, subject: 'HR Policy Updates', lastMessage: 'New policies effective from next quarter.', messageCount: 6, archivedDate: '2 months ago', starred: false },
  { id: 6, participant: { name: 'Frank Miller', avatar: 'FM', email: 'frank@company.com' }, subject: 'Budget Planning Conversation', lastMessage: 'Final budget approved.', messageCount: 18, archivedDate: '1 month ago', starred: true },
];

export default function ArchivedConversations() {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [conversations, setConversations] = useState(mockArchivedConversations);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('all');
  const [archivedCount, setArchivedCount] = useState(0);

  useEffect(() => {
    setArchivedCount(conversations.length);
  }, [conversations]);

  const filteredConversations = conversations.filter(convo => 
    (convo.participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     convo.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
     convo.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterDate === 'all' || convo.archivedDate.includes(filterDate))
  );

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Archive className="w-8 h-8" />
              {t('archived_conversations') || 'Archived Conversations'}
            </h1>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {archivedCount} conversations stored for reference. Access past discussions anytime.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-lg bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 text-sm font-medium`}>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                {archivedCount} Archived
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
              placeholder={t('search_archived') || 'Search by participant, subject, or content...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-orange-500`}
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className={`px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-orange-500`}
            >
              <option value="all">All Time</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>

        {/* Conversations List */}
        <AnimatePresence>
          {filteredConversations.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {filteredConversations.map((convo, index) => (
                <motion.div
                  key={convo.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  className={`p-4 rounded-xl shadow-md ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} transition-all duration-300 hover:shadow-lg`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="relative">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-semibold text-sm`}>
                          {convo.participant.avatar}
                        </div>
                        {convo.starred && (
                          <Star className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 fill-current" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-sm truncate">{convo.participant.name}</h3>
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs truncate`}>{convo.participant.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {convo.archivedDate}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-orange-500 mt-1">
                        <MessageSquare className="w-3 h-3" />
                        {convo.messageCount}
                      </div>
                    </div>
                  </div>
                  <div className="ml-13 border-l-4 border-orange-200 dark:border-orange-800 pl-4">
                    <h4 className="font-medium text-sm mb-1 line-clamp-1">{convo.subject}</h4>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm line-clamp-2 mb-3`}>{convo.lastMessage}</p>
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-1 text-gray-500 hover:text-orange-500 transition-colors">
                        <Eye className="w-4 h-4" />
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
              <Archive className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <h3 className="text-lg font-semibold mb-2">{t('no_conversations_found') || 'No archived conversations'}</h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Try adjusting your search or filter criteria.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}