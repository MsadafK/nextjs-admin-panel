'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import {
  Search, Bell, User, LogOut, Menu, Sun, Moon,
  Mail, FileText, CheckSquare, Pin, PinOff, ArrowRight
} from 'lucide-react';
import { useTheme } from '@/app/contexts/ThemeContext';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { menuItems } from './Sidebar/MenuItems';
import { useRouter } from 'next/navigation';
import NextImage from 'next/image';

const INITIAL_NOTIFICATIONS = [
  { id: 1, title: 'New user registered', time: '2 min ago', unread: true, i18nKey: 'notification_new_user', href: '/users/all/list' },
  { id: 2, title: 'Server maintenance scheduled', time: '1 hour ago', unread: true, i18nKey: 'notification_maintenance', href: '/analytics/realtime/health' },
  { id: 3, title: 'Backup completed successfully', time: '3 hours ago', unread: false, i18nKey: 'notification_backup', href: '/security/audit/system' },
];

const INITIAL_INBOX = [
  { id: 1, name: 'Michell Flintoff', message: 'You: Yesterday was great…', time: 'just now', unread: true, avatarSeed: 'Michell', dotColor: 'bg-blue-500' },
  { id: 2, name: 'Bianca Anderson', message: 'Nice looking dress you…', time: '5 mins ago', unread: true, avatarSeed: 'Bianca', dotColor: 'bg-blue-500' },
  { id: 3, name: 'Andrew Johnson', message: 'Sent a photo', time: '10 mins ago', unread: true, avatarSeed: 'Andrew', dotColor: 'bg-violet-500' },
  { id: 4, name: 'Jolly Cummins', message: "If I don't like something", time: '5 days ago', unread: false, avatarSeed: 'Jolly', dotColor: 'bg-amber-500' },
  { id: 5, name: 'Josh Macklow', message: 'Good night. Catch you…', time: 'year ago', unread: false, avatarSeed: 'Josh', dotColor: 'bg-teal-500' },
];

const languages = [
  { code: 'en', name: 'English', flagUrl: 'https://flagcdn.com/w40/us.png' },
  { code: 'es', name: 'Español', flagUrl: 'https://flagcdn.com/w40/es.png' },
  { code: 'fr', name: 'Français', flagUrl: 'https://flagcdn.com/w40/fr.png' },
  { code: 'de', name: 'Deutsch', flagUrl: 'https://flagcdn.com/w40/de.png' },
];

const profileMenuItems = [
  { icon: User, label: 'My Profile', sub: 'Account settings', href: '/settings', lightBg: 'bg-blue-50', darkBg: 'bg-blue-950/40', ic: 'text-blue-500' },
  { icon: FileText, label: 'My Notes', sub: 'My Daily Notes', href: '/calendar/reminders/active', lightBg: 'bg-teal-50', darkBg: 'bg-teal-950/40', ic: 'text-teal-500' },
  { icon: CheckSquare, label: 'My Tasks', sub: 'To-do and daily tasks', href: '/performance/meetings/actions', lightBg: 'bg-violet-50', darkBg: 'bg-violet-950/40', ic: 'text-violet-500' },
];

/* Flatten all navigable routes from menuItems for Ctrl+K search */
function getFlatRoutes(items = menuItems, parentTrail = []) {
  let routes = [];
  for (const item of items) {
    const label = item.label.replace(/_/g, ' ');
    const currentTrail = [...parentTrail, label];
    if (item.href && !item.subItems && !item.childItems) {
      routes.push({
        label,
        href: item.href,
        category: parentTrail.join(' › ') || 'General',
        icon: item.icon,
      });
    }
    if (item.subItems) routes = routes.concat(getFlatRoutes(item.subItems, currentTrail));
    if (item.childItems) routes = routes.concat(getFlatRoutes(item.childItems, currentTrail));
  }
  return routes;
}

const ALL_ROUTES = getFlatRoutes();

