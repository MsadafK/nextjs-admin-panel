'use client';
import { useState } from 'react';
import { Search, Filter, Grid, List, Plus, Eye, Edit, Trash2, Star, Package, TrendingUp, DollarSign, Tag, MoreVertical, Download, Upload, RefreshCw, ShoppingCart, Heart } from 'lucide-react';

export default function ProductCatalogPage() {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const categories = [
    { value: 'all', label: 'All Categories', count: 156 },
    { value: 'electronics', label: 'Electronics', count: 45 },
    { value: 'fashion', label: 'Fashion', count: 38 },
    { value: 'home', label: 'Home & Living', count: 28 },
    { value: 'sports', label: 'Sports', count: 22 },
    { value: 'books', label: 'Books', count: 23 },
  ];

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Draft' },
    { value: 'out-of-stock', label: 'Out of Stock' },
  ];

  const products = [
    {
      id: 1,
      name: 'Wireless Noise-Cancelling Headphones',
      category: 'Electronics',
      price: 4599,
      stock: 45,
      sold: 234,
      status: 'active',
      rating: 4.5,
      image: '🎧',
      sku: 'ELC-001',
      trend: '+12%'
    },
    {
      id: 2,
      name: 'Smart Fitness Watch Pro',
      category: 'Electronics',
      price: 12999,
      stock: 28,
      sold: 189,
      status: 'active',
      rating: 4.8,
      image: '⌚',
      sku: 'ELC-002',
      trend: '+23%'
    },
    {
      id: 3,
      name: 'Premium Cotton T-Shirt',
      category: 'Fashion',
      price: 799,
      stock: 0,
      sold: 567,
      status: 'out-of-stock',
      rating: 4.3,
      image: '👕',
      sku: 'FSH-001',
      trend: '+8%'
    },
    {
      id: 4,
      name: 'Ergonomic Office Chair',
      category: 'Home & Living',
      price: 8999,
      stock: 15,
      sold: 98,
      status: 'active',
      rating: 4.6,
      image: '🪑',
      sku: 'HOM-001',
      trend: '+15%'
    },
    {
      id: 5,
      name: 'Yoga Mat Premium',
      category: 'Sports',
      price: 1299,
      stock: 67,
      sold: 345,
      status: 'active',
      rating: 4.7,
      image: '🧘',
      sku: 'SPT-001',
      trend: '+19%'
    },
    {
      id: 6,
      name: 'Bestseller Fiction Book Set',
      category: 'Books',
      price: 999,
      stock: 42,
      sold: 156,
      status: 'active',
      rating: 4.4,
      image: '📚',
      sku: 'BOK-001',
      trend: '+6%'
    },
    {
      id: 7,
      name: 'Bluetooth Speaker Portable',
      category: 'Electronics',
      price: 2499,
      stock: 89,
      sold: 423,
      status: 'active',
      rating: 4.6,
      image: '🔊',
      sku: 'ELC-003',
      trend: '+28%'
    },
    {
      id: 8,
      name: 'Designer Sunglasses',
      category: 'Fashion',
      price: 1599,
      stock: 34,
      sold: 212,
      status: 'active',
      rating: 4.5,
      image: '🕶️',
      sku: 'FSH-002',
      trend: '+11%'
    },
  ];

  const stats = [
    { label: 'Total Products', value: '156', icon: Package, color: 'from-blue-500 to-indigo-600', bgColor: 'bg-muted', textColor: 'text-blue-600' },
    { label: 'Active Products', value: '142', icon: TrendingUp, color: 'from-emerald-500 to-teal-600', bgColor: 'bg-muted', textColor: 'text-emerald-600' },
    { label: 'Total Revenue', value: '₹45.6L', icon: DollarSign, color: 'from-purple-500 to-pink-600', bgColor: 'bg-muted', textColor: 'text-purple-600' },
    { label: 'Out of Stock', value: '14', icon: Tag, color: 'from-orange-500 to-red-600', bgColor: 'bg-muted', textColor: 'text-orange-600' },
  ];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-700';
      case 'draft':
        return 'bg-muted text-foreground';
      case 'out-of-stock':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-muted text-foreground';
    }
  };

  const getStatusText = (status) => {
    return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="page-container space-y-6">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground mb-2">
              Product Catalog
            </h1>
            <p className="text-muted-foreground">Manage and organize your product inventory</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-card text-foreground px-4 py-3 rounded-xl hover:shadow-card transition-all duration-300 border border-border">
              <Upload className="w-5 h-5" />
              <span className="hidden sm:inline">Import</span>
            </button>
            <button className="flex items-center gap-2 bg-card text-foreground px-4 py-3 rounded-xl hover:shadow-card transition-all duration-300 border border-border">
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-background px-6 py-3 rounded-xl hover:shadow-card transition-all duration-300">
              <Plus className="w-5 h-5" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-card border border-border rounded-lg shadow-card hover:shadow-dropdown transition-all duration-300">
                <div className={`${stat.bgColor} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                <p className="text-lg sm:text-xl font-semibold tracking-tight text-foreground">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Filters and Search */}
        <div className="bg-card border border-border rounded-lg shadow-card">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products by name, SKU, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-border rounded-xl focus:border-ring focus:outline-none transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border-2 border-border rounded-xl focus:border-ring focus:outline-none transition-colors appearance-none cursor-pointer bg-card min-w-[180px]"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label} ({cat.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 border-2 border-border rounded-xl focus:border-ring focus:outline-none transition-colors appearance-none cursor-pointer bg-card min-w-[150px]"
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex bg-muted rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-card shadow-card' : 'text-muted-foreground'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition-all ${viewMode === 'list' ? 'bg-card shadow-card' : 'text-muted-foreground'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid/List View */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-card border border-border rounded-lg shadow-card overflow-hidden hover:shadow-dropdown transition-all duration-300 hover:-translate-y-1 group">
                {/* Product Image */}
                <div className="relative bg-gradient-to-br from-purple-100 to-pink-100 h-48 flex items-center justify-center">
                  <span className="text-7xl">{product.image}</span>
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="bg-card p-2 rounded-lg shadow-card hover:bg-muted transition-colors">
                      <Heart className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button className="bg-card p-2 rounded-lg shadow-card hover:bg-muted transition-colors">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                  <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(product.status)}`}>
                    {getStatusText(product.status)}
                  </span>
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground mb-1 line-clamp-2">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-foreground">{product.rating}</span>
                    <span className="text-muted-foreground text-sm ml-1">({product.sold} sold)</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-lg font-semibold tracking-tight text-purple-600">₹{product.price.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Stock: <span className="font-semibold">{product.stock}</span></p>
                      <p className="text-xs text-emerald-600 font-semibold">{product.trend}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-background py-2 rounded-lg hover:shadow-card transition-all duration-300 flex items-center justify-center gap-2">
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button className="bg-muted text-muted-foreground p-2 rounded-lg hover:bg-muted hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-border">
                    <th className="text-left py-4 px-6 text-foreground font-semibold">Product</th>
                    <th className="text-left py-4 px-6 text-foreground font-semibold">Category</th>
                    <th className="text-left py-4 px-6 text-foreground font-semibold">Price</th>
                    <th className="text-left py-4 px-6 text-foreground font-semibold">Stock</th>
                    <th className="text-left py-4 px-6 text-foreground font-semibold">Sold</th>
                    <th className="text-left py-4 px-6 text-foreground font-semibold">Status</th>
                    <th className="text-left py-4 px-6 text-foreground font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product.id} className="border-b border-border hover:bg-muted transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center text-2xl">
                            {product.image}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{product.name}</p>
                            <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-foreground">{product.category}</td>
                      <td className="py-4 px-6 font-bold text-purple-600">₹{product.price.toLocaleString()}</td>
                      <td className="py-4 px-6 text-foreground">{product.stock}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="text-foreground">{product.sold}</span>
                          <span className="text-xs text-emerald-600 font-semibold">{product.trend}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(product.status)}`}>
                          {getStatusText(product.status)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                            <Edit className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between bg-card border border-border rounded-lg shadow-card">
          <p className="text-muted-foreground">Showing <span className="font-semibold">1-8</span> of <span className="font-semibold">156</span> products</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border-2 border-border rounded-lg hover:bg-muted transition-colors text-muted-foreground font-semibold">
              Previous
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-background rounded-lg hover:shadow-card transition-all">
              1
            </button>
            <button className="px-4 py-2 border-2 border-border rounded-lg hover:bg-muted transition-colors text-muted-foreground">
              2
            </button>
            <button className="px-4 py-2 border-2 border-border rounded-lg hover:bg-muted transition-colors text-muted-foreground">
              3
            </button>
            <button className="px-4 py-2 border-2 border-border rounded-lg hover:bg-muted transition-colors text-muted-foreground font-semibold">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}