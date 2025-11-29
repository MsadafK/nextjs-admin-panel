'use client';

import DashboardStats from './components/Dashboard/DashboardStats';
import RecentActivity from './components/Dashboard/RecentActivity';
import QuickActions from './components/Dashboard/QuickActions';
import { useTheme } from './contexts/ThemeContext';

export default function Dashboard() {
  const { isDark } = useTheme();

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
          Dashboard
        </h1>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Welcome back! Here's what's happening with your business today.
        </p>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <RecentActivity />
        <QuickActions />
      </div>
    </div>
  );
}