const Z = {
  nav: (dark, isSticky) => dark
    ? `bg-zinc-900 border-zinc-800 ${isSticky ? 'bg-zinc-900/80 backdrop-blur-md supports-[backdrop-filter]:bg-zinc-900/60' : ''}`
    : `bg-white border-zinc-200 ${isSticky ? 'bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60' : ''}`,
  btn: (dark) => dark
    ? 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 border border-transparent hover:border-zinc-700 rounded-md'
    : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 border border-transparent rounded-md',
  panel: (dark) => dark
    ? 'bg-zinc-900 border border-zinc-800 shadow-dropdown rounded-lg'
    : 'bg-white border border-zinc-200 shadow-dropdown rounded-lg',
  panelHeader: (dark) => dark ? 'border-zinc-800' : 'border-zinc-200',
  panelDivide: (dark) => dark ? 'divide-zinc-800' : 'divide-zinc-100',
  panelRow: (dark) => dark ? 'hover:bg-zinc-800 cursor-pointer' : 'hover:bg-zinc-50 cursor-pointer',
  textPrimary: (dark) => dark ? 'text-zinc-100' : 'text-zinc-900',
  textSecondary: (dark) => dark ? 'text-zinc-400' : 'text-zinc-500',
  input: (dark) => dark
    ? 'bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-500 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500'
    : 'bg-zinc-50 border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400',
  menuItem: (dark, active) => active
    ? (dark ? 'bg-zinc-800 text-zinc-100 font-medium' : 'bg-zinc-100 text-zinc-900 font-medium')
    : (dark ? 'text-zinc-300 hover:bg-zinc-800' : 'text-zinc-700 hover:bg-zinc-50'),
  ctaBtn: (dark) => dark
    ? 'border border-zinc-700 text-zinc-300 hover:bg-zinc-800 rounded-md'
    : 'border border-zinc-300 text-zinc-600 hover:bg-zinc-50 rounded-md',
};

