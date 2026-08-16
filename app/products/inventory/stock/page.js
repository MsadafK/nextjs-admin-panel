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
    { label: 'Total Products', value: '156', subtext: 'Across all warehouses', icon: Package, iconClass: 'text-blue-500', bgClass: 'bg-blue-500/10' },
    { label: 'In Stock', value: '123', subtext: '78.8% of inventory', icon: CheckCircle, iconClass: 'text-emerald-500', bgClass: 'bg-emerald-500/10' },
    { label: 'Low Stock', value: '28', subtext: 'Needs restocking', icon: AlertTriangle, iconClass: 'text-amber-500', bgClass: 'bg-amber-500/10' },
    { label: 'Out of Stock', value: '5', subtext: 'Urgent attention', icon: XCircle, iconClass: 'text-destructive', bgClass: 'bg-destructive/10' },
  ];

  const products = [
    { id: 1, name: 'Smart Watch Pro Max', sku: 'ELC-001', category: 'Electronics', image: '⌚', currentStock: 245, minStock: 50, maxStock: 500, reorderPoint: 100, status: 'in-stock', warehouse: 'Mumbai Main', lastRestocked: '2 days ago', dailySales: 12, daysRemaining: 20, trend: 'up', value: 3187755 },
    { id: 2, name: 'Wireless Headphones Ultra', sku: 'ELC-002', category: 'Electronics', image: '🎧', currentStock: 87, minStock: 30, maxStock: 300, reorderPoint: 80, status: 'low-stock', warehouse: 'Delhi Central', lastRestocked: '5 days ago', dailySales: 8, daysRemaining: 11, trend: 'down', value: 400113 },
    { id: 3, name: 'Premium Running Shoes', sku: 'SPT-001', category: 'Sports', image: '👟', currentStock: 0, minStock: 20, maxStock: 200, reorderPoint: 40, status: 'out-of-stock', warehouse: 'Bangalore Hub', lastRestocked: '12 days ago', dailySales: 6, daysRemaining: 0, trend: 'down', value: 0 },
    { id: 4, name: 'Bluetooth Speaker Pro', sku: 'ELC-003', category: 'Electronics', image: '🔊', currentStock: 156, minStock: 40, maxStock: 250, reorderPoint: 75, status: 'in-stock', warehouse: 'Mumbai Main', lastRestocked: '1 day ago', dailySales: 5, daysRemaining: 31, trend: 'steady', value: 467844 },
    { id: 5, name: 'Designer Backpack', sku: 'FSH-001', category: 'Fashion', image: '🎒', currentStock: 45, minStock: 25, maxStock: 150, reorderPoint: 50, status: 'low-stock', warehouse: 'Delhi Central', lastRestocked: '7 days ago', dailySales: 4, daysRemaining: 11, trend: 'down', value: 103455 },
    { id: 6, name: 'Yoga Mat Premium', sku: 'SPT-002', category: 'Sports', image: '🧘', currentStock: 189, minStock: 30, maxStock: 200, reorderPoint: 60, status: 'in-stock', warehouse: 'Bangalore Hub', lastRestocked: '3 days ago', dailySales: 7, daysRemaining: 27, trend: 'up', value: 245511 },
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
      'in-stock': { badge: 'bg-emerald-500/10 text-emerald-600', icon: CheckCircle, text: 'In Stock' },
      'low-stock': { badge: 'bg-amber-500/10 text-amber-600', icon: AlertTriangle, text: 'Low Stock' },
      'out-of-stock': { badge: 'bg-destructive/10 text-destructive', icon: XCircle, text: 'Out of Stock' }
    };
    return configs[status] || configs['in-stock'];
  };

  const getStockPercentage = (current, max) => Math.min((current / max) * 100, 100);

  const getStockBarColor = (percentage) => {
    if (percentage >= 50) return 'bg-emerald-500';
    if (percentage >= 20) return 'bg-amber-500';
    return 'bg-destructive';
  };

  return (
    <div className="page-container max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground mb-1">
            Stock Levels
          </h1>
          <p className="text-sm text-muted-foreground">Monitor and manage inventory across all locations</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-outline py-2.5">
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button className="btn btn-primary py-2.5">
            <RefreshCw size={16} />
            <span>Sync Stock</span>
          </button>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overallStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card p-4 sm:p-5 shadow-card hover:shadow-dropdown transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgClass} w-10 h-10 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.iconClass}`} />
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">{stat.label}</p>
                <p className="text-2xl font-semibold tracking-tight text-foreground mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.subtext}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stock Alerts */}
      <div className="card p-0 shadow-card overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between border-b border-border bg-muted/10">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            Stock Alerts
          </h2>
          <span className="badge bg-amber-500/10 text-amber-600 border-amber-500/20">
            {stockAlerts.filter(a => a.type !== 'info').length} Active
          </span>
        </div>
        <div className="divide-y divide-border">
          {stockAlerts.map((alert, index) => (
            <div 
              key={index}
              className={`flex items-center justify-between px-5 py-3 border-l-2 transition-colors hover:bg-muted/30 ${
                alert.type === 'critical' ? 'border-l-destructive bg-destructive/5' :
                alert.type === 'warning' ? 'border-l-amber-500 bg-amber-500/5' :
                'border-l-blue-500 bg-blue-500/5'
              }`}
            >
              <div className="flex items-center gap-3">
                {alert.type === 'critical' ? (
                  <XCircle className="w-4 h-4 text-destructive" />
                ) : alert.type === 'warning' ? (
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                )}
                <div>
                  <p className="text-sm font-semibold text-foreground">{alert.product}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{alert.message}</p>
                </div>
              </div>
              <span className="text-xs font-medium text-muted-foreground whitespace-nowrap ml-4">{alert.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Warehouse Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {warehouseStock.map((warehouse, index) => (
          <div key={index} className="card shadow-card hover:shadow-dropdown transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{warehouse.icon}</span>
              <Warehouse className="w-5 h-5 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground text-lg mb-1">{warehouse.name}</h3>
            <p className="text-xs text-muted-foreground mb-4">{warehouse.products} products stored</p>
            
            <div className="space-y-2.5">
              <div className="flex justify-between items-end">
                <span className="text-xl font-semibold tracking-tight text-foreground">{warehouse.total}</span>
                <span className="text-xs text-muted-foreground">/ {warehouse.capacity} units</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                <div 
                  className="h-full bg-foreground rounded-full transition-all duration-500"
                  style={{ width: `${warehouse.utilization}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground font-medium uppercase tracking-wide">Utilization</span>
                <span className="font-semibold text-foreground">{warehouse.utilization}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Toolbar */}
      <div className="card p-3 sm:p-4 shadow-card">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by product name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-9 w-full"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="input pl-9 pr-8 w-full lg:w-auto appearance-none min-w-[180px]"
            >
              {stockFilters.map(filter => (
                <option key={filter.value} value={filter.value}>
                  {filter.label} ({filter.count})
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <Warehouse className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <select
              value={warehouseFilter}
              onChange={(e) => setWarehouseFilter(e.target.value)}
              className="input pl-9 pr-8 w-full lg:w-auto appearance-none min-w-[180px]"
            >
              {warehouses.map(wh => (
                <option key={wh.value} value={wh.value}>{wh.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stock Table */}
      <div className="card p-0 shadow-card overflow-hidden">
        <div className="p-5 border-b border-border bg-muted/10">
          <h2 className="text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Boxes className="w-5 h-5 text-muted-foreground" />
            Inventory Details
          </h2>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left py-3 px-5 font-semibold text-muted-foreground uppercase tracking-wide text-xs">Product</th>
                <th className="text-left py-3 px-5 font-semibold text-muted-foreground uppercase tracking-wide text-xs">SKU</th>
                <th className="text-left py-3 px-5 font-semibold text-muted-foreground uppercase tracking-wide text-xs">Current Stock</th>
                <th className="text-left py-3 px-5 font-semibold text-muted-foreground uppercase tracking-wide text-xs">Stock Level</th>
                <th className="text-left py-3 px-5 font-semibold text-muted-foreground uppercase tracking-wide text-xs">Warehouse</th>
                <th className="text-left py-3 px-5 font-semibold text-muted-foreground uppercase tracking-wide text-xs">Daily Sales</th>
                <th className="text-left py-3 px-5 font-semibold text-muted-foreground uppercase tracking-wide text-xs">Days Left</th>
                <th className="text-left py-3 px-5 font-semibold text-muted-foreground uppercase tracking-wide text-xs">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => {
                const statusConfig = getStatusConfig(product.status);
                const StatusIcon = statusConfig.icon;
                const stockPercentage = getStockPercentage(product.currentStock, product.maxStock);
                
                return (
                  <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3 min-w-[200px]">
                        <div className="w-10 h-10 bg-muted border border-border rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                          {product.image}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-5 font-mono text-xs text-muted-foreground whitespace-nowrap">{product.sku}</td>
                    <td className="py-3 px-5">
                      <p className="font-semibold text-foreground">{product.currentStock}</p>
                      <p className="text-[10px] text-muted-foreground">of {product.maxStock} max</p>
                    </td>
                    <td className="py-3 px-5">
                      <div className="w-24">
                        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden mb-1">
                          <div 
                            className={`h-full ${getStockBarColor(stockPercentage)} rounded-full`}
                            style={{ width: `${stockPercentage}%` }}
                          ></div>
                        </div>
                        <p className="text-[10px] text-muted-foreground">{stockPercentage.toFixed(0)}% capacity</p>
                      </div>
                    </td>
                    <td className="py-3 px-5 text-foreground whitespace-nowrap">{product.warehouse}</td>
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-1.5">
                        <ShoppingCart className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="font-medium text-foreground">{product.dailySales}/day</span>
                      </div>
                    </td>
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className={`font-semibold text-xs ${
                          product.daysRemaining === 0 ? 'text-destructive' :
                          product.daysRemaining < 15 ? 'text-amber-500' :
                          'text-foreground'
                        }`}>
                          {product.daysRemaining === 0 ? 'Urgent' : `${product.daysRemaining} days`}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-5 whitespace-nowrap">
                      <span className={`badge ${statusConfig.badge}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
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
  );
}