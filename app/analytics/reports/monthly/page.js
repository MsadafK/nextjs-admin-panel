'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar, Download, FileText, TrendingUp, TrendingDown,
  DollarSign, ShoppingCart, Users, ArrowUpRight, ArrowDownRight,
  ChevronLeft, ChevronRight, CheckCircle, AlertCircle, XCircle,
  Printer, Mail, Share2, RefreshCw
} from 'lucide-react';
import { reportService } from '@/services/reportService';

export default function MonthlyReports() {
  const [selectedMonth, setSelectedMonth] = useState('2026-10');
  const [reportType, setReportType] = useState('summary');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [reportData, setReportData] = useState({
    monthlyStats: {
      revenue: { current: 0, previous: 0, target: 5000, growth: 0 },
      orders: { current: 0, previous: 0, target: 10, growth: 0 },
      users: { current: 0, previous: 0, target: 10, growth: 0 },
      avgOrderValue: { current: 0, previous: 0, target: 500, growth: 0 },
    },
    weeklyBreakdown: [],
    topCategories: [],
    performanceMetrics: [],
    topProducts: [],
  });

  const months = [
    { value: '2026-10', label: 'October 2026 (Current)' },
    { value: '2026-09', label: 'September 2026' },
    { value: '2026-08', label: 'August 2026' },
    { value: '2026-07', label: 'July 2026' },
  ];

  const reportTypes = [
    { value: 'summary', label: 'Executive Summary' },
    { value: 'sales', label: 'Sales Report' },
    { value: 'users', label: 'User Analytics' },
    { value: 'products', label: 'Product Performance' },
  ];

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportService.getMonthlyReportData();
      setReportData(data);
    } catch (err) {
      console.error('Error loading monthly report:', err);
      setError(err.message || 'Failed to load report from Supabase');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReport();
  }, [fetchReport, selectedMonth]);

  const { monthlyStats, weeklyBreakdown, topCategories, performanceMetrics, topProducts } = reportData;

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-muted text-foreground border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'good':
        return <AlertCircle size={16} className="text-blue-600" />;
      case 'warning':
        return <XCircle size={16} className="text-yellow-600" />;
      default:
        return null;
    }
  };

  const calculateProgress = (current, target) => {
    if (!target) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const handleExportCSV = () => {
    const headers = ['Section,Item,Metric1,Metric2,Growth'];
    const prodRows = topProducts.map(
      (p) => `Top Product,"${p.name}",Units: ${p.sales},Revenue: ₹${p.revenue},${p.growth}%`
    );
    const catRows = topCategories.map(
      (c) => `Category,"${c.name}",Orders: ${c.orders},Revenue: ₹${c.revenue},${c.growth}%`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [...headers, ...prodRows, ...catRows].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `monthly_report_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const maxWeeklyRev = Math.max(1, ...weeklyBreakdown.map((w) => w.revenue));

  return (
    <div className="page-container space-y-6">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground mb-1">
                Monthly Reports
              </h1>
              <p className="text-sm text-muted-foreground">
                Live business performance synced with Supabase (`orders`, `products`, `users`)
              </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={fetchReport}
                className="flex items-center gap-2 px-3 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
                title="Refresh Data"
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
              >
                <Printer size={18} />
                Print
              </button>
              <button
                onClick={() => {
                  window.location.href = `mailto:?subject=Monthly Report (${selectedMonth})&body=Total Revenue: ₹${monthlyStats.revenue.current} | Total Orders: ${monthlyStats.orders.current}`;
                }}
                className="flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
              >
                <Mail size={18} />
                Email
              </button>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg hover:opacity-90 transition-colors"
              >
                <Download size={18} />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="card p-4 border-destructive/40 bg-destructive/10 text-destructive text-sm">
            <strong>Database Error:</strong> {error}
          </div>
        )}

        {/* Controls */}
        <div className="bg-card border border-border rounded-lg shadow-card p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-muted-foreground" />
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 sm:border-l sm:pl-4 border-border">
                <FileText size={20} className="text-muted-foreground" />
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {reportTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics with Goals */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-card border border-border rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-muted text-foreground rounded-lg">
                <DollarSign size={24} />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                <ArrowUpRight size={16} />
                {monthlyStats.revenue.growth}%
              </div>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">Total Revenue</h3>
            <p className="text-lg font-semibold tracking-tight text-foreground mb-3">
              {loading ? '…' : `₹${monthlyStats.revenue.current.toLocaleString()}`}
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Target: ₹{monthlyStats.revenue.target.toLocaleString()}</span>
                <span className="font-semibold">
                  {calculateProgress(monthlyStats.revenue.current, monthlyStats.revenue.target).toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${calculateProgress(monthlyStats.revenue.current, monthlyStats.revenue.target)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-muted text-foreground rounded-lg">
                <ShoppingCart size={24} />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                <ArrowUpRight size={16} />
                {monthlyStats.orders.growth}%
              </div>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">Total Orders</h3>
            <p className="text-lg font-semibold tracking-tight text-foreground mb-3">
              {loading ? '…' : monthlyStats.orders.current.toLocaleString()}
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Target: {monthlyStats.orders.target.toLocaleString()}</span>
                <span className="font-semibold">
                  {calculateProgress(monthlyStats.orders.current, monthlyStats.orders.target).toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-600 rounded-full transition-all duration-500"
                  style={{ width: `${calculateProgress(monthlyStats.orders.current, monthlyStats.orders.target)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-muted text-foreground rounded-lg">
                <Users size={24} />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                <ArrowUpRight size={16} />
                {monthlyStats.users.growth}%
              </div>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">Total Users</h3>
            <p className="text-lg font-semibold tracking-tight text-foreground mb-3">
              {loading ? '…' : monthlyStats.users.current.toLocaleString()}
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Target: {monthlyStats.users.target.toLocaleString()}</span>
                <span className="font-semibold">
                  {calculateProgress(monthlyStats.users.current, monthlyStats.users.target).toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${calculateProgress(monthlyStats.users.current, monthlyStats.users.target)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-muted text-foreground rounded-lg">
                <TrendingUp size={24} />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                <ArrowUpRight size={16} />
                {monthlyStats.avgOrderValue.growth}%
              </div>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">Avg Order Value</h3>
            <p className="text-lg font-semibold tracking-tight text-foreground mb-3">
              {loading ? '…' : `₹${monthlyStats.avgOrderValue.current.toLocaleString()}`}
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Target: ₹{monthlyStats.avgOrderValue.target}</span>
                <span className="font-semibold">
                  {calculateProgress(monthlyStats.avgOrderValue.current, monthlyStats.avgOrderValue.target).toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-600 rounded-full transition-all duration-500"
                  style={{ width: `${calculateProgress(monthlyStats.avgOrderValue.current, monthlyStats.avgOrderValue.target)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Breakdown */}
        <div className="bg-card border border-border rounded-lg shadow-card p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Weekly Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase">Week</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-foreground uppercase">Revenue</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-foreground uppercase">Orders</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-foreground uppercase">Users</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-foreground uppercase">Avg Order</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-foreground uppercase">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {weeklyBreakdown.map((week, index) => {
                  const pct = Math.min(100, Math.round((week.revenue / maxWeeklyRev) * 100));
                  return (
                    <tr key={index} className="hover:bg-muted transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{week.week}</td>
                      <td className="px-6 py-4 text-right font-semibold text-foreground">
                        ₹{week.revenue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right text-foreground">{week.orders}</td>
                      <td className="px-6 py-4 text-right text-foreground">{week.users}</td>
                      <td className="px-6 py-4 text-right text-foreground">₹{week.avgOrder}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-10 text-right">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Categories */}
          <div className="bg-card border border-border rounded-lg shadow-card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Top Categories (Live DB)</h2>
            <div className="space-y-4">
              {topCategories.map((category, index) => (
                <div key={index} className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-foreground">{category.name}</h3>
                    <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                      <TrendingUp size={16} />
                      {Math.abs(category.growth)}%
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                    <span>₹{category.revenue.toLocaleString()} inventory value</span>
                    <span>{category.orders} stock units</span>
                  </div>
                  <div className="h-2 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-card border border-border rounded-lg shadow-card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Performance Metrics</h2>
            <div className="space-y-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(metric.status)}
                    <div>
                      <p className="text-sm text-muted-foreground">{metric.metric}</p>
                      <p className="text-base font-semibold text-foreground">{metric.value}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(metric.status)}`}>
                      {metric.status.toUpperCase()}
                    </span>
                    <p className="text-sm text-green-600 font-semibold mt-1">{metric.change}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-card border border-border rounded-lg shadow-card p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Top Catalog Products (Live DB)</h2>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div key={product.id || index} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <div className="flex-shrink-0 w-10 h-10 bg-foreground rounded-lg flex items-center justify-center">
                  <span className="text-background font-bold">#{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.sales} units in stock/sold</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">₹{product.revenue.toLocaleString()}</p>
                  <div className="flex items-center justify-end gap-1 text-sm font-semibold text-green-600">
                    <TrendingUp size={14} />
                    {product.growth}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}