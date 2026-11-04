'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Download, Printer, RefreshCw, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { productService } from '@/services/productService';
import { userService } from '@/services/userService';
import { eventService, parseSupabaseDate } from '@/services/eventService';
import { notificationService } from '@/services/notificationService';

const PAGE_TITLES = {
  'analytics/realtime/health': 'Realtime System Health', 'analytics/realtime/sales': 'Realtime Sales Analytics',
  'analytics/realtime/users': 'Realtime User Analytics', 'analytics/trends/sales': 'Sales Trends',
  'analytics/trends/products': 'Product Trends', 'analytics/trends/users': 'User Trends',
  'analytics/reports/monthly': 'Monthly Analytics Report', 'analytics/reports/quarterly': 'Quarterly Analytics Report',
  'analytics/reports/yearly': 'Yearly Analytics Report', 'reports/sales/daily': 'Daily Sales Report',
  'reports/sales/monthly': 'Monthly Sales Report', 'reports/sales/forecast': 'Sales Forecast',
  'reports/export/csv': 'Export Data to CSV', 'reports/export/excel': 'Export Data',
  'reports/export/pdf': 'Export Report', 'reports/import/data': 'Data Records',
  'reports/import/history': 'Data Activity', 'reports/import/templates': 'Report Templates',
};

const number = (value) => Number.isFinite(Number(value)) ? Number(value) : 0;
const currency = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(number(value));
const asDate = (value) => value ? parseSupabaseDate(value) : null;
const istDate = (value) => {
  const date = asDate(value);
  return date ? new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date) : '';
};
const normalized = (value) => String(value || '').trim().toLowerCase();
const csvCell = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
const downloadCsv = (rows, filename) => {
  if (!rows.length || typeof document === 'undefined') return;
  const keys = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  const csv = [keys.map(csvCell).join(','), ...rows.map((row) => keys.map((key) => csvCell(row[key])).join(','))].join('\r\n');
  const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a'); link.href = url; link.download = `${filename}.csv`; link.click(); URL.revokeObjectURL(url);
};

const sum = (rows, key) => rows.reduce((total, row) => total + number(row[key]), 0);

