'use client';

import { TrendingUp, TrendingDown, Users, DollarSign, ShoppingCart, Activity } from 'lucide-react';

const stats = [
  { title: 'Total Revenue',   value: '$45,231.89', change: '+20.1%',  trend: 'up',   description: 'from last month', icon: DollarSign  },
  { title: 'Active Users',    value: '2,350',      change: '+180.1%', trend: 'up',   description: 'from last month', icon: Users       },
  { title: 'Total Orders',    value: '12,234',     change: '+19%',    trend: 'up',   description: 'from last month', icon: ShoppingCart},
  { title: 'Conversion Rate', value: '3.24%',      change: '-4.3%',   trend: 'down', description: 'from last month', icon: Activity    },
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon      = stat.icon;
        const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
        const trendCls  = stat.trend === 'up' ? 'text-foreground' : 'text-muted-foreground';

        return (
          <div
            key={index}
            className="bg-card border border-border rounded-lg p-4 sm:p-5
              shadow-card hover:shadow-dropdown transition-shadow duration-150"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">
                  {stat.title}
                </p>
                <p className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                  {stat.value}
                </p>
              </div>
              {/* Monochrome icon chip */}
              <div className="p-2 rounded-md bg-muted flex-shrink-0">
                <Icon className="w-4 h-4 text-muted-foreground" strokeWidth={1.75} />
              </div>
            </div>

            {/* Trend row */}
            <div className="flex items-center gap-1.5 mt-4 flex-wrap">
              <TrendIcon className={`w-3.5 h-3.5 flex-shrink-0 ${trendCls}`} strokeWidth={2} />
              <span className={`text-xs font-semibold ${trendCls}`}>{stat.change}</span>
              <span className="text-xs text-muted-foreground">{stat.description}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}