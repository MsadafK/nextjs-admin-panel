'use client';
import { useState } from 'react';
import { Trophy, TrendingUp, Star, DollarSign, ShoppingCart, Package, Award, Crown, Zap, ArrowUpRight, ArrowDownRight, Eye, Filter, Calendar, Medal, Sparkles } from 'lucide-react';

export default function BestSellersPage() {
  const [timeRange, setTimeRange] = useState('month');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const timeRanges = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
  ];

  const stats = [
    { label: 'Top Seller Revenue', value: '₹12.4L', icon: DollarSign, color: 'from-yellow-500 to-orange-600', bgColor: 'bg-yellow-50', textColor: 'text-yellow-600' },
    { label: 'Total Units Sold', value: '8,945', icon: ShoppingCart, color: 'from-emerald-500 to-teal-600', bgColor: 'bg-emerald-50', textColor: 'text-emerald-600' },
    { label: 'Best Seller', value: 'Smart Watch Pro', icon: Trophy, color: 'from-purple-500 to-pink-600', bgColor: 'bg-purple-50', textColor: 'text-purple-600' },
    { label: 'Avg. Rating', value: '4.7⭐', icon: Star, color: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
  ];

  const bestSellers = [
    {
      rank: 1,
      name: 'Smart Watch Pro Max',
      category: 'Electronics',
      price: 12999,
      unitsSold: 1847,
      revenue: 2401353,
      rating: 4.8,
      reviews: 1234,
      trend: '+34%',
      trendDirection: 'up',
      image: '⌚',
      badge: 'crown',
      growth: 34
    },
    {
      rank: 2,
      name: 'Wireless Noise-Cancelling Headphones',
      category: 'Electronics',
      price: 4599,
      unitsSold: 1654,
      revenue: 760446,
      rating: 4.7,
      reviews: 987,
      trend: '+28%',
      trendDirection: 'up',
      image: '🎧',
      badge: 'gold',
      growth: 28
    },
    {
      rank: 3,
      name: 'Ultra HD Action Camera',
      category: 'Electronics',
      price: 8999,
      unitsSold: 1234,
      revenue: 1110366,
      rating: 4.6,
      reviews: 756,
      trend: '+23%',
      trendDirection: 'up',
      image: '📷',
      badge: 'silver',
      growth: 23
    },
    {
      rank: 4,
      name: 'Premium Running Shoes',
      category: 'Sports',
      price: 3499,
      unitsSold: 1189,
      revenue: 416111,
      rating: 4.5,
      reviews: 892,
      trend: '+19%',
      trendDirection: 'up',
      image: '👟',
      badge: 'bronze',
      growth: 19
    },
    {
      rank: 5,
      name: 'Designer Backpack',
      category: 'Fashion',
      price: 2299,
      unitsSold: 1098,
      revenue: 252402,
      rating: 4.6,
      reviews: 645,
      trend: '+15%',
      trendDirection: 'up',
      image: '🎒',
      badge: 'none',
      growth: 15
    },
    {
      rank: 6,
      name: 'Bluetooth Speaker Pro',
      category: 'Electronics',
      price: 2999,
      unitsSold: 987,
      revenue: 296013,
      rating: 4.7,
      reviews: 534,
      trend: '+12%',
      trendDirection: 'up',
      image: '🔊',
      badge: 'none',
      growth: 12
    },
    {
      rank: 7,
      name: 'Gaming Mouse RGB',
      category: 'Electronics',
      price: 1899,
      unitsSold: 876,
      revenue: 166324,
      rating: 4.4,
      reviews: 423,
      trend: '+8%',
      trendDirection: 'up',
      image: '🖱️',
      badge: 'none',
      growth: 8
    },
    {
      rank: 8,
      name: 'Fitness Yoga Mat',
      category: 'Sports',
      price: 1299,
      unitsSold: 834,
      revenue: 108366,
      rating: 4.5,
      reviews: 389,
      trend: '+6%',
      trendDirection: 'up',
      image: '🧘',
      badge: 'none',
      growth: 6
    },
    {
      rank: 9,
      name: 'Portable Power Bank',
      category: 'Electronics',
      price: 1599,
      unitsSold: 789,
      revenue: 126211,
      rating: 4.3,
      reviews: 312,
      trend: '+4%',
      trendDirection: 'up',
      image: '🔋',
      badge: 'none',
      growth: 4
    },
    {
      rank: 10,
      name: 'Premium Water Bottle',
      category: 'Sports',
      price: 799,
      unitsSold: 756,
      revenue: 60404,
      rating: 4.4,
      reviews: 267,
      trend: '-2%',
      trendDirection: 'down',
      image: '🧴',
      badge: 'none',
      growth: -2
    },
  ];

  const categoryPerformance = [
    { category: 'Electronics', sales: 6587, revenue: '₹48.9L', growth: '+24%', icon: '💻' },
    { category: 'Sports', sales: 2879, revenue: '₹18.2L', growth: '+16%', icon: '⚽' },
    { category: 'Fashion', sales: 2134, revenue: '₹15.6L', growth: '+12%', icon: '👔' },
    { category: 'Home & Living', sales: 1456, revenue: '₹12.3L', growth: '+9%', icon: '🏠' },
  ];

  const getRankBadge = (rank, badge) => {
    if (badge === 'crown') {
      return <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500" />;
    } else if (badge === 'gold') {
      return <Medal className="w-6 h-6 text-yellow-500" />;
    } else if (badge === 'silver') {
      return <Medal className="w-6 h-6 text-slate-400" />;
    } else if (badge === 'bronze') {
      return <Medal className="w-6 h-6 text-orange-600" />;
    }
    return null;
  };

  const getRankStyle = (rank) => {
    if (rank === 1) return 'from-yellow-400 to-orange-500';
    if (rank === 2) return 'from-slate-300 to-slate-400';
    if (rank === 3) return 'from-orange-400 to-orange-600';
    return 'from-slate-200 to-slate-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-yellow-50 to-orange-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Best Sellers
              </h1>
              <Sparkles className="w-8 h-8 text-yellow-500 fill-yellow-500" />
            </div>
            <p className="text-slate-600">Top performing products and revenue leaders</p>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-slate-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-yellow-500 focus:outline-none transition-colors bg-white cursor-pointer font-semibold"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
                <div className={`${stat.bgColor} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <p className="text-slate-600 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Top 3 Winners Podium */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-2">
            <Trophy className="w-7 h-7 text-yellow-500" />
            Top 3 Champions
          </h2>
          <div className="flex items-end justify-center gap-6">
            {/* Second Place */}
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-br from-slate-300 to-slate-400 w-24 h-24 rounded-full flex items-center justify-center mb-4 shadow-xl border-4 border-white">
                <span className="text-5xl">{bestSellers[1].image}</span>
              </div>
              <Medal className="w-8 h-8 text-slate-400 mb-2" />
              <div className="bg-gradient-to-b from-slate-300 to-slate-400 rounded-t-2xl p-6 min-w-[200px] text-center">
                <p className="text-6xl font-bold text-white mb-2">2</p>
                <p className="text-white font-bold text-lg mb-1 line-clamp-2">{bestSellers[1].name}</p>
                <p className="text-white/80 text-sm">{bestSellers[1].unitsSold} units</p>
                <p className="text-white font-bold text-xl mt-2">₹{(bestSellers[1].revenue / 100000).toFixed(1)}L</p>
              </div>
            </div>

            {/* First Place */}
            <div className="flex flex-col items-center">
              <Crown className="w-12 h-12 text-yellow-500 fill-yellow-500 mb-2 animate-bounce" />
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 w-28 h-28 rounded-full flex items-center justify-center mb-4 shadow-2xl border-4 border-white">
                <span className="text-6xl">{bestSellers[0].image}</span>
              </div>
              <div className="bg-gradient-to-b from-yellow-400 to-orange-500 rounded-t-2xl p-8 min-w-[220px] text-center">
                <p className="text-7xl font-bold text-white mb-2">1</p>
                <p className="text-white font-bold text-xl mb-1 line-clamp-2">{bestSellers[0].name}</p>
                <p className="text-white/90 text-sm">{bestSellers[0].unitsSold} units</p>
                <p className="text-white font-bold text-2xl mt-3">₹{(bestSellers[0].revenue / 100000).toFixed(1)}L</p>
              </div>
            </div>

            {/* Third Place */}
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-br from-orange-400 to-orange-600 w-24 h-24 rounded-full flex items-center justify-center mb-4 shadow-xl border-4 border-white">
                <span className="text-5xl">{bestSellers[2].image}</span>
              </div>
              <Medal className="w-8 h-8 text-orange-600 mb-2" />
              <div className="bg-gradient-to-b from-orange-400 to-orange-600 rounded-t-2xl p-6 min-w-[200px] text-center">
                <p className="text-6xl font-bold text-white mb-2">3</p>
                <p className="text-white font-bold text-lg mb-1 line-clamp-2">{bestSellers[2].name}</p>
                <p className="text-white/80 text-sm">{bestSellers[2].unitsSold} units</p>
                <p className="text-white font-bold text-xl mt-2">₹{(bestSellers[2].revenue / 100000).toFixed(1)}L</p>
              </div>
            </div>
          </div>
        </div>

        {/* Complete Rankings Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Award className="w-7 h-7 text-yellow-500" />
              Complete Rankings
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b-2 border-slate-200">
                  <th className="text-left py-4 px-6 text-slate-700 font-semibold">Rank</th>
                  <th className="text-left py-4 px-6 text-slate-700 font-semibold">Product</th>
                  <th className="text-left py-4 px-6 text-slate-700 font-semibold">Category</th>
                  <th className="text-left py-4 px-6 text-slate-700 font-semibold">Price</th>
                  <th className="text-left py-4 px-6 text-slate-700 font-semibold">Units Sold</th>
                  <th className="text-left py-4 px-6 text-slate-700 font-semibold">Revenue</th>
                  <th className="text-left py-4 px-6 text-slate-700 font-semibold">Rating</th>
                  <th className="text-left py-4 px-6 text-slate-700 font-semibold">Growth</th>
                </tr>
              </thead>
              <tbody>
                {bestSellers.map((product, index) => {
                  const TrendIcon = product.trendDirection === 'up' ? ArrowUpRight : ArrowDownRight;
                  return (
                    <tr 
                      key={product.rank} 
                      className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                        product.rank <= 3 ? 'bg-yellow-50/30' : ''
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRankStyle(product.rank)} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                            {product.rank}
                          </div>
                          {getRankBadge(product.rank, product.badge)}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl flex items-center justify-center text-3xl">
                            {product.image}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{product.name}</p>
                            <p className="text-sm text-slate-500">{product.reviews} reviews</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-700">{product.category}</td>
                      <td className="py-4 px-6 font-bold text-slate-800">₹{product.price.toLocaleString()}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="w-4 h-4 text-slate-400" />
                          <span className="font-semibold text-slate-800">{product.unitsSold.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-bold text-yellow-600">₹{(product.revenue / 100000).toFixed(2)}L</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold text-slate-800">{product.rating}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-semibold text-sm ${
                          product.trendDirection === 'up' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          <TrendIcon className="w-4 h-4" />
                          {product.trend}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Package className="w-7 h-7 text-yellow-500" />
            Category Performance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categoryPerformance.map((cat, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-50 to-yellow-50 rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{cat.icon}</span>
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {cat.growth}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">{cat.category}</h3>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-yellow-600">{cat.revenue}</p>
                  <p className="text-sm text-slate-600">{cat.sales.toLocaleString()} units sold</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}