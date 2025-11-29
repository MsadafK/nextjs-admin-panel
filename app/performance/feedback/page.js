'use client';

import React, { useState } from 'react';
import { MessageSquare, Star, ThumbsUp, ThumbsDown, Plus, Search, Filter, TrendingUp, Users, Clock, Eye, Reply, MoreVertical, Calendar, Tag, CheckCircle2, AlertCircle, Send, Sparkles, BarChart3, Target } from 'lucide-react';

const Feedback = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const feedbackData = [
    {
      id: 1,
      type: 'positive',
      category: 'Product',
      title: 'Excellent Dashboard Features',
      message: 'The new analytics dashboard is incredibly intuitive and provides all the insights we need. The real-time updates are particularly impressive.',
      author: 'Sarah Johnson',
      department: 'Sales',
      date: '2024-10-30',
      time: '10:30 AM',
      rating: 5,
      status: 'acknowledged',
      responses: 2,
      helpful: 12,
      tags: ['Dashboard', 'Analytics', 'UX']
    },
    {
      id: 2,
      type: 'suggestion',
      category: 'Feature Request',
      title: 'Add Export to PDF Option',
      message: 'It would be great to have a direct export to PDF feature for reports. Currently having to use workarounds which is time-consuming.',
      author: 'Mike Chen',
      department: 'Marketing',
      date: '2024-10-29',
      time: '2:15 PM',
      rating: 4,
      status: 'in-review',
      responses: 1,
      helpful: 8,
      tags: ['Export', 'Reports', 'Feature']
    },
    {
      id: 3,
      type: 'negative',
      category: 'Bug Report',
      title: 'Slow Loading Times on Mobile',
      message: 'The application takes significantly longer to load on mobile devices compared to desktop. This affects productivity when working remotely.',
      author: 'Emily Rodriguez',
      department: 'Operations',
      date: '2024-10-29',
      time: '11:20 AM',
      rating: 2,
      status: 'resolved',
      responses: 3,
      helpful: 15,
      tags: ['Mobile', 'Performance', 'Bug']
    },
    {
      id: 4,
      type: 'positive',
      category: 'Team',
      title: 'Outstanding Support Team',
      message: 'The support team has been incredibly responsive and helpful. They resolved my issue within hours and followed up to ensure everything was working correctly.',
      author: 'David Kim',
      department: 'IT',
      date: '2024-10-28',
      time: '4:45 PM',
      rating: 5,
      status: 'acknowledged',
      responses: 1,
      helpful: 20,
      tags: ['Support', 'Service', 'Team']
    },
    {
      id: 5,
      type: 'suggestion',
      category: 'UX/UI',
      title: 'Improve Search Functionality',
      message: 'Search could be enhanced with filters and advanced options. Would also love to see search history and saved searches.',
      author: 'Lisa Anderson',
      department: 'Product',
      date: '2024-10-28',
      time: '9:30 AM',
      rating: 4,
      status: 'planned',
      responses: 2,
      helpful: 10,
      tags: ['Search', 'UX', 'Enhancement']
    },
    {
      id: 6,
      type: 'negative',
      category: 'Process',
      title: 'Complex Onboarding Process',
      message: 'New team members find the onboarding process overwhelming. We need better documentation and step-by-step guides.',
      author: 'James Wilson',
      department: 'HR',
      date: '2024-10-27',
      time: '1:00 PM',
      rating: 2,
      status: 'in-review',
      responses: 4,
      helpful: 18,
      tags: ['Onboarding', 'Documentation', 'Training']
    },
    {
      id: 7,
      type: 'positive',
      category: 'Product',
      title: 'Love the New Collaboration Tools',
      message: 'The team collaboration features have significantly improved our workflow. Real-time editing and comments are game-changers.',
      author: 'Rachel Green',
      department: 'Design',
      date: '2024-10-27',
      time: '10:15 AM',
      rating: 5,
      status: 'acknowledged',
      responses: 1,
      helpful: 14,
      tags: ['Collaboration', 'Features', 'Workflow']
    },
    {
      id: 8,
      type: 'suggestion',
      category: 'Integration',
      title: 'Slack Integration Needed',
      message: 'Would be extremely helpful to have Slack integration for notifications and updates. This would improve team communication.',
      author: 'Tom Baker',
      department: 'Engineering',
      date: '2024-10-26',
      time: '3:30 PM',
      rating: 4,
      status: 'planned',
      responses: 3,
      helpful: 22,
      tags: ['Integration', 'Slack', 'Notifications']
    }
  ];

  const stats = {
    total: feedbackData.length,
    positive: feedbackData.filter(f => f.type === 'positive').length,
    negative: feedbackData.filter(f => f.type === 'negative').length,
    suggestions: feedbackData.filter(f => f.type === 'suggestion').length,
    avgRating: (feedbackData.reduce((sum, f) => sum + f.rating, 0) / feedbackData.length).toFixed(1),
    responseRate: 85,
    satisfactionScore: 4.2
  };

  const filteredFeedback = feedbackData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || item.type === activeTab;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesTab && matchesStatus;
  });

  const getTypeIcon = (type) => {
    const icons = {
      positive: <ThumbsUp className="w-5 h-5 text-green-600" />,
      negative: <ThumbsDown className="w-5 h-5 text-red-600" />,
      suggestion: <MessageSquare className="w-5 h-5 text-blue-600" />
    };
    return icons[type];
  };

  const getTypeBadge = (type) => {
    const badges = {
      positive: <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Positive</span>,
      negative: <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">Negative</span>,
      suggestion: <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Suggestion</span>
    };
    return badges[type];
  };

  const getStatusBadge = (status) => {
    const badges = {
      'acknowledged': <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">Acknowledged</span>,
      'in-review': <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded font-medium">In Review</span>,
      'planned': <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded font-medium">Planned</span>,
      'resolved': <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">Resolved</span>
    };
    return badges[status];
  };

  const handleViewDetails = (feedback) => {
    setSelectedFeedback(feedback);
    setShowDetailModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Feedback Management</h1>
            <p className="text-slate-600">Track, manage, and respond to team feedback</p>
          </div>
          <button 
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
          >
            <Plus className="w-4 h-4" />
            Submit Feedback
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Total Feedback</span>
              <MessageSquare className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-3xl font-bold text-slate-800">{stats.total}</div>
            <div className="text-xs text-slate-500 mt-1">All time</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Avg Rating</span>
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            </div>
            <div className="text-3xl font-bold text-yellow-600">{stats.avgRating}</div>
            <div className="text-xs text-slate-500 mt-1">Out of 5.0</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Response Rate</span>
              <Reply className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600">{stats.responseRate}%</div>
            <div className="text-xs text-slate-500 mt-1">Within 24 hours</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Satisfaction</span>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-600">{stats.satisfactionScore}</div>
            <div className="text-xs text-slate-500 mt-1">Score this month</div>
          </div>
        </div>

        {/* Feedback Type Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Feedback Distribution</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <ThumbsUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-700">{stats.positive}</div>
                  <div className="text-xs text-green-600">Positive</div>
                </div>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${(stats.positive / stats.total) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-700">{stats.suggestions}</div>
                  <div className="text-xs text-blue-600">Suggestions</div>
                </div>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(stats.suggestions / stats.total) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <ThumbsDown className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-700">{stats.negative}</div>
                  <div className="text-xs text-red-600">Negative</div>
                </div>
              </div>
              <div className="w-full bg-red-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full" 
                  style={{ width: `${(stats.negative / stats.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                  activeTab === 'all'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                All ({feedbackData.length})
              </button>
              <button
                onClick={() => setActiveTab('positive')}
                className={`px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                  activeTab === 'positive'
                    ? 'bg-green-100 text-green-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Positive ({stats.positive})
              </button>
              <button
                onClick={() => setActiveTab('suggestion')}
                className={`px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                  activeTab === 'suggestion'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Suggestions ({stats.suggestions})
              </button>
              <button
                onClick={() => setActiveTab('negative')}
                className={`px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                  activeTab === 'negative'
                    ? 'bg-red-100 text-red-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Negative ({stats.negative})
              </button>
            </div>
            <div className="flex-1 flex gap-2">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search feedback..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="acknowledged">Acknowledged</option>
                <option value="in-review">In Review</option>
                <option value="planned">Planned</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Feedback List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Feedback Items ({filteredFeedback.length})
          </h2>
          <div className="space-y-3">
            {filteredFeedback.map(feedback => (
              <div
                key={feedback.id}
                className="p-4 border border-slate-200 rounded-lg hover:shadow-md hover:border-indigo-300 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getTypeIcon(feedback.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-800">{feedback.title}</h3>
                          {getTypeBadge(feedback.type)}
                          {getStatusBadge(feedback.status)}
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-2 mb-2">{feedback.message}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {feedback.tags.map((tag, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button className="text-slate-400 hover:text-slate-600 ml-2">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {feedback.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {feedback.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {feedback.date}
                        </span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < feedback.rating
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" />
                          {feedback.helpful}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Reply className="w-3 h-3" />
                          {feedback.responses}
                        </span>
                        <button 
                          onClick={() => handleViewDetails(feedback)}
                          className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xs font-medium flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Feedback Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-xl font-semibold text-slate-800">Submit Feedback</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Feedback Type</label>
                <div className="grid grid-cols-3 gap-3">
                  <button className="p-3 border-2 border-green-300 bg-green-50 rounded-lg hover:border-green-500 transition-all">
                    <ThumbsUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <span className="text-sm font-medium text-green-700">Positive</span>
                  </button>
                  <button className="p-3 border-2 border-slate-300 rounded-lg hover:border-blue-500 transition-all">
                    <MessageSquare className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <span className="text-sm font-medium text-slate-700">Suggestion</span>
                  </button>
                  <button className="p-3 border-2 border-slate-300 rounded-lg hover:border-red-500 transition-all">
                    <ThumbsDown className="w-5 h-5 text-red-600 mx-auto mb-1" />
                    <span className="text-sm font-medium text-slate-700">Negative</span>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <select className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option>Product</option>
                  <option>Feature Request</option>
                  <option>Bug Report</option>
                  <option>Team</option>
                  <option>Process</option>
                  <option>UX/UI</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                <input
                  type="text"
                  placeholder="Brief summary of your feedback..."
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                <textarea
                  placeholder="Provide detailed feedback..."
                  rows="4"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button key={rating} className="hover:scale-110 transition-transform">
                      <Star className="w-8 h-8 text-slate-300 hover:text-yellow-500 hover:fill-yellow-500" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex gap-3 justify-end">
              <button 
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 sticky top-0 bg-white">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-slate-800">{selectedFeedback.title}</h3>
                    {getTypeBadge(selectedFeedback.type)}
                    {getStatusBadge(selectedFeedback.status)}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <span>{selectedFeedback.author}</span>
                    <span>•</span>
                    <span>{selectedFeedback.department}</span>
                    <span>•</span>
                    <span>{selectedFeedback.date} at {selectedFeedback.time}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">Feedback Details</h4>
                <p className="text-slate-600">{selectedFeedback.message}</p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 mb-2">Rating</h4>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < selectedFeedback.rating
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedFeedback.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold text-slate-800 mb-3">Response</h4>
                <textarea
                  placeholder="Write your response..."
                  rows="3"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2">
                  <Reply className="w-4 h-4" />
                  Send Response
                </button>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 mb-3">Previous Responses ({selectedFeedback.responses})</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-800">Admin Team</span>
                      <span className="text-xs text-slate-500">2 hours ago</span>
                    </div>
                    <p className="text-sm text-slate-600">Thank you for your feedback! We're looking into this and will update you soon.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex gap-3 justify-end bg-slate-50">
              <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-white transition-colors">
                Mark as Resolved
              </button>
              <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors">
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;