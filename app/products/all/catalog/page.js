'use client';
import { useState, useMemo } from 'react';
import { Search, Filter, Grid, List, Plus, Eye, Edit, Trash2, Star, Package, TrendingUp, DollarSign, Tag, Download, Upload, Heart, RefreshCw } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';

export default function ProductCatalogPage() {
  const { products, loading, error, refreshData } = useProducts();

  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // 1. Dynamic Categories based on live database products
  const categories = useMemo(() => {
    const catMap = { all: { value: 'all', label: 'All Categories', count: products.length } };
    
    products.forEach(p => {
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

  // 2. Filter products based on search, category and status
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.sku?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchQuery, selectedCategory, selectedStatus]);

  // 3. Dynamic Stats calculated from real database
  const stats = useMemo(() => {
    const activeCount = products.filter(p => p.status === 'active').length;
    const outOfStockCount = products.filter(p => p.status === 'out-of-stock' || p.stock === 0).length;
    const totalRevenue = products.reduce((acc, p) => acc + (p.price * (p.sold || 0)), 0);

    const formattedRevenue = totalRevenue > 100000 
      ? `₹${(totalRevenue / 100000).toFixed(1)}L` 
      : `₹${totalRevenue.toLocaleString()}`;

    return [
      { label: 'Total Products', value: products.length, icon: Package, iconColor: 'text-blue-500' },
      { label: 'Active Products', value: activeCount, icon: TrendingUp, iconColor: 'text-emerald-500' },
      { label: 'Total Revenue', value: formattedRevenue, icon: DollarSign, iconColor: 'text-purple-500' },
      { label: 'Out of Stock', value: outOfStockCount, icon: Tag, iconColor: 'text-orange-500' },
    ];
  }, [products]);

  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
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
    return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="page-container max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground mb-1">
            Product Catalog
          </h1>
          <p className="text-sm text-muted-foreground">Manage and organize your product inventory (Live DB)</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={refreshData} className="btn btn-outline" title="Refresh Data">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button className="btn btn-outline">
            <Upload size={16} />
            <span className="hidden sm:inline ml-2">Import</span>
          </button>
          <button className="btn btn-outline">
            <Download size={16} />
            <span className="hidden sm:inline ml-2">Export</span>
          </button>
          <button className="btn btn-primary">
            <Plus size={16} />
            <span className="ml-2">Add Product</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="card p-4 border-destructive/40 bg-destructive/10 text-destructive text-sm font-medium">
          Database Error: {error}
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
                    {loading ? '...' : stat.value}
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
          {/* Search */}
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

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input pl-9 pr-8 w-full lg:w-auto min-w-[180px] appearance-none"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label} ({cat.count})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input w-full lg:w-auto min-w-[150px]"
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex bg-muted/50 p-1 rounded-md border border-border">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-all ${viewMode === 'grid' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-all ${viewMode === 'list' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid/List View */}
      {loading ? (
        <div className="flex items-center justify-center p-12 text-muted-foreground">
          <RefreshCw className="animate-spin mr-2" size={20} /> Fetching products from Supabase...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="card p-12 text-center text-muted-foreground">
          No products found matching your filters.
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="card p-0 overflow-hidden hover:shadow-dropdown transition-all duration-300 hover:-translate-y-1 group flex flex-col">
              {/* Product Image */}
              <div className="relative bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 h-48 flex items-center justify-center flex-shrink-0">
                <span className="text-7xl group-hover:scale-110 transition-transform duration-300">{product.image}</span>
                
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-sm hover:bg-background transition-colors text-muted-foreground hover:text-rose-500">
                    <Heart size={16} />
                  </button>
                  <button className="bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-sm hover:bg-background transition-colors text-muted-foreground hover:text-foreground">
                    <Eye size={16} />
                  </button>
                </div>
                
                <span className={`badge absolute top-3 left-3 ${getStatusBadge(product.status)}`}>
                  {getStatusText(product.status)}
                </span>
              </div>

              {/* Product Info */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground leading-tight mb-1 truncate">{product.name}</h3>
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
                      <p className="text-lg font-bold tracking-tight text-foreground">₹{Number(product.price).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-0.5">Stock: <span className="font-semibold text-foreground">{product.stock}</span></p>
                      <p className={`text-xs font-semibold ${product.status === 'out-of-stock' ? 'text-destructive' : 'text-emerald-600'}`}>
                        {product.status === 'out-of-stock' ? 'Out of stock' : product.trend}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-auto">
                  <button className="btn btn-outline flex-1 py-2">
                    <Edit size={14} className="mr-2" /> Edit
                  </button>
                  <button className="btn btn-outline px-3 text-destructive hover:bg-destructive/10 border-transparent hover:border-destructive/20">
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
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase tracking-wide text-xs">Sold</th>
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
                    <td className="py-3 px-4 font-semibold text-foreground whitespace-nowrap">₹{Number(product.price).toLocaleString()}</td>
                    <td className="py-3 px-4 text-foreground">{product.stock}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground">{product.sold}</span>
                        {product.status !== 'out-of-stock' && (
                          <span className="text-xs text-emerald-600 font-semibold">{product.trend}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`badge ${getStatusBadge(product.status)}`}>
                        {getStatusText(product.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button className="btn btn-ghost h-8 w-8 p-0" title="View">
                          <Eye size={16} />
                        </button>
                        <button className="btn btn-ghost h-8 w-8 p-0" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button className="btn btn-ghost h-8 w-8 p-0 text-destructive hover:bg-destructive/10" title="Delete">
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

      {/* Pagination */}
      {!loading && filteredProducts.length > 0 && (
        <div className="card p-3 sm:px-4 sm:py-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-card">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> products
          </p>
          <div className="flex items-center gap-1">
            {['Previous', '1', 'Next'].map((label) => (
              <button
                key={label}
                className={`btn h-8 px-3 text-xs ${label === '1' ? 'btn-primary' : 'btn-outline'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}