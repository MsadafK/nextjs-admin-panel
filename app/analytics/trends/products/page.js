'use client';

import React, { useState } from 'react';
import { Package, TrendingUp, TrendingDown, ShoppingCart, DollarSign, Star, Eye, Heart, AlertCircle, Download, Filter, ArrowUpRight, ArrowDownRight, BarChart3, RefreshCw } from 'lucide-react';

export default function ProductTrends() {
  const [timeRange, setTimeRange] = useState('7days');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('revenue');

  const productData = {
    '7days': [
      { date: 'Mon', views: 8500, sales: 245, revenue: 12500, addToCart: 1200 },
      { date: 'Tue', views: 9200, sales: 278, revenue: 15200, addToCart: 1380 },
      { date: 'Wed', views: 8800, sales: 256, revenue: 13800, addToCart: 1290 },
      { date: 'Thu', views: 11200, sales: 345, revenue: 18900, addToCart: 1650 },
      { date: 'Fri', views: 12800, sales: 412, revenue: 21500, addToCart: 1890 },
      { date: 'Sat', views: 14500, sales: 478, revenue: 24300, addToCart: 2100 },
      { date: 'Sun', views: 11800, sales: 389, revenue: 19800, addToCart: 1750 },
    ],
    '30days': [
      { date: 'Week 1', views: 35000, sales: 950, revenue: 45000, addToCart: 4800 },
      { date: 'Week 2', views: 42000, sales: 1100, revenue: 52000, addToCart: 5600 },
      { date: 'Week 3', views: 38000, sales: 1020, revenue: 48000, addToCart: 5200 },
      { date: 'Week 4', views: 48000, sales: 1240, revenue: 58000, addToCart: 6300 },
    ],
    '90days': [
      { date: 'Month 1', views: 165000, sales: 3800, revenue: 180000, addToCart: 21000 },
      { date: 'Month 2', views: 195000, sales: 4300, revenue: 205000, addToCart: 24500 },
      { date: 'Month 3', views: 185000, sales: 4100, revenue: 195000, addToCart: 23200 },
    ],
  };

  const trendingProducts = [
    { 
      id: 1, 
      name: 'Wireless Earbuds Pro', 
      category: 'Electronics',
      sales: 2450, 
      revenue: 122500, 
      growth: 45.2, 
      views: 18500,
      rating: 4.8,
      stock: 450,
      trend: 'hot'
    },
    { 
      id: 2, 
      name: 'Smart Watch Ultra', 
      category: 'Wearables',
      sales: 1890, 
      revenue: 283500, 
      growth: 32.8, 
      views: 15200,
      rating: 4.6,
      stock: 280,
      trend: 'hot'
    },
    { 
      id: 3, 
      name: 'Laptop Stand Premium', 
      category: 'Accessories',
      sales: 1650, 
      revenue: 82500, 
      growth: 18.5, 
      views: 12800,
      rating: 4.7,
      stock: 820,
      trend: 'rising'
    },
    { 
      id: 4, 
      name: 'USB-C Hub 7-in-1', 
      category: 'Accessories',
      sales: 1420, 
      revenue: 56800, 
      growth: -5.3, 
      views: 11200,
      rating: 4.5,
      stock: 1200,
      trend: 'falling'
    },
    { 
      id: 5, 
      name: 'Mechanical Keyboard RGB', 
      category: 'Peripherals',
      sales: 1280, 
      revenue: 128000, 
      growth: 25.7, 
      views: 10500,
      rating: 4.9,
      stock: 340,
      trend: 'rising'
    },
  ];

  const categories = [
    { name: 'Electronics', products: 245, sales: 8920, revenue: 445000, growth: 22.5, color: 'bg-blue-500' },
    { name: 'Accessories', products: 380, sales: 6740, revenue: 168500, growth: 15.8, color: 'bg-green-500' },
    { name: 'Wearables', products: 156, sales: 4560, revenue: 342000, growth: 28.3, color: 'bg-purple-500' },
    { name: 'Peripherals', products: 198, sales: 3890, revenue: 194500, growth: 12.7, color: 'bg-orange-500' },
  ];

  const lowStockProducts = [
    { name: 'Wireless Mouse Pro', stock: 12, reorderLevel: 50, status: 'critical' },
    { name: 'USB Cable Type-C', stock: 28, reorderLevel: 100, status: 'low' },
    { name: 'Phone Stand Adjustable', stock: 45, reorderLevel: 80, status: 'low' },
  ];

  const currentData = productData[timeRange];
  const maxValue = Math.max(...currentData.map(d => d.revenue));

  const stats = [
    {
      title: 'Total Products',
      value: '979',
      change: '+8.2%',
      trend: 'up',
      icon: Package,
      color: 'blue',
      description: 'Active listings'
    },
    {
      title: 'Total Views',
      value: '76.9K',
      change: '+15.3%',
      trend: 'up',
      icon: Eye,
      color: 'green',
      description: 'Last 7 days'
    },
    {
      title: 'Conversion Rate',
      value: '3.8%',
      change: '+0.5%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'purple',
      description: 'View to sale'
    },
    {
      title: 'Avg Product Value',
      value: '$67',
      change: '-2.1%',
      trend: 'down',
      icon: DollarSign,
      color: 'orange',
      description: 'Per item'
    },
  ];

  const timeRanges = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
  ];

  const getTrendBadge = (trend) => {
    switch (trend) {
      case 'hot':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">🔥 Hot</span>;
      case 'rising':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">📈 Rising</span>;
      case 'falling':
        return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">📉 Falling</span>;
      default:
        return null;
    }
  };

  const getStockStatus = (status) => {
    switch (status) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'low':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Trends</h1>
              <p className="text-gray-600">Track product performance and inventory insights</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter size={20} />
                Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <RefreshCw size={20} />
                Refresh
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
            <h2 className="text-xl font-semibold text-gray-900">Product Performance</h2>
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
          </div>

          <div className="h-80 relative">
            <div className="absolute left-0 top-0 bottom-8 w-16 flex flex-col justify-between text-xs text-gray-500">
              <span>${(maxValue * 1.2 / 1000).toFixed(0)}k</span>
              <span>${(maxValue * 0.8 / 1000).toFixed(0)}k</span>
              <span>${(maxValue * 0.4 / 1000).toFixed(0)}k</span>
              <span>$0</span>
            </div>

            <div className="ml-16 h-full flex items-end gap-1 pb-8 border-l-2 border-b-2 border-gray-200">
              {currentData.map((data, index) => {
                const height = (data.revenue / maxValue) * 100;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex items-end justify-center" style={{ height: '100%' }}>
                      <div
                        className="w-full bg-gradient-to-t from-blue-600 via-blue-500 to-blue-400 rounded-t-lg hover:from-blue-700 hover:via-blue-600 hover:to-blue-500 transition-all cursor-pointer group relative"
                        style={{ height: `${height}%` }}
                      >
                        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          <div className="font-semibold mb-1">Revenue: ${data.revenue.toLocaleString()}</div>
                          <div>Sales: {data.sales}</div>
                          <div>Views: {data.views.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 font-medium">{data.date}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Trending Products</h2>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="revenue">Sort by Revenue</option>
                <option value="sales">Sort by Sales</option>
                <option value="growth">Sort by Growth</option>
                <option value="rating">Sort by Rating</option>
              </select>
            </div>
            <div className="space-y-4">
              {trendingProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Package className="text-white" size={32} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                      {getTrendBadge(product.trend)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                        {product.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={14} />
                        {product.views.toLocaleString()} views
                      </span>
                      <span className="flex items-center gap-1">
                        <ShoppingCart size={14} />
                        {product.sales} sales
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                        {product.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        Stock: {product.stock} units
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      ${product.revenue.toLocaleString()}
                    </span>
                    <div className={`flex items-center gap-1 text-sm font-semibold ${
                      product.growth > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {product.growth > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      {Math.abs(product.growth)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Low Stock Alert</h2>
              <div className="space-y-3">
                {lowStockProducts.map((product, index) => (
                  <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2 mb-2">
                      <AlertCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          Only {product.stock} units left
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStockStatus(product.status)}`}>
                        {product.status.toUpperCase()}
                      </span>
                      <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                        Reorder →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All Alerts →
              </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                  <Package size={20} />
                  <span className="font-medium">Add New Product</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                  <RefreshCw size={20} />
                  <span className="font-medium">Bulk Update Stock</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                  <BarChart3 size={20} />
                  <span className="font-medium">View Full Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Category Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="p-5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Products</span>
                    <span className="font-semibold">{category.products}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sales</span>
                    <span className="font-semibold">{category.sales.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Revenue</span>
                    <span className="font-semibold">${category.revenue.toLocaleString()}</span>
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${
                  category.growth > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {category.growth > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {category.growth}% growth
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}