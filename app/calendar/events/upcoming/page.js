'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Calendar, Search, Filter, Clock, MapPin, Users, Eye, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mockUpcomingEvents = [
  { id: 1, title: 'Team Strategy Meeting', date: 'Tomorrow', time: '10:00 AM - 11:30 AM', location: 'Conference Room A', participants: 8, description: 'Discuss Q2 goals and roadblocks.', category: 'Meeting' },
  { id: 2, title: 'Product Launch Webinar', date: 'In 2 days', time: '2:00 PM - 3:00 PM', location: 'Online (Zoom)', participants: 45, description: 'Present new features to clients.', category: 'Webinar' },
  { id: 3, title: 'Company Happy Hour', date: 'Friday', time: '5:00 PM - 7:00 PM', location: 'Rooftop Bar', participants: 20, description: 'Casual team networking event.', category: 'Social' },
  { id: 4, title: 'Developer Workshop', date: 'Next Week', time: '9:00 AM - 12:00 PM', location: 'Training Room', participants: 15, description: 'Hands-on session on new tech stack.', category: 'Training' },
  { id: 5, title: 'Client Review Call', date: 'In 5 days', time: '11:00 AM - 12:00 PM', location: 'Online (Teams)', participants: 4, description: 'Quarterly performance review.', category: 'Meeting' },
  { id: 6, title: 'Marketing Brainstorm', date: 'Next Monday', time: '1:00 PM - 3:00 PM', location: 'Creative Space', participants: 6, description: 'Ideate on summer campaign.', category: 'Brainstorm' },
];

const categoryColors = {
  Meeting: 'bg-blue-500',
  Webinar: 'bg-purple-500',
  Social: 'bg-pink-500',
  Training: 'bg-green-500',
  Brainstorm: 'bg-orange-500',
};

export default function UpcomingEvents() {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [events, setEvents] = useState(mockUpcomingEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [upcomingCount, setUpcomingCount] = useState(0);

  useEffect(() => {
    // Simulate adding new events
    const interval = setInterval(() => {
      const newEvent = {
        id: Date.now(),
        title: 'New Event',
        date: 'In 3 days',
        time: '3:00 PM - 4:00 PM',
        location: 'Virtual',
        participants: Math.floor(Math.random() * 10) + 1,
        description: 'Dynamic new event added.',
        category: 'Meeting',
      };
      setEvents(prev => [newEvent, ...prev.slice(0, 9)]); // Keep top 10
    }, 30000);

    setUpcomingCount(events.length);

    return () => clearInterval(interval);
  }, [events]);

  const filteredEvents = events.filter(event => 
    (event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     event.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterCategory === 'all' || event.category === filterCategory)
  );

  const uniqueCategories = [...new Set(events.map(e => e.category))];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Calendar className="w-8 h-8" />
              {t('upcoming_events') || 'Upcoming Events'}
            </h1>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {upcomingCount} events on the horizon. Stay organized!
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-sm font-medium`}>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {upcomingCount} Upcoming
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
              placeholder={t('search_events') || 'Search by title or description...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Events List */}
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
                    <div className={`w-12 h-12 rounded-full ${categoryColors[event.category] || 'bg-gray-500'} flex items-center justify-center text-white`}>
                      <Calendar className="w-6 h-6" />
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
                  </div>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4 line-clamp-2`}>{event.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                    <span className={`px-3 py-1 text-xs rounded-full ${categoryColors[event.category].replace('bg-', 'bg-opacity-20 text-').replace('500', '600')} dark:${categoryColors[event.category].replace('bg-', 'bg-opacity-10 text-')}`}>
                      {event.category}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-500 hover:text-blue-500 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-green-500 transition-colors">
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
              <Calendar className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <h3 className="text-lg font-semibold mb-2">{t('no_events_found') || 'No upcoming events'}</h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Try adjusting your search or filter criteria.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}