// app/products/categories/manage/page.js
'use client';

import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Tag, RefreshCw, X, Check } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';

export default function ManageCategoriesPage() {
  const {
    categoriesWithStats,
    loading,
    error,
    refreshData,
    editCategory,
    removeCategory,
    addCategory,
  } = useProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalMode, setModalMode] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const filteredCategories = (categoriesWithStats || []).filter(
    (cat) =>
      cat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (cat, mode) => {
    if (mode === 'edit') {
      setCurrentCategory({ ...cat });
    } else {
      setCurrentCategory({ name: '', description: '', status: 'active' });
    }
    setModalMode(mode);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!currentCategory?.name) return;

    try {
      setSubmitting(true);
      if (modalMode === 'edit') {
        await editCategory(currentCategory.id, currentCategory);
      } else {
        await addCategory(currentCategory);
      }
      setModalMode(null);
      setCurrentCategory(null);
    } catch (err) {
      alert('Error saving category: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (
      !window.confirm(
        `Are you sure you want to delete category "${name}"? Products inside might become uncategorized.`
      )
    )
      return;
    try {
      await removeCategory(id);
    } catch (err) {
      alert('Failed to delete category: ' + err.message);
    }
  };

  return (
    <div className="page-container max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground mb-1 flex items-center gap-2">
            <Tag size={22} className="text-foreground" />
            Manage Categories
          </h1>
          <p className="text-sm text-muted-foreground">
            Organize and track your product inventory structure (`public.categories`)
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={refreshData} className="btn btn-outline" title="Refresh DB">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => handleOpenModal(null, 'add')}
            className="btn btn-primary bg-foreground text-background hover:bg-foreground/90"
          >
            <Plus size={16} className="mr-2" /> Add Category
          </button>
        </div>
      </div>

      {error && (
        <div className="card p-4 border-foreground bg-muted text-foreground text-sm">
          <strong>Database Error:</strong> {error}
        </div>
      )}

      <div className="card p-4 shadow-card border border-border">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-9 w-full"
          />
        </div>
      </div>

      <div className="card p-0 overflow-hidden shadow-card border border-border">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
            <RefreshCw className="animate-spin mb-2" size={24} />
            Syncing categories from Supabase...
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No categories found. Click &quot;Add Category&quot; to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase text-xs">
                    Category Name
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase text-xs">
                    Total Products
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase text-xs">
                    Stock Units
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase text-xs">
                    Inventory Value
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase text-xs">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground uppercase text-xs">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{cat.icon}</span>
                        <div>
                          <p className="font-semibold text-foreground">{cat.name}</p>
                          {cat.description && (
                            <p className="text-xs text-muted-foreground truncate max-w-[220px]">
                              {cat.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-foreground">
                      {cat.productCount ?? cat.products ?? 0} SKUs
                    </td>
                    <td className="py-3 px-4 text-foreground">{cat.totalStock ?? 0} units</td>
                    <td className="py-3 px-4 font-bold text-foreground">
                      ₹{Number(cat.totalValue ?? cat.revenueValue ?? 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-md text-xs font-mono font-medium border ${
                          cat.status === 'active'
                            ? 'bg-foreground text-background border-foreground'
                            : 'bg-muted text-muted-foreground border-border'
                        }`}
                      >
                        {cat.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenModal(cat, 'edit')}
                          className="btn btn-ghost h-8 w-8 p-0 text-foreground hover:bg-muted"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id, cat.name)}
                          className="btn btn-ghost h-8 w-8 p-0 text-foreground hover:bg-muted"
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
        )}
      </div>

      {modalMode && currentCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="card w-full max-w-md p-6 shadow-modal space-y-4 border border-border bg-background">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-lg font-semibold text-foreground">
                {modalMode === 'add' ? 'Create New Category' : 'Edit Category'}
              </h2>
              <button onClick={() => setModalMode(null)} className="btn btn-ghost h-8 w-8 p-0">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="label block mb-1.5 text-xs font-semibold uppercase">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={currentCategory.name}
                  onChange={(e) =>
                    setCurrentCategory({ ...currentCategory, name: e.target.value })
                  }
                  placeholder="e.g. Electronics"
                  className="input w-full"
                />
              </div>

              <div>
                <label className="label block mb-1.5 text-xs font-semibold uppercase">
                  Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={currentCategory.description || ''}
                  onChange={(e) =>
                    setCurrentCategory({ ...currentCategory, description: e.target.value })
                  }
                  className="input w-full py-2"
                />
              </div>

              <div>
                <label className="label block mb-1.5 text-xs font-semibold uppercase">Status</label>
                <select
                  value={currentCategory.status}
                  onChange={(e) =>
                    setCurrentCategory({ ...currentCategory, status: e.target.value })
                  }
                  className="input w-full"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary bg-foreground text-background hover:bg-foreground/90"
                >
                  <Check size={15} className="mr-1.5" />
                  {submitting ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}