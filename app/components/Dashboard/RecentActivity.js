'use client';

import { Clock, User, ShoppingCart, FileText, Settings } from 'lucide-react';

const activities = [
  { id: 1, title: 'New user registration',    description: 'Sarah Johnson created an account',    time: '2 minutes ago',  icon: User         },
  { id: 2, title: 'New order received',        description: 'Order #1234 for $299.99',             time: '5 minutes ago',  icon: ShoppingCart },
  { id: 3, title: 'Monthly report generated',  description: 'Sales report for November 2024',      time: '1 hour ago',     icon: FileText     },
  { id: 4, title: 'System settings updated',   description: 'Security settings modified',          time: '2 hours ago',    icon: Settings     },
  { id: 5, title: 'User profile updated',      description: 'Mike Chen updated his profile',       time: '3 hours ago',    icon: User         },
];

export default function RecentActivity() {
  return (
    <div className="bg-card border border-border rounded-lg shadow-card flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between flex-shrink-0">
        <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
        <Clock className="w-4 h-4 text-muted-foreground" />
      </div>

      {/* List */}
      <div className="px-5 py-4 space-y-4 flex-1">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          const isLast = index === activities.length - 1;

          return (
            <div key={activity.id} className="flex items-start gap-3 relative">
              {/* Vertical connector line */}
              {!isLast && (
                <div className="absolute left-[15px] top-8 bottom-0 w-px bg-border" />
              )}

              {/* Icon chip — monochrome */}
              <div className="p-2 rounded-md bg-muted flex-shrink-0 z-10">
                <Icon className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={2} />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-sm font-medium text-foreground leading-snug">
                  {activity.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-border flex-shrink-0">
        <button className="text-xs font-medium text-foreground hover:text-muted-foreground
          transition-colors underline-offset-2 hover:underline">
          View all activity →
        </button>
      </div>
    </div>
  );
}