// app/products/inventory/reports/page.js
'use client';

import { useMemo } from 'react';
import {
  FileText,
  Download,
  Printer,
  RefreshCw,
  DollarSign,
  Package,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Layers,
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';

export default function InventoryReportsPage() {
  const { products, categoriesWithStats, loading, error, refreshData } = useProducts();

  const auditSummary = useMemo(() => {
    const totalSKUs = products.length;
    const totalUnits = products.reduce((sum, p) => sum + Number(p.stock ?? 0), 0);
    const totalValuation = products.reduce(
      (sum, p) => sum + Number(p.price ?? 0) * Number(p.stock ?? 0),
      0
    );

    const healthyItems = products.filter((p) => Number(p.stock ?? 0) > (p.minStock || 10));
    const lowStockItems = products.filter(
      (p) => Number(p.stock ?? 0) > 0 && Number(p.stock ?? 0) <= (p.minStock || 10)
    );
    const outOfStockItems = products.filter((p) => Number(p.stock ?? 0) === 0);

    const avgUnitCost = totalUnits > 0 ? Number((totalValuation / totalUnits).toFixed(2)) : 0;

    return {
      totalSKUs,
      totalUnits,
      totalValuation,
      avgUnitCost,
      healthyCount: healthyItems.length,
      lowStockCount: lowStockItems.length,
      outOfStockCount: outOfStockItems.length,
      healthRate: totalSKUs > 0 ? Math.round((healthyItems.length / totalSKUs) * 100) : 100,
    };
  }, [products]);

  const handleExportCSV = () => {
    const headers = ['SKU,Product Name,Category,Unit Price,Stock Units,Min Stock,Total Valuation,Audit Status'];
    const rows = products.map((p) => {
      const val = (Number(p.price ?? 0) * Number(p.stock ?? 0)).toFixed(2);
      const status =
        p.stock === 0 ? 'Out of Stock' : p.stock <= (p.minStock || 10) ? 'Low Stock' : 'Healthy';
      return `"${p.sku}","${p.name}","${p.category}",${p.price},${p.stock},${p.minStock || 10},${val},"${status}"`;
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'inventory_valuation_audit.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-container max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground mb-1 flex items-center gap-2">
            <FileText className="text-emerald-500" size={24} />
            Inventory Valuation & Audit Report
          </h1>
          <p className="text-sm text-muted-foreground">
            Complete stock valuation, health breakdown, and SKU audit synced with Supabase
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={refreshData} className="btn btn-outline">
            <RefreshCw size={16} className={loading ? 'animate-spin mr-2' : 'mr-2'} />
            Sync
          </button>
          <button onClick={() => window.print()} className="btn btn-outline">
            <Printer size={16} className="mr-2" />
            Print
          </button>
          <button onClick={handleExportCSV} className="btn btn-primary">
            <Download size={16} className="mr-2" />
            Export Audit CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="card p-4 border-destructive/40 bg-destructive/10 text-destructive text-sm">
          <strong>Database Error:</strong> {error}
        </div>
      )}

      {/* Executive Valuation Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase">
              Total Asset Valuation
            </span>
            <DollarSign size={18} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {loading
              ? '…'
              : `₹${auditSummary.totalValuation.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Avg unit value: ₹{auditSummary.avgUnitCost.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="card p-5 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase">
              Total Stock Volume
            </span>
            <Package size={18} className="text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {loading ? '…' : `${auditSummary.totalUnits.toLocaleString('en-IN')} units`}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Across {auditSummary.totalSKUs} active SKUs
          </p>
        </div>

        <div className="card p-5 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase">
              Inventory Health Rate
            </span>
            <CheckCircle2 size={18} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">
            {loading ? '…' : `${auditSummary.healthRate}%`}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {auditSummary.healthyCount} of {auditSummary.totalSKUs} SKUs above min stock
          </p>
        </div>

        <div className="card p-5 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase">
              Restock Risk Items
            </span>
            <AlertTriangle size={18} className="text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {loading ? '…' : auditSummary.lowStockCount + auditSummary.outOfStockCount}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {auditSummary.lowStockCount} Low • {auditSummary.outOfStockCount} Out of Stock
          </p>
        </div>
      </div>

      {/* Category Valuation Summary */}
      <div className="card p-6 shadow-card space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Layers size={18} className="text-muted-foreground" />
          <h2 className="text-base font-semibold text-foreground">
            Valuation by Category (`public.categories`)
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoriesWithStats.map((cat) => (
            <div key={cat.id} className="p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <span>{cat.icon}</span> {cat.name}
                </span>
                <span className="text-xs text-muted-foreground">{cat.productCount} SKUs</span>
              </div>
              <p className="text-lg font-bold text-emerald-600">
                ₹{Number(cat.totalValue ?? 0).toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{cat.totalStock} total units</p>
            </div>
          ))}
        </div>
      </div>

      {/* Complete SKU Audit Table */}
      <div className="card p-0 overflow-hidden shadow-card">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Complete SKU Valuation Ledger</h3>
          <span className="text-xs text-muted-foreground">{products.length} items</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase text-xs">
                  SKU
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase text-xs">
                  Product Name
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase text-xs">
                  Category
                </th>
                <th className="text-right py-3 px-4 font-semibold text-muted-foreground uppercase text-xs">
                  Unit Price
                </th>
                <th className="text-right py-3 px-4 font-semibold text-muted-foreground uppercase text-xs">
                  On-Hand Stock
                </th>
                <th className="text-right py-3 px-4 font-semibold text-muted-foreground uppercase text-xs">
                  Total Asset Value
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase text-xs">
                  Audit Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((p) => {
                const val = Number(p.price ?? 0) * Number(p.stock ?? 0);
                const isOut = Number(p.stock ?? 0) === 0;
                const isLow = !isOut && Number(p.stock ?? 0) <= (p.minStock || 10);

                return (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs text-muted-foreground">{p.sku}</td>
                    <td className="py-3.5 px-4 font-semibold text-foreground">{p.name}</td>
                    <td className="py-3.5 px-4 text-foreground">{p.category}</td>
                    <td className="py-3.5 px-4 text-right text-foreground">
                      ₹{Number(p.price).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium text-foreground">
                      {p.stock} units
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-foreground">
                      ₹{val.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4">
                      {isOut ? (
                        <span className="badge bg-destructive/10 text-destructive border-destructive/20 inline-flex items-center gap-1">
                          <XCircle size={12} /> Depleted
                        </span>
                      ) : isLow ? (
                        <span className="badge bg-amber-500/10 text-amber-600 border-amber-500/20 inline-flex items-center gap-1">
                          <AlertTriangle size={12} /> Reorder Soon
                        </span>
                      ) : (
                        <span className="badge bg-emerald-500/10 text-emerald-600 border-emerald-500/20 inline-flex items-center gap-1">
                          <CheckCircle2 size={12} /> Healthy
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}