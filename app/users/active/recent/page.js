'use client';
import { motion, AnimatePresence } from 'framer-motion';

import { useState, useEffect } from 'react';


import { Users, Search, Clock, Activity, Filter, Calendar, TrendingUp, LogIn, Edit, CheckCircle, AlertCircle, Download } from 'lucide-react';


const mockRecentActivities = [
  { id: 1, user: { name: 'Alice Johnson', avatar: 'AJ' }, action: 'Logged in from New York', icon: LogIn, type: 'login', timestamp: '2 min ago', details: 'IP: 192.168.1.100' },
  { id: 2, user: { name: 'Bob Smith', avatar: 'BS' }, action: 'Updated profile picture', icon: Edit, type: 'update', timestamp: '5 min ago', details: 'Uploaded new avatar' },
  { id: 3, user: { name: 'Carol Davis', avatar: 'CD' }, action: 'Completed task assignment', icon: CheckCircle, type: 'task', timestamp: '1 min ago', details: 'Project: Dashboard Redesign' },
  { id: 4, user: { name: 'David Wilson', avatar: 'DW' }, action: 'Viewed analytics report', icon: TrendingUp, type: 'view', timestamp: '3 min ago', details: 'Monthly Sales Report' },
  { id: 5, user: { name: 'Eva Brown', avatar: 'EB' }, action: 'Received a warning', icon: AlertCircle, type: 'alert', timestamp: 'Just now', details: 'Suspicious login attempt' },
  { id: 6, user: { name: 'Frank Miller', avatar: 'FM' }, action: 'Sent message to team', icon: Activity, type: 'message', timestamp: '4 min ago', details: 'Channel: #general' },
  { id: 7, user: { name: 'Alice Johnson', avatar: 'AJ' }, action: 'Logged out', icon: LogIn, type: 'logout', timestamp: '6 min ago', details: 'Session ended' },
  { id: 8, user: { name: 'Bob Smith', avatar: 'BS' }, action: 'Exported user data', icon: Download, type: 'export', timestamp: '7 min ago', details: 'Format: CSV' },
];

const actionColors = {
  login: 'bg-muted0',
  update: 'bg-muted0',
  task: 'bg-muted0',
  view: 'bg-muted0',
  alert: 'bg-muted0',
  message: 'bg-muted0',
  logout: 'bg-muted0',
  export: 'bg-muted0',
};

export default function RecentActivity() {
    const t = () => null;
const [activities, setActivities] = useState(mockRecentActivities);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [recentCount, setRecentCount] = useState(0);

  useEffect(() => {
    // Simulate new activities
    const interval = setInterval(() => {
      const newActivity = {
        id: Date.now(),
        user: { name: mockRecentActivities[Math.floor(Math.random() * mockRecentActivities.length)].user.name, avatar: 'JD' },
        action: 'New activity logged',
        icon: Activity,
        type: 'activity',
        timestamp: 'Just now',
        details: 'Dynamic event',
      };
      setActivities(prev => [newActivity, ...prev.slice(0, 9)]); // Keep top 10
    }, 15000);

    setRecentCount(activities.length);

    return () => clearInterval(interval);
  }, [activities]);

  const filteredActivities = activities.filter(activity => 
    (activity.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     activity.action.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterType === 'all' || activity.type === filterType)
  ).slice(0, 10); // Limit to recent 10

  const getActionIcon = (icon) => {
    const Icon = icon;
    return <Icon className="w-5 h-5" />;
  };

  return (
    <div className={`min-h-screen bg-muted text-foreground`}>
      {/* Header */}
      <div className="p-6 border-b border-border dark:border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-lg sm:text-xl font-semibold tracking-tight flex items-center gap-3 text-foreground`}>
              <Activity className="w-8 h-8" />
              {t('recent_activity') || 'Recent Activity'}
            </h1>
            <p className={`text-muted-foreground`}>
              {recentCount} recent actions in the last hour. Live updates enabled.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-200 text-sm font-medium`}>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {recentCount} Recent
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
              placeholder={t('search_activity') || 'Search by user or action...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-card border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className={`w-5 h-5 text-muted-foreground`} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={`px-4 py-3 rounded-lg border bg-card border-border text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              <option value="all">All Types</option>
              <option value="login">Logins</option>
              <option value="update">Updates</option>
              <option value="task">Tasks</option>
              <option value="view">Views</option>
              <option value="alert">Alerts</option>
              <option value="message">Messages</option>
            </select>
          </div>
        </div>

        {/* Activity Timeline */}
        <AnimatePresence>
          {filteredActivities.length > 0 ? (
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {filteredActivities.map((activity, index) => (
                <motion.li
                  key={activity.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`relative p-4 rounded-xl shadow-card bg-card border border-border transition-all duration-300 hover:shadow-card`}
                >
                  {/* Timeline Connector */}
                  {index < filteredActivities.length - 1 && (
                    <div className={`absolute left-6 top-12 w-0.5 h-12 bg-muted`}></div>
                  )}
                  
                  {/* Activity Dot */}
                  <div className={`absolute left-6 top-6 w-3 h-3 rounded-full ${actionColors[activity.type] || 'bg-muted0'} ring-4 ring-white dark:ring-gray-900 z-10`}></div>
                  
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full ${actionColors[activity.type] || 'bg-muted0'} flex-shrink-0`}>
                      {getActionIcon(activity.icon)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-background font-semibold text-xs flex-shrink-0`}>
                            {activity.user.avatar}
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm">{activity.user.name}</h4>
                            <p className="text-xs text-indigo-600 dark:text-indigo-400 capitalize">{activity.action}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-medium text-muted-foreground`}>
                          {activity.timestamp}
                        </span>
                      </div>
                      <p className={`text-muted-foreground text-sm ml-11`}>
                        {activity.details}
                      </p>
                    </div>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-12 text-center rounded-xl bg-card border border-dashed border-border`}
            >
              <Activity className={`w-16 h-16 mx-auto mb-4 text-muted-foreground`} />
              <h3 className="text-lg font-semibold mb-2">{t('no_activity_found') || 'No recent activity'}</h3>
              <p className={`text-muted-foreground`}>Check back soon or adjust your filters.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}