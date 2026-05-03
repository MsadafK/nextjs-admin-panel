'use client';

import { Plus, Users, FileText, Mail, Calendar } from 'lucide-react';

const actions = [
  { title: 'Add New User',    description: 'Create a new user account', icon: Users    },
  { title: 'Generate Report', description: 'Create analytics report',   icon: FileText },
  { title: 'Send Message',    description: 'Broadcast to all users',    icon: Mail     },
  { title: 'Schedule Event',  description: 'Add to calendar',           icon: Calendar },
];

export default function QuickActions() {
  return (
    <div className="bg-card border border-border rounded-lg shadow-card flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between flex-shrink-0">
        <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
        <Plus className="w-4 h-4 text-muted-foreground" />
      </div>

      {/* Grid */}
      <div className="p-4 sm:p-5 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                className="group p-4 rounded-lg text-left border border-border
                  bg-background hover:bg-muted transition-colors duration-150"
              >
                <div className="flex items-start gap-3">
                  {/* Monochrome icon chip */}
                  <div className="p-2 rounded-md bg-muted flex-shrink-0
                    group-hover:bg-background transition-colors duration-150">
                    <Icon className="w-4 h-4 text-muted-foreground" strokeWidth={1.75} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {action.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {action.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}