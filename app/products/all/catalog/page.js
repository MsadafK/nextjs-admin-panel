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
    { label: 'Total Products', value: '156', icon: Package, color: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
    { label: 'Active Products', value: '142', icon: TrendingUp, color: 'from-emerald-500 to-teal-600', bgColor: 'bg-emerald-50', textColor: 'text-emerald-600' },
    { label: 'Total Revenue', value: '₹45.6L', icon: DollarSign, color: 'from-purple-500 to-pink-600', bgColor: 'bg-purple-50', textColor: 'text-purple-600' },
    { label: 'Out of Stock', value: '14', icon: Tag, color: 'from-orange-500 to-red-600', bgColor: 'bg-orange-50', textColor: 'text-orange-600' },
  ];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-700';
      case 'draft':
        return 'bg-slate-100 text-slate-700';
      case 'out-of-stock':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusText = (status) => {
    return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Product Catalog
            </h1>
            <p className="text-slate-600">Manage and organize your product inventory</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white text-slate-700 px-4 py-3 rounded-xl hover:shadow-lg transition-all duration-300 border border-slate-200">
              <Upload className="w-5 h-5" />
              <span className="hidden sm:inline">Import</span>
            </button>
            <button className="flex items-center gap-2 bg-white text-slate-700 px-4 py-3 rounded-xl hover:shadow-lg transition-all duration-300 border border-slate-200">
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300">
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

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search products by name, SKU, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors appearance-none cursor-pointer bg-white min-w-[180px]"
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
                className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors appearance-none cursor-pointer bg-white min-w-[150px]"
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-md' : 'text-slate-600'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-md' : 'text-slate-600'}`}
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
              <div key={product.id} className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                {/* Product Image */}
                <div className="relative bg-gradient-to-br from-purple-100 to-pink-100 h-48 flex items-center justify-center">
                  <span className="text-7xl">{product.image}</span>
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="bg-white p-2 rounded-lg shadow-lg hover:bg-purple-50 transition-colors">
                      <Heart className="w-4 h-4 text-slate-600" />
                    </button>
                    <button className="bg-white p-2 rounded-lg shadow-lg hover:bg-purple-50 transition-colors">
                      <Eye className="w-4 h-4 text-slate-600" />
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
                      <h3 className="font-bold text-slate-800 mb-1 line-clamp-2">{product.name}</h3>
                      <p className="text-sm text-slate-500">{product.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-slate-800">{product.rating}</span>
                    <span className="text-slate-500 text-sm ml-1">({product.sold} sold)</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold text-purple-600">₹{product.price.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">SKU: {product.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">Stock: <span className="font-semibold">{product.stock}</span></p>
                      <p className="text-xs text-emerald-600 font-semibold">{product.trend}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button className="bg-slate-100 text-slate-600 p-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-slate-200">
                    <th className="text-left py-4 px-6 text-slate-700 font-semibold">Product</th>
                    <th className="text-left py-4 px-6 text-slate-700 font-semibold">Category</th>
                    <th className="text-left py-4 px-6 text-slate-700 font-semibold">Price</th>
                    <th className="text-left py-4 px-6 text-slate-700 font-semibold">Stock</th>
                    <th className="text-left py-4 px-6 text-slate-700 font-semibold">Sold</th>
                    <th className="text-left py-4 px-6 text-slate-700 font-semibold">Status</th>
                    <th className="text-left py-4 px-6 text-slate-700 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center text-2xl">
                            {product.image}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{product.name}</p>
                            <p className="text-xs text-slate-500">SKU: {product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-700">{product.category}</td>
                      <td className="py-4 px-6 font-bold text-purple-600">₹{product.price.toLocaleString()}</td>
                      <td className="py-4 px-6 text-slate-700">{product.stock}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-700">{product.sold}</span>
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
                          <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-slate-600" />
                          </button>
                          <button className="p-2 hover:bg-purple-50 rounded-lg transition-colors">
                            <Edit className="w-4 h-4 text-slate-600" />
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4 text-slate-600" />
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
        <div className="flex items-center justify-between bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
          <p className="text-slate-600">Showing <span className="font-semibold">1-8</span> of <span className="font-semibold">156</span> products</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border-2 border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-600 font-semibold">
              Previous
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all">
              1
            </button>
            <button className="px-4 py-2 border-2 border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-600">
              2
            </button>
            <button className="px-4 py-2 border-2 border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-600">
              3
            </button>
            <button className="px-4 py-2 border-2 border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-600 font-semibold">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}