import { 
  Home, Users, BarChart as BarChart3, Settings, FileText, Mail, Calendar, 
  Shield, Package, User, UserPlus, UserCheck, TrendingUp, PieChart, Activity, 
  ShoppingCart, Factory as Inventory, Tags, FileBarChart as BarChartIcon, 
  Download, Upload, MessageSquare, Send, Archive, CalendarDays, Clock, Bell, 
  Lock, Key, Database, Target, Video, CheckSquare, LayoutTemplate as TemplateIcon 
} from 'lucide-react';

export const menuItems = [
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