'use client';

import { Download, PackagePlus, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function exportProductsCsv(products = [], filename = 'products_export.csv') {
  const columns = ['Product', 'SKU', 'Category', 'Unit Price', 'Stock', 'Inventory Value', 'Status'];
  const quote = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  const rows = products.map((product) => [product.name, product.sku, product.category, product.price, product.stock, Number(product.price || 0) * Number(product.stock || 0), product.status].map(quote).join(','));
  const blob = new Blob([[columns.map(quote).join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = filename; link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function ProductPageHeader({ title, description, loading, onRefresh, products = [], onExport = () => exportProductsCsv(products), primaryLabel = '+ Add Product', primaryHref = '/products/add', onPrimary }) {
  const router = useRouter();
  return <header className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="min-w-0"><div className="flex items-center gap-2"><h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{title}</h1><span className="h-2 w-2 shrink-0 rounded-full bg-foreground" title="Live database sync"/></div><p className="mt-1 text-sm text-muted-foreground">{description}</p></div>
    <div className="flex flex-wrap gap-2">{onRefresh && <button type="button" onClick={onRefresh} className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground hover:bg-muted"><RefreshCw size={14} className={loading ? 'animate-spin' : ''}/>Refresh</button>}<button type="button" onClick={onExport} className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground hover:bg-muted"><Download size={14}/>Export CSV</button><button type="button" onClick={() => onPrimary ? onPrimary() : router.push(primaryHref)} className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-foreground px-4 text-xs font-medium text-background transition-opacity hover:opacity-90"><PackagePlus size={14}/>{primaryLabel}</button></div>
  </header>;
}
