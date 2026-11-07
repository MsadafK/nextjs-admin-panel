'use client';

import { useState } from 'react';
import { Minus, Plus, Pencil, Trash2 } from 'lucide-react';

const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function ProductTable({ products = [], loading = false, onEdit, onDelete, onAdjustStock, onQuickRestock }) {
  const [updatingId, setUpdatingId] = useState(null);
  const maxStock = Math.max(1, ...products.map((product) => Number(product.stock || 0)));
  const adjust = async (product, delta) => {
    if (!onAdjustStock) return;
    setUpdatingId(product.id);
    try { await onAdjustStock(product.id, Math.max(0, Number(product.stock || 0) + delta)); }
    catch (error) { window.alert(`Unable to update stock: ${error.message}`); }
    finally { setUpdatingId(null); }
  };
  return <section className="overflow-hidden rounded-xl border border-border bg-card">
    <div className="flex items-center justify-between border-b border-border px-4 py-3.5"><div><h2 className="text-sm font-semibold text-foreground">Product Inventory</h2><p className="mt-1 text-xs text-muted-foreground">{products.length} live products in view</p></div><span className="rounded border border-border bg-muted px-2 py-1 font-mono text-[10px] text-foreground">LIVE DATA</span></div>
    {loading ? <p className="p-12 text-center text-sm text-muted-foreground">Loading products…</p> : products.length === 0 ? <p className="p-12 text-center text-sm text-muted-foreground">No products match the current filters.</p> : <div className="w-full overflow-x-auto"><table className="w-full min-w-[820px] border-collapse text-left text-sm"><thead><tr className="border-b border-border bg-muted/40 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"><th className="px-4 py-3">Product</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Unit Price</th><th className="px-4 py-3">Stock Level</th><th className="px-4 py-3">Total Value</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-border">{products.map((product) => {
      const stock = Number(product.stock || 0);
      const minStock = Number(product.minStock ?? 10);
      const state = stock === 0 ? 'Out of Stock' : stock <= minStock ? 'Low Stock' : 'In Stock';
      const initial = (product.name || 'P').trim().split(/\s+/).map((word) => word[0]).join('').slice(0, 2).toUpperCase();
      return <tr key={product.id} className="transition-colors hover:bg-muted/30">
        <td className="whitespace-nowrap px-4 py-3.5"><div className="flex items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-foreground font-mono text-xs font-semibold text-background">{initial}</span><span><span className="block font-medium text-foreground">{product.name}</span><span className="block font-mono text-xs text-muted-foreground">{product.sku}</span></span></div></td>
        <td className="whitespace-nowrap px-4 py-3.5"><span className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-[11px] uppercase text-foreground">{product.category || 'Uncategorized'}</span></td>
        <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs font-medium text-foreground">{money(product.price)}</td>
        <td className="min-w-44 px-4 py-3.5"><div className="flex items-center gap-2"><button type="button" aria-label={`Decrease ${product.name} stock`} disabled={!onAdjustStock || stock <= 0 || updatingId === product.id} onClick={() => adjust(product, -1)} className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-border text-foreground hover:bg-muted disabled:opacity-40"><Minus size={13}/></button><span className="min-w-12 text-center font-mono text-xs font-semibold text-foreground">{stock}</span><button type="button" aria-label={`Increase ${product.name} stock`} disabled={!onAdjustStock || updatingId === product.id} onClick={() => adjust(product, 1)} className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-border text-foreground hover:bg-muted disabled:opacity-40"><Plus size={13}/></button></div><div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-foreground" style={{ width: `${stock / maxStock * 100}%` }}/></div></td>
        <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs font-semibold text-foreground">{money(Number(product.price || 0) * stock)}</td>
        <td className="whitespace-nowrap px-4 py-3.5"><span className={`inline-flex rounded-full px-2 py-1 text-[11px] font-medium ${state === 'In Stock' ? 'bg-foreground text-background' : state === 'Low Stock' ? 'border border-border bg-muted text-foreground' : 'border border-dashed border-border bg-muted text-muted-foreground'}`}>{state}</span></td>
        <td className="whitespace-nowrap px-4 py-3.5"><div className="flex justify-end gap-1.5">{onQuickRestock && <button type="button" onClick={() => onQuickRestock(product)} className="inline-flex h-8 items-center gap-1 rounded-md border border-border px-2 text-xs font-medium text-foreground hover:bg-muted">+10</button>}{onEdit && <button type="button" onClick={() => onEdit(product)} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium text-foreground hover:bg-muted"><Pencil size={13}/>Edit</button>}{onDelete && <button type="button" onClick={() => onDelete(product)} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium text-foreground hover:bg-muted"><Trash2 size={13}/>Delete</button>}</div></td>
      </tr>;
    })}</tbody></table></div>}
  </section>;
}
