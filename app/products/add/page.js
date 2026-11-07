'use client';

import { useState } from 'react';
import { Check, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import ProductPageHeader from '@/app/components/Products/ProductPageHeader';
import ProductKpiSummary from '@/app/components/Products/ProductKpiSummary';

const inputClass = 'h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-foreground';

export default function AddProductPage() {
  const router = useRouter();
  const { products, dbCategories, loading, error, refreshData, addProduct } = useProducts();
  const [form, setForm] = useState({ name: '', sku: '', category_id: '', price: '', stock: '0', description: '', status: 'active' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const category = dbCategories.find((item) => item.id === (form.category_id || dbCategories[0]?.id));
  const initial = form.name.trim().split(/\s+/).map((word) => word[0]).join('').slice(0, 2).toUpperCase() || 'P';
  const handleSubmit = async (event) => {
    event.preventDefault(); setSaving(true); setMessage('');
    try { await addProduct({ ...form, category_id: form.category_id || dbCategories[0]?.id || '', price: Number(form.price), stock: Number(form.stock) }); setMessage('Product saved.'); window.setTimeout(() => router.push('/products/all/catalog'), 700); }
    catch (saveError) { setMessage(saveError.message || 'Unable to create product.'); }
    finally { setSaving(false); }
  };

  return <div className="page-container mx-auto max-w-7xl space-y-6">
    <ProductPageHeader title="Add New Product" description="Create a product record in the live public.products catalog." loading={loading} onRefresh={refreshData} products={products} primaryLabel="Back to Catalog" primaryHref="/products/all/catalog"/>
    <ProductKpiSummary products={products} categories={dbCategories} loading={loading}/>
    {(error || message) && <p role={error || message.includes('Unable') ? 'alert' : 'status'} className="rounded-lg border border-border bg-muted p-3 text-sm text-foreground">{message || error}</p>}
    <form onSubmit={handleSubmit} className="grid grid-cols-1 items-start gap-5 xl:grid-cols-3">
      <section className="rounded-xl border border-border bg-background p-5 sm:p-6 xl:col-span-2"><div className="mb-5 flex items-center gap-3 border-b border-border pb-4"><span className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-muted text-foreground"><Package size={17}/></span><div><h2 className="text-sm font-semibold text-foreground">Product Details</h2><p className="mt-1 text-xs text-muted-foreground">Set the product identity, price, inventory, and category.</p></div></div><div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="space-y-1.5 text-xs font-medium text-foreground">Product Name<input required value={form.name} onChange={update('name')} placeholder="Product name" className={inputClass}/></label>
        <label className="space-y-1.5 text-xs font-medium text-foreground">SKU<input required value={form.sku} onChange={update('sku')} placeholder="SKU-001" className={inputClass}/></label>
        <label className="space-y-1.5 text-xs font-medium text-foreground">Category<select value={form.category_id || dbCategories[0]?.id || ''} onChange={update('category_id')} className={inputClass}><option value="">Uncategorized</option>{dbCategories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label className="space-y-1.5 text-xs font-medium text-foreground">Price (₹)<input type="number" min="0" step="0.01" required value={form.price} onChange={update('price')} placeholder="0.00" className={inputClass}/></label>
        <label className="space-y-1.5 text-xs font-medium text-foreground">Stock Quantity<input type="number" min="0" step="1" required value={form.stock} onChange={update('stock')} className={inputClass}/></label>
        <label className="space-y-1.5 text-xs font-medium text-foreground">Status<select value={form.status} onChange={update('status')} className={inputClass}><option value="active">Active</option><option value="draft">Draft</option></select></label>
        <label className="space-y-1.5 text-xs font-medium text-foreground md:col-span-2">Description<textarea rows={4} value={form.description} onChange={update('description')} placeholder="Product details…" className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground"/></label>
      </div><div className="mt-6 flex justify-end gap-2 border-t border-border pt-4"><button type="button" onClick={() => router.push('/products/all/catalog')} className="h-9 rounded-md border border-border px-4 text-xs font-medium text-foreground hover:bg-muted">Cancel / Reset</button><button type="submit" disabled={saving} className="inline-flex h-9 items-center gap-2 rounded-md bg-foreground px-5 text-xs font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60"><Check size={14}/>{saving ? 'Saving…' : 'Save Product'}</button></div></section>
      <aside className="rounded-xl border border-border bg-background p-5 sm:p-6"><h2 className="text-sm font-semibold text-foreground">Live Product Preview</h2><p className="mt-1 text-xs text-muted-foreground">Preview the catalog card before saving.</p><div className="mt-5 rounded-lg border border-border bg-muted/20 p-4"><div className="flex items-start justify-between gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground font-mono text-xs font-semibold text-background">{initial}</span><span className="rounded border border-border bg-background px-2 py-0.5 font-mono text-[10px] uppercase text-foreground">{form.status}</span></div><h3 className="mt-4 text-sm font-semibold text-foreground">{form.name || 'Product Name'}</h3><p className="mt-1 font-mono text-xs text-muted-foreground">{form.sku || 'SKU'}</p><div className="mt-4 flex flex-wrap gap-2"><span className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-[10px] uppercase text-foreground">{category?.name || 'Uncategorized'}</span><span className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-[10px] text-foreground">{Number(form.stock || 0)} units</span></div><div className="mt-4 border-t border-border pt-3"><p className="font-mono text-lg font-semibold text-foreground">₹{Number(form.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p><p className="mt-1 text-xs text-muted-foreground">Inventory value ₹{(Number(form.price || 0) * Number(form.stock || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p></div></div></aside>
    </form>
  </div>;
}
