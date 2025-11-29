'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Users, Search, Filter, Clock, MapPin, Calendar, Eye, Edit2, Trash2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mockTeamEvents = [
  { id: 1, title: 'Quarterly Team Alignment', date: 'March 15, 2024', time: '9:00 AM - 12:00 PM', location: 'Main Conference Room', team: 'Engineering', participants: 15, description: 'Align on goals and share updates across the engineering team.', organizer: 'John Doe' },
  { id: 2, title: 'Marketing Team Brainstorm', date: 'March 18, 2024', time: '2:00 PM - 4:00 PM', location: 'Creative Lounge', team: 'Marketing', participants: 8, description: 'Ideate on upcoming campaign strategies and content ideas.', organizer: 'Jane Smith' },
  { id: 3, title: 'Sales Team Training', date: 'March 20, 2024', time: '10:00 AM - 1:00 PM', location: 'Training Room B', team: 'Sales', participants: 12, description: 'Workshop on new sales techniques and product knowledge.', organizer: 'Mike Johnson' },
  { id: 4, title: 'All-Hands Company Meeting', date: 'March 22, 2024', time: '11:00 AM - 12:30 PM', location: 'Online (Zoom)', team: 'Company-Wide', participants: 50, description: 'Updates from leadership and Q&A session.', organizer: 'CEO' },
  { id: 5, title: 'Design Team Retrospective', date: 'March 25, 2024', time: '3:00 PM - 4:30 PM', location: 'Design Studio', team: 'Design', participants: 6, description: 'Review past sprint and plan improvements.', organizer: 'Sarah Lee' },
  { id: 6, title: 'HR Team Building Activity', date: 'March 28, 2024', time: '4:00 PM - 6:00 PM', location: 'Outdoor Park', team: 'HR', participants: 10, description: 'Fun activities to strengthen team bonds.', organizer: 'HR Director' },
];

const teamColors = {
  Engineering: 'bg-blue-500',
  Marketing: 'bg-purple-500',
  Sales: 'bg-green-500',
  'Company-Wide': 'bg-orange-500',
  Design: 'bg-pink-500',
  HR: 'bg-yellow-500',
};

export default function TeamEvents() {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [events, setEvents] = useState(mockTeamEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTeam, setFilterTeam] = useState('all');
  const [teamCount, setTeamCount] = useState(0);

  useEffect(() => {
    setTeamCount(events.length);
  }, [events]);

  const filteredEvents = events.filter(event => 
    (event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
     event.organizer.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterTeam === 'all' || event.team === filterTeam)
  );

  const uniqueTeams = [...new Set(events.map(e => e.team))];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Users className="w-8 h-8" />
              {t('team_events') || 'Team Events'}
            </h1>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {teamCount} team-focused events. Collaborate and connect!
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 text-sm font-medium`}>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {teamCount} Events
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
              placeholder={t('search_events') || 'Search by title, description, or organizer...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <select
              value={filterTeam}
              onChange={(e) => setFilterTeam(e.target.value)}
              className={`px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-green-500`}
            >
              <option value="all">All Teams</option>
              {uniqueTeams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Events Grid */}
        <AnimatePresence>
          {filteredEvents.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={`p-6 rounded-xl shadow-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} transition-all duration-300 hover:shadow-xl`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-full ${teamColors[event.team] || 'bg-gray-500'} flex items-center justify-center text-white`}>
                      <Users className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{event.date}</p>
                      <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs`}>{event.time}</p>
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      {event.participants} participants
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <User className="w-4 h-4" />
                      Organized by {event.organizer}
                    </div>
                  </div>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4 line-clamp-2`}>{event.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                    <span className={`px-3 py-1 text-xs rounded-full ${teamColors[event.team].replace('bg-', 'bg-opacity-20 text-').replace('500', '600')} dark:${teamColors[event.team].replace('bg-', 'bg-opacity-10 text-')}`}>
                      {event.team}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-500 hover:text-green-500 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-blue-500 transition-colors">
                        <Edit2 className="w-4 h-4" />
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
              <Users className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <h3 className="text-lg font-semibold mb-2">{t('no_events_found') || 'No team events found'}</h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Try adjusting your search or team filter.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}