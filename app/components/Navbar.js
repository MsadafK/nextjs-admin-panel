'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  Sun,
  Moon,
  Globe,
  Mail,
  FileText,
  CheckSquare,
  MessageSquare,
  Pin,
  PinOff,
} from 'lucide-react';
import { useTheme } from '@/app/contexts/ThemeContext';
import { useLanguage } from '@/app/contexts/LanguageContext';

/* ─── Zinc design tokens (mirrors globals.css CSS vars) ────────────────── */
const Z = {
  nav:   (dark) => dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200',
  btn:   (dark) => dark
    ? 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 border border-zinc-700 rounded-md'
    : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 rounded-md',
  panel: (dark) => dark
    ? 'bg-zinc-900 border border-zinc-800 shadow-dropdown rounded-lg'
    : 'bg-white border border-zinc-200 shadow-dropdown rounded-lg',
  panelHeader:   (dark) => dark ? 'border-zinc-800' : 'border-zinc-200',
  panelDivide:   (dark) => dark ? 'divide-zinc-800' : 'divide-zinc-100',
  panelRow:      (dark) => dark ? 'hover:bg-zinc-800 cursor-pointer' : 'hover:bg-zinc-50 cursor-pointer',
  textPrimary:   (dark) => dark ? 'text-zinc-100' : 'text-zinc-900',
  textSecondary: (dark) => dark ? 'text-zinc-400' : 'text-zinc-500',
  input:         (dark) => dark
    ? 'bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-500 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500'
    : 'bg-zinc-50 border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400',
  menuItem:      (dark, active) => active
    ? (dark ? 'bg-zinc-800 text-zinc-100 font-medium' : 'bg-zinc-100 text-zinc-900 font-medium')
    : (dark ? 'text-zinc-300 hover:bg-zinc-800' : 'text-zinc-700 hover:bg-zinc-50'),
  ctaBtn:        (dark) => dark
    ? 'border border-zinc-700 text-zinc-300 hover:bg-zinc-800 rounded-md'
    : 'border border-zinc-300 text-zinc-600 hover:bg-zinc-50 rounded-md',
};

