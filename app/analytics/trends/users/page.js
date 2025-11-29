'use client';

import React, { useState } from 'react';
import { Users, UserPlus, UserMinus, Activity, Clock, Globe, Smartphone, Monitor, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Download, Filter, Calendar, Eye, MousePointer, LogIn, LogOut } from 'lucide-react';

export default function UserTrends() {
  const [timeRange, setTimeRange] = useState('7days');
  const [selectedMetric, setSelectedMetric] = useState('activeUsers');

  const userData = {
    '7days': [
      { date: 'Mon', activeUsers: 1250, newUsers: 45, returningUsers: 1205, avgSession: 12 },
      { date: 'Tue', activeUsers: 1420, newUsers: 67, returningUsers: 1353, avgSession: 14 },
      { date: 'Wed', activeUsers: 1380, newUsers: 52, returningUsers: 1328, avgSession: 13 },
      { date: 'Thu', activeUsers: 1680, newUsers: 89, returningUsers: 1591, avgSession: 15 },
      { date: 'Fri', activeUsers: 1890, newUsers: 102, returningUsers: 1788, avgSession: 16 },
      { date: 'Sat', activeUsers: 2100, newUsers: 125, returningUsers: 1975, avgSession: 18 },
      { date: 'Sun', activeUsers: 1750, newUsers: 78, returningUsers: 1672, avgSession: 14 },
    ],
    '30days': [
      { date: 'Week 1', activeUsers: 5200, newUsers: 280, returningUsers: 4920, avgSession: 13 },
      { date: 'Week 2', activeUsers: 6100, newUsers: 340, returningUsers: 5760, avgSession: 15 },
      { date: 'Week 3', activeUsers: 5800, newUsers: 310, returningUsers: 5490, avgSession: 14 },
      { date: 'Week 4', activeUsers: 6800, newUsers: 420, returningUsers: 6380, avgSession: 16 },
    ],
    '90days': [
      { date: 'Month 1', activeUsers: 22000, newUsers: 1200, returningUsers: 20800, avgSession: 14 },
      { date: 'Month 2', activeUsers: 25500, newUsers: 1580, returningUsers: 23920, avgSession: 15 },
      { date: 'Month 3', activeUsers: 24800, newUsers: 1420, returningUsers: 23380, avgSession: 14 },
    ],
  };

  const topCountries = [
    { name: 'United States', users: 12450, percentage: 32, growth: 8.5, flag: '🇺🇸' },
    { name: 'United Kingdom', users: 8920, percentage: 23, growth: 12.3, flag: '🇬🇧' },
    { name: 'Canada', users: 6780, percentage: 18, growth: 5.7, flag: '🇨🇦' },
    { name: 'Germany', users: 5230, percentage: 13, growth: -2.1, flag: '🇩🇪' },
    { name: 'Australia', users: 3890, percentage: 10, growth: 15.8, flag: '🇦🇺' },
    { name: 'Others', users: 1580, percentage: 4, growth: 3.2, flag: '🌍' },
  ];

  const deviceStats = [
    { name: 'Desktop', users: 18450, percentage: 48, icon: Monitor, color: 'blue' },
    { name: 'Mobile', users: 14230, percentage: 37, icon: Smartphone, color: 'green' },
    { name: 'Tablet', users: 5770, percentage: 15, icon: Activity, color: 'purple' },
  ];

  const userBehavior = [
    { metric: 'Avg Session Duration', value: '14m 32s', change: '+8.2%', trend: 'up', icon: Clock },
    { metric: 'Pages per Session', value: '5.8', change: '+12.5%', trend: 'up', icon: Eye },
    { metric: 'Bounce Rate', value: '32.4%', change: '-5.3%', trend: 'up', icon: MousePointer },
    { metric: 'Daily Active Users', value: '1,847', change: '+15.7%', trend: 'up', icon: Activity },
  ];

  const currentData = userData[timeRange];
  const maxValue = Math.max(...currentData.map(d => d[selectedMetric]));

  const stats = [
    {
      title: 'Total Users',
      value: '38,450',
      change: '+15.2%',
      trend: 'up',
      icon: Users,
      color: 'blue',
      description: 'All registered users'
    },
    {
      title: 'New Users',
      value: '548',
      change: '+23.1%',
      trend: 'up',
      icon: UserPlus,
      color: 'green',
      description: 'This week'
    },
    {
      title: 'Active Users',
      value: '12,847',
      change: '+18.5%',
      trend: 'up',
      icon: Activity,
      color: 'purple',
      description: 'Last 7 days'
    },
    {
      title: 'Churn Rate',
      value: '3.2%',
      change: '-1.8%',
      trend: 'up',
      icon: UserMinus,
      color: 'orange',
      description: 'Monthly average'
    },
  ];

  const timeRanges = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
  ];

  const metrics = [
    { value: 'activeUsers', label: 'Active Users', color: 'blue' },
    { value: 'newUsers', label: 'New Users', color: 'green' },
    { value: 'returningUsers', label: 'Returning Users', color: 'purple' },
    { value: 'avgSession', label: 'Avg Session (min)', color: 'orange' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">User Trends</h1>
              <p className="text-gray-600">Monitor user behavior and engagement patterns</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter size={20} />
                Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download size={20} />
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-600',
              green: 'bg-green-100 text-green-600',
              purple: 'bg-purple-100 text-purple-600',
              orange: 'bg-orange-100 text-orange-600',
            };
            
            return (
              <div key={index} className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                    <Icon size={24} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-semibold ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-sm text-gray-600 mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">User Growth Trends</h2>
            <div className="flex gap-3">
              <div className="flex gap-2">
                {timeRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setTimeRange(range.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      timeRange === range.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mb-6">
            {metrics.map((metric) => (
              <button
                key={metric.value}
                onClick={() => setSelectedMetric(metric.value)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  selectedMetric === metric.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-3 h-3 rounded-full bg-${metric.color}-500`}></div>
                <span className="font-medium text-sm">{metric.label}</span>
              </button>
            ))}
          </div>

          <div className="h-80 relative">
            <div className="absolute left-0 top-0 bottom-8 w-16 flex flex-col justify-between text-xs text-gray-500">
              <span>{(maxValue * 1.2).toFixed(0)}</span>
              <span>{(maxValue * 0.8).toFixed(0)}</span>
              <span>{(maxValue * 0.4).toFixed(0)}</span>
              <span>0</span>
            </div>

            <div className="ml-16 h-full flex items-end gap-2 pb-8 border-l-2 border-b-2 border-gray-200">
              {currentData.map((data, index) => {
                const height = (data[selectedMetric] / maxValue) * 100;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex items-end justify-center" style={{ height: '100%' }}>
                      <div className="w-full relative" style={{ height: '100%' }}>
                        <div
                          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg hover:scale-125 transition-transform cursor-pointer group"
                          style={{ bottom: `${height}%` }}
                        >
                          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {data[selectedMetric].toLocaleString()}
                          </div>
                        </div>
                        {index > 0 && (
                          <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <line
                              x1="0%"
                              y1={`${100 - (currentData[index - 1][selectedMetric] / maxValue) * 100}%`}
                              x2="100%"
                              y2={`${100 - height}%`}
                              stroke="#2563eb"
                              strokeWidth="3"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    
                    <span className="text-xs text-gray-600 font-medium">{data.date}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">User Behavior Metrics</h2>
            <div className="space-y-4">
              {userBehavior.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                        <Icon size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{item.metric}</p>
                        <p className="text-xl font-bold text-gray-900">{item.value}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-semibold ${
                      item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      {item.change}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Device Distribution</h2>
            <div className="space-y-6">
              {deviceStats.map((device, index) => {
                const Icon = device.icon;
                const colorClasses = {
                  blue: 'bg-blue-500',
                  green: 'bg-green-500',
                  purple: 'bg-purple-500',
                };
                
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Icon size={20} className="text-gray-600" />
                        <span className="font-medium text-gray-900">{device.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{device.users.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{device.percentage}% of total</p>
                      </div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colorClasses[device.color]} transition-all duration-500`}
                        style={{ width: `${device.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Total Active Devices</span>
                <span className="text-xl font-bold text-gray-900">
                  {deviceStats.reduce((sum, device) => sum + device.users, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Users by Location</h2>
          <div className="space-y-4">
            {topCountries.map((country, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-3xl">
                  {country.flag}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{country.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">{country.users.toLocaleString()} users</span>
                      <div className={`flex items-center gap-1 text-sm font-semibold ${
                        country.growth > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {country.growth > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {Math.abs(country.growth)}%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                        style={{ width: `${country.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                      {country.percentage}%
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