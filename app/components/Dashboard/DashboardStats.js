'use client';

import { TrendingUp, TrendingDown, Users, DollarSign, ShoppingCart, Activity } from 'lucide-react';
import { summaryStats } from '../../data/mockData';

export default function DashboardStats() {
  const stats = [
    {
      title: 'Total Revenue',
      value: `$${summaryStats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: summaryStats.revenueChange,
      trend: summaryStats.revenueChange.startsWith('+') ? 'up' : 'down',
      description: 'from last month',
      icon: DollarSign,
    },
    {
      title: 'Active Users',
      value: summaryStats.activeUsers.toLocaleString('en-US'),
      change: summaryStats.usersChange,
      trend: summaryStats.usersChange.startsWith('+') ? 'up' : 'down',
      description: 'from last month',
      icon: Users,
    },
    {
      title: 'Total Orders',
      value: summaryStats.totalOrders.toLocaleString('en-US'),
      change: summaryStats.ordersChange,
      trend: summaryStats.ordersChange.startsWith('+') ? 'up' : 'down',
      description: 'from last month',
      icon: ShoppingCart,
    },
    {
      title: 'Conversion Rate',
      value: `${summaryStats.conversionRate}%`,
      change: summaryStats.conversionChange,
      trend: summaryStats.conversionChange.startsWith('+') ? 'up' : 'down',
      description: 'from last month',
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
                  {stat.value}
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