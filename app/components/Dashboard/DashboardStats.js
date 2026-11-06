'use client';

import { Activity, DollarSign, ShoppingCart, Users } from 'lucide-react';

export default function DashboardStats({ statsData, loading, catalogValue = 0, catalogUnits = 0, catalogSkus = 0 }) {
  const s = statsData || {};
  const stats = [
    { title: 'Total Catalog Valuation', value: `₹${Number(catalogValue).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, detail: `${Number(catalogUnits).toLocaleString('en-IN')} units across ${Number(catalogSkus).toLocaleString('en-IN')} SKUs`, icon: DollarSign },
    { title: 'Active Users', value: Number(s.activeUsers || 0).toLocaleString('en-IN'), detail: `${Number(s.totalUsers || 0).toLocaleString('en-IN')} total users`, icon: Users },
    { title: s.ordersLabel || 'Total Orders', value: Number(s.totalOrders || 0).toLocaleString('en-IN'), detail: 'Live database records', icon: ShoppingCart },
    { title: 'Active Catalog Rate', value: `${Number(s.conversionRate || 0).toFixed(1)}%`, detail: 'Active stock ratio', icon: Activity },
  ];

  return <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {stats.map(({ title, value, detail, icon: Icon }) => <article key={title} className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted/70 text-foreground"><Icon size={16} strokeWidth={1.75}/></span>
      </div>
      <p className="mt-3 break-words font-mono text-2xl font-bold tracking-tight text-foreground">{loading ? '…' : value}</p>
      <div className="mt-3 flex min-w-0 flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] font-medium text-foreground">LIVE</span>
        <span className="text-xs text-muted-foreground">{detail}</span>
      </div>
    </article>)}
  </div>;
}
