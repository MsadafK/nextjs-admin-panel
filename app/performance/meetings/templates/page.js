'use client';

import React, { useState } from 'react';
import { FileText, Plus, Search, Star, Clock, Users, Copy, Edit3, Trash2, Eye, Download, Calendar, CheckCircle2, Tag, Sparkles, Grid, List, Filter, MoreVertical } from 'lucide-react';

const AgendaTemplates = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = [
    {
      id: 1,
      name: 'Weekly Team Standup',
      category: 'Team Meeting',
      description: 'Quick sync for team alignment and progress updates',
      duration: '30 min',
      items: 6,
      participants: '5-10',
      lastUsed: '2 days ago',
      usageCount: 45,
      isFavorite: true,
      color: 'from-blue-500 to-blue-600',
      icon: '👥',
      sections: [
        { title: 'Quick Wins', duration: '5 min', items: ['Share recent achievements', 'Celebrate milestones'] },
        { title: 'Progress Updates', duration: '15 min', items: ['Current sprint status', 'Blockers and challenges'] },
        { title: 'Planning', duration: '10 min', items: ['Upcoming priorities', 'Resource allocation'] }
      ]
    },
    {
      id: 2,
      name: 'Quarterly Business Review',
      category: 'Executive',
      description: 'Comprehensive review of business performance and strategy',
      duration: '120 min',
      items: 12,
      participants: '8-15',
      lastUsed: '1 week ago',
      usageCount: 12,
      isFavorite: true,
      color: 'from-purple-500 to-purple-600',
      icon: '📊',
      sections: [
        { title: 'Financial Review', duration: '30 min', items: ['Revenue analysis', 'Cost breakdown', 'Profitability metrics'] },
        { title: 'Strategic Goals', duration: '45 min', items: ['Goal achievement', 'Market analysis', 'Competition'] },
        { title: 'Planning', duration: '45 min', items: ['Next quarter objectives', 'Budget allocation'] }
      ]
    },
    {
      id: 3,
      name: 'Project Kickoff',
      category: 'Project',
      description: 'Launch new projects with clear objectives and alignment',
      duration: '60 min',
      items: 8,
      participants: '6-12',
      lastUsed: '3 days ago',
      usageCount: 28,
      isFavorite: false,
      color: 'from-green-500 to-green-600',
      icon: '🚀',
      sections: [
        { title: 'Project Overview', duration: '15 min', items: ['Objectives', 'Scope', 'Deliverables'] },
        { title: 'Team & Resources', duration: '20 min', items: ['Roles', 'Timeline', 'Budget'] },
        { title: 'Q&A', duration: '25 min', items: ['Open discussion', 'Concerns', 'Next steps'] }
      ]
    },
    {
      id: 4,
      name: 'Sprint Planning',
      category: 'Development',
      description: 'Plan and prioritize work for the upcoming sprint',
      duration: '90 min',
      items: 10,
      participants: '5-8',
      lastUsed: '1 day ago',
      usageCount: 67,
      isFavorite: true,
      color: 'from-orange-500 to-orange-600',
      icon: '⚡',
      sections: [
        { title: 'Sprint Goals', duration: '15 min', items: ['Review backlog', 'Set objectives'] },
        { title: 'Story Estimation', duration: '50 min', items: ['Story points', 'Dependencies', 'Risks'] },
        { title: 'Commitment', duration: '25 min', items: ['Sprint capacity', 'Final selection'] }
      ]
    },
    {
      id: 5,
      name: 'Client Presentation',
      category: 'Client Meeting',
      description: 'Present progress and deliverables to clients',
      duration: '45 min',
      items: 7,
      participants: '4-8',
      lastUsed: '5 days ago',
      usageCount: 34,
      isFavorite: false,
      color: 'from-pink-500 to-pink-600',
      icon: '💼',
      sections: [
        { title: 'Introduction', duration: '5 min', items: ['Agenda overview', 'Meeting objectives'] },
        { title: 'Progress Report', duration: '25 min', items: ['Completed work', 'Demo', 'Metrics'] },
        { title: 'Next Steps', duration: '15 min', items: ['Upcoming work', 'Timeline', 'Feedback'] }
      ]
    },
    {
      id: 6,
      name: 'One-on-One Meeting',
      category: 'Team Meeting',
      description: 'Personal check-in and development discussion',
      duration: '30 min',
      items: 5,
      participants: '2',
      lastUsed: 'Yesterday',
      usageCount: 156,
      isFavorite: true,
      color: 'from-teal-500 to-teal-600',
      icon: '🤝',
      sections: [
        { title: 'Check-in', duration: '5 min', items: ['How are you?', 'Current mood'] },
        { title: 'Work Discussion', duration: '15 min', items: ['Current projects', 'Challenges', 'Support needed'] },
        { title: 'Development', duration: '10 min', items: ['Career goals', 'Learning opportunities'] }
      ]
    },
    {
      id: 7,
      name: 'Product Roadmap Review',
      category: 'Product',
      description: 'Review and update product development roadmap',
      duration: '75 min',
      items: 9,
      participants: '6-10',
      lastUsed: '1 week ago',
      usageCount: 19,
      isFavorite: false,
      color: 'from-indigo-500 to-indigo-600',
      icon: '🗺️',
      sections: [
        { title: 'Current Progress', duration: '20 min', items: ['Feature status', 'User feedback'] },
        { title: 'Roadmap Updates', duration: '35 min', items: ['New features', 'Priorities', 'Timeline'] },
        { title: 'Discussion', duration: '20 min', items: ['Dependencies', 'Risks', 'Resources'] }
      ]
    },
    {
      id: 8,
      name: 'Marketing Strategy Session',
      category: 'Marketing',
      description: 'Plan and align on marketing campaigns and initiatives',
      duration: '60 min',
      items: 8,
      participants: '5-8',
      lastUsed: '4 days ago',
      usageCount: 23,
      isFavorite: false,
      color: 'from-rose-500 to-rose-600',
      icon: '📢',
      sections: [
        { title: 'Campaign Review', duration: '20 min', items: ['Performance metrics', 'ROI analysis'] },
        { title: 'New Initiatives', duration: '25 min', items: ['Brainstorming', 'Target audience'] },
        { title: 'Action Planning', duration: '15 min', items: ['Assignments', 'Deadlines', 'Budget'] }
      ]
    }
  ];

  const categories = [
    { id: 'all', name: 'All Templates', count: templates.length },
    { id: 'Team Meeting', name: 'Team Meetings', count: templates.filter(t => t.category === 'Team Meeting').length },
    { id: 'Executive', name: 'Executive', count: templates.filter(t => t.category === 'Executive').length },
    { id: 'Project', name: 'Project', count: templates.filter(t => t.category === 'Project').length },
    { id: 'Development', name: 'Development', count: templates.filter(t => t.category === 'Development').length },
    { id: 'Client Meeting', name: 'Client', count: templates.filter(t => t.category === 'Client Meeting').length },
    { id: 'Product', name: 'Product', count: templates.filter(t => t.category === 'Product').length },
    { id: 'Marketing', name: 'Marketing', count: templates.filter(t => t.category === 'Marketing').length }
  ];

  const stats = {
    total: templates.length,
    favorites: templates.filter(t => t.isFavorite).length,
    totalUsage: templates.reduce((sum, t) => sum + t.usageCount, 0),
    avgDuration: Math.round(templates.reduce((sum, t) => sum + parseInt(t.duration), 0) / templates.length)
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const favoriteTemplates = templates.filter(t => t.isFavorite);

  const handlePreview = (template) => {
    setSelectedTemplate(template);
    setShowPreviewModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Agenda Templates</h1>
            <p className="text-slate-600">Pre-built meeting agendas for efficient and productive meetings</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
          >
            <Plus className="w-4 h-4" />
            Create Template
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Total Templates</span>
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-3xl font-bold text-slate-800">{stats.total}</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Favorites</span>
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            </div>
            <div className="text-3xl font-bold text-yellow-600">{stats.favorites}</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Total Usage</span>
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600">{stats.totalUsage}</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Avg Duration</span>
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-600">{stats.avgDuration} min</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex gap-2">
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.count})
                  </option>
                ))}
              </select>
              <div className="flex gap-1 border border-slate-300 rounded-lg p-1">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Favorite Templates */}
            {favoriteTemplates.length > 0 && categoryFilter === 'all' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <h2 className="text-lg font-semibold text-slate-800">Favorite Templates</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favoriteTemplates.map(template => (
                    <div
                      key={template.id}
                      className="p-4 border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div className={`w-12 h-12 bg-gradient-to-br ${template.color} rounded-lg flex items-center justify-center text-2xl shadow-md`}>
                            {template.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-800 mb-1">{template.name}</h3>
                            <p className="text-xs text-slate-600 line-clamp-2">{template.description}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-600 mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {template.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {template.participants}
                        </span>
                        <span>{template.items} items</span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handlePreview(template)}
                          className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                        >
                          Use Template
                        </button>
                        <button className="px-3 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                          <Eye className="w-4 h-4 text-slate-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Templates */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">
                All Templates ({filteredTemplates.length})
              </h2>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTemplates.map(template => (
                    <div
                      key={template.id}
                      className="p-4 border border-slate-200 rounded-lg hover:shadow-md hover:border-indigo-300 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 bg-gradient-to-br ${template.color} rounded-lg flex items-center justify-center text-xl`}>
                            {template.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-slate-800">{template.name}</h3>
                              {template.isFavorite && (
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                              )}
                            </div>
                            <span className="text-xs text-indigo-600 font-medium">{template.category}</span>
                          </div>
                        </div>
                        <button className="text-slate-400 hover:text-slate-600">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-sm text-slate-600 mb-3 line-clamp-2">{template.description}</p>

                      <div className="flex items-center gap-3 text-xs text-slate-500 mb-3 pb-3 border-b border-slate-100">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {template.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {template.participants}
                        </span>
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {template.items} items
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                        <span>Used {template.usageCount} times</span>
                        <span>{template.lastUsed}</span>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => handlePreview(template)}
                          className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                        >
                          Use Template
                        </button>
                        <button className="px-2 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                          <Copy className="w-4 h-4 text-slate-600" />
                        </button>
                        <button className="px-2 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                          <Edit3 className="w-4 h-4 text-slate-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTemplates.map(template => (
                    <div
                      key={template.id}
                      className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-all flex items-center gap-4"
                    >
                      <div className={`w-12 h-12 bg-gradient-to-br ${template.color} rounded-lg flex items-center justify-center text-2xl flex-shrink-0`}>
                        {template.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-800">{template.name}</h3>
                          {template.isFavorite && (
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          )}
                          <span className="text-xs text-indigo-600 font-medium px-2 py-0.5 bg-indigo-50 rounded">
                            {template.category}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{template.description}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {template.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {template.participants}
                          </span>
                          <span>{template.items} items</span>
                          <span>•</span>
                          <span>Used {template.usageCount} times</span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button 
                          onClick={() => handlePreview(template)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                        >
                          Use Template
                        </button>
                        <button className="px-3 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                          <Copy className="w-4 h-4 text-slate-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all text-sm ${
                      categoryFilter === cat.id
                        ? 'bg-indigo-50 border-2 border-indigo-500 text-indigo-700 font-medium'
                        : 'border border-slate-200 hover:border-indigo-300 text-slate-700'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className={`text-xs ${categoryFilter === cat.id ? 'text-indigo-600' : 'text-slate-500'}`}>
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-semibold text-amber-900">Template Tips</h3>
              </div>
              <ul className="space-y-2 text-sm text-amber-800">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Customize templates for your team</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Set realistic time allocations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Keep agendas focused and clear</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Share agendas in advance</span>
                </li>
              </ul>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                  <Plus className="w-4 h-4" />
                  Create New Template
                </button>
                <button className="w-full px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium text-slate-700">
                  <Download className="w-4 h-4" />
                  Import Templates
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreviewModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 sticky top-0 bg-white">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${selectedTemplate.color} rounded-lg flex items-center justify-center text-3xl`}>
                    {selectedTemplate.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800">{selectedTemplate.name}</h3>
                    <p className="text-sm text-slate-600 mt-1">{selectedTemplate.description}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {selectedTemplate.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {selectedTemplate.participants}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPreviewModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <h4 className="font-semibold text-slate-800 mb-3">Agenda Sections</h4>
              {selectedTemplate.sections.map((section, idx) => (
                <div key={idx} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-semibold text-slate-800">{section.title}</h5>
                    <span className="text-sm text-indigo-600 font-medium">{section.duration}</span>
                  </div>
                  <ul className="space-y-2">
                    {section.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-slate-200 flex gap-3 justify-end bg-slate-50">
              <button 
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-white transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2">
                <Copy className="w-4 h-4" />
                Duplicate
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Use for Meeting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-xl font-semibold text-slate-800">Create New Template</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Template Name</label>
                <input
                  type="text"
                  placeholder="e.g., Weekly Team Standup"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  placeholder="Describe the purpose of this meeting template..."
                  rows="3"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <select className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    <option>Team Meeting</option>
                    <option>Executive</option>
                    <option>Project</option>
                    <option>Development</option>
                    <option>Client Meeting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g., 30 min"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Participants</label>
                <input
                  type="text"
                  placeholder="e.g., 5-10"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Agenda Sections</label>
                <div className="space-y-3 p-4 border border-slate-200 rounded-lg bg-slate-50">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Section title..."
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Duration"
                      className="w-24 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>
                  <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                    <Plus className="w-4 h-4" />
                    Add Section
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex gap-3 justify-end">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgendaTemplates;