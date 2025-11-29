'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Users, Search, Clock, Circle, Wifi, WifiOff, Activity, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mockOnlineUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@company.com', role: 'Developer', avatar: 'AJ', lastActivity: '2 min ago', status: 'online', ip: '192.168.1.100' },
  { id: 2, name: 'Bob Smith', email: 'bob@company.com', role: 'Designer', avatar: 'BS', lastActivity: '5 min ago', status: 'active', ip: '192.168.1.101' },
  { id: 3, name: 'Carol Davis', email: 'carol@company.com', role: 'Manager', avatar: 'CD', lastActivity: '1 min ago', status: 'online', ip: '192.168.1.102' },
  { id: 4, name: 'David Wilson', email: 'david@company.com', role: 'Tester', avatar: 'DW', lastActivity: '3 min ago', status: 'away', ip: '192.168.1.103' },
  { id: 5, name: 'Eva Brown', email: 'eva@company.com', role: 'Analyst', avatar: 'EB', lastActivity: 'Just now', status: 'online', ip: '192.168.1.104' },
  { id: 6, name: 'Frank Miller', email: 'frank@company.com', role: 'Admin', avatar: 'FM', lastActivity: '4 min ago', status: 'active', ip: '192.168.1.105' },
];

const statusColors = {
  online: 'bg-green-500',
  active: 'bg-blue-500',
  away: 'bg-yellow-500',
  offline: 'bg-gray-400',
};

export default function OnlineNow() {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [users, setUsers] = useState(mockOnlineUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setUsers(prev => prev.map(user => ({
        ...user,
        lastActivity: Math.random() > 0.5 ? 'Just now' : `${Math.floor(Math.random() * 5) + 1} min ago`,
        status: Math.random() > 0.7 ? 'away' : Math.random() > 0.3 ? 'active' : 'online'
      })));
    }, 10000);

    setOnlineCount(users.filter(u => u.status === 'online').length);

    return () => clearInterval(interval);
  }, [users]);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === 'all' || user.status === filterStatus)
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return <Wifi className="w-3 h-3 text-green-500" />;
      case 'active': return <Activity className="w-3 h-3 text-blue-500" />;
      case 'away': return <WifiOff className="w-3 h-3 text-yellow-500" />;
      default: return <Circle className="w-3 h-3 text-gray-400" />;
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Users className="w-8 h-8" />
              {t('online_now') || 'Online Now'}
            </h1>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {onlineCount} users are currently active. Real-time monitoring enabled.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 text-sm font-medium`}>
              <span className="flex items-center gap-1">
                <Circle className="w-4 h-4" />
                {onlineCount} Online
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
              placeholder={t('search_users') || 'Search users...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="all">All Status</option>
              <option value="online">Online</option>
              <option value="active">Active</option>
              <option value="away">Away</option>
            </select>
          </div>
        </div>

        {/* Users Grid */}
        <AnimatePresence>
          {filteredUsers.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: user.id * 0.05 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={`p-6 rounded-xl shadow-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} transition-all duration-300 hover:shadow-xl`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg`}>
                          {user.avatar}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 p-1 rounded-full ${statusColors[user.status]} border-2 border-white dark:border-gray-800`}>
                          {getStatusIcon(user.status)}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{user.role}</p>
                      </div>
                    </div>
                    <div className="text-xs text-right">
                      <p className={`${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{user.lastActivity}</p>
                      <p className={`${isDark ? 'text-gray-400' : 'text-gray-400'}`}>IP: {user.ip}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                    <button className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors">
                      Message
                    </button>
                    <button className="px-3 py-1 text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full hover:bg-green-200 dark:hover:bg-green-900 transition-colors">
                      Ping
                    </button>
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
              <h3 className="text-lg font-semibold mb-2">{t('no_users_found') || 'No users found'}</h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Try adjusting your search or filter criteria.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}