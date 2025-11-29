'use client';
import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, ShoppingCart, Package, CreditCard, Clock, MapPin, Tag, Zap, AlertCircle, CheckCircle, Users, ArrowUpRight } from 'lucide-react';

export default function LiveSalesPage() {
  const [totalRevenue, setTotalRevenue] = useState(2847659);
  const [orderCount, setOrderCount] = useState(1247);
  const [recentSales, setRecentSales] = useState([]);
  const [pulse, setPulse] = useState(false);

  // Simulate live sales updates
  useEffect(() => {
    const initialSales = [
      { id: '#ORD-8934', amount: 4599, product: 'Wireless Headphones', location: 'Mumbai', time: 'Just now', status: 'completed' },
      { id: '#ORD-8933', amount: 12999, product: 'Smart Watch Pro', location: 'Delhi', time: '12s ago', status: 'processing' },
      { id: '#ORD-8932', amount: 799, product: 'Phone Case', location: 'Bangalore', time: '28s ago', status: 'completed' },
      { id: '#ORD-8931', amount: 24999, product: 'Laptop Stand', location: 'Pune', time: '45s ago', status: 'completed' },
      { id: '#ORD-8930', amount: 1899, product: 'Keyboard', location: 'Chennai', time: '1m ago', status: 'processing' },
    ];
    setRecentSales(initialSales);

    const interval = setInterval(() => {
      const newAmount = Math.floor(Math.random() * 20000) + 500;
      const products = ['Wireless Mouse', 'USB Cable', 'Power Bank', 'Earbuds', 'Phone Stand', 'Laptop Bag', 'Screen Guard'];
      const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata'];
      const statuses = ['completed', 'processing', 'completed', 'completed'];
      
      const newSale = {
        id: `#ORD-${Math.floor(Math.random() * 9000) + 1000}`,
        amount: newAmount,
        product: products[Math.floor(Math.random() * products.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        time: 'Just now',
        status: statuses[Math.floor(Math.random() * statuses.length)]
      };

      setRecentSales(prev => [newSale, ...prev.slice(0, 9)]);
      setTotalRevenue(prev => prev + newAmount);
      setOrderCount(prev => prev + 1);
      setPulse(true);
      setTimeout(() => setPulse(false), 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const topProducts = [
    { name: 'Wireless Headphones', sales: 342, revenue: '₹15,73,158', trend: '+23%' },
    { name: 'Smart Watch Pro', sales: 289, revenue: '₹37,56,711', trend: '+18%' },
    { name: 'Laptop Stand', sales: 234, revenue: '₹58,47,666', trend: '+15%' },
    { name: 'Power Bank', sales: 198, revenue: '₹5,94,000', trend: '+12%' },
    { name: 'Wireless Mouse', sales: 167, revenue: '₹3,34,000', trend: '+9%' },
  ];

  const paymentMethods = [
    { method: 'UPI', count: 542, percentage: 48, color: 'from-purple-500 to-pink-500' },
    { method: 'Credit Card', count: 389, percentage: 34, color: 'from-blue-500 to-cyan-500' },
    { method: 'Debit Card', count: 201, percentage: 18, color: 'from-orange-500 to-amber-500' },
  ];

  const salesByRegion = [
    { region: 'Mumbai', sales: 287, revenue: '₹12,45,678', flag: '🏙️' },
    { region: 'Delhi', sales: 245, revenue: '₹10,89,432', flag: '🏛️' },
    { region: 'Bangalore', sales: 198, revenue: '₹9,56,234', flag: '🌆' },
    { region: 'Hyderabad', sales: 156, revenue: '₹7,34,567', flag: '🏢' },
  ];

  const quickStats = [
    { label: 'Revenue Today', value: `₹${(totalRevenue / 100000).toFixed(2)}L`, icon: DollarSign, color: 'from-emerald-500 to-teal-600', textColor: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { label: 'Orders Today', value: orderCount, icon: ShoppingCart, color: 'from-blue-500 to-indigo-600', textColor: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Avg. Order Value', value: `₹${Math.floor(totalRevenue / orderCount)}`, icon: TrendingUp, color: 'from-purple-500 to-pink-600', textColor: 'text-purple-600', bgColor: 'bg-purple-50' },
    { label: 'Products Sold', value: '2,847', icon: Package, color: 'from-orange-500 to-red-600', textColor: 'text-orange-600', bgColor: 'bg-orange-50' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Live Sales
              </h1>
              <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">LIVE</span>
              </div>
            </div>
            <p className="text-slate-600">Real-time sales monitoring dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-xl px-4 py-2 shadow-md border border-slate-200">
              <p className="text-xs text-slate-500">Last Sale</p>
              <p className="text-sm font-semibold text-slate-800">2 seconds ago</p>
            </div>
          </div>
        </div>

        {/* Hero Revenue Counter */}
        <div className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-8 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                  <DollarSign className="w-12 h-12 text-white" />
                  <Zap className={`w-6 h-6 text-yellow-300 ${pulse ? 'animate-ping' : ''}`} />
                </div>
                <h2 className="text-white text-xl font-medium mb-2">Total Revenue Today</h2>
                <div className={`text-6xl md:text-7xl font-bold text-white mb-2 transition-all duration-500 ${pulse ? 'scale-110' : 'scale-100'}`}>
                  ₹{(totalRevenue / 100000).toFixed(2)}L
                </div>
                <p className="text-emerald-100 text-lg">+₹{Math.floor(Math.random() * 50000 + 10000).toLocaleString()} in last hour</p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white min-w-[200px]">
                  <p className="text-emerald-100 text-sm mb-1">Orders/Hour</p>
                  <p className="text-4xl font-bold">47</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white min-w-[200px]">
                  <p className="text-emerald-100 text-sm mb-1">Conversion Rate</p>
                  <p className="text-4xl font-bold">3.8%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => {
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

        {/* Recent Sales Feed */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Zap className="w-6 h-6 text-emerald-600" />
              Live Sales Feed
            </h3>
            <span className="text-sm text-slate-500">Auto-updating every 5s</span>
          </div>
          <div className="space-y-3">
            {recentSales.map((sale, index) => (
              <div 
                key={`${sale.id}-${index}`}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border-l-4 transition-all duration-500 ${
                  index === 0 ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-transparent shadow-md scale-105' : 'border-slate-300 bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-4 mb-3 sm:mb-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    sale.status === 'completed' ? 'bg-emerald-100' : 'bg-orange-100'
                  }`}>
                    {sale.status === 'completed' ? (
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <Clock className="w-6 h-6 text-orange-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{sale.id}</p>
                    <p className="text-sm text-slate-600">{sale.product}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-500">{sale.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-600">₹{sale.amount.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">{sale.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
              Top Selling Products
            </h3>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold w-8 h-8 rounded-lg flex items-center justify-center text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{product.name}</p>
                      <p className="text-sm text-slate-500">{product.sales} sales • {product.revenue}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 font-semibold text-sm">
                    <ArrowUpRight className="w-4 h-4" />
                    {product.trend}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-emerald-600" />
              Payment Methods
            </h3>
            <div className="space-y-6">
              {paymentMethods.map((method, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-slate-800">{method.method}</span>
                    <div className="text-right">
                      <span className="font-bold text-slate-800">{method.count}</span>
                      <span className="text-slate-500 text-sm ml-2">({method.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${method.color} rounded-full transition-all duration-500`}
                      style={{ width: `${method.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sales by Region */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-600" />
            Sales by Region
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {salesByRegion.map((region, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-5 hover:shadow-lg transition-all duration-300 border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{region.flag}</span>
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {region.sales} orders
                  </span>
                </div>
                <p className="font-bold text-slate-800 text-lg mb-1">{region.region}</p>
                <p className="text-2xl font-bold text-emerald-600">{region.revenue}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}