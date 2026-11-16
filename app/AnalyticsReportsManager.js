'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Activity, CalendarDays, Download, Package, Printer, RefreshCw, Search, Users } from 'lucide-react';
import { productService } from '@/services/productService';
import { userService } from '@/services/userService';
import { eventService, parseSupabaseDate } from '@/services/eventService';
import { notificationService } from '@/services/notificationService';
import { orderService } from '@/services/orderService';
import SalesOrdersManager from '@/app/components/Sales/SalesOrdersManager';

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

const PAGE_SUBTITLES = {
  'analytics/realtime/health': 'Live system activity, upcoming events, and notification health.',
  'analytics/realtime/sales': 'Live sales value and order performance from the workspace database.',
  'analytics/realtime/users': 'Live user activity, roles, and account status from Supabase.',
  'analytics/trends/sales': 'Revenue trends and order performance across your catalog.',
  'analytics/trends/products': 'Inventory value, stock distribution, and SKU performance.',
  'analytics/trends/users': 'Workspace users, department distribution, and account status.',
  'analytics/reports/monthly': 'Monthly workspace metrics and exportable records.',
  'analytics/reports/quarterly': 'Quarterly workspace metrics and exportable records.',
  'analytics/reports/yearly': 'Yearly workspace metrics and exportable records.',
};