export default function AnalyticsReportsManager({ mode }) {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ordersAvailable, setOrdersAvailable] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  const refresh = useCallback(async () => {
    setLoading(true);
    const results = await Promise.allSettled([
      productService.getProducts(), userService.getUsers(), eventService.getEvents(),
      notificationService.getNotifications(), supabase.from('orders').select('*').order('created_at', { ascending: false }),
    ]);
    const load = (index, label) => {
      const result = results[index];
      if (result.status === 'rejected') { errors.push(`${label}: ${result.reason?.message || 'could not load'}`); return []; }
      return result.value;
    };
    const errors = [];
    setProducts(load(0, 'Products'));
    setUsers(load(1, 'Users'));
    setEvents(load(2, 'Events'));
    setNotifications(load(3, 'Notifications'));
    const orderResult = results[4];
    if (orderResult.status === 'fulfilled' && !orderResult.value.error) {
      setOrders(orderResult.value.data || []);
      setOrdersAvailable(true);
    } else {
      setOrders([]); setOrdersAvailable(false);
      const error = orderResult.status === 'rejected' ? orderResult.reason : orderResult.value.error;
      errors.push(`Orders unavailable; sales value falls back to product catalog valuation. ${error?.message || ''}`.trim());
    }
    setErrors(errors);
    setLoading(false);
  }, []);
  useEffect(() => { refresh(); }, [refresh]);

  const family = mode.includes('/sales') ? 'sales'
    : mode.includes('/users') ? 'users'
      : mode.includes('/products') || mode.includes('/inventory') ? 'products' : 'general';

  const baseRows = useMemo(() => {
    const productRows = products.map((item) => ({
      Record: 'Product', Name: item.name || 'Product', Product: item.name || 'Product', SKU: item.sku || '',
      Category: item.category || 'Uncategorized', Department: '', Role: '', Status: item.status || 'Active',
      Units: number(item.stock), Value: number(item.price) * number(item.stock), Date: item.updatedAt || '',
    }));
    const userRows = users.map((item) => ({
      Record: 'User', Name: item.name || item.email || 'User', Email: item.email || '', Product: '', SKU: '',
      Category: item.role || 'User', Role: item.role || 'User', Department: item.department || 'General',
      Status: item.status || 'Active', Units: 1, Value: 0, Date: item.createdAt || '',
    }));
    const productById = new Map(products.map((item) => [String(item.id), item]));
    const orderRows = orders.map((order) => {
      const product = productById.get(String(order.product_id));
      return {
        Record: 'Order', Name: order.order_number || String(order.id || 'Order'), Product: product?.name || 'Product unavailable',
        SKU: product?.sku || '', Category: product?.category || 'Uncategorized', Department: '', Role: '',
        Status: order.status || 'Pending', Units: number(order.quantity),
        Value: number(order.total_amount ?? (number(order.unit_price) * number(order.quantity))), Date: order.created_at || '',
      };
    });
    const eventRows = events.map((item) => ({
      Record: 'Event', Name: item.title || 'Event', Product: '', SKU: '', Category: item.category || 'Meeting',
      Department: '', Role: '', Status: 'Scheduled', Units: 1, Value: 0, Date: item.startTime || '',
    }));
    const noticeRows = notifications.map((item) => ({
      Record: 'Notification', Name: item.title || 'Notification', Product: '', SKU: '', Category: item.type || 'Notification',
      Department: '', Role: '', Status: item.isRead ? 'Read' : 'Unread', Units: 1, Value: 0, Date: item.createdAt || '',
    }));
    return [...productRows, ...userRows, ...orderRows, ...eventRows, ...noticeRows];
  }, [products, users, orders, events, notifications]);

  const filterOptions = useMemo(() => {
    if (family === 'users') return [
      ...new Set(users.flatMap((user) => [`Role: ${user.role || 'User'}`, `Department: ${user.department || 'General'}`])),
    ].sort();
    const source = family === 'products' ? baseRows.filter((row) => row.Record === 'Product')
      : family === 'sales' ? baseRows.filter((row) => ['Order', 'Product'].includes(row.Record)) : baseRows;
    return [...new Set(source.map((row) => row.Category).filter(Boolean))].sort();
  }, [family, users, baseRows]);

  const filteredRows = useMemo(() => baseRows.filter((row) => {
    const searchable = `${row.Name} ${row.Email || ''} ${row.Product} ${row.Record} ${row.Category} ${row.Department} ${row.Role} ${row.Status} ${row.SKU}`.toLowerCase();
    const matchesSearch = searchable.includes(search.trim().toLowerCase());
    const matchesCategory = category === 'all' || (family === 'users'
      ? normalized(category) === normalized(`Role: ${row.Role}`) || normalized(category) === normalized(`Department: ${row.Department}`)
      : row.Category === category);
    const date = asDate(row.Date);
    const matchesFrom = !fromDate || Boolean(date && date >= new Date(`${fromDate}T00:00:00`));
    const matchesTo = !toDate || Boolean(date && date < new Date(`${toDate}T23:59:59.999`));
    return matchesSearch && matchesCategory && matchesFrom && matchesTo;
  }), [baseRows, search, category, family, fromDate, toDate]);

  const productRows = filteredRows.filter((row) => row.Record === 'Product');
  const userRows = filteredRows.filter((row) => row.Record === 'User');
  const orderRows = filteredRows.filter((row) => row.Record === 'Order');
  const filteredEvents = filteredRows.filter((row) => row.Record === 'Event');
  const catalogValue = sum(productRows, 'Value');
  const activeStock = productRows.reduce((total, row) => total + (String(row.Status).toLowerCase() === 'active' ? number(row.Units) : 0), 0);
  const salesValue = ordersAvailable && orders.length ? sum(orderRows, 'Value') : catalogValue;
  const orderCount = ordersAvailable ? orderRows.length : 0;
  const averageOrder = orderCount ? salesValue / orderCount : 0;
  const revenueByCategory = useMemo(() => {
    const source = ordersAvailable && orders.length ? orderRows : productRows;
    const amounts = {};
    source.forEach((row) => { amounts[row.Category] = (amounts[row.Category] || 0) + number(row.Value); });
    return Object.entries(amounts).sort((a, b) => b[1] - a[1]);
  }, [ordersAvailable, orders, orderRows, productRows]);
  const revenueByProduct = useMemo(() => {
    const source = ordersAvailable && orders.length ? orderRows : productRows;
    const amounts = {};
    source.forEach((row) => { const name = row.Product || row.Name; amounts[name] = (amounts[name] || 0) + number(row.Value); });
    return Object.entries(amounts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [ordersAvailable, orders, orderRows, productRows]);

  const departmentBreakdown = useMemo(() => {
    const counts = {};
    userRows.forEach((row) => { counts[row.Department] = (counts[row.Department] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [userRows]);
  const roleStatusBreakdown = useMemo(() => {
    const counts = {};
    userRows.forEach((row) => { const label = `${row.Role} · ${row.Status}`; counts[label] = (counts[label] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [userRows]);
  const categoryUnits = useMemo(() => {
    const counts = {};
    productRows.forEach((row) => { counts[row.Category] = (counts[row.Category] || 0) + number(row.Units); });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [productRows]);

  const topRevenueCategory = revenueByCategory[0]?.[0] || '—';
  const adminsManagers = userRows.filter((row) => /admin|manager/i.test(row.Role)).length;
  const inactiveUsers = userRows.filter((row) => /inactive|suspended/i.test(row.Status)).length;
  const uniqueSkus = new Set(productRows.map((row) => row.SKU).filter(Boolean)).size;
  const riskProducts = productRows.filter((row) => number(row.Units) <= number(products.find((product) => product.name === row.Name)?.minStock || 10)).length;
  const todayIST = istDate(new Date());
  const upcomingEventRows = filteredEvents.filter((row) => istDate(row.Date) >= todayIST && istDate(row.Date));
  const futureEvents = upcomingEventRows.length;

  const generalKpis = mode.endsWith('/health')
    ? [['Products', products.length], ['Active Users', users.filter((user) => /active/i.test(user.status)).length], ['Scheduled Events', futureEvents], ['Unread Notifications', notifications.filter((item) => !item.isRead && !item.archived && !item.draft).length]]
    : [['Catalog Valuation', currency(catalogValue)], ['Active Stock Units', activeStock.toLocaleString('en-IN')], ['Total Users', userRows.length], ['Scheduled Events', futureEvents]];
  const salesKpis = [['Total Order / Sales Value', currency(salesValue)], ['Total Orders Count', orderCount.toLocaleString('en-IN')], ['Avg Order Value', currency(averageOrder)], ['Top Revenue Category', topRevenueCategory]];
  const usersKpis = [['Total Users', userRows.length.toLocaleString('en-IN')], ['Active Users', userRows.filter((row) => /active/i.test(row.Status)).length.toLocaleString('en-IN')], ['Admins & Managers', adminsManagers.toLocaleString('en-IN')], ['Suspended / Inactive', inactiveUsers.toLocaleString('en-IN')]];
  const productsKpis = [['Total Catalog Valuation', currency(catalogValue)], ['Active Stock Units', activeStock.toLocaleString('en-IN')], ['Total SKUs', uniqueSkus.toLocaleString('en-IN')], ['Low / Out of Stock Risk', riskProducts.toLocaleString('en-IN')]];
  const kpis = family === 'sales' ? salesKpis : family === 'users' ? usersKpis : family === 'products' ? productsKpis : generalKpis;

  const barList = (title, entries, formatValue = (value) => value.toLocaleString('en-IN')) => <article className="rounded-lg border border-border bg-card p-5"><h2 className="mb-4 text-lg font-semibold">{title}</h2>{entries.length ? <div className="space-y-4">{entries.map(([name, value]) => { const max = Math.max(1, ...entries.map((entry) => entry[1])); return <div key={name}><div className="mb-1 flex justify-between gap-3 text-sm"><span className="truncate">{name}</span><span className="shrink-0 text-muted-foreground">{formatValue(value)}</span></div><div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-foreground" style={{ width: `${Math.max(1, number(value) / max * 100)}%` }}/></div></div>; })}</div> : <p className="text-sm text-muted-foreground">No records match the selected filters.</p>}</article>;

  let tableTitle = 'Live Records';
  let tableRows = filteredRows;
  let tableColumns = ['Record', 'Name', 'Category', 'Status', 'Units', 'Value', 'Date'];
  if (family === 'sales') {
    tableTitle = 'Orders & High-Value Products';
    const topProducts = [...productRows].sort((a, b) => number(b.Value) - number(a.Value)).slice(0, 5).map((row) => ({ ...row, Record: 'High-Value Product' }));
    tableRows = [...orderRows.slice(0, 10), ...topProducts];
    if (!tableRows.length && (!ordersAvailable || !orders.length)) tableRows = [...productRows].sort((a, b) => number(b.Value) - number(a.Value)).slice(0, 10);
    tableColumns = ['Record', 'Name', 'Product', 'Category', 'Status', 'Units', 'Value', 'Date'];
  } else if (family === 'users') {
    tableTitle = 'User Directory'; tableRows = userRows;
    tableColumns = ['Name', 'Email', 'Role', 'Department', 'Status', 'Date'];
  } else if (family === 'products') {
    tableTitle = 'Inventory & SKU Details'; tableRows = productRows;
    tableColumns = ['Name', 'SKU', 'Category', 'Status', 'Units', 'Value', 'Date'];
  } else if (mode.endsWith('/health')) {
    tableTitle = 'Scheduled Events & Notification Status';
    tableRows = [...filteredEvents, ...filteredRows.filter((row) => row.Record === 'Notification')];
  }

  const cellValue = (row, column) => {
    if (column === 'Value') return currency(row[column]);
    if (column === 'Date') { const date = asDate(row[column]); return date ? date.toLocaleDateString('en-IN') : '—'; }
    if (column === 'Units') return number(row[column]).toLocaleString('en-IN');
    return row[column] ?? '—';
  };

  return <main className="min-h-screen space-y-6 bg-background p-6 text-foreground">
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5"><div><h1 className="text-2xl font-semibold">{PAGE_TITLES[mode] || 'Analytics & Reports'}</h1><p className="mt-1 text-sm text-muted-foreground">Live Supabase data. Filters apply to the KPIs, breakdowns, and export.</p></div><div className="flex gap-2"><button onClick={refresh} disabled={loading} className="inline-flex items-center gap-2 rounded-md border border-border bg-muted px-4 py-2"><RefreshCw size={16} className={loading ? 'animate-spin' : ''}/> Refresh</button><button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-md border border-border bg-muted px-4 py-2"><Printer size={16}/> Print</button><button onClick={() => downloadCsv(tableRows, mode.replaceAll('/', '-'))} disabled={!tableRows.length} className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-background disabled:opacity-50"><Download size={16}/> Export CSV</button></div></header>
    {errors.length > 0 && <div role="status" className="rounded-md border border-border bg-muted p-3 text-sm text-muted-foreground">{errors.join(' ')}</div>}
    {family === 'sales' && (!ordersAvailable || !orders.length) && <p className="text-xs text-muted-foreground">Order rows are unavailable; sales value shares use live product catalog value.</p>}
    <section aria-label="Route summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{kpis.map(([label, value]) => <article key={label} className="rounded-lg border border-border bg-card p-4"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p></article>)}</section>
    <section className="grid gap-3 rounded-lg border border-border bg-card p-4 md:grid-cols-4"><label className="relative"><Search size={16} className="absolute left-3 top-3 text-muted-foreground"/><input aria-label="Search records" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search records" className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3"/></label><label className="text-sm">{family === 'users' ? 'User Role / Department' : family === 'products' ? 'Product Category' : family === 'sales' ? 'Revenue Category' : 'Category'}<select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2"><option value="all">All {family === 'users' ? 'roles and departments' : 'categories'}</option>{filterOptions.map((item) => <option key={item} value={item}>{item}</option>)}</select></label><label className="text-sm">From<input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2"/></label><label className="text-sm">To<input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2"/></label></section>
    {family === 'sales' && <section className="grid gap-5 lg:grid-cols-2">{barList('Order / Sales Value by Category', revenueByCategory, currency)}{barList('Product Value Share', revenueByProduct, currency)}</section>}
    {family === 'users' && <section className="grid gap-5 lg:grid-cols-2">{barList('Department Breakdown', departmentBreakdown)}{barList('User Role / Status Breakdown', roleStatusBreakdown)}</section>}
    {family === 'products' && <section className="grid gap-5 lg:grid-cols-2">{barList('Category Distribution (Units)', categoryUnits)}<article className="rounded-lg border border-border bg-card p-5"><h2 className="mb-4 text-lg font-semibold">Inventory Risk</h2><div className="space-y-3 text-sm"><p className="flex justify-between rounded-md border border-border bg-muted px-3 py-2"><span>Low stock items</span><strong>{riskProducts}</strong></p><p className="flex justify-between rounded-md border border-border bg-muted px-3 py-2"><span>Out of stock items</span><strong>{productRows.filter((row) => number(row.Units) === 0).length}</strong></p><p className="flex justify-between rounded-md border border-border bg-muted px-3 py-2"><span>Inventory valuation</span><strong>{currency(catalogValue)}</strong></p></div></article></section>}
    {family === 'general' && (mode.endsWith('/health')
      ? <section className="grid gap-5 lg:grid-cols-2">{barList('Upcoming Events by Type', Object.entries(upcomingEventRows.reduce((counts, row) => { counts[row.Category] = (counts[row.Category] || 0) + 1; return counts; }, {})))}{barList('Notification Read Status', Object.entries(notifications.reduce((counts, row) => { const label = row.isRead ? 'Read' : 'Unread'; counts[label] = (counts[label] || 0) + 1; return counts; }, {})))}</section>
      : <section className="grid gap-5 lg:grid-cols-2">{barList('Product Category Distribution', categoryUnits)}{barList('User Role / Status', roleStatusBreakdown)}</section>)}
    <section className="overflow-hidden rounded-lg border border-border bg-card"><div className="flex items-center justify-between border-b border-border p-4"><div><h2 className="font-semibold">{tableTitle}</h2><p className="text-sm text-muted-foreground">{tableRows.length} matching records</p></div>{loading && <span className="text-sm text-muted-foreground">Loading…</span>}</div><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-muted text-muted-foreground"><tr>{tableColumns.map((column) => <th key={column} className="px-4 py-3 font-medium">{column}</th>)}</tr></thead><tbody className="divide-y divide-border">{tableRows.map((row, index) => <tr key={`${row.Record}-${row.Name}-${index}`} className="hover:bg-muted/60">{tableColumns.map((column) => <td key={column} className="px-4 py-3">{cellValue(row, column)}</td>)}</tr>)}{!tableRows.length && <tr><td colSpan={tableColumns.length} className="px-4 py-10 text-center text-muted-foreground">{loading ? 'Loading records…' : 'No records match the selected filters.'}</td></tr>}</tbody></table></div></section>
    <style jsx global>{`@media print { header button { display: none; } body { background: white; color: black; } main { min-height: 0; } section { break-inside: avoid; } }`}</style>
  </main>;
}
