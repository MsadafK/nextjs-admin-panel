'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, FileText, Lock, Plus, Printer, RefreshCw, Trash2, X } from 'lucide-react';
import { orderService } from '@/services/orderService';
import { productService } from '@/services/productService';
import { settingsService } from '@/services/settingsService';
import { useAuth } from '@/app/contexts/AuthContext';
import { useToast } from '@/app/contexts/ToastContext';

const STATUSES = ['pending', 'processing', 'shipped', 'completed', 'cancelled'];
const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const control = 'h-9 w-full min-w-0 rounded-md border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-foreground';
const dateIST = (value) => value ? new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '—';
const statusLabel = (value) => String(value || 'pending').replace(/^./, (letter) => letter.toUpperCase());

export default function SalesOrdersManager({ products: availableProducts = [], onOrdersChanged }) {
  const { isAdmin, isManager } = useAuth();
  const { pushToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState(availableProducts);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [taxInclusive, setTaxInclusive] = useState(true);
  const [preferences, setPreferences] = useState({ workspaceName: 'AdminPro Workspace', supportEmail: '' });
  const [form, setForm] = useState({ customerName: '', customerEmail: '', productId: '', quantity: 1, status: 'pending' });

  const refreshOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try { setOrders(await orderService.fetchOrders()); }
    catch (loadError) { setError(loadError.message || 'Unable to load live orders.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    refreshOrders();
    setPreferences(settingsService.getWorkspacePreferences());
    if (new URLSearchParams(window.location.search).get('createOrder') === '1') setFormOpen(true);
  }, [refreshOrders]);
  useEffect(() => { setProducts(availableProducts); }, [availableProducts]);

  const selectedProduct = products.find((product) => String(product.id) === String(form.productId)) || null;
  const quantity = Math.max(1, Number(form.quantity) || 1);
  const unitPrice = Number(selectedProduct?.price || 0);
  const total = unitPrice * quantity;

  const updateStatus = async (order, status) => {
    if (!isManager) return;
    setBusyId(order.id); setError('');
    try {
      const updated = await orderService.updateOrderStatus(order.id, status);
      setOrders((current) => current.map((item) => String(item.id) === String(order.id) ? updated : item));
      pushToast({ title: 'Order status updated', subtitle: `${order.orderNumber}: ${statusLabel(order.status)} → ${statusLabel(status)}`, onUndo: async () => {
        const restored = await orderService.updateOrderStatus(order.id, order.status);
        setOrders((current) => current.map((item) => String(item.id) === String(order.id) ? restored : item));
        onOrdersChanged?.();
      } });
      onOrdersChanged?.();
    } catch (updateError) { setError(updateError.message || 'Could not update order status.'); }
    finally { setBusyId(null); }
  };

  const deleteOrder = async (order) => {
    if (!isAdmin) return;
    if (!window.confirm(`Delete order ${order.orderNumber}?`)) return;
    setBusyId(order.id); setError('');
    try {
      await orderService.deleteOrder(order.id, { isAdmin });
      setOrders((current) => current.filter((item) => String(item.id) !== String(order.id)));
      pushToast({ title: 'Order deleted', subtitle: `${order.orderNumber} removed from the sales ledger`, onUndo: async () => {
        const restored = await orderService.restoreOrder(order, { isAdmin });
        setOrders((current) => [restored, ...current]);
        onOrdersChanged?.();
      } });
      onOrdersChanged?.();
    } catch (deleteError) { setError(deleteError.message || 'Could not delete this order.'); }
    finally { setBusyId(null); }
  };

  const createOrder = async (event) => {
    event.preventDefault();
    if (!isManager) return;
    setBusyId('create'); setError('');
    try {
      const created = await orderService.createOrder({
        customerName: form.customerName.trim(), customerEmail: form.customerEmail.trim(),
        productId: selectedProduct?.id || null, productName: selectedProduct?.name || 'Custom item',
        sku: selectedProduct?.sku || '', quantity, unitPrice, totalAmount: total, status: form.status,
      });
      setOrders((current) => [created, ...current]);
      setProducts((current) => current.map((product) => String(product.id) === String(selectedProduct?.id) ? { ...product, stock: Math.max(0, Number(product.stock || 0) - quantity) } : product));
      setForm({ customerName: '', customerEmail: '', productId: '', quantity: 1, status: 'pending' });
      setFormOpen(false);
      onOrdersChanged?.();
    } catch (createError) { setError(createError.message || 'Could not create the order.'); }
    finally { setBusyId(null); }
  };

  const invoiceLine = useMemo(() => {
    if (!invoiceOrder) return null;
    const qty = Math.max(1, Number(invoiceOrder.quantity || 1));
    const amount = Number(invoiceOrder.totalAmount || 0);
    const price = Number(invoiceOrder.unitPrice || (amount / qty));
    return { name: invoiceOrder.productName || 'Order items', sku: invoiceOrder.sku, quantity: qty, unitPrice: price, amount };
  }, [invoiceOrder]);
  const subtotal = invoiceLine ? (taxInclusive ? invoiceLine.amount / 1.18 : invoiceLine.amount) : 0;
  const taxAmount = invoiceLine ? (taxInclusive ? invoiceLine.amount - subtotal : 0) : 0;
  const grandTotal = subtotal + taxAmount;

  return <section className="overflow-hidden rounded-xl border border-border bg-card">
    <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-sm font-semibold text-foreground">Live Orders Pipeline</h2><p className="mt-1 text-xs text-muted-foreground">{orders.length} orders synced from public.orders · Pending → Processing → Shipped → Completed</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={refreshOrders} disabled={loading} className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground hover:bg-muted"><RefreshCw size={14} className={loading ? 'animate-spin' : ''}/>Refresh</button><button type="button" onClick={() => setFormOpen(true)} disabled={!isManager} title={!isManager ? 'Requires Manager or Admin privileges' : undefined} className="inline-flex h-9 items-center gap-2 rounded-md bg-foreground px-4 text-xs font-medium text-background hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">{!isManager ? <Lock size={14}/> : <Plus size={14}/>}Create Order</button></div></div>
    {error && <p role="alert" className="m-4 rounded-md border border-border bg-muted p-3 text-xs text-foreground">{error}</p>}
    {loading ? <p className="p-8 text-center text-sm text-muted-foreground">Loading orders…</p> : orders.length ? <div className="w-full overflow-x-auto"><table className="w-full min-w-[820px] border-collapse text-left text-sm"><thead><tr className="border-b border-border bg-muted/40 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"><th className="px-4 py-3">Order ID</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Product / Items</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Created</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-border">{orders.map((order) => { const initials = (order.customerName || 'C').split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase(); const cancelled = order.status === 'cancelled'; return <tr key={order.id} className="hover:bg-muted/30"><td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs font-semibold">#{order.orderNumber}</td><td className="whitespace-nowrap px-4 py-3.5"><div className="flex items-center gap-2.5"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground font-mono text-[10px] font-semibold text-background">{initials}</span><span><span className="block text-xs font-medium text-foreground">{order.customerName}</span><span className="block text-[10px] text-muted-foreground">{order.customerEmail || 'Email not provided'}</span></span></div></td><td className="px-4 py-3.5"><p className="text-xs font-medium">{order.productName}</p><p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{order.sku ? `${order.sku} · ` : ''}{order.quantity} units</p></td><td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs font-semibold">{money(order.totalAmount)}</td><td className="whitespace-nowrap px-4 py-3.5"><div className="flex items-center gap-1.5"><select aria-label={`Order status for ${order.orderNumber}`} disabled={!isManager || busyId === order.id} title={!isManager ? 'Requires Manager or Admin privileges' : undefined} value={order.status} onChange={(event) => updateStatus(order, event.target.value)} className={`h-8 rounded-md border border-border px-2 text-[11px] font-medium ${order.status === 'completed' ? 'bg-foreground text-background' : cancelled ? 'bg-muted text-muted-foreground line-through' : 'bg-muted text-foreground'} disabled:cursor-not-allowed disabled:opacity-60`}>{STATUSES.map((status) => <option key={status} value={status}>{statusLabel(status)}</option>)}</select>{!isManager && <Lock size={12} className="text-muted-foreground"/>}</div></td><td className="whitespace-nowrap px-4 py-3.5 font-mono text-[10px] text-muted-foreground">{dateIST(order.createdAt)}</td><td className="whitespace-nowrap px-4 py-3.5"><div className="flex justify-end gap-1.5"><button type="button" onClick={() => { setInvoiceOrder(order); setTaxInclusive(true); }} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium hover:bg-muted"><FileText size={13}/>Invoice</button><button type="button" disabled={!isAdmin || busyId === order.id} title={!isAdmin ? 'Requires Admin privileges' : undefined} onClick={() => deleteOrder(order)} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50">{!isAdmin ? <Lock size={12}/> : <Trash2 size={13}/>}Delete</button></div></td></tr>; })}</tbody></table></div> : <div className="p-8 text-center"><p className="text-sm font-medium text-foreground">No orders yet</p><p className="mt-1 text-xs text-muted-foreground">Create an order to start tracking the live sales pipeline.</p></div>}

    {formOpen && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) setFormOpen(false); }}><form onSubmit={createOrder} className="max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-xl border border-border bg-background p-5 text-foreground shadow-2xl sm:p-6"><div className="flex items-start justify-between gap-3 border-b border-border pb-4"><div><h2 className="text-lg font-semibold">Create Order</h2><p className="mt-1 text-xs text-muted-foreground">Add a customer order to the live sales pipeline.</p></div><button type="button" onClick={() => setFormOpen(false)} aria-label="Close order form" className="flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-muted"><X size={15}/></button></div><div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2"><label className="space-y-1.5 text-xs font-medium">Customer Name *<input required value={form.customerName} onChange={(event) => setForm((current) => ({ ...current, customerName: event.target.value }))} placeholder="Customer name" className={control}/></label><label className="space-y-1.5 text-xs font-medium">Customer Email<input type="email" value={form.customerEmail} onChange={(event) => setForm((current) => ({ ...current, customerEmail: event.target.value }))} placeholder="customer@company.com" className={control}/></label><label className="space-y-1.5 text-xs font-medium md:col-span-2">Select Product<select required value={form.productId} onChange={(event) => setForm((current) => ({ ...current, productId: event.target.value }))} className={control}><option value="">Choose a live product…</option>{products.map((product) => <option key={product.id} value={product.id}>{product.name} · {product.sku} · {money(product.price)}</option>)}</select></label><label className="space-y-1.5 text-xs font-medium">Quantity *<input type="number" min="1" step="1" required value={form.quantity} onChange={(event) => setForm((current) => ({ ...current, quantity: event.target.value }))} className={control}/></label><label className="space-y-1.5 text-xs font-medium">Order Status<select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} className={control}><option value="pending">Pending</option><option value="processing">Processing</option><option value="completed">Completed</option></select></label></div><div className="mt-5 grid grid-cols-1 gap-4 rounded-lg border border-border bg-muted/30 p-4 sm:grid-cols-2"><div><p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Live Order Summary Preview</p><p className="mt-2 text-sm font-semibold">{form.customerName || 'Customer Name'}</p><p className="text-xs text-muted-foreground">{selectedProduct?.name || 'Select a product'}{selectedProduct?.sku ? ` · ${selectedProduct.sku}` : ''} × {quantity}</p></div><div className="sm:text-right"><p className="text-xs text-muted-foreground">Total Amount (₹)</p><p className="mt-1 font-mono text-2xl font-bold">₹{total.toFixed(2)}</p></div></div><div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-border pt-4"><button type="button" onClick={() => setForm({ customerName: '', customerEmail: '', productId: '', quantity: 1, status: 'pending' })} className="h-9 rounded-md border border-border px-4 text-xs font-medium hover:bg-muted">Reset</button><button type="submit" disabled={busyId === 'create' || !isManager} title={!isManager ? 'Requires Manager or Admin privileges' : undefined} className="inline-flex h-9 items-center gap-2 rounded-md bg-foreground px-5 text-xs font-medium text-background hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"><Check size={14}/>{busyId === 'create' ? 'Saving…' : 'Create Order'}</button></div></form></div>}

    {invoiceOrder && invoiceLine && <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) setInvoiceOrder(null); }}><div role="dialog" aria-modal="true" aria-label={`Invoice ${invoiceOrder.orderNumber}`} className="max-h-[94dvh] w-full max-w-3xl overflow-y-auto rounded-xl border border-border bg-background text-foreground shadow-2xl"><div className="invoice-print-area p-5 sm:p-8"><div className="flex flex-col gap-5 border-b-2 border-foreground pb-5 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-lg font-bold tracking-tight">AdminPro <span className="text-xs font-medium">PRO</span></p><p className="mt-1 text-xs text-muted-foreground">Tax Invoice</p></div><div className="sm:text-right"><p className="font-mono text-lg font-semibold">INVOICE #{invoiceOrder.orderNumber}</p><p className="mt-1 text-xs text-muted-foreground">Issued {dateIST(invoiceOrder.createdAt)}</p><span className="mt-2 inline-flex rounded border border-border bg-muted px-2 py-1 font-mono text-[10px] uppercase">{statusLabel(invoiceOrder.status)}</span></div></div><div className="grid grid-cols-1 gap-5 py-6 sm:grid-cols-2"><div><p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Billed To</p><p className="mt-2 text-sm font-semibold">{invoiceOrder.customerName}</p><p className="mt-1 break-all text-xs text-muted-foreground">{invoiceOrder.customerEmail || 'Email not provided'}</p></div><div className="sm:text-right"><p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Issued By</p><p className="mt-2 text-sm font-semibold">{preferences.workspaceName}</p><p className="mt-1 break-all text-xs text-muted-foreground">{preferences.supportEmail || 'Workspace Support'}</p></div></div><div className="overflow-x-auto"><table className="w-full min-w-[560px] border-collapse text-left text-xs"><thead><tr className="border-y border-border bg-muted/50 text-[10px] uppercase tracking-wider text-muted-foreground"><th className="px-3 py-3">Item Description</th><th className="px-3 py-3 text-right">Qty</th><th className="px-3 py-3 text-right">Unit Price ₹</th><th className="px-3 py-3 text-right">Line Total ₹</th></tr></thead><tbody><tr className="border-b border-border"><td className="px-3 py-4"><p className="font-semibold text-foreground">{invoiceLine.name}</p>{invoiceLine.sku && <p className="mt-1 font-mono text-[10px] text-muted-foreground">{invoiceLine.sku}</p>}</td><td className="px-3 py-4 text-right font-mono">{invoiceLine.quantity}</td><td className="px-3 py-4 text-right font-mono">{money(invoiceLine.unitPrice)}</td><td className="px-3 py-4 text-right font-mono font-semibold">{money(invoiceLine.amount)}</td></tr></tbody></table></div><div className="flex flex-col gap-5 pt-5 sm:flex-row sm:justify-between"><div className="no-print"><p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Tax Treatment</p><div className="mt-2 inline-flex rounded-md border border-border p-1"><button type="button" onClick={() => setTaxInclusive(true)} className={`rounded px-2.5 py-1.5 text-[11px] font-medium ${taxInclusive ? 'bg-foreground text-background' : 'text-foreground hover:bg-muted'}`}>Inclusive 18% GST</button><button type="button" onClick={() => setTaxInclusive(false)} className={`rounded px-2.5 py-1.5 text-[11px] font-medium ${!taxInclusive ? 'bg-foreground text-background' : 'text-foreground hover:bg-muted'}`}>0% GST</button></div></div><dl className="w-full max-w-xs space-y-2 text-xs sm:ml-auto"><div className="flex justify-between gap-6"><dt className="text-muted-foreground">Subtotal</dt><dd className="font-mono">{money(subtotal)}</dd></div><div className="flex justify-between gap-6"><dt className="text-muted-foreground">GST {taxInclusive ? '(18% inclusive)' : '(0%)'}</dt><dd className="font-mono">{money(taxAmount)}</dd></div><div className="flex justify-between gap-6 border-t border-border pt-3 text-sm font-semibold"><dt>Grand Total</dt><dd className="font-mono">{money(grandTotal)}</dd></div></dl></div><p className="mt-6 border-t border-border pt-4 text-[10px] text-muted-foreground">Thank you for your business. This invoice was generated from the live workspace order record.</p></div><div className="no-print flex flex-wrap justify-end gap-2 border-t border-border bg-muted/20 p-4"><button type="button" onClick={() => setInvoiceOrder(null)} className="h-9 rounded-md border border-border px-4 text-xs font-medium hover:bg-muted">Close</button><button type="button" onClick={() => window.print()} className="inline-flex h-9 items-center gap-2 rounded-md bg-foreground px-4 text-xs font-medium text-background hover:opacity-90"><Printer size={14}/>Download / Print Invoice</button></div></div><style jsx global>{`@media print { body * { visibility: hidden !important; } .invoice-print-area, .invoice-print-area * { visibility: visible !important; } .invoice-print-area { position: absolute !important; inset: 0 auto auto 0 !important; width: 100% !important; max-height: none !important; overflow: visible !important; border: 0 !important; box-shadow: none !important; background: #fff !important; color: #000 !important; } .invoice-print-area button { display: none !important; } .no-print { display: none !important; } }`}</style></div>}
  </section>;
}
