'use client';

import DashboardStats from './components/Dashboard/DashboardStats';
import RecentActivity from './components/Dashboard/RecentActivity';
import QuickActions from './components/Dashboard/QuickActions';

export default function Dashboard() {
  return (
    <div className="p-6">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back! Here&apos;s what&apos;s happening with your business today.
        </p>
      </div>

      {/* Stats row */}
      <DashboardStats />

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <QuickActions />
      </div>
    </div>
  );
}