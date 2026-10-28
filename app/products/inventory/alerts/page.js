// app/products/inventory/alerts/page.js
'use client';

import { useState, useMemo } from 'react';
import {
  AlertTriangle,
  XCircle,
  Search,
  Filter,
  RefreshCw,
  ArrowRight,
  Package,
  Check,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';

export default function InventoryAlertsPage() {
  const router = useRouter();
  const { products, loading, error, refreshData, adjustStock } = useProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Restock Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [restockQty, setRestockQty] = useState(50);
  const [submittingModal, setSubmittingModal] = useState(false);

  const alertItems = useMemo(() => {
    return products.filter((p) => {
      const stock = Number(p.stock ?? 0);
      const minStock = Number(p.minStock ?? 10);
      return stock <= minStock;
    });
  }, [products]);

  const outOfStockCount = alertItems.filter((p) => Number(p.stock ?? 0) === 0).length;
  const lowStockCount = alertItems.filter((p) => Number(p.stock ?? 0) > 0).length;

  const filteredAlerts = useMemo(() => {
    return alertItems
      .filter((p) => {
        const stock = Number(p.stock ?? 0);
        const isOut = stock === 0;

        const matchesSearch =
          p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType =
          filterType === 'all' ||
          (filterType === 'out-of-stock' && isOut) ||
          (filterType === 'low-stock' && !isOut);

        return matchesSearch && matchesType;
      })
      .sort((a, b) => Number(a.stock ?? 0) - Number(b.stock ?? 0));
  }, [alertItems, searchQuery, filterType]);

  const handleRestockSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      setSubmittingModal(true);
      const newStock = Number(selectedProduct.stock ?? 0) + Number(restockQty);
      await adjustStock(selectedProduct.id, newStock);
      setSelectedProduct(null);
    } catch (err) {
      alert('Error updating stock: ' + err.message);
    } finally {
      setSubmittingModal(false);
    }
  };

  return (
    <div className="page-container max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground mb-1 flex items-center gap-2">
            <AlertTriangle className="text-amber-500" />
            Inventory Alerts
          </h1>
          <p className="text-sm text-muted-foreground">
            Items requiring immediate attention or restocking in Supabase (`public.products`)
          </p>
        </div>
        <button onClick={refreshData} className="btn btn-outline">
          <RefreshCw size={16} className={loading ? 'animate-spin mr-2' : 'mr-2'} />
          Sync Alerts
        </button>
      </div>

      {error && (
        <div className="card p-4 border-destructive/40 bg-destructive/10 text-destructive text-sm">
          <strong>Database Error:</strong> {error}
        </div>
      )}

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-5 shadow-card border-l-4 border-l-destructive flex items-start gap-4">
          <div className="p-3 bg-destructive/10 rounded-lg">
            <XCircle size={24} className="text-destructive" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground">
              {loading ? '…' : outOfStockCount}
            </h3>
            <p className="text-sm font-medium text-foreground">Out of Stock</p>
            <p className="text-xs text-muted-foreground mt-1">Zero inventory available</p>
          </div>
        </div>

        <div className="card p-5 shadow-card border-l-4 border-l-amber-500 flex items-start gap-4">
          <div className="p-3 bg-amber-500/10 rounded-lg">
            <AlertTriangle size={24} className="text-amber-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground">
              {loading ? '…' : lowStockCount}
            </h3>
            <p className="text-sm font-medium text-foreground">Low Stock Warnings</p>
            <p className="text-xs text-muted-foreground mt-1">Below minimum threshold (≤ 10)</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="card p-4 shadow-card flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search alerts by product or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-9 w-full"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="input pl-9 pr-8 w-full sm:w-auto"
          >
            <option value="all">All Alerts</option>
            <option value="out-of-stock">Out of Stock Only</option>
            <option value="low-stock">Low Stock Only</option>
          </select>
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {loading ? (
          <div className="card p-12 text-center text-muted-foreground flex flex-col items-center">
            <RefreshCw className="animate-spin mb-3" size={24} />
            Checking stock levels...
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="card p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
              <Check className="text-emerald-500" size={32} />
            </div>
            <h3 className="text-lg font-medium text-foreground">All Good!</h3>
            <p className="text-muted-foreground mb-4">
              All {products.length} products in your catalog are well-stocked above minimum thresholds.
            </p>
            <button
              onClick={() => router.push('/products/inventory/stock')}
              className="btn btn-outline text-xs"
            >
              Manage Stock Levels →
            </button>
          </div>
        ) : (
          filteredAlerts.map((product) => {
            const isOut = Number(product.stock ?? 0) === 0;
            return (
              <div
                key={product.id}
                className={`card p-4 border-l-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isOut ? 'border-l-destructive' : 'border-l-amber-500'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl flex-shrink-0">
                    {product.image}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{product.name}</h4>
                    <p className="text-xs text-muted-foreground mb-1">
                      SKU: {product.sku} • Category: {product.category}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-bold ${
                          isOut ? 'text-destructive' : 'text-amber-600'
                        }`}
                      >
                        {product.stock} units left
                      </span>
                      <span className="text-xs text-muted-foreground">
                        (Min required: {product.minStock || 10})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setRestockQty(50);
                    }}
                    className="btn btn-primary w-full sm:w-auto"
                  >
                    <Package size={14} className="mr-2" /> Quick Restock
                  </button>
                  <button
                    onClick={() => router.push('/products/inventory/stock')}
                    className="text-xs text-muted-foreground hover:text-foreground font-medium flex items-center"
                  >
                    View Stock Table <ArrowRight size={12} className="ml-1" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Restock Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="card w-full max-w-sm p-6 shadow-modal space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-lg font-semibold text-foreground">Restock Item</h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="btn btn-ghost h-8 w-8 p-0"
              >
                <X size={16} />
              </button>
            </div>

            <div>
              <p className="font-medium text-foreground">{selectedProduct.name}</p>
              <p className="text-xs text-muted-foreground">
                Current Stock: {selectedProduct.stock} units
              </p>
            </div>

            <form onSubmit={handleRestockSubmit} className="space-y-4">
              <div>
                <label className="label block mb-1.5">Units to Add</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={restockQty}
                  onChange={(e) => setRestockQty(e.target.value)}
                  className="input w-full"
                />
              </div>
              <div className="p-3 bg-muted rounded-md text-sm">
                New Total Stock:{' '}
                <strong className="text-emerald-600">
                  {Number(selectedProduct.stock ?? 0) + Number(restockQty)}
                </strong>
              </div>
              <button type="submit" disabled={submittingModal} className="btn btn-primary w-full">
                {submittingModal ? 'Restocking...' : 'Confirm Restock'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}