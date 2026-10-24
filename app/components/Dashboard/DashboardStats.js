'use client';

import { TrendingUp, TrendingDown, Users, DollarSign, ShoppingCart, Activity } from 'lucide-react';

export default function DashboardStats({ statsData, loading }) {
  const s = statsData || {
    totalRevenue: 0,
    revenueChange: '+0%',
    activeUsers: 0,
    usersChange: '+0%',
    totalOrders: 0,
    ordersLabel: 'Total Products',
    ordersChange: '+0%',
    conversionRate: '0.0',
    conversionChange: '+0%',
  };

  const stats = [
    {
      title: 'Total Inventory / Revenue',
      value: `₹${Number(s.totalRevenue).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: s.revenueChange,
      trend: s.revenueChange.startsWith('-') ? 'down' : 'up',
      description: 'live database value',
      icon: DollarSign,
    },
    {
      title: 'Active Users',
      value: Number(s.activeUsers).toLocaleString('en-IN'),
      change: s.usersChange,
      trend: 'up',
      description: 'in public.users',
      icon: Users,
    },
    {
      title: s.ordersLabel || 'Total Orders',
      value: Number(s.totalOrders).toLocaleString('en-IN'),
      change: s.ordersChange,
      trend: 'up',
      description: 'in catalog/orders',
      icon: ShoppingCart,
    },
    {
      title: 'Active Catalog Rate',
      value: `${s.conversionRate}%`,
      change: s.conversionChange,
      trend: 'up',
      description: 'active stock ratio',
      icon: Activity,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon      = stat.icon;
        const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;

        const trendIconCls = stat.trend === 'up' ? 'status-success' : 'status-danger';
        const trendTextCls = stat.trend === 'up' ? 'status-success font-medium' : 'status-danger font-medium';

        return (
          <div
            key={index}
            className="card p-4 sm:p-5 hover:shadow-dropdown transition-shadow duration-150 flex flex-col justify-between"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">
                  {stat.title}
                </p>
                <p className="text-2xl font-semibold tracking-tight text-foreground">
                  {loading ? '…' : stat.value}
                </p>
              </div>
              <div className="p-2 rounded-md bg-muted flex-shrink-0">
                <Icon className="w-4 h-4 text-muted-foreground" strokeWidth={1.75} />
              </div>
            </div>

            {/* Trend row */}
            <div className="flex items-center gap-1.5 mt-4 flex-wrap">
              <TrendIcon className={`w-3.5 h-3.5 flex-shrink-0 ${trendIconCls}`} strokeWidth={2.5} />
              <span className={`text-xs ${trendTextCls}`}>{stat.change}</span>
              <span className="text-xs text-muted-foreground">{stat.description}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}