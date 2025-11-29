'use client';
import { useState } from 'react';
import { Package, AlertTriangle, CheckCircle, XCircle, TrendingDown, TrendingUp, Boxes, Warehouse, ShoppingCart, RefreshCw, Filter, Search, Download, Bell, Clock, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react';

export default function StockLevelsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [warehouseFilter, setWarehouseFilter] = useState('all');

  const stockFilters = [
    { value: 'all', label: 'All Products', count: 156 },
    { value: 'in-stock', label: 'In Stock', count: 123 },
    { value: 'low-stock', label: 'Low Stock', count: 28 },
    { value: 'out-of-stock', label: 'Out of Stock', count: 5 },
  ];

  const warehouses = [
    { value: 'all', label: 'All Warehouses' },
    { value: 'mumbai', label: 'Mumbai Main' },
    { value: 'delhi', label: 'Delhi Central' },
    { value: 'bangalore', label: 'Bangalore Hub' },
  ];

  const overallStats = [
    { 
      label: 'Total Products', 
      value: '156', 
      subtext: 'Across all warehouses',
      icon: Package, 
      color: 'from-blue-500 to-indigo-600', 
      bgColor: 'bg-blue-50', 
      textColor: 'text-blue-600' 
    },
    { 
      label: 'In Stock', 
      value: '123', 
      subtext: '78.8% of inventory',
      icon: CheckCircle, 
      color: 'from-emerald-500 to-teal-600', 
      bgColor: 'bg-emerald-50', 
      textColor: 'text-emerald-600' 
    },
    { 
      label: 'Low Stock', 
      value: '28', 
      subtext: 'Needs restocking',
      icon: AlertTriangle, 
      color: 'from-orange-500 to-amber-600', 
      bgColor: 'bg-orange-50', 
      textColor: 'text-orange-600' 
    },
    { 
      label: 'Out of Stock', 
      value: '5', 
      subtext: 'Urgent attention',
      icon: XCircle, 
      color: 'from-red-500 to-pink-600', 
      bgColor: 'bg-red-50', 
      textColor: 'text-red-600' 
    },
  ];

  const products = [
    {
      id: 1,
      name: 'Smart Watch Pro Max',
      sku: 'ELC-001',
      category: 'Electronics',
      image: '⌚',
      currentStock: 245,
      minStock: 50,
      maxStock: 500,
      reorderPoint: 100,
      status: 'in-stock',
      warehouse: 'Mumbai Main',
      lastRestocked: '2 days ago',
      dailySales: 12,
      daysRemaining: 20,
      trend: 'up',
      value: 3187755
    },
    {
      id: 2,
      name: 'Wireless Headphones Ultra',
      sku: 'ELC-002',
      category: 'Electronics',
      image: '🎧',
      currentStock: 87,
      minStock: 30,
      maxStock: 300,
      reorderPoint: 80,
      status: 'low-stock',
      warehouse: 'Delhi Central',
      lastRestocked: '5 days ago',
      dailySales: 8,
      daysRemaining: 11,
      trend: 'down',
      value: 400113
    },
    {
      id: 3,
      name: 'Premium Running Shoes',
      sku: 'SPT-001',
      category: 'Sports',
      image: '👟',
      currentStock: 0,
      minStock: 20,
      maxStock: 200,
      reorderPoint: 40,
      status: 'out-of-stock',
      warehouse: 'Bangalore Hub',
      lastRestocked: '12 days ago',
      dailySales: 6,
      daysRemaining: 0,
      trend: 'down',
      value: 0
    },
    {
      id: 4,
      name: 'Bluetooth Speaker Pro',
      sku: 'ELC-003',
      category: 'Electronics',
      image: '🔊',
      currentStock: 156,
      minStock: 40,
      maxStock: 250,
      reorderPoint: 75,
      status: 'in-stock',
      warehouse: 'Mumbai Main',
      lastRestocked: '1 day ago',
      dailySales: 5,
      daysRemaining: 31,
      trend: 'steady',
      value: 467844
    },
    {
      id: 5,
      name: 'Designer Backpack',
      sku: 'FSH-001',
      category: 'Fashion',
      image: '🎒',
      currentStock: 45,
      minStock: 25,
      maxStock: 150,
      reorderPoint: 50,
      status: 'low-stock',
      warehouse: 'Delhi Central',
      lastRestocked: '7 days ago',
      dailySales: 4,
      daysRemaining: 11,
      trend: 'down',
      value: 103455
    },
    {
      id: 6,
      name: 'Yoga Mat Premium',
      sku: 'SPT-002',
      category: 'Sports',
      image: '🧘',
      currentStock: 189,
      minStock: 30,
      maxStock: 200,
      reorderPoint: 60,
      status: 'in-stock',
      warehouse: 'Bangalore Hub',
      lastRestocked: '3 days ago',
      dailySales: 7,
      daysRemaining: 27,
      trend: 'up',
      value: 245511
    },
  ];

  const stockAlerts = [
    { product: 'Premium Running Shoes', type: 'critical', message: 'Out of stock - Reorder immediately', time: '5m ago' },
    { product: 'Wireless Headphones Ultra', type: 'warning', message: 'Low stock - Below reorder point', time: '15m ago' },
    { product: 'Designer Backpack', type: 'warning', message: 'Low stock - Consider restocking', time: '1h ago' },
    { product: 'Gaming Mouse RGB', type: 'info', message: 'Stock level optimal', time: '2h ago' },
  ];

  const warehouseStock = [
    { name: 'Mumbai Main', total: 2547, capacity: 5000, utilization: 51, products: 78, icon: '🏙️' },
    { name: 'Delhi Central', total: 1876, capacity: 4000, utilization: 47, products: 56, icon: '🏛️' },
    { name: 'Bangalore Hub', total: 1432, capacity: 3500, utilization: 41, products: 45, icon: '🌆' },
  ];

  const getStatusConfig = (status) => {
    const configs = {
      'in-stock': {
        badge: 'bg-emerald-100 text-emerald-700',
        icon: CheckCircle,
        iconColor: 'text-emerald-600',
        text: 'In Stock'
      },
      'low-stock': {
        badge: 'bg-orange-100 text-orange-700',
        icon: AlertTriangle,
        iconColor: 'text-orange-600',
        text: 'Low Stock'
      },
      'out-of-stock': {
        badge: 'bg-red-100 text-red-700',
        icon: XCircle,
        iconColor: 'text-red-600',
        text: 'Out of Stock'
      }
    };
    return configs[status] || configs['in-stock'];
  };

  const getStockPercentage = (current, max) => {
    return Math.min((current / max) * 100, 100);
  };

  const getStockBarColor = (percentage) => {
    if (percentage >= 50) return 'from-emerald-500 to-teal-600';
    if (percentage >= 20) return 'from-orange-500 to-amber-600';
    return 'from-red-500 to-pink-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Stock Levels
            </h1>
            <p className="text-slate-600">Monitor and manage inventory across all locations</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white text-slate-700 px-4 py-3 rounded-xl hover:shadow-lg transition-all duration-300 border border-slate-200">
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300">
              <RefreshCw className="w-5 h-5" />
              <span>Sync Stock</span>
            </button>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {overallStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
                <div className={`${stat.bgColor} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <p className="text-slate-600 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.subtext}</p>
              </div>
            );
          })}
        </div>

        {/* Stock Alerts */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Bell className="w-6 h-6 text-orange-600" />
              Stock Alerts
            </h2>
            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
              {stockAlerts.filter(a => a.type !== 'info').length} Active
            </span>
          </div>
          <div className="space-y-2">
            {stockAlerts.map((alert, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-4 rounded-xl border-l-4 ${
                  alert.type === 'critical' ? 'border-red-500 bg-red-50' :
                  alert.type === 'warning' ? 'border-orange-500 bg-orange-50' :
                  'border-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {alert.type === 'critical' ? (
                    <XCircle className="w-5 h-5 text-red-600" />
                  ) : alert.type === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  )}
                  <div>
                    <p className="font-semibold text-slate-800">{alert.product}</p>
                    <p className="text-sm text-slate-600">{alert.message}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-500 whitespace-nowrap">{alert.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Warehouse Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {warehouseStock.map((warehouse, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">{warehouse.icon}</span>
                <Warehouse className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-1">{warehouse.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{warehouse.products} products stored</p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-bold text-slate-800">{warehouse.total}</span>
                  <span className="text-sm text-slate-500">/ {warehouse.capacity} units</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${warehouse.utilization}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Utilization</span>
                  <span className="font-semibold text-blue-600">{warehouse.utilization}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by product name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="pl-10 pr-8 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white cursor-pointer min-w-[180px]"
              >
                {stockFilters.map(filter => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label} ({filter.count})
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <Warehouse className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={warehouseFilter}
                onChange={(e) => setWarehouseFilter(e.target.value)}
                className="pl-10 pr-8 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white cursor-pointer min-w-[200px]"
              >
                {warehouses.map(wh => (
                  <option key={wh.value} value={wh.value}>{wh.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stock Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Boxes className="w-7 h-7 text-blue-600" />
              Inventory Details
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-slate-200">
                  <th className="text-left py-4 px-6 text-slate-700 font-semibold">Product</th>
                  <th className="text-left py-4 px-6 text-slate-700 font-semibold">SKU</th>
                  <th className="text-left py-4 px-6 text-slate-700 font-semibold">Current Stock</th>
                  <th className="text-left py-4 px-6 text-slate-700 font-semibold">Stock Level</th>
                  <th className="text-left py-4 px-6 text-slate-700 font-semibold">Warehouse</th>
                  <th className="text-left py-4 px-6 text-slate-700 font-semibold">Daily Sales</th>
                  <th className="text-left py-4 px-6 text-slate-700 font-semibold">Days Left</th>
                  <th className="text-left py-4 px-6 text-slate-700 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const statusConfig = getStatusConfig(product.status);
                  const StatusIcon = statusConfig.icon;
                  const stockPercentage = getStockPercentage(product.currentStock, product.maxStock);
                  
                  return (
                    <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center text-2xl">
                            {product.image}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{product.name}</p>
                            <p className="text-sm text-slate-500">{product.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono text-slate-600">{product.sku}</td>
                      <td className="py-4 px-6">
                        <p className="font-bold text-2xl text-slate-800">{product.currentStock}</p>
                        <p className="text-xs text-slate-500">of {product.maxStock} max</p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="w-32">
                          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden mb-1">
                            <div 
                              className={`h-full bg-gradient-to-r ${getStockBarColor(stockPercentage)} rounded-full`}
                              style={{ width: `${stockPercentage}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-slate-500">{stockPercentage.toFixed(0)}% capacity</p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-700">{product.warehouse}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="w-4 h-4 text-slate-400" />
                          <span className="font-semibold text-slate-800">{product.dailySales}/day</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className={`font-bold ${
                            product.daysRemaining === 0 ? 'text-red-600' :
                            product.daysRemaining < 15 ? 'text-orange-600' :
                            'text-slate-800'
                          }`}>
                            {product.daysRemaining === 0 ? 'Urgent' : `${product.daysRemaining} days`}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.badge}`}>
                          <StatusIcon className="w-4 h-4" />
                          {statusConfig.text}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}