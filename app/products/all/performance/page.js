'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import ProductPageHeader from '@/app/components/Products/ProductPageHeader';
import ProductKpiSummary from '@/app/components/Products/ProductKpiSummary';
import ProductTable from '@/app/components/Products/ProductTable';

const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function ProductPerformancePage() {
  const { products, dbCategories, loading, error, refreshData, adjustStock, removeProduct } = useProducts();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('value-desc');
  const totalValue = products.reduce((sum, product) => sum + Number(product.price || 0) * Number(product.stock || 0), 0);
  const categoryShares = useMemo(() => {
    const groups = products.reduce((result, product) => {
      const name = product.category || 'Uncategorized';
      const current = result[name] || (result[name] = { name, skus: 0, units: 0, value: 0 });
      current.skus += 1; current.units += Number(product.stock || 0); current.value += Number(product.price || 0) * Number(product.stock || 0);
      return result;
    }, {});
    return Object.values(groups).map((item) => ({ ...item, share: totalValue ? item.value / totalValue * 100 : 0 })).sort((a, b) => b.value - a.value);
  }, [products, totalValue]);
  const ranked = useMemo(() => products.filter((product) => {
    const q = search.toLowerCase();
    return `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(q) && (category === 'all' || product.category_id === category || product.category === category);
  }).sort((a, b) => sort === 'price-desc' ? b.price - a.price : sort === 'stock-asc' ? a.stock - b.stock : sort === 'name-asc' ? a.name.localeCompare(b.name) : b.price * b.stock - a.price * a.stock), [products, search, category, sort]);
  const exportCsv = () => {
    const rows = ranked.map((product) => [product.name, product.sku, product.category, product.price, product.stock, Number(product.price || 0) * Number(product.stock || 0)].map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(','));
    const url = URL.createObjectURL(new Blob([['Product,SKU,Category,Unit Price,Stock,Inventory Value', ...rows].join('\n')], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'product_performance.csv'; link.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const editCatalogProduct = (product) => { window.location.href = `/products/all/catalog?edit=${encodeURIComponent(product.id)}`; };
  const deleteProduct = async (product) => { if (!window.confirm(`Delete “${product.name}” from the catalog?`)) return; try { await removeProduct(product.id); } catch (error) { window.alert(`Could not delete product: ${error.message}`); } };

  return <div className="page-container mx-auto max-w-7xl space-y-6">
    <ProductPageHeader title="Product Performance" description="Live category and SKU inventory valuation share from public.products." loading={loading} onRefresh={refreshData} products={ranked} onExport={exportCsv}/>
    {error && <p role="alert" className="rounded-lg border border-border bg-muted p-3 text-sm text-foreground">{error}</p>}
    <ProductKpiSummary products={products} categories={dbCategories} loading={loading}/>
    <section className="grid grid-cols-1 gap-5 xl:grid-cols-2"><article className="rounded-xl border border-border bg-card p-4 sm:p-5"><h2 className="text-sm font-semibold text-foreground">Category Valuation Share</h2><p className="mt-1 text-xs text-muted-foreground">Share of total current inventory value.</p><div className="mt-5 space-y-4">{categoryShares.map((item) => <div key={item.name}><div className="mb-1.5 flex min-w-0 items-center justify-between gap-3"><span className="truncate text-sm font-medium text-foreground">{item.name} <span className="text-xs font-normal text-muted-foreground">· {item.skus} SKUs</span></span><span className="shrink-0 font-mono text-xs text-foreground">{item.share.toFixed(1)}% · {money(item.value)}</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-foreground" style={{ width: `${item.share}%` }}/></div></div>)}</div></article><article className="rounded-xl border border-border bg-card p-4 sm:p-5"><h2 className="text-sm font-semibold text-foreground">Top SKUs by Inventory Value</h2><p className="mt-1 text-xs text-muted-foreground">Ranked by live price × available stock.</p><div className="mt-4 divide-y divide-border">{[...products].sort((a, b) => b.price * b.stock - a.price * a.stock).slice(0, 6).map((product, index) => <div key={product.id} className="flex items-center justify-between gap-3 py-3"><div className="flex min-w-0 items-center gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-muted font-mono text-[11px] text-foreground">{index + 1}</span><span className="min-w-0"><span className="block truncate text-sm font-medium text-foreground">{product.name}</span><span className="block truncate font-mono text-[10px] text-muted-foreground">{product.sku}</span></span></div><span className="shrink-0 font-mono text-xs font-semibold text-foreground">{money(product.price * product.stock)}</span></div>)}</div>{!products.length && !loading && <p className="py-6 text-center text-sm text-muted-foreground">No products available.</p>}</article></section>
    <section className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-muted/20 p-3.5 sm:grid-cols-2 xl:grid-cols-4"><div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by product, SKU, or category…" className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-xs text-foreground"/></div><select value={category} onChange={(event) => setCategory(event.target.value)} className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground"><option value="all">All Categories</option>{dbCategories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><select value={sort} onChange={(event) => setSort(event.target.value)} className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground"><option value="value-desc">Valuation: High to Low</option><option value="price-desc">Price: High to Low</option><option value="stock-asc">Stock: Low to High</option><option value="name-asc">Name: A–Z</option></select></section>
    <ProductTable products={ranked} loading={loading} onAdjustStock={adjustStock} onEdit={editCatalogProduct} onDelete={deleteProduct}/>
  </div>;
}
