'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Calendar, Search, Filter, Clock, MapPin, Users, ChevronLeft, ChevronRight, Eye, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const mockMySchedule = [
  { id: 1, day: 'Monday', date: '2024-03-04', events: [
    { time: '09:00 AM', title: 'Morning Standup', duration: '30 min', location: 'Online', participants: 5 },
    { time: '10:00 AM', title: 'Code Review', duration: '1 hour', location: 'Office', participants: 3 },
  ]},
  { id: 2, day: 'Tuesday', date: '2024-03-05', events: [
    { time: '11:00 AM', title: 'Client Meeting', duration: '45 min', location: 'Zoom', participants: 2 },
  ]},
  { id: 3, day: 'Wednesday', date: '2024-03-06', events: [
    { time: '02:00 PM', title: 'Team Workshop', duration: '2 hours', location: 'Conference Room', participants: 8 },
    { time: '04:00 PM', title: 'Personal Review', duration: '30 min', location: 'Private', participants: 1 },
  ]},
  { id: 4, day: 'Thursday', date: '2024-03-07', events: []},
  { id: 5, day: 'Friday', date: '2024-03-08', events: [
    { time: '09:30 AM', title: 'Project Planning', duration: '1.5 hours', location: 'Office', participants: 4 },
  ]},
  { id: 6, day: 'Saturday', date: '2024-03-09', events: []},
  { id: 7, day: 'Sunday', date: '2024-03-10', events: []},
];

export default function MySchedule() {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [schedule, setSchedule] = useState(mockMySchedule);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('week');
  const [currentWeek, setCurrentWeek] = useState(0);

  const filteredSchedule = schedule.filter(day => 
    day.events.some(event => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) || day.day.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrevWeek = () => setCurrentWeek(prev => prev - 1);
  const handleNextWeek = () => setCurrentWeek(prev => prev + 1);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Calendar className="w-8 h-8" />
              {t('my_schedule') || 'My Schedule'}
            </h1>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              View and manage your personal calendar. Stay on top of your day!
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-lg bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200 text-sm font-medium`}>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {schedule.reduce((acc, day) => acc + day.events.length, 0)} Events
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
              placeholder={t('search_schedule') || 'Search events or days...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>

          {/* View Mode */}
          <div className="flex items-center gap-2">
            <Filter className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className={`px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
            >
              <option value="day">Day View</option>
              <option value="week">Week View</option>
              <option value="month">Month View</option>
            </select>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={handlePrevWeek} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-semibold">Week of March 4, 2024</h2> {/* Dynamic date logic can be added */}
          <button onClick={handleNextWeek} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Schedule Timeline */}
        <AnimatePresence>
          {filteredSchedule.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {filteredSchedule.map((day, dayIndex) => (
                <div key={day.id}>
                  <motion.h3
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: dayIndex * 0.1 }}
                    className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    {day.day} - {day.date}
                    <span className="text-sm text-gray-500">({day.events.length} events)</span>
                  </motion.h3>
                  {day.events.length > 0 ? (
                    <div className="space-y-4">
                      {day.events.map((event, eventIndex) => (
                        <motion.div
                          key={`${day.id}-${eventIndex}`}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: (dayIndex * 0.2) + (eventIndex * 0.05) }}
                          className={`p-4 rounded-xl shadow-md ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} transition-all duration-300 hover:shadow-lg`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Clock className="w-5 h-5 text-purple-500" />
                              <span className="font-medium">{event.time}</span>
                              <span className="text-sm text-gray-500">({event.duration})</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="p-1 text-gray-500 hover:text-purple-500 transition-colors">
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
                          <h4 className="font-semibold mb-2">{event.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Users className="w-4 h-4" />
                            {event.participants} participants
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'} text-center text-gray-500 dark:text-gray-400`}>
                      No events scheduled for this day.
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-12 text-center rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} border border-dashed ${isDark ? 'border-gray-700' : 'border-gray-300'}`}
            >
              <Calendar className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <h3 className="text-lg font-semibold mb-2">{t('no_schedule_found') || 'No schedule items found'}</h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Try adjusting your search.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}