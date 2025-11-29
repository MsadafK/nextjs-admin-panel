'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Users, Search, BarChart3, Filter, TrendingUp, Clock, Heart, Activity, Zap, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mockEngagementData = {
  totalEngaged: 245,
  avgSessionTime: '12m 45s',
  engagementRate: '78.5%',
  dailyTrends: [
    { day: 'Mon', value: 45 },
    { day: 'Tue', value: 62 },
    { day: 'Wed', value: 58 },
    { day: 'Thu', value: 75 },
    { day: 'Fri', value: 82 },
    { day: 'Sat', value: 55 },
    { day: 'Sun', value: 48 },
  ],
};

const mockTopUsers = [
  { id: 1, name: 'Alice Johnson', avatar: 'AJ', engagementScore: 95, sessions: 12, actions: 156 },
  { id: 2, name: 'Bob Smith', avatar: 'BS', engagementScore: 88, sessions: 9, actions: 134 },
  { id: 3, name: 'Carol Davis', avatar: 'CD', engagementScore: 92, sessions: 11, actions: 142 },
  { id: 4, name: 'David Wilson', avatar: 'DW', engagementScore: 76, sessions: 7, actions: 98 },
  { id: 5, name: 'Eva Brown', avatar: 'EB', engagementScore: 89, sessions: 10, actions: 128 },
];

export default function EngagementStats() {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('week');
  const [data, setData] = useState(mockEngagementData);
  const [topUsers, setTopUsers] = useState(mockTopUsers);

  useEffect(() => {
    // Simulate data refresh
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        totalEngaged: prev.totalEngaged + Math.floor(Math.random() * 10),
        engagementRate: `${(78 + Math.random() * 5).toFixed(1)}%`,
      }));
      setTopUsers(prev => prev.map(user => ({
        ...user,
        engagementScore: user.engagementScore + Math.floor(Math.random() * 2),
      })));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const filteredTopUsers = topUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatCard = ({ icon: Icon, title, value, color, description }) => (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className={`p-6 rounded-xl shadow-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} transition-all duration-300 hover:shadow-xl`}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{title}</p>
        </div>
      </div>
      <p className={`${isDark ? 'text-gray-500' : 'text-gray-500'} text-sm`}>{description}</p>
    </motion.div>
  );

  const renderBarChart = (trends) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Weekly Engagement Trend</h3>
        <Zap className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
      </div>
      <div className="space-y-2">
        {trends.map((item, index) => (
          <motion.div
            key={item.day}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-end justify-between h-12 bg-gray-100 dark:bg-gray-700 rounded"
          >
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-l transition-all duration-700"
              style={{ width: `${item.value * 3}%`, minWidth: '20px' }}
            />
            <span className={`text-xs font-medium ml-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {item.day}
            </span>
            <span className="text-xs font-semibold mr-2">{item.value}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <BarChart3 className="w-8 h-8" />
              {t('engagement_stats') || 'Engagement Stats'}
            </h1>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Track user interactions and engagement metrics. Live data updates.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-lg bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200 text-sm font-medium`}>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {data.engagementRate} Rate
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder={t('search_users') || 'Search top users...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className={`px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Active Users"
            value={data.totalEngaged.toLocaleString()}
            color="bg-blue-500"
            description="Total engaged sessions today"
          />
          <StatCard
            icon={Clock}
            title="Avg Session"
            value={data.avgSessionTime}
            color="bg-green-500"
            description="Average time per session"
          />
          <StatCard
            icon={TrendingUp}
            title="Growth"
            value="+12.5%"
            color="bg-purple-500"
            description="Week-over-week increase"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Engagement Trend Chart */}
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {renderBarChart(data.dailyTrends)}
            </motion.div>
          </AnimatePresence>

          {/* Top Engaged Users */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`p-6 rounded-xl shadow-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                Top Engaged Users
              </h3>
            </div>
            <AnimatePresence>
              {filteredTopUsers.length > 0 ? (
                <ul className="space-y-3">
                  {filteredTopUsers.slice(0, 5).map((user, index) => (
                    <motion.li
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold`}>
                            {user.avatar}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-white">{index + 1}</span>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{user.sessions} sessions</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm font-bold text-purple-600 dark:text-purple-400">
                          <Heart className="w-4 h-4 fill-current" />
                          {user.engagementScore}
                        </div>
                        <p className={`${isDark ? 'text-gray-500' : 'text-gray-500'} text-xs`}>{user.actions} actions</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <Users className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                  <p className="text-gray-500 dark:text-gray-400">No users match your search.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}