export default function Navbar({ onMenuClick, sidebarPosition = 'left', sidebarDarkMode }) {
  const router = useRouter();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [inboxMessages, setInboxMessages] = useState(INITIAL_INBOX);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showTopSearch, setShowTopSearch] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const { isDark, toggleDarkMode, currentTheme, changeTheme, themes } = useTheme();
  const { language: currentLanguage, t, setLanguage: changeLanguage } = useLanguage() || {};

  const dark = isDark || sidebarDarkMode;

  useEffect(() => {
    const savedSticky = localStorage.getItem('navbarSticky') === 'true';
    setIsSticky(savedSticky);
  }, []);

  const toggleSticky = () => {
    const v = !isSticky;
    setIsSticky(v);
    localStorage.setItem('navbarSticky', v.toString());
  };

  const currentLang = languages.find(l => l.code === currentLanguage) || languages[0];
  const unreadInboxCount = inboxMessages.filter(m => m.unread).length;
  const unreadNotifCount = notifications.filter(n => n.unread).length;

  const filteredRoutes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return ALL_ROUTES.slice(0, 6);
    return ALL_ROUTES.filter(
      r => r.label.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [searchQuery]);

  const searchRef = useRef(null);
  const searchContainerRef = useRef(null);
  const topSearchRef = useRef(null);
  const themeMenuRef = useRef(null);
  const languageMenuRef = useRef(null);
  const inboxRef = useRef(null);
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (sidebarPosition === 'top') setShowTopSearch(true);
        setShowSearchDropdown(true);
        setTimeout(() => searchRef.current?.focus(), 0);
      }
      if (e.key === 'Escape') {
        setShowTopSearch(false);
        setShowSearchDropdown(false);
        searchRef.current?.blur();
      }
    };

    const onOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) setShowSearchDropdown(false);
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target)) setShowThemeMenu(false);
      if (languageMenuRef.current && !languageMenuRef.current.contains(e.target)) setShowLanguageMenu(false);
      if (topSearchRef.current && !topSearchRef.current.contains(e.target)) setShowTopSearch(false);
      if (inboxRef.current && !inboxRef.current.contains(e.target)) setShowInbox(false);
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onOutside);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onOutside);
    };
  }, [sidebarPosition]);

  const handleLanguageChange = (code) => {
    if (changeLanguage) { changeLanguage(code); setShowLanguageMenu(false); }
  };

  const handleNavigate = (href) => {
    setShowSearchDropdown(false);
    setShowMobileSearch(false);
    setSearchQuery('');
    router.push(href);
  };

  const navClasses = [
    Z.nav(dark, isSticky),
    'border-b transition-all duration-200',
    isSticky ? 'sticky top-0 z-40' : '',
    sidebarPosition === 'top'
      ? 'flex-1 h-16 px-4 py-3 flex items-center justify-between'
      : 'px-4 py-2 flex items-center justify-between h-16',
  ].join(' ');

  const iconBtn = `p-2 transition-colors duration-150 ${Z.btn(dark)}`;

  return (
    <nav className={navClasses}>
      {/* ══════════════ LEFT ══════════════ */}
      <div className="flex items-center gap-1 sm:gap-3">
        {sidebarPosition !== 'top' ? (
          <>
            <button onClick={onMenuClick} className={`${iconBtn} lg:hidden`} aria-label="Toggle sidebar">
              <Menu size={20} />
            </button>

            <div className="relative" ref={searchContainerRef}>
              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className={`${iconBtn} md:hidden`}
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {showMobileSearch && (
                <div className="absolute left-0 top-12 w-72 px-0 z-50 md:hidden">
                  <div className="relative shadow-lg rounded-md">
                    <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${Z.textSecondary(dark)}`} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setShowSearchDropdown(true); }}
                      placeholder={t ? t('search') : 'Search pages…'}
                      autoFocus
                      className={`w-full pl-9 pr-4 py-2 text-sm border rounded-md outline-none transition-colors ${Z.input(dark)}`}
                    />
                  </div>
                </div>
              )}

              <div className="hidden md:block relative group">
                <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${Z.textSecondary(dark)} group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100 transition-colors`} />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onFocus={() => setShowSearchDropdown(true)}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowSearchDropdown(true); }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && filteredRoutes.length > 0) {
                      handleNavigate(filteredRoutes[0].href);
                    }
                  }}
                  placeholder={t ? t('search') : 'Search pages…'}
                  className={`pl-9 pr-20 py-2 w-64 text-sm border rounded-md outline-none transition-colors ${Z.input(dark)}`}
                />
                <kbd className={`absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium border ${dark ? 'border-zinc-700 bg-zinc-800' : 'border-zinc-200 bg-zinc-100'} px-1.5 py-0.5 rounded pointer-events-none ${Z.textSecondary(dark)}`}>
                  Ctrl K
                </kbd>
              </div>

              {/* Quick Route Search Dropdown */}
              {showSearchDropdown && (
                <div className={`absolute left-0 mt-2 w-80 z-50 overflow-hidden ${Z.panel(dark)}`}>
                  <div className={`px-3 py-2 border-b ${Z.panelHeader(dark)} flex items-center justify-between`}>
                    <span className={`text-xs font-medium uppercase tracking-wide ${Z.textSecondary(dark)}`}>
                      Quick Navigation
                    </span>
                    <span className={`text-[11px] ${Z.textSecondary(dark)}`}>Enter to jump</span>
                  </div>
                  <div className={`divide-y ${Z.panelDivide(dark)} max-h-64 overflow-y-auto`}>
                    {filteredRoutes.map((route) => {
                      const RouteIcon = route.icon;
                      return (
                        <button
                          key={route.href}
                          onClick={() => handleNavigate(route.href)}
                          className={`w-full px-3 py-2.5 text-left flex items-center justify-between transition-colors ${Z.panelRow(dark)}`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <RouteIcon size={15} className={Z.textSecondary(dark)} />
                            <div className="min-w-0">
                              <p className={`text-sm font-medium capitalize truncate ${Z.textPrimary(dark)}`}>
                                {route.label}
                              </p>
                              <p className={`text-xs capitalize truncate ${Z.textSecondary(dark)}`}>
                                {route.category}
                              </p>
                            </div>
                          </div>
                          <ArrowRight size={14} className={Z.textSecondary(dark)} />
                        </button>
                      );
                    })}
                    {filteredRoutes.length === 0 && (
                      <p className={`px-4 py-6 text-center text-xs ${Z.textSecondary(dark)}`}>
                        No matching pages found.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div />
        )}
      </div>

      {/* ══════════════ RIGHT ══════════════ */}
      <div className={`flex items-center gap-1 sm:gap-2 ${sidebarPosition === 'right' ? 'mr-5' : ''}`}>
        {sidebarPosition === 'top' && (
          <div className="relative flex items-center" ref={topSearchRef}>
            <button
              onClick={() => { setShowTopSearch(v => !v); setTimeout(() => searchRef.current?.focus(), 0); }}
              className={iconBtn}
              aria-label="Open search"
            >
              <Search size={20} />
            </button>
            {showTopSearch && (
              <div className="relative ml-2">
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t ? t('search') : 'Search…'}
                  className={`pl-3 pr-4 py-2 w-48 text-sm border rounded-md outline-none transition-colors shadow-lg ${Z.input(dark)}`}
                />
              </div>
            )}
          </div>
        )}

        <button onClick={toggleSticky} className={iconBtn} title={isSticky ? 'Disable sticky navbar' : 'Enable sticky navbar'}>
          {isSticky ? <Pin size={18} /> : <PinOff size={18} />}
        </button>

        {/* ── Theme Toggle ── */}
        <div className="relative" ref={themeMenuRef}>
          <button onClick={() => setShowThemeMenu(!showThemeMenu)} className={iconBtn} title="Theme settings">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {showThemeMenu && (
            <div className={`absolute right-0 mt-2 w-72 z-50 overflow-hidden ${Z.panel(dark)} max-[426px]:left-1/2 max-[426px]:-translate-x-1/2`}>
              <div className={`px-4 py-3 border-b ${Z.panelHeader(dark)}`}>
                <p className={`text-sm font-semibold ${Z.textPrimary(dark)}`}>{t ? t('themeColors') : 'Global Theme Settings'}</p>
                <p className={`text-xs mt-0.5 ${Z.textSecondary(dark)}`}>Applies to entire application</p>
              </div>
              <div className={`px-4 py-3 border-b ${Z.panelHeader(dark)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isDark ? <Moon size={15} className={Z.textSecondary(dark)} /> : <Sun size={15} className={Z.textSecondary(dark)} />}
                    <div>
                      <p className={`text-sm font-medium ${Z.textPrimary(dark)}`}>{t ? t('darkMode') : 'Dark mode'}</p>
                      <p className={`text-xs ${Z.textSecondary(dark)}`}>{isDark ? 'On' : 'Off'}</p>
                    </div>
                  </div>
                  <button
                    onClick={toggleDarkMode}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isDark ? `bg-\${currentTheme}-600` : 'bg-zinc-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <p className={`text-xs font-medium uppercase tracking-wide mb-3 ${Z.textSecondary(dark)}`}>Accent colour</p>
                <div className="space-y-1">
                  {Object.keys(themes).map((key) => {
                    const theme = themes[key];
                    const active = currentTheme === key;
                    return (
                      <button
                        key={key}
                        onClick={() => changeTheme(key)}
                        className={`flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${Z.menuItem(dark, active)}`}
                      >
                        <span className={`w-4 h-4 rounded-full mr-3 bg-${theme.primary}-600 flex-shrink-0`} />
                        {theme.name}
                        {active && <span className={`ml-auto text-xs text-${theme.primary}-600`}>{t ? t('active') : 'Active'}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Language Toggle ── */}
        <div className="relative" ref={languageMenuRef}>
          <button
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className={`p-2 rounded-md flex items-center justify-center transition-colors duration-150 ${dark ? 'hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700' : 'hover:bg-zinc-100 border border-transparent'} w-9 h-9`}
            title={t ? t('language') : 'Change language'}
          >
            <NextImage src={currentLang.flagUrl} alt={currentLang.name} width={24} height={16} unoptimized className="rounded-sm object-cover" />
          </button>

          {showLanguageMenu && (
            <div className={`absolute right-0 mt-2 w-48 z-50 overflow-hidden ${Z.panel(dark)} max-[425px]:right-auto max-[425px]:left-1/2 max-[425px]:-translate-x-1/2`}>
              <p className={`px-4 pt-3 pb-2 text-xs font-medium uppercase tracking-wide ${Z.textSecondary(dark)}`}>
                {t ? t('language') : 'Language'}
              </p>
              <div className={`border-t ${Z.panelHeader(dark)}`} />
              {languages.map((lang) => {
                const active = currentLanguage === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2.5 transition-colors ${Z.menuItem(dark, active)}`}
                  >
                    <NextImage src={lang.flagUrl} alt={lang.name} width={20} height={16} unoptimized className="rounded-sm object-cover flex-shrink-0" />
                    <span>{lang.name}</span>
                    {active && <span className={`ml-auto text-xs ${Z.textSecondary(dark)}`}>✓</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Inbox ── */}
        <div className="relative" ref={inboxRef}>
          <button onClick={() => setShowInbox(!showInbox)} className={`${iconBtn} relative`} aria-label="Inbox">
            <Mail size={18} />
            {unreadInboxCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-[10px] rounded-full flex items-center justify-center font-semibold">
                {unreadInboxCount}
              </span>
            )}
          </button>

          {showInbox && (
            <div className={`absolute right-0 mt-2 w-80 z-50 max-h-[500px] overflow-hidden flex flex-col ${Z.panel(dark)} max-[425px]:left-1/2 max-[425px]:-translate-x-[67.5%]`}>
              <div className={`px-4 py-3 border-b ${Z.panelHeader(dark)} flex items-center justify-between flex-shrink-0`}>
                <h3 className={`text-sm font-semibold ${Z.textPrimary(dark)}`}>Inbox</h3>
                {unreadInboxCount > 0 && (
                  <button
                    onClick={() => setInboxMessages(prev => prev.map(m => ({ ...m, unread: false })))}
                    className="text-xs text-blue-500 hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className={`divide-y ${Z.panelDivide(dark)} overflow-y-auto flex-1`}>
                {inboxMessages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => {
                      setInboxMessages(prev => prev.map(m => m.id === msg.id ? { ...m, unread: false } : m));
                      setShowInbox(false);
                      router.push('/messages/inbox/unread');
                    }}
                    className={`px-4 py-3 transition-colors ${Z.panelRow(dark)}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative flex-shrink-0">
                        <NextImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.avatarSeed}`} alt={msg.name} width={36} height={36} unoptimized className="rounded-full" />
                        {msg.unread && <span className={`absolute top-0 right-0 w-2.5 h-2.5 ${msg.dotColor} rounded-full border-2 ${dark ? 'border-zinc-900' : 'border-white'}`} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium truncate ${Z.textPrimary(dark)}`}>{msg.name}</p>
                          <span className={`text-xs flex-shrink-0 ml-2 ${Z.textSecondary(dark)}`}>{msg.time}</span>
                        </div>
                        <p className={`text-xs mt-0.5 truncate ${Z.textSecondary(dark)}`}>{msg.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className={`p-3 border-t ${Z.panelHeader(dark)} flex-shrink-0`}>
                <button
                  onClick={() => { setShowInbox(false); router.push('/messages/inbox/unread'); }}
                  className={`w-full py-1.5 text-sm font-medium transition-colors ${Z.ctaBtn(dark)}`}
                >
                  See all messages
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Notifications ── */}
        <div className="relative" ref={notificationsRef}>
          <button onClick={() => setShowNotifications(!showNotifications)} className={`${iconBtn} relative`} aria-label="Notifications">
            <Bell size={18} />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] rounded-full flex items-center justify-center font-semibold">
                {unreadNotifCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className={`absolute right-0 mt-2 w-80 z-50 max-h-[500px] overflow-hidden flex flex-col ${Z.panel(dark)} max-[425px]:left-1/2 max-[425px]:-translate-x-[77.5%]`}>
              <div className={`px-4 py-3 border-b ${Z.panelHeader(dark)} flex items-center justify-between flex-shrink-0`}>
                <h3 className={`text-sm font-semibold ${Z.textPrimary(dark)}`}>Notifications</h3>
                {unreadNotifCount > 0 && (
                  <button
                    onClick={() => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))}
                    className="text-xs text-rose-500 hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className={`divide-y ${Z.panelDivide(dark)} overflow-y-auto flex-1`}>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, unread: false } : item));
                      setShowNotifications(false);
                      router.push(n.href);
                    }}
                    className={`px-4 py-3 transition-colors ${Z.panelRow(dark)}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${n.unread ? 'bg-rose-500' : (dark ? 'bg-zinc-800' : 'bg-zinc-100')}`}>
                        <Bell size={14} className={n.unread ? 'text-white' : Z.textSecondary(dark)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-medium leading-snug ${Z.textPrimary(dark)}`}>{t ? t(n.i18nKey) || n.title : n.title}</p>
                          <span className={`text-xs flex-shrink-0 ${Z.textSecondary(dark)}`}>{n.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className={`p-3 border-t ${Z.panelHeader(dark)} flex-shrink-0`}>
                <button
                  onClick={() => { setShowNotifications(false); router.push('/security/audit/system'); }}
                  className={`w-full py-1.5 text-sm font-medium transition-colors ${Z.ctaBtn(dark)}`}
                >
                  See all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Profile ── */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="rounded-full transition-all hover:ring-2 hover:ring-zinc-300 dark:hover:ring-zinc-700 hover:ring-offset-1"
            aria-label="Profile"
          >
            <NextImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jonathan" alt="Jonathan Deo" width={32} height={32} unoptimized className="rounded-full bg-zinc-100 dark:bg-zinc-800" />
          </button>

          {showProfile && (
            <div className={`absolute right-0 mt-2 w-72 z-50 overflow-hidden ${Z.panel(dark)} max-[425px]:left-1/2 max-[425px]:-translate-x-[90%]`}>
              <div className={`px-5 py-4 border-b ${Z.panelHeader(dark)}`}>
                <div className="flex items-center gap-3">
                  <NextImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jonathan" alt="Jonathan Deo" width={48} height={48} unoptimized className="rounded-full flex-shrink-0 bg-zinc-100 dark:bg-zinc-800" />
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold ${Z.textPrimary(dark)}`}>Jonathan Deo</p>
                    <p className={`text-xs ${Z.textSecondary(dark)}`}>Admin</p>
                    <p className={`text-xs mt-0.5 flex items-center gap-1 ${Z.textSecondary(dark)}`}>
                      <Mail size={11} /> info@materialam.com
                    </p>
                  </div>
                </div>
              </div>
              <div className="py-1">
                {profileMenuItems.map(({ icon: Icon, label, sub, href, lightBg, darkBg, ic }) => (
                  <button
                    key={label}
                    onClick={() => { setShowProfile(false); router.push(href); }}
                    className={`flex items-center w-full px-5 py-2.5 text-sm transition-colors ${Z.panelRow(dark)}`}
                  >
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center mr-3 flex-shrink-0 ${dark ? darkBg : lightBg}`}>
                      <Icon size={15} className={ic} />
                    </div>
                    <div className="text-left">
                      <p className={`text-sm font-medium ${Z.textPrimary(dark)}`}>{label}</p>
                      <p className={`text-xs ${Z.textSecondary(dark)}`}>{sub}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className={`p-4 border-t ${Z.panelHeader(dark)}`}>
                <button
                  onClick={() => setShowProfile(false)}
                  className={`w-full flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-colors ${dark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200' : 'bg-zinc-900 hover:bg-zinc-800 text-white'}`}
                >
                  <LogOut size={15} /> Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}