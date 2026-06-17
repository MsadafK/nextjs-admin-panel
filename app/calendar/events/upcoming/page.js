'use client';
import { motion, AnimatePresence } from 'framer-motion';

import { useState, useEffect } from 'react';


import { Calendar, Search, Filter, Clock, MapPin, Users, Eye, Edit2, Trash2 } from 'lucide-react';


const mockUpcomingEvents = [
  { id: 1, title: 'Team Strategy Meeting', date: 'Tomorrow', time: '10:00 AM - 11:30 AM', location: 'Conference Room A', participants: 8, description: 'Discuss Q2 goals and roadblocks.', category: 'Meeting' },
  { id: 2, title: 'Product Launch Webinar', date: 'In 2 days', time: '2:00 PM - 3:00 PM', location: 'Online (Zoom)', participants: 45, description: 'Present new features to clients.', category: 'Webinar' },
  { id: 3, title: 'Company Happy Hour', date: 'Friday', time: '5:00 PM - 7:00 PM', location: 'Rooftop Bar', participants: 20, description: 'Casual team networking event.', category: 'Social' },
  { id: 4, title: 'Developer Workshop', date: 'Next Week', time: '9:00 AM - 12:00 PM', location: 'Training Room', participants: 15, description: 'Hands-on session on new tech stack.', category: 'Training' },
  { id: 5, title: 'Client Review Call', date: 'In 5 days', time: '11:00 AM - 12:00 PM', location: 'Online (Teams)', participants: 4, description: 'Quarterly performance review.', category: 'Meeting' },
  { id: 6, title: 'Marketing Brainstorm', date: 'Next Monday', time: '1:00 PM - 3:00 PM', location: 'Creative Space', participants: 6, description: 'Ideate on summer campaign.', category: 'Brainstorm' },
];

const categoryColors = {
  Meeting: 'bg-muted0',
  Webinar: 'bg-muted0',
  Social: 'bg-muted0',
  Training: 'bg-muted0',
  Brainstorm: 'bg-muted0',
};

export default function UpcomingEvents() {
    const t = () => null;
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
    <div className={`min-h-screen bg-muted text-foreground`}>
      {/* Header */}
      <div className="p-6 border-b border-border dark:border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-lg sm:text-xl font-semibold tracking-tight flex items-center gap-3 text-foreground`}>
              <Calendar className="w-8 h-8" />
              {t('upcoming_events') || 'Upcoming Events'}
            </h1>
            <p className={`text-muted-foreground`}>
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
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground`} />
            <input
              type="text"
              placeholder={t('search_events') || 'Search by title or description...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-card border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:outline-none focus:ring-1 focus:ring-ring`}
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className={`w-5 h-5 text-muted-foreground`} />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`px-4 py-3 rounded-lg border bg-card border-border text-foreground focus:outline-none focus:outline-none focus:ring-1 focus:ring-ring`}
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
                  className={`p-6 rounded-xl shadow-card bg-card border border-border transition-all duration-300 hover:shadow-dropdown`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-full ${categoryColors[event.category] || 'bg-muted0'} flex items-center justify-center text-background`}>
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold text-foreground`}>{event.date}</p>
                      <p className={`text-muted-foreground text-xs`}>{event.time}</p>
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {event.participants} participants
                    </div>
                  </div>
                  <p className={`text-muted-foreground text-sm mb-4 line-clamp-2`}>{event.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-border dark:border-border">
                    <span className={`px-3 py-1 text-xs rounded-full ${categoryColors[event.category].replace('bg-', 'bg-opacity-20 text-').replace('500', '600')} dark:${categoryColors[event.category].replace('bg-', 'bg-opacity-10 text-')}`}>
                      {event.category}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-muted-foreground hover:text-blue-500 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-muted-foreground hover:text-green-500 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-muted-foreground hover:text-red-500 transition-colors">
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
              className={`p-12 text-center rounded-xl bg-card border border-dashed border-border`}
            >
              <Calendar className={`w-16 h-16 mx-auto mb-4 text-muted-foreground`} />
              <h3 className="text-lg font-semibold mb-2">{t('no_events_found') || 'No upcoming events'}</h3>
              <p className={`text-muted-foreground`}>Try adjusting your search or filter criteria.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}