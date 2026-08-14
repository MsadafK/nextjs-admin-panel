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
    <div className="card p-0 shadow-card flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b flex items-center justify-between flex-shrink-0">
        <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
        <Plus className="w-4 h-4 text-muted-foreground" />
      </div>

      {/* Grid */}
      <div className="p-4 sm:p-5 flex-1 bg-muted/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-full align-top">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                className="group p-4 rounded-lg text-left border bg-card hover:border-foreground/20 hover:shadow-sm transition-all duration-200 flex flex-col justify-center"
              >
                <div className="flex items-start gap-3">
                  {/* Monochrome icon chip */}
                  <div className="p-2 rounded-md bg-muted flex-shrink-0 group-hover:bg-foreground group-hover:text-background transition-colors duration-200">
                    <Icon className="w-4 h-4 text-muted-foreground group-hover:text-background" strokeWidth={2} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {action.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
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