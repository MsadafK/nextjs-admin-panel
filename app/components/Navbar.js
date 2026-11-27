'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Activity, ArrowRight, Bell, Check, ChevronRight, KanbanSquare, Languages, Lock, LogOut, Mail, Menu, Moon, Package, Search, Settings, Shield, ShoppingCart, Sparkles, Sun, User, Users } from 'lucide-react';
import { useTheme } from '@/app/contexts/ThemeContext';
import { useAuth } from '@/app/contexts/AuthContext';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { menuItems } from './Sidebar/MenuItems';
import { notificationService } from '@/services/notificationService';
import { DEMO_ACCOUNTS } from '@/services/authService';
import { supabase } from '@/lib/supabase';
import { userService } from '@/services/userService';
import { productService } from '@/services/productService';
import { orderService } from '@/services/orderService';
import { useToast } from '@/app/contexts/ToastContext';

const LABELS = {
  dashboard: 'Dashboard', all_users: 'All Users', user_list: 'User List', add_user: 'Add User',
  all_products: 'All Products', product_catalog: 'Product Catalog', inventory: 'Inventory', stock_levels: 'Stock Levels',
  sales_trends: 'Sales Trends', user_trends: 'User Trends', product_trends: 'Product Trends',
  real_time: 'Realtime', api_keys: 'API Keys', api_key: 'API Key', kras: 'KRAs',
};
const formatLabel = (label = '') => LABELS[label] || label.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const normalizePath = (path = '') => path.replace(/\/$/, '') || '/';

function flattenRoutes(items = menuItems, parents = []) {
  return items.flatMap((item) => {
    const trail = [...parents, item.label];
    const children = item.subItems || item.childItems || [];
    const current = item.href && !children.length ? [{ href: item.href, label: formatLabel(item.label), breadcrumbs: trail.map(formatLabel), category: parents.map(formatLabel).join(' / ') || 'Overview', icon: item.icon }] : [];
    return [...current, ...flattenRoutes(children, trail)];
  });
}

