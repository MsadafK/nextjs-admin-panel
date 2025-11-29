'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Archive, Search, Filter, Tags, User, Eye, Trash2, Star, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mockArchivedByTags = [
  { id: 1, participant: { name: 'Alice Johnson', avatar: 'AJ', email: 'alice@company.com' }, subject: 'Project Q4 Planning', lastMessage: 'Milestones updated.', messageCount: 12, archivedDate: '1 week ago', tags: ['Project', 'Urgent'], starred: true },
  { id: 2, participant: { name: 'Bob Smith', avatar: 'BS', email: 'bob@company.com' }, subject: 'Design Review', lastMessage: 'Feedback incorporated.', messageCount: 5, archivedDate: '2 weeks ago', tags: ['Design', 'Team'], starred: false },
  { id: 3, participant: { name: 'Carol Davis', avatar: 'CD', email: 'carol@company.com' }, subject: 'HR Policy Discussion', lastMessage: 'Policies approved.', messageCount: 8, archivedDate: '1 month ago', tags: ['HR', 'Policy'], starred: true },
  { id: 4, participant: { name: 'David Wilson', avatar: 'DW', email: 'david@company.com' }, subject: 'API Development Thread', lastMessage: 'Code merged.', messageCount: 15, archivedDate: '3 weeks ago', tags: ['Development', 'Project'], starred: false },
  { id: 5, participant: { name: 'Eva Brown', avatar: 'EB', email: 'eva@company.com' }, subject: 'Team Building Event', lastMessage: 'Event scheduled.', messageCount: 4, archivedDate: '2 months ago', tags: ['Team', 'Event'], starred: false },
  { id: 6, participant: { name: 'Frank Miller', avatar: 'FM', email: 'frank@company.com' }, subject: 'Budget Allocation', lastMessage: 'Funds allocated.', messageCount: 10, archivedDate: '1 month ago', tags: ['Finance', 'Budget'], starred: true },
  { id: 7, participant: { name: 'Grace Lee', avatar: 'GL', email: 'grace@company.com' }, subject: 'Marketing Campaign Review', lastMessage: 'Campaign successful.', messageCount: 7, archivedDate: '1.5 months ago', tags: ['Marketing', 'Review'], starred: false },
];

const groupByTags = (data) => {
  const groups = {};
  
  data.forEach(item => {
    item.tags.forEach(tag => {
      if (!groups[tag]) groups[tag] = [];
      groups[tag].push(item);
    });
  });
  
  return groups;
};

export default function ArchivedByTags() {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [conversations, setConversations] = useState(mockArchivedByTags);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [groupedConversations, setGroupedConversations] = useState({});
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    const uniqueTags = [...new Set(conversations.flatMap(c => c.tags))].sort();
    setAllTags(uniqueTags);
    
    const filtered = conversations.filter(convo => 
      (convo.participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       convo.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
       convo.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedTag === 'all' || convo.tags.includes(selectedTag))
    );
    setGroupedConversations(groupByTags(filtered));
  }, [conversations, searchTerm, selectedTag]);

  const totalArchived = conversations.length;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Tags className="w-8 h-8" />
              {t('archived_by_tags') || 'Archived by Tags'}
            </h1>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {totalArchived} conversations categorized by tags. Efficient organization and retrieval.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-lg bg-pink-100 dark:bg-pink-900/20 text-pink-800 dark:text-pink-200 text-sm font-medium`}>
              <span className="flex items-center gap-1">
                <Tags className="w-4 h-4" />
                {allTags.length} Tags
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
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-pink-500`}
            />
          </div>

          {/* Tag Filter */}
          <div className="flex items-center gap-2">
            <Filter className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className={`px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-pink-500`}
            >
              <option value="all">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
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
              {Object.entries(groupedConversations).map(([tag, items], groupIndex) => (
                <div key={tag}>
                  <motion.h2
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: groupIndex * 0.1 }}
                    className={`text-lg font-semibold mb-4 flex items-center gap-2 sticky top-0 bg-gray-900/80 dark:bg-gray-900/80 backdrop-blur-sm p-2 rounded-lg z-10 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    <Tags className="w-5 h-5" />
                    {tag}
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
                              <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm`}>
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
                            <div className="flex items-center gap-1 text-xs text-pink-500 mt-1">
                              <MessageSquare className="w-3 h-3" />
                              {convo.messageCount}
                            </div>
                          </div>
                        </div>
                        <div className="ml-13 border-l-4 border-pink-200 dark:border-pink-800 pl-4">
                          <h4 className="font-medium text-sm mb-1 line-clamp-1">{convo.subject}</h4>
                          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm line-clamp-2 mb-3`}>{convo.lastMessage}</p>
                          <div className="flex items-center justify-end space-x-2">
                            <button className="p-1 text-gray-500 hover:text-pink-500 transition-colors">
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
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Try adjusting your search or tag filter.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}