'use client';
import { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Package, Download, Calendar, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function YearlyReportsPage() {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMetric, setSelectedMetric] = useState('all');

  const years = ['2024', '2023', '2022', '2021'];
  const metrics = [
    { value: 'all', label: 'All Metrics' },
    { value: 'revenue', label: 'Revenue' },
    { value: 'users', label: 'Users' },
    { value: 'orders', label: 'Orders' },
  ];

  const yearlyStats = [
    {
      title: 'Total Revenue',
      value: '₹1,24,56,789',
      change: '+23.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      title: 'New Users',
      value: '45,678',
      change: '+18.2%',
      trend: 'up',
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Orders',
      value: '23,456',
      change: '+15.8%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Products Sold',
      value: '1,89,234',
      change: '-2.4%',
      trend: 'down',
      icon: Package,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  const monthlyBreakdown = [
    { month: 'January', revenue: '₹9,45,000', orders: 1890, users: 3456, growth: '+12%' },
    { month: 'February', revenue: '₹8,67,000', orders: 1756, users: 3123, growth: '+8%' },
    { month: 'March', revenue: '₹11,23,000', orders: 2234, users: 4012, growth: '+18%' },
    { month: 'April', revenue: '₹10,89,000', orders: 2145, users: 3890, growth: '+15%' },
    { month: 'May', revenue: '₹12,34,000', orders: 2456, users: 4234, growth: '+22%' },
    { month: 'June', revenue: '₹10,56,000', orders: 2098, users: 3765, growth: '+14%' },
    { month: 'July', revenue: '₹11,78,000', orders: 2312, users: 4123, growth: '+19%' },
    { month: 'August', revenue: '₹9,89,000', orders: 1967, users: 3567, growth: '+10%' },
    { month: 'September', revenue: '₹10,23,000', orders: 2034, users: 3698, growth: '+13%' },
    { month: 'October', revenue: '₹11,45,000', orders: 2267, users: 4089, growth: '+17%' },
    { month: 'November', revenue: '₹13,56,000', orders: 2678, users: 4567, growth: '+25%' },
    { month: 'December', revenue: '₹14,51,000', orders: 2819, users: 4798, growth: '+28%' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Yearly Reports
            </h1>
            <p className="text-slate-600 mt-2">Comprehensive annual performance overview</p>
          </div>
          <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
            <Download className="w-5 h-5" />
            <span>Export Report</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="pl-10 pr-8 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors appearance-none cursor-pointer"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="pl-10 pr-8 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors appearance-none cursor-pointer"
            >
              {metrics.map(metric => (
                <option key={metric.value} value={metric.value}>{metric.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {yearlyStats.map((stat, index) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.bgColor} p-3 rounded-xl`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <span className={`flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-full ${
                    stat.trend === 'up' 
                      ? 'bg-emerald-100 text-emerald-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    <TrendIcon className="w-4 h-4" />
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-slate-600 text-sm font-medium mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Monthly Breakdown */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Monthly Breakdown - {selectedYear}</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-4 px-4 text-slate-600 font-semibold">Month</th>
                  <th className="text-left py-4 px-4 text-slate-600 font-semibold">Revenue</th>
                  <th className="text-left py-4 px-4 text-slate-600 font-semibold">Orders</th>
                  <th className="text-left py-4 px-4 text-slate-600 font-semibold">New Users</th>
                  <th className="text-left py-4 px-4 text-slate-600 font-semibold">Growth</th>
                </tr>
              </thead>
              <tbody>
                {monthlyBreakdown.map((month, index) => (
                  <tr 
                    key={index} 
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-4 px-4 font-medium text-slate-800">{month.month}</td>
                    <td className="py-4 px-4 text-slate-700">{month.revenue}</td>
                    <td className="py-4 px-4 text-slate-700">{month.orders.toLocaleString()}</td>
                    <td className="py-4 px-4 text-slate-700">{month.users.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-sm font-semibold">
                        <TrendingUp className="w-4 h-4" />
                        {month.growth}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
          <h2 className="text-2xl font-bold mb-4">Year {selectedYear} Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-blue-100 mb-2">Best Performing Month</p>
              <p className="text-3xl font-bold">December</p>
            </div>
            <div>
              <p className="text-blue-100 mb-2">Average Monthly Revenue</p>
              <p className="text-3xl font-bold">₹10,38,066</p>
            </div>
            <div>
              <p className="text-blue-100 mb-2">Year-over-Year Growth</p>
              <p className="text-3xl font-bold">+23.5%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}