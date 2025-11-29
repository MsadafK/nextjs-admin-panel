'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  Clock,
  Package,
  Users,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  Zap,
  Star,
  RefreshCw,
  Sun,
  Moon,
  Sunrise,
  Sunset
} from 'lucide-react';

export default function DailySalesPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('overview');

  const todayStats = [
    {
      title: 'Total Sales',
      value: '$24,567',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      subtitle: 'vs yesterday',
      target: 85
    },
    {
      title: 'Orders',
      value: '234',
      change: '+8.3%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'from-blue-500 to-cyan-500',
      subtitle: '18 pending',
      target: 92
    },
    {
      title: 'Avg Order Value',
      value: '$104.93',
      change: '+4.2%',
      trend: 'up',
      icon: CreditCard,
      color: 'from-purple-500 to-pink-500',
      subtitle: 'target: $100',
      target: 78
    },
    {
      title: 'Customers',
      value: '189',
      change: '-2.1%',
      trend: 'down',
      icon: Users,
      color: 'from-orange-500 to-red-500',
      subtitle: '34 new',
      target: 65
    }
  ];

  const hourlyData = [
    { hour: '00:00', sales: 450, orders: 5, customers: 4 },
    { hour: '01:00', sales: 320, orders: 3, customers: 3 },
    { hour: '02:00', sales: 180, orders: 2, customers: 2 },
    { hour: '03:00', sales: 150, orders: 1, customers: 1 },
    { hour: '04:00', sales: 200, orders: 2, customers: 2 },
    { hour: '05:00', sales: 380, orders: 4, customers: 3 },
    { hour: '06:00', sales: 890, orders: 8, customers: 7 },
    { hour: '07:00', sales: 1450, orders: 14, customers: 12 },
    { hour: '08:00', sales: 2340, orders: 22, customers: 18 },
    { hour: '09:00', sales: 3120, orders: 28, customers: 24 },
    { hour: '10:00', sales: 3890, orders: 35, customers: 29 },
    { hour: '11:00', sales: 4230, orders: 38, customers: 32 },
    { hour: '12:00', sales: 4560, orders: 42, customers: 35 },
    { hour: '13:00', sales: 3890, orders: 36, customers: 30 },
    { hour: '14:00', sales: 3450, orders: 32, customers: 27 },
    { hour: '15:00', sales: 3120, orders: 29, customers: 25 },
    { hour: '16:00', sales: 2890, orders: 27, customers: 23 },
    { hour: '17:00', sales: 2650, orders: 25, customers: 21 },
    { hour: '18:00', sales: 2340, orders: 22, customers: 19 },
    { hour: '19:00', sales: 1980, orders: 19, customers: 16 },
    { hour: '20:00', sales: 1560, orders: 15, customers: 13 },
    { hour: '21:00', sales: 1230, orders: 12, customers: 10 },
    { hour: '22:00', sales: 890, orders: 9, customers: 7 },
    { hour: '23:00', sales: 620, orders: 6, customers: 5 }
  ];

  const topProducts = [
    { name: 'Premium Wireless Headphones', sales: 45, revenue: '$3,600', growth: 23 },
    { name: 'Smart Watch Pro Series', sales: 38, revenue: '$7,600', growth: 18 },
    { name: 'Designer Backpack', sales: 32, revenue: '$2,560', growth: 15 },
    { name: 'Bluetooth Speaker', sales: 28, revenue: '$1,680', growth: 12 },
    { name: 'Yoga Mat Premium', sales: 24, revenue: '$960', growth: 8 }
  ];

  const recentOrders = [
    { id: '#ORD-2847', time: '14:32', customer: 'John Smith', amount: '$156.00', status: 'completed', items: 3 },
    { id: '#ORD-2846', time: '14:28', customer: 'Sarah Johnson', amount: '$89.50', status: 'processing', items: 2 },
    { id: '#ORD-2845', time: '14:15', customer: 'Mike Wilson', amount: '$234.00', status: 'completed', items: 5 },
    { id: '#ORD-2844', time: '14:08', customer: 'Emily Davis', amount: '$67.80', status: 'completed', items: 1 },
    { id: '#ORD-2843', time: '13:55', customer: 'David Brown', amount: '$445.20', status: 'pending', items: 7 }
  ];

  const paymentMethods = [
    { method: 'Credit Card', count: 134, amount: '$14,250', percentage: 58 },
    { method: 'Debit Card', count: 56, amount: '$5,890', percentage: 24 },
    { method: 'PayPal', count: 28, amount: '$2,670', percentage: 11 },
    { method: 'Cash on Delivery', count: 16, amount: '$1,757', percentage: 7 }
  ];

  const maxSales = Math.max(...hourlyData.map(h => h.sales));

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getTimeOfDayIcon = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return Sunrise;
    if (hour >= 12 && hour < 17) return Sun;
    if (hour >= 17 && hour < 20) return Sunset;
    return Moon;
  };

  const TimeIcon = getTimeOfDayIcon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-3">
              <Calendar size={32} />
              Daily Sales Report
            </h1>
            <p className="text-slate-600 mt-1 flex items-center gap-2">
              <TimeIcon size={16} />
              {formatDate(selectedDate)}
            </p>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-all flex items-center gap-2 text-slate-700 hover:shadow-md">
              <Filter size={18} />
              <span>Filter</span>
            </button>
            <button className="px-4 py-2 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-all flex items-center gap-2 text-slate-700 hover:shadow-md">
              <RefreshCw size={18} />
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
              <Download size={18} />
              <span>Export</span>
            </button>
          </div>
        </motion.div>

        {/* Date Navigator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center justify-between"
        >
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-blue-600" />
            <span className="font-semibold text-slate-800">
              {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ChevronRight size={20} className="text-slate-600" />
          </button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {todayStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all border border-slate-100 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }} />
              
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
                <p className="text-slate-600 text-sm mb-3">{stat.title}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{stat.subtitle}</span>
                    <span className="font-semibold">{stat.target}%</span>
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

        {/* Hourly Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 size={20} className="text-blue-600" />
              <h2 className="text-xl font-bold text-slate-800">Hourly Sales Performance</h2>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
                <span className="text-slate-600">Sales</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500" />
                <span className="text-slate-600">Orders</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {hourlyData.map((data, index) => (
              <motion.div
                key={data.hour}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.02 }}
                className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <div className="w-14 text-sm font-medium text-slate-600 flex items-center gap-1">
                  <Clock size={12} />
                  {data.hour}
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-8 bg-slate-100 rounded-lg overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(data.sales / maxSales) * 100}%` }}
                        transition={{ delay: 0.5 + index * 0.02, duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-end pr-2"
                      >
                        <span className="text-xs font-semibold text-white">${data.sales}</span>
                      </motion.div>
                    </div>
                    <div className="w-20 text-right">
                      <span className="text-xs font-semibold text-slate-700">{data.orders} orders</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
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
              <h2 className="text-xl font-bold text-slate-800">Top Products Today</h2>
            </div>

            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800 text-sm mb-1">{product.name}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-600">
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

          {/* Payment Methods */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
          >
            <div className="flex items-center gap-2 mb-6">
              <CreditCard size={20} className="text-blue-600" />
              <h2 className="text-xl font-bold text-slate-800">Payment Methods</h2>
            </div>

            <div className="space-y-4">
              {paymentMethods.map((payment, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">{payment.method}</span>
                    <div className="text-right">
                      <p className="font-bold text-slate-800">{payment.amount}</p>
                      <p className="text-xs text-slate-500">{payment.count} transactions</p>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${payment.percentage}%` }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-slate-500">{payment.percentage}% of total</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Package size={20} className="text-blue-600" />
              <h2 className="text-xl font-bold text-slate-800">Recent Orders</h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Order ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Time</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Items</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-semibold text-blue-600">{order.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600 text-sm">{order.time}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-800 font-medium">{order.customer}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600">{order.items}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800">{order.amount}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'completed' ? 'bg-green-100 text-green-700' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Zap size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">Today's Insights</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-blue-200 mb-1">Peak Hour</p>
                  <p className="font-semibold">12:00 PM with $4,560 in sales</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-blue-200 mb-1">Top Payment</p>
                  <p className="font-semibold">Credit Cards lead with 58% share</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-blue-200 mb-1">Trending</p>
                  <p className="font-semibold">Wireless Headphones (+23% growth)</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}