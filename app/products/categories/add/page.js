'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FolderPlus,
  Image as ImageIcon,
  Tag,
  FileText,
  Layers,
  Star,
  Eye,
  EyeOff,
  Upload,
  X,
  Check,
  AlertCircle,
  Sparkles,
  Palette,
  Type,
  Link as LinkIcon
} from 'lucide-react';

export default function AddCategoryPage() {
  const [categoryName, setCategoryName] = useState('');
  const [slug, setSlug] = useState('');
  const [selectedColor, setSelectedColor] = useState('from-blue-500 to-cyan-500');
  const [selectedIcon, setSelectedIcon] = useState('📦');
  const [isVisible, setIsVisible] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [parentCategory, setParentCategory] = useState('none');

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
    { name: 'Violet', gradient: 'from-violet-500 to-purple-500' }
  ];

  const iconOptions = ['📦', '💻', '👕', '🏡', '⚽', '📚', '💄', '🎮', '🚗', '🍔', '✈️', '🎨', '🎵', '📱', '⌚', '🎯'];

  const parentCategories = [
    'Electronics',
    'Clothing & Fashion',
    'Home & Garden',
    'Sports & Fitness',
    'Books & Media'
  ];

  const handleNameChange = (value) => {
    setCategoryName(value);
    // Auto-generate slug
    const autoSlug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setSlug(autoSlug);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
              <FolderPlus size={32} />
              Add New Category
            </h1>
            <p className="text-slate-600 mt-1">Create a new product category with custom settings</p>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-slate-300 transition-all">
              Cancel
            </button>
            <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
              <Check size={18} />
              Create Category
            </button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Basic Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                  <FileText className="text-white" size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Basic Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g., Electronics, Fashion, Home Decor"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                  <p className="text-xs text-slate-500 mt-1">This will be displayed to customers</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    URL Slug *
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="e.g., electronics"
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    URL: yourstore.com/category/<span className="font-semibold text-purple-600">{slug || 'slug'}</span>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Write a brief description about this category..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
                  />
                  <p className="text-xs text-slate-500 mt-1">Help customers understand what products are in this category</p>
                </div>
              </div>
            </div>

            {/* Appearance */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                  <Palette className="text-white" size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Appearance</h2>
              </div>

              <div className="space-y-6">
                {/* Color Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Category Color
                  </label>
                  <div className="grid grid-cols-5 gap-3">
                    {colorOptions.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.gradient)}
                        className={`relative h-12 rounded-lg bg-gradient-to-br ${color.gradient} transition-all hover:scale-105 ${
                          selectedColor === color.gradient ? 'ring-4 ring-purple-500 ring-offset-2' : ''
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

                {/* Icon Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Category Icon
                  </label>
                  <div className="grid grid-cols-8 gap-3">
                    {iconOptions.map((icon) => (
                      <button
                        key={icon}
                        onClick={() => setSelectedIcon(icon)}
                        className={`h-12 rounded-lg bg-slate-50 hover:bg-slate-100 transition-all text-2xl flex items-center justify-center ${
                          selectedIcon === icon ? 'ring-4 ring-purple-500 ring-offset-2 bg-slate-100' : ''
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cover Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Cover Image (Optional)
                  </label>
                  <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:border-purple-400 transition-all cursor-pointer bg-slate-50">
                    <Upload className="mx-auto text-slate-400 mb-3" size={32} />
                    <p className="text-sm font-medium text-slate-700 mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-slate-500">
                      SVG, PNG, JPG or GIF (max. 2MB)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hierarchy */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                  <Layers className="text-white" size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Category Hierarchy</h2>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Parent Category
                </label>
                <select
                  value={parentCategory}
                  onChange={(e) => setParentCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="none">None (Top Level Category)</option>
                  {parentCategories.map((parent) => (
                    <option key={parent} value={parent}>{parent}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">
                  Select a parent category to create a subcategory
                </p>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                  <Tag className="text-white" size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">SEO Settings</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    placeholder="Optimize for search engines"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Brief description for search results..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
                  />
                  <p className="text-xs text-slate-500 mt-1">Recommended: 150-160 characters</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar - Preview & Settings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Live Preview */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-purple-600" size={20} />
                <h3 className="font-bold text-slate-800">Live Preview</h3>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4">
                <div className={`h-32 bg-gradient-to-br ${selectedColor} rounded-lg relative overflow-hidden mb-4`}>
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute bottom-3 left-3 text-5xl">
                    {selectedIcon}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-1">
                  {categoryName || 'Category Name'}
                </h3>
                <p className="text-sm text-slate-500 mb-3">
                  /{slug || 'category-slug'}
                </p>

                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-1 bg-slate-200 rounded-full text-slate-700">
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

            {/* Settings */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4">Category Settings</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {isVisible ? <Eye size={18} className="text-green-600" /> : <EyeOff size={18} className="text-slate-400" />}
                    <div>
                      <p className="font-medium text-slate-800 text-sm">Visibility</p>
                      <p className="text-xs text-slate-500">Show to customers</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsVisible(!isVisible)}
                    className={`relative w-12 h-6 rounded-full transition-all ${
                      isVisible ? 'bg-green-500' : 'bg-slate-300'
                    }`}
                  >
                    <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all ${
                      isVisible ? 'left-6' : 'left-0.5'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Star size={18} className={isFeatured ? 'text-yellow-500 fill-yellow-500' : 'text-slate-400'} />
                    <div>
                      <p className="font-medium text-slate-800 text-sm">Featured</p>
                      <p className="text-xs text-slate-500">Highlight category</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsFeatured(!isFeatured)}
                    className={`relative w-12 h-6 rounded-full transition-all ${
                      isFeatured ? 'bg-yellow-500' : 'bg-slate-300'
                    }`}
                  >
                    <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all ${
                      isFeatured ? 'left-6' : 'left-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Help Card */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white">
              <AlertCircle className="mb-3 opacity-90" size={24} />
              <h3 className="font-bold mb-2">Quick Tips</h3>
              <ul className="text-sm space-y-2 text-purple-100">
                <li>• Use clear, descriptive names</li>
                <li>• Choose relevant icons & colors</li>
                <li>• Optimize SEO for better reach</li>
                <li>• Featured categories get priority</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}