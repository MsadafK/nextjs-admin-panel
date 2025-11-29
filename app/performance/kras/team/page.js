'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users,
  Target,
  TrendingUp,
  TrendingDown,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter,
  Download,
  Plus,
  Search,
  BarChart3,
  Calendar,
  Star,
  Zap,
  Activity,
  ChevronRight,
  CircleDot,
  Flag
} from 'lucide-react';

export default function TeamKRAsPage() {
  const [selectedQuarter, setSelectedQuarter] = useState('Q4 2025');
  const [selectedTeam, setSelectedTeam] = useState('all');

  const overallStats = [
    {
      title: 'Overall Achievement',
      value: '87%',
      change: '+5.2%',
      trend: 'up',
      icon: Target,
      color: 'from-green-500 to-emerald-500',
      subtitle: 'vs last quarter'
    },
    {
      title: 'Active KRAs',
      value: '42',
      change: '+8',
      trend: 'up',
      icon: Activity,
      color: 'from-blue-500 to-cyan-500',
      subtitle: '12 in progress'
    },
    {
      title: 'Completed Goals',
      value: '36',
      change: '+12',
      trend: 'up',
      icon: CheckCircle2,
      color: 'from-purple-500 to-pink-500',
      subtitle: '85.7% success rate'
    },
    {
      title: 'At Risk',
      value: '6',
      change: '-3',
      trend: 'down',
      icon: AlertCircle,
      color: 'from-orange-500 to-red-500',
      subtitle: 'needs attention'
    }
  ];

  const teams = [
    {
      id: 1,
      name: 'Sales Team',
      lead: 'Sarah Johnson',
      members: 12,
      kras: 8,
      completed: 6,
      inProgress: 2,
      achievement: 92,
      status: 'excellent',
      color: 'from-green-500 to-emerald-500',
      icon: '💰'
    },
    {
      id: 2,
      name: 'Marketing Team',
      lead: 'Michael Chen',
      members: 10,
      kras: 7,
      completed: 5,
      inProgress: 2,
      achievement: 88,
      status: 'good',
      color: 'from-blue-500 to-cyan-500',
      icon: '📢'
    },
    {
      id: 3,
      name: 'Product Team',
      lead: 'Emily Davis',
      members: 15,
      kras: 10,
      completed: 7,
      inProgress: 3,
      achievement: 85,
      status: 'good',
      color: 'from-purple-500 to-pink-500',
      icon: '🚀'
    },
    {
      id: 4,
      name: 'Engineering Team',
      lead: 'David Wilson',
      members: 18,
      kras: 12,
      completed: 9,
      inProgress: 3,
      achievement: 82,
      status: 'satisfactory',
      color: 'from-indigo-500 to-purple-500',
      icon: '⚙️'
    },
    {
      id: 5,
      name: 'Customer Support',
      lead: 'Jessica Brown',
      members: 8,
      kras: 5,
      completed: 4,
      inProgress: 1,
      achievement: 78,
      status: 'satisfactory',
      color: 'from-orange-500 to-red-500',
      icon: '🎧'
    }
  ];

  const recentKRAs = [
    {
      id: 1,
      title: 'Increase Monthly Recurring Revenue',
      team: 'Sales Team',
      owner: 'Sarah Johnson',
      target: '$500K',
      current: '$460K',
      progress: 92,
      status: 'on-track',
      dueDate: '2025-12-31',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Launch New Product Features',
      team: 'Product Team',
      owner: 'Emily Davis',
      target: '5 features',
      current: '4 features',
      progress: 80,
      status: 'on-track',
      dueDate: '2025-12-15',
      priority: 'high'
    },
    {
      id: 3,
      title: 'Reduce Customer Churn Rate',
      team: 'Customer Support',
      owner: 'Jessica Brown',
      target: '< 5%',
      current: '6.2%',
      progress: 65,
      status: 'at-risk',
      dueDate: '2025-12-31',
      priority: 'critical'
    },
    {
      id: 4,
      title: 'Improve Website Traffic',
      team: 'Marketing Team',
      owner: 'Michael Chen',
      target: '100K visits',
      current: '88K visits',
      progress: 88,
      status: 'on-track',
      dueDate: '2025-12-20',
      priority: 'medium'
    },
    {
      id: 5,
      title: 'Code Quality Score',
      team: 'Engineering Team',
      owner: 'David Wilson',
      target: '> 90%',
      current: '87%',
      progress: 75,
      status: 'needs-attention',
      dueDate: '2025-12-31',
      priority: 'medium'
    }
  ];

  const topPerformers = [
    { name: 'Sarah Johnson', team: 'Sales', achievement: 95, kras: 8 },
    { name: 'Michael Chen', team: 'Marketing', achievement: 92, kras: 7 },
    { name: 'Emily Davis', team: 'Product', achievement: 90, kras: 10 },
    { name: 'David Wilson', team: 'Engineering', achievement: 88, kras: 12 },
    { name: 'Jessica Brown', team: 'Support', achievement: 85, kras: 5 }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'on-track': 'bg-green-100 text-green-700',
      'at-risk': 'bg-orange-100 text-orange-700',
      'needs-attention': 'bg-yellow-100 text-yellow-700',
      'completed': 'bg-blue-100 text-blue-700',
      'excellent': 'bg-green-100 text-green-700',
      'good': 'bg-blue-100 text-blue-700',
      'satisfactory': 'bg-yellow-100 text-yellow-700'
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'critical': 'bg-red-100 text-red-700',
      'high': 'bg-orange-100 text-orange-700',
      'medium': 'bg-yellow-100 text-yellow-700',
      'low': 'bg-slate-100 text-slate-700'
    };
    return colors[priority] || 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-3">
              <Users size={32} />
              Team KRAs Dashboard
            </h1>
            <p className="text-slate-600 mt-1">Track and manage team key result areas</p>
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
            <button className="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
              <Plus size={18} />
              <span>Add KRA</span>
            </button>
          </div>
        </motion.div>

        {/* Quarter Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-teal-600" />
              <span className="font-semibold text-slate-700">Review Period</span>
            </div>
            <div className="flex gap-2">
              {['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'].map((quarter) => (
                <button
                  key={quarter}
                  onClick={() => setSelectedQuarter(quarter)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                    selectedQuarter === quarter
                      ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {quarter}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {overallStats.map((stat, index) => (
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
                <div className={`flex items-center gap-1 text-sm font-bold px-2.5 py-1 rounded-full ${
                  stat.trend === 'up' && !stat.title.includes('Risk') ? 'bg-green-100 text-green-700' : 
                  stat.trend === 'down' && stat.title.includes('Risk') ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {stat.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</h3>
              <p className="text-slate-600 text-sm mb-1">{stat.title}</p>
              <p className="text-xs text-slate-500">{stat.subtitle}</p>
            </motion.div>
          ))}
        </div>

        {/* Teams Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 size={20} className="text-teal-600" />
              <h2 className="text-xl font-bold text-slate-800">Team Performance Overview</h2>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search teams..."
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-5 border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${team.color} text-2xl`}>
                      {team.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{team.name}</h3>
                      <p className="text-xs text-slate-500">{team.members} members</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(team.status)}`}>
                    {team.status}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Lead:</span>
                    <span className="font-semibold text-slate-800">{team.lead}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Total KRAs:</span>
                    <span className="font-semibold text-slate-800">{team.kras}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Completed:</span>
                    <span className="font-semibold text-green-600">{team.completed}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">In Progress:</span>
                    <span className="font-semibold text-blue-600">{team.inProgress}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Achievement</span>
                    <span className="font-bold text-slate-800">{team.achievement}%</span>
                  </div>
                  <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${team.achievement}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                      className={`h-full bg-gradient-to-r ${team.color} rounded-full`}
                    />
                  </div>
                </div>

                <button className="w-full mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-sm font-medium transition-all flex items-center justify-center gap-2 group-hover:bg-teal-50 group-hover:text-teal-700">
                  View Details
                  <ChevronRight size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent KRAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target size={20} className="text-teal-600" />
                <h2 className="text-xl font-bold text-slate-800">Active KRAs</h2>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-slate-700">
                  All Status
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">KRA Title</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Team</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Owner</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Progress</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Priority</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentKRAs.map((kra, index) => (
                  <motion.tr
                    key={kra.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-800">{kra.title}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Target: {kra.target} • Current: {kra.current}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-700">{kra.team}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-800">{kra.owner}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden max-w-[100px]">
                          <div 
                            className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"
                            style={{ width: `${kra.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-slate-700">{kra.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(kra.status)}`}>
                        {kra.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(kra.priority)}`}>
                        {kra.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <Clock size={14} />
                        {new Date(kra.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Performers */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
          >
            <div className="flex items-center gap-2 mb-6">
              <Award size={20} className="text-yellow-500 fill-yellow-500" />
              <h2 className="text-xl font-bold text-slate-800">Top Performers</h2>
            </div>

            <div className="space-y-3">
              {topPerformers.map((performer, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-teal-600 to-cyan-600 text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">{performer.name}</p>
                    <p className="text-xs text-slate-500">{performer.team} • {performer.kras} KRAs</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-teal-600">{performer.achievement}%</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={12} 
                          className={i < Math.floor(performer.achievement / 20) ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300'}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap size={24} />
              <h2 className="text-xl font-bold">Quick Insights</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-teal-100">On Track KRAs</span>
                  <span className="text-2xl font-bold">28</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '67%' }} />
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-teal-100">Needs Attention</span>
                  <span className="text-2xl font-bold">8</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: '19%' }} />
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-teal-100">At Risk</span>
                  <span className="text-2xl font-bold">6</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-red-400 rounded-full" style={{ width: '14%' }} />
                </div>
              </div>

              <div className="pt-4 border-t border-white/20">
                <p className="text-sm text-teal-100 mb-2">Average Team Achievement</p>
                <p className="text-4xl font-bold">85%</p>
                <p className="text-sm text-teal-200 mt-1">+3% from last quarter</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}