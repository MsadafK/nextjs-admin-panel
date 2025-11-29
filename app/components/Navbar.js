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
  PinOff
} from 'lucide-react';
import { useTheme } from '@/app/contexts/ThemeContext';
import { useLanguage } from '@/app/contexts/LanguageContext';

export default function Navbar({ onMenuClick, sidebarPosition = 'left', sidebarDarkMode }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showTopSearch, setShowTopSearch] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  // GLOBAL dark mode - affects entire application
  const { isDark, toggleDarkMode, currentTheme, changeTheme, themes } = useTheme();
  const { language: currentLanguage, t, setLanguage: changeLanguage } = useLanguage() || {};

  useEffect(() => {
    const savedSticky = localStorage.getItem('navbarSticky') === 'true';
    setIsSticky(savedSticky);
  }, []);

  const toggleSticky = () => {
    const newValue = !isSticky;
    setIsSticky(newValue);
    localStorage.setItem('navbarSticky', newValue.toString());
  };

  const notifications = [
    { id: 1, title: t ? t('notification_new_user') : 'New user registered', time: '2 min ago', unread: true },
    { id: 2, title: t ? t('notification_maintenance') : 'Server maintenance scheduled', time: '1 hour ago', unread: true },
    { id: 3, title: t ? t('notification_backup') : 'Backup completed successfully', time: '3 hours ago', unread: false },
  ];

  const inboxMessages = [
    { 
      id: 1, 
      name: 'Michell Flintoff', 
      message: 'You: Yesterdy was great...', 
      time: 'just now', 
      unread: true,
      avatarSeed: 'Michell',
      dotColor: 'bg-blue-500'
    },
    { 
      id: 2, 
      name: 'Bianca Anderson', 
      message: 'Nice looking dress you...', 
      time: '5 mins ago', 
      unread: true,
      avatarSeed: 'Bianca',
      dotColor: 'bg-blue-500'
    },
    { 
      id: 3, 
      name: 'Andrew Johnson', 
      message: 'Sent a photo', 
      time: '10 mins ago', 
      unread: true,
      avatarSeed: 'Andrew',
      dotColor: 'bg-purple-500'
    },
    { 
      id: 4, 
      name: 'Jolly Cummins',
      message: 'If I don\'t like something', 
      time: '5 days ago', 
      unread: false,
      avatarSeed: 'Jolly',
      dotColor: 'bg-yellow-500'
    },
    { 
      id: 5, 
      name: 'Josh Macklow', 
      message: 'Good night. Catch you...', 
      time: 'year ago', 
      unread: false,
      avatarSeed: 'Josh',
      dotColor: 'bg-teal-500'
    }
  ];

  const languages = [
    { code: 'en', name: 'English', flagUrl: 'https://flagcdn.com/w40/us.png' },
    { code: 'es', name: 'Español', flagUrl: 'https://flagcdn.com/w40/es.png' },
    { code: 'fr', name: 'Français', flagUrl: 'https://flagcdn.com/w40/fr.png' },
    { code: 'de', name: 'Deutsch', flagUrl: 'https://flagcdn.com/w40/de.png' },
    { code: 'zh', name: '中文', flagUrl: 'https://flagcdn.com/w40/cn.png' }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];
  const searchRef = useRef(null);
  const topSearchRef = useRef(null);
  const themeMenuRef = useRef(null);
  const languageMenuRef = useRef(null);
  const inboxRef = useRef(null);
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        if (sidebarPosition === 'top') {
          setShowTopSearch(true);
          setTimeout(() => searchRef.current?.focus(), 0);
        } else {
          searchRef.current?.focus();
        }
      }
      if (event.key === 'Escape') {
        setShowTopSearch(false);
        searchRef.current?.blur();
      }
    };

    const handleClickOutside = (event) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target)) {
        setShowThemeMenu(false);
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setShowLanguageMenu(false);
      }
      if (topSearchRef.current && !topSearchRef.current.contains(event.target)) {
        setShowTopSearch(false);
      }
      if (inboxRef.current && !inboxRef.current.contains(event.target)) {
        setShowInbox(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarPosition]);

  const handleLanguageChange = (langCode) => {
    if (changeLanguage) {
      changeLanguage(langCode);
      setShowLanguageMenu(false);
    }
  };

  const getNavbarClasses = () => {
    const baseClasses = `${sidebarDarkMode ? 'bg-gray-900 border-white-600' : 'bg-white border-gray-200'} border-b shadow-sm`;
    const stickyClass = isSticky ? 'sticky top-0 z-40' : '';
    
    if (sidebarPosition === 'top') {
      return `${baseClasses} ${stickyClass} flex-1 h-16 px-4 py-3 flex items-center justify-between`;
    }
    return `${baseClasses} ${stickyClass} px-4 py-2 flex items-center justify-between`;
  };

  const unreadInboxCount = inboxMessages.filter(msg => msg.unread).length;

  return (
    <nav className={getNavbarClasses()}>
      {/* Left Section */}
      <div className="flex items-center space-x-1 sm:space-x-4">
        {sidebarPosition !== 'top' ? (
          <>
            <button
              onClick={onMenuClick}
              className={`p-1 sm:p-2 rounded-lg ${sidebarDarkMode ? 'hover:bg-gray-800 text-gray-200' : 'hover:bg-gray-100 text-gray-600'} transition-colors lg:hidden`}
            >
              <Menu size={20} />
            </button>

            {/* Search Section */}
            <div className="relative">
              {/* Mobile Search Icon (shows below 768px) */}
              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className={`p-1 sm:p-2 rounded-lg md:hidden ${
                  sidebarDarkMode ? 'hover:bg-gray-800 text-gray-200' : 'hover:bg-gray-100 text-gray-600'
                } transition-colors`}
              >
                <Search size={20} />
              </button>

              {/* Mobile Search Dropdown */}
              {showMobileSearch && (
                <div className="absolute left-0 top-12 w-screen max-w-[280px] px-4 z-50 md:hidden">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={t ? t('search') : "Search..."}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                        sidebarDarkMode 
                          ? 'bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      autoFocus
                    />
                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      sidebarDarkMode ? 'text-gray-300' : 'text-gray-400'
                    }`} size={20} />
                  </div>
                </div>
              )}

              {/* Desktop Search Input (shows at and above 768px) */}
              <div className="hidden md:block">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  sidebarDarkMode ? 'text-gray-300' : 'text-gray-400'
                }`} size={20} />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder={t ? t('search') : "Search..."}
                  className={`pl-10 pr-20 py-2 w-64 border rounded-lg ${
                    sidebarDarkMode 
                      ? 'bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <span className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-xs ${
                  sidebarDarkMode ? 'text-gray-400' : 'text-gray-500'
                } pointer-events-none`}>
                  Ctrl + K
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center space-x-2">
            {/* Empty div to maintain layout when sidebar is in top position */}
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className={`flex items-center space-x-1 sm:space-x-4 ${sidebarPosition === 'right' ? 'mr-5' : ''}`}>
        {/* Search bar when sidebar is in top position */}
        {sidebarPosition === 'top' && (
          <div className="relative flex items-center" ref={topSearchRef}>
            <button
              onClick={() => {
                setShowTopSearch(prev => !prev);
                setTimeout(() => searchRef.current?.focus(), 0);
              }}
              className={`p-2 rounded-lg flex items-center ${
                sidebarDarkMode ? 'hover:bg-gray-800 text-gray-200' : 'hover:bg-gray-100 text-gray-600'
              } transition-colors`}
              aria-label="Open search"
            >
              <Search size={20} />
            </button>
            {showTopSearch && (
              <div className="relative ml-2">
                <input
                  ref={searchRef}
                  type="text"
                  placeholder={t ? t('search') : "Search..."}
                  className={`pl-3 pr-20 py-2 w-48 border rounded-lg focus:ring-2 focus:ring-${currentTheme}-500 focus:border-transparent transition-all ${
                    sidebarDarkMode 
                      ? 'bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  onBlur={() => {
                    setTimeout(() => setShowTopSearch(false), 150);
                  }}
                />
                <span className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-xs ${sidebarDarkMode ? 'text-gray-300' : 'text-gray-500'} pointer-events-none`}>Ctrl + K</span>
              </div>
            )}
          </div>
        )}

        {/* Sticky Toggle Button */}
        <button
          onClick={toggleSticky}
          className={`p-1 sm:p-2 rounded-lg ${sidebarDarkMode ? 'hover:bg-gray-800 text-gray-200 border border-gray-600' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
          title={isSticky ? "Disable Sticky Navbar" : "Enable Sticky Navbar"}
        >
          {isSticky ? <Pin size={20} /> : <PinOff size={20} />}
        </button>

        {/* GLOBAL Theme Toggle - Affects entire app */}
        <div className="relative" ref={themeMenuRef}>
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className={`p-1 sm:p-2 rounded-lg ${sidebarDarkMode ? 'hover:bg-gray-800 text-gray-200 border border-gray-600' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
            title="Global Theme Settings (Entire App)"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {showThemeMenu && (
            <div className={`absolute right-0 mt-2 w-72 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-xl border z-50 max-[426px]:left-1/2 max-[426px]:-translate-x-[50%]`}>
              <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {t ? t('themeColors') : 'Global Theme Settings'}
                </h3>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                  Applies to entire application
                </p>
              </div>

              <div className={`px-4 py-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {isDark ? <Moon size={16} /> : <Sun size={16} />}
                    <div>
                      <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {t ? t('darkMode') : 'Global Dark Mode'}
                      </span>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {isDark ? 'Dark theme for entire app' : 'Light theme for entire app'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={toggleDarkMode}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      isDark ? `bg-${currentTheme}-600 focus:ring-${currentTheme}-500` : 'bg-gray-200 focus:ring-gray-400'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h4 className={`text-sm font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {t ? t('themeColors') : 'Theme Colors'}
                </h4>
                <div className="space-y-2">
                  {Object.keys(themes).map((themeKey) => {
                    const theme = themes[themeKey];
                    return (
                      <button
                        key={themeKey}
                        onClick={() => changeTheme(themeKey)}
                        className={`flex items-center w-full px-3 py-2 rounded-md text-sm transition-colors ${
                          currentTheme === themeKey
                            ? `${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} font-medium`
                            : `${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full mr-3 shadow-sm bg-${theme.primary}-600`}></div>
                        {theme.name}
                        {currentTheme === themeKey && (
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

        {/* Language Selector */}
        <div className="relative" ref={languageMenuRef}>
          <button
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className={`p-1 sm:p-2 rounded-lg flex items-center justify-center ${
              sidebarDarkMode ? 'hover:bg-gray-800 text-gray-200 border border-gray-600' : 'hover:bg-gray-100 text-gray-700'
            } transition-colors w-8 sm:w-10 h-8 sm:h-10`}
            title={t ? t('language') : "Change language"}
          >
            <img 
              src={currentLang.flagUrl} 
              alt={currentLang.name}
              className="w-8 h-4 rounded object-cover"
            />
          </button>

          {showLanguageMenu && (
            <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 z-50 ${
              isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            } max-[425px]:right-auto max-[425px]:left-1/2 max-[425px]:-translate-x-1/2`}>
              <div className="px-2 py-1">
                <p className={`text-xs font-medium px-2 py-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {t ? t('language') : 'Select Language'}
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-2 ${
                    currentLanguage === lang.code
                      ? `${isDark ? 'bg-gray-700' : 'bg-gray-100'} text-${currentTheme}-600`
                      : `${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`
                  }`}
                >
                  <img 
                    src={lang.flagUrl} 
                    alt={lang.name}
                    className="w-5 h-5 rounded object-cover"
                  />
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Inbox */}
        <div className="relative" ref={inboxRef}>
          <button
            onClick={() => setShowInbox(!showInbox)}
            className={`p-1 sm:p-2 rounded-lg ${sidebarDarkMode ? 'hover:bg-gray-800 text-gray-200 border border-gray-600' : 'hover:bg-gray-100 text-gray-600'} transition-colors relative`}
          >
            <Mail size={20} />
            {unreadInboxCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                {unreadInboxCount}
              </span>
            )}
          </button>

          {showInbox && (
            <div className={`absolute right-0 mt-2 w-80 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-lg border z-50 max-h-[500px] overflow-hidden flex flex-col max-[425px]:left-1/2 max-[425px]:-translate-x-[67.5%]`}>
              <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Inbox
                </h3>
                {unreadInboxCount > 0 && (
                  <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    {unreadInboxCount} new
                  </span>
                )}
              </div>
              <div className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'} overflow-y-auto flex-1`}>
                {inboxMessages.map((message) => (
                  <div 
                    key={message.id}
                    className={`p-4 transition-colors cursor-pointer ${
                      isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm">
                          <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${message.avatarSeed}`}
                            alt={message.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {message.unread && (
                          <div className={`absolute top-0 right-0 w-3 h-3 ${message.dotColor} rounded-full border-2 ${isDark ? 'border-gray-800' : 'border-white'}`}></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'} truncate`}>
                            {message.name}
                          </p>
                          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} ml-2 flex-shrink-0`}>
                            {message.time}
                          </span>
                        </div>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} truncate mt-1`}>
                          {message.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className={`p-3 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <button className={`w-full py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                  isDark 
                    ? 'border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white' 
                    : 'border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white'
                }`}>
                  See All Messages
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-1 sm:p-2 rounded-lg ${sidebarDarkMode ? 'hover:bg-gray-800 text-gray-200 border border-gray-600' : 'hover:bg-gray-100 text-gray-600'} transition-colors relative`}
          >
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">5</span>
          </button>

          {showNotifications && (
            <div className={`absolute right-0 mt-2 w-80 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-lg border z-50 max-h-[500px] overflow-hidden flex flex-col max-[425px]:left-1/2 max-[425px]:-translate-x-[77.5%]`}>
              <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Notifications
                </h3>
                <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                  5 new
                </span>
              </div>
              <div className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'} overflow-y-auto flex-1`}>
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-4 transition-colors cursor-pointer ${
                      isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          notification.unread 
                            ? 'bg-gradient-to-br from-pink-400 to-pink-600' 
                            : (isDark ? 'bg-gray-700' : 'bg-gray-100')
                        }`}>
                          <Bell size={18} className={notification.unread ? 'text-white' : 'text-gray-400'} />
                        </div>
                        {notification.unread && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {notification.title}
                          </p>
                          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} ml-2 flex-shrink-0`}>
                            {notification.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className={`p-3 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <button className={`w-full py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                  isDark 
                    ? 'border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white' 
                    : 'border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white'
                }`}>
                  See All Notifications
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="p-0 rounded-full transition-all hover:ring-4 hover:ring-blue-100 dark:hover:ring-blue-900/30"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jonathan"
                alt="Jonathan Deo"
                className="w-full h-full object-cover"
              />
            </div>
          </button>

          {showProfile && (
            <div className={`absolute right-0 mt-2 w-80 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-xl border z-50  max-[425px]:left-1/2 max-[425px]:-translate-x-[90%]`}>
              <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg">
                    <img 
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jonathan"
                      alt="Jonathan Deo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Jonathan Deo
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Admin
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} flex items-center mt-1`}>
                      <Mail size={12} className="mr-1" />
                      info@Materialam.com
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="py-2">
                <button className={`flex items-center w-full px-6 py-3 text-sm ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} transition-colors`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${isDark ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                    <User size={18} className="text-blue-500" />
                  </div>
                  <div className="text-left">
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>My Profile</p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Account settings</p>
                  </div>
                </button>
                
                <button className={`flex items-center w-full px-6 py-3 text-sm ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} transition-colors`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${isDark ? 'bg-teal-900/30' : 'bg-teal-50'}`}>
                    <FileText size={18} className="text-teal-500" />
                  </div>
                  <div className="text-left">
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>My Notes</p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>My Daily Notes</p>
                  </div>
                </button>
                
                <button className={`flex items-center w-full px-6 py-3 text-sm ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} transition-colors`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${isDark ? 'bg-pink-900/30' : 'bg-pink-50'}`}>
                    <CheckSquare size={18} className="text-pink-500" />
                  </div>
                  <div className="text-left">
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>My Tasks</p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>To-do and Daily tasks</p>
                  </div>
                </button>
              </div>
              
              <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center space-x-2">
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}