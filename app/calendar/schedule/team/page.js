'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Users, Search, Filter, Clock, MapPin, Calendar, Eye, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mockTeamSchedule = [
  {
    member: { name: 'John Doe', avatar: 'JD', role: 'Developer' },
    schedule: [
      { day: 'Monday', events: [{ time: '09:00 AM', title: 'Standup', duration: '30 min', location: 'Online' }] },
      { day: 'Tuesday', events: [{ time: '10:00 AM', title: 'Code Review', duration: '1 hour', location: 'Office' }] },
      { day: 'Wednesday', events: [] },
      { day: 'Thursday', events: [{ time: '02:00 PM', title: 'Workshop', duration: '2 hours', location: 'Conference' }] },
      { day: 'Friday', events: [] },
      { day: 'Saturday', events: [] },
      { day: 'Sunday', events: [] },
    ]
  },
  {
    member: { name: 'Jane Smith', avatar: 'JS', role: 'Designer' },
    schedule: [
      { day: 'Monday', events: [] },
      { day: 'Tuesday', events: [{ time: '11:00 AM', title: 'Design Meeting', duration: '45 min', location: 'Zoom' }] },
      { day: 'Wednesday', events: [{ time: '03:00 PM', title: 'UI Review', duration: '1 hour', location: 'Office' }] },
      { day: 'Thursday', events: [] },
      { day: 'Friday', events: [{ time: '09:00 AM', title: 'Creative Session', duration: '2 hours', location: 'Studio' }] },
      { day: 'Saturday', events: [] },
      { day: 'Sunday', events: [] },
    ]
  },
  {
    member: { name: 'Mike Johnson', avatar: 'MJ', role: 'Manager' },
    schedule: [
      { day: 'Monday', events: [{ time: '08:00 AM', title: 'Planning Call', duration: '1 hour', location: 'Phone' }] },
      { day: 'Tuesday', events: [] },
      { day: 'Wednesday', events: [{ time: '01:00 PM', title: 'Team Sync', duration: '30 min', location: 'Online' }] },
      { day: 'Thursday', events: [{ time: '04:00 PM', title: 'Performance Review', duration: '45 min', location: 'Office' }] },
      { day: 'Friday', events: [] },
      { day: 'Saturday', events: [] },
      { day: 'Sunday', events: [] },
    ]
  },
  // Add more team members as needed
];

export default function TeamSchedule() {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [schedule, setSchedule] = useState(mockTeamSchedule);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [currentWeek, setCurrentWeek] = useState(0);

  const filteredSchedule = schedule.filter(member => 
    (member.member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     member.schedule.some(day => day.events.some(event => event.title.toLowerCase().includes(searchTerm.toLowerCase())))) &&
    (filterRole === 'all' || member.member.role === filterRole)
  );

  const uniqueRoles = [...new Set(schedule.map(m => m.member.role))];

  const handlePrevWeek = () => setCurrentWeek(prev => prev - 1);
  const handleNextWeek = () => setCurrentWeek(prev => prev + 1);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Users className="w-8 h-8" />
              {t('team_schedule') || 'Team Schedule'}
            </h1>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Overview of your team's calendar. Coordinate effectively!
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-200 text-sm font-medium`}>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {schedule.length} Members
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
              placeholder={t('search_team') || 'Search by member or event...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className={`px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              <option value="all">All Roles</option>
              {uniqueRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={handlePrevWeek} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-semibold">Week of March 4, 2024</h2>
          <button onClick={handleNextWeek} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Team Schedule List */}
        <AnimatePresence>
          {filteredSchedule.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {filteredSchedule.map((member, memberIndex) => (
                <div key={member.member.name}>
                  <motion.h3
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: memberIndex * 0.1 }}
                    className={`text-lg font-semibold mb-4 flex items-center gap-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    <div className={`w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold`}>
                      {member.member.avatar}
                    </div>
                    {member.member.name}
                    <span className="text-sm text-gray-500">({member.member.role})</span>
                  </motion.h3>
                  <div className="space-y-4">
                    {member.schedule.map((day, dayIndex) => (
                      day.events.length > 0 && (
                        <motion.div
                          key={day.day}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: (memberIndex * 0.3) + (dayIndex * 0.05) }}
                          className={`p-4 rounded-xl ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}
                        >
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-indigo-500" />
                            {day.day}
                          </h4>
                          {day.events.map((event, eventIndex) => (
                            <div key={eventIndex} className="mb-3 last:mb-0 flex items-start justify-between">
                              <div>
                                <p className="font-semibold">{event.title}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {event.time} ({event.duration})
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {event.location}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button className="p-1 text-gray-500 hover:text-indigo-500 transition-colors">
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
                          ))}
                        </motion.div>
                      )
                    ))}
                    {member.schedule.every(day => day.events.length === 0) && (
                      <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'} text-center text-gray-500 dark:text-gray-400`}>
                        No events scheduled this week.
                      </div>
                    )}
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
              <Users className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <h3 className="text-lg font-semibold mb-2">{t('no_schedule_found') || 'No team schedule found'}</h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Try adjusting your search or filter.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}