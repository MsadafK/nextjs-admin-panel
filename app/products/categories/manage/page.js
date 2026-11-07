// app/products/categories/manage/page.js
'use client';

import { useState } from 'react';
import { Search, Edit, Trash2, RefreshCw, X, Check } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import ProductPageHeader from '@/app/components/Products/ProductPageHeader';
import ProductKpiSummary from '@/app/components/Products/ProductKpiSummary';

export default function ManageCategoriesPage() {
  const {
    categoriesWithStats,
    products,
    dbCategories,
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

  const exportCategories = () => {
    const header = 'Category,Linked SKUs,Stock Units,Category Valuation,Status';
    const rows = filteredCategories.map((cat) => [cat.name, cat.productCount, cat.totalStock, cat.totalValue, cat.status].map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(','));
    const url = URL.createObjectURL(new Blob([[header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'product_categories.csv'; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

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
    <div className="page-container mx-auto max-w-7xl space-y-6">
      <ProductPageHeader title="Category Management" description="Organize live categories and see the products, stock, and valuation linked to each." loading={loading} onRefresh={refreshData} products={products} onExport={exportCategories} primaryLabel="Add Category" onPrimary={() => handleOpenModal(null, 'add')}/>
      <ProductKpiSummary products={products} categories={dbCategories} loading={loading}/>

      {error && (
        <div className="card p-4 border-foreground bg-muted text-foreground text-sm">
          <strong>Database Error:</strong> {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">{(categoriesWithStats || []).slice(0, 4).map((cat) => <article key={cat.id} className="rounded-xl border border-border bg-card p-4"><p className="truncate text-sm font-semibold text-foreground">{cat.name}</p><p className="mt-2 font-mono text-lg font-semibold text-foreground">₹{Number(cat.totalValue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p><p className="mt-1 text-xs text-muted-foreground">{cat.productCount} SKUs · {cat.totalStock} units</p></article>)}</div>

      <div className="rounded-xl border border-border bg-muted/20 p-3.5">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-xs text-foreground"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
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
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase text-xs">
                    Category Name
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase text-xs">
                    Linked SKUs
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase text-xs">
                    Stock Units
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase text-xs">
                    Category Valuation
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
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground font-mono text-xs font-semibold text-background">{cat.name?.slice(0, 2).toUpperCase()}</span>
                        <div>
                          <p className="font-semibold text-foreground">{cat.name}</p>
                          {cat.description && <p className="text-xs text-muted-foreground">{cat.description}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-foreground">
                      {cat.productCount ?? cat.products ?? 0} SKUs
                    </td>
                    <td className="py-3 px-4 text-foreground">{cat.totalStock ?? 0} units</td>
                    <td className="py-3 px-4 font-mono text-xs font-semibold text-foreground whitespace-nowrap">
                      ₹{Number(cat.totalValue ?? cat.revenueValue ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium text-foreground hover:bg-muted"
                          title="Edit"
                        >
                          <Edit size={13} /> Rename
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id, cat.name)}
                          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium text-foreground hover:bg-muted"
                          title="Delete"
                        >
                          <Trash2 size={13} /> Delete
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
