// app/products/inventory/stock/page.js
'use client';

import { useState, useMemo } from 'react';
import {
  Package,
  Search,
  Filter,
  Plus,
  Minus,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  DollarSign,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Check,
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';

export default function InventoryStockPage() {
  const { products, loading, error, refreshData, adjustStock } = useProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('stock-asc');
  const [updatingId, setUpdatingId] = useState(null);

  // Stock Adjustment Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustmentType, setAdjustmentType] = useState('add');
  const [adjustmentQty, setAdjustmentQty] = useState(10);
  const [adjustmentNote, setAdjustmentNote] = useState('');
  const [submittingModal, setSubmittingModal] = useState(false);

  const getStockState = (product) => {
    const stock = Number(product.stock ?? 0);
    const minStock = Number(product.minStock ?? 10);
    if (stock <= 0) return 'out-of-stock';
    if (stock <= minStock) return 'low-stock';
    return 'in-stock';
  };

  const categories = useMemo(() => {
    const map = { all: { value: 'all', label: 'All Categories', count: products.length } };
    products.forEach((p) => {
      const cat = p.category || 'Uncategorized';
      if (!map[cat]) {
        map[cat] = { value: cat, label: cat, count: 0 };
      }
      map[cat].count++;
    });
    return Object.values(map);
  }, [products]);

  const stats = useMemo(() => {
    const totalUnits = products.reduce((sum, p) => sum + Number(p.stock ?? 0), 0);
    const totalValuation = products.reduce(
      (sum, p) => sum + Number(p.price ?? 0) * Number(p.stock ?? 0),
      0
    );
    const lowStockCount = products.filter((p) => getStockState(p) === 'low-stock').length;
    const outOfStockCount = products.filter((p) => getStockState(p) === 'out-of-stock').length;

    return [
      {
        label: 'Total Stock Units',
        value: totalUnits.toLocaleString('en-IN'),
        subtext: `Across ${products.length} SKUs`,
        icon: Package,
        iconColor: 'text-blue-500',
      },
      {
        label: 'Inventory Valuation',
        value: `₹${totalValuation.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
        subtext: 'Live stock value',
        icon: DollarSign,
        iconColor: 'text-emerald-500',
      },
      {
        label: 'Low Stock Alerts',
        value: lowStockCount,
        subtext: 'Below minimum threshold',
        icon: AlertTriangle,
        iconColor: 'text-amber-500',
      },
      {
        label: 'Out of Stock',
        value: outOfStockCount,
        subtext: 'Needs immediate restock',
        icon: XCircle,
        iconColor: 'text-destructive',
      },
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase();

    const list = products.filter((p) => {
      const matchesSearch =
        p.name?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q);

      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const state = getStockState(p);
      const matchesStock = stockFilter === 'all' || state === stockFilter;

      return matchesSearch && matchesCategory && matchesStock;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'stock-asc') return a.stock - b.stock;
      if (sortBy === 'stock-desc') return b.stock - a.stock;
      if (sortBy === 'value-desc') return b.price * b.stock - a.price * a.stock;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [products, searchQuery, selectedCategory, stockFilter, sortBy]);

  const handleQuickStockChange = async (product, delta) => {
    const nextStock = Math.max(0, Number(product.stock ?? 0) + delta);
    try {
      setUpdatingId(product.id);
      await adjustStock(product.id, nextStock);
    } catch (err) {
      alert('Failed to update stock: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const openAdjustModal = (product) => {
    setSelectedProduct(product);
    setAdjustmentType('add');
    setAdjustmentQty(10);
    setAdjustmentNote('');
  };

  const previewNewStock = useMemo(() => {
    if (!selectedProduct) return 0;
    const current = Number(selectedProduct.stock ?? 0);
    const qty = Math.max(0, Number(adjustmentQty ?? 0));
    if (adjustmentType === 'add') return current + qty;
    if (adjustmentType === 'subtract') return Math.max(0, current - qty);
    return qty;
  }, [selectedProduct, adjustmentType, adjustmentQty]);

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      setSubmittingModal(true);
      await adjustStock(selectedProduct.id, previewNewStock);
      setSelectedProduct(null);
    } catch (err) {
      alert('Error updating stock in Supabase: ' + err.message);
    } finally {
      setSubmittingModal(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['SKU,Product Name,Category,Unit Price,Stock Quantity,Stock Value,Status'];
    const rows = filteredProducts.map((p) => {
      const state = getStockState(p);
      const val = (Number(p.price ?? 0) * Number(p.stock ?? 0)).toFixed(2);
      return `"${p.sku}","${p.name}","${p.category}",${p.price},${p.stock},${val},${state}`;
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'inventory_stock_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderStockBadge = (product) => {
    const state = getStockState(product);
    if (state === 'out-of-stock') {
      return (
        <span className="badge bg-destructive/10 text-destructive border-destructive/20 inline-flex items-center gap-1">
          <XCircle size={12} /> Out of Stock
        </span>
      );
    }
    if (state === 'low-stock') {
      return (
        <span className="badge bg-amber-500/10 text-amber-600 border-amber-500/20 inline-flex items-center gap-1">
          <AlertTriangle size={12} /> Low Stock
        </span>
      );
    }
    return (
      <span className="badge bg-emerald-500/10 text-emerald-600 border-emerald-500/20 inline-flex items-center gap-1">
        <CheckCircle2 size={12} /> In Stock
      </span>
    );
  };

  return (
    <div className="page-container max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground mb-1">
            Inventory Stock Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor real-time stock levels and restock products in Supabase (`public.products`)
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={refreshData} className="btn btn-outline" title="Refresh Inventory">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline ml-2">Sync DB</span>
          </button>
          <button onClick={handleExportCSV} className="btn btn-primary">
            <Download size={16} />
            <span className="ml-2">Export Stock CSV</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="card p-4 border-destructive/40 bg-destructive/10 text-destructive text-sm flex items-center justify-between">
          <span>
            <strong>Database Error:</strong> {error}
          </span>
          <button onClick={refreshData} className="btn btn-outline h-8 text-xs">
            Retry
          </button>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="card p-4 sm:p-5 shadow-card hover:shadow-dropdown transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-semibold tracking-tight text-foreground">
                    {loading ? '…' : stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.subtext}</p>
                </div>
                <div className="p-2.5 rounded-md bg-muted flex-shrink-0">
                  <Icon size={20} className={stat.iconColor} strokeWidth={2} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search & Filters Toolbar */}
      <div className="card p-3 sm:p-4 shadow-card">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by product name, SKU, or category..."
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
              className="input pl-9 pr-8 w-full lg:w-auto min-w-[180px]"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label} ({cat.count})
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="input w-full lg:w-auto min-w-[160px]"
            >
              <option value="all">All Stock Levels</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock (≤10)</option>
              <option value="out-of-stock">Out of Stock (0)</option>
            </select>
          </div>

          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input pl-9 pr-8 w-full lg:w-auto min-w-[185px]"
            >
              <option value="stock-asc">Stock: Low to High</option>
              <option value="stock-desc">Stock: High to Low</option>
              <option value="value-desc">Stock Value: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stock Table */}
      <div className="card p-0 overflow-hidden shadow-card">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-muted-foreground">
            <RefreshCw className="animate-spin mr-2" size={20} />
            Loading live inventory from Supabase...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No inventory items match your current filters.
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase tracking-wide text-xs">
                    Product & SKU
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase tracking-wide text-xs">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase tracking-wide text-xs">
                    Unit Price
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase tracking-wide text-xs">
                    Stock Level
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase tracking-wide text-xs">
                    Stock Value
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase tracking-wide text-xs">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground uppercase tracking-wide text-xs">
                    Quick Adjust
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.map((product) => {
                  const state = getStockState(product);
                  const stockPct = Math.min(100, Math.round((product.stock / 100) * 100));
                  const barColor =
                    state === 'out-of-stock'
                      ? 'bg-destructive'
                      : state === 'low-stock'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500';

                  const isUpdating = updatingId === product.id;

                  return (
                    <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3 min-w-[220px]">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-md flex items-center justify-center text-xl flex-shrink-0">
                            {product.image}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground truncate">SKU: {product.sku}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-foreground whitespace-nowrap">
                        {product.category}
                      </td>

                      <td className="py-3.5 px-4 text-foreground whitespace-nowrap">
                        ₹{Number(product.price).toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4 min-w-[160px]">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-foreground text-sm">
                              {product.stock} units
                            </span>
                            <span className="text-muted-foreground">Min: {product.minStock || 10}</span>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                              style={{ width: `${stockPct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-foreground whitespace-nowrap">
                        ₹{(Number(product.price) * Number(product.stock)).toLocaleString('en-IN', {
                          maximumFractionDigits: 2,
                        })}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {renderStockBadge(product)}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            disabled={isUpdating || product.stock <= 0}
                            onClick={() => handleQuickStockChange(product, -1)}
                            className="btn btn-outline h-8 w-8 p-0 disabled:opacity-40"
                            title="Decrease by 1"
                          >
                            <Minus size={14} />
                          </button>
                          <button
                            disabled={isUpdating}
                            onClick={() => handleQuickStockChange(product, 1)}
                            className="btn btn-outline h-8 w-8 p-0 disabled:opacity-40"
                            title="Increase by 1"
                          >
                            <Plus size={14} />
                          </button>
                          <button
                            disabled={isUpdating}
                            onClick={() => openAdjustModal(product)}
                            className="btn btn-outline h-8 px-2.5 text-xs"
                            title="Custom Stock Adjustment"
                          >
                            <SlidersHorizontal size={13} className="mr-1.5" />
                            Restock
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stock Restock Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="card w-full max-w-md p-6 shadow-modal space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Adjust Stock Level</h2>
                <p className="text-xs text-muted-foreground">
                  {selectedProduct.name} (SKU: {selectedProduct.sku})
                </p>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="btn btn-ghost h-8 w-8 p-0"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="label block mb-1.5">Adjustment Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'add', label: '+ Add Stock' },
                    { id: 'subtract', label: '- Remove' },
                    { id: 'set', label: '= Set Exact' },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setAdjustmentType(mode.id)}
                      className={`py-2 px-3 rounded-md text-xs font-medium border transition-colors ${
                        adjustmentType === mode.id
                          ? 'bg-foreground text-background border-foreground'
                          : 'bg-background text-foreground border-border hover:bg-muted'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label block mb-1.5">
                  {adjustmentType === 'set' ? 'New Stock Quantity' : 'Quantity to Adjust'}
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={adjustmentQty}
                  onChange={(e) => setAdjustmentQty(e.target.value)}
                  className="input w-full"
                />
              </div>

              <div>
                <label className="label block mb-1.5">Reason / Reference (Optional)</label>
                <input
                  type="text"
                  value={adjustmentNote}
                  onChange={(e) => setAdjustmentNote(e.target.value)}
                  placeholder="e.g. New shipment received / Inventory audit"
                  className="input w-full"
                />
              </div>

              <div className="p-3.5 rounded-lg bg-muted/60 border border-border flex items-center justify-between text-sm">
                <div>
                  <span className="text-muted-foreground">Current Stock: </span>
                  <strong className="text-foreground">{selectedProduct.stock} units</strong>
                </div>
                <span className="text-muted-foreground">→</span>
                <div>
                  <span className="text-muted-foreground">New Stock: </span>
                  <strong className="text-emerald-600">{previewNewStock} units</strong>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" disabled={submittingModal} className="btn btn-primary">
                  <Check size={15} className="mr-1.5" />
                  {submittingModal ? 'Updating DB…' : 'Update Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}