'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  ShoppingCart,
  DollarSign,
  Users,
  Package,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Star,
  Clock,
  Target,
  Activity,
  PieChart,
  Zap
} from 'lucide-react';

export default function CategoryAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const overviewStats = [
    {
      title: 'Total Revenue',
      value: '$1.08M',
      change: '+18.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      subtitle: 'vs last period'
    },
    {
      title: 'Total Orders',
      value: '8,456',
      change: '+12.5%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'from-blue-500 to-cyan-500',
      subtitle: '234 today'
    },
    {
      title: 'Category Views',
      value: '124.5K',
      change: '+24.8%',
      trend: 'up',
      icon: Eye,
      color: 'from-purple-500 to-pink-500',
      subtitle: '3.2K avg/day'
    },
    {
      title: 'Conversion Rate',
      value: '6.8%',
      change: '-2.3%',
      trend: 'down',
      icon: Target,
      color: 'from-orange-500 to-red-500',
      subtitle: 'needs attention'
    }
  ];

  const categoryPerformance = [
    {
      id: 1,
      name: 'Electronics',
      icon: '💻',
      revenue: '$245,000',
      orders: 1823,
      views: 45678,
      conversionRate: 7.2,
      growth: 18.5,
      color: 'from-blue-500 to-cyan-500',
      products: 456,
      avgOrderValue: '$134.50'
    },
    {
      id: 2,
      name: 'Clothing & Fashion',
      icon: '👕',
      revenue: '$196,000',
      orders: 2456,
      views: 38920,
      conversionRate: 8.9,
      growth: 23.4,
      color: 'from-purple-500 to-pink-500',
      products: 892,
      avgOrderValue: '$79.80'
    },
    {
      id: 3,
      name: 'Home & Garden',
      icon: '🏡',
      revenue: '$126,000',
      orders: 1234,
      views: 29845,
      conversionRate: 5.4,
      growth: 8.2,
      color: 'from-green-500 to-emerald-500',
      products: 234,
      avgOrderValue: '$102.10'
    },
    {
      id: 4,
      name: 'Sports & Fitness',
      icon: '⚽',
      revenue: '$84,000',
      orders: 892,
      views: 22456,
      conversionRate: 6.1,
      growth: 12.8,
      color: 'from-orange-500 to-red-500',
      products: 178,
      avgOrderValue: '$94.20'
    },
    {
      id: 5,
      name: 'Beauty & Health',
      icon: '💄',
      revenue: '$158,000',
      orders: 2089,
      views: 41234,
      conversionRate: 7.8,
      growth: 15.6,
      color: 'from-pink-500 to-rose-500',
      products: 345,
      avgOrderValue: '$75.60'
    }
  ];

  const topProducts = [
    { name: 'Wireless Headphones Pro', category: 'Electronics', sales: 1234, revenue: '$98,720' },
    { name: 'Premium Yoga Mat', category: 'Sports', sales: 892, revenue: '$35,680' },
    { name: 'Designer Jacket', category: 'Fashion', sales: 756, revenue: '$94,500' },
    { name: 'Smart Watch Series 5', category: 'Electronics', sales: 678, revenue: '$135,600' },
    { name: 'Organic Face Serum', category: 'Beauty', sales: 567, revenue: '$28,350' }
  ];

  const timeMetrics = [
    { time: '00:00', views: 1200, orders: 45 },
    { time: '04:00', views: 800, orders: 28 },
    { time: '08:00', views: 3200, orders: 156 },
    { time: '12:00', views: 4500, orders: 234 },
    { time: '16:00', views: 5200, orders: 289 },
    { time: '20:00', views: 3800, orders: 198 },
    { time: '23:59', views: 2100, orders: 87 }
  ];

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
              <BarChart3 size={32} />
              Category Analytics
            </h1>
            <p className="text-slate-600 mt-1">Comprehensive performance insights and metrics</p>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-all flex items-center gap-2 text-slate-700 hover:shadow-md">
              <Filter size={18} />
              <span>Filters</span>
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
              <Download size={18} />
              <span>Export Report</span>
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
              <Calendar size={20} className="text-slate-600" />
              <span className="font-semibold text-slate-700">Time Period</span>
            </div>
            <div className="flex gap-2">
              {['today', 'week', 'month', 'quarter', 'year'].map((period) => (
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

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {overviewStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-slate-100 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="text-white" size={24} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</h3>
              <p className="text-slate-600 text-sm mb-1">{stat.title}</p>
              <p className="text-xs text-slate-500">{stat.subtitle}</p>
            </motion.div>
          ))}
        </div>

        {/* Category Performance Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieChart size={20} className="text-indigo-600" />
                <h2 className="text-xl font-bold text-slate-800">Category Performance</h2>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-slate-700">
                  All Categories
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Revenue</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Orders</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Views</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Conv. Rate</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Growth</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Avg Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categoryPerformance.map((category, index) => (
                  <motion.tr
                    key={category.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${category.color} text-xl`}>
                          {category.icon}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{category.name}</p>
                          <p className="text-xs text-slate-500">{category.products} products</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{category.revenue}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{category.orders.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{category.views.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-[60px]">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                            style={{ width: `${category.conversionRate * 10}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-slate-700">{category.conversionRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                        <TrendingUp size={14} />
                        {category.growth}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{category.avgOrderValue}</p>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
          >
            <div className="flex items-center gap-2 mb-6">
              <Star size={20} className="text-yellow-500 fill-yellow-500" />
              <h2 className="text-xl font-bold text-slate-800">Top Performing Products</h2>
            </div>

            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800 text-sm">{product.name}</p>
                      <p className="text-xs text-slate-500">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800">{product.revenue}</p>
                    <p className="text-xs text-slate-500">{product.sales} sales</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Activity Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
          >
            <div className="flex items-center gap-2 mb-6">
              <Activity size={20} className="text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-800">Activity Timeline</h2>
            </div>

            <div className="space-y-4">
              {timeMetrics.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-600">
                      <Clock size={14} />
                      {metric.time}
                    </span>
                    <div className="flex gap-4 text-xs">
                      <span className="text-purple-600 font-semibold">{metric.views} views</span>
                      <span className="text-green-600 font-semibold">{metric.orders} orders</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 h-2 bg-purple-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                        style={{ width: `${(metric.views / 5200) * 100}%` }}
                      />
                    </div>
                    <div className="flex-1 h-2 bg-green-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                        style={{ width: `${(metric.orders / 289) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Insights Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Zap size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">AI-Powered Insights</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-indigo-200 mb-1">Best Performing</p>
                  <p className="font-semibold">Clothing & Fashion is showing exceptional growth (+23.4%)</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-indigo-200 mb-1">Opportunity</p>
                  <p className="font-semibold">Conversion rate in Electronics can be improved by 15%</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-indigo-200 mb-1">Peak Hours</p>
                  <p className="font-semibold">Maximum activity between 12:00 PM - 8:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}