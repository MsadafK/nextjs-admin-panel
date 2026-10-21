'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Settings, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Shield } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { menuItems } from './MenuItems';

export default function Sidebar({ isCollapsed, onToggle, position = 'left', onPositionChange, isDarkMode = false }) {
  const router = useRouter();
  const pathname = usePathname();
  const [activePath, setActivePath] = useState(['dashboard']);
  const [showPositionMenu, setShowPositionMenu] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [hoveredItem, setHoveredItem] = useState(null);
  const hoverTimeout = useRef(null);
  const hoverMenuRef = useRef(null);
  const positionMenuRef = useRef(null);
  const [userName] = useState('John Doe');
  const [userEmail] = useState('john@nexstore.com');
  const [windowWidth, setWindowWidth] = useState(1024);
  const { t } = useLanguage() || {};

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const translateText = (text) => {
    if (!text) return '';
    return t ? t(text) : text.replace(/_/g, ' ');
  };

  const ICON_SIZE = 20;

  const findPathByHref = (targetHref, items = menuItems, currentPath = []) => {
    for (const item of items) {
      const newPath = [...currentPath, item.label];
      if (item.href === targetHref && !item.subItems && !item.childItems) {
        return newPath;
      }
      if (item.subItems) {
        const subPath = findPathByHref(targetHref, item.subItems, newPath);
        if (subPath) return subPath;
      }
      if (item.childItems) {
        const childPath = findPathByHref(targetHref, item.childItems, newPath);
        if (childPath) return childPath;
      }
    }
    return null;
  };

  const findPathToItem = (targetLabel, items = menuItems, currentPath = []) => {
    for (const item of items) {
      const newPath = [...currentPath, item.label];
      if (item.label === targetLabel) return newPath;
      if (item.subItems) {
        const subPath = findPathToItem(targetLabel, item.subItems, newPath);
        if (subPath) return subPath;
      }
      if (item.childItems) {
        const childPath = findPathToItem(targetLabel, item.childItems, newPath);
        if (childPath) return childPath;
      }
    }
    return null;
  };

  // Automatically sync activePath & expandedMenus with Next.js pathname
  useEffect(() => {
    if (!pathname) return;
    const matchedPath = findPathByHref(pathname);
    if (matchedPath) {
      setActivePath(matchedPath);
      localStorage.setItem('sidebarActivePath', JSON.stringify(matchedPath));

      const newExpanded = {};
      for (let i = 0; i < matchedPath.length - 1; i++) {
        newExpanded[matchedPath[i]] = true;
      }
      setExpandedMenus(newExpanded);
      localStorage.setItem('sidebarExpandedMenus', JSON.stringify(newExpanded));
    }
  }, [pathname]);

  const isInActivePath = (itemLabel) => activePath.includes(itemLabel);

  const setActiveItem = (itemLabel) => {
    const path = findPathToItem(itemLabel);
    if (path) {
      setActivePath(path);
      localStorage.setItem('sidebarActivePath', JSON.stringify(path));

      const newExpandedMenus = { ...expandedMenus };
      for (let i = 0; i < path.length - 1; i++) {
        newExpandedMenus[path[i]] = true;
      }
      setExpandedMenus(newExpandedMenus);
      localStorage.setItem('sidebarExpandedMenus', JSON.stringify(newExpandedMenus));

      const navigateToItem = (items = menuItems) => {
        for (const item of items) {
          if (item.label === itemLabel) {
            if (item.href && item.href !== '#' && !item.subItems && !item.childItems) {
              router.push(item.href);
              setHoveredItem(null);
            }
            return true;
          }
          if (item.subItems && navigateToItem(item.subItems)) return true;
          if (item.childItems && navigateToItem(item.childItems)) return true;
        }
        return false;
      };
      navigateToItem();
    }
  };

  const handleMenuClick = (item, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (item.subItems) {
      const newExpandedMenus = expandedMenus[item.label] ? {} : { [item.label]: true };
      setExpandedMenus(newExpandedMenus);
      const path = findPathToItem(item.label);
      if (path) {
        setActivePath(path);
        localStorage.setItem('sidebarActivePath', JSON.stringify(path));
      }
      return;
    }

    setExpandedMenus({});
    const path = findPathToItem(item.label);
    if (path) {
      setActivePath(path);
      localStorage.setItem('sidebarActivePath', JSON.stringify(path));
    }

    if (item.href && item.href !== '#') {
      router.push(item.href);
    }
  };

  const handleMouseEnter = (item, event) => {
    if (isCollapsed || position === 'bottom' || position === 'top') {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
      const rect = event.currentTarget.getBoundingClientRect();
      hoverTimeout.current = setTimeout(() => {
        setHoveredItem({ ...item, rect });
      }, 150);
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => {
      setHoveredItem(null);
      if (position === 'top' || position === 'bottom') {
        setExpandedMenus({});
      }
    }, 300);
  };

  const handleHoverMenuMouseEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
  };

  const handleHoverMenuMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setHoveredItem(null);
      if (position === 'top' || position === 'bottom') {
        setExpandedMenus({});
      }
    }, 300);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (hoverMenuRef.current && !hoverMenuRef.current.contains(event.target)) {
        setHoveredItem(null);
      }
      if (positionMenuRef.current && !positionMenuRef.current.contains(event.target)) {
        setShowPositionMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1023px)');
    const handleChange = (e) => {
      if (e.matches && !isCollapsed && (position === 'left' || position === 'right') && typeof onToggle === 'function') {
        onToggle();
      }
    };

    handleChange(mediaQuery);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isCollapsed, onToggle, position]);

  const getContainerClasses = () => {
    let classes = `transition-all duration-300 flex ${
      isDarkMode
        ? 'bg-zinc-900 text-zinc-300 border-zinc-800'
        : 'bg-white text-zinc-600 border-zinc-200'
    }`;

    if (position === 'top') {
      classes += ' h-16 flex-row border-b w-full z-50';
    } else if (position === 'bottom') {
      classes += ' fixed bottom-0 left-0 right-0 h-16 flex-row border-t overflow-hidden z-50';
    } else if (position === 'right') {
      classes += ` fixed right-0 top-0 bottom-0 ${isCollapsed ? 'w-16' : 'w-64'} flex-col border-l z-40`;
    } else {
      classes += ` fixed left-0 top-0 bottom-0 ${isCollapsed ? 'w-16' : 'w-64'} flex-col border-r z-40`;
    }

    return classes;
  };

  const positionOptions = [
    { value: 'left', label: 'Left', icon: <ChevronLeft size={14} /> },
    { value: 'right', label: 'Right', icon: <ChevronRight size={14} /> },
    { value: 'top', label: 'Top', icon: <ChevronUp size={14} /> },
    { value: 'bottom', label: 'Bottom', icon: <ChevronDown size={14} /> },
  ];

  const getHoverMenuPosition = () => {
    if (!hoveredItem?.rect) return {};

    const menuWidth = 250;
    const menuHeight = 400;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left, right, top, bottom;

    if (position === 'left' || position === 'right') {
      if (position === 'right') {
        right = viewportWidth - hoveredItem.rect.left + 8;
        if (right + menuWidth > viewportWidth) {
          left = hoveredItem.rect.left - menuWidth - 8;
        }
      } else {
        left = hoveredItem.rect.right + 8;
        if (left + menuWidth > viewportWidth) {
          right = viewportWidth - hoveredItem.rect.left + 8;
        }
      }
      top = Math.max(8, Math.min(hoveredItem.rect.top, viewportHeight - menuHeight));
    } else {
      left = hoveredItem.rect.left;
      if (left + menuWidth > viewportWidth) {
        left = viewportWidth - menuWidth - 8;
      } else if (left < 8) {
        left = 8;
      }

      if (position === 'top') {
        top = hoveredItem.rect.bottom + 8;
        if (top + menuHeight > viewportHeight) {
          top = hoveredItem.rect.top - menuHeight - 8;
        }
      } else {
        bottom = viewportHeight - hoveredItem.rect.top + 8;
        if (bottom + menuHeight > viewportHeight) {
          top = hoveredItem.rect.bottom + 8;
        } else {
          top = 'auto';
          bottom = viewportHeight - hoveredItem.rect.top + 8;
        }
      }
    }

    return { left, right, top, bottom };
  };

  const renderHoverMenu = () => {
    if (!hoveredItem || (!isCollapsed && position !== 'bottom' && position !== 'top')) return null;

    const menuPosition = getHoverMenuPosition();

    return (
      <div
        ref={hoverMenuRef}
        className={`fixed z-[60] ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'} border rounded-lg shadow-dropdown min-w-[250px] py-2`}
        style={menuPosition}
        onMouseEnter={handleHoverMenuMouseEnter}
        onMouseLeave={handleHoverMenuMouseLeave}
      >
        <div className={`px-3 py-2 border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
          <div className="flex items-center space-x-2">
            <hoveredItem.icon size={16} className={isDarkMode ? 'text-zinc-300' : 'text-zinc-600'} />
            <span className={`font-medium text-sm capitalize ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
              {translateText(hoveredItem.label)}
            </span>
            {hoveredItem.badge && (
              <span className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs px-1.5 py-0.5 rounded-full font-medium">
                {hoveredItem.badge}
              </span>
            )}
          </div>
        </div>

        {hoveredItem.subItems && (
          <div className="py-1">
            {hoveredItem.subItems.map((subItem) => {
              const SubIcon = subItem.icon;
              return (
                <div key={subItem.label} className="relative group/submenu">
                  <button
                    onClick={() => setActiveItem(subItem.label)}
                    className={`w-full flex items-center px-3 py-2 text-sm ${
                      isDarkMode
                        ? 'text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'
                        : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                    } transition-colors`}
                  >
                    <SubIcon size={16} className={`mr-3 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`} />
                    <span className="flex-1 text-left capitalize">
                      {translateText(subItem.label)}
                    </span>
                    {subItem.badge && (
                      <span className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs px-1.5 py-0.5 rounded-full font-medium ml-2">
                        {subItem.badge}
                      </span>
                    )}
                    {subItem.childItems && (
                      position === 'right' || position === 'bottom' ? (
                        <ChevronLeft size={14} className={`ml-2 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`} />
                      ) : (
                        <ChevronRight size={14} className={`ml-2 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`} />
                      )
                    )}
                  </button>

                  {subItem.childItems && (
                    <div
                      className={`absolute ${
                        position === 'right' || position === 'bottom' ? 'right-full mr-1' : 'left-full ml-1'
                      } ${
                        position === 'bottom' ? 'bottom-0' : 'top-0'
                      } ${
                        isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
                      } border rounded-lg shadow-dropdown min-w-[200px] py-2 opacity-0 invisible group-hover/submenu:opacity-100 group-hover/submenu:visible transition-all duration-200 z-[70]`}
                    >
                      <div className={`px-3 py-2 border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'} mb-1`}>
                        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                          {translateText(subItem.label)}
                        </span>
                      </div>
                      {subItem.childItems.map((childItem) => {
                        const ChildIcon = childItem.icon;
                        return (
                          <button
                            key={childItem.label}
                            onClick={() => setActiveItem(childItem.label)}
                            className={`w-full flex items-center px-3 py-2 text-sm ${
                              isDarkMode
                                ? 'text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'
                                : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                            } transition-colors`}
                          >
                            <ChildIcon size={14} className={`mr-3 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`} />
                            <span className="text-left capitalize">
                              {translateText(childItem.label)}
                            </span>
                            {childItem.badge && (
                              <span className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs px-1.5 py-0.5 rounded-full font-medium ml-2">
                                {childItem.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const ToggleIcon = isCollapsed
    ? (position === 'right' ? ChevronLeft : ChevronRight)
    : (position === 'right' ? ChevronRight : ChevronLeft);

  return (
    <>
      <div className={getContainerClasses()}>
        <div
          className={`p-3.5 ${position === 'bottom' || position === 'top' ? 'border-r' : 'border-b'} ${
            isDarkMode ? 'border-zinc-800' : 'border-zinc-200'
          } flex items-center justify-between ${
            position === 'bottom' || position === 'top' ? 'flex-shrink-0' : ''
          } ${position === 'right' ? 'flex-row-reverse' : ''}`}
        >
          {!isCollapsed && (
            <div
              onClick={() => router.push('/')}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <div className="w-8 h-8 bg-zinc-900 dark:bg-zinc-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white dark:text-zinc-900" />
              </div>
              <h1 className={`text-xl font-semibold tracking-tight ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                {translateText('app_name')}
              </h1>
            </div>
          )}

          {windowWidth > 768 && (
            <div className="flex items-center space-x-1">
              <div className="relative" ref={positionMenuRef}>
                <button
                  onClick={() => setShowPositionMenu(!showPositionMenu)}
                  disabled={windowWidth < 1279}
                  className={`p-2 rounded-md ${
                    windowWidth < 1280
                      ? 'opacity-40 cursor-not-allowed'
                      : isDarkMode
                      ? 'hover:bg-zinc-800 text-zinc-400'
                      : 'hover:bg-zinc-100 text-zinc-500'
                  } transition-colors`}
                  title="Change sidebar position"
                >
                  <Settings size={ICON_SIZE} />
                </button>

                {showPositionMenu && (
                  <div
                    className={`absolute ${
                      position === 'right' ? 'right-0' : 'left-0'
                    } mt-2 w-36 rounded-lg border shadow-dropdown py-1 z-[70] ${
                      isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
                    }`}
                  >
                    {positionOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          if (onPositionChange) onPositionChange(opt.value);
                          setShowPositionMenu(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium transition-colors ${
                          position === opt.value
                            ? isDarkMode
                              ? 'bg-zinc-800 text-zinc-100'
                              : 'bg-zinc-100 text-zinc-900'
                            : isDarkMode
                            ? 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                            : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {opt.icon}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={onToggle}
                disabled={windowWidth < 1279}
                className={`p-2 rounded-md ${
                  windowWidth < 1280
                    ? 'opacity-40 cursor-not-allowed'
                    : isDarkMode
                    ? 'hover:bg-zinc-800 text-zinc-400'
                    : 'hover:bg-zinc-100 text-zinc-500'
                } transition-colors`}
              >
                <ToggleIcon size={ICON_SIZE} />
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav
          className={`flex-1 px-3 md:px-4 py-3 ${
            position === 'bottom' || position === 'top'
              ? 'overflow-x-auto overflow-y-hidden'
              : 'overflow-y-auto'
          } sidebar-scroll`}
        >
          <ul
            className={`${
              position === 'bottom' || position === 'top'
                ? 'flex space-x-2 items-center whitespace-nowrap pr-12 min-w-max'
                : 'space-y-1'
            }`}
          >
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePath[activePath.length - 1] === item.label;
              const isInPath = isInActivePath(item.label);
              const isExpanded = expandedMenus[item.label];
              const translatedLabel = translateText(item.label);
              const activeBorder =
                position === 'left'
                  ? 'border-r-2'
                  : position === 'right'
                  ? 'border-l-2'
                  : position === 'top'
                  ? 'border-b-2'
                  : 'border-t-2';

              return (
                <li
                  key={item.label}
                  className={`relative ${
                    isCollapsed && (position === 'left' || position === 'right') ? 'mb-2' : ''
                  }`}
                >
                  <button
                    onClick={(e) => handleMenuClick(item, e)}
                    onMouseEnter={(e) => handleMouseEnter(item, e)}
                    onMouseLeave={handleMouseLeave}
                    className={`${
                      position === 'bottom' || position === 'top' ? 'flex-shrink-0 h-10' : 'w-full'
                    } flex items-center ${
                      isCollapsed && (position === 'left' || position === 'right')
                        ? 'justify-center py-3 px-0 h-12'
                        : isCollapsed
                        ? 'justify-center px-3'
                        : 'px-3'
                    } rounded-lg transition-colors group ${
                      isActive
                        ? `${isDarkMode ? 'bg-zinc-800 text-zinc-50' : 'bg-zinc-900 text-zinc-50'} ${activeBorder}`
                        : isInPath
                        ? `${isDarkMode ? 'bg-zinc-800/60 text-zinc-300' : 'bg-zinc-100 text-zinc-700'} ${activeBorder}`
                        : `\${
                            isDarkMode
                              ? 'text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'
                              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                          }`
                    }`}
                  >
                    <Icon
                      size={ICON_SIZE}
                      strokeWidth={2}
                      className={`flex-shrink-0 ${isCollapsed ? 'mx-auto' : 'mr-3'} ${
                        isActive
                          ? 'text-zinc-50'
                          : isInPath
                          ? isDarkMode
                            ? 'text-zinc-200'
                            : 'text-zinc-700'
                          : isDarkMode
                          ? 'text-zinc-400 group-hover:text-zinc-100'
                          : 'text-zinc-400 group-hover:text-zinc-700'
                      }`}
                    />
                    {!isCollapsed && (
                      <div className="flex items-center justify-between w-full h-10">
                        <span className="font-medium capitalize">{translatedLabel}</span>
                        <div className="flex items-center space-x-2">
                          {item.badge && (
                            <span className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs px-1.5 py-0.5 rounded-full font-medium">
                              {item.badge}
                            </span>
                          )}
                          {item.subItems && position !== 'bottom' && position !== 'top' && (
                            <ChevronDown
                              size={16}
                              className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </button>

                  {item.subItems && !isCollapsed && isExpanded && (position === 'left' || position === 'right') && (
                    <div className="relative ml-6 mt-1">
                      <div className={`absolute left-4 top-0 bottom-0 w-px ${isDarkMode ? 'bg-zinc-700' : 'bg-zinc-200'}`} />
                      <ul className="space-y-1">
                        {item.subItems.map((subItem, subIndex) => {
                          const SubIcon = subItem.icon;
                          const subTranslatedLabel = translateText(subItem.label);
                          const isSubActive = activePath[activePath.length - 1] === subItem.label;
                          const isSubInPath = isInActivePath(subItem.label);
                          const isSubExpanded = expandedMenus[subItem.label];
                          const isLastSubItem = subIndex === item.subItems.length - 1;

                          return (
                            <li key={subItem.label} className="relative">
                              <div
                                className={`absolute left-4 top-3 w-2 h-2 rounded-full transform -translate-x-1/2 z-10 ${
                                  isSubActive
                                    ? isDarkMode
                                      ? 'bg-zinc-200'
                                      : 'bg-zinc-900'
                                    : isSubInPath
                                    ? 'bg-zinc-500'
                                    : isDarkMode
                                    ? 'bg-zinc-600'
                                    : 'bg-zinc-300'
                                } ${isSubActive || isSubInPath ? 'ring-2 ring-white dark:ring-zinc-900' : ''}`}
                              />

                              {isLastSubItem && (
                                <div className={`absolute left-4 top-5 bottom-0 w-px ${isDarkMode ? 'bg-zinc-900' : 'bg-white'} z-5`} />
                              )}

                              <button
                                onClick={() => {
                                  setActiveItem(subItem.label);
                                  if (subItem.childItems) {
                                    setExpandedMenus((prev) => ({
                                      ...prev,
                                      [subItem.label]: !prev[subItem.label],
                                    }));
                                  }
                                }}
                                className={`w-full flex items-center pl-8 pr-3 py-2 rounded-lg text-sm transition-colors group ${
                                  isSubActive
                                    ? `${isDarkMode ? 'bg-zinc-800 text-zinc-50' : 'bg-zinc-900 text-zinc-50'} ${activeBorder}`
                                    : isSubInPath
                                    ? `${isDarkMode ? 'bg-zinc-800/60 text-zinc-300' : 'bg-zinc-100 text-zinc-700'} ${activeBorder}`
                                    : `\${
                                        isDarkMode
                                          ? 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
                                          : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700'
                                      }`
                                }`}
                              >
                                <SubIcon
                                  size={16}
                                  className={`mr-3 ${
                                    isSubActive
                                      ? 'text-zinc-50'
                                      : isSubInPath
                                      ? isDarkMode
                                        ? 'text-zinc-200'
                                        : 'text-zinc-700'
                                      : 'text-zinc-400 group-hover:text-zinc-500'
                                  }`}
                                />
                                <div className="flex items-center justify-between w-full">
                                  <span className="capitalize">{subTranslatedLabel}</span>
                                  <div className="flex items-center space-x-2">
                                    {subItem.badge && (
                                      <span className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs px-1.5 py-0.5 rounded-full font-medium">
                                        {subItem.badge}
                                      </span>
                                    )}
                                    {subItem.childItems && (
                                      <ChevronDown
                                        size={14}
                                        className={`transition-transform ${isSubExpanded ? 'rotate-180' : ''}`}
                                      />
                                    )}
                                  </div>
                                </div>
                              </button>

                              {subItem.childItems && isSubExpanded && (
                                <div className="relative ml-6 mt-1">
                                  <div className={`absolute left-4 top-0 bottom-0 w-px ${isDarkMode ? 'bg-zinc-700' : 'bg-zinc-300'}`} />
                                  <ul className="space-y-1">
                                    {subItem.childItems.map((childItem, childIndex) => {
                                      const ChildIcon = childItem.icon;
                                      const childTranslatedLabel = translateText(childItem.label);
                                      const isChildActive = activePath[activePath.length - 1] === childItem.label;
                                      const isLastChildItem = childIndex === subItem.childItems.length - 1;

                                      return (
                                        <li key={childItem.label} className="relative">
                                          <div
                                            className={`absolute left-4 top-3 w-1.5 h-1.5 rounded-full transform -translate-x-1/2 z-10 ${
                                              isChildActive
                                                ? isDarkMode
                                                  ? 'bg-zinc-200'
                                                  : 'bg-zinc-900'
                                                : isDarkMode
                                                ? 'bg-zinc-500'
                                                : 'bg-zinc-400'
                                            } ${isChildActive ? 'ring-2 ring-white dark:ring-zinc-900 scale-125' : ''}`}
                                          />

                                          {isLastChildItem && (
                                            <div className={`absolute left-4 top-4 bottom-0 w-px ${isDarkMode ? 'bg-zinc-900' : 'bg-white'} z-5`} />
                                          )}

                                          <button
                                            onClick={() => setActiveItem(childItem.label)}
                                            className={`w-full flex items-center pl-8 pr-3 py-2 rounded-lg text-sm transition-colors group ${
                                              isChildActive
                                                ? `${isDarkMode ? 'bg-zinc-800 text-zinc-50' : 'bg-zinc-900 text-zinc-50'} ${activeBorder}`
                                                : `\${
                                                    isDarkMode
                                                      ? 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
                                                      : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600'
                                                  }`
                                            }`}
                                          >
                                            <ChildIcon
                                              size={14}
                                              className={`mr-3 transition-all duration-200 ${
                                                isChildActive ? 'text-zinc-50 scale-110' : 'text-zinc-400 group-hover:text-zinc-500'
                                              }`}
                                            />
                                            <div className="flex items-center justify-between w-full">
                                              <span className="capitalize">{childTranslatedLabel}</span>
                                              {childItem.badge && (
                                                <span className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs px-1.5 py-0.5 rounded-full font-medium">
                                                  {childItem.badge}
                                                </span>
                                              )}
                                            </div>
                                          </button>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {!isCollapsed && position !== 'bottom' && position !== 'top' && (
          <div className={`p-4 border-t ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-zinc-900 dark:bg-zinc-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white dark:text-zinc-900 text-sm font-semibold">
                  {userName ? userName.split(' ').map((n) => n[0]).join('').toUpperCase() : 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-zinc-200' : 'text-zinc-900'}`}>
                  {userName}
                </p>
                <p className="text-xs truncate text-zinc-500">
                  {userEmail}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {renderHoverMenu()}
    </>
  );
}