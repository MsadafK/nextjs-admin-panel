'use client';

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users, Calendar, Download, Filter, ArrowUpRight, ArrowDownRight, BarChart3, LineChart } from 'lucide-react';

export default function SalesTrends() {
  const [timeRange, setTimeRange] = useState('7days');
  const [chartType, setChartType] = useState('line');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const salesData = {
    '7days': [
      { date: 'Mon', revenue: 12500, orders: 45, units: 234 },
      { date: 'Tue', revenue: 15200, orders: 52, units: 289 },
      { date: 'Wed', revenue: 13800, orders: 48, units: 256 },
      { date: 'Thu', revenue: 18900, orders: 67, units: 345 },
      { date: 'Fri', revenue: 21500, orders: 78, units: 412 },
      { date: 'Sat', revenue: 24300, orders: 89, units: 478 },
      { date: 'Sun', revenue: 19800, orders: 71, units: 389 },
    ],
    '30days': [
      { date: 'Week 1', revenue: 45000, orders: 180, units: 950 },
      { date: 'Week 2', revenue: 52000, orders: 210, units: 1100 },
      { date: 'Week 3', revenue: 48000, orders: 195, units: 1020 },
      { date: 'Week 4', revenue: 58000, orders: 235, units: 1240 },
    ],
    '90days': [
      { date: 'Month 1', revenue: 180000, orders: 720, units: 3800 },
      { date: 'Month 2', revenue: 205000, orders: 820, units: 4300 },
      { date: 'Month 3', revenue: 195000, orders: 780, units: 4100 },
    ],
  };

  const topProducts = [
    { name: 'Premium Headphones', sales: 2450, revenue: 245000, growth: 12.5, units: 850 },
    { name: 'Wireless Mouse', sales: 1890, revenue: 94500, growth: 8.3, units: 1890 },
    { name: 'Laptop Stand', sales: 1650, revenue: 82500, growth: -3.2, units: 1100 },
    { name: 'USB-C Hub', sales: 1420, revenue: 56800, growth: 15.7, units: 1420 },
    { name: 'Desk Lamp', sales: 1280, revenue: 51200, growth: 5.1, units: 1280 },
  ];

  const categories = [
    { name: 'Electronics', percentage: 35, revenue: 175000, color: 'bg-blue-500' },
    { name: 'Accessories', percentage: 28, revenue: 140000, color: 'bg-green-500' },
    { name: 'Furniture', percentage: 20, revenue: 100000, color: 'bg-purple-500' },
    { name: 'Office Supplies', percentage: 17, revenue: 85000, color: 'bg-orange-500' },
  ];

  const currentData = salesData[timeRange];
  const maxValue = Math.max(...currentData.map(d => d[selectedMetric]));

  const stats = [
    {
      title: 'Total Revenue',
      value: '$126,500',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'blue',
      description: 'vs last period'
    },
    {
      title: 'Total Orders',
      value: '450',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'green',
      description: 'vs last period'
    },
    {
      title: 'Units Sold',
      value: '2,403',
      change: '+15.3%',
      trend: 'up',
      icon: Package,
      color: 'purple',
      description: 'vs last period'
    },
    {
      title: 'Avg Order Value',
      value: '$281',
      change: '-3.2%',
      trend: 'down',
      icon: TrendingUp,
      color: 'orange',
      description: 'vs last period'
    },
  ];

  const timeRanges = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
  ];

  const metrics = [
    { value: 'revenue', label: 'Revenue', color: 'blue' },
    { value: 'orders', label: 'Orders', color: 'green' },
    { value: 'units', label: 'Units', color: 'purple' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Trends</h1>
              <p className="text-gray-600">Track and analyze your sales performance over time</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter size={20} />
                Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download size={20} />
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-600',
              green: 'bg-green-100 text-green-600',
              purple: 'bg-purple-100 text-purple-600',
              orange: 'bg-orange-100 text-orange-600',
            };
            
            return (
              <div key={index} className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                    <Icon size={24} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-semibold ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-sm text-gray-600 mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Sales Performance</h2>
            <div className="flex gap-3">
              <div className="flex gap-2">
                {timeRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setTimeRange(range.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      timeRange === range.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 border-l pl-3">
                <button
                  onClick={() => setChartType('line')}
                  className={`p-2 rounded-lg transition-colors ${
                    chartType === 'line'
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Line Chart"
                >
                  <LineChart size={20} />
                </button>
                <button
                  onClick={() => setChartType('bar')}
                  className={`p-2 rounded-lg transition-colors ${
                    chartType === 'bar'
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Bar Chart"
                >
                  <BarChart3 size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            {metrics.map((metric) => (
              <button
                key={metric.value}
                onClick={() => setSelectedMetric(metric.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                  selectedMetric === metric.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-3 h-3 rounded-full bg-${metric.color}-500`}></div>
                <span className="font-medium capitalize">{metric.label}</span>
              </button>
            ))}
          </div>

          <div className="h-80 relative">
            <div className="absolute left-0 top-0 bottom-8 w-16 flex flex-col justify-between text-xs text-gray-500">
              <span>${(maxValue * 1.2 / 1000).toFixed(0)}k</span>
              <span>${(maxValue * 0.8 / 1000).toFixed(0)}k</span>
              <span>${(maxValue * 0.4 / 1000).toFixed(0)}k</span>
              <span>$0</span>
            </div>

            <div className="ml-16 h-full flex items-end gap-2 pb-8 border-l-2 border-b-2 border-gray-200">
              {currentData.map((data, index) => {
                const height = (data[selectedMetric] / maxValue) * 100;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex items-end justify-center" style={{ height: '100%' }}>
                      {chartType === 'bar' ? (
                        <div
                          className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg hover:from-blue-700 hover:to-blue-500 transition-all cursor-pointer group relative"
                          style={{ height: `${height}%` }}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            ${data[selectedMetric].toLocaleString()}
                          </div>
                        </div>
                      ) : (
                        <div className="w-full relative" style={{ height: '100%' }}>
                          <div
                            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-lg hover:scale-125 transition-transform cursor-pointer group"
                            style={{ bottom: `${height}%` }}
                          >
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              ${data[selectedMetric].toLocaleString()}
                            </div>
                          </div>
                          {index > 0 && (
                            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                              <line
                                x1="0%"
                                y1={`${100 - (currentData[index - 1][selectedMetric] / maxValue) * 100}%`}
                                x2="100%"
                                y2={`${100 - height}%`}
                                stroke="#2563eb"
                                strokeWidth="2"
                              />
                            </svg>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <span className="text-xs text-gray-600 font-medium">{data.date}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Selling Products</h2>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold">#{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-gray-600">{product.units} units</span>
                      <span className="text-sm font-semibold text-gray-900">
                        ${product.revenue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-semibold ${
                    product.growth > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {product.growth > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {Math.abs(product.growth)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Sales by Category</h2>
            <div className="space-y-4">
              {categories.map((category, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{category.name}</span>
                    <span className="text-sm text-gray-600">${category.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${category.color} rounded-full transition-all duration-500`}
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                      {category.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Total Revenue</span>
                <span className="text-xl font-bold text-gray-900">
                  ${categories.reduce((sum, cat) => sum + cat.revenue, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}