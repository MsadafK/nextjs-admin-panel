'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar,
  DollarSign,
  ShoppingCart,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  Users,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  Zap,
  Award,
  LineChart
} from 'lucide-react';

export default function MonthlySalesPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  
  const monthlyStats = [
    {
      title: 'Monthly Revenue',
      value: '$486,234',
      change: '+23.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      subtitle: 'vs last month',
      target: 92,
      lastMonth: '$395,120'
    },
    {
      title: 'Total Orders',
      value: '5,847',
      change: '+18.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'from-blue-500 to-cyan-500',
      subtitle: '195 avg/day',
      target: 87,
      lastMonth: '4,945'
    },
    {
      title: 'Avg Order Value',
      value: '$83.15',
      change: '+4.5%',
      trend: 'up',
      icon: CreditCard,
      color: 'from-purple-500 to-pink-500',
      subtitle: 'vs $79.58',
      target: 78,
      lastMonth: '$79.58'
    },
    {
      title: 'New Customers',
      value: '1,248',
      change: '+12.8%',
      trend: 'up',
      icon: Users,
      color: 'from-orange-500 to-red-500',
      subtitle: '42 avg/day',
      target: 85,
      lastMonth: '1,106'
    }
  ];

  const dailyTrends = [
    { day: '1', sales: 12450, orders: 145 },
    { day: '2', sales: 14230, orders: 167 },
    { day: '3', sales: 15680, orders: 178 },
    { day: '4', sales: 13920, orders: 156 },
    { day: '5', sales: 16540, orders: 189 },
    { day: '6', sales: 18920, orders: 215 },
    { day: '7', sales: 19870, orders: 227 },
    { day: '8', sales: 14560, orders: 168 },
    { day: '9', sales: 15340, orders: 175 },
    { day: '10', sales: 17230, orders: 198 },
    { day: '11', sales: 16890, orders: 192 },
    { day: '12', sales: 18450, orders: 211 },
    { day: '13', sales: 20120, orders: 234 },
    { day: '14', sales: 21340, orders: 245 },
    { day: '15', sales: 17650, orders: 203 },
    { day: '16', sales: 16230, orders: 186 },
    { day: '17', sales: 18920, orders: 216 },
    { day: '18', sales: 19560, orders: 224 },
    { day: '19', sales: 20890, orders: 239 },
    { day: '20', sales: 22340, orders: 256 },
    { day: '21', sales: 23120, orders: 265 },
    { day: '22', sales: 18760, orders: 215 },
    { day: '23', sales: 17340, orders: 199 },
    { day: '24', sales: 19450, orders: 223 },
    { day: '25', sales: 20670, orders: 237 },
    { day: '26', sales: 21890, orders: 251 },
    { day: '27', sales: 22560, orders: 259 },
    { day: '28', sales: 23450, orders: 269 },
    { day: '29', sales: 19890, orders: 228 },
    { day: '30', sales: 18230, orders: 209 }
  ];

  const weeklyComparison = [
    { week: 'Week 1', sales: 98720, orders: 1123, growth: 15.2, avg: 14103 },
    { week: 'Week 2', sales: 123560, orders: 1415, growth: 18.7, avg: 17651 },
    { week: 'Week 3', sales: 134890, orders: 1542, growth: 22.4, avg: 19270 },
    { week: 'Week 4', sales: 129064, orders: 1767, growth: 20.8, avg: 18438 }
  ];

  const categoryPerformance = [
    { name: 'Electronics', revenue: '$142,680', percentage: 29.4, orders: 1456, growth: 25.6, color: 'from-blue-500 to-cyan-500' },
    { name: 'Fashion', revenue: '$116,854', percentage: 24.0, orders: 1823, growth: 22.3, color: 'from-purple-500 to-pink-500' },
    { name: 'Home & Garden', revenue: '$87,542', percentage: 18.0, orders: 945, growth: 18.9, color: 'from-green-500 to-emerald-500' },
    { name: 'Sports', revenue: '$68,214', percentage: 14.0, orders: 712, growth: 15.2, color: 'from-orange-500 to-red-500' },
    { name: 'Beauty', revenue: '$70,944', percentage: 14.6, orders: 911, growth: 19.7, color: 'from-pink-500 to-rose-500' }
  ];

  const topPerformers = [
    { name: 'Wireless Headphones Pro', category: 'Electronics', sales: 456, revenue: '$91,200', growth: 34.2 },
    { name: 'Smart Watch Series 5', category: 'Electronics', sales: 389, revenue: '$155,600', growth: 28.6 },
    { name: 'Designer Denim Jacket', category: 'Fashion', sales: 345, revenue: '$51,750', growth: 25.8 },
    { name: 'Yoga Mat Premium', category: 'Sports', sales: 312, revenue: '$15,600', growth: 22.4 },
    { name: 'Organic Face Serum', category: 'Beauty', sales: 289, revenue: '$28,900', growth: 20.1 }
  ];

  const customerMetrics = [
    { metric: 'New Customers', value: 1248, percentage: 52, color: 'from-green-500 to-emerald-500' },
    { metric: 'Returning Customers', value: 1156, percentage: 48, color: 'from-blue-500 to-cyan-500' }
  ];

  const paymentBreakdown = [
    { method: 'Credit Card', amount: '$281,575', percentage: 57.9, transactions: 3385 },
    { method: 'Debit Card', amount: '$116,854', percentage: 24.0, transactions: 1405 },
    { method: 'PayPal', amount: '$53,558', percentage: 11.0, transactions: 644 },
    { method: 'Cash on Delivery', amount: '$34,247', percentage: 7.1, transactions: 413 }
  ];

  const maxSales = Math.max(...dailyTrends.map(d => d.sales));
  const maxWeeklySales = Math.max(...weeklyComparison.map(w => w.sales));

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentMonth = monthNames[selectedMonth.getMonth()];
  const currentYear = selectedMonth.getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
              <Calendar size={32} />
              Monthly Sales Report
            </h1>
            <p className="text-slate-600 mt-1">Comprehensive monthly performance overview</p>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-all flex items-center gap-2 text-slate-700 hover:shadow-md">
              <Filter size={18} />
              <span>Filter</span>
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
              <Download size={18} />
              <span>Export Report</span>
            </button>
          </div>
        </motion.div>

        {/* Month Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
        >
          <div className="flex items-center justify-between">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ChevronLeft size={20} className="text-slate-600" />
            </button>
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-violet-600" />
              <span className="text-xl font-bold text-slate-800">
                {currentMonth} {currentYear}
              </span>
            </div>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ChevronRight size={20} className="text-slate-600" />
            </button>
          </div>
        </motion.div>

        {/* Monthly Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {monthlyStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all border border-slate-100 group relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} group-hover:scale-110 transition-transform shadow-lg`}>
                    <stat.icon className="text-white" size={24} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-bold px-2.5 py-1 rounded-full ${
                    stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {stat.change}
                  </div>
                </div>
                
                <h3 className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</h3>
                <p className="text-slate-600 text-sm mb-1">{stat.title}</p>
                <p className="text-xs text-slate-500 mb-3">{stat.subtitle}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">vs {stat.lastMonth}</span>
                    <span className="font-semibold text-slate-700">{stat.target}% of goal</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.target}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                      className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Daily Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <LineChart size={20} className="text-violet-600" />
              <h2 className="text-xl font-bold text-slate-800">Daily Sales Trend</h2>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-violet-500 to-purple-500" />
                <span className="text-slate-600">Revenue</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-10 gap-2 mb-4">
            {dailyTrends.map((data, index) => (
              <motion.div
                key={data.day}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ delay: 0.4 + index * 0.02 }}
                className="relative group"
              >
                <div className="h-32 flex flex-col justify-end">
                  <div 
                    className="w-full bg-gradient-to-t from-violet-500 to-purple-500 rounded-t-lg hover:from-violet-600 hover:to-purple-600 transition-all cursor-pointer"
                    style={{ height: `${(data.sales / maxSales) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-center text-slate-600 mt-1 font-medium">{data.day}</p>
                
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-slate-900 text-white text-xs rounded-lg p-2 whitespace-nowrap shadow-lg">
                    <p className="font-semibold">Day {data.day}</p>
                    <p>${(data.sales / 1000).toFixed(1)}K</p>
                    <p>{data.orders} orders</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
        >
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 size={20} className="text-violet-600" />
            <h2 className="text-xl font-bold text-slate-800">Weekly Performance Comparison</h2>
          </div>

          <div className="space-y-4">
            {weeklyComparison.map((week, index) => (
              <motion.div
                key={week.week}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{week.week}</h3>
                      <p className="text-xs text-slate-500">${week.avg.toLocaleString()} avg/day</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-800">${(week.sales / 1000).toFixed(1)}K</p>
                    <p className="text-sm text-slate-600">{week.orders} orders</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    +{week.growth}%
                  </span>
                </div>
                <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(week.sales / maxWeeklySales) * 100}%` }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Category Performance */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
          >
            <div className="flex items-center gap-2 mb-6">
              <PieChart size={20} className="text-violet-600" />
              <h2 className="text-xl font-bold text-slate-800">Category Performance</h2>
            </div>

            <div className="space-y-4">
              {categoryPerformance.map((category, index) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{category.name}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span>{category.orders} orders</span>
                        <span className="text-green-600 font-semibold">+{category.growth}%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800">{category.revenue}</p>
                      <p className="text-xs text-slate-500">{category.percentage}%</p>
                    </div>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${category.percentage}%` }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                      className={`h-full bg-gradient-to-r ${category.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Performers */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
          >
            <div className="flex items-center gap-2 mb-6">
              <Award size={20} className="text-yellow-500" />
              <h2 className="text-xl font-bold text-slate-800">Top Performers</h2>
            </div>

            <div className="space-y-3">
              {topPerformers.map((product, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800 text-sm">{product.name}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-600 mt-1">
                      <span>{product.category}</span>
                      <span>•</span>
                      <span>{product.sales} sold</span>
                      <span className="text-green-600 font-semibold">+{product.growth}%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800">{product.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Customer Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
          >
            <div className="flex items-center gap-2 mb-6">
              <Users size={20} className="text-violet-600" />
              <h2 className="text-xl font-bold text-slate-800">Customer Analytics</h2>
            </div>

            <div className="space-y-6">
              {customerMetrics.map((metric, index) => (
                <div key={metric.metric}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold text-slate-800">{metric.metric}</p>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-800">{metric.value.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">{metric.percentage}% of total</p>
                    </div>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.percentage}%` }}
                      transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                      className={`h-full bg-gradient-to-r ${metric.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-violet-50 rounded-lg">
                    <p className="text-xs text-slate-600 mb-1">Customer Retention</p>
                    <p className="text-2xl font-bold text-violet-600">48%</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-slate-600 mb-1">Repeat Rate</p>
                    <p className="text-2xl font-bold text-green-600">32%</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payment Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
          >
            <div className="flex items-center gap-2 mb-6">
              <CreditCard size={20} className="text-violet-600" />
              <h2 className="text-xl font-bold text-slate-800">Payment Methods</h2>
            </div>

            <div className="space-y-4">
              {paymentBreakdown.map((payment, index) => (
                <div key={payment.method} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800">{payment.method}</p>
                      <p className="text-xs text-slate-500">{payment.transactions.toLocaleString()} transactions</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800">{payment.amount}</p>
                      <p className="text-xs text-slate-500">{payment.percentage}%</p>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${payment.percentage}%` }}
                      transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Monthly Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Zap size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">Monthly Insights & Highlights</h3>
              <div className="grid md:grid-cols-4 gap-4 text-sm">
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-violet-200 mb-1">Best Week</p>
                  <p className="font-semibold">Week 3 with $134.9K revenue</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-violet-200 mb-1">Top Category</p>
                  <p className="font-semibold">Electronics leads with 29.4%</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-violet-200 mb-1">Growth Leader</p>
                  <p className="font-semibold">Headphones Pro +34.2% growth</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-violet-200 mb-1">Customer Acquisition</p>
                  <p className="font-semibold">1,248 new customers joined</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}