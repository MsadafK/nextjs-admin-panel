'use client';
import { useState } from 'react';
import { Zap, AlertCircle, Clock, Flag, Star, CheckCircle, XCircle, MessageSquare, User, Mail, Phone, Calendar, Tag, MoreVertical, Reply, Forward, Archive, Trash2, Eye, EyeOff, Filter, Search, ArrowUpRight, Users, Briefcase } from 'lucide-react';

export default function PriorityMessagesPage() {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const priorityFilters = [
    { value: 'all', label: 'All Priority', count: 28, color: 'blue' },
    { value: 'urgent', label: 'Urgent', count: 8, color: 'red' },
    { value: 'high', label: 'High Priority', count: 12, color: 'orange' },
    { value: 'medium', label: 'Medium', count: 8, color: 'yellow' },
  ];

  const quickStats = [
    { 
      label: 'Urgent Messages', 
      value: '8', 
      subtext: 'Needs immediate action',
      icon: Zap, 
      color: 'from-red-500 to-pink-600', 
      bgColor: 'bg-red-50', 
      textColor: 'text-red-600' 
    },
    { 
      label: 'High Priority', 
      value: '12', 
      subtext: 'Important items',
      icon: Flag, 
      color: 'from-orange-500 to-amber-600', 
      bgColor: 'bg-orange-50', 
      textColor: 'text-orange-600' 
    },
    { 
      label: 'Pending Response', 
      value: '15', 
      subtext: 'Awaiting your reply',
      icon: MessageSquare, 
      color: 'from-blue-500 to-indigo-600', 
      bgColor: 'bg-blue-50', 
      textColor: 'text-blue-600' 
    },
    { 
      label: 'Overdue', 
      value: '3', 
      subtext: 'Past deadline',
      icon: Clock, 
      color: 'from-purple-500 to-pink-600', 
      bgColor: 'bg-purple-50', 
      textColor: 'text-purple-600' 
    },
  ];

  const messages = [
    {
      id: 1,
      priority: 'urgent',
      subject: 'URGENT: Production Server Down',
      sender: 'Amit Kumar',
      senderRole: 'DevOps Lead',
      senderAvatar: '👨‍💻',
      preview: 'Production server is experiencing critical issues. Multiple services are affected. Need immediate attention from the team...',
      timestamp: '5 minutes ago',
      tags: ['Critical', 'Infrastructure', 'Bug'],
      isRead: false,
      isStarred: true,
      hasAttachment: false,
      responses: 0,
      deadline: 'ASAP',
      status: 'pending'
    },
    {
      id: 2,
      priority: 'urgent',
      subject: 'Client Meeting Tomorrow - Budget Approval Needed',
      sender: 'Priya Sharma',
      senderRole: 'Sales Manager',
      senderAvatar: '👩‍💼',
      preview: 'Hi team, we have a crucial client meeting scheduled for tomorrow at 10 AM. Need urgent budget approval for the proposal...',
      timestamp: '15 minutes ago',
      tags: ['Sales', 'Client', 'Approval'],
      isRead: false,
      isStarred: false,
      hasAttachment: true,
      responses: 2,
      deadline: 'Today 5 PM',
      status: 'pending'
    },
    {
      id: 3,
      priority: 'high',
      subject: 'Q4 Revenue Report - Review Required',
      sender: 'Rajesh Gupta',
      senderRole: 'Finance Director',
      senderAvatar: '👨‍💼',
      preview: 'Please review the Q4 revenue report attached. We need your feedback before presenting to the board on Friday...',
      timestamp: '1 hour ago',
      tags: ['Finance', 'Report', 'Review'],
      isRead: true,
      isStarred: true,
      hasAttachment: true,
      responses: 5,
      deadline: 'Tomorrow 3 PM',
      status: 'in-progress'
    },
    {
      id: 4,
      priority: 'urgent',
      subject: 'Security Breach Alert - Action Required',
      sender: 'Security Team',
      senderRole: 'IT Security',
      senderAvatar: '🛡️',
      preview: 'We detected unusual activity on your account. Please verify recent login attempts and update your credentials immediately...',
      timestamp: '30 minutes ago',
      tags: ['Security', 'Alert', 'Action Required'],
      isRead: false,
      isStarred: false,
      hasAttachment: false,
      responses: 0,
      deadline: 'Today 6 PM',
      status: 'pending'
    },
    {
      id: 5,
      priority: 'high',
      subject: 'New Product Launch Strategy Discussion',
      sender: 'Sneha Reddy',
      senderRole: 'Product Manager',
      senderAvatar: '👩‍💻',
      preview: 'Team, let\'s finalize the go-to-market strategy for our new product launch. Marketing materials need approval ASAP...',
      timestamp: '2 hours ago',
      tags: ['Product', 'Strategy', 'Marketing'],
      isRead: true,
      isStarred: false,
      hasAttachment: true,
      responses: 8,
      deadline: 'Friday 12 PM',
      status: 'in-progress'
    },
    {
      id: 6,
      priority: 'high',
      subject: 'Performance Review Feedback Deadline',
      sender: 'HR Department',
      senderRole: 'Human Resources',
      senderAvatar: '👔',
      preview: 'Reminder: Performance review feedback for your team members is due by end of this week. Please complete all pending reviews...',
      timestamp: '3 hours ago',
      tags: ['HR', 'Review', 'Deadline'],
      isRead: false,
      isStarred: false,
      hasAttachment: false,
      responses: 1,
      deadline: 'Friday 5 PM',
      status: 'pending'
    },
    {
      id: 7,
      priority: 'medium',
      subject: 'Team Building Event Planning',
      sender: 'Vikram Singh',
      senderRole: 'Operations Manager',
      senderAvatar: '👨‍💼',
      preview: 'Planning our quarterly team building event. Need your input on dates and location preferences. Please respond by Wednesday...',
      timestamp: '5 hours ago',
      tags: ['Team', 'Event', 'Planning'],
      isRead: true,
      isStarred: false,
      hasAttachment: false,
      responses: 12,
      deadline: 'Wednesday',
      status: 'completed'
    },
    {
      id: 8,
      priority: 'urgent',
      subject: 'API Integration Issue - Live Website',
      sender: 'Deepak Patel',
      senderRole: 'Backend Developer',
      senderAvatar: '👨‍💻',
      preview: 'Critical API integration issue affecting live website. Payment gateway is down. Need immediate fix to prevent revenue loss...',
      timestamp: '10 minutes ago',
      tags: ['Critical', 'API', 'Payment'],
      isRead: false,
      isStarred: true,
      hasAttachment: false,
      responses: 0,
      deadline: 'Immediate',
      status: 'pending'
    },
  ];

  const getPriorityConfig = (priority) => {
    const configs = {
      'urgent': {
        color: 'red',
        badge: 'bg-red-100 text-red-700 border-red-300',
        icon: Zap,
        iconColor: 'text-red-600',
        text: 'URGENT',
        pulse: true
      },
      'high': {
        color: 'orange',
        badge: 'bg-orange-100 text-orange-700 border-orange-300',
        icon: Flag,
        iconColor: 'text-orange-600',
        text: 'HIGH PRIORITY',
        pulse: false
      },
      'medium': {
        color: 'yellow',
        badge: 'bg-yellow-100 text-yellow-700 border-yellow-300',
        icon: AlertCircle,
        iconColor: 'text-yellow-600',
        text: 'MEDIUM',
        pulse: false
      }
    };
    return configs[priority] || configs.medium;
  };

  const getStatusConfig = (status) => {
    const configs = {
      'pending': { badge: 'bg-slate-100 text-slate-700', text: 'Pending', icon: Clock },
      'in-progress': { badge: 'bg-blue-100 text-blue-700', text: 'In Progress', icon: ArrowUpRight },
      'completed': { badge: 'bg-emerald-100 text-emerald-700', text: 'Completed', icon: CheckCircle }
    };
    return configs[status] || configs.pending;
  };

  const filteredMessages = messages.filter(msg => 
    (priorityFilter === 'all' || msg.priority === priorityFilter) &&
    (msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
     msg.sender.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                Priority Messages
              </h1>
              <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">8 URGENT</span>
              </div>
            </div>
            <p className="text-slate-600">Critical messages requiring immediate attention</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
                <div className={`${stat.bgColor} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <p className="text-slate-600 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.subtext}</p>
              </div>
            );
          })}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search messages by subject or sender..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {priorityFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setPriorityFilter(filter.value)}
                  className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                    priorityFilter === filter.value
                      ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {filter.label}
                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/20">
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="space-y-4">
          {filteredMessages.map((message) => {
            const priorityConfig = getPriorityConfig(message.priority);
            const statusConfig = getStatusConfig(message.status);
            const PriorityIcon = priorityConfig.icon;
            const StatusIcon = statusConfig.icon;

            return (
              <div 
                key={message.id}
                className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer ${
                  message.priority === 'urgent' ? 'border-red-300' : 
                  message.priority === 'high' ? 'border-orange-300' : 
                  'border-yellow-300'
                } ${!message.isRead ? 'bg-gradient-to-r from-red-50/30 to-transparent' : ''}`}
                onClick={() => setSelectedMessage(message.id)}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Left: Avatar and Online Status */}
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center text-3xl">
                        {message.senderAvatar}
                      </div>
                    </div>

                    {/* Middle: Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className={`text-lg font-bold text-slate-800 ${!message.isRead ? 'text-slate-900' : ''}`}>
                              {message.subject}
                            </h3>
                            {!message.isRead && (
                              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                NEW
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                            <span className="font-semibold">{message.sender}</span>
                            <span>•</span>
                            <span>{message.senderRole}</span>
                            <span>•</span>
                            <span>{message.timestamp}</span>
                          </div>
                          <p className="text-slate-600 text-sm line-clamp-2 mb-3">{message.preview}</p>
                          
                          {/* Tags */}
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            {message.tags.map((tag, idx) => (
                              <span key={idx} className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Action Bar */}
                          <div className="flex items-center gap-4 text-sm">
                            <button className="flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors">
                              <Reply className="w-4 h-4" />
                              Reply
                            </button>
                            <button className="flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors">
                              <Forward className="w-4 h-4" />
                              Forward
                            </button>
                            <button className="flex items-center gap-1 text-slate-600 hover:text-slate-800 transition-colors">
                              <Archive className="w-4 h-4" />
                              Archive
                            </button>
                            {message.responses > 0 && (
                              <span className="flex items-center gap-1 text-slate-600">
                                <MessageSquare className="w-4 h-4" />
                                {message.responses} responses
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Right: Priority and Status */}
                        <div className="flex flex-col items-end gap-3">
                          <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border-2 ${priorityConfig.badge} ${
                            priorityConfig.pulse ? 'animate-pulse' : ''
                          }`}>
                            <PriorityIcon className="w-4 h-4" />
                            {priorityConfig.text}
                          </span>
                          
                          <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.badge}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig.text}
                          </span>

                          <div className="flex items-center gap-2">
                            {message.isStarred && (
                              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            )}
                            {message.hasAttachment && (
                              <div className="bg-blue-100 text-blue-700 p-1.5 rounded-lg">
                                <Tag className="w-4 h-4" />
                              </div>
                            )}
                          </div>

                          <div className="text-right">
                            <p className="text-xs text-slate-500 mb-1">Deadline</p>
                            <p className={`text-sm font-bold ${
                              message.deadline === 'ASAP' || message.deadline === 'Immediate' ? 'text-red-600' : 'text-slate-800'
                            }`}>
                              {message.deadline}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Urgent Messages Get Extra Highlight */}
                {message.priority === 'urgent' && !message.isRead && (
                  <div className="h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredMessages.length === 0 && (
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-slate-100 text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No messages found</h3>
            <p className="text-slate-600">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
}