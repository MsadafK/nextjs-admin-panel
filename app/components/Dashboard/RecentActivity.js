'use client';

import { Clock, User, ShoppingCart, FileText, Settings } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'user',
    title: 'New user registration',
    description: 'Sarah Johnson created an account',
    time: '2 minutes ago',
    icon: User,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    id: 2,
    type: 'order',
    title: 'New order received',
    description: 'Order #1234 for $299.99',
    time: '5 minutes ago',
    icon: ShoppingCart,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    id: 3,
    type: 'report',
    title: 'Monthly report generated',
    description: 'Sales report for November 2024',
    time: '1 hour ago',
    icon: FileText,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    id: 4,
    type: 'settings',
    title: 'System settings updated',
    description: 'Security settings modified',
    time: '2 hours ago',
    icon: Settings,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  {
    id: 5,
    type: 'user',
    title: 'User profile updated',
    description: 'Mike Chen updated his profile',
    time: '3 hours ago',
    icon: User,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  }
];

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <Clock className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            
            return (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className={`p-2 rounded-full ${activity.bgColor} flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6">
          <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
            View all activity
          </button>
        </div>
      </div>
    </div>
  );
}