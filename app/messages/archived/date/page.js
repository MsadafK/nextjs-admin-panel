'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Archive, Search, Filter, Calendar, User, Eye, Trash2, Star, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mockArchivedByDate = [
  { id: 1, participant: { name: 'Alice Johnson', avatar: 'AJ', email: 'alice@company.com' }, subject: 'Project Collaboration', lastMessage: 'Final updates shared.', messageCount: 5, archivedDate: '2024-02-15', starred: true },
  { id: 2, participant: { name: 'Bob Smith', avatar: 'BS', email: 'bob@company.com' }, subject: 'Design Feedback', lastMessage: 'Approved the changes.', messageCount: 3, archivedDate: '2024-02-14', starred: false },
  { id: 3, participant: { name: 'Carol Davis', avatar: 'CD', email: 'carol@company.com' }, subject: 'Team Meeting Notes', lastMessage: 'Action items completed.', messageCount: 7, archivedDate: '2024-02-10', starred: true },
  { id: 4, participant: { name: 'David Wilson', avatar: 'DW', email: 'david@company.com' }, subject: 'API Queries', lastMessage: 'Issues resolved.', messageCount: 4, archivedDate: '2024-02-08', starred: false },
  { id: 5, participant: { name: 'Eva Brown', avatar: 'EB', email: 'eva@company.com' }, subject: 'HR Updates', lastMessage: 'Policies acknowledged.', messageCount: 2, archivedDate: '2024-01-25', starred: false },
  { id: 6, participant: { name: 'Frank Miller', avatar: 'FM', email: 'frank@company.com' }, subject: 'Budget Planning', lastMessage: 'Budget finalized.', messageCount: 6, archivedDate: '2024-01-15', starred: true },
  { id: 7, participant: { name: 'Grace Lee', avatar: 'GL', email: 'grace@company.com' }, subject: 'Marketing Strategy', lastMessage: 'Campaign launched.', messageCount: 9, archivedDate: '2023-12-20', starred: false },
];

const groupByDate = (data) => {
  const groups = {};
  const today = new Date();
  
  data.forEach(item => {
    const date = new Date(item.archivedDate);
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let groupKey;
    if (diffDays <= 1) groupKey = 'Today';
    else if (diffDays <= 7) groupKey = 'This Week';
    else if (diffDays <= 30) groupKey = 'This Month';
    else if (diffDays <= 90) groupKey = 'Last Quarter';
    else groupKey = 'Older';
    
    if (!groups[groupKey]) groups[groupKey] = [];
    groups[groupKey].push(item);
  });
  
  return groups;
};

export default function ArchivedByDate() {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [conversations, setConversations] = useState(mockArchivedByDate);
  const [searchTerm, setSearchTerm] = useState('');
  const [groupedConversations, setGroupedConversations] = useState({});

  useEffect(() => {
    const filtered = conversations.filter(convo => 
      convo.participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      convo.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      convo.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setGroupedConversations(groupByDate(filtered));
  }, [conversations, searchTerm]);

  const totalArchived = conversations.length;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Calendar className="w-8 h-8" />
              {t('archived_by_date') || 'Archived by Date'}
            </h1>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {totalArchived} conversations organized by archive date. Easy timeline navigation.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-lg bg-teal-100 dark:bg-teal-900/20 text-teal-800 dark:text-teal-200 text-sm font-medium`}>
              <span className="flex items-center gap-1">
                <Archive className="w-4 h-4" />
                {totalArchived} Total
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
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-teal-500`}
            />
          </div>
        </div>

        {/* Grouped Conversations */}
        <AnimatePresence>
          {Object.keys(groupedConversations).length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {Object.entries(groupedConversations).map(([group, items], groupIndex) => (
                <div key={group}>
                  <motion.h2
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: groupIndex * 0.1 }}
                    className={`text-lg font-semibold mb-4 flex items-center gap-2 sticky top-0 bg-gray-900/80 dark:bg-gray-900/80 backdrop-blur-sm p-2 rounded-lg z-10 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    <Calendar className="w-5 h-5" />
                    {group}
                    <span className="text-sm text-gray-500">({items.length})</span>
                  </motion.h2>
                  <div className="space-y-4">
                    {items.map((convo, index) => (
                      <motion.div
                        key={convo.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: (groupIndex * 0.2) + (index * 0.05) }}
                        whileHover={{ scale: 1.01 }}
                        className={`p-4 rounded-xl shadow-md ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} transition-all duration-300 hover:shadow-lg`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="relative">
                              <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-semibold text-sm`}>
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
                            <div className="flex items-center gap-1 text-xs text-teal-500 mt-1">
                              <MessageSquare className="w-3 h-3" />
                              {convo.messageCount}
                            </div>
                          </div>
                        </div>
                        <div className="ml-13 border-l-4 border-teal-200 dark:border-teal-800 pl-4">
                          <h4 className="font-medium text-sm mb-1 line-clamp-1">{convo.subject}</h4>
                          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm line-clamp-2 mb-3`}>{convo.lastMessage}</p>
                          <div className="flex items-center justify-end space-x-2">
                            <button className="p-1 text-gray-500 hover:text-teal-500 transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-500 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
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
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Try adjusting your search criteria.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}