const number = (value) => Number.isFinite(Number(value)) ? Number(value) : 0;
const currency = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number(value));
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
      notificationService.getNotifications(), orderService.fetchOrders(),
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
    if (orderResult.status === 'fulfilled') {
      setOrders(orderResult.value || []);
      setOrdersAvailable(true);
    } else {
      setOrders([]); setOrdersAvailable(false);
      const error = orderResult.reason;
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
    const orderRows = orders.map((order) => {
      return {
        Record: 'Order', Name: order.orderNumber || String(order.id || 'Order'), Product: order.productName || 'Product unavailable',
        SKU: order.sku || '', Category: products.find((item) => String(item.id) === String(order.productId))?.category || 'Uncategorized', Department: '', Role: '',
        Status: order.status || 'Pending', Units: number(order.quantity),
        Value: number(order.totalAmount), Date: order.createdAt || '',
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

  const barList = (title, entries, formatValue = (value) => number(value).toLocaleString('en-IN')) => <article className="rounded-xl border border-border bg-card p-5"><h2 className="mb-4 text-base font-semibold">{title}</h2>{entries.length ? <div className="space-y-4">{entries.map(([name, value]) => { const total = Math.max(1, entries.reduce((sumValue, entry) => sumValue + number(entry[1]), 0)); const share = number(value) / total * 100; return <div key={name}><div className="mb-1.5 flex items-center justify-between gap-3 text-sm"><span className="min-w-0 truncate font-medium text-foreground">{name}</span><span className="flex shrink-0 items-center gap-2"><span className="text-xs text-muted-foreground">{formatValue(value)}</span><span className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground">{share.toFixed(1)}%</span></span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-foreground" style={{ width: `${Math.min(100, share)}%` }}/></div></div>; })}</div> : <p className="text-sm text-muted-foreground">No records match the selected filters.</p>}</article>;

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

  const activeFilters = Boolean(search || category !== 'all' || fromDate || toDate);
  const resetFilters = () => { setSearch(''); setCategory('all'); setFromDate(''); setToDate(''); };
  const kpiIcons = family === 'sales' ? [Activity, Activity, Activity, Package] : family === 'users' ? [Users, Users, Users, Users] : family === 'products' ? [Package, Package, Package, Activity] : [Activity, Users, CalendarDays, Activity];

  return <main className="mx-auto min-h-full max-w-7xl space-y-5 bg-background p-4 text-foreground sm:p-6">
    <header className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight sm:text-2xl">{PAGE_TITLES[mode] || 'Analytics & Reports'}<span className="h-2 w-2 rounded-full bg-foreground" title="Live Supabase data"/></h1><p className="mt-1 text-sm text-muted-foreground">{PAGE_SUBTITLES[mode] || 'Live Supabase metrics and exportable workspace records. Filters apply across the report.'}</p></div><div className="flex flex-wrap gap-2"><button onClick={refresh} disabled={loading} className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3.5 text-xs font-medium hover:bg-muted"><RefreshCw size={14} className={loading ? 'animate-spin' : ''}/>Refresh</button><button onClick={() => window.print()} className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3.5 text-xs font-medium hover:bg-muted"><Printer size={14}/>Print</button><button onClick={() => downloadCsv(tableRows, mode.replaceAll('/', '-'))} disabled={!tableRows.length} className="inline-flex h-9 items-center gap-2 rounded-md bg-foreground px-3.5 text-xs font-medium text-background disabled:opacity-50"><Download size={14}/>Export CSV</button></div></header>
    {errors.length > 0 && <div role="status" className="rounded-md border border-border bg-muted p-3 text-sm text-muted-foreground">{errors.join(' ')}</div>}
    {family === 'sales' && (!ordersAvailable || !orders.length) && <p className="text-xs text-muted-foreground">Order rows are unavailable; sales value shares use live product catalog value.</p>}
    <section aria-label="Route summary" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{kpis.map(([label, value], index) => { const Icon = kpiIcons[index] || Activity; const context = family === 'sales' ? ['Live order and catalog total', `${orderCount} recorded orders`, 'Average per order', `Leading category: ${topRevenueCategory}`][index] : family === 'users' ? ['Live workspace directory', 'Accounts marked active', 'Privileged accounts', 'Restricted or inactive accounts'][index] : family === 'products' ? ['Live inventory value', 'Units in active stock', `${uniqueSkus} distinct catalog SKUs`, 'Products at reorder threshold'][index] : ['Workspace products', 'Active workspace accounts', 'Events from today IST onward', 'Live notifications'][index]; return <article key={label} className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5"><div className="flex items-start justify-between gap-2"><p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted/70 text-foreground"><Icon size={15}/></span></div><p className="mt-3 break-words font-mono text-2xl font-bold tracking-tight text-foreground">{value}</p><div className="mt-3 flex flex-wrap items-center gap-2"><span className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] uppercase text-foreground">LIVE</span><span className="text-xs text-muted-foreground">{context}</span></div></article>; })}</section>
    {family === 'sales' && <SalesOrdersManager products={products} onOrdersChanged={refresh}/>}
    <section className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-muted/20 p-3.5 sm:grid-cols-2 xl:grid-cols-4"><label className="relative"><span className="sr-only">Search records</span><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/><input aria-label="Search records" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, email, SKU, or record..." className="h-9 w-full rounded-md border border-border bg-background px-3 pl-9 text-xs text-foreground"/></label><label className="text-[11px] font-medium text-muted-foreground"><span className="sr-only">Category or role</span><select aria-label={family === 'users' ? 'Filter by role or department' : 'Filter by category'} value={category} onChange={(event) => setCategory(event.target.value)} className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground"><option value="all">All {family === 'users' ? 'roles and departments' : 'categories'}</option>{filterOptions.map((item) => <option key={item} value={item}>{item}</option>)}</select></label><label className="text-[11px] font-medium text-muted-foreground"><span className="sr-only">From</span><input aria-label="From date" type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground"/></label><label className="text-[11px] font-medium text-muted-foreground"><span className="sr-only">To</span><input aria-label="To date" type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground"/></label></section>
    {activeFilters && <div className="flex justify-end"><button onClick={resetFilters} className="h-8 rounded-md border border-border px-3 text-xs font-medium text-foreground hover:bg-muted">Reset Filters</button></div>}
    {family === 'sales' && <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">{barList('Order / Sales Value by Category', revenueByCategory, currency)}{barList('Product Value Share', revenueByProduct, currency)}</section>}
    {family === 'users' && <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">{barList('Department Breakdown', departmentBreakdown)}{barList('User Role / Status Breakdown', roleStatusBreakdown)}</section>}
    {family === 'products' && <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">{barList('Category Distribution (Units)', categoryUnits)}<article className="rounded-xl border border-border bg-card p-5"><h2 className="mb-4 text-base font-semibold">Inventory Risk</h2><div className="space-y-3 text-sm"><p className="flex justify-between rounded-md border border-border bg-muted px-3 py-2"><span>Low stock items</span><strong>{riskProducts}</strong></p><p className="flex justify-between rounded-md border border-border bg-muted px-3 py-2"><span>Out of stock items</span><strong>{productRows.filter((row) => number(row.Units) === 0).length}</strong></p><p className="flex justify-between rounded-md border border-border bg-muted px-3 py-2"><span>Inventory valuation</span><strong>{currency(catalogValue)}</strong></p></div></article></section>}
    {family === 'general' && (mode.endsWith('/health')
      ? <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">{barList('Upcoming Events by Type', Object.entries(upcomingEventRows.reduce((counts, row) => { counts[row.Category] = (counts[row.Category] || 0) + 1; return counts; }, {})))}{barList('Notification Read Status', Object.entries(notifications.reduce((counts, row) => { const label = row.isRead ? 'Read' : 'Unread'; counts[label] = (counts[label] || 0) + 1; return counts; }, {})))}</section>
      : <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">{barList('Product Category Distribution', categoryUnits)}{barList('User Role / Status', roleStatusBreakdown)}</section>)}
    <section className="overflow-hidden rounded-xl border border-border bg-card"><div className="flex items-center justify-between gap-3 border-b border-border p-4"><div><h2 className="font-semibold">{tableTitle}</h2><p className="text-sm text-muted-foreground">{tableRows.length} matching records</p></div><span className="rounded border border-border bg-muted px-2 py-1 font-mono text-[10px] uppercase text-foreground">{loading ? 'Syncing' : 'Live Data'}</span></div><div className="w-full overflow-x-auto"><table className="w-full min-w-[780px] border-collapse text-left text-sm"><thead className="bg-muted text-muted-foreground"><tr>{tableColumns.map((column) => <th key={column} className="whitespace-nowrap px-4 py-3 font-medium">{column}</th>)}</tr></thead><tbody className="divide-y divide-border">{tableRows.map((row, index) => <tr key={`${row.Record}-${row.Name}-${index}`} className="hover:bg-muted/60">{tableColumns.map((column) => <td key={column} className="whitespace-nowrap px-4 py-3">{cellValue(row, column)}</td>)}</tr>)}{!tableRows.length && <tr><td colSpan={tableColumns.length} className="px-4 py-10 text-center text-muted-foreground">{loading ? 'Loading records…' : 'No records match the selected filters.'}</td></tr>}</tbody></table></div></section>
    <style jsx global>{`@media print { header button { display: none; } body { background: white; color: black; } main { min-height: 0; } section { break-inside: avoid; } }`}</style>
  </main>;
}
