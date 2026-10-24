// hooks/useDashboard.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '@/services/dashboardService';

export function useDashboard() {
  const [summaryStats, setSummaryStats] = useState({
    totalRevenue: 0,
    revenueChange: '+0%',
    activeUsers: 0,
    totalUsers: 0,
    usersChange: '+0%',
    totalOrders: 0,
    ordersLabel: 'Total Products',
    ordersChange: '+0%',
    conversionRate: '0.0',
    conversionChange: '+0%',
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getDashboardData();
      setSummaryStats(data.summaryStats);
      setRecentActivities(data.recentActivities);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to fetch live dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    summaryStats,
    recentActivities,
    loading,
    error,
    refreshDashboard: fetchDashboard,
  };
}