'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderOpen, Plus, Search, Edit2, Trash2, Eye, Package,
  TrendingUp, Tag, Grid3x3, List, Star, RefreshCw, X
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';

export default function ManageCategoriesPage() {
  const router = useRouter();
  const {
    products,
    enrichedCategories,
    loading,
    error,
    refreshData,
    addCategory,
    editCategory,
    removeCategory,
  } = useProducts();

  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | 'view' | null
  const [currentCat, setCurrentCat] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const filteredCategories = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return enrichedCategories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q)
    );
  }, [enrichedCategories, searchQuery]);

  const stats = useMemo(() => {
    const totalRev = enrichedCategories.reduce((sum, c) => sum + (c.revenueValue || 0), 0);
    const activeProds = products.filter((p) => p.status === 'active').length;

    return [
      { label: 'Total Categories', value: enrichedCategories.length, icon: FolderOpen, iconClass: 'text-blue-500', bgClass: 'bg-blue-500/10' },
      { label: 'Active Products', value: activeProds, icon: Package, iconClass: 'text-emerald-500', bgClass: 'bg-emerald-500/10' },
      { label: 'Total Catalog Items', value: products.length, icon: Tag, iconClass: 'text-purple-500', bgClass: 'bg-purple-500/10' },
      { label: 'Category Inventory Value', value: `₹${totalRev.toLocaleString()}`, icon: TrendingUp, iconClass: 'text-orange-500', bgClass: 'bg-orange-500/10' },
    ];
  }, [enrichedCategories, products]);

  const getStatusBadge = (status) => {
    return status === 'active'
      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
      : 'bg-muted text-muted-foreground border-border';
  };

  const handleOpenModal = (cat, mode) => {
    if (cat) {
      setCurrentCat({ ...cat });
    } else {
      setCurrentCat({
        name: '',
        slug: '',
        description: '',
        status: 'active',
      });
    }
    setModalMode(mode);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!currentCat?.name?.trim()) return;

    try {
      setSubmitting(true);
      if (modalMode === 'create') {
        await addCategory(currentCat);
      } else {
        await editCategory(currentCat.id, currentCat);
      }
      setModalMode(null);
      setCurrentCat(null);
    } catch (err) {
      alert('Error saving category: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await removeCategory(id);
    } catch (err) {
      alert('Failed to delete category: ' + err.message);
    }
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
          <p className="text-sm text-muted-foreground">
            Connected to Supabase PostgreSQL (`public.categories`)
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={refreshData} className="btn btn-outline py-2.5" title="Refresh">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => router.push('/products/categories/add')}
            className="btn btn-outline py-2.5"
          >
            Full Add Page
          </button>
          <button
            onClick={() => handleOpenModal(null, 'create')}
            className="btn btn-primary py-2.5"
          >
            <Plus size={16} />
            <span className="ml-2">Quick Add</span>
          </button>
        </div>
      </motion.div>

      {error && (
        <div className="card p-4 border-destructive/40 bg-destructive/10 text-destructive text-sm">
          <strong>Database Error:</strong> {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="card p-4 sm:p-5 shadow-card hover:shadow-dropdown transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bgClass} w-10 h-10 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.iconClass}`} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-semibold tracking-tight text-foreground mb-1">
                {loading ? '…' : stat.value}
              </h3>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {stat.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search & View Mode */}
      <div className="card p-3 sm:p-4 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search categories by name or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-9 w-full"
          />
        </div>

        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-md border border-border self-start md:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded transition-all ${
              viewMode === 'grid'
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Grid View"
          >
            <Grid3x3 size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded transition-all ${
              viewMode === 'list'
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="List View"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Categories Grid/List */}
      {loading ? (
        <div className="card p-12 text-center text-muted-foreground flex items-center justify-center gap-2">
          <RefreshCw size={18} className="animate-spin" /> Loading categories from Supabase...
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="card p-12 text-center text-muted-foreground">
          No categories found matching your search.
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.04 }}
              className="card p-0 shadow-card hover:shadow-dropdown transition-all duration-300 overflow-hidden group flex flex-col hover:-translate-y-1"
            >
              <div className="h-32 bg-muted/30 border-b border-border relative flex items-center justify-center">
                <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </span>
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
                <h3 className="text-lg font-semibold text-foreground mb-0.5">{category.name}</h3>
                <p className="text-xs text-muted-foreground mb-4">/{category.slug}</p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-muted/50 rounded-lg p-3 border border-border">
                    <p className="text-[10px] uppercase font-semibold text-muted-foreground mb-1">
                      Products
                    </p>
                    <p className="text-base font-semibold text-foreground">{category.products}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 border border-border">
                    <p className="text-[10px] uppercase font-semibold text-muted-foreground mb-1">
                      Subcategories
                    </p>
                    <p className="text-base font-semibold text-foreground">{category.subcategories}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-5 px-1">
                  <div>
                    <p className="text-[10px] uppercase font-semibold text-muted-foreground">
                      Stock Value
                    </p>
                    <p className="text-sm font-medium text-foreground">{category.revenue}</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600">{category.growth}</span>
                </div>

                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => handleOpenModal(category, 'edit')}
                    className="btn btn-outline flex-1 py-2"
                  >
                    <Edit2 size={14} className="mr-2" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id, category.name)}
                    className="btn btn-outline px-3 text-destructive hover:bg-destructive/10 border-transparent hover:border-destructive/20"
                    title="Delete Category"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="card p-0 shadow-card overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Products</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Stock Value</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Growth</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 min-w-[200px]">
                        <div className="w-10 h-10 rounded-lg bg-muted border border-border flex items-center justify-center text-xl flex-shrink-0">
                          {category.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground flex items-center gap-2 truncate">
                            {category.name}
                            {category.featured && (
                              <Star size={14} className="text-amber-400 fill-amber-400 flex-shrink-0" />
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">/{category.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-foreground">{category.products}</td>
                    <td className="px-6 py-4 font-medium text-foreground">{category.revenue}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-xs text-emerald-600">{category.growth}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge capitalize ${getStatusBadge(category.status)}`}>
                        {category.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenModal(category, 'edit')}
                          className="btn btn-ghost h-8 w-8 p-0 text-muted-foreground"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id, category.name)}
                          className="btn btn-ghost h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                          title="Delete"
                        >
                          <Trash2 size={16} />
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

      {/* Add / Edit Category Modal */}
      <AnimatePresence>
        {modalMode && currentCat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setModalMode(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="card max-w-md w-full shadow-dropdown p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  {modalMode === 'create' ? 'Add New Category' : 'Edit Category'}
                </h2>
                <button
                  onClick={() => setModalMode(null)}
                  className="btn btn-ghost p-1.5 h-auto text-muted-foreground hover:bg-muted"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div>
                  <label className="label block mb-1.5">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={currentCat.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCurrentCat({
                        ...currentCat,
                        name: val,
                        slug: val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                      });
                    }}
                    placeholder="e.g., Electronics"
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="label block mb-1.5">URL Slug</label>
                  <input
                    type="text"
                    value={currentCat.slug || ''}
                    onChange={(e) => setCurrentCat({ ...currentCat, slug: e.target.value })}
                    placeholder="e.g., electronics"
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="label block mb-1.5">Description</label>
                  <textarea
                    rows="3"
                    value={currentCat.description || ''}
                    onChange={(e) => setCurrentCat({ ...currentCat, description: e.target.value })}
                    placeholder="Brief description..."
                    className="input w-full h-auto py-2 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setModalMode(null)}
                    className="btn btn-outline flex-1 py-2.5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary flex-1 py-2.5"
                  >
                    {submitting
                      ? 'Saving...'
                      : modalMode === 'create'
                      ? 'Create Category'
                      : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}