'use client';

import { CalendarDays, Mail, Package, RefreshCw } from 'lucide-react';
import DashboardStats from './components/Dashboard/DashboardStats';
import RecentActivity from './components/Dashboard/RecentActivity';
import QuickActions from './components/Dashboard/QuickActions';
import { useDashboard } from '@/hooks/useDashboard';

export default function Dashboard() {
  const { summaryStats, recentActivities, products, events, notifications, loading, error, refreshDashboard } = useDashboard();
  const categories = Object.values((products || []).reduce((result, product) => {
    const name = product.category || 'Uncategorized';
    const entry = result[name] || (result[name] = { name, skuCount: 0, units: 0, value: 0 });
    entry.skuCount += 1;
    entry.units += Number(product.stock || 0);
    entry.value += Number(product.price || 0) * Number(product.stock || 0);
    return result;
  }, {})).sort((a, b) => b.value - a.value);
  const totalCatalogValue = categories.reduce((sum, category) => sum + category.value, 0);
  const totalUnits = categories.reduce((sum, category) => sum + category.units, 0);
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const upcomingEvents = (events || []).filter((event) => {
    const date = event.startTime ? new Date(event.startTime) : null;
    return date && !Number.isNaN(date.getTime()) && date.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }) >= today;
  }).sort((a, b) => new Date(a.startTime) - new Date(b.startTime)).slice(0, 3);
  const unreadMessages = (notifications || []).filter((item) => !item.isRead && !item.archived && !item.draft).length;

  return (
    <div className="page-container">
      {/* Page header */}
      <div className="mb-6 flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2"><h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1><span className="h-2 w-2 rounded-full bg-foreground" aria-label="Live data"/></div>
          <p className="mt-1 text-sm text-muted-foreground">Overview of your live Supabase workspace metrics</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={refreshDashboard} className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted" title="Refresh Dashboard"><RefreshCw size={15} className={loading ? 'animate-spin' : ''}/>Refresh</button>
          <a href="/products/all/catalog" className="inline-flex h-9 items-center justify-center rounded-md bg-foreground px-3 text-sm font-medium text-background transition-opacity hover:opacity-90">+ New Product</a>
        </div>
      </div>

      {error && (
        <div className="card p-4 mb-6 border-destructive/40 bg-destructive/10 text-destructive text-sm flex items-center justify-between">
          <span><strong>Database Error:</strong> {error}</span>
          <button onClick={refreshDashboard} className="btn btn-outline h-8 text-xs">Retry</button>
        </div>
      )}

      {/* Stats row */}
      <DashboardStats statsData={summaryStats} loading={loading} catalogValue={totalCatalogValue} catalogUnits={totalUnits} catalogSkus={(products || []).length} />

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="min-w-0 rounded-xl border border-border bg-card xl:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-5"><div><h2 className="text-sm font-semibold text-foreground">Catalog &amp; Category Valuation Breakdown</h2><p className="mt-1 text-xs text-muted-foreground">Inventory value grouped by live product category</p></div><Package size={17} className="text-muted-foreground"/></div>
          <div className="overflow-x-auto p-4 sm:overflow-x-visible sm:p-5">
            {loading ? <p className="py-8 text-center text-sm text-muted-foreground">Loading catalog…</p> : categories.length ? <div className="min-w-[600px] sm:min-w-0"><table className="w-full table-auto border-collapse text-left">
              <thead><tr className="border-b border-border text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"><th className="w-[24%] pb-3 pr-3">Category</th><th className="w-[43%] px-3 pb-3">Stock Units &amp; Unit Share</th><th className="w-[33%] pb-3 pl-3 text-right">Valuation</th></tr></thead>
              <tbody>{categories.map((category) => {
                const unitShare = totalUnits ? category.units / totalUnits * 100 : 0;
                const valueShare = totalCatalogValue ? category.value / totalCatalogValue * 100 : 0;
                return <tr key={category.name} className="border-b border-border/70 last:border-0">
                  <td className="py-4 pr-3"><div className="flex flex-wrap items-center gap-2"><span className="text-sm font-medium text-foreground">{category.name}</span><span className="whitespace-nowrap rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">{category.skuCount} SKUs</span></div></td>
                  <td className="px-3 py-4"><div className="font-mono text-xs text-foreground">{category.units.toLocaleString('en-IN')} units <span className="text-muted-foreground">({unitShare.toFixed(1)}%)</span></div><div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-foreground" style={{ width: `${unitShare}%` }}/></div></td>
                  <td className="py-4 pl-3 text-right"><div className="whitespace-nowrap font-mono text-xs font-medium text-foreground">₹{category.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div><div className="mt-1 whitespace-nowrap font-mono text-[10px] text-muted-foreground">{valueShare.toFixed(1)}% share</div></td>
                </tr>;
              })}</tbody>
            </table></div> : <p className="py-8 text-center text-sm text-muted-foreground">No product categories found.</p>}
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border bg-muted/20 p-4 sm:grid-cols-4 sm:px-5"><div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Categories</p><p className="mt-1 font-mono text-sm font-semibold text-foreground">{categories.length}</p></div><div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">SKUs</p><p className="mt-1 font-mono text-sm font-semibold text-foreground">{(products || []).length}</p></div><div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Total Units</p><p className="mt-1 font-mono text-sm font-semibold text-foreground">{totalUnits.toLocaleString('en-IN')}</p></div><div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Total Value</p><p className="mt-1 font-mono text-sm font-semibold text-foreground">₹{totalCatalogValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-[10px] text-muted-foreground">(100%)</span></p></div></div>
        </section>
        <QuickActions />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2"><RecentActivity activities={recentActivities} loading={loading} /></div>
        <section className="min-w-0 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-4"><div><h2 className="text-sm font-semibold text-foreground">Workspace Snapshot</h2><p className="mt-1 text-xs text-muted-foreground">Upcoming events and unread messages</p></div><CalendarDays size={17} className="text-muted-foreground"/></div>
          <div className="space-y-3 p-4">
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3"><span className="flex items-center gap-2 text-sm text-foreground"><CalendarDays size={15}/>Upcoming Events</span><span className="font-mono text-sm font-semibold text-foreground">{upcomingEvents.length}</span></div>
            {upcomingEvents.length ? upcomingEvents.map((event) => <div key={event.id} className="min-w-0 rounded-lg border border-border p-3"><p className="truncate text-sm font-medium text-foreground">{event.title}</p><p className="mt-1 truncate text-xs text-muted-foreground">{event.startTime ? new Date(event.startTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Date not set'} · {event.category}</p></div>) : <p className="text-xs text-muted-foreground">No upcoming events scheduled.</p>}
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3"><span className="flex items-center gap-2 text-sm text-foreground"><Mail size={15}/>Unread Messages</span><span className="font-mono text-sm font-semibold text-foreground">{unreadMessages}</span></div>
            <div className="grid grid-cols-2 gap-2 pt-1"><a href="/calendar/events/upcoming" className="rounded-md border border-border px-2 py-2 text-center text-xs font-medium text-foreground hover:bg-muted">View Calendar</a><a href="/messages/inbox" className="rounded-md border border-border px-2 py-2 text-center text-xs font-medium text-foreground hover:bg-muted">Open Inbox</a></div>
          </div>
        </section>
      </div>
    </div>
  );
}

