'use client';

import { Plus, Users, FileText, Settings, Mail, Calendar } from 'lucide-react';

const actions = [
  {
    title: 'Add New User',
    description: 'Create a new user account',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    hoverColor: 'hover:bg-blue-50'
  },
  {
    title: 'Generate Report',
    description: 'Create analytics report',
    icon: FileText,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    hoverColor: 'hover:bg-green-50'
  },
  {
    title: 'Send Message',
    description: 'Broadcast to all users',
    icon: Mail,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    hoverColor: 'hover:bg-purple-50'
  },
  {
    title: 'Schedule Event',
    description: 'Add to calendar',
    icon: Calendar,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    hoverColor: 'hover:bg-orange-50'
  }
];

export default function QuickActions() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          <Plus className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            
            return (
              <button
                key={index}
                className={`p-4 rounded-lg border border-gray-200 ${action.hoverColor} transition-colors text-left group`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${action.bgColor} group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-5 h-5 ${action.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                      {action.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
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