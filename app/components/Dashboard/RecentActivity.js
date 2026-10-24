'use client';

import { Clock, User, ShoppingCart, Package, Shield, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

const MODULE_ICONS = {
  Auth: User,
  Products: Package,
  Orders: ShoppingCart,
  Security: Shield,
  Settings: Settings,
};

export default function RecentActivity({ activities = [], loading }) {
  const router = useRouter();

  return (
    <div className="card p-0 shadow-card flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between flex-shrink-0">
        <h3 className="text-sm font-semibold text-foreground">Recent Activity (Live DB)</h3>
        <Clock className="w-4 h-4 text-muted-foreground" />
      </div>

      {/* List */}
      <div className="px-5 py-4 space-y-4 flex-1">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-12 w-full rounded-md" />
          ))
        ) : activities.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            No recent activity found in Supabase.
          </p>
        ) : (
          activities.map((log, index) => {
            const Icon = MODULE_ICONS[log.module] || Clock;
            const isLast = index === activities.length - 1;

            return (
              <div key={log.id} className="flex items-start gap-3 relative">
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
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-foreground leading-snug truncate">
                      {log.action}
                    </p>
                    <span className="text-[11px] text-muted-foreground flex-shrink-0">
                      {log.user}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {log.details}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    {log.time}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-border flex-shrink-0 bg-muted/20">
        <button
          onClick={() => router.push('/users/all/activity')}
          className="text-xs font-medium text-foreground hover:text-muted-foreground transition-colors underline-offset-2 hover:underline"
        >
          View all activity →
        </button>
      </div>
    </div>
  );
}