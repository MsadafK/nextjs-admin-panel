'use client';

import { useCallback, useEffect, useState } from 'react';
import { ChevronDown, PanelLeftClose, PanelLeftOpen, Shield, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { menuItems } from './MenuItems';
import { notificationService } from '@/services/notificationService';
import { supabase } from '@/lib/supabase';

const NAV_SECTIONS = [
  { title: 'Overview', items: ['dashboard', 'analytics', 'reports'] },
  { title: 'Management', items: ['users', 'products'] },
  { title: 'Workspace', items: ['messages', 'calendar'] },
  { title: 'System', items: ['security', 'performance', 'settings'] },
];

const normalizePath = (path = '') => path.replace(/\/$/, '') || '/';
const findRouteTrail = (items, pathname, parents = []) => {
  for (const item of items) {
    const trail = [...parents, item];
    if (item.href && normalizePath(item.href) === normalizePath(pathname)) return trail;
    const nested = item.subItems || item.childItems;
    if (nested) {
      const match = findRouteTrail(nested, pathname, trail);
      if (match) return match;
    }
  }
  return null;
};
const containsRoute = (item, pathname) => Boolean(findRouteTrail([item], pathname));

export default function Sidebar({
  isCollapsed = false, onToggle, position = 'left', isDarkMode = false,
  isMobile = false, isMobileOpen = false, onMobileClose = () => {},
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage() || {};
  const [unreadCount, setUnreadCount] = useState(0);
  const [expanded, setExpanded] = useState({});

  const translate = useCallback((value) => (t ? t(value) : value.replace(/_/g, ' ')), [t]);
  const refreshCounts = useCallback(async () => {
    try { setUnreadCount(await notificationService.getUnreadCount()); }
    catch (error) { console.error('Could not load unread message count:', error); }
  }, []);

  useEffect(() => {
    const handleUpdated = () => { refreshCounts(); };
    window.addEventListener('notifications:updated', handleUpdated);
    const channel = supabase.channel('notifications-sync-sidebar')
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

  useEffect(() => {
    if (!pathname) return;
    const trail = findRouteTrail(menuItems, pathname);
    if (trail) {
      const next = {};
      trail.slice(0, -1).forEach((item) => { next[item.href || item.label] = true; });
      setExpanded(next);
    }
    if (isMobile) onMobileClose();
  }, [pathname, isMobile, onMobileClose]);

  useEffect(() => {
    if (!isMobile || !isMobileOpen) return undefined;
    document.body.style.overflow = 'hidden';
    const handleEscape = (event) => { if (event.key === 'Escape') onMobileClose(); };
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isMobile, isMobileOpen, onMobileClose]);

  const closeAfterNavigation = () => { if (isMobile) onMobileClose(); };
  const toggleGroup = (item) => {
    const key = item.href || item.label;
    setExpanded((current) => ({ ...current, [key]: !current[key] }));
  };
  const navigate = (href) => {
    if (href && href !== '#') router.push(href);
    closeAfterNavigation();
  };

  const renderLeaf = (item, level = 2) => {
    const active = normalizePath(item.href) === normalizePath(pathname);
    return <button key={`${item.label}-${item.href}`} type="button" title={isCollapsed ? translate(item.label) : undefined} onClick={() => navigate(item.href)} className={`flex min-h-10 w-full min-w-0 items-center rounded-md px-2.5 py-1.5 text-left text-[13px] transition-colors ${active ? 'bg-foreground text-background font-medium shadow-2xs' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'} ${level === 3 ? 'text-[12.5px]' : ''}`}>
      <span className="min-w-0 truncate capitalize">{translate(item.label)}</span>
    </button>;
  };

  const renderNested = (item, level = 2) => {
    const hasChildren = Boolean(item.subItems || item.childItems);
    if (!hasChildren) return renderLeaf(item, level);
    const children = item.subItems || item.childItems;
    const key = item.href || item.label;
    const isOpen = Boolean(expanded[key]);
    const branchActive = containsRoute(item, pathname);
    return <div key={`${item.label}-${key}`} className="space-y-0.5">
      <button type="button" aria-expanded={isOpen} onClick={() => toggleGroup(item)} className={`flex min-h-10 w-full min-w-0 items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-left text-[13px] transition-colors ${branchActive ? 'bg-muted/60 font-semibold text-foreground' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
        <span className="min-w-0 truncate capitalize">{translate(item.label)}</span><ChevronDown size={14} className={`shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}/>
      </button>
      {isOpen && <div className="ml-5 space-y-0.5 border-l border-border pl-3">
        {children.map((child) => child.subItems || child.childItems ? renderNested(child, level + 1) : renderLeaf(child, level + 1))}
      </div>}
    </div>;
  };

  const asideWidth = isCollapsed && !isMobile ? 'w-16' : 'w-64';
  const edge = position === 'right' ? 'right-0 border-l' : 'left-0 border-r';

  return <>
    {isMobile && isMobileOpen && <button type="button" aria-label="Close navigation" onClick={onMobileClose} className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"/>}
    <aside className={`${isMobile ? `fixed inset-y-0 ${position === 'right' ? 'right-0 border-l' : 'left-0 border-r'} z-50 w-72 max-w-[85vw] ${isMobileOpen ? 'translate-x-0' : position === 'right' ? 'translate-x-full' : '-translate-x-full'}` : `hidden lg:flex fixed inset-y-0 ${edge} ${asideWidth}`} flex h-[100dvh] flex-col border-border/70 bg-background text-foreground transition-[width,transform] duration-200 ease-in-out`}>
      <div className={`flex h-14 shrink-0 items-center border-b border-border/70 px-3 ${isCollapsed && !isMobile ? 'justify-center' : 'justify-between'}`}>
        {(!isCollapsed || isMobile) && <button type="button" onClick={() => navigate('/')} className="flex min-w-0 items-center gap-2.5 rounded-md text-left" title="AdminPro home">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-foreground"><Shield size={17} strokeWidth={1.75}/></span>
          <span className="flex min-w-0 items-center gap-1.5"><span className="truncate text-[15px] font-semibold tracking-tight">AdminPro</span><span className="rounded border border-border px-1 py-0.5 text-[9px] font-semibold leading-none tracking-wider text-muted-foreground">PRO</span></span>
        </button>}
        {isMobile ? <button type="button" onClick={onMobileClose} aria-label="Close sidebar" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"><X size={18}/></button>
          : <button type="button" onClick={onToggle} aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground lg:flex">{isCollapsed ? <PanelLeftOpen size={17} strokeWidth={1.75}/> : <PanelLeftClose size={17} strokeWidth={1.75}/>}</button>}
      </div>

      <nav aria-label="Main navigation" className="sidebar-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-3">
        {NAV_SECTIONS.map((section) => {
          const sectionItems = section.items.map((label) => menuItems.find((item) => item.label === label)).filter(Boolean);
          return <section key={section.title} className="mt-2">
            {!isCollapsed && !isMobile && <h2 className="px-3 pb-1.5 pt-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">{section.title}</h2>}
            {sectionItems.map((item) => {
              const Icon = item.icon;
              const key = item.href || item.label;
              const hasChildren = Boolean(item.subItems || item.childItems);
              const isOpen = Boolean(expanded[key]);
              const exactActive = normalizePath(item.href) === normalizePath(pathname) && !hasChildren;
              const branchActive = containsRoute(item, pathname);
              const label = translate(item.label);
              return <div key={item.label} className="mb-0.5">
                <button type="button" title={isCollapsed && !isMobile ? label : undefined} aria-expanded={hasChildren ? isOpen : undefined} onClick={() => hasChildren ? (isCollapsed && !isMobile ? onToggle?.() : toggleGroup(item)) : navigate(item.href)} className={`relative flex h-9 min-h-10 w-full min-w-0 items-center justify-between gap-2.5 rounded-md px-3 text-[13px] font-medium transition-all lg:min-h-0 ${exactActive ? 'bg-foreground text-background shadow-2xs' : branchActive ? 'bg-muted/60 text-foreground font-semibold' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'} ${isCollapsed && !isMobile ? 'justify-center px-0' : ''}`}>
                  <span className={`flex min-w-0 items-center gap-2.5 ${isCollapsed && !isMobile ? 'justify-center' : ''}`}><Icon size={16} strokeWidth={1.75} className="shrink-0"/>{(!isCollapsed || isMobile) && <span className="min-w-0 truncate capitalize">{label}</span>}</span>
                  {(!isCollapsed || isMobile) && <span className="flex shrink-0 items-center gap-2">{item.label === 'messages' && unreadCount > 0 && <span aria-label={`${unreadCount} unread messages`} className="rounded-full bg-foreground px-1.5 py-0.5 text-[10px] font-semibold leading-none text-background">{unreadCount > 99 ? '99+' : unreadCount}</span>}{hasChildren && <ChevronDown size={14} className={`shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}/>}</span>}
                  {isCollapsed && !isMobile && item.label === 'messages' && unreadCount > 0 && <span className="absolute right-1 top-1.5 h-2 w-2 rounded-full bg-foreground ring-2 ring-background"/>}
                </button>
                {hasChildren && isOpen && (!isCollapsed || isMobile) && <div className="ml-5 space-y-0.5 border-l border-border pl-3 pt-0.5">{(item.subItems || item.childItems).map((child) => renderNested(child, 2))}</div>}
              </div>;
            })}
          </section>;
        })}
      </nav>

      {(!isCollapsed || isMobile) && <div className="mt-auto shrink-0 border-t border-border bg-background p-3">
        <div className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/30 p-2.5 transition-colors hover:bg-muted/60">
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">JD<span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-muted-foreground"/></span>
          <span className="min-w-0 flex-1"><span className="block truncate text-[13px] font-medium tracking-tight">John Doe</span><span className="block truncate text-[11px] text-muted-foreground">john@nexstore.com</span></span>
        </div>
      </div>}
    </aside>
  </>;
}
