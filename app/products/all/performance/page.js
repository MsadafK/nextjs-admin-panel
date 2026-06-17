'use client';
import { useState } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Eye, ShoppingCart, Heart, Star, DollarSign, Package, Users, ArrowUpRight, ArrowDownRight, Filter, Calendar, Target, Zap, AlertCircle, CheckCircle, Clock, Percent } from 'lucide-react';

export default function ProductPerformancePage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [performanceFilter, setPerformanceFilter] = useState('all');

  const periods = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
    { value: 'year', label: 'This Year' },
  ];

  const performanceFilters = [
    { value: 'all', label: 'All Products' },
    { value: 'top', label: 'Top Performers' },
    { value: 'declining', label: 'Declining' },
    { value: 'steady', label: 'Steady Growth' },
  ];

  const overallMetrics = [
    { label: 'Avg Conversion Rate', value: '3.8%', change: '+0.4%', trend: 'up', icon: Target, color: 'from-emerald-500 to-teal-600', bgColor: 'bg-muted', textColor: 'text-emerald-600' },
    { label: 'Avg Views per Product', value: '1,247', change: '+12%', trend: 'up', icon: Eye, color: 'from-blue-500 to-indigo-600', bgColor: 'bg-muted', textColor: 'text-blue-600' },
    { label: 'Total Revenue', value: '₹67.8L', change: '+18%', trend: 'up', icon: DollarSign, color: 'from-purple-500 to-pink-600', bgColor: 'bg-muted', textColor: 'text-purple-600' },
    { label: 'Return Rate', value: '2.3%', change: '-0.5%', trend: 'down', icon: AlertCircle, color: 'from-orange-500 to-red-600', bgColor: 'bg-muted', textColor: 'text-orange-600' },
  ];

  const products = [
    {
      id: 1,
      name: 'Smart Watch Pro Max',
      category: 'Electronics',
      image: '⌚',
      views: 12847,
      clicks: 3421,
      addToCart: 1247,
      purchases: 487,
      revenue: 631413,
      conversionRate: 3.8,
      rating: 4.8,
      reviews: 1234,
      returnRate: 1.2,
      trend: 'up',
      growthRate: 24,
      performance: 'excellent',
      wishlist: 892
    },
    {
      id: 2,
      name: 'Wireless Headphones Ultra',
      category: 'Electronics',
      image: '🎧',
      views: 10234,
      clicks: 2876,
      addToCart: 1034,
      purchases: 392,
      revenue: 180208,
      conversionRate: 3.5,
      rating: 4.7,
      reviews: 987,
      returnRate: 1.8,
      trend: 'up',
      growthRate: 18,
      performance: 'excellent',
      wishlist: 756
    },
    {
      id: 3,
      name: 'Premium Running Shoes',
      category: 'Sports',
      image: '👟',
      views: 8934,
      clicks: 2145,
      addToCart: 789,
      purchases: 312,
      revenue: 109188,
      conversionRate: 3.2,
      rating: 4.6,
      reviews: 634,
      returnRate: 3.5,
      trend: 'up',
      growthRate: 12,
      performance: 'good',
      wishlist: 567
    },
    {
      id: 4,
      name: 'Designer Backpack',
      category: 'Fashion',
      image: '🎒',
      views: 7823,
      clicks: 1876,
      addToCart: 645,
      purchases: 234,
      revenue: 53766,
      conversionRate: 2.8,
      rating: 4.5,
      reviews: 456,
      returnRate: 2.1,
      trend: 'steady',
      growthRate: 5,
      performance: 'average',
      wishlist: 423
    },
    {
      id: 5,
      name: 'Bluetooth Speaker Mini',
      category: 'Electronics',
      image: '🔊',
      views: 6754,
      clicks: 1543,
      addToCart: 512,
      purchases: 187,
      revenue: 46813,
      conversionRate: 2.5,
      rating: 4.4,
      reviews: 389,
      returnRate: 2.8,
      trend: 'down',
      growthRate: -3,
      performance: 'needs-attention',
      wishlist: 312
    },
    {
      id: 6,
      name: 'Yoga Mat Premium',
      category: 'Sports',
      image: '🧘',
      views: 5892,
      clicks: 1234,
      addToCart: 456,
      purchases: 167,
      revenue: 21691,
      conversionRate: 2.6,
      rating: 4.3,
      reviews: 298,
      returnRate: 1.5,
      trend: 'steady',
      growthRate: 7,
      performance: 'average',
      wishlist: 267
    },
  ];

  const performanceCategories = [
    { name: 'Excellent', count: 2, color: 'emerald', icon: CheckCircle, description: 'Top 15% performers' },
    { name: 'Good', count: 1, color: 'blue', icon: TrendingUp, description: 'Above average' },
    { name: 'Average', count: 2, color: 'yellow', icon: Clock, description: 'Meeting targets' },
    { name: 'Needs Attention', count: 1, color: 'red', icon: AlertCircle, description: 'Below expectations' },
  ];

  const getPerformanceBadge = (performance) => {
    const badges = {
      'excellent': 'bg-emerald-100 text-emerald-700',
      'good': 'bg-blue-100 text-blue-700',
      'average': 'bg-yellow-100 text-yellow-700',
      'needs-attention': 'bg-red-100 text-red-700',
    };
    return badges[performance] || badges.average;
  };

  const getPerformanceText = (performance) => {
    const texts = {
      'excellent': 'Excellent',
      'good': 'Good',
      'average': 'Average',
      'needs-attention': 'Needs Attention',
    };
    return texts[performance] || 'Average';
  };

  return (
    <div className="page-container space-y-6">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground mb-2">
              Product Performance
            </h1>
            <p className="text-muted-foreground">Detailed analytics and performance metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-3 border-2 border-border rounded-xl focus:border-indigo-500 focus:outline-none transition-colors bg-card cursor-pointer font-semibold"
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>{period.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Overall Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {overallMetrics.map((metric, index) => {
            const Icon = metric.icon;
            const TrendIcon = metric.trend === 'up' ? ArrowUpRight : ArrowDownRight;
            return (
              <div key={index} className="bg-card border border-border rounded-lg shadow-card hover:shadow-dropdown transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${metric.bgColor} w-12 h-12 rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${metric.textColor}`} />
                  </div>
                  <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                    metric.trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    <TrendIcon className="w-3 h-3" />
                    {metric.change}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mb-1">{metric.label}</p>
                <p className="text-lg sm:text-xl font-semibold tracking-tight text-foreground">{metric.value}</p>
              </div>
            );
          })}
        </div>

        {/* Performance Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {performanceCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div key={index} className={`bg-card rounded-lg p-6 shadow-card border-2 border-${category.color}-200 hover:shadow-dropdown transition-all duration-300`}>
                <div className={`bg-${category.color}-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 text-${category.color}-600`} />
                </div>
                <h3 className="font-bold text-foreground text-lg mb-1">{category.name}</h3>
                <p className="text-lg sm:text-xl font-semibold tracking-tight text-foreground mb-2">{category.count}</p>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-lg shadow-card">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select
                value={performanceFilter}
                onChange={(e) => setPerformanceFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-border rounded-xl focus:border-indigo-500 focus:outline-none transition-colors bg-card cursor-pointer"
              >
                {performanceFilters.map(filter => (
                  <option key={filter.value} value={filter.value}>{filter.label}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border-2 border-border rounded-xl focus:border-indigo-500 focus:outline-none transition-colors bg-card cursor-pointer min-w-[200px]"
              >
                <option value="all">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="sports">Sports</option>
                <option value="fashion">Fashion</option>
              </select>
            </div>
          </div>
        </div>

        {/* Performance Table */}
        <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
              <BarChart3 className="w-7 h-7 text-indigo-600" />
              Detailed Performance Metrics
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b-2 border-border">
                  <th className="text-left py-4 px-6 text-foreground font-semibold">Product</th>
                  <th className="text-left py-4 px-6 text-foreground font-semibold">Views</th>
                  <th className="text-left py-4 px-6 text-foreground font-semibold">Cart Adds</th>
                  <th className="text-left py-4 px-6 text-foreground font-semibold">Purchases</th>
                  <th className="text-left py-4 px-6 text-foreground font-semibold">Conv. Rate</th>
                  <th className="text-left py-4 px-6 text-foreground font-semibold">Revenue</th>
                  <th className="text-left py-4 px-6 text-foreground font-semibold">Rating</th>
                  <th className="text-left py-4 px-6 text-foreground font-semibold">Performance</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const TrendIcon = product.trend === 'up' ? TrendingUp : product.trend === 'down' ? TrendingDown : TrendingUp;
                  return (
                    <tr key={product.id} className="border-b border-border hover:bg-muted transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center text-3xl">
                            {product.image}
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold text-foreground">{product.views.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold text-foreground">{product.addToCart.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold text-foreground">{product.purchases}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Percent className="w-4 h-4 text-muted-foreground" />
                          <span className="font-bold text-indigo-600">{product.conversionRate}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-bold text-purple-600">₹{(product.revenue / 100000).toFixed(2)}L</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold text-foreground">{product.rating}</span>
                          <span className="text-xs text-muted-foreground">({product.reviews})</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPerformanceBadge(product.performance)}`}>
                            {getPerformanceText(product.performance)}
                          </span>
                          <TrendIcon className={`w-4 h-4 ${
                            product.trend === 'up' ? 'text-emerald-600' : 
                            product.trend === 'down' ? 'text-red-600' : 
                            'text-muted-foreground'
                          }`} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Cards View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {products.slice(0, 2).map((product) => (
            <div key={product.id} className="bg-card border border-border rounded-lg shadow-card">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center text-4xl">
                    {product.image}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPerformanceBadge(product.performance)}`}>
                  {getPerformanceText(product.performance)}
                </span>
              </div>

              {/* Funnel Metrics */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Views to Cart</span>
                    <span className="font-semibold text-foreground">{((product.addToCart / product.views) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                      style={{ width: `${(product.addToCart / product.views) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Cart to Purchase</span>
                    <span className="font-semibold text-foreground">{((product.purchases / product.addToCart) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"
                      style={{ width: `${(product.purchases / product.addToCart) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
                <div className="text-center">
                  <p className="text-muted-foreground text-xs mb-1">Wishlist</p>
                  <div className="flex items-center justify-center gap-1">
                    <Heart className="w-4 h-4 text-pink-500" />
                    <p className="font-bold text-foreground">{product.wishlist}</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground text-xs mb-1">Return Rate</p>
                  <p className="font-bold text-foreground">{product.returnRate}%</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground text-xs mb-1">Growth</p>
                  <div className="flex items-center justify-center gap-1">
                    <TrendingUp className={`w-4 h-4 ${product.growthRate > 0 ? 'text-emerald-600' : 'text-red-600'}`} />
                    <p className="font-bold text-foreground">{product.growthRate}%</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}