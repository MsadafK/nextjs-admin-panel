'use client';

import { RefreshCw } from 'lucide-react';
import DashboardStats from './components/Dashboard/DashboardStats';
import RecentActivity from './components/Dashboard/RecentActivity';
import QuickActions from './components/Dashboard/QuickActions';
import { useDashboard } from '@/hooks/useDashboard';

export default function Dashboard() {
  const { summaryStats, recentActivities, loading, error, refreshDashboard } = useDashboard();

  return (
    <div className="page-container">
      {/* Page header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back! Live metrics synced with Supabase PostgreSQL.
          </p>
        </div>
        <button
          onClick={refreshDashboard}
          className="btn btn-outline self-start sm:self-auto"
          title="Refresh Dashboard"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin mr-2' : 'mr-2'} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="card p-4 mb-6 border-destructive/40 bg-destructive/10 text-destructive text-sm flex items-center justify-between">
          <span><strong>Database Error:</strong> {error}</span>
          <button onClick={refreshDashboard} className="btn btn-outline h-8 text-xs">Retry</button>
        </div>
      )}

      {/* Stats row */}
      <DashboardStats statsData={summaryStats} loading={loading} />

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity activities={recentActivities} loading={loading} />
        <QuickActions />
      </div>
    </div>
  );
}