// app/products/categories/add/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Tag,
  FileText,
  Hash,
  Check,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Layers,
  Eye,
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import ProductPageHeader from '@/app/components/Products/ProductPageHeader';
import ProductKpiSummary from '@/app/components/Products/ProductKpiSummary';

export default function AddCategoryPage() {
  const router = useRouter();
  const { addCategory, categoriesWithStats, products, dbCategories, loading, refreshData } = useProducts();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    status: 'active',
  });
  const [autoSlug, setAutoSlug] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const generateSlug = (value) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: autoSlug ? generateSlug(name) : prev.slug,
    }));
  };

  const handleSlugChange = (e) => {
    setAutoSlug(false);
    setFormData((prev) => ({
      ...prev,
      slug: generateSlug(e.target.value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.name.trim()) {
      setError('Category name is required.');
      return;
    }

    try {
      setSubmitting(true);
      await addCategory({
        name: formData.name.trim(),
        slug: formData.slug || generateSlug(formData.name),
        description: formData.description.trim(),
        status: formData.status,
      });

      setSuccess(true);
      setFormData({ name: '', slug: '', description: '', status: 'active' });
      setAutoSlug(true);
    } catch (err) {
      console.error('Error creating category:', err);
      setError(err.message || 'Failed to create category in Supabase.');
    } finally {
      setSubmitting(false);
    }
  };

  const previewIcon = (formData.name || 'C').slice(0, 2).toUpperCase();

  return (
    <div className="page-container mx-auto max-w-7xl space-y-6">
      <ProductPageHeader title="Add New Category" description="Create a category in the live public.categories table." loading={loading} onRefresh={refreshData} products={products} primaryLabel="Manage Categories" primaryHref="/products/categories/manage"/>
      <ProductKpiSummary products={products} categories={dbCategories} loading={loading}/>

      {error && (
        <div className="card p-4 border-foreground bg-muted text-foreground text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          <span>
            <strong>Error:</strong> {error}
          </span>
        </div>
      )}

      {success && (
        <div className="card p-4 border-foreground bg-muted text-foreground text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Check size={16} />
            <span>
              <strong>Success!</strong> Category has been saved to Supabase.
            </span>
          </div>
          <button
            type="button"
            onClick={() => router.push('/products/categories/manage')}
            className="btn btn-primary bg-foreground text-background hover:bg-foreground/90 h-8 text-xs self-start sm:self-auto"
          >
            View All Categories →
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-border bg-background p-5 shadow-card sm:p-6 space-y-5 xl:col-span-2"
        >
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Layers size={18} className="text-foreground" />
            <h2 className="text-base font-semibold text-foreground">Category Details</h2>
          </div>

          <div className="space-y-1.5">
            <label className="label block">
              Category Name <span className="text-foreground">*</span>
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={handleNameChange}
                placeholder="e.g. Electronics, Home & Kitchen, Fitness"
                className="input pl-9 w-full"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="label block">URL Slug</label>
              <span className="text-xs text-muted-foreground">Auto-generated from name</span>
            </div>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={formData.slug}
                onChange={handleSlugChange}
                placeholder="e.g. electronics"
                className="input pl-9 w-full font-mono text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="label block">Description</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what types of products belong in this category..."
                className="input pl-9 py-2 w-full"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="label block">Visibility Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="input w-full"
            >
              <option value="active">Active (Visible in Catalog)</option>
              <option value="inactive">Inactive (Hidden)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => router.push('/products/categories/manage')}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary bg-foreground text-background hover:bg-foreground/90"
            >
              <Check size={16} className="mr-2" />
              {submitting ? 'Creating in Supabase...' : 'Create Category'}
            </button>
          </div>
        </form>

        <div className="space-y-6">
          <div className="card p-5 shadow-card space-y-4 border border-border">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Eye size={16} className="text-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Live Preview</h3>
            </div>

            <div className="p-4 rounded-lg bg-muted border border-border space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center text-xl">
                    {previewIcon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {formData.name || 'Category Name'}
                    </h4>
                    <p className="text-xs text-muted-foreground font-mono">
                      /{formData.slug || 'category-slug'}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-mono font-medium border ${
                    formData.status === 'active'
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-background text-muted-foreground border-border'
                  }`}
                >
                  {formData.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2">
                {formData.description || 'Category description will appear here...'}
              </p>
            </div>
          </div>

          <div className="card p-5 shadow-card space-y-3 border border-border">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-foreground" />
                <h3 className="text-sm font-semibold text-foreground">
                  Existing Categories ({categoriesWithStats.length})
                </h3>
              </div>
            </div>

            {loading ? (
              <p className="text-xs text-muted-foreground py-3">Loading from Supabase...</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {categoriesWithStats.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-2.5 rounded-md bg-muted border border-border text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="flex h-7 w-7 items-center justify-center rounded bg-foreground font-mono text-[10px] text-background">{cat.name?.slice(0, 2).toUpperCase()}</span>
                      <span className="font-medium text-foreground truncate">{cat.name}</span>
                    </div>
                    <span className="text-muted-foreground flex-shrink-0">
                      {cat.productCount} SKUs
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
