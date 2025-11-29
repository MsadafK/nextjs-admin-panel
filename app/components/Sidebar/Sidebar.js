'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Home, Users, BarChart as BarChart3, Settings, FileText, Mail, Calendar, ChevronLeft, ChevronRight, ChevronDown, Shield, Package, User, UserPlus, UserCheck, TrendingUp, PieChart, Activity, ShoppingCart, Factory as Inventory, Tags, FileBarChart as BarChartIcon, Download, Upload, MessageSquare, Send, Archive, CalendarDays, Clock, Bell, Lock, Key, Database, Target, Video, CheckSquare, LayoutTemplate as TemplateIcon, ChevronUp } from 'lucide-react';
import UserProfile from './UserProfile';
import SubMenu from './SubMenus';
import { useRouter } from 'next/navigation';

export default function Sidebar({ isCollapsed, onToggle, position = 'left', onPositionChange, isDarkMode = false }) {
  const router = useRouter();
  const [activePath, setActivePath] = useState(['dashboard']);
  const [showPositionMenu, setShowPositionMenu] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const hoverMenuRef = useRef(null);
  const positionMenuButtonRef = useRef(null);
  const [userName, setUserName] = useState('John Doe');
  const [userEmail, setUserEmail] = useState('john@example.com');
  const { getThemeColors } = useTheme() || {};
  const { t } = useLanguage();
  const colors = getThemeColors ? getThemeColors() : {
    primary: 'bg-blue-600',
    primaryBg: 'bg-blue-50',
    primaryText: 'text-blue-600'
  };

  useEffect(() => {
    const savedActivePath = localStorage.getItem('sidebarActivePath');
    const savedExpandedMenus = localStorage.getItem('sidebarExpandedMenus');
    
    if (savedActivePath) {
      try {
        setActivePath(JSON.parse(savedActivePath));
      } catch (e) {
        console.error('Error parsing active path:', e);
      }
    }
    
    if (savedExpandedMenus) {
      try {
        setExpandedMenus(JSON.parse(savedExpandedMenus));
      } catch (e) {
        console.error('Error parsing expanded menus:', e);
      }
    }
  }, []);
  const translateText = (text) => {
    if (!text) return '';
    return t ? t(text) : text;
  };
  
  const ICON_SIZE = 20;

  const menuItems = [
    { 
      icon: Home, 
      label: 'dashboard', 
      href: '/', 
      active: true 
    },
    { 
      icon: Users, 
      label: 'users', 
      href: '/users',
      subItems: [
        { 
          icon: User, 
          label: 'all_users', 
          href: '/users/all',
          childItems: [
            { icon: Users, label: 'user_list', href: '/users/all/list' },
            { icon: Activity, label: 'user_activity', href: '/users/all/activity' },
            { icon: Shield, label: 'user_permissions', href: '/users/all/permissions' }
          ]
        },
        { 
          icon: UserPlus, 
          label: 'add_user', 
          href: '/users/add',
          childItems: [
            { icon: FileText, label: 'single_user', href: '/users/add/single' },
            { icon: Upload, label: 'bulk_import', href: '/users/add/bulk' },
            { icon: Mail, label: 'invite_users', href: '/users/add/invite' }
          ]
        },
        { 
          icon: UserCheck, 
          label: 'active_users', 
          href: '/users/active',
          childItems: [
            { icon: Clock, label: 'online_now', href: '/users/active/online' },
            { icon: Calendar, label: 'recent_activity', href: '/users/active/recent' },
            { icon: TrendingUp, label: 'engagement_stats', href: '/users/active/stats' }
          ]
        }
      ]
    },
    { 
      icon: BarChart3, 
      label: 'analytics', 
      href: '/analytics',
      subItems: [
        { 
          icon: TrendingUp, 
          label: 'trends', 
          href: '/analytics/trends',
          childItems: [
            { icon: BarChart3, label: 'sales_trends', href: '/analytics/trends/sales' },
            { icon: Users, label: 'user_trends', href: '/analytics/trends/users' },
            { icon: ShoppingCart, label: 'product_trends', href: '/analytics/trends/products' }
          ]
        },
        { 
          icon: PieChart, 
          label: 'reports', 
          href: '/analytics/reports',
          childItems: [
            { icon: BarChartIcon, label: 'monthly_reports', href: '/analytics/reports/monthly' },
            { icon: Calendar, label: 'quarterly_reports', href: '/analytics/reports/quarterly' },
            { icon: TrendingUp, label: 'yearly_reports', href: '/analytics/reports/yearly' }
          ]
        },
        { 
          icon: Activity, 
          label: 'real_time', 
          href: '/analytics/realtime',
          childItems: [
            { icon: Users, label: 'live_users', href: '/analytics/realtime/users' },
            { icon: ShoppingCart, label: 'live_sales', href: '/analytics/realtime/sales' },
            { icon: Activity, label: 'system_health', href: '/analytics/realtime/health' }
          ]
        }
      ]
    },
    { 
      icon: Package, 
      label: 'products', 
      href: '/products',
      subItems: [
        { 
          icon: ShoppingCart, 
          label: 'all_products', 
          href: '/products/all',
          childItems: [
            { icon: Package, label: 'product_catalog', href: '/products/all/catalog' },
            { icon: TrendingUp, label: 'best_sellers', href: '/products/all/bestsellers' },
            { icon: Activity, label: 'product_performance', href: '/products/all/performance' }
          ]
        },
        { 
          icon: Inventory, 
          label: 'inventory', 
          href: '/products/inventory',
          childItems: [
            { icon: Package, label: 'stock_levels', href: '/products/inventory/stock' },
            { icon: Bell, label: 'low_stock_alerts', href: '/products/inventory/alerts' },
            { icon: TrendingUp, label: 'inventory_reports', href: '/products/inventory/reports' }
          ]
        },
        { 
          icon: Tags, 
          label: 'categories', 
          href: '/products/categories',
          childItems: [
            { icon: Tags, label: 'manage_categories', href: '/products/categories/manage' },
            { icon: UserPlus, label: 'add_category', href: '/products/categories/add' },
            { icon: BarChart3, label: 'category_analytics', href: '/products/categories/analytics' }
          ]
        }
      ]
    },
    { 
      icon: FileText, 
      label: 'reports', 
      href: '/reports',
      subItems: [
        { 
          icon: BarChartIcon, 
          label: 'sales_reports', 
          href: '/reports/sales',
          childItems: [
            { icon: Calendar, label: 'daily_sales', href: '/reports/sales/daily' },
            { icon: BarChart3, label: 'monthly_sales', href: '/reports/sales/monthly' },
            { icon: TrendingUp, label: 'sales_forecast', href: '/reports/sales/forecast' }
          ]
        },
        { 
          icon: Download, 
          label: 'export', 
          href: '/reports/export',
          childItems: [
            { icon: FileText, label: 'export_csv', href: '/reports/export/csv' },
            { icon: FileText, label: 'export_pdf', href: '/reports/export/pdf' },
            { icon: FileText, label: 'export_excel', href: '/reports/export/excel' }
          ]
        },
        { 
          icon: Upload, 
          label: 'import', 
          href: '/reports/import',
          childItems: [
            { icon: Upload, label: 'import_data', href: '/reports/import/data' },
            { icon: TemplateIcon, label: 'import_templates', href: '/reports/import/templates' },
            { icon: Activity, label: 'import_history', href: '/reports/import/history' }
          ]
        }
      ]
    },
    { 
      icon: Mail, 
      label: 'messages', 
      href: '/messages', 
      badge: '12',
      subItems: [
        { 
          icon: MessageSquare, 
          label: 'inbox', 
          href: '/messages/inbox', 
          badge: '8',
          childItems: [
            { icon: Mail, label: 'unread_messages', href: '/messages/inbox/unread', badge: '5' },
            { icon: Users, label: 'team_messages', href: '/messages/inbox/team' },
            { icon: Bell, label: 'priority_messages', href: '/messages/inbox/priority', badge: '3' }
          ]
        },
        { 
          icon: Send, 
          label: 'sent', 
          href: '/messages/sent',
          childItems: [
            { icon: Send, label: 'recent_sent', href: '/messages/sent/recent' },
            { icon: Clock, label: 'scheduled_messages', href: '/messages/sent/scheduled' },
            { icon: CheckSquare, label: 'delivery_status', href: '/messages/sent/status' }
          ]
        },
        { 
          icon: Archive, 
          label: 'archived', 
          href: '/messages/archived',
          childItems: [
            { icon: Archive, label: 'archived_conversations', href: '/messages/archived/conversations' },
            { icon: Calendar, label: 'archived_by_date', href: '/messages/archived/date' },
            { icon: Tags, label: 'archived_by_tags', href: '/messages/archived/tags' }
          ]
        }
      ]
    },
    { 
      icon: Calendar, 
      label: 'calendar', 
      href: '/calendar',
      subItems: [
        { 
          icon: CalendarDays, 
          label: 'events', 
          href: '/calendar/events',
          childItems: [
            { icon: Calendar, label: 'upcoming_events', href: '/calendar/events/upcoming' },
            { icon: Users, label: 'team_events', href: '/calendar/events/team' },
            { icon: UserPlus, label: 'create_event', href: '/calendar/events/create' }
          ]
        },
        { 
          icon: Clock, 
          label: 'schedule', 
          href: '/calendar/schedule',
          childItems: [
            { icon: Calendar, label: 'my_schedule', href: '/calendar/schedule/my' },
            { icon: Users, label: 'team_schedule', href: '/calendar/schedule/team' },
            { icon: Clock, label: 'time_blocks', href: '/calendar/schedule/blocks' }
          ]
        },
        { 
          icon: Bell, 
          label: 'reminders', 
          href: '/calendar/reminders',
          childItems: [
            { icon: Bell, label: 'active_reminders', href: '/calendar/reminders/active' },
            { icon: Clock, label: 'recurring_reminders', href: '/calendar/reminders/recurring' },
            { icon: UserPlus, label: 'create_reminder', href: '/calendar/reminders/create' }
          ]
        }
      ]
    },
    { 
      icon: Shield, 
      label: 'security', 
      href: '/security',
      subItems: [
        { 
          icon: Lock, 
          label: 'permissions', 
          href: '/security/permissions',
          childItems: [
            { icon: Users, label: 'user_permissions', href: '/security/permissions/users' },
            { icon: Shield, label: 'role_management', href: '/security/permissions/roles' },
            { icon: Key, label: 'access_control', href: '/security/permissions/access' }
          ]
        },
        { 
          icon: Key, 
          label: 'api_keys', 
          href: '/security/api-keys',
          childItems: [
            { icon: Key, label: 'active_keys', href: '/security/api-keys/active' },
            { icon: UserPlus, label: 'generate_key', href: '/security/api-keys/generate' },
            { icon: Activity, label: 'key_usage', href: '/security/api-keys/usage' }
          ]
        },
        { 
          icon: Database, 
          label: 'audit_logs', 
          href: '/security/audit',
          childItems: [
            { icon: Activity, label: 'system_logs', href: '/security/audit/system' },
            { icon: Users, label: 'user_activity', href: '/security/audit/users' },
            { icon: Shield, label: 'security_events', href: '/security/audit/security' }
          ]
        }
      ]
    },
    { 
      icon: Activity, 
      label: 'performance', 
      href: '/performance',
      subItems: [
        { 
          icon: Target, 
          label: 'kras', 
          href: '/performance/kras',
          childItems: [
            { icon: TrendingUp, label: 'my_kras', href: '/performance/kras/my' },
            { icon: Users, label: 'team_kras', href: '/performance/kras/team' },
            { icon: BarChart3, label: 'kra_reports', href: '/performance/kras/reports' }
          ]
        },
        { 
          icon: Video, 
          label: 'meetings', 
          href: '/performance/meetings',
          childItems: [
            { icon: Calendar, label: 'my_meetings', href: '/performance/meetings/my' },
            { icon: CheckSquare, label: 'action_items', href: '/performance/meetings/actions' },
            { icon: TemplateIcon, label: 'agenda_templates', href: '/performance/meetings/templates' }
          ]
        },
        { icon: MessageSquare, label: 'feedback', href: '/performance/feedback' },
        { icon: TrendingUp, label: 'reviews', href: '/performance/reviews' },
        { icon: Target, label: 'skills', href: '/performance/skills' }
      ]
    },
    { 
      icon: Settings, 
      label: 'settings', 
      href: '/settings' 
    },
  ];

  const isInActivePath = (itemLabel) => {
    return activePath.includes(itemLabel);
  };

  const findPathToItem = (targetLabel, items = menuItems, currentPath = []) => {
    for (const item of items) {
      const newPath = [...currentPath, item.label];
      
      if (item.label === targetLabel) {
        return newPath;
      }
      
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

  // const handleMenuClick = (item) => {
  //   setActiveItem(item.label);
    
  //   if (item.subItems) {
  //     const newExpandedMenus = expandedMenus[item.label] 
  //       ? {} 
  //       : { [item.label]: true };
  //     setExpandedMenus(newExpandedMenus);
  //     localStorage.setItem('sidebarExpandedMenus', JSON.stringify(newExpandedMenus));
  //     return;
  //   }

  //   setExpandedMenus({});
  //   localStorage.setItem('sidebarExpandedMenus', JSON.stringify({}));

  //   if (item.href && item.href !== '#') {
  //     router.push(item.href);
  //   }
  // };

  const handleMenuClick = (item, e) => {
    console.log('[handleMenuClick] Item:', item.label, 'subItems:', !!item.subItems);
    
    // Prevent default link behavior
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (item.subItems) {
      // Agar current item already open hai to usko close karo, warna sirf isko hi open rakho
      const newExpandedMenus = expandedMenus[item.label] 
        ? {} 
        : { [item.label]: true };
      console.log('[handleMenuClick] Setting expandedMenus:', newExpandedMenus);
      setExpandedMenus(newExpandedMenus);
      // Active path update karo bina navigation ke
      const path = findPathToItem(item.label);
      if (path) {
        setActivePath(path);
        localStorage.setItem('sidebarActivePath', JSON.stringify(path));
      }
      // IMPORTANT: SubItems wale items pe navigation nahi karna
      return;
    }

    // Agar item ke subItems nahi hai (jaise Dashboard), to sab menus collapse kar do
    console.log('[handleMenuClick] Collapsing all menus');
    setExpandedMenus({});
    
    // Sirf un items pe navigate karo jinke subItems nahi hain
    const path = findPathToItem(item.label);
    if (path) {
      setActivePath(path);
      localStorage.setItem('sidebarActivePath', JSON.stringify(path));
    }

    // Navigation sirf valid routes ke liye
    if (item.href && item.href !== '#') {
      console.log('[handleMenuClick] Navigating to:', item.href);
      router.push(item.href);
    }
  };

  const handleMouseEnter = (item, event) => {
    if (isCollapsed || position === 'bottom' || position === 'top') {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
      const rect = event.currentTarget.getBoundingClientRect();
      const timeout = setTimeout(() => {
        setHoveredItem({ ...item, rect });
      }, 150);
      setHoverTimeout(timeout);
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    const timeout = setTimeout(() => {
      setHoveredItem(null);
      if (position === 'top' || position === 'bottom') {
        setExpandedMenus({});
      }
    }, 300);
    setHoverTimeout(timeout);
  };

  const handleHoverMenuMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
  };

  const handleHoverMenuMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredItem(null);
      if (position === 'top' || position === 'bottom') {
        setExpandedMenus({});
      }
    }, 300);
    setHoverTimeout(timeout);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (hoverMenuRef.current && !hoverMenuRef.current.contains(event.target)) {
        setHoveredItem(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
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
  }, []);

  const getContainerClasses = () => {
    let classes = `transition-all duration-300 shadow-sm flex ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-700'} border-gray-200 dark:border-gray-700`;
    
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
    { value: 'bottom', label: 'Bottom', icon: <ChevronDown size={14} /> },
    { value: 'top', label: 'Top', icon: <ChevronUp size={14} /> }
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

  // const renderHoverMenu = () => {
  //   if (!hoveredItem || (!isCollapsed && position !== 'bottom' && position !== 'top')) return null;

  //   const menuPosition = getHoverMenuPosition();
    
  //   return (
  //     <div
  //       ref={hoverMenuRef}
  //       className={`fixed z-[60] ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-xl min-w-[250px] py-2`}
  //       style={menuPosition}
  //       onMouseEnter={handleHoverMenuMouseEnter}
  //       onMouseLeave={handleHoverMenuMouseLeave}
  //     >
  //       <div className={`px-3 py-2 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
  //         <div className="flex items-center space-x-2">
  //           <hoveredItem.icon size={16} className={colors.primaryText} />
  //           <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
  //             {t ? t(hoveredItem.label) : hoveredItem.label}
  //           </span>
  //           {hoveredItem.badge && (
  //             <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
  //               {hoveredItem.badge}
  //             </span>
  //           )}
  //         </div>
  //       </div>
        
  //       {hoveredItem.subItems && (
  //         <div className="py-1">
  //           {hoveredItem.subItems.map((subItem) => {
  //             const SubIcon = subItem.icon;
  //             return (
  //               <div key={subItem.label} className="relative group/submenu">
  //                 <button
  //                   onClick={() => setActiveItem(subItem.label)}
  //                   className={`w-full flex items-center px-3 py-2 text-sm ${
  //                     isDarkMode 
  //                       ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
  //                       : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
  //                   } transition-colors`}
  //                 >
  //                   <SubIcon size={16} className="mr-3 text-gray-400" />
  //                   <span className="flex-1 text-left">
  //                     {t ? t(subItem.label) : subItem.label}
  //                   </span>
  //                   {subItem.badge && (
  //                     <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2">
  //                       {subItem.badge}
  //                     </span>
  //                   )}
  //                   {subItem.childItems && (
  //                     position === 'right' || position === 'bottom' ? (
  //                       <ChevronLeft size={14} className="ml-2 text-gray-400" />
  //                     ) : (
  //                       <ChevronRight size={14} className="ml-2 text-gray-400" />
  //                     )
  //                   )}
  //                 </button>
                  
  //                 {subItem.childItems && (
  //                   <div className={`absolute ${
  //                     position === 'right' || position === 'bottom' 
  //                       ? 'right-full mr-1' 
  //                       : 'left-full ml-1'
  //                   } ${
  //                     position === 'bottom' 
  //                       ? 'bottom-0' 
  //                       : 'top-0'
  //                   } ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-xl min-w-[200px] py-2 opacity-0 invisible group-hover/submenu:opacity-100 group-hover/submenu:visible transition-all duration-200 z-[70]`}>
  //                     <div className={`px-3 py-2 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} mb-1`}>
  //                       <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide`}>
  //                         {t ? t(subItem.label) : subItem.label}
  //                       </span>
  //                     </div>
  //                     {subItem.childItems.map((childItem) => {
  //                       const ChildIcon = childItem.icon;
  //                       return (
  //                         <button
  //                           key={childItem.label}
  //                           onClick={() => setActiveItem(childItem.label)}
  //                           className={`w-full flex items-center px-3 py-2 text-sm ${
  //                             isDarkMode 
  //                               ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
  //                               : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
  //                           } transition-colors`}
  //                         >
  //                           <ChildIcon size={14} className="mr-3 text-gray-400" />
  //                           <span className="text-left">
  //                             {t ? t(childItem.label) : childItem.label}
  //                           </span>
  //                           {childItem.badge && (
  //                             <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2">
  //                               {childItem.badge}
  //                             </span>
  //                           )}
  //                         </button>
  //                       );
  //                     })}
  //                   </div>
  //                 )}
  //               </div>
  //             );
  //           })}
  //         </div>
  //       )}
  //     </div>
  //   );
  // };

  const renderHoverMenu = () => {
    if (!hoveredItem || (!isCollapsed && position !== 'bottom' && position !== 'top')) return null;

    const menuPosition = getHoverMenuPosition();
    
    return (
      <div
        ref={hoverMenuRef}
        className={`fixed z-[60] ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-xl min-w-[250px] py-2`}
        style={menuPosition}
        onMouseEnter={handleHoverMenuMouseEnter}
        onMouseLeave={handleHoverMenuMouseLeave}
      >
        <div className={`px-3 py-2 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-2">
            <hoveredItem.icon size={16} className={colors.primaryText} />
            <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {t ? t(hoveredItem.label) : hoveredItem.label}
            </span>
            {hoveredItem.badge && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
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
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } transition-colors`}
                  >
                    <SubIcon size={16} className={`mr-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    <span className="flex-1 text-left">
                      {t ? t(subItem.label) : subItem.label}
                    </span>
                    {subItem.badge && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2">
                        {subItem.badge}
                      </span>
                    )}
                    {subItem.childItems && (
                      position === 'right' || position === 'bottom' ? (
                        <ChevronLeft size={14} className={`ml-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                      ) : (
                        <ChevronRight size={14} className={`ml-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                      )
                    )}
                  </button>
                  
                  {subItem.childItems && (
                    <div className={`absolute ${
                      position === 'right' || position === 'bottom' 
                        ? 'right-full mr-1' 
                        : 'left-full ml-1'
                    } ${
                      position === 'bottom' 
                        ? 'bottom-0' 
                        : 'top-0'
                    } ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-xl min-w-[200px] py-2 opacity-0 invisible group-hover/submenu:opacity-100 group-hover/submenu:visible transition-all duration-200 z-[70]`}>
                      <div className={`px-3 py-2 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} mb-1`}>
                        <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide`}>
                          {t ? t(subItem.label) : subItem.label}
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
                                ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            } transition-colors`}
                          >
                            <ChildIcon size={14} className={`mr-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                            <span className="text-left">
                              {t ? t(childItem.label) : childItem.label}
                            </span>
                            {childItem.badge && (
                              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2">
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
      <div 
        className={`${getContainerClasses()} ${(position === 'top' || position === 'bottom') && Object.keys(expandedMenus).some(key => expandedMenus[key]) ? 'overflow-y-auto' : ''}`}
        
      >
        <div className={`p-3.5 ${position === 'bottom' || position === 'top' ? 'border-r' : 'border-b'} ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between ${position === 'bottom' || position === 'top' ? 'flex-shrink-0' : ''} ${position === 'right' ? 'flex-row-reverse' : ''}`}>
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 ${colors.primary} rounded-lg flex items-center justify-center`}>
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{translateText('app_name')}</h1>
            </div>
          )}
          {window.innerWidth > 768 && (
            <div className="flex items-center space-x-2">
              <div className="relative">
              <button
                ref={positionMenuButtonRef}
                onClick={() => setShowPositionMenu(!showPositionMenu)}
                disabled={window.innerWidth < 1279}
                className={`p-2 rounded-lg ${window.innerWidth < 1280 ? 'opacity-50 cursor-not-allowed' : (isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600')} transition-colors`}
                title="Change sidebar position"
              >
                <Settings size={ICON_SIZE} />
              </button>
              </div>
              
              <button
                onClick={onToggle}
                disabled={window.innerWidth < 1279}
                className={`p-2 rounded-lg ${window.innerWidth < 1280 ? 'opacity-50 cursor-not-allowed' : (isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600')} transition-colors`}
              >
                <ToggleIcon size={ICON_SIZE} />
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className={`flex-1 px-3 md:px-4 py-3 ${position === 'bottom' || position === 'top' ? 'overflow-x-auto overflow-y-hidden' : 'overflow-y-auto'} custom-scrollbar`}>
          <ul className={`${position === 'bottom' || position === 'top' ? 'flex space-x-2 items-center whitespace-nowrap pr-12 min-w-max' : 'space-y-1'}`}>
            {menuItems.map((item) => {
               const Icon = item.icon;
               const isActive = activePath[activePath.length - 1] === item.label;
               const isInPath = isInActivePath(item.label);
               const isExpanded = expandedMenus[item.label];
               const translatedLabel = t ? t(item.label) : item.label;
               const activeBorder = position === 'left' ? 'border-r-2' : position === 'right' ? 'border-l-2' : position === 'top' ? 'border-b-2' : 'border-t-2';
               
               return (
                 <li key={item.label} className={`relative ${isCollapsed && (position === 'left' || position === 'right') ? 'mb-2' : ''} ${(position === 'top' || position === 'bottom') && isExpanded ? 'mb-2' : ''}`}>
                   <button
                     onClick={() => (position === 'left' || position === 'right' || position === 'top' || position === 'bottom') && handleMenuClick(item)}
                     onMouseEnter={(e) => handleMouseEnter(item, e)}
                     onMouseLeave={handleMouseLeave}
                     className={`${position === 'bottom' || position === 'top' ? 'flex-shrink-0 h-10' : 'w-full'} flex items-center ${isCollapsed && (position === 'left' || position === 'right') ? 'justify-center py-3 px-0 h-12' : (isCollapsed ? 'justify-center px-3' : 'px-3')} rounded-lg transition-colors group ${
                       isActive 
                         ? `${colors.primaryBg} ${colors.primaryText} ${activeBorder} ${colors.primary.replace('bg-', 'border-')}` 
                         : isInPath
                         ? `${colors.primaryBg} ${colors.primaryText.replace('600', '500')} ${activeBorder} ${colors.primary.replace('bg-', 'border-').replace('600', '300')}`
                         : `${isDarkMode ? 'text-white hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
                     }`}
                   >
                     <Icon 
                       size={ICON_SIZE} 
                       strokeWidth={2}
                       className={`flex-shrink-0 ${isCollapsed ? 'mx-auto' : 'mr-3'} ${
                         isActive ? colors.primaryText.replace('text-', '') 
                         : isInPath ? colors.primaryText.replace('text-', '').replace('600', '500')
                         : `${isDarkMode ? 'text-white group-hover:text-white' : 'text-gray-400 group-hover:text-gray-600'}`
                       }`} 
                       style={{ width: '20px', height: '20px', minWidth: '20px', minHeight: '20px' }}
                     />
                     {!isCollapsed && (
                       <div className="flex items-center justify-between w-full h-10">
                         <span className="font-medium capitalize">{translatedLabel}</span>
                         <div className="flex items-center space-x-2">
                           {item.badge && (
                             <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
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
                    <div className={`relative ${position === 'top' || position === 'bottom' ? 'ml-0 mt-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-2 z-[55]' : 'ml-6 mt-1'}`}>
                      {(position === 'left' || position === 'right') && (
                        <div className={`absolute left-4 top-0 bottom-0 w-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                      )}
                      
                      <ul className={`${position === 'top' || position === 'bottom' ? 'grid grid-cols-1 gap-1' : 'space-y-1'}`}>
                        {item.subItems.map((subItem, subIndex) => {
                          const SubIcon = subItem.icon;
                          const subTranslatedLabel = t ? t(subItem.label) : subItem.label;
                          const isSubActive = activePath[activePath.length - 1] === subItem.label;
                          const isSubInPath = isInActivePath(subItem.label);
                          const isSubExpanded = expandedMenus[subItem.label];
                          const isLastSubItem = subIndex === item.subItems.length - 1;
                          
                          return (
                            <li key={subItem.label} className="relative">
                              {(position === 'left' || position === 'right') && (
                                <div className={`absolute left-4 top-3 w-2 h-2 rounded-full transform -translate-x-1/2 z-10 ${
                                  isSubActive 
                                    ? colors.primary
                                    : isSubInPath
                                    ? colors.primary.replace('600', '400')
                                    : `${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`
                                } ${isSubActive || isSubInPath ? 'ring-2 ring-white dark:ring-gray-900' : ''}`}></div>
                              )}
                              
                              {(position === 'left' || position === 'right') && isLastSubItem && (
                                <div className={`absolute left-4 top-5 bottom-0 w-px ${isDarkMode ? 'bg-gray-900' : 'bg-white'} z-5`}></div>
                              )}
                              
                              <button
                                onClick={() => {
                                  setActiveItem(subItem.label);
                                  if (subItem.childItems) {
                                    setExpandedMenus(prev => ({
                                      ...prev,
                                      [subItem.label]: !prev[subItem.label]
                                    }));
                                  }
                                }}
                                className={`w-full flex items-center ${position === 'top' || position === 'bottom' ? 'px-3' : 'pl-8 pr-3'} py-2 rounded-lg text-sm transition-colors group ${
                                  isSubActive 
                                    ? `${colors.primaryBg} ${colors.primaryText} ${activeBorder} ${colors.primary.replace('bg-', 'border-')}` 
                                    : isSubInPath
                                    ? `${colors.primaryBg} ${colors.primaryText.replace('600', '500')} ${activeBorder} ${colors.primary.replace('bg-', 'border-').replace('600', '300')}`
                                    : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`
                                }`}
                              >
                                <SubIcon size={16} className={`mr-3 ${
                                  isSubActive ? colors.primaryText.replace('text-', '') 
                                  : isSubInPath ? colors.primaryText.replace('text-', '').replace('600', '500')
                                  : 'text-gray-400 group-hover:text-gray-500'
                                }`} />
                                <div className="flex items-center justify-between w-full">
                                  <span className="capitalize">{subTranslatedLabel}</span>
                                  <div className="flex items-center space-x-2">
                                    {subItem.badge && (
                                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
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
                                <div className={`relative ${position === 'top' || position === 'bottom' ? 'ml-0 mt-1 bg-gray-100 dark:bg-gray-700 rounded p-1 z-[60]' : 'ml-6 mt-1'}`}>
                                  {(position === 'left' || position === 'right') && (
                                    <div className={`absolute left-4 top-0 bottom-0 w-px ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                                  )}
                                  
                                  <ul className={`${position === 'top' || position === 'bottom' ? 'grid grid-cols-1 gap-0.5' : 'space-y-1'}`}>
                                    {subItem.childItems.map((childItem, childIndex) => {
                                      const ChildIcon = childItem.icon;
                                      const childTranslatedLabel = t ? t(childItem.label) : childItem.label;
                                      const isChildActive = activePath[activePath.length - 1] === childItem.label;
                                      const isLastChildItem = childIndex === subItem.childItems.length - 1;
                                      
                                      return (
                                        <li key={childItem.label} className="relative">
                                          {(position === 'left' || position === 'right') && (
                                            <div className={`absolute left-4 top-3 w-1.5 h-1.5 rounded-full transform -translate-x-1/2 z-10 ${
                                              isChildActive 
                                                ? colors.primary
                                                : `${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'}`
                                            } ${isChildActive ? 'ring-2 ring-white dark:ring-gray-900 scale-125' : ''}`}></div>
                                          )}
                                          
                                          {(position === 'left' || position === 'right') && isLastChildItem && (
                                            <div className={`absolute left-4 top-4 bottom-0 w-px ${isDarkMode ? 'bg-gray-900' : 'bg-white'} z-5`}></div>
                                          )}
                                          
                                          <button
                                            onClick={() => setActiveItem(childItem.label)}
                                            className={`w-full flex items-center ${position === 'top' || position === 'bottom' ? 'px-3' : 'pl-8 pr-3'} py-2 rounded-lg text-sm transition-colors group ${
                                              isChildActive 
                                                ? `${colors.primaryBg} ${colors.primaryText} transform scale-[1.02] ${activeBorder} ${colors.primary.replace('bg-', 'border-')}` 
                                                : `${isDarkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`
                                            }`}
                                          >
                                            <ChildIcon size={14} className={`mr-3 transition-all duration-200 ${
                                              isChildActive ? colors.primaryText.replace('text-', '') + ' scale-110' : 'text-gray-400 group-hover:text-gray-500'
                                            }`} />
                                            <div className="flex items-center justify-between w-full">
                                              <span className="capitalize">{childTranslatedLabel}</span>
                                              {childItem.badge && (
                                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
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
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${colors.primary} rounded-full flex items-center justify-center`}>
                <span className="text-white font-semibold">
                  {userName ? userName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {userName || translateText('user')}
                </p>
                <p className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {userEmail || translateText('email')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {renderHoverMenu()}

      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: ${isDarkMode ? '#4B5563 #1F2937' : '#D1D5DB #F9FAFB'};
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
          height: 2px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDarkMode ? '#1F2937' : '#F9FAFB'};
          border-radius: 1px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? '#4B5563' : '#D1D5DB'};
          border-radius: 1px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode ? '#6B7280' : '#9CA3AF'};
        }
        
        .custom-scrollbar::-webkit-scrollbar-corner {
          background: ${isDarkMode ? '#1F2937' : '#F9FAFB'};
        }
        
        .custom-scrollbar.horizontal-thin::-webkit-scrollbar {
          height: 3px;
        }
        
        .custom-scrollbar.horizontal-thin::-webkit-scrollbar-track {
          background: ${isDarkMode ? '#1F2937' : '#F9FAFB'};
          border-radius: 1.5px;
        }
        
        .custom-scrollbar.horizontal-thin::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? '#4B5563' : '#D1D5DB'};
          border-radius: 1.5px;
        }
        
        @media (max-width: 768px) {
          .custom-scrollbar {
            scrollbar-width: none;
          }
          .custom-scrollbar::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
    </>
  );
}