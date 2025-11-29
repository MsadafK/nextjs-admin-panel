'use client';
import { useState } from 'react';
import { AlertTriangle, XCircle, TrendingDown, Package, ShoppingCart, Clock, Zap, Bell, RefreshCw, ShoppingBag, Phone, Mail, FileText, CheckCircle, AlertCircle, Truck, DollarSign, Calendar, Percent } from 'lucide-react';

export default function LowStockLevelsPage() {
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState([]);

  const urgencyFilters = [
    { value: 'all', label: 'All Priority Levels', count: 33 },
    { value: 'critical', label: 'Critical (0 stock)', count: 5 },
    { value: 'urgent', label: 'Urgent (<7 days)', count: 12 },
    { value: 'warning', label: 'Warning (<14 days)', count: 16 },
  ];

  const criticalStats = [
    { 
      label: 'Critical Items', 
      value: '5', 
      subtext: 'Out of stock now',
      icon: XCircle, 
      color: 'from-red-500 to-pink-600', 
      bgColor: 'bg-red-50', 
      textColor: 'text-red-600',
      trend: '+2 from yesterday'
    },
    { 
      label: 'Urgent Restock', 
      value: '12', 
      subtext: 'Less than 7 days',
      icon: AlertTriangle, 
      color: 'from-orange-500 to-amber-600', 
      bgColor: 'bg-orange-50', 
      textColor: 'text-orange-600',
      trend: '+4 this week'
    },
    { 
      label: 'Potential Revenue Loss', 
      value: '₹8.4L', 
      subtext: 'From stockouts',
      icon: DollarSign, 
      color: 'from-purple-500 to-pink-600', 
      bgColor: 'bg-purple-50', 
      textColor: 'text-purple-600',
      trend: 'Per week estimate'
    },
    { 
      label: 'Pending Orders', 
      value: '247', 
      subtext: 'Awaiting stock',
      icon: ShoppingBag, 
      color: 'from-blue-500 to-indigo-600', 
      bgColor: 'bg-blue-50', 
      textColor: 'text-blue-600',
      trend: 'Backlog orders'
    },
  ];

  const lowStockProducts = [
    {
      id: 1,
      name: 'Premium Running Shoes',
      sku: 'SPT-001',
      category: 'Sports',
      image: '👟',
      currentStock: 0,
      reorderPoint: 40,
      minStock: 20,
      dailySales: 6,
      daysRemaining: 0,
      urgency: 'critical',
      lastRestocked: '12 days ago',
      supplier: 'SportGear Inc.',
      supplierContact: '+91-9876543210',
      leadTime: '3-5 days',
      orderCost: 69980,
      lostSales: 18,
      pendingOrders: 34,
      recommendedOrder: 100
    },
    {
      id: 2,
      name: 'Wireless Headphones Ultra',
      sku: 'ELC-002',
      category: 'Electronics',
      image: '🎧',
      currentStock: 0,
      reorderPoint: 80,
      minStock: 30,
      dailySales: 8,
      daysRemaining: 0,
      urgency: 'critical',
      lastRestocked: '8 days ago',
      supplier: 'TechSupply Co.',
      supplierContact: '+91-9876543211',
      leadTime: '2-4 days',
      orderCost: 138000,
      lostSales: 24,
      pendingOrders: 56,
      recommendedOrder: 150
    },
    {
      id: 3,
      name: 'Designer Backpack',
      sku: 'FSH-001',
      category: 'Fashion',
      image: '🎒',
      currentStock: 18,
      reorderPoint: 50,
      minStock: 25,
      dailySales: 4,
      daysRemaining: 5,
      urgency: 'urgent',
      lastRestocked: '7 days ago',
      supplier: 'Fashion Depot',
      supplierContact: '+91-9876543212',
      leadTime: '4-6 days',
      orderCost: 45980,
      lostSales: 0,
      pendingOrders: 12,
      recommendedOrder: 80
    },
    {
      id: 4,
      name: 'Bluetooth Speaker Mini',
      sku: 'ELC-003',
      category: 'Electronics',
      image: '🔊',
      currentStock: 23,
      reorderPoint: 75,
      minStock: 40,
      dailySales: 5,
      daysRemaining: 5,
      urgency: 'urgent',
      lastRestocked: '10 days ago',
      supplier: 'AudioMax Ltd.',
      supplierContact: '+91-9876543213',
      leadTime: '3-5 days',
      orderCost: 37485,
      lostSales: 0,
      pendingOrders: 18,
      recommendedOrder: 120
    },
    {
      id: 5,
      name: 'Yoga Mat Premium',
      sku: 'SPT-002',
      category: 'Sports',
      image: '🧘',
      currentStock: 34,
      reorderPoint: 60,
      minStock: 30,
      dailySales: 3,
      daysRemaining: 11,
      urgency: 'warning',
      lastRestocked: '5 days ago',
      supplier: 'FitLife Supplies',
      supplierContact: '+91-9876543214',
      leadTime: '5-7 days',
      orderCost: 25974,
      lostSales: 0,
      pendingOrders: 8,
      recommendedOrder: 90
    },
    {
      id: 6,
      name: 'Gaming Mouse RGB',
      sku: 'ELC-004',
      category: 'Electronics',
      image: '🖱️',
      currentStock: 41,
      reorderPoint: 80,
      minStock: 35,
      dailySales: 4,
      daysRemaining: 10,
      urgency: 'warning',
      lastRestocked: '6 days ago',
      supplier: 'GamerHub Pro',
      supplierContact: '+91-9876543215',
      leadTime: '2-3 days',
      orderCost: 37980,
      lostSales: 0,
      pendingOrders: 15,
      recommendedOrder: 100
    },
  ];

  const quickActions = [
    { label: 'Bulk Reorder', icon: ShoppingCart, color: 'from-emerald-500 to-teal-600', count: selectedProducts.length },
    { label: 'Contact Suppliers', icon: Phone, color: 'from-blue-500 to-indigo-600', count: 6 },
    { label: 'Generate PO', icon: FileText, color: 'from-purple-500 to-pink-600', count: selectedProducts.length },
    { label: 'Schedule Delivery', icon: Truck, color: 'from-orange-500 to-amber-600', count: 3 },
  ];

  const getUrgencyConfig = (urgency) => {
    const configs = {
      'critical': {
        badge: 'bg-red-100 text-red-700 border-red-300',
        icon: XCircle,
        iconColor: 'text-red-600',
        text: 'CRITICAL',
        bgHighlight: 'bg-red-50/50',
        pulse: true
      },
      'urgent': {
        badge: 'bg-orange-100 text-orange-700 border-orange-300',
        icon: AlertTriangle,
        iconColor: 'text-orange-600',
        text: 'URGENT',
        bgHighlight: 'bg-orange-50/50',
        pulse: false
      },
      'warning': {
        badge: 'bg-yellow-100 text-yellow-700 border-yellow-300',
        icon: AlertCircle,
        iconColor: 'text-yellow-600',
        text: 'WARNING',
        bgHighlight: 'bg-yellow-50/50',
        pulse: false
      }
    };
    return configs[urgency] || configs.warning;
  };

  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                Low Stock Alert
              </h1>
              <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">33 ITEMS</span>
              </div>
            </div>
            <p className="text-slate-600">Immediate attention required for inventory restocking</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white text-slate-700 px-4 py-3 rounded-xl hover:shadow-lg transition-all duration-300 border border-slate-200">
              <Bell className="w-5 h-5" />
              <span className="hidden sm:inline">Set Alerts</span>
            </button>
            <button className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300">
              <RefreshCw className="w-5 h-5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Critical Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {criticalStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-100 hover:shadow-xl transition-all duration-300">
                <div className={`${stat.bgColor} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <p className="text-slate-600 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</p>
                <p className="text-xs text-slate-500 mb-2">{stat.subtext}</p>
                <p className="text-xs text-slate-400">{stat.trend}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  className={`bg-gradient-to-r ${action.color} text-white rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                    action.count === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={action.count === 0}
                >
                  <Icon className="w-6 h-6 mb-2" />
                  <p className="font-bold">{action.label}</p>
                  {action.count > 0 && (
                    <p className="text-sm text-white/80 mt-1">{action.count} selected</p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Urgency Filter */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
          <div className="flex flex-wrap gap-3">
            {urgencyFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setUrgencyFilter(filter.value)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  urgencyFilter === filter.value
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {filter.label}
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/20">
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Low Stock Products - Detailed Cards */}
        <div className="space-y-4">
          {lowStockProducts.map((product) => {
            const urgencyConfig = getUrgencyConfig(product.urgency);
            const UrgencyIcon = urgencyConfig.icon;
            const isSelected = selectedProducts.includes(product.id);

            return (
              <div 
                key={product.id} 
                className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  urgencyConfig.bgHighlight
                } ${
                  product.urgency === 'critical' ? 'border-red-300' : 
                  product.urgency === 'urgent' ? 'border-orange-300' : 
                  'border-yellow-300'
                } ${isSelected ? 'ring-4 ring-blue-300' : ''}`}
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Section - Product Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleProductSelection(product.id)}
                          className="mt-1 w-5 h-5 rounded cursor-pointer"
                        />
                        <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-orange-100 rounded-xl flex items-center justify-center text-4xl">
                          {product.image}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-slate-800 text-xl">{product.name}</h3>
                            <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border-2 ${urgencyConfig.badge} ${
                              urgencyConfig.pulse ? 'animate-pulse' : ''
                            }`}>
                              <UrgencyIcon className="w-4 h-4" />
                              {urgencyConfig.text}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <span className="font-mono">{product.sku}</span>
                            <span>•</span>
                            <span>{product.category}</span>
                          </div>
                        </div>
                      </div>

                      {/* Stock Status Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-600">Current Stock Level</span>
                          <span className={`font-bold ${
                            product.currentStock === 0 ? 'text-red-600' : 'text-orange-600'
                          }`}>
                            {product.currentStock} / {product.reorderPoint} units
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              product.currentStock === 0 ? 'bg-gradient-to-r from-red-500 to-pink-600' :
                              product.currentStock < product.minStock ? 'bg-gradient-to-r from-orange-500 to-amber-600' :
                              'bg-gradient-to-r from-yellow-500 to-orange-500'
                            }`}
                            style={{ width: `${(product.currentStock / product.reorderPoint) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Metrics Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <ShoppingCart className="w-4 h-4 text-slate-400" />
                            <span className="text-xs text-slate-500">Daily Sales</span>
                          </div>
                          <p className="font-bold text-slate-800">{product.dailySales}/day</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span className="text-xs text-slate-500">Days Left</span>
                          </div>
                          <p className={`font-bold ${
                            product.daysRemaining === 0 ? 'text-red-600' : 
                            product.daysRemaining < 7 ? 'text-orange-600' : 
                            'text-slate-800'
                          }`}>
                            {product.daysRemaining === 0 ? 'OUT NOW' : `${product.daysRemaining} days`}
                          </p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <TrendingDown className="w-4 h-4 text-slate-400" />
                            <span className="text-xs text-slate-500">Lost Sales</span>
                          </div>
                          <p className="font-bold text-red-600">{product.lostSales} units</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <ShoppingBag className="w-4 h-4 text-slate-400" />
                            <span className="text-xs text-slate-500">Pending</span>
                          </div>
                          <p className="font-bold text-purple-600">{product.pendingOrders} orders</p>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Supplier & Action */}
                    <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-200 pt-4 lg:pt-0 lg:pl-6">
                      <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-4 mb-4">
                        <h4 className="font-bold text-slate-800 mb-3">Supplier Info</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-700">{product.supplier}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-700">{product.supplierContact}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-700">Lead: {product.leadTime}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 mb-4">
                        <h4 className="font-bold text-slate-800 mb-2">Recommended Order</h4>
                        <p className="text-3xl font-bold text-blue-600 mb-1">{product.recommendedOrder} units</p>
                        <p className="text-sm text-slate-600">Est. Cost: ₹{product.orderCost.toLocaleString()}</p>
                      </div>

                      <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-bold flex items-center justify-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        Place Order Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Bar */}
        {selectedProducts.length > 0 && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-6">
            <div>
              <p className="text-sm text-blue-100">Selected Products</p>
              <p className="text-2xl font-bold">{selectedProducts.length} items</p>
            </div>
            <div className="h-12 w-px bg-white/20"></div>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300">
              Bulk Reorder All
            </button>
            <button 
              onClick={() => setSelectedProducts([])}
              className="bg-white/20 text-white px-4 py-3 rounded-xl font-bold hover:bg-white/30 transition-all duration-300"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
}