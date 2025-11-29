'use client';

import React, { useState } from 'react';
import { FileText, Download, Eye, Star, Search, Filter, Plus, Edit3, Trash2, Copy, Clock, CheckCircle2, Users, TrendingUp, Package, DollarSign, Database, Settings, Sparkles, Upload } from 'lucide-react';

const ImportTemplates = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const categories = [
    { id: 'all', name: 'All Templates', count: 24 },
    { id: 'sales', name: 'Sales & Revenue', count: 8 },
    { id: 'inventory', name: 'Inventory', count: 6 },
    { id: 'customers', name: 'Customers', count: 5 },
    { id: 'financial', name: 'Financial', count: 3 },
    { id: 'custom', name: 'Custom', count: 2 }
  ];

  const templates = [
    {
      id: 1,
      name: 'Sales Transaction Import',
      category: 'sales',
      icon: '💰',
      description: 'Import daily sales transactions with customer and product details',
      fields: ['Order ID', 'Date', 'Customer', 'Product', 'Quantity', 'Amount', 'Payment Method'],
      downloads: 1234,
      rating: 4.8,
      lastUpdated: '2 days ago',
      featured: true,
      format: 'CSV',
      size: '12 KB'
    },
    {
      id: 2,
      name: 'Product Catalog Import',
      category: 'inventory',
      icon: '📦',
      description: 'Bulk import products with pricing, SKU, and inventory levels',
      fields: ['SKU', 'Product Name', 'Category', 'Price', 'Stock', 'Description'],
      downloads: 987,
      rating: 4.9,
      lastUpdated: '5 days ago',
      featured: true,
      format: 'Excel',
      size: '15 KB'
    },
    {
      id: 3,
      name: 'Customer Database Import',
      category: 'customers',
      icon: '👥',
      description: 'Import customer information with contact details and preferences',
      fields: ['Customer ID', 'Name', 'Email', 'Phone', 'Address', 'City', 'Country'],
      downloads: 856,
      rating: 4.7,
      lastUpdated: '1 week ago',
      featured: false,
      format: 'CSV',
      size: '10 KB'
    },
    {
      id: 4,
      name: 'Inventory Update Template',
      category: 'inventory',
      icon: '📊',
      description: 'Update stock levels and warehouse locations in bulk',
      fields: ['Product ID', 'Stock Level', 'Warehouse', 'Reorder Point', 'Status'],
      downloads: 743,
      rating: 4.6,
      lastUpdated: '3 days ago',
      featured: false,
      format: 'CSV',
      size: '8 KB'
    },
    {
      id: 5,
      name: 'Order History Import',
      category: 'sales',
      icon: '🛒',
      description: 'Import complete order history with shipping and tracking info',
      fields: ['Order ID', 'Date', 'Customer', 'Total', 'Status', 'Shipping', 'Tracking'],
      downloads: 654,
      rating: 4.5,
      lastUpdated: '1 week ago',
      featured: false,
      format: 'Excel',
      size: '18 KB'
    },
    {
      id: 6,
      name: 'Financial Transactions',
      category: 'financial',
      icon: '💵',
      description: 'Import revenue, expenses, and payment records',
      fields: ['Transaction ID', 'Date', 'Type', 'Category', 'Amount', 'Description'],
      downloads: 567,
      rating: 4.8,
      lastUpdated: '4 days ago',
      featured: true,
      format: 'CSV',
      size: '11 KB'
    },
    {
      id: 7,
      name: 'Employee Data Import',
      category: 'customers',
      icon: '👔',
      description: 'Import employee records with roles and departments',
      fields: ['Employee ID', 'Name', 'Email', 'Department', 'Role', 'Join Date'],
      downloads: 432,
      rating: 4.4,
      lastUpdated: '2 weeks ago',
      featured: false,
      format: 'Excel',
      size: '13 KB'
    },
    {
      id: 8,
      name: 'Supplier Database',
      category: 'inventory',
      icon: '🏭',
      description: 'Import supplier information and contact details',
      fields: ['Supplier ID', 'Company', 'Contact', 'Email', 'Phone', 'Products'],
      downloads: 389,
      rating: 4.3,
      lastUpdated: '1 week ago',
      featured: false,
      format: 'CSV',
      size: '9 KB'
    }
  ];

  const recentTemplates = [
    { id: 1, name: 'Sales_Template_2024.csv', date: '2 hours ago', downloads: 5 },
    { id: 2, name: 'Product_Import.xlsx', date: '5 hours ago', downloads: 3 },
    { id: 3, name: 'Customer_Data.csv', date: '1 day ago', downloads: 8 }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredTemplates = templates.filter(t => t.featured);

  const getCategoryIcon = (category) => {
    const icons = {
      sales: <DollarSign className="w-4 h-4" />,
      inventory: <Package className="w-4 h-4" />,
      customers: <Users className="w-4 h-4" />,
      financial: <TrendingUp className="w-4 h-4" />,
      custom: <Settings className="w-4 h-4" />
    };
    return icons[category] || <FileText className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Import Templates</h1>
            <p className="text-slate-600">Pre-configured templates for quick and easy data imports</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-slate-700">
              <Upload className="w-4 h-4" />
              Upload Template
            </button>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition-colors flex items-center gap-2 font-medium"
            >
              <Plus className="w-4 h-4" />
              Create Template
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
              />
            </div>
            <div className="flex gap-2">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.count})
                  </option>
                ))}
              </select>
              <button className="px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
                <Filter className="w-4 h-4" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Featured Templates */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-fuchsia-600" />
                <h2 className="text-lg font-semibold text-slate-800">Featured Templates</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="p-4 border-2 border-fuchsia-200 bg-gradient-to-br from-fuchsia-50 to-pink-50 rounded-lg hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl shadow-sm">
                          {template.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-800 mb-1">{template.name}</h3>
                          <p className="text-xs text-slate-600 line-clamp-2">{template.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {template.downloads}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {template.rating}
                      </span>
                      <span>•</span>
                      <span>{template.format}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition-colors text-sm font-medium flex items-center justify-center gap-1">
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                      <button className="px-3 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                        <Eye className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* All Templates */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">
                  All Templates ({filteredTemplates.length})
                </h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-fuchsia-100 text-fuchsia-700' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    Grid
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-fuchsia-100 text-fuchsia-700' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    List
                  </button>
                </div>
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="p-4 border border-slate-200 rounded-lg hover:shadow-md hover:border-fuchsia-300 transition-all"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-fuchsia-100 to-pink-100 rounded-lg flex items-center justify-center text-xl">
                          {template.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-800 mb-1 truncate">{template.name}</h3>
                          <p className="text-xs text-slate-600 line-clamp-2">{template.description}</p>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-xs text-slate-500 mb-1">Fields: {template.fields.length}</div>
                        <div className="flex flex-wrap gap-1">
                          {template.fields.slice(0, 3).map((field, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded">
                              {field}
                            </span>
                          ))}
                          {template.fields.length > 3 && (
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded">
                              +{template.fields.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500 mb-3 pb-3 border-b border-slate-100">
                        <span className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          {template.downloads}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {template.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {template.lastUpdated}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button className="flex-1 px-3 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition-colors text-sm font-medium flex items-center justify-center gap-1">
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                        <button className="px-3 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                          <Eye className="w-4 h-4 text-slate-600" />
                        </button>
                        <button className="px-3 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                          <Copy className="w-4 h-4 text-slate-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="p-4 border border-slate-200 rounded-lg hover:shadow-md hover:border-fuchsia-300 transition-all flex items-center gap-4"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-fuchsia-100 to-pink-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                        {template.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-800 mb-1">{template.name}</h3>
                        <p className="text-sm text-slate-600 mb-2">{template.description}</p>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            {template.downloads}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {template.rating}
                          </span>
                          <span>{template.format} • {template.size}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {template.lastUpdated}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition-colors text-sm font-medium flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                        <button className="px-3 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                          <Eye className="w-4 h-4 text-slate-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Template Stats</h3>
              <div className="space-y-4">
                <div className="p-3 bg-fuchsia-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600">Total Templates</span>
                    <FileText className="w-4 h-4 text-fuchsia-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-800">{templates.length}</div>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600">Total Downloads</span>
                    <Download className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-800">
                    {templates.reduce((sum, t) => sum + t.downloads, 0).toLocaleString()}
                  </div>
                </div>

                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600">Avg Rating</span>
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  </div>
                  <div className="text-2xl font-bold text-slate-800">
                    {(templates.reduce((sum, t) => sum + t.rating, 0) / templates.length).toFixed(1)}
                  </div>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                      selectedCategory === category.id
                        ? 'bg-fuchsia-50 border-2 border-fuchsia-500'
                        : 'border border-slate-200 hover:border-fuchsia-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(category.id)}
                      <span className="font-medium text-slate-800 text-sm">{category.name}</span>
                    </div>
                    <span className="text-sm text-slate-500">{category.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Downloads */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Downloads</h3>
              <div className="space-y-3">
                {recentTemplates.map((item) => (
                  <div key={item.id} className="p-3 border border-slate-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-fuchsia-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-fuchsia-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-800 truncate">{item.name}</div>
                        <div className="text-xs text-slate-500 mt-1">{item.date}</div>
                        <div className="text-xs text-fuchsia-600 mt-1">{item.downloads} downloads</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-semibold text-amber-900">Template Tips</h3>
              </div>
              <ul className="space-y-2 text-sm text-amber-800">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Customize templates for your needs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Check field requirements before use</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Save custom templates for reuse</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Rate templates after download</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-800">Create New Template</h3>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Template Name</label>
                <input
                  type="text"
                  placeholder="Enter template name..."
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  placeholder="Describe your template..."
                  rows="3"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <select className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500">
                  <option>Select category...</option>
                  {categories.filter(c => c.id !== 'all').map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">File Format</label>
                <select className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500">
                  <option>CSV</option>
                  <option>Excel</option>
                  <option>JSON</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex gap-3 justify-end">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition-colors"
              >
                Create Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportTemplates;