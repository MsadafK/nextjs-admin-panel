// app/products/categories/analytics/page.js
'use client';

import { useMemo } from 'react';
import { BarChart3 } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import ProductPageHeader from '@/app/components/Products/ProductPageHeader';
import ProductKpiSummary from '@/app/components/Products/ProductKpiSummary';

const formatCurrency = (value) => `₹${Number(value ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function CategoryAnalyticsPage() {
  const { categoriesWithStats, products, dbCategories, loading, error, refreshData } = useProducts();

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
    <div className="page-container mx-auto max-w-7xl space-y-6">
      <ProductPageHeader title="Category Analytics" description="Live valuation share, stock distribution, and SKU density by category." loading={loading} onRefresh={refreshData} products={products} onExport={handleExportCSV} primaryLabel="Manage Categories" primaryHref="/products/categories/manage"/>
      <ProductKpiSummary products={products} categories={dbCategories} loading={loading}/>

      {error && (
        <div className="card p-4 border-foreground bg-muted text-foreground text-sm">
          <strong>Database Error:</strong> {error}
        </div>
      )}

      <div className="card p-6 shadow-card space-y-5 border border-border">
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
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-muted font-mono text-[10px] font-semibold text-foreground">{cat.name?.slice(0, 2).toUpperCase()}</span>
                  <span className="font-semibold text-foreground">{cat.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({cat.productCount} SKUs • {cat.totalStock} units)
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-foreground">
                    {formatCurrency(cat.totalValue)}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">({cat.valueShare}%)</span>
                </div>
              </div>
              <div className="w-full h-2.5 bg-muted border border-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-foreground rounded-full transition-all duration-500"
                  style={{ width: `${cat.valueShare}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="px-5 py-4 border-b border-border bg-muted">
          <h3 className="text-sm font-semibold text-foreground">Category Breakdown Table</h3>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-muted border-b border-border">
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
                  Value Share
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {analyticsData.list.map((cat) => (
                <tr key={cat.id} className="hover:bg-muted/50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-foreground">
                    <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-md bg-foreground font-mono text-[10px] font-semibold text-background">{cat.name?.slice(0, 2).toUpperCase()}</span>
                    {cat.name}
                  </td>
                  <td className="py-3.5 px-4 text-right text-foreground">{cat.productCount}</td>
                  <td className="py-3.5 px-4 text-right text-foreground">
                    {cat.totalStock} ({cat.stockShare}%)
                  </td>
                  <td className="py-3.5 px-4 text-right text-foreground">
                    {formatCurrency(cat.avgUnitValue)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-foreground">
                    {formatCurrency(cat.totalValue)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs text-foreground">
                    {cat.valueShare}%
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
