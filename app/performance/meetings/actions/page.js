'use client';

import React, { useState } from 'react';
import { CheckCircle2, Circle, Clock, AlertCircle, Users, Calendar, Filter, Plus, Search, Flag, TrendingUp, User, MessageSquare, Paperclip, Edit3, Trash2, MoreVertical, ChevronDown, ChevronRight } from 'lucide-react';

const ActionItems = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [viewMode, setViewMode] = useState('board');
  const [expandedItem, setExpandedItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const actionItems = [
    {
      id: 1,
      title: 'Complete Q4 Sales Report',
      description: 'Finalize and submit the comprehensive sales analysis for Q4 2024',
      status: 'in-progress',
      priority: 'high',
      assignedTo: 'John Doe',
      dueDate: '2024-11-05',
      meetingTitle: 'Q4 Review Meeting',
      meetingDate: '2024-10-28',
      progress: 65,
      comments: 3,
      attachments: 2,
      tags: ['Sales', 'Report', 'Quarterly']
    },
    {
      id: 2,
      title: 'Update Customer Database',
      description: 'Import new customer records and verify existing data',
      status: 'pending',
      priority: 'medium',
      assignedTo: 'Sarah Smith',
      dueDate: '2024-11-03',
      meetingTitle: 'Database Maintenance',
      meetingDate: '2024-10-29',
      progress: 0,
      comments: 1,
      attachments: 0,
      tags: ['Database', 'Maintenance']
    },
    {
      id: 3,
      title: 'Review Marketing Campaign Results',
      description: 'Analyze performance metrics and ROI for October campaigns',
      status: 'completed',
      priority: 'high',
      assignedTo: 'Mike Johnson',
      dueDate: '2024-10-30',
      meetingTitle: 'Marketing Strategy Session',
      meetingDate: '2024-10-27',
      progress: 100,
      comments: 5,
      attachments: 4,
      tags: ['Marketing', 'Analytics']
    },
    {
      id: 4,
      title: 'Prepare Budget Proposal',
      description: 'Draft 2025 budget with departmental allocations',
      status: 'in-progress',
      priority: 'high',
      assignedTo: 'Emily Davis',
      dueDate: '2024-11-08',
      meetingTitle: 'Financial Planning',
      meetingDate: '2024-10-28',
      progress: 40,
      comments: 2,
      attachments: 1,
      tags: ['Finance', 'Budget', 'Planning']
    },
    {
      id: 5,
      title: 'Schedule Team Training',
      description: 'Organize quarterly training sessions for all departments',
      status: 'pending',
      priority: 'low',
      assignedTo: 'John Doe',
      dueDate: '2024-11-15',
      meetingTitle: 'HR Strategy Meeting',
      meetingDate: '2024-10-30',
      progress: 0,
      comments: 0,
      attachments: 0,
      tags: ['HR', 'Training']
    },
    {
      id: 6,
      title: 'Fix Production Bug #234',
      description: 'Resolve critical issue affecting customer checkout process',
      status: 'in-progress',
      priority: 'critical',
      assignedTo: 'Sarah Smith',
      dueDate: '2024-11-01',
      meetingTitle: 'Tech Team Standup',
      meetingDate: '2024-10-30',
      progress: 80,
      comments: 8,
      attachments: 3,
      tags: ['Development', 'Bug', 'Critical']
    },
    {
      id: 7,
      title: 'Update Product Documentation',
      description: 'Revise user guides and API documentation',
      status: 'pending',
      priority: 'medium',
      assignedTo: 'Mike Johnson',
      dueDate: '2024-11-10',
      meetingTitle: 'Product Review',
      meetingDate: '2024-10-29',
      progress: 0,
      comments: 1,
      attachments: 0,
      tags: ['Documentation', 'Product']
    },
    {
      id: 8,
      title: 'Conduct User Interviews',
      description: 'Interview 10 key customers for feedback on new features',
      status: 'in-progress',
      priority: 'medium',
      assignedTo: 'Emily Davis',
      dueDate: '2024-11-12',
      meetingTitle: 'UX Research Planning',
      meetingDate: '2024-10-28',
      progress: 30,
      comments: 4,
      attachments: 1,
      tags: ['Research', 'UX', 'Customer']
    }
  ];

  const stats = {
    total: actionItems.length,
    pending: actionItems.filter(i => i.status === 'pending').length,
    inProgress: actionItems.filter(i => i.status === 'in-progress').length,
    completed: actionItems.filter(i => i.status === 'completed').length,
    overdue: actionItems.filter(i => new Date(i.dueDate) < new Date() && i.status !== 'completed').length
  };

  const filteredItems = actionItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const groupedItems = {
    pending: filteredItems.filter(i => i.status === 'pending'),
    'in-progress': filteredItems.filter(i => i.status === 'in-progress'),
    completed: filteredItems.filter(i => i.status === 'completed')
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      critical: <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium flex items-center gap-1"><Flag className="w-3 h-3" />Critical</span>,
      high: <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium flex items-center gap-1"><Flag className="w-3 h-3" />High</span>,
      medium: <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium flex items-center gap-1"><Flag className="w-3 h-3" />Medium</span>,
      low: <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium flex items-center gap-1"><Flag className="w-3 h-3" />Low</span>
    };
    return badges[priority];
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-slate-500',
      'in-progress': 'text-blue-600',
      completed: 'text-green-600'
    };
    return colors[status];
  };

  const ActionCard = ({ item }) => (
    <div className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <button className={`mt-1 ${getStatusColor(item.status)}`}>
            {item.status === 'completed' ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-800 mb-1">{item.title}</h3>
            <p className="text-sm text-slate-600 line-clamp-2">{item.description}</p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {item.tags.slice(0, 2).map((tag, idx) => (
          <span key={idx} className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
            {tag}
          </span>
        ))}
      </div>

      <div className="mb-3">
        {getPriorityBadge(item.priority)}
      </div>

      {item.status === 'in-progress' && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
            <span>Progress</span>
            <span className="font-medium">{item.progress}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all" 
              style={{ width: `${item.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-slate-500 mb-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {item.dueDate}
        </div>
        <div className="flex items-center gap-3">
          {item.comments > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {item.comments}
            </span>
          )}
          {item.attachments > 0 && (
            <span className="flex items-center gap-1">
              <Paperclip className="w-3 h-3" />
              {item.attachments}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs font-medium">
            {item.assignedTo.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="text-xs text-slate-600">{item.assignedTo}</span>
        </div>
        <div className="flex gap-1">
          <button className="p-1.5 hover:bg-slate-100 rounded transition-colors">
            <Edit3 className="w-3.5 h-3.5 text-slate-600" />
          </button>
          <button className="p-1.5 hover:bg-slate-100 rounded transition-colors">
            <Trash2 className="w-3.5 h-3.5 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Action Items</h1>
            <p className="text-slate-600">Track and manage meeting action items and tasks</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 font-medium"
          >
            <Plus className="w-4 h-4" />
            New Action Item
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Total Items</span>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-slate-800">{stats.total}</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Pending</span>
              <Circle className="w-5 h-5 text-slate-500" />
            </div>
            <div className="text-3xl font-bold text-slate-600">{stats.pending}</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">In Progress</span>
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-600">{stats.inProgress}</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Completed</span>
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Overdue</span>
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-3xl font-bold text-red-600">{stats.overdue}</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search action items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div className="flex gap-2">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <select 
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">All Priority</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <div className="flex gap-1 border border-slate-300 rounded-lg p-1">
                <button 
                  onClick={() => setViewMode('board')}
                  className={`px-3 py-1.5 rounded transition-colors text-sm ${viewMode === 'board' ? 'bg-purple-100 text-purple-700' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  Board
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded transition-colors text-sm ${viewMode === 'list' ? 'bg-purple-100 text-purple-700' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Board View */}
        {viewMode === 'board' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pending Column */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Circle className="w-5 h-5 text-slate-500" />
                  <h3 className="font-semibold text-slate-800">Pending</h3>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                    {groupedItems.pending.length}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                {groupedItems.pending.map(item => (
                  <ActionCard key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* In Progress Column */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-slate-800">In Progress</h3>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
                    {groupedItems['in-progress'].length}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                {groupedItems['in-progress'].map(item => (
                  <ActionCard key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* Completed Column */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-slate-800">Completed</h3>
                  <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">
                    {groupedItems.completed.length}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                {groupedItems.completed.map(item => (
                  <ActionCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-3">
            {filteredItems.map(item => (
              <div key={item.id} className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <button className={`mt-1 ${getStatusColor(item.status)}`}>
                    {item.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 mb-1">{item.title}</h3>
                        <p className="text-sm text-slate-600">{item.description}</p>
                      </div>
                      {getPriorityBadge(item.priority)}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {item.assignedTo}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.dueDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {item.comments}
                      </span>
                      {item.attachments > 0 && (
                        <span className="flex items-center gap-1">
                          <Paperclip className="w-3 h-3" />
                          {item.attachments}
                        </span>
                      )}
                    </div>
                    {item.status === 'in-progress' && (
                      <div className="mt-3 max-w-xs">
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all" 
                            style={{ width: `${item.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Action Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-xl font-semibold text-slate-800">New Action Item</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                <input
                  type="text"
                  placeholder="Enter action item title..."
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  placeholder="Describe the action item..."
                  rows="3"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                  <select className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Assign To</label>
                <select className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  <option>John Doe</option>
                  <option>Sarah Smith</option>
                  <option>Mike Johnson</option>
                  <option>Emily Davis</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex gap-3 justify-end">
              <button 
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Create Action Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionItems;