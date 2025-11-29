'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Video,
  Calendar,
  Clock,
  Users,
  Plus,
  Filter,
  Search,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Download,
  Edit2,
  Trash2,
  Copy,
  MoreVertical,
  User,
  FileText,
  Bell,
  TrendingUp,
  CalendarCheck,
  CalendarX,
  Zap
} from 'lucide-react';

export default function MyMeetingsPage() {
  const [selectedView, setSelectedView] = useState('upcoming');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const meetingStats = [
    {
      title: 'Upcoming Meetings',
      value: '12',
      change: '+3',
      trend: 'up',
      icon: Calendar,
      color: 'from-blue-500 to-cyan-500',
      subtitle: 'this week'
    },
    {
      title: 'Today\'s Meetings',
      value: '4',
      change: '2 completed',
      trend: 'neutral',
      icon: Clock,
      color: 'from-purple-500 to-pink-500',
      subtitle: '2 remaining'
    },
    {
      title: 'Total Attendees',
      value: '48',
      change: '+8',
      trend: 'up',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      subtitle: 'this week'
    },
    {
      title: 'Completion Rate',
      value: '94%',
      change: '+2%',
      trend: 'up',
      icon: CheckCircle2,
      color: 'from-orange-500 to-red-500',
      subtitle: 'on time'
    }
  ];

  const upcomingMeetings = [
    {
      id: 1,
      title: 'Q4 Strategy Planning',
      type: 'Team Meeting',
      date: '2025-11-01',
      time: '10:00 AM',
      duration: '60 min',
      location: 'Conference Room A',
      meetingType: 'in-person',
      attendees: 8,
      organizer: 'Sarah Johnson',
      status: 'confirmed',
      priority: 'high',
      agenda: ['Review Q3 results', 'Set Q4 goals', 'Budget allocation']
    },
    {
      id: 2,
      title: 'Product Demo Review',
      type: 'Client Meeting',
      date: '2025-11-01',
      time: '2:00 PM',
      duration: '45 min',
      location: 'Zoom',
      meetingType: 'virtual',
      attendees: 6,
      organizer: 'Michael Chen',
      status: 'confirmed',
      priority: 'high',
      agenda: ['Product walkthrough', 'Feature discussion', 'Q&A session']
    },
    {
      id: 3,
      title: 'Weekly Team Sync',
      type: 'Team Meeting',
      date: '2025-11-01',
      time: '4:30 PM',
      duration: '30 min',
      location: 'Google Meet',
      meetingType: 'virtual',
      attendees: 12,
      organizer: 'You',
      status: 'pending',
      priority: 'medium',
      agenda: ['Project updates', 'Blockers discussion', 'Next steps']
    },
    {
      id: 4,
      title: 'One-on-One with Manager',
      type: '1:1 Meeting',
      date: '2025-11-02',
      time: '11:00 AM',
      duration: '30 min',
      location: 'Manager\'s Office',
      meetingType: 'in-person',
      attendees: 2,
      organizer: 'Emily Davis',
      status: 'confirmed',
      priority: 'medium',
      agenda: ['Performance review', 'Career goals', 'Feedback']
    },
    {
      id: 5,
      title: 'Design System Workshop',
      type: 'Workshop',
      date: '2025-11-02',
      time: '3:00 PM',
      duration: '90 min',
      location: 'Conference Room B',
      meetingType: 'in-person',
      attendees: 15,
      organizer: 'Design Team',
      status: 'confirmed',
      priority: 'low',
      agenda: ['Component review', 'Best practices', 'Hands-on session']
    }
  ];

  const pastMeetings = [
    {
      id: 6,
      title: 'Monthly Review Meeting',
      type: 'Team Meeting',
      date: '2025-10-28',
      time: '10:00 AM',
      duration: '60 min',
      attendees: 10,
      status: 'completed',
      notes: 'Action items assigned'
    },
    {
      id: 7,
      title: 'Client Kickoff Call',
      type: 'Client Meeting',
      date: '2025-10-27',
      time: '2:00 PM',
      duration: '45 min',
      attendees: 8,
      status: 'completed',
      notes: 'Requirements documented'
    },
    {
      id: 8,
      title: 'Sprint Retrospective',
      type: 'Team Meeting',
      date: '2025-10-26',
      time: '4:00 PM',
      duration: '60 min',
      attendees: 12,
      status: 'completed',
      notes: 'Improvements identified'
    }
  ];

  const todaySchedule = [
    { time: '09:00 AM', meeting: null },
    { time: '10:00 AM', meeting: upcomingMeetings[0] },
    { time: '11:00 AM', meeting: null },
    { time: '12:00 PM', meeting: null },
    { time: '01:00 PM', meeting: null },
    { time: '02:00 PM', meeting: upcomingMeetings[1] },
    { time: '03:00 PM', meeting: null },
    { time: '04:00 PM', meeting: null },
    { time: '04:30 PM', meeting: upcomingMeetings[2] },
    { time: '05:00 PM', meeting: null }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'confirmed': 'bg-green-100 text-green-700',
      'pending': 'bg-yellow-100 text-yellow-700',
      'cancelled': 'bg-red-100 text-red-700',
      'completed': 'bg-blue-100 text-blue-700'
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'high': 'bg-red-100 text-red-700',
      'medium': 'bg-yellow-100 text-yellow-700',
      'low': 'bg-green-100 text-green-700'
    };
    return colors[priority] || 'bg-slate-100 text-slate-700';
  };

  const getMeetingTypeIcon = (type) => {
    return type === 'virtual' ? Video : MapPin;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
              <Calendar size={32} />
              My Meetings
            </h1>
            <p className="text-slate-600 mt-1">Manage your schedule and meetings</p>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-all flex items-center gap-2 text-slate-700 hover:shadow-md">
              <Filter size={18} />
              <span>Filter</span>
            </button>
            <button className="px-4 py-2 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-all flex items-center gap-2 text-slate-700 hover:shadow-md">
              <Download size={18} />
              <span>Export</span>
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
              <Plus size={18} />
              <span>New Meeting</span>
            </button>
          </div>
        </motion.div>

        {/* View Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
        >
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {['upcoming', 'today', 'past'].map((view) => (
                <button
                  key={view}
                  onClick={() => setSelectedView(view)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-all text-sm ${
                    selectedView === view
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search meetings..."
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
        </motion.div>

        {/* Meeting Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {meetingStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all border border-slate-100 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} group-hover:scale-110 transition-transform shadow-lg`}>
                  <stat.icon className="text-white" size={24} />
                </div>
                <div className="text-xs font-semibold text-slate-500">
                  {stat.change}
                </div>
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</h3>
              <p className="text-slate-600 text-sm mb-1">{stat.title}</p>
              <p className="text-xs text-slate-500">{stat.subtitle}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - Meetings List */}
          <div className="lg:col-span-2 space-y-4">
            {selectedView === 'upcoming' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {upcomingMeetings.map((meeting, index) => {
                  const MeetingIcon = getMeetingTypeIcon(meeting.meetingType);
                  return (
                    <motion.div
                      key={meeting.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold text-slate-800">{meeting.title}</h3>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getPriorityColor(meeting.priority)}`}>
                              {meeting.priority}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mb-3">{meeting.type}</p>
                          
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Calendar size={16} className="text-blue-600" />
                              <span>{new Date(meeting.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Clock size={16} className="text-blue-600" />
                              <span>{meeting.time} ({meeting.duration})</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <MeetingIcon size={16} className="text-blue-600" />
                              <span>{meeting.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Users size={16} className="text-blue-600" />
                              <span>{meeting.attendees} attendees</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            <User size={14} className="text-slate-400" />
                            <span className="text-sm text-slate-600">
                              Organized by <span className="font-semibold">{meeting.organizer}</span>
                            </span>
                          </div>

                          {meeting.agenda && (
                            <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                              <p className="text-xs font-semibold text-slate-700 mb-2">Agenda:</p>
                              <ul className="space-y-1">
                                {meeting.agenda.map((item, i) => (
                                  <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(meeting.status)}`}>
                            {meeting.status}
                          </span>
                          <div className="flex gap-1">
                            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600">
                              <Edit2 size={16} />
                            </button>
                            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600">
                              <Copy size={16} />
                            </button>
                            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600">
                              <MoreVertical size={16} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-all flex items-center gap-2">
                          <Video size={16} />
                          Join Meeting
                        </button>
                        <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-all">
                          View Details
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {selectedView === 'past' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {pastMeetings.map((meeting, index) => (
                  <motion.div
                    key={meeting.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-slate-800">{meeting.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(meeting.status)}`}>
                            {meeting.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{meeting.type}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>{new Date(meeting.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={16} />
                            <span>{meeting.time} ({meeting.duration})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users size={16} />
                            <span>{meeting.attendees} attendees</span>
                          </div>
                        </div>

                        {meeting.notes && (
                          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center gap-2 mb-1">
                              <FileText size={14} className="text-green-600" />
                              <span className="text-xs font-semibold text-green-800">Notes:</span>
                            </div>
                            <p className="text-sm text-green-700">{meeting.notes}</p>
                          </div>
                        )}
                      </div>

                      <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-all">
                        View Summary
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Sidebar - Today's Schedule */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Clock size={18} className="text-blue-600" />
                  Today's Schedule
                </h3>
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  View Calendar
                </button>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {todaySchedule.map((slot, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                      slot.meeting
                        ? 'bg-blue-50 border-l-4 border-blue-500'
                        : 'bg-slate-50 opacity-50'
                    }`}
                  >
                    <div className="text-xs font-semibold text-slate-600 w-20">
                      {slot.time}
                    </div>
                    {slot.meeting ? (
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800 mb-1">
                          {slot.meeting.title}
                        </p>
                        <p className="text-xs text-slate-600">{slot.meeting.duration}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">Free</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={20} />
                <h3 className="font-bold">Meeting Insights</h3>
              </div>

              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-blue-100">This Week</span>
                    <span className="text-2xl font-bold">12</span>
                  </div>
                  <p className="text-xs text-blue-200">Total meetings scheduled</p>
                </div>

                <div className="bg-white/10 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-blue-100">Avg Duration</span>
                    <span className="text-2xl font-bold">47m</span>
                  </div>
                  <p className="text-xs text-blue-200">Per meeting</p>
                </div>

                <div className="bg-white/10 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-blue-100">Meeting Hours</span>
                    <span className="text-2xl font-bold">9.4h</span>
                  </div>
                  <p className="text-xs text-blue-200">Total this week</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-left text-sm font-medium text-slate-700 transition-all flex items-center gap-2">
                  <CalendarCheck size={16} className="text-blue-600" />
                  Schedule New Meeting
                </button>
                <button className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-left text-sm font-medium text-slate-700 transition-all flex items-center gap-2">
                  <Bell size={16} className="text-blue-600" />
                  Set Reminders
                </button>
                <button className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-left text-sm font-medium text-slate-700 transition-all flex items-center gap-2">
                  <FileText size={16} className="text-blue-600" />
                  View Past Notes
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}