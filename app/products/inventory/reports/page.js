'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle,
  Download,
  Calendar,
  Filter,
  Search,
  FileText,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

export default function InventoryReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const reportCards = [
    {
      title: 'Stock Turnover Rate',
      value: '8.5x',
      change: '+12%',
      trend: 'up',
      icon: Activity,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Out of Stock Items',
      value: '23',
      change: '-8 items',
      trend: 'down',
      icon: AlertTriangle,
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Slow Moving Items',
      value: '47',
      change: '+5 items',
      trend: 'up',
      icon: TrendingDown,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Fast Moving Items',
      value: '156',
      change: '+23 items',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const inventoryReports = [
    {
      id: 1,
      name: 'Monthly Inventory Valuation',
      category: 'Valuation',
      date: '2025-10-01',
      size: '2.4 MB',
      items: 1234,
      status: 'completed'
    },
    {
      id: 2,
      name: 'Stock Movement Analysis',
      category: 'Movement',
      date: '2025-10-15',
      size: '1.8 MB',
      items: 856,
      status: 'completed'
    },
    {
      id: 3,
      name: 'Dead Stock Report',
      category: 'Analysis',
      date: '2025-10-20',
      size: '956 KB',
      items: 45,
      status: 'completed'
    },
    {
      id: 4,
      name: 'Reorder Point Analysis',
      category: 'Planning',
      date: '2025-10-25',
      size: '1.2 MB',
      items: 234,
      status: 'processing'
    },
    {
      id: 5,
      name: 'ABC Analysis Report',
      category: 'Analysis',
      date: '2025-10-28',
      size: '3.1 MB',
      items: 1456,
      status: 'completed'
    }
  ];

  const categoryBreakdown = [
    { name: 'Electronics', percentage: 35, value: '$245,000', items: 456 },
    { name: 'Clothing', percentage: 28, value: '$196,000', items: 892 },
    { name: 'Home & Garden', percentage: 18, value: '$126,000', items: 234 },
    { name: 'Sports', percentage: 12, value: '$84,000', items: 178 },
    { name: 'Others', percentage: 7, value: '$49,000', items: 145 }
  ];

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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Inventory Reports
            </h1>
            <p className="text-slate-600 mt-1">Comprehensive inventory analysis and insights</p>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-all flex items-center gap-2 text-slate-700 hover:shadow-md">
              <Filter size={18} />
              <span>Filters</span>
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
              <Download size={18} />
              <span>Export All</span>
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-slate-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${card.color}`}>
                  <card.icon className="text-white" size={24} />
                </div>
                <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                  card.trend === 'up' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {card.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-1">{card.value}</h3>
              <p className="text-slate-600 text-sm">{card.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Period Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
        >
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={20} className="text-slate-600" />
            <span className="font-semibold text-slate-700">Report Period</span>
          </div>
          <div className="flex gap-2">
            {['week', 'month', 'quarter', 'year'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                  selectedPeriod === period
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Reports List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100"
          >
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800">Generated Reports</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {inventoryReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="p-6 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                        <FileText className="text-blue-600" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 mb-1">{report.name}</h3>
                        <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <Package size={14} />
                            {report.items} items
                          </span>
                          <span>•</span>
                          <span>{report.date}</span>
                          <span>•</span>
                          <span>{report.size}</span>
                        </div>
                        <div className="mt-2">
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            {report.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {report.status === 'completed' ? (
                        <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600">
                          <Download size={20} />
                        </button>
                      ) : (
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                          Processing
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Category Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <PieChart size={20} className="text-slate-600" />
                <h2 className="text-xl font-bold text-slate-800">Category Breakdown</h2>
              </div>
              
              <div className="space-y-4">
                {categoryBreakdown.map((category, index) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-slate-700">{category.name}</span>
                      <span className="text-slate-600">{category.percentage}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${category.percentage}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>{category.items} items</span>
                      <span className="font-semibold text-slate-700">{category.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
              <BarChart3 size={32} className="mb-4 opacity-80" />
              <h3 className="text-xl font-bold mb-2">Generate Custom Report</h3>
              <p className="text-blue-100 text-sm mb-4">
                Create detailed reports based on your specific requirements
              </p>
              <button className="w-full px-4 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-md transition-all">
                Start Building
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}