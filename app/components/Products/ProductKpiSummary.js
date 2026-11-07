'use client';

import { AlertTriangle, Boxes, CircleDollarSign, PackageCheck } from 'lucide-react';

export default function ProductKpiSummary({ products = [], categories = [], loading = false }) {
  const units = products.reduce((sum, product) => sum + Number(product.stock || 0), 0);
  const valuation = products.reduce((sum, product) => sum + Number(product.price || 0) * Number(product.stock || 0), 0);
  const averagePrice = products.length ? products.reduce((sum, product) => sum + Number(product.price || 0), 0) / products.length : 0;
  const highest = [...products].sort((a, b) => Number(b.price || 0) * Number(b.stock || 0) - Number(a.price || 0) * Number(a.stock || 0))[0];
  const risk = products.filter((product) => Number(product.stock || 0) <= 10).length;
  const cards = [
    { label: 'Total Catalog Valuation', value: `₹${valuation.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, detail: `${units.toLocaleString('en-IN')} total units`, icon: CircleDollarSign },
    { label: 'Active SKUs', value: products.length.toLocaleString('en-IN'), detail: `${categories.length.toLocaleString('en-IN')} categories`, icon: PackageCheck },
    { label: 'Avg Unit Price', value: `₹${averagePrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, detail: highest ? `Top SKU: ${highest.name}` : 'No SKUs yet', icon: Boxes },
    { label: 'Low / Out of Stock', value: risk.toLocaleString('en-IN'), detail: risk ? 'Review stock health' : 'All items above threshold', icon: AlertTriangle },
  ];
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({ label, value, detail, icon: Icon }) => <article key={label} className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5"><div className="flex items-center justify-between gap-3"><p className="min-w-0 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted/70 text-foreground"><Icon size={16} strokeWidth={1.75}/></span></div><p className="mt-3 break-words font-mono text-2xl font-bold tracking-tight text-foreground">{loading ? '…' : value}</p><div className="mt-3 flex min-w-0 flex-wrap items-center gap-2"><span className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] font-medium text-foreground">LIVE</span><span className="min-w-0 break-words text-xs text-muted-foreground">{detail}</span></div></article>)}</div>;
}
