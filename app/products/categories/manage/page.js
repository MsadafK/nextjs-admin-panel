'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderOpen, Plus, Search, MoreVertical, Edit2, Trash2, Eye, Package, 
  TrendingUp, Tag, Grid3x3, List, Filter, ChevronRight, Star, Archive, RefreshCw, X
} from 'lucide-react';

export default function ManageCategoriesPage() {
  const [viewMode, setViewMode] = useState('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 1, name: 'Electronics', slug: 'electronics', products: 456, subcategories: 12, revenue: '$245,000', growth: '+15%', icon: '💻', status: 'active', featured: true },
    { id: 2, name: 'Clothing & Fashion', slug: 'clothing-fashion', products: 892, subcategories: 18, revenue: '$196,000', growth: '+23%', icon: '👕', status: 'active', featured: true },
    { id: 3, name: 'Home & Garden', slug: 'home-garden', products: 234, subcategories: 8, revenue: '$126,000', growth: '+8%', icon: '🏡', status: 'active', featured: false },
    { id: 4, name: 'Sports & Fitness', slug: 'sports-fitness', products: 178, subcategories: 6, revenue: '$84,000', growth: '+12%', icon: '⚽', status: 'active', featured: false },
    { id: 5, name: 'Books & Media', slug: 'books-media', products: 567, subcategories: 10, revenue: '$92,000', growth: '+5%', icon: '📚', status: 'active', featured: true },
    { id: 6, name: 'Beauty & Health', slug: 'beauty-health', products: 345, subcategories: 15, revenue: '$158,000', growth: '+18%', icon: '💄', status: 'active', featured: false },
    { id: 7, name: 'Toys & Games', slug: 'toys-games', products: 289, subcategories: 9, revenue: '$67,000', growth: '+10%', icon: '🎮', status: 'active', featured: false },
    { id: 8, name: 'Automotive', slug: 'automotive', products: 123, subcategories: 5, revenue: '$112,000', growth: '-3%', icon: '🚗', status: 'inactive', featured: false }
  ];

  const stats = [
    { label: 'Total Categories', value: '24', icon: FolderOpen, iconClass: 'text-blue-500', bgClass: 'bg-blue-500/10' },
    { label: 'Active Products', value: '3,184', icon: Package, iconClass: 'text-emerald-500', bgClass: 'bg-emerald-500/10' },
    { label: 'Subcategories', value: '83', icon: Tag, iconClass: 'text-purple-500', bgClass: 'bg-purple-500/10' },
    { label: 'Monthly Revenue', value: '$1.08M', icon: TrendingUp, iconClass: 'text-orange-500', bgClass: 'bg-orange-500/10' }
  ];

  const getStatusBadge = (status) => {
    return status === 'active' 
      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
      : 'bg-muted text-muted-foreground border-border';
  };

  return (
    <div className="page-container max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground mb-1">
            Manage Categories
          </h1>
          <p className="text-sm text-muted-foreground">Organize and manage your product categories</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="btn btn-outline py-2.5">
            <Filter size={16} />
            <span className="hidden sm:inline ml-2">Filter</span>
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary py-2.5">
            <Plus size={16} />
            <span className="ml-2">Add Category</span>
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
            className="card p-4 sm:p-5 shadow-card hover:shadow-dropdown transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bgClass} w-10 h-10 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.iconClass}`} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-semibold tracking-tight text-foreground mb-1">{stat.value}</h3>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search & View Mode */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-3 sm:p-4 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-9 w-full"
          />
        </div>

        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-md border border-border">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded transition-all ${viewMode === 'grid' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            title="Grid View"
          >
            <Grid3x3 size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded transition-all ${viewMode === 'list' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            title="List View"
          >
            <List size={18} />
          </button>
        </div>
      </motion.div>

      {/* Categories Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="card p-0 shadow-card hover:shadow-dropdown transition-all duration-300 overflow-hidden group flex flex-col hover:-translate-y-1"
            >
              <div className="h-32 bg-muted/30 border-b border-border relative flex items-center justify-center">
                <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{category.icon}</span>
                <div className="absolute top-3 right-3 flex gap-2">
                  {category.featured && (
                    <span className="p-1.5 bg-background/80 backdrop-blur-sm rounded-md shadow-sm">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                    </span>
                  )}
                  <span className={`badge ${getStatusBadge(category.status)} capitalize backdrop-blur-sm`}>
                    {category.status}
                  </span>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">{category.name}</h3>
                <p className="text-xs text-muted-foreground mb-4">/{category.slug}</p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-muted/50 rounded-lg p-3 border border-border">
                    <p className="text-[10px] uppercase font-semibold text-muted-foreground mb-1">Products</p>
                    <p className="text-base font-semibold text-foreground">{category.products}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 border border-border">
                    <p className="text-[10px] uppercase font-semibold text-muted-foreground mb-1">Subcategories</p>
                    <p className="text-base font-semibold text-foreground">{category.subcategories}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-5 px-1">
                  <div>
                    <p className="text-[10px] uppercase font-semibold text-muted-foreground">Revenue</p>
                    <p className="text-sm font-medium text-foreground">{category.revenue}</p>
                  </div>
                  <span className={`text-xs font-semibold ${category.growth.startsWith('+') ? 'text-emerald-600' : 'text-destructive'}`}>
                    {category.growth}
                  </span>
                </div>

                <div className="flex gap-2 mt-auto">
                  <button className="btn btn-outline flex-1 py-2">
                    <Edit2 size={14} className="mr-2" /> Edit
                  </button>
                  <button className="btn btn-outline px-3 text-destructive hover:bg-destructive/10 border-transparent hover:border-destructive/20">
                    <Trash2 size={16} />
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
          className="card p-0 shadow-card overflow-hidden"
        >
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Products</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Subcategories</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Revenue</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Growth</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categories.map((category, index) => (
                  <motion.tr
                    key={category.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 min-w-[200px]">
                        <div className="w-10 h-10 rounded-lg bg-muted border border-border flex items-center justify-center text-xl flex-shrink-0">
                          {category.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground flex items-center gap-2 truncate">
                            {category.name}
                            {category.featured && <Star size={14} className="text-amber-400 fill-amber-400 flex-shrink-0" />}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">/{category.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-foreground">{category.products}</td>
                    <td className="px-6 py-4 text-foreground">{category.subcategories}</td>
                    <td className="px-6 py-4 font-medium text-foreground">{category.revenue}</td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold text-xs ${category.growth.startsWith('+') ? 'text-emerald-600' : 'text-destructive'}`}>
                        {category.growth}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge capitalize ${getStatusBadge(category.status)}`}>
                        {category.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button className="btn btn-ghost h-8 w-8 p-0 text-muted-foreground" title="View">
                          <Eye size={16} />
                        </button>
                        <button className="btn btn-ghost h-8 w-8 p-0 text-muted-foreground" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button className="btn btn-ghost h-8 w-8 p-0 text-destructive hover:bg-destructive/10" title="Delete">
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
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="card max-w-md w-full shadow-dropdown p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">Add New Category</h2>
                <button onClick={() => setShowAddModal(false)} className="btn btn-ghost p-1.5 h-auto text-muted-foreground hover:bg-muted">
                  <X size={18} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="label block mb-1.5">Category Name</label>
                  <input type="text" placeholder="e.g., Electronics" className="input w-full" />
                </div>
                <div>
                  <label className="label block mb-1.5">URL Slug</label>
                  <input type="text" placeholder="e.g., electronics" className="input w-full" />
                </div>
                <div>
                  <label className="label block mb-1.5">Icon (Emoji)</label>
                  <input type="text" placeholder="e.g., 💻" className="input w-full" />
                </div>
                <div>
                  <label className="label block mb-1.5">Description</label>
                  <textarea rows="3" placeholder="Brief description..." className="input w-full h-auto py-2 resize-none" />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="featured" className="w-4 h-4 rounded border-border accent-foreground cursor-pointer" />
                  <label htmlFor="featured" className="text-sm font-medium text-foreground cursor-pointer">Mark as featured category</label>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowAddModal(false)} className="btn btn-outline flex-1 py-2.5">
                  Cancel
                </button>
                <button className="btn btn-primary flex-1 py-2.5">
                  Create Category
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}