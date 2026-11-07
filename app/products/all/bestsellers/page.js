'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import ProductPageHeader from '@/app/components/Products/ProductPageHeader';
import ProductKpiSummary from '@/app/components/Products/ProductKpiSummary';
import ProductTable from '@/app/components/Products/ProductTable';

export default function BestsellersPage() {
  const { products, dbCategories, loading, error, refreshData, adjustStock, removeProduct } = useProducts();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [metric, setMetric] = useState('value');
  const ranked = useMemo(() => products.filter((product) => {
    const q = search.toLowerCase();
    return `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(q) && (category === 'all' || product.category_id === category || product.category === category);
  }).sort((a, b) => metric === 'sold' ? Number(b.sold || 0) - Number(a.sold || 0) : b.price * b.stock - a.price * a.stock), [products, search, category, metric]);
  const exportCsv = () => {
    const rows = ranked.map((product, index) => [index + 1, product.sku, product.name, product.category, product.price, product.sold || 0, Number(product.price || 0) * Number(product.stock || 0)].map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(','));
    const url = URL.createObjectURL(new Blob([['Rank,SKU,Product,Category,Unit Price,Units Sold,Inventory Valuation', ...rows].join('\n')], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'product_leaders.csv'; link.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const leaders = [...products].sort((a, b) => b.price * b.stock - a.price * a.stock).slice(0, 3);
  const controlClass = 'h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground';
  const editProduct = (product) => { window.location.href = `/products/all/catalog?edit=${encodeURIComponent(product.id)}`; };
  const deleteProduct = async (product) => { if (!window.confirm(`Delete “${product.name}” from the catalog?`)) return; try { await removeProduct(product.id); } catch (error) { window.alert(`Could not delete product: ${error.message}`); } };

  return <div className="page-container mx-auto max-w-7xl space-y-6"><ProductPageHeader title="Product Leaders" description="Top catalog SKUs ranked using live units sold or current inventory valuation." loading={loading} onRefresh={refreshData} products={ranked} onExport={exportCsv}/>{error && <p role="alert" className="rounded-lg border border-border bg-muted p-3 text-sm text-foreground">{error}</p>}<ProductKpiSummary products={products} categories={dbCategories} loading={loading}/>
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">{leaders.map((product, index) => <article key={product.id} className="rounded-xl border border-border bg-card p-4"><div className="flex items-start justify-between gap-3"><span className="rounded border border-border bg-foreground px-2 py-1 font-mono text-[10px] text-background">RANK {index + 1}</span><span className="font-mono text-xs text-muted-foreground">{product.sold || 0} units sold</span></div><div className="mt-4 flex items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground font-mono text-xs font-semibold text-background">{product.name?.slice(0, 2).toUpperCase()}</span><span className="min-w-0"><span className="block truncate text-sm font-semibold text-foreground">{product.name}</span><span className="block truncate font-mono text-[10px] text-muted-foreground">{product.sku} · {product.category}</span></span></div><div className="mt-4 border-t border-border pt-3"><p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Current Inventory Valuation</p><p className="mt-1 font-mono text-lg font-semibold text-foreground">₹{(product.price * product.stock).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p></div></article>)}</section>
    <section className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-muted/20 p-3.5 sm:grid-cols-2 xl:grid-cols-4"><div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search product name, SKU, or category…" className={`${controlClass} pl-9`}/></div><select value={category} onChange={(event) => setCategory(event.target.value)} className={controlClass}><option value="all">All Categories</option>{dbCategories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><select value={metric} onChange={(event) => setMetric(event.target.value)} className={controlClass}><option value="value">Rank by Inventory Valuation</option><option value="sold">Rank by Units Sold</option></select></section>
    <ProductTable products={ranked} loading={loading} onAdjustStock={adjustStock} onEdit={editProduct} onDelete={deleteProduct}/>
  </div>;
}
