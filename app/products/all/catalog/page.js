'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, X, Check } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import ProductPageHeader, { exportProductsCsv } from '@/app/components/Products/ProductPageHeader';
import ProductKpiSummary from '@/app/components/Products/ProductKpiSummary';
import ProductTable from '@/app/components/Products/ProductTable';

const controlClass = 'h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-foreground';

export default function ProductCatalogPage() {
  const { products, dbCategories, loading, error, refreshData, editProduct, adjustStock, removeProduct } = useProducts();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [stockStatus, setStockStatus] = useState('all');
  const [sort, setSort] = useState('value-desc');
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    const requestedId = new URLSearchParams(window.location.search).get('edit');
    if (!requestedId || !products.length) return;
    const product = products.find((item) => String(item.id) === requestedId);
    if (product) setEditing(product);
    window.history.replaceState({}, '', window.location.pathname);
  }, [products]);
  const productsByFilter = useMemo(() => {
    const list = products.filter((product) => {
      const q = search.toLowerCase();
      const matchesQuery = `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(q);
      const matchesCategory = category === 'all' || product.category_id === category || product.category === category;
      const stock = Number(product.stock || 0);
      const matchesStock = stockStatus === 'all' || (stockStatus === 'in-stock' && stock > Number(product.minStock || 10)) || (stockStatus === 'low-stock' && stock > 0 && stock <= Number(product.minStock || 10)) || (stockStatus === 'out-of-stock' && stock === 0);
      return matchesQuery && matchesCategory && matchesStock;
    });
    return list.sort((a, b) => sort === 'price-desc' ? b.price - a.price : sort === 'stock-asc' ? a.stock - b.stock : sort === 'name-asc' ? a.name.localeCompare(b.name) : b.price * b.stock - a.price * a.stock);
  }, [products, search, category, stockStatus, sort]);

  const deleteProduct = async (product) => {
    if (!window.confirm(`Delete “${product.name}” from the catalog?`)) return;
    try { await removeProduct(product.id); }
    catch (deleteError) { window.alert(`Could not delete product: ${deleteError.message}`); }
  };
  const saveEdit = async (event) => {
    event.preventDefault(); if (!editing) return;
    setSaving(true);
    try { await editProduct(editing.id, editing); setEditing(null); }
    catch (editError) { window.alert(`Could not save product: ${editError.message}`); }
    finally { setSaving(false); }
  };

  return <div className="page-container mx-auto max-w-7xl space-y-6">
    <ProductPageHeader title="Product Catalog" description="Manage live product records, stock, and catalog value from public.products." loading={loading} onRefresh={refreshData} products={products} onExport={() => exportProductsCsv(productsByFilter, 'products_catalog.csv')}/>
    {error && <p role="alert" className="rounded-lg border border-border bg-muted p-3 text-sm text-foreground">{error}</p>}
    <ProductKpiSummary products={products} categories={dbCategories} loading={loading}/>
    <section className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-muted/20 p-3.5 sm:grid-cols-2 xl:grid-cols-4"><div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by product name, SKU, or category..." className={`${controlClass} pl-9`}/></div><select value={category} onChange={(event) => setCategory(event.target.value)} className={controlClass}><option value="all">All Categories</option>{dbCategories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><select value={stockStatus} onChange={(event) => setStockStatus(event.target.value)} className={controlClass}><option value="all">All Stock Levels</option><option value="in-stock">In Stock</option><option value="low-stock">Low Stock</option><option value="out-of-stock">Out of Stock</option></select><select value={sort} onChange={(event) => setSort(event.target.value)} className={controlClass}><option value="value-desc">Valuation: High to Low</option><option value="price-desc">Price: High to Low</option><option value="stock-asc">Stock: Low to High</option><option value="name-asc">Name: A–Z</option></select></section>
    <ProductTable products={productsByFilter} loading={loading} onAdjustStock={adjustStock} onEdit={setEditing} onDelete={deleteProduct}/>

    {editing && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditing(null); }}><form onSubmit={saveEdit} className="max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-xl border border-border bg-background p-5 shadow-2xl sm:p-6"><div className="mb-5 flex items-center justify-between border-b border-border pb-4"><div><h2 className="text-lg font-semibold text-foreground">Edit Product</h2><p className="mt-1 text-xs text-muted-foreground">Save updates to public.products.</p></div><button type="button" onClick={() => setEditing(null)} aria-label="Close edit product" className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted"><X size={15}/></button></div><div className="grid grid-cols-1 gap-4 md:grid-cols-2"><label className="space-y-1.5 text-xs font-medium text-foreground">Product Name<input required value={editing.name || ''} onChange={(event) => setEditing({ ...editing, name: event.target.value })} className={controlClass}/></label><label className="space-y-1.5 text-xs font-medium text-foreground">SKU<input required value={editing.sku || ''} onChange={(event) => setEditing({ ...editing, sku: event.target.value })} className={controlClass}/></label><label className="space-y-1.5 text-xs font-medium text-foreground">Category<select value={editing.category_id || ''} onChange={(event) => setEditing({ ...editing, category_id: event.target.value })} className={controlClass}><option value="">Uncategorized</option>{dbCategories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label className="space-y-1.5 text-xs font-medium text-foreground">Price (₹)<input type="number" min="0" step="0.01" required value={editing.price ?? ''} onChange={(event) => setEditing({ ...editing, price: event.target.value })} className={controlClass}/></label><label className="space-y-1.5 text-xs font-medium text-foreground">Stock Quantity<input type="number" min="0" required value={editing.stock ?? ''} onChange={(event) => setEditing({ ...editing, stock: event.target.value })} className={controlClass}/></label><label className="space-y-1.5 text-xs font-medium text-foreground">Status<select value={editing.status || 'active'} onChange={(event) => setEditing({ ...editing, status: event.target.value })} className={controlClass}><option value="active">Active</option><option value="draft">Draft</option></select></label><label className="space-y-1.5 text-xs font-medium text-foreground md:col-span-2">Description<textarea rows={3} value={editing.description || ''} onChange={(event) => setEditing({ ...editing, description: event.target.value })} className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground"/></label></div><div className="mt-5 flex justify-end gap-2 border-t border-border pt-4"><button type="button" onClick={() => setEditing(null)} className="h-9 rounded-md border border-border px-4 text-xs font-medium text-foreground hover:bg-muted">Cancel</button><button disabled={saving} className="inline-flex h-9 items-center gap-2 rounded-md bg-foreground px-5 text-xs font-medium text-background"><Check size={14}/>{saving ? 'Saving…' : 'Save Product'}</button></div></form></div>}
  </div>;
}
