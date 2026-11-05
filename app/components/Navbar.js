'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Activity, ArrowRight, Bell, Check, ChevronRight, Languages, LogOut, Mail, Menu, Moon, Search, Settings, Shield, Sun, User } from 'lucide-react';
import { useTheme } from '@/app/contexts/ThemeContext';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { menuItems } from './Sidebar/MenuItems';
import { notificationService } from '@/services/notificationService';
import { supabase } from '@/lib/supabase';

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
];
const COMMAND_ROUTES = [...QUICK_LINKS, ...ROUTES.filter((route) => !QUICK_LINKS.some((quick) => quick.href === route.href))];
const COMMAND_ACTIONS = [
  { id: 'toggle-theme', label: 'Toggle Dark / Light Theme', category: 'Quick Actions', action: 'toggle-theme' },
  { id: 'go-settings', label: 'Go to Settings', category: 'Quick Actions', href: '/settings' },
  { id: 'compose-message', label: 'Compose Message', category: 'Quick Actions', href: '/messages/compose' },
];
const LANGUAGES = [
  { code: 'en', name: 'English' }, { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' }, { code: 'de', name: 'Deutsch' },
];
const LANGUAGE_CODES = { en: 'EN', es: 'ES', fr: 'FR', de: 'DE' };
const panelClass = 'z-[100] rounded-xl border border-border bg-background bg-white dark:bg-zinc-950 opacity-100 shadow-xl ring-1 ring-black/5';
const iconButtonClass = 'relative flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-transparent text-muted-foreground transition-colors hover:border-border hover:bg-muted/60 hover:text-foreground';

export default function Navbar({ onMenuClick, sidebarPosition = 'left', sidebarDarkMode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isDark, toggleDarkMode } = useTheme();
  const { language, t, setLanguage } = useLanguage() || {};
  const [notifications, setNotifications] = useState([]);
  const [inboxMessages, setInboxMessages] = useState([]);
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showInbox, setShowInbox] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const dark = isDark || sidebarDarkMode;

  const commandInputRef = useRef(null);
  const inboxRef = useRef(null);
  const notificationsRef = useRef(null);
  const languageRef = useRef(null);
  const profileRef = useRef(null);

  const refreshCounts = useCallback(async () => {
    try {
      const rows = await notificationService.getNotifications();
      setInboxMessages(rows.filter((row) => !row.archived && !row.draft && !row.sent).map((row) => ({
        id: row.id, title: row.title, body: row.body, time: row.createdAt ? new Date(row.createdAt).toLocaleString() : '', unread: !row.isRead,
      })));
      setNotifications(rows.map((row) => ({ id: row.id, title: row.title, time: row.createdAt ? new Date(row.createdAt).toLocaleString() : '', unread: !row.isRead, href: '/messages' })));
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
  const unreadNotificationCount = notifications.filter((notification) => notification.unread).length;
  const commandResults = useMemo(() => {
    const all = [...COMMAND_ROUTES, ...COMMAND_ACTIONS];
    const query = commandQuery.trim().toLowerCase();
    const results = query ? all.filter((item) => `${item.label} ${item.category}`.toLowerCase().includes(query)) : all;
    return results.slice(0, 12);
  }, [commandQuery]);

  const activeRoute = useMemo(() => ROUTES.find((route) => normalizePath(route.href) === normalizePath(pathname)), [pathname]);
  const breadcrumbs = useMemo(() => {
    if (activeRoute) return activeRoute.breadcrumbs;
    if (normalizePath(pathname) === '/') return ['Dashboard'];
    return normalizePath(pathname).split('/').filter(Boolean).map(formatLabel);
  }, [activeRoute, pathname]);
  const currentTitle = breadcrumbs.at(-1) || 'Dashboard';

  const openCommand = useCallback(() => {
    setShowInbox(false); setShowNotifications(false); setShowLanguage(false); setShowProfile(false);
    setCommandQuery(''); setSelectedIndex(0); setCommandOpen(true);
  }, []);
  const closeCommand = useCallback(() => setCommandOpen(false), []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault(); openCommand();
      } else if (event.key === 'Escape') {
        closeCommand(); setShowInbox(false); setShowNotifications(false); setShowLanguage(false); setShowProfile(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [openCommand, closeCommand]);

  useEffect(() => {
    if (!commandOpen) return undefined;
    const frame = requestAnimationFrame(() => commandInputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [commandOpen]);

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
  const activateResult = (result) => {
    if (result.action === 'toggle-theme') { toggleDarkMode(); closeCommand(); return; }
    if (result.href) navigate(result.href);
  };
  const markRead = async (id) => {
    try { await notificationService.updateMessage(id, { isRead: true }); }
    catch (error) { console.error('Could not mark notification as read:', error); }
  };
  const markAllInboxRead = async () => {
    await Promise.all(inboxMessages.filter((message) => message.unread).map((message) => markRead(message.id)));
  };
  const markAllNotificationsRead = async () => {
    await Promise.all(notifications.filter((notification) => notification.unread).map((notification) => markRead(notification.id)));
  };
  const signOut = async () => {
    await supabase.auth.signOut();
    setShowProfile(false);
    router.push('/');
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
          <button onClick={() => { setShowInbox((open) => !open); setShowNotifications(false); setShowLanguage(false); setShowProfile(false); }} className={iconButtonClass} aria-label="Messages" aria-expanded={showInbox}>
            <Mail size={17}/>{unreadInboxCount > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 font-mono text-[10px] font-semibold text-background">{unreadInboxCount > 99 ? '99+' : unreadInboxCount}</span>}
          </button>
          {showInbox && <div className={`absolute right-0 top-11 z-50 flex max-h-[min(32rem,calc(100dvh-4.5rem))] w-[min(20rem,calc(100vw-1.5rem))] flex-col overflow-hidden ${panelClass}`}>
            <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3"><h2 className="text-sm font-semibold">Messages</h2>{unreadInboxCount > 0 && <button onClick={markAllInboxRead} className="text-xs text-muted-foreground hover:text-foreground">Mark all read</button>}</div>
            <div className="min-h-0 flex-1 divide-y divide-border overflow-y-auto">{inboxMessages.length ? inboxMessages.map((message) => <button key={message.id} onClick={() => { if (message.unread) markRead(message.id); setShowInbox(false); router.push('/messages/inbox/unread'); }} className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-muted/60"><span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border ${message.unread ? 'bg-foreground text-background' : 'bg-muted text-foreground'}`}><Mail size={14}/></span><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><span className="truncate text-sm font-medium">{message.title}</span><span className="shrink-0 text-[10px] text-muted-foreground">{message.time}</span></span><span className="mt-0.5 block truncate text-xs text-muted-foreground">{message.body}</span></span></button>) : <p className="px-4 py-8 text-center text-sm text-muted-foreground">No messages yet.</p>}</div>
            <button onClick={() => { setShowInbox(false); router.push('/messages/inbox'); }} className="shrink-0 border-t border-border px-4 py-3 text-sm font-medium hover:bg-muted/60">Open inbox</button>
          </div>}
        </div>

        <div className="relative" ref={notificationsRef}>
          <button onClick={() => { setShowNotifications((open) => !open); setShowInbox(false); setShowLanguage(false); setShowProfile(false); }} className={iconButtonClass} aria-label="Notifications" aria-expanded={showNotifications}>
            <Bell size={17}/>{unreadNotificationCount > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 font-mono text-[10px] font-semibold text-background">{unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}</span>}
          </button>
          {showNotifications && <div className={`absolute right-0 top-11 z-50 flex max-h-[min(32rem,calc(100dvh-4.5rem))] w-[min(20rem,calc(100vw-1.5rem))] flex-col overflow-hidden ${panelClass}`}>
            <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3"><h2 className="text-sm font-semibold">Notifications</h2>{unreadNotificationCount > 0 && <button onClick={markAllNotificationsRead} className="text-xs text-muted-foreground hover:text-foreground">Mark all read</button>}</div>
            <div className="min-h-0 flex-1 divide-y divide-border overflow-y-auto">{notifications.length ? notifications.map((notification) => <button key={notification.id} onClick={() => { if (notification.unread) markRead(notification.id); setShowNotifications(false); router.push(notification.href); }} className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-muted/60"><span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border ${notification.unread ? 'bg-foreground text-background' : 'bg-muted text-foreground'}`}><Bell size={14}/></span><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><span className="truncate text-sm font-medium">{notification.title}</span><span className="shrink-0 text-[10px] text-muted-foreground">{notification.time}</span></span><span className="mt-0.5 block text-xs text-muted-foreground">{notification.unread ? 'Unread' : 'Read'}</span></span></button>) : <p className="px-4 py-8 text-center text-sm text-muted-foreground">No notifications yet.</p>}</div>
            <button onClick={() => { setShowNotifications(false); router.push('/messages'); }} className="shrink-0 border-t border-border px-4 py-3 text-sm font-medium hover:bg-muted/60">Open notifications</button>
          </div>}
        </div>

        <div className="relative" ref={languageRef}>
          <button onClick={() => { setShowLanguage((open) => !open); setShowInbox(false); setShowNotifications(false); setShowProfile(false); }} className={iconButtonClass} aria-label="Change language" title="Change language"><Languages size={17}/></button>
          {showLanguage && <div className={`absolute right-0 top-11 w-48 p-1.5 ${panelClass}`}><p className="mb-1 border-b border-border px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Language</p>{LANGUAGES.map((item) => <button key={item.code} onClick={() => { setLanguage?.(item.code); setShowLanguage(false); }} className={`flex min-h-10 w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors ${language === item.code ? 'bg-foreground font-medium text-background' : 'text-foreground hover:bg-muted'}`}><span>{item.name}</span><span className="flex items-center gap-2">{language === item.code && <Check size={14}/>}<span className={`rounded border px-1 py-0.5 font-mono text-[10px] ${language === item.code ? 'border-background/30 bg-background/10 text-background' : 'border-border bg-muted text-muted-foreground'}`}>{LANGUAGE_CODES[item.code]}</span></span></button>)}</div>}
        </div>

        <div className="relative" ref={profileRef}>
          <button onClick={() => { setShowProfile((open) => !open); setShowInbox(false); setShowNotifications(false); setShowLanguage(false); }} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-foreground font-mono text-xs font-semibold text-background" aria-label="Open profile menu" aria-expanded={showProfile}>JD</button>
          {showProfile && <div className={`absolute right-0 top-11 w-60 p-1.5 ${panelClass}`}>
            <div className="mb-1 flex items-center gap-2.5 border-b border-border px-3 py-2.5"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-foreground font-mono text-xs font-semibold text-background">JD</span><span className="min-w-0"><span className="block truncate text-sm font-bold">John Doe</span><span className="block truncate text-xs text-muted-foreground">john@nexstore.com</span></span></div>
            <div className="p-0.5">{[{ label: 'Profile', href: '/settings', icon: User }, { label: 'Account Settings', href: '/settings', icon: Settings }, { label: 'Security', href: '/security/audit/security', icon: Shield }].map(({ label, href, icon: Icon }) => <button key={label} onClick={() => { setShowProfile(false); router.push(href); }} className="flex min-h-10 w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] text-foreground transition-colors hover:bg-muted"><Icon size={15}/>{label}</button>)}</div>
            <div className="mt-1 border-t border-border pt-1"><button onClick={signOut} className="flex min-h-10 w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] text-foreground transition-colors hover:bg-muted"><LogOut size={15}/>Sign Out</button></div>
          </div>}
        </div>
      </div>
    </header>

    {commandOpen && <div className="fixed inset-0 z-[80] flex items-start justify-center bg-black/50 p-3 pt-[12vh] backdrop-blur-sm sm:p-6 sm:pt-[14vh]" onMouseDown={(event) => { if (event.target === event.currentTarget) closeCommand(); }}>
      <section role="dialog" aria-modal="true" aria-label="Quick search" className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border px-4"><Search size={18} className="shrink-0 text-muted-foreground"/><input ref={commandInputRef} value={commandQuery} onChange={(event) => { setCommandQuery(event.target.value); setSelectedIndex(0); }} onKeyDown={(event) => {
          if (event.key === 'ArrowDown') { event.preventDefault(); setSelectedIndex((index) => Math.min(index + 1, commandResults.length - 1)); }
          if (event.key === 'ArrowUp') { event.preventDefault(); setSelectedIndex((index) => Math.max(0, index - 1)); }
          if (event.key === 'Enter' && commandResults[selectedIndex]) { event.preventDefault(); activateResult(commandResults[selectedIndex]); }
        }} placeholder="Search routes and actions..." className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"/><kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">ESC</kbd></div>
        <div className="max-h-[min(65vh,28rem)] overflow-y-auto p-2">{commandResults.length ? commandResults.map((result, index) => {
          const Icon = result.icon || (result.action === 'toggle-theme' ? (isDark ? Sun : Moon) : result.href?.includes('settings') ? Settings : result.href?.includes('messages') ? Mail : Activity);
          return <button key={result.id || `${result.href}-${result.label}`} onMouseEnter={() => setSelectedIndex(index)} onClick={() => activateResult(result)} className={`flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-left ${index === selectedIndex ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'}`}><Icon size={16} className="shrink-0"/><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{result.label}</span><span className="block truncate text-xs text-muted-foreground">{result.category || 'Route'}</span></span>{result.action ? <span className="text-[10px] text-muted-foreground">Action</span> : <ArrowRight size={14} className="shrink-0 text-muted-foreground"/>}</button>;
        }) : <p className="px-4 py-10 text-center text-sm text-muted-foreground">No matching routes or actions.</p>}</div>
        <div className="flex items-center gap-4 border-t border-border px-4 py-2 text-[10px] text-muted-foreground"><span>↑↓ Navigate</span><span>↵ Open</span><span>Esc Close</span></div>
      </section>
    </div>}
  </>;
}
