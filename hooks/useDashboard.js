// hooks/useDashboard.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '@/services/dashboardService';
import { productService } from '@/services/productService';
import { eventService } from '@/services/eventService';
import { notificationService } from '@/services/notificationService';

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
  const [products, setProducts] = useState([]);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [dataResult, productsResult, eventsResult, notificationsResult] = await Promise.allSettled([
        dashboardService.getDashboardData(), productService.getProducts(), eventService.getEvents(), notificationService.getNotifications(),
      ]);
      if (dataResult.status === 'rejected') throw dataResult.reason;
      setSummaryStats(dataResult.value.summaryStats);
      setRecentActivities(dataResult.value.recentActivities);
      setProducts(productsResult.status === 'fulfilled' ? productsResult.value : []);
      setEvents(eventsResult.status === 'fulfilled' ? eventsResult.value : []);
      setNotifications(notificationsResult.status === 'fulfilled' ? notificationsResult.value : []);
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
    products,
    events,
    notifications,
    loading,
    error,
    refreshDashboard: fetchDashboard,
  };
}
