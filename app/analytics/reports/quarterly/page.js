'use client';

import React, { useState } from 'react';
import { Calendar, Download, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Target, ArrowUpRight, ArrowDownRight, ChevronLeft, ChevronRight, Award, Zap, AlertTriangle, CheckCircle, Printer, Mail, Share2, BarChart3, PieChart, Activity } from 'lucide-react';

export default function QuarterlyReports() {
  const [selectedQuarter, setSelectedQuarter] = useState('Q4-2024');
  const [comparisonMode, setComparisonMode] = useState('yoy'); // yoy = Year over Year, qoq = Quarter over Quarter

  const quarters = [
    { value: 'Q4-2024', label: 'Q4 2024 (Oct-Dec)', year: 2024 },
    { value: 'Q3-2024', label: 'Q3 2024 (Jul-Sep)', year: 2024 },
    { value: 'Q2-2024', label: 'Q2 2024 (Apr-Jun)', year: 2024 },
    { value: 'Q1-2024', label: 'Q1 2024 (Jan-Mar)', year: 2024 },
    { value: 'Q4-2023', label: 'Q4 2023 (Oct-Dec)', year: 2023 },
    { value: 'Q3-2023', label: 'Q3 2023 (Jul-Sep)', year: 2023 },
  ];

  const quarterlyStats = {
    revenue: {
      current: 1345600,
      previous: 1198400,
      yearAgo: 1089200,
      target: 1500000,
      growth: 12.3,
      yoyGrowth: 23.5
    },
    orders: {
      current: 9856,
      previous: 8924,
      yearAgo: 8102,
      target: 11000,
      growth: 10.4,
      yoyGrowth: 21.6
    },
    customers: {
      current: 48920,
      previous: 44210,
      yearAgo: 39850,
      target: 55000,
      growth: 10.7,
      yoyGrowth: 22.8
    },
    retention: {
      current: 89.5,
      previous: 87.2,
      yearAgo: 84.8,
      target: 92,
      growth: 2.6,
      yoyGrowth: 5.5
    }
  };

  const monthlyBreakdown = [
    { month: 'Month 1', revenue: 425300, orders: 3102, customers: 15280, growth: 8.5 },
    { month: 'Month 2', revenue: 458900, orders: 3340, customers: 16450, growth: 12.3 },
    { month: 'Month 3', revenue: 461400, orders: 3414, customers: 17190, growth: 14.8 },
  ];

  const departmentPerformance = [
    { 
      name: 'Sales', 
      revenue: 1345600, 
      target: 1500000, 
      achievement: 89.7,
      growth: 12.3,
      rating: 'excellent'
    },
    { 
      name: 'Marketing', 
      leads: 15680, 
      target: 18000, 
      achievement: 87.1,
      growth: 18.5,
      rating: 'good'
    },
    { 
      name: 'Customer Service', 
      satisfaction: 94.5, 
      target: 95, 
      achievement: 99.5,
      growth: 3.2,
      rating: 'excellent'
    },
    { 
      name: 'Product', 
      launches: 12, 
      target: 15, 
      achievement: 80,
      growth: 20,
      rating: 'good'
    },
  ];

  const quarterlyGoals = [
    { 
      goal: 'Revenue Target', 
      target: '$1.5M', 
      achieved: '$1.35M', 
      percentage: 89.7, 
      status: 'on-track',
      trend: 'up'
    },
    { 
      goal: 'Customer Acquisition', 
      target: '55K', 
      achieved: '48.9K', 
      percentage: 88.9, 
      status: 'on-track',
      trend: 'up'
    },
    { 
      goal: 'Market Expansion', 
      target: '10 Cities', 
      achieved: '7 Cities', 
      percentage: 70, 
      status: 'at-risk',
      trend: 'neutral'
    },
    { 
      goal: 'Product Launch', 
      target: '15 Products', 
      achieved: '12 Products', 
      percentage: 80, 
      status: 'on-track',
      trend: 'up'
    },
  ];

  const keyHighlights = [
    {
      title: 'Record Breaking Quarter',
      description: 'Achieved highest quarterly revenue in company history',
      icon: Award,
      type: 'success'
    },
    {
      title: 'Customer Growth',
      description: '23.5% YoY increase in customer base',
      icon: TrendingUp,
      type: 'success'
    },
    {
      title: 'Market Expansion',
      description: 'Successfully launched in 3 new markets',
      icon: Zap,
      type: 'info'
    },
    {
      title: 'Area of Improvement',
      description: 'Product launch targets not fully met',
      icon: AlertTriangle,
      type: 'warning'
    },
  ];

  const regionalPerformance = [
    { region: 'North America', revenue: 538240, percentage: 40, growth: 15.2, orders: 3942 },
    { region: 'Europe', revenue: 403680, percentage: 30, growth: 12.8, orders: 2957 },
    { region: 'Asia Pacific', revenue: 269120, percentage: 20, growth: 28.5, orders: 1971 },
    { region: 'Others', revenue: 134560, percentage: 10, growth: 8.7, orders: 986 },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'at-risk':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'off-track':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getRatingColor = (rating) => {
    switch (rating) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'average':
        return 'text-yellow-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const getHighlightStyle = (type) => {
    switch (type) {
      case 'success':
        return 'bg-muted border-green-200';
      case 'warning':
        return 'bg-muted border-orange-200';
      case 'info':
        return 'bg-muted border-blue-200';
      default:
        return 'bg-muted border-border';
    }
  };

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="page-container space-y-6">
      <div className="max-w-7xl mx-auto space-y-5">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground mb-2">Quarterly Reports</h1>
              <p className="text-muted-foreground">Comprehensive quarterly business performance analysis</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors">
                <Printer size={20} />
                Print
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors">
                <Mail size={20} />
                Email
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors">
                <Share2 size={20} />
                Share
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg hover:opacity-90 transition-colors">
                <Download size={20} />
                Export PDF
              </button>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg shadow-card p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-muted-foreground" />
                <select
                  value={selectedQuarter}
                  onChange={(e) => setSelectedQuarter(e.target.value)}
                  className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring"
                >
                  {quarters.map((quarter) => (
                    <option key={quarter.value} value={quarter.value}>
                      {quarter.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 border-l pl-4">
                <button
                  onClick={() => setComparisonMode('qoq')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    comparisonMode === 'qoq'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-muted text-foreground hover:bg-muted'
                  }`}
                >
                  QoQ Comparison
                </button>
                <button
                  onClick={() => setComparisonMode('yoy')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    comparisonMode === 'yoy'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-muted text-foreground hover:bg-muted'
                  }`}
                >
                  YoY Comparison
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="p-2 border border-border rounded-lg hover:bg-muted">
                <ChevronLeft size={20} />
              </button>
              <button className="p-2 border border-border rounded-lg hover:bg-muted">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-card border border-border rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-muted text-foreground rounded-lg">
                <DollarSign size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-semibold ${
                (comparisonMode === 'qoq' ? quarterlyStats.revenue.growth : quarterlyStats.revenue.yoyGrowth) > 0 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                <ArrowUpRight size={16} />
                {comparisonMode === 'qoq' ? quarterlyStats.revenue.growth : quarterlyStats.revenue.yoyGrowth}%
              </div>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">Quarterly Revenue</h3>
            <p className="text-lg font-semibold tracking-tight text-foreground mb-3">
              ${(quarterlyStats.revenue.current / 1000).toFixed(1)}M
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Target: ${(quarterlyStats.revenue.target / 1000).toFixed(1)}M</span>
                <span className="font-semibold">{calculateProgress(quarterlyStats.revenue.current, quarterlyStats.revenue.target).toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${calculateProgress(quarterlyStats.revenue.current, quarterlyStats.revenue.target)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-muted text-foreground rounded-lg">
                <ShoppingCart size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-semibold ${
                (comparisonMode === 'qoq' ? quarterlyStats.orders.growth : quarterlyStats.orders.yoyGrowth) > 0 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                <ArrowUpRight size={16} />
                {comparisonMode === 'qoq' ? quarterlyStats.orders.growth : quarterlyStats.orders.yoyGrowth}%
              </div>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">Total Orders</h3>
            <p className="text-lg font-semibold tracking-tight text-foreground mb-3">
              {quarterlyStats.orders.current.toLocaleString()}
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Target: {quarterlyStats.orders.target.toLocaleString()}</span>
                <span className="font-semibold">{calculateProgress(quarterlyStats.orders.current, quarterlyStats.orders.target).toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                  style={{ width: `${calculateProgress(quarterlyStats.orders.current, quarterlyStats.orders.target)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-muted text-foreground rounded-lg">
                <Users size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-semibold ${
                (comparisonMode === 'qoq' ? quarterlyStats.customers.growth : quarterlyStats.customers.yoyGrowth) > 0 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                <ArrowUpRight size={16} />
                {comparisonMode === 'qoq' ? quarterlyStats.customers.growth : quarterlyStats.customers.yoyGrowth}%
              </div>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">Total Customers</h3>
            <p className="text-lg font-semibold tracking-tight text-foreground mb-3">
              {(quarterlyStats.customers.current / 1000).toFixed(1)}K
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Target: {(quarterlyStats.customers.target / 1000).toFixed(0)}K</span>
                <span className="font-semibold">{calculateProgress(quarterlyStats.customers.current, quarterlyStats.customers.target).toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${calculateProgress(quarterlyStats.customers.current, quarterlyStats.customers.target)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-muted text-foreground rounded-lg">
                <Target size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-semibold ${
                (comparisonMode === 'qoq' ? quarterlyStats.retention.growth : quarterlyStats.retention.yoyGrowth) > 0 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                <ArrowUpRight size={16} />
                {comparisonMode === 'qoq' ? quarterlyStats.retention.growth : quarterlyStats.retention.yoyGrowth}%
              </div>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">Retention Rate</h3>
            <p className="text-lg font-semibold tracking-tight text-foreground mb-3">
              {quarterlyStats.retention.current}%
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Target: {quarterlyStats.retention.target}%</span>
                <span className="font-semibold">{calculateProgress(quarterlyStats.retention.current, quarterlyStats.retention.target).toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500"
                  style={{ width: `${calculateProgress(quarterlyStats.retention.current, quarterlyStats.retention.target)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-card border border-border rounded-lg shadow-card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Key Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {keyHighlights.map((highlight, index) => {
                const Icon = highlight.icon;
                return (
                  <div key={index} className={`p-4 border rounded-lg ${getHighlightStyle(highlight.type)}`}>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-card rounded-lg shadow-sm">
                        <Icon size={20} className={getRatingColor(highlight.type === 'success' ? 'excellent' : highlight.type === 'warning' ? 'average' : 'good')} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{highlight.title}</h3>
                        <p className="text-sm text-muted-foreground">{highlight.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg shadow-card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Monthly Breakdown</h2>
            <div className="space-y-4">
              {monthlyBreakdown.map((month, index) => (
                <div key={index} className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-foreground">{month.month}</h3>
                    <div className={`flex items-center gap-1 text-sm font-semibold ${
                      month.growth > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {month.growth > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {month.growth}%
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Revenue</span>
                      <span className="font-semibold">${(month.revenue / 1000).toFixed(1)}K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Orders</span>
                      <span className="font-semibold">{month.orders.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Customers</span>
                      <span className="font-semibold">{(month.customers / 1000).toFixed(1)}K</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-card border border-border rounded-lg shadow-card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Quarterly Goals</h2>
            <div className="space-y-4">
              {quarterlyGoals.map((goal, index) => (
                <div key={index} className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-foreground">{goal.goal}</h3>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(goal.status)}`}>
                      {goal.status.toUpperCase().replace('-', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Achieved: {goal.achieved}</span>
                    <span className="text-muted-foreground">Target: {goal.target}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">{goal.percentage}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          goal.status === 'on-track' ? 'bg-muted0' : goal.status === 'at-risk' ? 'bg-muted0' : 'bg-muted0'
                        }`}
                        style={{ width: `${goal.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg shadow-card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Department Performance</h2>
            <div className="space-y-4">
              {departmentPerformance.map((dept, index) => (
                <div key={index} className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{dept.name}</h3>
                      <p className="text-sm text-muted-foreground">Achievement: {dept.achievement}%</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-lg font-semibold tracking-tight ${getRatingColor(dept.rating)}`}>
                        {dept.rating === 'excellent' ? '⭐' : dept.rating === 'good' ? '✓' : '○'}
                      </span>
                      <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                        <TrendingUp size={14} />
                        {dept.growth}%
                      </div>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        dept.rating === 'excellent' ? 'bg-muted0' : 'bg-muted0'
                      }`}
                      style={{ width: `${dept.achievement}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg shadow-card p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Regional Performance</h2>
          <div className="space-y-4">
            {regionalPerformance.map((region, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground">{region.region}</h3>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">{region.orders.toLocaleString()} orders</span>
                      <span className="font-bold text-foreground">${(region.revenue / 1000).toFixed(0)}K</span>
                      <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                        <TrendingUp size={14} />
                        {region.growth}%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${region.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-foreground w-12 text-right">
                      {region.percentage}%
                    </span>
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