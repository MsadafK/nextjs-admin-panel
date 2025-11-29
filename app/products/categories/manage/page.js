'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderOpen,
  Plus,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  Package,
  TrendingUp,
  Tag,
  Grid3x3,
  List,
  Filter,
  ChevronRight,
  Star,
  Archive,
  RefreshCw
} from 'lucide-react';

export default function ManageCategoriesPage() {
  const [viewMode, setViewMode] = useState('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    {
      id: 1,
      name: 'Electronics',
      slug: 'electronics',
      products: 456,
      subcategories: 12,
      revenue: '$245,000',
      growth: '+15%',
      color: 'from-blue-500 to-cyan-500',
      icon: '💻',
      status: 'active',
      featured: true
    },
    {
      id: 2,
      name: 'Clothing & Fashion',
      slug: 'clothing-fashion',
      products: 892,
      subcategories: 18,
      revenue: '$196,000',
      growth: '+23%',
      color: 'from-purple-500 to-pink-500',
      icon: '👕',
      status: 'active',
      featured: true
    },
    {
      id: 3,
      name: 'Home & Garden',
      slug: 'home-garden',
      products: 234,
      subcategories: 8,
      revenue: '$126,000',
      growth: '+8%',
      color: 'from-green-500 to-emerald-500',
      icon: '🏡',
      status: 'active',
      featured: false
    },
    {
      id: 4,
      name: 'Sports & Fitness',
      slug: 'sports-fitness',
      products: 178,
      subcategories: 6,
      revenue: '$84,000',
      growth: '+12%',
      color: 'from-orange-500 to-red-500',
      icon: '⚽',
      status: 'active',
      featured: false
    },
    {
      id: 5,
      name: 'Books & Media',
      slug: 'books-media',
      products: 567,
      subcategories: 10,
      revenue: '$92,000',
      growth: '+5%',
      color: 'from-indigo-500 to-purple-500',
      icon: '📚',
      status: 'active',
      featured: true
    },
    {
      id: 6,
      name: 'Beauty & Health',
      slug: 'beauty-health',
      products: 345,
      subcategories: 15,
      revenue: '$158,000',
      growth: '+18%',
      color: 'from-pink-500 to-rose-500',
      icon: '💄',
      status: 'active',
      featured: false
    },
    {
      id: 7,
      name: 'Toys & Games',
      slug: 'toys-games',
      products: 289,
      subcategories: 9,
      revenue: '$67,000',
      growth: '+10%',
      color: 'from-yellow-500 to-orange-500',
      icon: '🎮',
      status: 'active',
      featured: false
    },
    {
      id: 8,
      name: 'Automotive',
      slug: 'automotive',
      products: 123,
      subcategories: 5,
      revenue: '$112,000',
      growth: '-3%',
      color: 'from-slate-500 to-gray-500',
      icon: '🚗',
      status: 'inactive',
      featured: false
    }
  ];

  const stats = [
    { label: 'Total Categories', value: '24', icon: FolderOpen, color: 'from-blue-500 to-cyan-500' },
    { label: 'Active Products', value: '3,184', icon: Package, color: 'from-green-500 to-emerald-500' },
    { label: 'Subcategories', value: '83', icon: Tag, color: 'from-purple-500 to-pink-500' },
    { label: 'Monthly Revenue', value: '$1.08M', icon: TrendingUp, color: 'from-orange-500 to-red-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Manage Categories
            </h1>
            <p className="text-slate-600 mt-1">Organize and manage your product categories</p>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-all flex items-center gap-2 text-slate-700 hover:shadow-md">
              <Filter size={18} />
              <span>Filter</span>
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus size={18} />
              <span>Add Category</span>
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-slate-100"
            >
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${stat.color} mb-3`}>
                <stat.icon className="text-white" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</h3>
              <p className="text-slate-600 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Search & View Mode */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 mr-2">View:</span>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Grid3x3 size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </motion.div>

        {/* Categories Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-slate-100 overflow-hidden group"
              >
                <div className={`h-32 bg-gradient-to-br ${category.color} relative`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
                  <div className="absolute top-4 right-4 flex gap-2">
                    {category.featured && (
                      <span className="p-1.5 bg-white/90 rounded-full">
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      category.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {category.status}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="text-5xl">{category.icon}</div>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-800 mb-1">{category.name}</h3>
                  <p className="text-sm text-slate-500 mb-4">/{category.slug}</p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-50 rounded-lg p-2">
                      <p className="text-xs text-slate-600">Products</p>
                      <p className="text-lg font-bold text-slate-800">{category.products}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <p className="text-xs text-slate-600">Subcategories</p>
                      <p className="text-lg font-bold text-slate-800">{category.subcategories}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-slate-600">Revenue</p>
                      <p className="text-sm font-semibold text-slate-800">{category.revenue}</p>
                    </div>
                    <span className={`text-sm font-semibold ${
                      category.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {category.growth}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-sm font-medium transition-colors flex items-center justify-center gap-1">
                      <Edit2 size={14} />
                      Edit
                    </button>
                    <button className="px-3 py-2 bg-slate-100 hover:bg-red-100 rounded-lg text-slate-700 hover:text-red-600 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Products</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Subcategories</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Revenue</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Growth</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categories.map((category, index) => (
                    <motion.tr
                      key={category.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${category.color} text-2xl`}>
                            {category.icon}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 flex items-center gap-2">
                              {category.name}
                              {category.featured && <Star size={14} className="text-yellow-500 fill-yellow-500" />}
                            </p>
                            <p className="text-sm text-slate-500">/{category.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-800">{category.products}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-800">{category.subcategories}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-800">{category.revenue}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${
                          category.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {category.growth}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          category.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {category.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600">
                            <Eye size={16} />
                          </button>
                          <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600">
                            <Edit2 size={16} />
                          </button>
                          <button className="p-2 hover:bg-red-100 rounded-lg transition-colors text-slate-600 hover:text-red-600">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Add Category Modal */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowAddModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              >
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Add New Category</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Category Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Electronics"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">URL Slug</label>
                    <input
                      type="text"
                      placeholder="e.g., electronics"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Icon (Emoji)</label>
                    <input
                      type="text"
                      placeholder="e.g., 💻"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                    <textarea
                      rows="3"
                      placeholder="Brief description..."
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="featured" className="w-4 h-4 text-purple-600 rounded" />
                    <label htmlFor="featured" className="text-sm text-slate-700">Mark as featured category</label>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all">
                    Create Category
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}