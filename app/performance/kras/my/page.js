'use client';
import { useState } from 'react';
import { Target, TrendingUp, CheckCircle, Clock, AlertCircle, Star, Award, BarChart3, Calendar, Edit, Plus, Eye, MessageSquare, User, Zap, Trophy, Percent, ArrowUpRight, ArrowDownRight, Flag, ChevronRight } from 'lucide-react';

export default function MyKRAsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('q4-2024');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const periods = [
    { value: 'q4-2024', label: 'Q4 2024' },
    { value: 'q3-2024', label: 'Q3 2024' },
    { value: 'q2-2024', label: 'Q2 2024' },
    { value: 'annual-2024', label: 'Annual 2024' },
  ];

  const statusFilters = [
    { value: 'all', label: 'All KRAs', count: 8 },
    { value: 'on-track', label: 'On Track', count: 5 },
    { value: 'at-risk', label: 'At Risk', count: 2 },
    { value: 'completed', label: 'Completed', count: 1 },
  ];

  const performanceStats = [
    { 
      label: 'Overall Achievement', 
      value: '87%', 
      change: '+5%',
      trend: 'up',
      icon: Target, 
      color: 'from-blue-500 to-indigo-600', 
      bgColor: 'bg-blue-50', 
      textColor: 'text-blue-600' 
    },
    { 
      label: 'Active KRAs', 
      value: '7', 
      subtext: '1 completed',
      icon: Flag, 
      color: 'from-purple-500 to-pink-600', 
      bgColor: 'bg-purple-50', 
      textColor: 'text-purple-600' 
    },
    { 
      label: 'On Track', 
      value: '5', 
      subtext: '62.5% of total',
      icon: TrendingUp, 
      color: 'from-emerald-500 to-teal-600', 
      bgColor: 'bg-emerald-50', 
      textColor: 'text-emerald-600' 
    },
    { 
      label: 'Performance Rating', 
      value: '4.2', 
      subtext: 'Out of 5.0',
      icon: Star, 
      color: 'from-yellow-500 to-orange-600', 
      bgColor: 'bg-yellow-50', 
      textColor: 'text-yellow-600' 
    },
  ];

  const kras = [
    {
      id: 1,
      title: 'Increase Monthly Recurring Revenue (MRR)',
      description: 'Drive revenue growth through customer acquisition and retention strategies',
      category: 'Revenue',
      priority: 'high',
      status: 'on-track',
      progress: 85,
      target: '₹50L MRR',
      current: '₹42.5L',
      deadline: '2024-12-31',
      owner: 'You',
      weightage: 25,
      milestones: [
        { title: 'Onboard 50 new customers', status: 'completed', date: '2024-10-15' },
        { title: 'Reduce churn rate to <5%', status: 'completed', date: '2024-11-01' },
        { title: 'Launch premium tier', status: 'in-progress', date: '2024-11-30' },
        { title: 'Achieve ₹50L MRR', status: 'pending', date: '2024-12-31' },
      ],
      metrics: {
        startValue: '₹32L',
        targetValue: '₹50L',
        currentValue: '₹42.5L',
        growthRate: '+32.8%'
      },
      feedback: 2,
      lastUpdated: '2 hours ago'
    },
    {
      id: 2,
      title: 'Improve Product Development Velocity',
      description: 'Increase feature delivery speed and reduce time-to-market',
      category: 'Product',
      priority: 'high',
      status: 'on-track',
      progress: 78,
      target: '40 Story Points/Sprint',
      current: '31.2 Points',
      deadline: '2024-12-31',
      owner: 'You',
      weightage: 20,
      milestones: [
        { title: 'Implement CI/CD pipeline', status: 'completed', date: '2024-09-30' },
        { title: 'Reduce bug backlog by 50%', status: 'completed', date: '2024-10-20' },
        { title: 'Increase test coverage to 85%', status: 'in-progress', date: '2024-11-25' },
        { title: 'Achieve 40 points/sprint', status: 'pending', date: '2024-12-31' },
      ],
      metrics: {
        startValue: '22 Points',
        targetValue: '40 Points',
        currentValue: '31.2 Points',
        growthRate: '+41.8%'
      },
      feedback: 1,
      lastUpdated: '5 hours ago'
    },
    {
      id: 3,
      title: 'Enhance Customer Satisfaction Score (CSAT)',
      description: 'Improve customer experience and support quality',
      category: 'Customer Success',
      priority: 'medium',
      status: 'at-risk',
      progress: 62,
      target: '90% CSAT',
      current: '83%',
      deadline: '2024-12-31',
      owner: 'You',
      weightage: 15,
      milestones: [
        { title: 'Launch new support portal', status: 'completed', date: '2024-10-01' },
        { title: 'Reduce response time to <2hrs', status: 'in-progress', date: '2024-11-15' },
        { title: 'Implement proactive outreach', status: 'pending', date: '2024-12-01' },
        { title: 'Achieve 90% CSAT', status: 'pending', date: '2024-12-31' },
      ],
      metrics: {
        startValue: '78%',
        targetValue: '90%',
        currentValue: '83%',
        growthRate: '+6.4%'
      },
      feedback: 3,
      lastUpdated: '1 day ago'
    },
    {
      id: 4,
      title: 'Build High-Performing Team Culture',
      description: 'Foster collaboration and develop team capabilities',
      category: 'Team Development',
      priority: 'medium',
      status: 'on-track',
      progress: 88,
      target: '4.5+ Engagement',
      current: '4.4/5.0',
      deadline: '2024-12-31',
      owner: 'You',
      weightage: 15,
      milestones: [
        { title: 'Conduct quarterly team survey', status: 'completed', date: '2024-10-15' },
        { title: 'Organize team building events', status: 'completed', date: '2024-10-30' },
        { title: 'Launch mentorship program', status: 'completed', date: '2024-11-10' },
        { title: 'Achieve 4.5+ engagement', status: 'in-progress', date: '2024-12-31' },
      ],
      metrics: {
        startValue: '3.9',
        targetValue: '4.5',
        currentValue: '4.4',
        growthRate: '+12.8%'
      },
      feedback: 1,
      lastUpdated: '3 days ago'
    },
    {
      id: 5,
      title: 'Reduce Operational Costs',
      description: 'Optimize processes and reduce unnecessary expenditure',
      category: 'Operations',
      priority: 'low',
      status: 'on-track',
      progress: 92,
      target: 'Save ₹15L',
      current: '₹13.8L saved',
      deadline: '2024-12-31',
      owner: 'You',
      weightage: 10,
      milestones: [
        { title: 'Audit vendor contracts', status: 'completed', date: '2024-09-15' },
        { title: 'Renegotiate cloud costs', status: 'completed', date: '2024-10-10' },
        { title: 'Automate manual processes', status: 'completed', date: '2024-11-05' },
        { title: 'Achieve ₹15L savings', status: 'in-progress', date: '2024-12-31' },
      ],
      metrics: {
        startValue: '₹0L',
        targetValue: '₹15L',
        currentValue: '₹13.8L',
        growthRate: '92% achieved'
      },
      feedback: 0,
      lastUpdated: '1 week ago'
    },
    {
      id: 6,
      title: 'Improve Market Brand Awareness',
      description: 'Increase brand visibility and market presence',
      category: 'Marketing',
      priority: 'medium',
      status: 'at-risk',
      progress: 55,
      target: '100K Followers',
      current: '67K',
      deadline: '2024-12-31',
      owner: 'You',
      weightage: 10,
      milestones: [
        { title: 'Launch social media campaign', status: 'completed', date: '2024-10-01' },
        { title: 'Publish 50 blog posts', status: 'in-progress', date: '2024-11-30' },
        { title: 'Partner with 5 influencers', status: 'pending', date: '2024-12-15' },
        { title: 'Reach 100K followers', status: 'pending', date: '2024-12-31' },
      ],
      metrics: {
        startValue: '45K',
        targetValue: '100K',
        currentValue: '67K',
        growthRate: '+48.9%'
      },
      feedback: 2,
      lastUpdated: '2 days ago'
    },
    {
      id: 7,
      title: 'Complete Leadership Development Program',
      description: 'Enhance leadership skills through structured training',
      category: 'Personal Development',
      priority: 'low',
      status: 'on-track',
      progress: 75,
      target: '100% Completion',
      current: '75%',
      deadline: '2024-12-31',
      owner: 'You',
      weightage: 5,
      milestones: [
        { title: 'Complete module 1-3', status: 'completed', date: '2024-10-20' },
        { title: 'Attend leadership workshop', status: 'completed', date: '2024-11-05' },
        { title: 'Complete module 4-5', status: 'in-progress', date: '2024-11-30' },
        { title: 'Final certification', status: 'pending', date: '2024-12-31' },
      ],
      metrics: {
        startValue: '0%',
        targetValue: '100%',
        currentValue: '75%',
        growthRate: '75% complete'
      },
      feedback: 1,
      lastUpdated: '4 days ago'
    },
    {
      id: 8,
      title: 'Launch New Product Line',
      description: 'Successfully launch and establish new product in market',
      category: 'Product',
      priority: 'high',
      status: 'completed',
      progress: 100,
      target: 'Launch + 1000 Users',
      current: '1,247 users',
      deadline: '2024-11-30',
      owner: 'You',
      weightage: 0,
      milestones: [
        { title: 'Product development', status: 'completed', date: '2024-09-30' },
        { title: 'Beta testing', status: 'completed', date: '2024-10-15' },
        { title: 'Public launch', status: 'completed', date: '2024-11-01' },
        { title: 'Acquire 1000 users', status: 'completed', date: '2024-11-25' },
      ],
      metrics: {
        startValue: '0',
        targetValue: '1000',
        currentValue: '1,247',
        growthRate: '124.7% achieved'
      },
      feedback: 4,
      lastUpdated: '1 week ago'
    },
  ];

  const getStatusConfig = (status) => {
    const configs = {
      'on-track': {
        badge: 'bg-emerald-100 text-emerald-700',
        icon: CheckCircle,
        iconColor: 'text-emerald-600',
        text: 'On Track',
        borderColor: 'border-emerald-200'
      },
      'at-risk': {
        badge: 'bg-orange-100 text-orange-700',
        icon: AlertCircle,
        iconColor: 'text-orange-600',
        text: 'At Risk',
        borderColor: 'border-orange-200'
      },
      'completed': {
        badge: 'bg-blue-100 text-blue-700',
        icon: Trophy,
        iconColor: 'text-blue-600',
        text: 'Completed',
        borderColor: 'border-blue-200'
      }
    };
    return configs[status] || configs['on-track'];
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      'high': 'bg-red-100 text-red-700',
      'medium': 'bg-yellow-100 text-yellow-700',
      'low': 'bg-slate-100 text-slate-700'
    };
    return badges[priority] || badges.medium;
  };

  const filteredKRAs = kras.filter(kra => 
    selectedStatus === 'all' || kra.status === selectedStatus
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                My KRAs
              </h1>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-slate-600">Track your Key Result Areas and performance goals</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white cursor-pointer font-semibold"
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>{period.label}</option>
              ))}
            </select>
            <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300">
              <Plus className="w-5 h-5" />
              <span>Add KRA</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {performanceStats.map((stat, index) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;
            return (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.bgColor} w-12 h-12 rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  {stat.change && (
                    <span className={`flex items-center gap-1 text-xs font-semibold ${
                      stat.trend === 'up' ? 'text-emerald-600' : 'text-orange-600'
                    }`}>
                      <TrendIcon className="w-4 h-4" />
                      {stat.change}
                    </span>
                  )}
                </div>
                <p className="text-slate-600 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</p>
                {stat.subtext && <p className="text-xs text-slate-500">{stat.subtext}</p>}
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedStatus(filter.value)}
                className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                  selectedStatus === filter.value
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
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

        {/* KRAs List */}
        <div className="space-y-4">
          {filteredKRAs.map((kra) => {
            const statusConfig = getStatusConfig(kra.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div 
                key={kra.id}
                className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden hover:shadow-xl transition-all duration-300 ${statusConfig.borderColor}`}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-slate-800">{kra.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityBadge(kra.priority)}`}>
                          {kra.priority.toUpperCase()}
                        </span>
                        <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${statusConfig.badge}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig.text}
                        </span>
                      </div>
                      <p className="text-slate-600 mb-3">{kra.description}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {kra.category}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Due: {kra.deadline}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Percent className="w-4 h-4" />
                          Weightage: {kra.weightage}%
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                          <Eye className="w-5 h-5 text-slate-600" />
                        </button>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                          <Edit className="w-5 h-5 text-slate-600" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-500">Updated {kra.lastUpdated}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-slate-700">Progress</span>
                      <span className="text-2xl font-bold text-blue-600">{kra.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          kra.progress >= 90 ? 'bg-gradient-to-r from-emerald-500 to-teal-600' :
                          kra.progress >= 70 ? 'bg-gradient-to-r from-blue-500 to-indigo-600' :
                          kra.progress >= 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-600' :
                          'bg-gradient-to-r from-orange-500 to-red-600'
                        }`}
                        style={{ width: `${kra.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg p-3">
                      <p className="text-xs text-slate-600 mb-1">Target</p>
                      <p className="font-bold text-slate-800">{kra.target}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3">
                      <p className="text-xs text-slate-600 mb-1">Current</p>
                      <p className="font-bold text-blue-600">{kra.current}</p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-3">
                      <p className="text-xs text-slate-600 mb-1">Growth</p>
                      <p className="font-bold text-emerald-600">{kra.metrics.growthRate}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3">
                      <p className="text-xs text-slate-600 mb-1">Feedback</p>
                      <p className="font-bold text-purple-600 flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {kra.feedback} comments
                      </p>
                    </div>
                  </div>

                  {/* Milestones */}
                  <div>
                    <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <Flag className="w-5 h-5 text-blue-600" />
                      Key Milestones
                    </h4>
                    <div className="space-y-2">
                      {kra.milestones.map((milestone, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                            milestone.status === 'completed' ? 'bg-emerald-500' :
                            milestone.status === 'in-progress' ? 'bg-blue-500' :
                            'bg-slate-300'
                          }`}>
                            {milestone.status === 'completed' && <CheckCircle className="w-4 h-4 text-white" />}
                            {milestone.status === 'in-progress' && <Clock className="w-4 h-4 text-white" />}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-semibold ${
                              milestone.status === 'completed' ? 'text-slate-600 line-through' : 'text-slate-800'
                            }`}>
                              {milestone.title}
                            </p>
                            <p className="text-xs text-slate-500">{milestone.date}</p>
                          </div>
                          {milestone.status === 'in-progress' && (
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                              In Progress
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Progress Stripe */}
                <div className="h-2 bg-slate-100">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      kra.progress >= 90 ? 'bg-gradient-to-r from-emerald-500 to-teal-600' :
                      kra.progress >= 70 ? 'bg-gradient-to-r from-blue-500 to-indigo-600' :
                      kra.progress >= 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-600' :
                      'bg-gradient-to-r from-orange-500 to-red-600'
                    }`}
                    style={{ width: `${kra.progress}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}