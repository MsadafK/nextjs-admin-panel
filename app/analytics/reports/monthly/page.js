'use client';

import React, { useState } from 'react';
import { Calendar, Download, FileText, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, Eye, ArrowUpRight, ArrowDownRight, ChevronLeft, ChevronRight, CheckCircle, AlertCircle, XCircle, Printer, Mail, Share2 } from 'lucide-react';

export default function MonthlyReports() {
  const [selectedMonth, setSelectedMonth] = useState('2024-10');
  const [reportType, setReportType] = useState('summary');

  const months = [
    { value: '2024-10', label: 'October 2024' },
    { value: '2024-09', label: 'September 2024' },
    { value: '2024-08', label: 'August 2024' },
    { value: '2024-07', label: 'July 2024' },
    { value: '2024-06', label: 'June 2024' },
    { value: '2024-05', label: 'May 2024' },
  ];

  const reportTypes = [
    { value: 'summary', label: 'Executive Summary' },
    { value: 'sales', label: 'Sales Report' },
    { value: 'users', label: 'User Analytics' },
    { value: 'products', label: 'Product Performance' },
  ];

  const monthlyStats = {
    revenue: {
      current: 458900,
      previous: 398500,
      target: 500000,
      growth: 15.2
    },
    orders: {
      current: 3245,
      previous: 2890,
      target: 3500,
      growth: 12.3
    },
    users: {
      current: 15680,
      previous: 14230,
      target: 18000,
      growth: 10.2
    },
    avgOrderValue: {
      current: 141.5,
      previous: 137.9,
      target: 145,
      growth: 2.6
    }
  };

  const weeklyBreakdown = [
    { week: 'Week 1', revenue: 98500, orders: 720, users: 3450, avgOrder: 136.8 },
    { week: 'Week 2', revenue: 115200, orders: 830, users: 3890, avgOrder: 138.8 },
    { week: 'Week 3', revenue: 122800, orders: 875, users: 4120, avgOrder: 140.3 },
    { week: 'Week 4', revenue: 122400, orders: 820, users: 4220, avgOrder: 149.3 },
  ];

  const topCategories = [
    { name: 'Electronics', revenue: 165300, orders: 1245, growth: 18.5, percentage: 36 },
    { name: 'Fashion', revenue: 137200, orders: 1685, growth: 12.8, percentage: 30 },
    { name: 'Home & Garden', revenue: 91800, orders: 890, growth: 8.2, percentage: 20 },
    { name: 'Sports', revenue: 64600, orders: 425, growth: -3.5, percentage: 14 },
  ];

  const performanceMetrics = [
    { metric: 'Customer Satisfaction', value: '4.7/5', status: 'excellent', change: '+0.3' },
    { metric: 'Order Fulfillment Rate', value: '98.5%', status: 'excellent', change: '+2.1%' },
    { metric: 'Return Rate', value: '2.8%', status: 'good', change: '-0.5%' },
    { metric: 'Customer Retention', value: '87.3%', status: 'excellent', change: '+4.2%' },
  ];

  const topProducts = [
    { name: 'Wireless Earbuds Pro', sales: 856, revenue: 42800, growth: 25.3 },
    { name: 'Smart Watch Ultra', sales: 624, revenue: 93600, growth: 18.7 },
    { name: 'Laptop Stand Premium', sales: 512, revenue: 25600, growth: 12.4 },
    { name: 'USB-C Hub 7-in-1', sales: 445, revenue: 17800, growth: 8.9 },
    { name: 'Mechanical Keyboard', sales: 389, revenue: 38900, growth: 15.2 },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-muted text-foreground border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'good':
        return <AlertCircle size={16} className="text-blue-600" />;
      case 'warning':
        return <XCircle size={16} className="text-yellow-600" />;
      default:
        return null;
    }
  };

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="page-container space-y-6">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground mb-2">Monthly Reports</h1>
              <p className="text-muted-foreground">Comprehensive monthly business performance analysis</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors">
                <Printer size={20} />
                Print
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors">
                <Mail size={20} />
                Email
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors">
                <Share2 size={20} />
                Share
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg hover:opacity-90 transition-colors">
                <Download size={20} />
                Export PDF
              </button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-card border border-border rounded-lg shadow-card p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-muted-foreground" />
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring"
                >
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 border-l pl-4">
                <FileText size={20} className="text-muted-foreground" />
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring"
                >
                  {reportTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="p-2 border border-border rounded-lg hover:bg-muted">
                <ChevronLeft size={20} />
              </button>
              <button className="p-2 border border-border rounded-lg hover:bg-muted">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics with Goals */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-card border border-border rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-muted text-foreground rounded-lg">
                <DollarSign size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-semibold ${
                monthlyStats.revenue.growth > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {monthlyStats.revenue.growth > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {monthlyStats.revenue.growth}%
              </div>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">Total Revenue</h3>
            <p className="text-lg font-semibold tracking-tight text-foreground mb-3">
              ${monthlyStats.revenue.current.toLocaleString()}
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Target: ${monthlyStats.revenue.target.toLocaleString()}</span>
                <span className="font-semibold">{calculateProgress(monthlyStats.revenue.current, monthlyStats.revenue.target).toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${calculateProgress(monthlyStats.revenue.current, monthlyStats.revenue.target)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-muted text-foreground rounded-lg">
                <ShoppingCart size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-semibold ${
                monthlyStats.orders.growth > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {monthlyStats.orders.growth > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {monthlyStats.orders.growth}%
              </div>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">Total Orders</h3>
            <p className="text-lg font-semibold tracking-tight text-foreground mb-3">
              {monthlyStats.orders.current.toLocaleString()}
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Target: {monthlyStats.orders.target.toLocaleString()}</span>
                <span className="font-semibold">{calculateProgress(monthlyStats.orders.current, monthlyStats.orders.target).toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-600 rounded-full transition-all duration-500"
                  style={{ width: `${calculateProgress(monthlyStats.orders.current, monthlyStats.orders.target)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-muted text-foreground rounded-lg">
                <Users size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-semibold ${
                monthlyStats.users.growth > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {monthlyStats.users.growth > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {monthlyStats.users.growth}%
              </div>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">Active Users</h3>
            <p className="text-lg font-semibold tracking-tight text-foreground mb-3">
              {monthlyStats.users.current.toLocaleString()}
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Target: {monthlyStats.users.target.toLocaleString()}</span>
                <span className="font-semibold">{calculateProgress(monthlyStats.users.current, monthlyStats.users.target).toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${calculateProgress(monthlyStats.users.current, monthlyStats.users.target)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-muted text-foreground rounded-lg">
                <TrendingUp size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-semibold ${
                monthlyStats.avgOrderValue.growth > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {monthlyStats.avgOrderValue.growth > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {monthlyStats.avgOrderValue.growth}%
              </div>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">Avg Order Value</h3>
            <p className="text-lg font-semibold tracking-tight text-foreground mb-3">
              ${monthlyStats.avgOrderValue.current}
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Target: ${monthlyStats.avgOrderValue.target}</span>
                <span className="font-semibold">{calculateProgress(monthlyStats.avgOrderValue.current, monthlyStats.avgOrderValue.target).toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-600 rounded-full transition-all duration-500"
                  style={{ width: `${calculateProgress(monthlyStats.avgOrderValue.current, monthlyStats.avgOrderValue.target)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Breakdown */}
        <div className="bg-card border border-border rounded-lg shadow-card p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Weekly Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase">Week</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-foreground uppercase">Revenue</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-foreground uppercase">Orders</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-foreground uppercase">Users</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-foreground uppercase">Avg Order</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-foreground uppercase">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {weeklyBreakdown.map((week, index) => (
                  <tr key={index} className="hover:bg-muted transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-foreground">{week.week}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-semibold text-foreground">${week.revenue.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-foreground">{week.orders.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-foreground">{week.users.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-foreground">${week.avgOrder}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                            style={{ width: `${(week.revenue / 130000) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-muted-foreground w-12 text-right">
                          {((week.revenue / 130000) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Categories */}
          <div className="bg-card border border-border rounded-lg shadow-card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Top Categories</h2>
            <div className="space-y-4">
              {topCategories.map((category, index) => (
                <div key={index} className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-foreground">{category.name}</h3>
                    <div className={`flex items-center gap-1 text-sm font-semibold ${
                      category.growth > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {category.growth > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      {Math.abs(category.growth)}%
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                    <span>${category.revenue.toLocaleString()} revenue</span>
                    <span>{category.orders} orders</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-card border border-border rounded-lg shadow-card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Performance Metrics</h2>
            <div className="space-y-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(metric.status)}
                    <div>
                      <p className="text-sm text-muted-foreground">{metric.metric}</p>
                      <p className="text-base font-semibold text-foreground">{metric.value}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(metric.status)}`}>
                      {metric.status.toUpperCase()}
                    </span>
                    <p className="text-sm text-green-600 font-semibold mt-1">{metric.change}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-card border border-border rounded-lg shadow-card p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Top Selling Products</h2>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-muted rounded-lg hover:bg-muted transition-colors">
                <div className="flex-shrink-0 w-10 h-10 bg-foreground rounded-lg flex items-center justify-center">
                  <span className="text-background font-bold">#{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">${product.revenue.toLocaleString()}</p>
                  <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                    <TrendingUp size={14} />
                    {product.growth}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}