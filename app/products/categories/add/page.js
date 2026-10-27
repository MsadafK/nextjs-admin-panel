'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FolderPlus, Tag, FileText, Layers, Star, Eye, EyeOff,
  Check, AlertCircle, Sparkles, Palette, Link as LinkIcon, ArrowLeft
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';

export default function AddCategoryPage() {
  const router = useRouter();
  const { dbCategories, addCategory } = useProducts();

  const [categoryName, setCategoryName]   = useState('');
  const [slug, setSlug]                   = useState('');
  const [description, setDescription]     = useState('');
  const [selectedColor, setSelectedColor] = useState('from-blue-500 to-cyan-500');
  const [selectedIcon, setSelectedIcon]   = useState('📦');
  const [isVisible, setIsVisible]         = useState(true);
  const [isFeatured, setIsFeatured]       = useState(false);
  const [parentCategory, setParentCategory] = useState('none');
  const [metaTitle, setMetaTitle]         = useState('');
  const [metaDesc, setMetaDesc]           = useState('');

  const [submitting, setSubmitting]       = useState(false);
  const [errorMsg, setErrorMsg]           = useState('');
  const [successMsg, setSuccessMsg]       = useState('');

  const colorOptions = [
    { name: 'Blue', gradient: 'from-blue-500 to-cyan-500' },
    { name: 'Purple', gradient: 'from-purple-500 to-pink-500' },
    { name: 'Green', gradient: 'from-green-500 to-emerald-500' },
    { name: 'Orange', gradient: 'from-orange-500 to-red-500' },
    { name: 'Indigo', gradient: 'from-indigo-500 to-purple-500' },
    { name: 'Pink', gradient: 'from-pink-500 to-rose-500' },
    { name: 'Yellow', gradient: 'from-yellow-500 to-orange-500' },
    { name: 'Slate', gradient: 'from-slate-500 to-gray-500' },
    { name: 'Teal', gradient: 'from-teal-500 to-cyan-500' },
    { name: 'Violet', gradient: 'from-violet-500 to-purple-500' },
  ];

  const iconOptions = ['📦', '💻', '👕', '🏡', '⚽', '📚', '💄', '🎮', '🚗', '🍔', '✈️', '🎨', '🎵', '📱', '⌚', '🎯'];

  const handleNameChange = (value) => {
    setCategoryName(value);
    const autoSlug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setSlug(autoSlug);
  };

  const handleCreateCategory = async (e) => {
    if (e) e.preventDefault();
    if (!categoryName.trim()) {
      setErrorMsg('Category Name is required.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');
      await addCategory({
        name: categoryName.trim(),
        slug: slug.trim(),
        description: description.trim() || metaDesc.trim(),
        parent_id: parentCategory !== 'none' ? parentCategory : null,
        status: isVisible ? 'active' : 'inactive',
      });

      setSuccessMsg(`Category "${categoryName}" saved to Supabase successfully!`);
      setCategoryName('');
      setSlug('');
      setDescription('');
      setMetaTitle('');
      setMetaDesc('');
    } catch (err) {
      console.error('Error creating category:', err);
      setErrorMsg(err.message || 'Failed to create category in Supabase.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground flex items-center gap-3">
              <FolderPlus size={28} />
              Add New Category
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create a new product category in Supabase (`public.categories`)
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push('/products/categories/manage')}
              className="px-4 py-2 bg-card border border-border rounded-lg text-foreground hover:bg-muted transition-all flex items-center gap-2 text-sm"
            >
              <ArrowLeft size={16} />
              Back to Categories
            </button>
            <button
              type="button"
              onClick={handleCreateCategory}
              disabled={submitting}
              className="px-6 py-2 bg-foreground text-background rounded-lg hover:opacity-90 transition-all flex items-center gap-2 text-sm font-medium disabled:opacity-50"
            >
              <Check size={18} />
              {submitting ? 'Creating...' : 'Create Category'}
            </button>
          </div>
        </motion.div>

        {errorMsg && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check size={18} />
              <span>{successMsg}</span>
            </div>
            <button
              onClick={() => router.push('/products/categories/manage')}
              className="btn btn-primary h-8 text-xs"
            >
              View Categories →
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-muted rounded-lg">
                  <FileText className="text-foreground" size={20} />
                </div>
                <h2 className="text-base font-semibold text-foreground">Basic Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g., Electronics, Fashion, Home Decor"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    URL Slug *
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="e.g., electronics"
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Description
                  </label>
                  <textarea
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Write a brief description about this category..."
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Appearance */}
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-muted rounded-lg">
                  <Palette className="text-foreground" size={20} />
                </div>
                <h2 className="text-base font-semibold text-foreground">Appearance</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Category Color
                  </label>
                  <div className="grid grid-cols-5 gap-3">
                    {colorOptions.map((color) => (
                      <button
                        type="button"
                        key={color.name}
                        onClick={() => setSelectedColor(color.gradient)}
                        className={`relative h-12 rounded-lg bg-gradient-to-br ${color.gradient} transition-all hover:scale-105 ${
                          selectedColor === color.gradient ? 'ring-2 ring-foreground ring-offset-2' : ''
                        }`}
                      >
                        {selectedColor === color.gradient && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check className="text-white" size={20} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Category Icon
                  </label>
                  <div className="grid grid-cols-8 gap-3">
                    {iconOptions.map((icon) => (
                      <button
                        type="button"
                        key={icon}
                        onClick={() => setSelectedIcon(icon)}
                        className={`h-12 rounded-lg bg-muted hover:bg-muted/80 transition-all text-2xl flex items-center justify-center ${
                          selectedIcon === icon ? 'ring-2 ring-foreground ring-offset-2' : ''
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Hierarchy (Connected to Live Categories) */}
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-muted rounded-lg">
                  <Layers className="text-foreground" size={20} />
                </div>
                <h2 className="text-base font-semibold text-foreground">Category Hierarchy</h2>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Parent Category (from Supabase)
                </label>
                <select
                  value={parentCategory}
                  onChange={(e) => setParentCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="none">None (Top Level Category)</option>
                  {dbCategories.map((parent) => (
                    <option key={parent.id} value={parent.id}>
                      {parent.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-muted rounded-lg">
                  <Tag className="text-foreground" size={20} />
                </div>
                <h2 className="text-base font-semibold text-foreground">SEO Settings</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="Optimize for search engines"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Meta Description
                  </label>
                  <textarea
                    rows="3"
                    value={metaDesc}
                    onChange={(e) => setMetaDesc(e.target.value)}
                    placeholder="Brief description for search results..."
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Preview & Settings */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-purple-600" size={20} />
                <h3 className="font-bold text-foreground">Live Preview</h3>
              </div>

              <div className="bg-muted/40 rounded-lg p-4 border border-border">
                <div className={`h-32 bg-gradient-to-br ${selectedColor} rounded-lg relative overflow-hidden mb-4`}>
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute bottom-3 left-3 text-5xl">{selectedIcon}</div>
                </div>

                <h3 className="text-lg font-bold text-foreground mb-1">
                  {categoryName || 'Category Name'}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  /{slug || 'category-slug'}
                </p>

                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-1 bg-muted rounded-full text-foreground">
                    0 Products
                  </span>
                  {isFeatured && (
                    <span className="px-2 py-1 bg-yellow-100 rounded-full text-yellow-700 flex items-center gap-1">
                      <Star size={12} className="fill-yellow-500" />
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <h3 className="font-bold text-foreground mb-4">Category Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    {isVisible ? <Eye size={18} className="text-green-600" /> : <EyeOff size={18} className="text-muted-foreground" />}
                    <div>
                      <p className="font-medium text-foreground text-sm">Visibility</p>
                      <p className="text-xs text-muted-foreground">Active in catalog</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={() => setIsVisible(!isVisible)}
                    className="w-5 h-5 accent-foreground cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Star size={18} className={isFeatured ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'} />
                    <div>
                      <p className="font-medium text-foreground text-sm">Featured</p>
                      <p className="text-xs text-muted-foreground">Highlight category</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={() => setIsFeatured(!isFeatured)}
                    className="w-5 h-5 accent-foreground cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}