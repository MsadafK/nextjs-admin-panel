// app/products/categories/analytics/page.js
'use client';

import { useMemo } from 'react';
import {
  PieChart,
  Layers,
  DollarSign,
  Package,
  TrendingUp,
  Download,
  RefreshCw,
  Award,
  BarChart3,
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';

export default function CategoryAnalyticsPage() {
  const { categoriesWithStats, products, loading, error, refreshData } = useProducts();

  const analyticsData = useMemo(() => {
    const totalValuation = Math.max(
      1,
      categoriesWithStats.reduce((sum, c) => sum + Number(c.totalValue ?? 0), 0)
    );
    const totalStock = Math.max(
      1,
      categoriesWithStats.reduce((sum, c) => sum + Number(c.totalStock ?? 0), 0)
    );

    const enriched = categoriesWithStats.map((cat) => {
      const valueShare = Number(((Number(cat.totalValue ?? 0) / totalValuation) * 100).toFixed(1));
      const stockShare = Number(((Number(cat.totalStock ?? 0) / totalStock) * 100).toFixed(1));
      const avgUnitValue =
        cat.totalStock > 0 ? Number((cat.totalValue / cat.totalStock).toFixed(2)) : 0;

      return {
        ...cat,
        valueShare,
        stockShare,
        avgUnitValue,
      };
    });

    return {
      list: enriched.sort((a, b) => b.totalValue - a.totalValue),
      totalValuation,
      totalStock,
      topCategory: enriched.sort((a, b) => b.totalValue - a.totalValue)[0] || null,
    };
  }, [categoriesWithStats]);

  const handleExportCSV = () => {
    const headers = ['Category,SKUs,Stock Units,Total Valuation,Value Share %,Avg Unit Price,Status'];
    const rows = analyticsData.list.map(
      (c) =>
        `"${c.name}",${c.productCount},${c.totalStock},${c.totalValue},${c.valueShare}%,${c.avgUnitValue},${c.status}`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'category_analytics.csv');
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
            <PieChart className="text-purple-500" size={24} />
            Category Analytics
          </h1>
          <p className="text-sm text-muted-foreground">
            Category-wise valuation share, stock distribution, and SKU density from Supabase
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={refreshData} className="btn btn-outline">
            <RefreshCw size={16} className={loading ? 'animate-spin mr-2' : 'mr-2'} />
            Sync
          </button>
          <button onClick={handleExportCSV} className="btn btn-primary">
            <Download size={16} className="mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {error && (
        <div className="card p-4 border-destructive/40 bg-destructive/10 text-destructive text-sm">
          <strong>Database Error:</strong> {error}
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 shadow-card flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase">Total Categories</p>
            <p className="text-2xl font-semibold text-foreground mt-1">
              {loading ? '…' : categoriesWithStats.length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {products.length} total mapped SKUs
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-muted">
            <Layers size={20} className="text-blue-500" />
          </div>
        </div>

        <div className="card p-5 shadow-card flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase">Top Category</p>
            <p className="text-xl font-semibold text-foreground mt-1 truncate">
              {loading ? '…' : analyticsData.topCategory?.name || 'N/A'}
            </p>
            <p className="text-xs text-emerald-600 font-medium mt-1">
              {analyticsData.topCategory ? `${analyticsData.topCategory.valueShare}% of total value` : ''}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-muted">
            <Award size={20} className="text-amber-500" />
          </div>
        </div>

        <div className="card p-5 shadow-card flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase">Total Valuation</p>
            <p className="text-2xl font-semibold text-foreground mt-1">
              {loading
                ? '…'
                : `₹${analyticsData.totalValuation.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Combined category value</p>
          </div>
          <div className="p-2.5 rounded-lg bg-muted">
            <DollarSign size={20} className="text-emerald-500" />
          </div>
        </div>

        <div className="card p-5 shadow-card flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase">Total Stock Units</p>
            <p className="text-2xl font-semibold text-foreground mt-1">
              {loading ? '…' : analyticsData.totalStock.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Across all active categories</p>
          </div>
          <div className="p-2.5 rounded-lg bg-muted">
            <Package size={20} className="text-purple-500" />
          </div>
        </div>
      </div>

      {/* Visual Distribution Bars */}
      <div className="card p-6 shadow-card space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">
            Category Valuation Share (Live Distribution)
          </h2>
          <BarChart3 size={18} className="text-muted-foreground" />
        </div>

        <div className="space-y-4">
          {analyticsData.list.map((cat) => (
            <div key={cat.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span>{cat.icon}</span>
                  <span className="font-semibold text-foreground">{cat.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({cat.productCount} SKUs • {cat.totalStock} units)
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-foreground">
                    ₹{Number(cat.totalValue ?? 0).toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">({cat.valueShare}%)</span>
                </div>
              </div>
              <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(4, cat.valueShare)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Category Breakdown Table */}
      <div className="card p-0 overflow-hidden shadow-card">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Category Breakdown Table</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase text-xs">
                  Category
                </th>
                <th className="text-right py-3 px-4 font-semibold text-muted-foreground uppercase text-xs">
                  Products (SKUs)
                </th>
                <th className="text-right py-3 px-4 font-semibold text-muted-foreground uppercase text-xs">
                  Total Stock
                </th>
                <th className="text-right py-3 px-4 font-semibold text-muted-foreground uppercase text-xs">
                  Avg Unit Price
                </th>
                <th className="text-right py-3 px-4 font-semibold text-muted-foreground uppercase text-xs">
                  Inventory Value
                </th>
                <th className="text-right py-3 px-4 font-semibold text-muted-foreground uppercase text-xs">
                  Growth
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {analyticsData.list.map((cat) => (
                <tr key={cat.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-foreground">
                    <span className="mr-2">{cat.icon}</span>
                    {cat.name}
                  </td>
                  <td className="py-3.5 px-4 text-right text-foreground">{cat.productCount}</td>
                  <td className="py-3.5 px-4 text-right text-foreground">
                    {cat.totalStock} ({cat.stockShare}%)
                  </td>
                  <td className="py-3.5 px-4 text-right text-foreground">
                    ₹{cat.avgUnitValue.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-emerald-600">
                    ₹{Number(cat.totalValue ?? 0).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-right font-medium text-emerald-600">
                    <span className="inline-flex items-center gap-1">
                      <TrendingUp size={13} />
                      {cat.growth}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}