const ROUTES = flattenRoutes();
const QUICK_LINKS = [
  { href: '/', label: 'Dashboard', category: 'Overview' },
  { href: '/users/all/list', label: 'User List', category: 'Users' },
  { href: '/users/add/single', label: 'Add User', category: 'Users' },
  { href: '/products/all/catalog', label: 'Product Catalog', category: 'Products' },
  { href: '/products/inventory/stock', label: 'Inventory', category: 'Products' },
  { href: '/analytics/trends/sales', label: 'Sales Trends', category: 'Analytics' },
  { href: '/calendar/events/upcoming', label: 'Calendar', category: 'Workspace' },
  { href: '/messages', label: 'Messages', category: 'Workspace' },
  { href: '/security/audit/security', label: 'Security', category: 'System' },
  { href: '/performance/skills', label: 'Performance', category: 'System' },
  { href: '/settings', label: 'Settings', category: 'System' },
  { href: '/login', label: 'Sign In / Switch Account', category: 'Account' },
  { href: '/signup', label: 'Create Account', category: 'Account' },
];
const COMMAND_ROUTES = [...QUICK_LINKS, ...ROUTES.filter((route) => !QUICK_LINKS.some((quick) => quick.href === route.href))];
const COMMAND_TABS = ['All', 'Actions', 'Users', 'Products', 'Orders', 'Pages'];
const LANGUAGES = [
  { code: 'en', name: 'English' }, { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' }, { code: 'de', name: 'Deutsch' },
];
const LANGUAGE_CODES = { en: 'EN', es: 'ES', fr: 'FR', de: 'DE' };
const panelClass = 'z-[100] rounded-xl border border-border bg-background bg-white dark:bg-zinc-950 opacity-100 shadow-xl ring-1 ring-black/5';
const iconButtonClass = 'relative flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-transparent text-muted-foreground transition-colors hover:border-border hover:bg-muted/60 hover:text-foreground';
const fuzzyMatch = (query, text) => {
  const needle = query.toLowerCase().trim();
  const value = String(text || '').toLowerCase();
  if (!needle) return true;
  if (value.includes(needle)) return true;
  let cursor = 0;
  for (const letter of value) if (letter === needle[cursor]) cursor += 1;
  return cursor === needle.length;
};
const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function Navbar({ onMenuClick, sidebarPosition = 'left', sidebarDarkMode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isDark, toggleDarkMode } = useTheme();
  const { currentUser, signOut, switchDemoRole, isDemoModeEnabled } = useAuth();
  const { pushToast } = useToast();
  const { language, t, setLanguage } = useLanguage() || {};
  const [notifications, setNotifications] = useState([]);
  const [inboxMessages, setInboxMessages] = useState([]);
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const [commandTab, setCommandTab] = useState('All');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [entityResults, setEntityResults] = useState({ users: [], products: [], orders: [] });
  const [entityLoading, setEntityLoading] = useState(false);
  const [entityError, setEntityError] = useState('');
  const [showInbox, setShowInbox] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const dark = isDark || sidebarDarkMode;
  const profileName = currentUser?.name || 'John Doe';
  const profileEmail = currentUser?.email || 'john@nexstore.com';
  const profileInitials = currentUser?.initials || 'JD';

  const commandInputRef = useRef(null);
  const commandDialogRef = useRef(null);
  const commandReturnFocusRef = useRef(null);
  const inboxRef = useRef(null);
  const notificationsRef = useRef(null);
  const languageRef = useRef(null);
  const profileRef = useRef(null);
  const spotlightCache = useRef({ expiresAt: 0, users: [], products: [], orders: [] });

  const refreshCounts = useCallback(async () => {
    try {
      const rows = await notificationService.getNotifications();
      setInboxMessages(rows.filter((row) => !row.archived && !row.draft && !row.sent).map((row) => ({
        id: row.id, title: row.title, body: row.body, time: row.createdAt ? new Date(row.createdAt).toLocaleString() : '', unread: !row.isRead,
      })));
      setNotifications(rows.map((row) => ({ id: row.id, title: row.title, body: row.body, type: row.type, time: row.createdAt ? new Date(row.createdAt).toLocaleString() : '', unread: !row.isRead, sent: row.sent, draft: row.draft, archived: row.archived, href: '/messages' })));
    } catch (error) { console.error('Could not load notifications:', error); }
  }, []);

  useEffect(() => {
    const handleUpdated = () => { refreshCounts(); };
    window.addEventListener('notifications:updated', handleUpdated);
    const channel = supabase.channel('notifications-sync-navbar')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, handleUpdated)
      .subscribe();
    refreshCounts();
    const timer = setInterval(refreshCounts, 30000);
    return () => {
      window.removeEventListener('notifications:updated', handleUpdated);
      clearInterval(timer);
      supabase.removeChannel(channel);
    };
  }, [refreshCounts]);

  const unreadInboxCount = inboxMessages.filter((message) => message.unread).length;
  const unreadNotificationCount = notifications.filter((notification) => notification.unread && !notification.archived && !notification.draft && !notification.sent).length;
  const commandActions = useMemo(() => [
    ...(isDemoModeEnabled ? DEMO_ACCOUNTS.map((account) => ({ id: `role-${account.role.toLowerCase()}`, label: `Switch Role: ${account.role} (${account.name})`, description: 'Instant demo role switch', category: 'Actions', action: 'switch-role', account, icon: Shield })) : []),
    { id: 'toggle-theme', label: `Toggle Theme: ${isDark ? 'Light' : 'Dark'} Mode`, description: 'Change the workspace appearance', category: 'Actions', action: 'toggle-theme', icon: isDark ? Sun : Moon },
    { id: 'create-order', label: 'Quick Action: Create New Order', description: 'Open the live sales pipeline', category: 'Actions', href: '/reports/sales/daily?createOrder=1', icon: ShoppingCart },
    { id: 'orders-kanban', label: '> Orders: Open Kanban Pipeline Board', description: 'Open the sales orders board', category: 'Actions', href: '/reports/sales/daily?ordersView=kanban', icon: KanbanSquare },
    { id: 'add-product', label: 'Quick Action: Add New Product', description: 'Create a catalog product', category: 'Actions', href: '/products/add', icon: Package },
    { id: 'invite-user', label: 'Quick Action: Invite User', description: 'Invite a workspace member', category: 'Actions', href: '/users/add/invite', icon: Users },
    { id: 'sign-out', label: 'Sign Out of Workspace', description: 'End the current session', category: 'Actions', action: 'sign-out', icon: LogOut },
  ], [isDark, isDemoModeEnabled]);

  useEffect(() => {
    if (!commandOpen) return undefined;
    const query = commandQuery.trim();
    const needsEntities = query.length >= 2 || ['Users', 'Products', 'Orders'].includes(commandTab);
    if (!needsEntities) { setEntityResults({ users: [], products: [], orders: [] }); setEntityError(''); setEntityLoading(false); return undefined; }
    let active = true;
    const timer = window.setTimeout(async () => {
      setEntityLoading(true); setEntityError('');
      try {
        let data = spotlightCache.current;
        if (Date.now() >= data.expiresAt) {
          const settled = await Promise.allSettled([userService.getUsers(), productService.getProducts(), orderService.fetchOrders()]);
          data = {
            expiresAt: Date.now() + 30000,
            users: settled[0].status === 'fulfilled' ? settled[0].value : [],
            products: settled[1].status === 'fulfilled' ? settled[1].value : [],
            orders: settled[2].status === 'fulfilled' ? settled[2].value : [],
          };
          spotlightCache.current = data;
          if (settled.every((item) => item.status === 'rejected')) throw settled[0].reason || new Error('Live workspace search is unavailable.');
          if (settled.some((item) => item.status === 'rejected')) setEntityError('Some live records could not be loaded.');
        }
        if (!active) return;
        setEntityResults(data);
      } catch (error) {
        if (active) { setEntityError(error.message || 'Live workspace search is unavailable.'); setEntityResults({ users: [], products: [], orders: [] }); }
      } finally { if (active) setEntityLoading(false); }
    }, query.length >= 2 ? 220 : 0);
    return () => { active = false; window.clearTimeout(timer); };
  }, [commandOpen, commandQuery, commandTab]);

  const commandResults = useMemo(() => {
    const entityItems = [
      ...entityResults.users.map((user) => ({ id: `user-${user.id}`, label: user.name || user.email || 'Workspace User', description: user.email || '', category: 'Users', entityType: 'Users', href: '/users/all/list', initials: user.avatar || user.initials || 'U', badge: user.role || 'User', icon: Users })),
      ...entityResults.products.map((product) => ({ id: `product-${product.id}`, label: product.name || 'Product', description: `${product.sku || 'No SKU'} · ${money(product.price)}`, category: 'Products', entityType: 'Products', href: '/products/all/catalog', badge: `${Number(product.stock || 0)} in stock`, icon: Package })),
      ...entityResults.orders.map((order) => ({ id: `order-${order.id}`, label: `#${order.orderNumber}`, description: `${order.customerName || 'Customer'} · ${money(order.totalAmount)}`, category: 'Orders', entityType: 'Orders', href: '/reports/sales/daily', badge: order.status || 'pending', icon: ShoppingCart })),
    ];
    const routeItems = COMMAND_ROUTES.map((route, index) => ({ ...route, id: `page-${route.href}-${index}`, category: 'Pages', description: route.category || 'Workspace route' }));
    const all = [...commandActions, ...entityItems, ...routeItems];
    const source = commandTab === 'All' ? all : all.filter((item) => item.category === commandTab);
    const query = commandQuery.trim();
    const matched = query ? source.filter((item) => fuzzyMatch(query, `${item.label} ${item.description} ${item.badge || ''} ${item.category}`)) : source;
    return matched.slice(0, 32);
  }, [commandActions, commandTab, commandQuery, entityResults]);

  const activeRoute = useMemo(() => ROUTES.find((route) => normalizePath(route.href) === normalizePath(pathname)), [pathname]);
  const breadcrumbs = useMemo(() => {
    if (activeRoute) return activeRoute.breadcrumbs;
    if (normalizePath(pathname) === '/') return ['Dashboard'];
    return normalizePath(pathname).split('/').filter(Boolean).map(formatLabel);
  }, [activeRoute, pathname]);
  const currentTitle = breadcrumbs.at(-1) || 'Dashboard';

  const openCommand = useCallback(() => {
    commandReturnFocusRef.current = document.activeElement;
    setShowInbox(false); setShowNotifications(false); setShowLanguage(false); setShowProfile(false);
    setCommandQuery(''); setCommandTab('All'); setSelectedIndex(0); setCommandOpen(true);
  }, []);
  const closeCommand = useCallback(() => {
    setCommandOpen(false);
    requestAnimationFrame(() => commandReturnFocusRef.current?.focus?.());
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault(); openCommand();
      } else if (event.key === 'Escape') {
        if (commandOpen) {
          closeCommand();
          return;
        }
        if (showInbox) inboxRef.current?.querySelector('button[aria-expanded="true"]')?.focus();
        else if (showNotifications) notificationsRef.current?.querySelector('button[aria-expanded="true"]')?.focus();
        else if (showLanguage) languageRef.current?.querySelector('button[aria-expanded="true"]')?.focus();
        else if (showProfile) profileRef.current?.querySelector('button[aria-expanded="true"]')?.focus();
        setShowInbox(false); setShowNotifications(false); setShowLanguage(false); setShowProfile(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [openCommand, closeCommand, commandOpen, showInbox, showNotifications, showLanguage, showProfile]);

  useEffect(() => {
    if (!commandOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const frame = requestAnimationFrame(() => commandInputRef.current?.focus());
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
    };
  }, [commandOpen]);

  useEffect(() => {
    setSelectedIndex((index) => Math.min(index, Math.max(0, commandResults.length - 1)));
  }, [commandResults.length]);

  useEffect(() => {
    const onOutside = (event) => {
      if (inboxRef.current && !inboxRef.current.contains(event.target)) setShowInbox(false);
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) setShowNotifications(false);
      if (languageRef.current && !languageRef.current.contains(event.target)) setShowLanguage(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  const navigate = (href) => { closeCommand(); router.push(href); };
  const activateResult = async (result) => {
    if (result.action === 'toggle-theme') {
      toggleDarkMode();
      pushToast({ title: `Theme switched to ${isDark ? 'light' : 'dark'} mode` });
      closeCommand();
      return;
    }
    if (result.action === 'switch-role') {
      closeCommand();
      try { await switchDemoRole(result.account); }
      catch (error) { pushToast({ title: 'Role switch failed', subtitle: error.message || 'Unable to switch demo role.' }); }
      return;
    }
    if (result.action === 'sign-out') { closeCommand(); await signOut(); return; }
    if (result.href) navigate(result.href);
  };
  const markRead = async (id) => {
    setInboxMessages((items) => items.map((item) => item.id === id ? { ...item, unread: false } : item));
    setNotifications((items) => items.map((item) => item.id === id ? { ...item, unread: false } : item));
    try { await notificationService.updateMessage(id, { isRead: true }); }
    catch (error) { console.error('Could not mark notification as read:', error); }
  };
  const markAllInboxRead = async () => {
    await Promise.all(inboxMessages.filter((message) => message.unread).map((message) => markRead(message.id)));
  };
  const markAllNotificationsRead = async () => {
    await Promise.all(notifications.filter((notification) => notification.unread).map((notification) => markRead(notification.id)));
  };
  return <>
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between gap-3 border-b border-border bg-background/85 px-3 backdrop-blur-md sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <button onClick={onMenuClick} className={`${iconButtonClass} lg:hidden`} aria-label="Open sidebar"><Menu size={18} strokeWidth={1.8}/></button>
        <div className="hidden min-w-0 items-center gap-1 overflow-hidden sm:flex">
          {breadcrumbs.map((crumb, index) => <span key={`${crumb}-${index}`} className="flex min-w-0 shrink items-center gap-1">
            {index > 0 && <ChevronRight size={14} className="shrink-0 text-muted-foreground/60"/>}
            <span className={`truncate text-sm ${index === breadcrumbs.length - 1 ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{crumb}</span>
          </span>)}
        </div>
        <span className="min-w-0 max-w-[160px] truncate text-sm font-semibold text-foreground sm:hidden max-[379px]:hidden">{currentTitle}</span>
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <button onClick={openCommand} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted/80 md:hidden" aria-label="Quick search"><Search size={17}/></button>
        <button onClick={openCommand} className="hidden h-9 w-64 items-center justify-between rounded-md border border-border bg-muted/40 px-3 text-xs text-muted-foreground transition-colors hover:bg-muted/80 md:flex"><span className="flex items-center gap-2"><Search size={15}/> Quick search...</span><kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px]">Ctrl K</kbd></button>

        <button onClick={toggleDarkMode} className={iconButtonClass} aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'} title={isDark ? 'Light theme' : 'Dark theme'}>{isDark ? <Sun size={17}/> : <Moon size={17}/>}</button>

        <div className="relative" ref={inboxRef}>
          <button id="messages-popover-trigger" onClick={() => { setShowInbox((open) => !open); setShowNotifications(false); setShowLanguage(false); setShowProfile(false); }} className={iconButtonClass} aria-label="Messages" aria-haspopup="dialog" aria-controls={showInbox ? 'messages-popover' : undefined} aria-expanded={showInbox}>
            <Mail size={17}/>{unreadInboxCount > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 font-mono text-[10px] font-semibold text-background">{unreadInboxCount > 99 ? '99+' : unreadInboxCount}</span>}
          </button>
          {showInbox && <div id="messages-popover" role="dialog" aria-labelledby="messages-popover-title" className={`absolute right-0 top-11 z-50 flex max-h-[min(32rem,calc(100dvh-4.5rem))] w-[min(20rem,calc(100vw-1.5rem))] flex-col overflow-hidden ${panelClass}`}>
            <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3"><div className="flex items-center gap-2"><h2 id="messages-popover-title" className="text-sm font-semibold">Messages</h2><span className="rounded-full bg-foreground px-1.5 py-0.5 font-mono text-[10px] font-semibold text-background">{unreadInboxCount} unread</span></div>{unreadInboxCount > 0 && <button onClick={markAllInboxRead} className="text-xs text-muted-foreground hover:text-foreground">Mark all read</button>}</div>
            <div className="min-h-0 flex-1 divide-y divide-border overflow-y-auto">{inboxMessages.length ? inboxMessages.map((message) => <div key={message.id} className="flex items-center gap-2 px-2"><button onClick={() => { if (message.unread) markRead(message.id); setShowInbox(false); router.push('/messages/inbox/unread'); }} className="flex min-w-0 flex-1 items-start gap-3 px-2 py-3 text-left hover:bg-muted/60"><span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border ${message.unread ? 'bg-foreground text-background' : 'bg-muted text-foreground'}`}><Mail size={14}/></span><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><span className="truncate text-sm font-medium">{message.title}</span><span className="shrink-0 text-[10px] text-muted-foreground">{message.time}</span></span><span className="mt-0.5 block truncate text-xs text-muted-foreground">{message.body}</span></span></button>{message.unread && <button onClick={() => markRead(message.id)} className="shrink-0 rounded border border-border px-2 py-1 text-[10px] font-medium text-foreground hover:bg-muted">Mark read</button>}</div>) : <p className="px-4 py-8 text-center text-sm text-muted-foreground">No messages yet.</p>}</div>
            <button onClick={() => { setShowInbox(false); router.push('/messages/inbox'); }} className="shrink-0 border-t border-border px-4 py-3 text-sm font-medium hover:bg-muted/60">Open inbox</button>
          </div>}
        </div>

        <div className="relative" ref={notificationsRef}>
          <button id="notifications-popover-trigger" onClick={() => { setShowNotifications((open) => !open); setShowInbox(false); setShowLanguage(false); setShowProfile(false); }} className={iconButtonClass} aria-label="Notifications" aria-haspopup="dialog" aria-controls={showNotifications ? 'notifications-popover' : undefined} aria-expanded={showNotifications}>
            <Bell size={17}/>{unreadNotificationCount > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 font-mono text-[10px] font-semibold text-background">{unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}</span>}
          </button>
          {showNotifications && <div id="notifications-popover" role="dialog" aria-labelledby="notifications-popover-title" className={`absolute right-0 top-11 z-50 flex max-h-[min(32rem,calc(100dvh-4.5rem))] w-[min(20rem,calc(100vw-1.5rem))] flex-col overflow-hidden ${panelClass}`}>
            <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3"><div className="flex items-center gap-2"><h2 id="notifications-popover-title" className="text-sm font-semibold">Notifications</h2><span className="rounded-full bg-foreground px-1.5 py-0.5 font-mono text-[10px] font-semibold text-background">{unreadNotificationCount} unread</span></div>{unreadNotificationCount > 0 && <button onClick={markAllNotificationsRead} className="text-xs text-muted-foreground hover:text-foreground">Mark all read</button>}</div>
            <div className="min-h-0 flex-1 divide-y divide-border overflow-y-auto">{notifications.length ? notifications.map((notification) => <div key={notification.id} className="flex items-center gap-2 px-2"><button onClick={() => { if (notification.unread) markRead(notification.id); setShowNotifications(false); router.push(notification.href); }} className="flex min-w-0 flex-1 items-start gap-3 px-2 py-3 text-left hover:bg-muted/60"><span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border ${notification.unread ? 'bg-foreground text-background' : 'bg-muted text-foreground'}`}><Bell size={14}/></span><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><span className="truncate text-sm font-medium">{notification.title}</span><span className="shrink-0 text-[10px] text-muted-foreground">{notification.time}</span></span><span className="mt-0.5 block truncate text-xs text-muted-foreground">{notification.body || notification.type || (notification.unread ? 'Unread' : 'Read')}</span></span></button>{notification.unread && <button onClick={() => markRead(notification.id)} className="shrink-0 rounded border border-border px-2 py-1 text-[10px] font-medium text-foreground hover:bg-muted">Mark read</button>}</div>) : <p className="px-4 py-8 text-center text-sm text-muted-foreground">No notifications yet.</p>}</div>
            <button onClick={() => { setShowNotifications(false); router.push('/notifications'); }} className="shrink-0 border-t border-border px-4 py-3 text-sm font-medium hover:bg-muted/60">Open notifications</button>
          </div>}
        </div>

        <div className="relative" ref={languageRef}>
          <button id="language-popover-trigger" onClick={() => { setShowLanguage((open) => !open); setShowInbox(false); setShowNotifications(false); setShowProfile(false); }} className={iconButtonClass} aria-label="Change language" aria-haspopup="dialog" aria-controls={showLanguage ? 'language-popover' : undefined} aria-expanded={showLanguage} title="Change language"><Languages size={17}/></button>
          {showLanguage && <div id="language-popover" role="group" aria-labelledby="language-popover-title" className={`absolute right-0 top-11 w-48 p-1.5 ${panelClass}`}><p id="language-popover-title" className="mb-1 border-b border-border px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Language</p>{LANGUAGES.map((item) => <button key={item.code} onClick={() => { setLanguage?.(item.code); setShowLanguage(false); }} className={`flex min-h-10 w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors ${language === item.code ? 'bg-foreground font-medium text-background' : 'text-foreground hover:bg-muted'}`}><span>{item.name}</span><span className="flex items-center gap-2">{language === item.code && <Check size={14}/>}<span className={`rounded border px-1 py-0.5 font-mono text-[10px] ${language === item.code ? 'border-background/30 bg-background/10 text-background' : 'border-border bg-muted text-muted-foreground'}`}>{LANGUAGE_CODES[item.code]}</span></span></button>)}</div>}
        </div>

        <div className="relative" ref={profileRef}>
          <button id="profile-popover-trigger" onClick={() => { setShowProfile((open) => !open); setShowInbox(false); setShowNotifications(false); setShowLanguage(false); }} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-foreground font-mono text-xs font-semibold text-background" aria-label="Open profile menu" aria-haspopup="dialog" aria-controls={showProfile ? 'profile-popover' : undefined} aria-expanded={showProfile}>{profileInitials}</button>
          {showProfile && <div id="profile-popover" role="dialog" aria-label="Profile menu" className={`absolute right-0 top-11 w-72 max-w-[calc(100vw-1.5rem)] p-1.5 ${panelClass}`}>
            <div className="mb-1 flex items-center gap-2.5 border-b border-border px-3 py-2.5"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-foreground font-mono text-xs font-semibold text-background">{profileInitials}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold">{profileName}</span><span className="block truncate text-xs text-muted-foreground">{profileEmail}</span></span><span className="shrink-0 rounded border border-border bg-muted/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground">{currentUser?.role || 'Admin'}</span></div>
            {isDemoModeEnabled && <div className="my-1 rounded-lg border border-border/60 bg-muted/30 p-2">
              <div className="mb-2 flex items-center justify-between gap-2"><span className="flex min-w-0 items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"><Sparkles size={12} className="shrink-0"/>Instant Role Switch</span><span className="shrink-0 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Demo</span></div>
              <div className="flex flex-col gap-1.5">{DEMO_ACCOUNTS.map((account) => { const selected = String(currentUser?.role || '').toLowerCase() === account.role.toLowerCase(); const access = account.role === 'Admin' ? 'Full Admin Access' : account.role === 'Manager' ? 'Manager Access' : 'Read-Only User'; return <button key={account.email} type="button" aria-pressed={selected} onClick={async () => { try { await switchDemoRole(account); setShowProfile(false); } catch (error) { console.error('Could not switch demo role:', error); } }} className={`flex w-full items-center justify-between gap-2.5 rounded-md border px-2.5 py-2 text-left transition-all ${selected ? 'border-foreground bg-foreground text-background shadow-sm' : 'border-transparent bg-background/80 text-foreground hover:border-border hover:bg-muted'}`}>
                <span className="flex min-w-0 items-center gap-2"><span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${selected ? 'bg-background text-foreground' : 'border border-border bg-muted text-foreground'}`}>{account.initials}</span><span className="min-w-0"><span className="block truncate text-xs font-medium leading-none">{account.name}</span><span className={`mt-1 block text-[10px] ${selected ? 'text-background/75' : 'text-muted-foreground'}`}>{access}</span></span></span>
                <span className="flex shrink-0 items-center gap-1"><span className={`rounded border px-1.5 py-0.5 font-mono text-[9px] uppercase ${selected ? 'border-background/30 bg-background/10 text-background' : 'border-border bg-muted/60 text-foreground'}`}>{account.role}</span>{selected && <Check size={14} className="shrink-0"/>}</span>
              </button>; })}</div>
            </div>}
            <div className="p-0.5">{[{ label: 'Profile', href: '/settings', icon: User }, { label: 'Account Settings', href: '/settings', icon: Settings }, { label: 'Security', href: '/security/audit/security', icon: Shield }].map(({ label, href, icon: Icon }) => <button key={label} onClick={() => { setShowProfile(false); router.push(href); }} className="flex min-h-9 w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-xs font-medium text-foreground transition-colors hover:bg-muted"><Icon size={15}/>{label}</button>)}</div>
            <div className="mt-1 border-t border-border pt-1"><button onClick={signOut} className="flex min-h-9 w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-xs font-medium text-foreground transition-colors hover:bg-muted"><LogOut size={15}/>Sign Out</button></div>
          </div>}
        </div>
      </div>
    </header>

    {commandOpen && <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/50 p-3 pt-[8vh] backdrop-blur-sm sm:p-6 sm:pt-[10vh]" onMouseDown={(event) => { if (event.target === event.currentTarget) closeCommand(); }}>
      <section ref={commandDialogRef} role="dialog" aria-modal="true" aria-label="Live Workspace Spotlight" onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const focusable = commandDialogRef.current?.querySelectorAll('button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])');
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }} className="flex max-h-[84dvh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
        <div className="flex shrink-0 items-center gap-3 border-b border-border px-4"><Search size={18} className="shrink-0 text-muted-foreground"/><input ref={commandInputRef} value={commandQuery} onChange={(event) => { setCommandQuery(event.target.value); setSelectedIndex(0); }} onKeyDown={(event) => {
          if (event.key === 'ArrowDown') { event.preventDefault(); setSelectedIndex((index) => Math.min(index + 1, Math.max(0, commandResults.length - 1))); }
          if (event.key === 'ArrowUp') { event.preventDefault(); setSelectedIndex((index) => Math.max(0, index - 1)); }
          if (event.key === 'Enter' && commandResults[selectedIndex]) { event.preventDefault(); activateResult(commandResults[selectedIndex]); }
        }} placeholder="Search workspace, records, and actions..." className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"/><kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">ESC</kbd></div>
        <div role="tablist" aria-label="Spotlight categories" className="flex shrink-0 gap-1 overflow-x-auto border-b border-border px-3 py-2">{COMMAND_TABS.map((tab) => <button key={tab} type="button" role="tab" aria-selected={commandTab === tab} onClick={() => { setCommandTab(tab); setSelectedIndex(0); requestAnimationFrame(() => commandInputRef.current?.focus()); }} className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${commandTab === tab ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>{tab}</button>)}</div>
        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          {entityError && <p role="status" className="mb-2 rounded-md border border-border bg-muted px-3 py-2 text-xs text-muted-foreground">{entityError}</p>}
          {commandResults.length ? <div className="space-y-1">{commandResults.map((result, index) => {
            const Icon = result.icon || Activity;
            return <button key={result.id} type="button" role="option" aria-selected={index === selectedIndex} onMouseEnter={() => setSelectedIndex(index)} onClick={() => activateResult(result)} className={`flex min-h-12 w-full min-w-0 items-center gap-3 rounded-md px-3 py-2 text-left transition-colors ${index === selectedIndex ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'}`}>
              {result.entityType === 'Users' ? <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground font-mono text-[10px] font-semibold text-background">{result.initials}</span> : <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-background text-foreground"><Icon size={15}/></span>}
              <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{result.label}</span><span className="block truncate text-xs text-muted-foreground">{result.description || result.category}</span></span>
              {result.badge && <span className="max-w-28 shrink-0 truncate rounded border border-border bg-background px-2 py-1 font-mono text-[9px] uppercase text-foreground">{result.badge}</span>}
              {result.action ? <span className="shrink-0 text-[10px] font-mono text-muted-foreground">Run</span> : <ArrowRight size={14} className="shrink-0 text-muted-foreground"/>}
            </button>;
          })}</div> : entityLoading ? <p className="px-4 py-10 text-center text-sm text-muted-foreground">Searching live workspace records…</p> : <p className="px-4 py-10 text-center text-sm text-muted-foreground">{commandQuery.length < 2 && ['Users', 'Products', 'Orders'].includes(commandTab) ? 'No matching live records.' : 'No matching pages, actions, or records.'}</p>}
        </div>
        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border px-4 py-2 text-[10px] text-muted-foreground"><span className="truncate">{entityLoading ? 'Syncing live records…' : `${commandResults.length} results · ${ROUTES.length} dashboard routes`}</span><span className="shrink-0">↑↓ Navigate · ↵ Open · Esc Close</span></div>
      </section>
    </div>}
  </>;
}
