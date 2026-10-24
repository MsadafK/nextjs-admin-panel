'use client';
import { useState, useMemo } from 'react';
import {
  Search, Filter, Grid, List, Plus, Eye, Edit, Trash2,
  Star, Package, TrendingUp, DollarSign, Tag, Download,
  Heart, RefreshCw, X
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';

export default function ProductCatalogPage() {
  const {
    products,
    dbCategories,
    loading,
    error,
    refreshData,
    addProduct,
    editProduct,
    removeProduct,
  } = useProducts();

  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  /* ── Modal State ('view' | 'edit' | 'create' | null) ── */
  const [modalMode, setModalMode] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // 1. Dynamic Categories filter options
  const categories = useMemo(() => {
    const catMap = { all: { value: 'all', label: 'All Categories', count: products.length } };

    products.forEach((p) => {
      const catName = p.category || 'Uncategorized';
      if (!catMap[catName]) {
        catMap[catName] = { value: catName, label: catName, count: 0 };
      }
      catMap[catName].count++;
    });

    return Object.values(catMap);
  }, [products]);

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Draft' },
    { value: 'out-of-stock', label: 'Out of Stock' },
  ];

  // 2. Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q);
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchQuery, selectedCategory, selectedStatus]);

  // 3. Dynamic Stats (Total Inventory Value & Stock Metrics)
  const stats = useMemo(() => {
    const activeCount = products.filter((p) => p.status === 'active').length;
    const outOfStockCount = products.filter((p) => p.status === 'out-of-stock' || p.stock === 0).length;
    const inventoryValue = products.reduce((acc, p) => acc + p.price * (p.stock || 0), 0);

    const formattedValue =
      inventoryValue >= 100000
        ? `₹${(inventoryValue / 100000).toFixed(2)}L`
        : `₹${inventoryValue.toLocaleString()}`;

    return [
      { label: 'Total Products', value: products.length, icon: Package, iconColor: 'text-blue-500' },
      { label: 'Active Products', value: activeCount, icon: TrendingUp, iconColor: 'text-emerald-500' },
      { label: 'Inventory Value', value: formattedValue, icon: DollarSign, iconColor: 'text-purple-500' },
      { label: 'Out of Stock', value: outOfStockCount, icon: Tag, iconColor: 'text-orange-500' },
    ];
  }, [products]);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'draft':
        return 'bg-muted text-muted-foreground border-border';
      case 'out-of-stock':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-foreground border-border';
    }
  };

  const getStatusText = (status) => {
    if (!status) return 'Unknown';
    return status
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  /* ── CRUD Handlers ── */
  const handleOpenModal = (product, mode) => {
    if (product) {
      setCurrentProduct({ ...product });
    } else {
      setCurrentProduct({
        name: '',
        sku: `SKU-${Math.floor(100 + Math.random() * 900)}`,
        category_id: dbCategories[0]?.id || '',
        price: '',
        stock: 10,
        status: 'active',
        description: '',
      });
    }
    setModalMode(mode);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!currentProduct) return;

    try {
      setSubmitting(true);
      if (modalMode === 'create') {
        await addProduct(currentProduct);
      } else {
        await editProduct(currentProduct.id, currentProduct);
      }
      setModalMode(null);
      setCurrentProduct(null);
    } catch (err) {
      alert('Error saving product: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await removeProduct(id);
    } catch (err) {
      alert('Failed to delete product: ' + err.message);
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID,Name,SKU,Category,Price,Stock,Status'];
    const rows = filteredProducts.map(
      (p) => `${p.id},"${p.name}","${p.sku}","${p.category}",${p.price},${p.stock},${p.status}`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'products_catalog.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-container max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground mb-1">
            Product Catalog
          </h1>
          <p className="text-sm text-muted-foreground">
            Connected to Supabase PostgreSQL (`public.products`)
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={refreshData} className="btn btn-outline" title="Refresh Database">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={handleExportCSV} className="btn btn-outline">
            <Download size={16} />
            <span className="hidden sm:inline ml-2">Export CSV</span>
          </button>
          <button onClick={() => handleOpenModal(null, 'create')} className="btn btn-primary">
            <Plus size={16} />
            <span className="ml-2">Add Product</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="card p-4 border-destructive/40 bg-destructive/10 text-destructive text-sm flex items-center justify-between">
          <span><strong>Database Error:</strong> {error}</span>
          <button onClick={refreshData} className="btn btn-outline h-8 text-xs">Retry</button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card p-4 sm:p-5 shadow-card hover:shadow-dropdown transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="space-y-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-semibold tracking-tight text-foreground">
                    {loading ? '…' : stat.value}
                  </p>
                </div>
                <div className="p-2 rounded-md bg-muted flex-shrink-0">
                  <Icon size={20} className={stat.iconColor} strokeWidth={2} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className="card p-3 sm:p-4 shadow-card">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products by name, SKU, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-9 w-full"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input pl-9 pr-8 w-full lg:w-auto min-w-[180px] appearance-none"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label} ({cat.count})
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input w-full lg:w-auto min-w-[150px]"
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex bg-muted/50 p-1 rounded-md border border-border">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-all ${
                viewMode === 'grid'
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-all ${
                viewMode === 'list'
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid/List View */}
      {loading ? (
        <div className="flex items-center justify-center p-12 text-muted-foreground">
          <RefreshCw className="animate-spin mr-2" size={20} /> Loading products from Supabase...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="card p-12 text-center text-muted-foreground">
          No products found matching your filters.
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="card p-0 overflow-hidden hover:shadow-dropdown transition-all duration-300 hover:-translate-y-1 group flex flex-col"
            >
              <div className="relative bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 h-48 flex items-center justify-center flex-shrink-0">
                <span className="text-7xl group-hover:scale-110 transition-transform duration-300">
                  {product.image}
                </span>

                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenModal(product, 'view')}
                    className="bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-sm hover:bg-background transition-colors text-muted-foreground hover:text-foreground"
                    title="View Product"
                  >
                    <Eye size={16} />
                  </button>
                </div>

                <span className={`badge absolute top-3 left-3 ${getStatusBadge(product.status)}`}>
                  {getStatusText(product.status)}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground leading-tight mb-1 truncate">
                        {product.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-4">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold text-foreground">{product.rating}</span>
                    <span className="text-muted-foreground text-xs ml-1">({product.sold} sold)</span>
                  </div>

                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <p className="text-lg font-bold tracking-tight text-foreground">
                        ₹{Number(product.price).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-0.5">
                        Stock: <span className="font-semibold text-foreground">{product.stock}</span>
                      </p>
                      <p
                        className={`text-xs font-semibold ${
                          product.status === 'out-of-stock' ? 'text-destructive' : 'text-emerald-600'
                        }`}
                      >
                        {product.status === 'out-of-stock' ? 'Out of stock' : product.trend}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => handleOpenModal(product, 'edit')}
                    className="btn btn-outline flex-1 py-2"
                  >
                    <Edit size={14} className="mr-2" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id, product.name)}
                    className="btn btn-outline px-3 text-destructive hover:bg-destructive/10 border-transparent hover:border-destructive/20"
                    title="Delete Product"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-0 overflow-hidden shadow-card">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase tracking-wide text-xs">Product</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase tracking-wide text-xs">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase tracking-wide text-xs">Price</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase tracking-wide text-xs">Stock</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase tracking-wide text-xs">Status</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground uppercase tracking-wide text-xs">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3 min-w-[200px]">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-md flex items-center justify-center text-xl flex-shrink-0">
                          {product.image}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground truncate">SKU: {product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-foreground whitespace-nowrap">{product.category}</td>
                    <td className="py-3 px-4 font-semibold text-foreground whitespace-nowrap">
                      ₹{Number(product.price).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-foreground">{product.stock}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`badge ${getStatusBadge(product.status)}`}>
                        {getStatusText(product.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenModal(product, 'view')}
                          className="btn btn-ghost h-8 w-8 p-0"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenModal(product, 'edit')}
                          className="btn btn-ghost h-8 w-8 p-0"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id, product.name)}
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

      {/* ── View / Create / Edit Product Modal ── */}
      {modalMode && currentProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="card w-full max-w-md p-6 shadow-modal space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-lg font-semibold text-foreground">
                {modalMode === 'view'
                  ? 'Product Details'
                  : modalMode === 'create'
                  ? 'Add New Product'
                  : 'Edit Product'}
              </h2>
              <button
                onClick={() => {
                  setModalMode(null);
                  setCurrentProduct(null);
                }}
                className="btn btn-ghost h-8 w-8 p-0"
              >
                <X size={16} />
              </button>
            </div>

            {modalMode === 'view' ? (
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center text-3xl">
                    {currentProduct.image}
                  </div>
                  <div>
                    <p className="font-semibold text-base text-foreground">{currentProduct.name}</p>
                    <p className="text-xs text-muted-foreground">SKU: {currentProduct.sku}</p>
                  </div>
                </div>
                {currentProduct.description && (
                  <p className="text-muted-foreground border-t border-border pt-3">
                    {currentProduct.description}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Category</p>
                    <p className="font-medium text-foreground mt-0.5">{currentProduct.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Price</p>
                    <p className="font-semibold text-foreground mt-0.5">
                      ₹{Number(currentProduct.price).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Stock Quantity</p>
                    <p className="font-medium text-foreground mt-0.5">{currentProduct.stock} units</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Status</p>
                    <p className="font-medium text-foreground mt-0.5">
                      {getStatusText(currentProduct.status)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-border">
                  <button onClick={() => setModalMode('edit')} className="btn btn-primary">
                    <Edit size={14} className="mr-1.5" /> Edit Product
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div>
                  <label className="label block mb-1.5">Product Name</label>
                  <input
                    type="text"
                    required
                    value={currentProduct.name}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                    className="input w-full"
                    placeholder="e.g. Mechanical Keyboard RGB"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label block mb-1.5">SKU</label>
                    <input
                      type="text"
                      required
                      value={currentProduct.sku}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, sku: e.target.value })}
                      className="input w-full"
                      placeholder="ELC-101"
                    />
                  </div>
                  <div>
                    <label className="label block mb-1.5">Category</label>
                    <select
                      value={currentProduct.category_id || ''}
                      onChange={(e) =>
                        setCurrentProduct({ ...currentProduct, category_id: e.target.value })
                      }
                      className="input w-full"
                    >
                      <option value="">Uncategorized</option>
                      {dbCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label block mb-1.5">Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={currentProduct.price}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
                      className="input w-full"
                      placeholder="1999"
                    />
                  </div>
                  <div>
                    <label className="label block mb-1.5">Stock Quantity</label>
                    <input
                      type="number"
                      required
                      value={currentProduct.stock}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, stock: e.target.value })}
                      className="input w-full"
                      placeholder="50"
                    />
                  </div>
                </div>

                <div>
                  <label className="label block mb-1.5">Status</label>
                  <select
                    value={currentProduct.status}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, status: e.target.value })}
                    className="input w-full"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>

                <div>
                  <label className="label block mb-1.5">Description</label>
                  <textarea
                    rows={2}
                    value={currentProduct.description || ''}
                    onChange={(e) =>
                      setCurrentProduct({ ...currentProduct, description: e.target.value })
                    }
                    className="input w-full py-2"
                    placeholder="Short product description..."
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => {
                      setModalMode(null);
                      setCurrentProduct(null);
                    }}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn btn-primary">
                    {submitting
                      ? 'Saving…'
                      : modalMode === 'create'
                      ? 'Create Product'
                      : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}