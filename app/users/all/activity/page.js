'use client';

import React, { useState } from 'react';
import { 
  Activity, 
  TrendingUp, 
  Clock, 
  Calendar,
  Filter,
  Download,
  Search,
  User,
  Mail,
  FileText,
  LogIn,
  LogOut,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  Settings,
  ChevronDown,
  BarChart3,
  Users,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

export default function UserActivityPage() {
  const { isDark } = useTheme();
  const [timeFilter, setTimeFilter] = useState('today');
  const [activityType, setActivityType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data for activities
  const activities = [
    {
      id: 1,
      user: 'John Doe',
      email: 'john@example.com',
      action: 'Logged In',
      type: 'login',
      timestamp: '2 minutes ago',
      icon: LogIn,
      color: 'text-green-500',
      bg: 'bg-green-50',
      details: 'IP: 192.168.1.1'
    },
    {
      id: 2,
      user: 'Sarah Smith',
      email: 'sarah@example.com',
      action: 'Updated Profile',
      type: 'edit',
      timestamp: '15 minutes ago',
      icon: Edit,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      details: 'Changed profile picture and bio'
    },
    {
      id: 3,
      user: 'Mike Johnson',
      email: 'mike@example.com',
      action: 'Created Document',
      type: 'create',
      timestamp: '1 hour ago',
      icon: FileText,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
      details: 'Q4 Sales Report.pdf'
    },
    {
      id: 4,
      user: 'Emily Davis',
      email: 'emily@example.com',
      action: 'Sent Message',
      type: 'message',
      timestamp: '2 hours ago',
      icon: MessageSquare,
      color: 'text-indigo-500',
      bg: 'bg-indigo-50',
      details: 'To: Team Channel'
    },
    {
      id: 5,
      user: 'David Wilson',
      email: 'david@example.com',
      action: 'Deleted Item',
      type: 'delete',
      timestamp: '3 hours ago',
      icon: Trash2,
      color: 'text-red-500',
      bg: 'bg-red-50',
      details: 'Old project files'
    },
    {
      id: 6,
      user: 'Lisa Anderson',
      email: 'lisa@example.com',
      action: 'Viewed Dashboard',
      type: 'view',
      timestamp: '4 hours ago',
      icon: Eye,
      color: 'text-gray-500',
      bg: 'bg-gray-50',
      details: 'Analytics section'
    },
    {
      id: 7,
      user: 'Tom Brown',
      email: 'tom@example.com',
      action: 'Changed Settings',
      type: 'settings',
      timestamp: '5 hours ago',
      icon: Settings,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
      details: 'Updated notification preferences'
    },
    {
      id: 8,
      user: 'Anna Martinez',
      email: 'anna@example.com',
      action: 'Logged Out',
      type: 'logout',
      timestamp: '6 hours ago',
      icon: LogOut,
      color: 'text-gray-400',
      bg: 'bg-gray-50',
      details: 'Session ended'
    }
  ];

  // Stats data
  const stats = [
    {
      label: 'Total Activities',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: Activity,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      label: 'Active Users',
      value: '234',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      label: 'Avg. Session Time',
      value: '24m',
      change: '-2.4%',
      trend: 'down',
      icon: Clock,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      label: 'Actions Today',
      value: '486',
      change: '0%',
      trend: 'neutral',
      icon: TrendingUp,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    }
  ];

  // Activity type breakdown
  const activityBreakdown = [
    { type: 'Logins', count: 156, percentage: 32, color: 'bg-green-500' },
    { type: 'Edits', count: 98, percentage: 20, color: 'bg-blue-500' },
    { type: 'Views', count: 203, percentage: 42, color: 'bg-gray-500' },
    { type: 'Messages', count: 29, percentage: 6, color: 'bg-indigo-500' }
  ];

  return (
    <div className={`p-6 min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>User Activity</h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Monitor and analyze user actions in real-time</p>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download size={20} />
            <span>Export Report</span>
          </button>
        </div>

        {/* Breadcrumb */}
        <div className={`flex items-center space-x-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <span>Users</span>
          <ChevronDown size={16} className="rotate-[-90deg]" />
          <span>All Users</span>
          <ChevronDown size={16} className="rotate-[-90deg]" />
          <span className="text-blue-600 font-medium">User Activity</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <div className={`flex items-center space-x-1 text-sm font-medium ${
                stat.trend === 'up' ? 'text-green-600' : 
                stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {stat.trend === 'up' && <ArrowUp size={16} />}
                {stat.trend === 'down' && <ArrowDown size={16} />}
                {stat.trend === 'neutral' && <Minus size={16} />}
                <span>{stat.change}</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Activity Breakdown Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Activity Breakdown</h2>
          <BarChart3 className="text-gray-400" size={20} />
        </div>
        <div className="space-y-4">
          {activityBreakdown.map((item, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{item.type}</span>
                <span className="text-sm text-gray-600">{item.count} ({item.percentage}%)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className={`${item.color} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 lg:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users or activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter size={20} />
              <span>Filters</span>
            </button>

            {/* Time Filter */}
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>

            {/* Activity Type Filter */}
            <select
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Activities</option>
              <option value="login">Logins</option>
              <option value="edit">Edits</option>
              <option value="create">Creates</option>
              <option value="delete">Deletes</option>
              <option value="view">Views</option>
            </select>
          </div>
        </div>

        {/* Extended Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User Role</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Roles</option>
                  <option>Admin</option>
                  <option>User</option>
                  <option>Guest</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">IP Address</label>
                <input
                  type="text"
                  placeholder="Filter by IP"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Recent Activity Timeline</h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className={`${activity.bg} p-3 rounded-lg flex-shrink-0`}>
                    <Icon className={activity.color} size={20} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">{activity.action}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                              <User size={14} className="text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{activity.user}</span>
                          </div>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-500">{activity.email}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock size={14} />
                        <span>{activity.timestamp}</span>
                      </div>
                    </div>
                    
                    {/* Details */}
                    <div className="bg-gray-50 rounded-lg p-3 mt-3">
                      <p className="text-sm text-gray-600">{activity.details}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More Button */}
        <div className="p-6 border-t border-gray-200 text-center">
          <button className="px-6 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium">
            Load More Activities
          </button>
        </div>
      </div>
    </div>
  );
}