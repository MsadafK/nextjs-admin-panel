'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import ProductPageHeader, { exportProductsCsv } from '@/app/components/Products/ProductPageHeader';
import ProductKpiSummary from '@/app/components/Products/ProductKpiSummary';
import ProductTable from '@/app/components/Products/ProductTable';

const controlClass = 'h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground';

export default function InventoryStockPage() {
  const { products, dbCategories, loading, error, refreshData, adjustStock, updateMinStock } = useProducts();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [stockLevel, setStockLevel] = useState('all');
  const [sort, setSort] = useState('stock-asc');
  const [savingThreshold, setSavingThreshold] = useState(null);
  const [thresholdError, setThresholdError] = useState('');
  const statusOf = (product) => Number(product.stock || 0) === 0 ? 'out-of-stock' : Number(product.stock || 0) <= Number(product.minStock ?? 10) ? 'low-stock' : 'in-stock';
  const filtered = useMemo(() => products.filter((product) => {
    const q = search.toLowerCase();
    return `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(q) && (category === 'all' || product.category_id === category || product.category === category) && (stockLevel === 'all' || statusOf(product) === stockLevel);
  }).sort((a, b) => sort === 'stock-asc' ? a.stock - b.stock : sort === 'price-desc' ? b.price - a.price : sort === 'name-asc' ? a.name.localeCompare(b.name) : b.price * b.stock - a.price * a.stock), [products, search, category, stockLevel, sort]);
  const risks = products.filter((product) => statusOf(product) !== 'in-stock');
  const healthCounts = { healthy: products.filter((product) => statusOf(product) === 'in-stock').length, low: products.filter((product) => statusOf(product) === 'low-stock').length, out: products.filter((product) => statusOf(product) === 'out-of-stock').length };
  const updateThreshold = async (product, value) => {
    const next = Number(value);
    if (!Number.isFinite(next) || next < 0 || next === Number(product.minStock ?? 10)) return;
    setSavingThreshold(product.id); setThresholdError('');
    try { await updateMinStock(product.id, next); }
    catch (updateError) { setThresholdError(updateError.message || 'Unable to update reorder threshold.'); }
    finally { setSavingThreshold(null); }
  };
  const restock = async (product, amount) => {
    try { await adjustStock(product.id, Number(product.stock || 0) + amount); }
    catch (restockError) { window.alert(`Could not restock product: ${restockError.message}`); }
  };
  const editCatalogProduct = (product) => { window.location.href = `/products/all/catalog?edit=${encodeURIComponent(product.id)}`; };

  return <div className="page-container mx-auto max-w-7xl space-y-6">
    <ProductPageHeader title="Inventory & Stock Control" description="Monitor stock health, adjust quantities, and manage reorder points." loading={loading} onRefresh={refreshData} products={filtered} onExport={() => exportProductsCsv(filtered, 'inventory_stock_report.csv')}/>
    {error && <p role="alert" className="rounded-lg border border-border bg-muted p-3 text-sm text-foreground">{error}</p>}
    <ProductKpiSummary products={products} categories={dbCategories} loading={loading}/>
    <section className="rounded-xl border border-border bg-card p-4 sm:p-5"><div className="mb-4 flex items-center justify-between"><div><h2 className="text-sm font-semibold text-foreground">Stock Health</h2><p className="mt-1 text-xs text-muted-foreground">Product counts using each SKU’s reorder threshold.</p></div></div><div className="space-y-3">{[{ label: 'Healthy', count: healthCounts.healthy }, { label: 'Low Stock', count: healthCounts.low }, { label: 'Out of Stock', count: healthCounts.out }].map((item) => <div key={item.label}><div className="mb-1 flex justify-between text-xs"><span className="text-foreground">{item.label}</span><span className="font-mono text-muted-foreground">{item.count} / {products.length}</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-foreground" style={{ width: `${products.length ? item.count / products.length * 100 : 0}%` }}/></div></div>)}</div></section>
    <section className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-muted/20 p-3.5 sm:grid-cols-2 xl:grid-cols-4"><div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by product name, SKU, or category..." className={`${controlClass} pl-9`}/></div><select value={category} onChange={(event) => setCategory(event.target.value)} className={controlClass}><option value="all">All Categories</option>{dbCategories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><select value={stockLevel} onChange={(event) => setStockLevel(event.target.value)} className={controlClass}><option value="all">All Stock Levels</option><option value="in-stock">In Stock</option><option value="low-stock">Low Stock</option><option value="out-of-stock">Out of Stock</option></select><select value={sort} onChange={(event) => setSort(event.target.value)} className={controlClass}><option value="stock-asc">Stock: Low to High</option><option value="price-desc">Price: High to Low</option><option value="value-desc">Valuation: High to Low</option><option value="name-asc">Name: A–Z</option></select></section>
    <ProductTable products={filtered} loading={loading} onAdjustStock={adjustStock} onQuickRestock={(product) => restock(product, 10)} onEdit={editCatalogProduct}/>

    <section className="overflow-hidden rounded-xl border border-border bg-card"><div className="border-b border-border px-4 py-3.5"><h2 className="text-sm font-semibold text-foreground">Reorder Controls</h2><p className="mt-1 text-xs text-muted-foreground">Update each SKU threshold or quickly add stock. Changes sync to Supabase.</p></div>{thresholdError && <p role="alert" className="mx-4 mt-3 rounded-md border border-border bg-muted p-2 text-xs text-foreground">{thresholdError}</p>}{risks.length ? <div className="divide-y divide-border">{risks.map((product) => <div key={product.id} className="flex min-w-0 flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="truncate text-sm font-medium text-foreground">{product.name}</p><p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">{product.sku} · {product.stock} units available</p></div><div className="flex flex-wrap items-center gap-2"><label className="flex h-8 items-center gap-2 rounded-md border border-border px-2 text-[11px] text-muted-foreground">Reorder at<input aria-label={`Reorder threshold for ${product.name}`} type="number" min="0" defaultValue={product.minStock ?? 10} key={`${product.id}-${product.minStock}`} onBlur={(event) => updateThreshold(product, event.target.value)} className="w-14 bg-transparent text-right font-mono text-xs text-foreground outline-none"/>{savingThreshold === product.id && <span className="text-foreground">Saving</span>}</label><button type="button" onClick={() => restock(product, 10)} className="h-8 rounded-md border border-border px-2.5 text-xs font-medium text-foreground hover:bg-muted">+10</button><button type="button" onClick={() => restock(product, 50)} className="h-8 rounded-md border border-border px-2.5 text-xs font-medium text-foreground hover:bg-muted">+50</button></div></div>)}</div> : <p className="p-6 text-sm text-muted-foreground">All products are above their reorder thresholds.</p>}</section>
  </div>;
}
