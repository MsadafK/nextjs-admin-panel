'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText,
  Target,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  Calendar,
  BarChart3,
  PieChart,
  Users,
  Award,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Activity,
  Zap,
  Eye,
  Search,
  RefreshCw
} from 'lucide-react';

export default function KRAReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('quarter');

  const summaryStats = [
    {
      title: 'Total KRAs Reviewed',
      value: '156',
      change: '+24',
      trend: 'up',
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      subtitle: 'this quarter'
    },
    {
      title: 'Avg Achievement Rate',
      value: '84.5%',
      change: '+6.2%',
      trend: 'up',
      icon: Target,
      color: 'from-green-500 to-emerald-500',
      subtitle: 'across all teams'
    },
    {
      title: 'High Performers',
      value: '42',
      change: '+8',
      trend: 'up',
      icon: Award,
      color: 'from-purple-500 to-pink-500',
      subtitle: '> 90% achievement'
    },
    {
      title: 'Needs Improvement',
      value: '18',
      change: '-5',
      trend: 'down',
      icon: AlertTriangle,
      color: 'from-orange-500 to-red-500',
      subtitle: '< 70% achievement'
    }
  ];

  const departmentPerformance = [
    {
      department: 'Sales',
      totalKRAs: 32,
      completed: 28,
      avgScore: 92.5,
      improvement: 8.3,
      status: 'excellent',
      color: 'from-green-500 to-emerald-500'
    },
    {
      department: 'Marketing',
      totalKRAs: 28,
      completed: 24,
      avgScore: 88.2,
      improvement: 5.7,
      status: 'good',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      department: 'Product',
      totalKRAs: 35,
      completed: 30,
      avgScore: 85.8,
      improvement: 4.2,
      status: 'good',
      color: 'from-purple-500 to-pink-500'
    },
    {
      department: 'Engineering',
      totalKRAs: 42,
      completed: 36,
      avgScore: 82.4,
      improvement: 3.8,
      status: 'satisfactory',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      department: 'Operations',
      totalKRAs: 19,
      completed: 15,
      avgScore: 78.9,
      improvement: 2.1,
      status: 'needs-attention',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const achievementDistribution = [
    { range: '90-100%', count: 42, percentage: 27, color: 'from-green-500 to-emerald-500' },
    { range: '80-89%', count: 56, percentage: 36, color: 'from-blue-500 to-cyan-500' },
    { range: '70-79%', count: 40, percentage: 26, color: 'from-yellow-500 to-orange-500' },
    { range: '< 70%', count: 18, percentage: 11, color: 'from-red-500 to-pink-500' }
  ];

  const trendData = [
    { month: 'Jul', score: 78.5, kras: 48 },
    { month: 'Aug', score: 80.2, kras: 52 },
    { month: 'Sep', score: 82.8, kras: 54 },
    { month: 'Oct', score: 84.5, kras: 56 },
    { month: 'Nov', score: 83.9, kras: 55 },
    { month: 'Dec', score: 84.5, kras: 58 }
  ];

  const recentReports = [
    {
      id: 1,
      title: 'Q4 2025 Team Performance Report',
      type: 'Quarterly Review',
      date: '2025-10-28',
      teams: 5,
      kras: 156,
      status: 'completed',
      format: 'PDF'
    },
    {
      id: 2,
      title: 'October Monthly KRA Summary',
      type: 'Monthly Report',
      date: '2025-10-25',
      teams: 5,
      kras: 52,
      status: 'completed',
      format: 'Excel'
    },
    {
      id: 3,
      title: 'Sales Team Achievement Analysis',
      type: 'Department Report',
      date: '2025-10-20',
      teams: 1,
      kras: 32,
      status: 'completed',
      format: 'PDF'
    },
    {
      id: 4,
      title: 'Engineering Goals Progress Review',
      type: 'Department Report',
      date: '2025-10-15',
      teams: 1,
      kras: 42,
      status: 'completed',
      format: 'PDF'
    },
    {
      id: 5,
      title: 'Annual Performance Overview 2025',
      type: 'Annual Report',
      date: '2025-10-10',
      teams: 5,
      kras: 624,
      status: 'in-progress',
      format: 'PDF'
    }
  ];

  const keyInsights = [
    {
      title: 'Best Performing Team',
      value: 'Sales Team',
      metric: '92.5% avg score',
      icon: Award,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Most Improved',
      value: 'Marketing',
      metric: '+8.3% growth',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Completion Rate',
      value: '89.7%',
      metric: '140 of 156 KRAs',
      icon: CheckCircle2,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Avg Response Time',
      value: '2.3 days',
      metric: 'for reviews',
      icon: Clock,
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  const maxKras = Math.max(...trendData.map(d => d.kras));

  const getStatusColor = (status) => {
    const colors = {
      'completed': 'bg-green-100 text-green-700',
      'in-progress': 'bg-blue-100 text-blue-700',
      'pending': 'bg-yellow-100 text-yellow-700',
      'excellent': 'bg-green-100 text-green-700',
      'good': 'bg-blue-100 text-blue-700',
      'satisfactory': 'bg-yellow-100 text-yellow-700',
      'needs-attention': 'bg-orange-100 text-orange-700'
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
              <FileText size={32} />
              KRA Reports & Analytics
            </h1>
            <p className="text-slate-600 mt-1">Comprehensive performance reports and insights</p>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-all flex items-center gap-2 text-slate-700 hover:shadow-md">
              <Filter size={18} />
              <span>Filter</span>
            </button>
            <button className="px-4 py-2 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-all flex items-center gap-2 text-slate-700 hover:shadow-md">
              <RefreshCw size={18} />
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
              <Download size={18} />
              <span>Export All</span>
            </button>
          </div>
        </motion.div>

        {/* Period Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-indigo-600" />
              <span className="font-semibold text-slate-700">Report Period</span>
            </div>
            <div className="flex gap-2">
              {['week', 'month', 'quarter', 'year'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-all text-sm ${
                    selectedPeriod === period
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryStats.map((stat, index) => (
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
                  stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
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

        {/* Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Activity size={20} className="text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-800">Performance Trend</h2>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500" />
                <span className="text-slate-600">KRAs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                <span className="text-slate-600">Score %</span>
              </div>
            </div>
          </div>

          <div className="flex items-end justify-between gap-3 h-64 px-2">
            {trendData.map((data, index) => (
              <motion.div
                key={data.month}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ delay: 0.4 + index * 0.05, origin: 'bottom' }}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div className="w-full flex flex-col-reverse gap-1 h-48">
                  {/* KRAs Bar (Green) */}
                  <div className="relative w-full flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-green-500 to-emerald-500 rounded-t-lg transition-all group hover:from-green-600 hover:to-emerald-600"
                      style={{ height: `${(data.kras / maxKras) * 180}px` }}
                    >
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-700">
                        {data.kras}
                      </div>
                    </div>
                  </div>
                  
                  {/* Score Bar (Purple) - Stacked below */}
                  <div className="relative w-full flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-lg transition-all group hover:from-indigo-600 hover:to-purple-600"
                      style={{ height: `${(data.score / 100) * 100}px` }}
                    >
                      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-bold text-indigo-600">
                        {data.score}%
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm font-semibold text-slate-700 mt-4">{data.month}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Department Performance */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
          >
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 size={20} className="text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-800">Department Performance</h2>
            </div>

            <div className="space-y-4">
              {departmentPerformance.map((dept, index) => (
                <motion.div
                  key={dept.department}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-800">{dept.department}</h3>
                      <p className="text-xs text-slate-500">{dept.totalKRAs} KRAs • {dept.completed} completed</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-800">{dept.avgScore}%</p>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(dept.status)}`}>
                        {dept.status}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${dept.avgScore}%` }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                        className={`h-full bg-gradient-to-r ${dept.color} rounded-full`}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">Improvement</span>
                      <span className="font-semibold text-green-600">+{dept.improvement}%</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Achievement Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
          >
            <div className="flex items-center gap-2 mb-6">
              <PieChart size={20} className="text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-800">Achievement Distribution</h2>
            </div>

            <div className="space-y-4">
              {achievementDistribution.map((range, index) => (
                <div key={range.range} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">{range.range}</span>
                    <div className="text-right">
                      <span className="font-bold text-slate-800">{range.count} KRAs</span>
                      <span className="text-xs text-slate-500 ml-2">({range.percentage}%)</span>
                    </div>
                  </div>
                  <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${range.percentage}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                      className={`h-full bg-gradient-to-r ${range.color} rounded-full flex items-center justify-end pr-2`}
                    >
                      {range.percentage > 15 && (
                        <span className="text-xs font-bold text-white">{range.percentage}%</span>
                      )}
                    </motion.div>
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-slate-100 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-indigo-50 rounded-lg">
                    <p className="text-xs text-slate-600 mb-1">Total KRAs</p>
                    <p className="text-2xl font-bold text-indigo-600">156</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-slate-600 mb-1">Avg Score</p>
                    <p className="text-2xl font-bold text-green-600">84.5%</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Key Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {keyInsights.map((insight, index) => (
            <div
              key={insight.title}
              className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all"
            >
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${insight.color} mb-3`}>
                <insight.icon className="text-white" size={20} />
              </div>
              <p className="text-xs text-slate-600 mb-1">{insight.title}</p>
              <p className="text-xl font-bold text-slate-800 mb-1">{insight.value}</p>
              <p className="text-xs text-slate-500">{insight.metric}</p>
            </div>
          ))}
        </motion.div>

        {/* Recent Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={20} className="text-indigo-600" />
                <h2 className="text-xl font-bold text-slate-800">Generated Reports</h2>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search reports..."
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {recentReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                className="p-6 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
                      <FileText className="text-indigo-600" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800 mb-1">{report.title}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-slate-600 mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(report.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span>•</span>
                        <span>{report.teams} teams</span>
                        <span>•</span>
                        <span>{report.kras} KRAs</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                          {report.type}
                        </span>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                        <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                          {report.format}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-indigo-100 rounded-lg transition-colors text-indigo-600">
                      <Eye size={20} />
                    </button>
                    <button className="p-2 hover:bg-indigo-100 rounded-lg transition-colors text-indigo-600">
                      <Download size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Insights Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Zap size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">Performance Highlights</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-indigo-200 mb-1">Overall Improvement</p>
                  <p className="font-semibold">+6.2% from last quarter with consistent growth</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-indigo-200 mb-1">Top Achievement</p>
                  <p className="font-semibold">Sales Team leads with 92.5% average score</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-indigo-200 mb-1">Focus Area</p>
                  <p className="font-semibold">18 KRAs need attention for improvement</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}