export default function Navbar({ onMenuClick, sidebarPosition = 'left', sidebarDarkMode }) {
  const [showNotifications, setShowNotifications]   = useState(false);
  const [showProfile, setShowProfile]               = useState(false);
  const [showThemeMenu, setShowThemeMenu]           = useState(false);
  const [showLanguageMenu, setShowLanguageMenu]     = useState(false);
  const [showTopSearch, setShowTopSearch]           = useState(false);
  const [showInbox, setShowInbox]                   = useState(false);
  const [showMobileSearch, setShowMobileSearch]     = useState(false);
  const [isSticky, setIsSticky]                     = useState(false);

  const { isDark, toggleDarkMode, currentTheme, changeTheme, themes } = useTheme();
  const { language: currentLanguage, t, setLanguage: changeLanguage } = useLanguage() || {};

  /* use sidebarDarkMode to drive panel colours so sidebar-dark + light-body still looks right */
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

  const notifications = [
    { id: 1, title: t ? t('notification_new_user')    : 'New user registered',             time: '2 min ago',   unread: true  },
    { id: 2, title: t ? t('notification_maintenance') : 'Server maintenance scheduled',     time: '1 hour ago',  unread: true  },
    { id: 3, title: t ? t('notification_backup')      : 'Backup completed successfully',    time: '3 hours ago', unread: false },
  ];

  const inboxMessages = [
    { id: 1, name: 'Michell Flintoff',  message: 'You: Yesterday was great…',    time: 'just now',   unread: true,  avatarSeed: 'Michell', dotColor: 'bg-blue-500'   },
    { id: 2, name: 'Bianca Anderson',   message: 'Nice looking dress you…',       time: '5 mins ago', unread: true,  avatarSeed: 'Bianca',  dotColor: 'bg-blue-500'   },
    { id: 3, name: 'Andrew Johnson',    message: 'Sent a photo',                  time: '10 mins ago',unread: true,  avatarSeed: 'Andrew',  dotColor: 'bg-violet-500' },
    { id: 4, name: 'Jolly Cummins',     message: "If I don't like something",     time: '5 days ago', unread: false, avatarSeed: 'Jolly',   dotColor: 'bg-amber-500'  },
    { id: 5, name: 'Josh Macklow',      message: 'Good night. Catch you…',        time: 'year ago',   unread: false, avatarSeed: 'Josh',    dotColor: 'bg-teal-500'   },
  ];

  const languages = [
    { code: 'en', name: 'English',    flagUrl: 'https://flagcdn.com/w40/us.png' },
    { code: 'es', name: 'Español',    flagUrl: 'https://flagcdn.com/w40/es.png' },
    { code: 'fr', name: 'Français',   flagUrl: 'https://flagcdn.com/w40/fr.png' },
    { code: 'de', name: 'Deutsch',    flagUrl: 'https://flagcdn.com/w40/de.png' },
    { code: 'zh', name: '中文',        flagUrl: 'https://flagcdn.com/w40/cn.png' },
  ];

  const currentLang = languages.find(l => l.code === currentLanguage) || languages[0];
  const unreadInboxCount = inboxMessages.filter(m => m.unread).length;

  /* refs for click-outside */
  const searchRef       = useRef(null);
  const topSearchRef    = useRef(null);
  const themeMenuRef    = useRef(null);
  const languageMenuRef = useRef(null);
  const inboxRef        = useRef(null);
  const notificationsRef= useRef(null);
  const profileRef      = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        sidebarPosition === 'top' ? setShowTopSearch(true) : searchRef.current?.focus();
        setTimeout(() => searchRef.current?.focus(), 0);
      }
      if (e.key === 'Escape') { setShowTopSearch(false); searchRef.current?.blur(); }
    };

    const onOutside = (e) => {
      if (themeMenuRef.current    && !themeMenuRef.current.contains(e.target))    setShowThemeMenu(false);
      if (languageMenuRef.current && !languageMenuRef.current.contains(e.target)) setShowLanguageMenu(false);
      if (topSearchRef.current    && !topSearchRef.current.contains(e.target))    setShowTopSearch(false);
      if (inboxRef.current        && !inboxRef.current.contains(e.target))        setShowInbox(false);
      if (notificationsRef.current&& !notificationsRef.current.contains(e.target))setShowNotifications(false);
      if (profileRef.current      && !profileRef.current.contains(e.target))      setShowProfile(false);
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

  /* ── nav wrapper classes ── */
  const navClasses = [
    Z.nav(dark),
    'border-b transition-colors duration-150',
    isSticky ? 'sticky top-0 z-40' : '',
    sidebarPosition === 'top'
      ? 'flex-1 h-16 px-4 py-3 flex items-center justify-between'
      : 'px-4 py-2 flex items-center justify-between h-16',
  ].join(' ');

  /* ── shared icon button class ── */
  const iconBtn = `p-2 transition-colors duration-150 ${Z.btn(dark)}`;

  return (
    <nav className={navClasses}>

      {/* ══════════════ LEFT ══════════════ */}
      <div className="flex items-center gap-1 sm:gap-3">
        {sidebarPosition !== 'top' ? (
          <>
            {/* Mobile hamburger */}
            <button onClick={onMenuClick} className={`${iconBtn} lg:hidden`} aria-label="Toggle sidebar">
              <Menu size={20} />
            </button>

            {/* ── Search ── */}
            <div className="relative">
              {/* Mobile: icon only */}
              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className={`${iconBtn} md:hidden`}
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {showMobileSearch && (
                <div className="absolute left-0 top-12 w-72 px-0 z-50 md:hidden">
                  <div className="relative">
                    <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${Z.textSecondary(dark)}`} />
                    <input
                      type="text"
                      placeholder={t ? t('search') : 'Search…'}
                      autoFocus
                      className={`w-full pl-9 pr-4 py-2 text-sm border rounded-md outline-none transition-colors ${Z.input(dark)}`}
                    />
                  </div>
                </div>
              )}

              {/* Desktop: full search bar */}
              <div className="hidden md:block relative">
                <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${Z.textSecondary(dark)}`} />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder={t ? t('search') : 'Search…'}
                  className={`pl-9 pr-20 py-2 w-64 text-sm border rounded-md outline-none transition-colors ${Z.input(dark)}`}
                />
                <kbd className={`absolute right-3 top-1/2 -translate-y-1/2 text-[11px] pointer-events-none ${Z.textSecondary(dark)}`}>
                  Ctrl K
                </kbd>
              </div>
            </div>
          </>
        ) : (
          /* top-sidebar: search lives in right section */
          <div />
        )}
      </div>

      {/* ══════════════ RIGHT ══════════════ */}
      <div className={`flex items-center gap-1 sm:gap-2 ${sidebarPosition === 'right' ? 'mr-5' : ''}`}>

        {/* Top-sidebar search */}
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
                  placeholder={t ? t('search') : 'Search…'}
                  className={`pl-3 pr-20 py-2 w-48 text-sm border rounded-md outline-none transition-colors ${Z.input(dark)}`}
                  onBlur={() => setTimeout(() => setShowTopSearch(false), 150)}
                />
                <kbd className={`absolute right-3 top-1/2 -translate-y-1/2 text-[11px] pointer-events-none ${Z.textSecondary(dark)}`}>
                  Ctrl K
                </kbd>
              </div>
            )}
          </div>
        )}

        {/* ── Sticky toggle ── */}
        <button onClick={toggleSticky} className={iconBtn} title={isSticky ? 'Disable sticky navbar' : 'Enable sticky navbar'}>
          {isSticky ? <Pin size={18} /> : <PinOff size={18} />}
        </button>

        {/* ── Theme / Dark mode ── */}
        <div className="relative" ref={themeMenuRef}>
          <button onClick={() => setShowThemeMenu(!showThemeMenu)} className={iconBtn} title="Theme settings">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {showThemeMenu && (
            <div className={`absolute right-0 mt-2 w-72 z-50 overflow-hidden ${Z.panel(dark)} max-[426px]:left-1/2 max-[426px]:-translate-x-1/2`}>
              {/* Header */}
              <div className={`px-4 py-3 border-b ${Z.panelHeader(dark)}`}>
                <p className={`text-sm font-semibold ${Z.textPrimary(dark)}`}>
                  {t ? t('themeColors') : 'Global Theme Settings'}
                </p>
                <p className={`text-xs mt-0.5 ${Z.textSecondary(dark)}`}>Applies to entire application</p>
              </div>

              {/* Dark mode toggle row */}
              <div className={`px-4 py-3 border-b ${Z.panelHeader(dark)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isDark ? <Moon size={15} className={Z.textSecondary(dark)} /> : <Sun size={15} className={Z.textSecondary(dark)} />}
                    <div>
                      <p className={`text-sm font-medium ${Z.textPrimary(dark)}`}>{t ? t('darkMode') : 'Dark mode'}</p>
                      <p className={`text-xs ${Z.textSecondary(dark)}`}>{isDark ? 'On' : 'Off'}</p>
                    </div>
                  </div>
                  {/* Toggle pill */}
                  <button
                    onClick={toggleDarkMode}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      isDark ? `bg-${currentTheme}-600` : 'bg-zinc-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>

              {/* Colour swatches */}
              <div className="p-4">
                <p className={`text-xs font-medium uppercase tracking-wide mb-3 ${Z.textSecondary(dark)}`}>
                  {t ? t('themeColors') : 'Accent colour'}
                </p>
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
                        {active && (
                          <span className={`ml-auto text-xs text-${theme.primary}-600`}>
                            {t ? t('active') : 'Active'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Language ── */}
        <div className="relative" ref={languageMenuRef}>
          <button
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className={`p-2 rounded-md flex items-center justify-center transition-colors duration-150 ${
              dark ? 'hover:bg-zinc-800 border border-zinc-700' : 'hover:bg-zinc-100'
            } w-9 h-9`}
            title={t ? t('language') : 'Change language'}
          >
            <img src={currentLang.flagUrl} alt={currentLang.name} className="w-6 h-4 rounded-sm object-cover" />
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
                    <img src={lang.flagUrl} alt={lang.name} className="w-5 h-4 rounded-sm object-cover flex-shrink-0" />
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
              {/* Panel header */}
              <div className={`px-4 py-3 border-b ${Z.panelHeader(dark)} flex items-center justify-between flex-shrink-0`}>
                <h3 className={`text-sm font-semibold ${Z.textPrimary(dark)}`}>Inbox</h3>
                {unreadInboxCount > 0 && (
                  <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
                    {unreadInboxCount} new
                  </span>
                )}
              </div>

              {/* Messages list */}
              <div className={`divide-y ${Z.panelDivide(dark)} overflow-y-auto flex-1`}>
                {inboxMessages.map((msg) => (
                  <div key={msg.id} className={`px-4 py-3 transition-colors ${Z.panelRow(dark)}`}>
                    <div className="flex items-start gap-3">
                      <div className="relative flex-shrink-0">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.avatarSeed}`}
                          alt={msg.name}
                          className="w-9 h-9 rounded-full"
                        />
                        {msg.unread && (
                          <span className={`absolute top-0 right-0 w-2.5 h-2.5 ${msg.dotColor} rounded-full border-2 ${dark ? 'border-zinc-900' : 'border-white'}`} />
                        )}
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

              {/* Footer CTA */}
              <div className={`p-3 border-t ${Z.panelHeader(dark)} flex-shrink-0`}>
                <button className={`w-full py-1.5 text-sm font-medium transition-colors ${Z.ctaBtn(dark)}`}>
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
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] rounded-full flex items-center justify-center font-semibold">
              5
            </span>
          </button>

          {showNotifications && (
            <div className={`absolute right-0 mt-2 w-80 z-50 max-h-[500px] overflow-hidden flex flex-col ${Z.panel(dark)} max-[425px]:left-1/2 max-[425px]:-translate-x-[77.5%]`}>
              <div className={`px-4 py-3 border-b ${Z.panelHeader(dark)} flex items-center justify-between flex-shrink-0`}>
                <h3 className={`text-sm font-semibold ${Z.textPrimary(dark)}`}>Notifications</h3>
                <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">5 new</span>
              </div>

              <div className={`divide-y ${Z.panelDivide(dark)} overflow-y-auto flex-1`}>
                {notifications.map((n) => (
                  <div key={n.id} className={`px-4 py-3 transition-colors ${Z.panelRow(dark)}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        n.unread ? 'bg-rose-500' : (dark ? 'bg-zinc-800' : 'bg-zinc-100')
                      }`}>
                        <Bell size={14} className={n.unread ? 'text-white' : Z.textSecondary(dark)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-medium leading-snug ${Z.textPrimary(dark)}`}>{n.title}</p>
                          <span className={`text-xs flex-shrink-0 ${Z.textSecondary(dark)}`}>{n.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`p-3 border-t ${Z.panelHeader(dark)} flex-shrink-0`}>
                <button className={`w-full py-1.5 text-sm font-medium transition-colors ${Z.ctaBtn(dark)}`}>
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
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jonathan"
              alt="Jonathan Deo"
              className="w-8 h-8 rounded-full"
            />
          </button>

          {showProfile && (
            <div className={`absolute right-0 mt-2 w-72 z-50 overflow-hidden ${Z.panel(dark)} max-[425px]:left-1/2 max-[425px]:-translate-x-[90%]`}>
              {/* Profile header */}
              <div className={`px-5 py-4 border-b ${Z.panelHeader(dark)}`}>
                <div className="flex items-center gap-3">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jonathan"
                    alt="Jonathan Deo"
                    className="w-12 h-12 rounded-full flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold ${Z.textPrimary(dark)}`}>Jonathan Deo</p>
                    <p className={`text-xs ${Z.textSecondary(dark)}`}>Admin</p>
                    <p className={`text-xs mt-0.5 flex items-center gap-1 ${Z.textSecondary(dark)}`}>
                      <Mail size={11} />
                      info@materialam.com
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-1">
                {[
                  { icon: User,        label: 'My Profile', sub: 'Account settings',   bg: dark ? 'bg-blue-950/40'    : 'bg-blue-50',   ic: 'text-blue-500'   },
                  { icon: FileText,    label: 'My Notes',   sub: 'My Daily Notes',      bg: dark ? 'bg-teal-950/40'   : 'bg-teal-50',   ic: 'text-teal-500'   },
                  { icon: CheckSquare, label: 'My Tasks',   sub: 'To-do and daily tasks',bg: dark ? 'bg-violet-950/40': 'bg-violet-50', ic: 'text-violet-500' },
                ].map(({ icon: Icon, label, sub, bg, ic }) => (
                  <button
                    key={label}
                    className={`flex items-center w-full px-5 py-2.5 text-sm transition-colors ${Z.panelRow(dark)}`}
                  >
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center mr-3 flex-shrink-0 ${bg}`}>
                      <Icon size={15} className={ic} />
                    </div>
                    <div className="text-left">
                      <p className={`text-sm font-medium ${Z.textPrimary(dark)}`}>{label}</p>
                      <p className={`text-xs ${Z.textSecondary(dark)}`}>{sub}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Logout */}
              <div className={`p-4 border-t ${Z.panelHeader(dark)}`}>
                <button className={`w-full flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  dark
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                }`}>
                  <LogOut size={15} />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}