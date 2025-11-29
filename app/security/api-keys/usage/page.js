'use client';
import { useState } from 'react';
import { Key, Activity, TrendingUp, TrendingDown, AlertCircle, CheckCircle, XCircle, Clock, Globe, Zap, Shield, Lock, Unlock, Eye, EyeOff, Copy, RotateCw, Calendar, BarChart3, Filter, Download, RefreshCw, MapPin, Server, Cpu, Database } from 'lucide-react';

export default function KeyUsagePage() {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [selectedKey, setSelectedKey] = useState(null);
  const [showKey, setShowKey] = useState({});

  const periods = [
    { value: '24hours', label: 'Last 24 Hours' },
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: 'custom', label: 'Custom Range' },
  ];

  const usageStats = [
    { 
      label: 'Total API Calls', 
      value: '1,247,893', 
      change: '+12.5%',
      trend: 'up',
      icon: Activity, 
      color: 'from-blue-500 to-indigo-600', 
      bgColor: 'bg-blue-50', 
      textColor: 'text-blue-600' 
    },
    { 
      label: 'Success Rate', 
      value: '99.7%', 
      change: '+0.3%',
      trend: 'up',
      icon: CheckCircle, 
      color: 'from-emerald-500 to-teal-600', 
      bgColor: 'bg-emerald-50', 
      textColor: 'text-emerald-600' 
    },
    { 
      label: 'Failed Requests', 
      value: '3,745', 
      change: '-8.2%',
      trend: 'down',
      icon: AlertCircle, 
      color: 'from-orange-500 to-red-600', 
      bgColor: 'bg-orange-50', 
      textColor: 'text-orange-600' 
    },
    { 
      label: 'Avg Response Time', 
      value: '127ms', 
      change: '-15ms',
      trend: 'down',
      icon: Zap, 
      color: 'from-purple-500 to-pink-600', 
      bgColor: 'bg-purple-50', 
      textColor: 'text-purple-600' 
    },
  ];

  const apiKeys = [
    {
      id: 1,
      name: 'Production API Key',
      key: 'sk_prod_A8f2K9mN3pQ7rX1vZ4bC6dE8hJ0lM2nO',
      status: 'active',
      created: '2024-01-15',
      lastUsed: '2 minutes ago',
      totalCalls: 847293,
      callsToday: 12847,
      successRate: 99.8,
      failedCalls: 1694,
      avgResponseTime: 118,
      rateLimit: '10,000/hour',
      currentUsage: 8543,
      topEndpoints: [
        { endpoint: '/api/v1/users', calls: 234567, percentage: 28 },
        { endpoint: '/api/v1/products', calls: 189234, percentage: 22 },
        { endpoint: '/api/v1/orders', calls: 145678, percentage: 17 },
      ],
      geographicUsage: [
        { country: 'India', calls: 423567, flag: '🇮🇳' },
        { country: 'USA', calls: 234890, flag: '🇺🇸' },
        { country: 'UK', calls: 123456, flag: '🇬🇧' },
      ]
    },
    {
      id: 2,
      name: 'Development API Key',
      key: 'sk_dev_B3g7L4pR8tS2wY6zA9cE1fH5kM7nP0qT',
      status: 'active',
      created: '2024-02-01',
      lastUsed: '15 minutes ago',
      totalCalls: 287456,
      callsToday: 4567,
      successRate: 98.9,
      failedCalls: 3162,
      avgResponseTime: 145,
      rateLimit: '5,000/hour',
      currentUsage: 2341,
      topEndpoints: [
        { endpoint: '/api/v1/test', calls: 98765, percentage: 34 },
        { endpoint: '/api/v1/debug', calls: 76543, percentage: 27 },
        { endpoint: '/api/v1/mock', calls: 54321, percentage: 19 },
      ],
      geographicUsage: [
        { country: 'India', calls: 187456, flag: '🇮🇳' },
        { country: 'Singapore', calls: 65000, flag: '🇸🇬' },
        { country: 'Australia', calls: 35000, flag: '🇦🇺' },
      ]
    },
    {
      id: 3,
      name: 'Analytics API Key',
      key: 'sk_analytics_C9h2M5qT1uV8xA3bD6eF0gJ4lN7pR2s',
      status: 'warning',
      created: '2024-03-10',
      lastUsed: '5 hours ago',
      totalCalls: 113144,
      callsToday: 1456,
      successRate: 99.5,
      failedCalls: 566,
      avgResponseTime: 89,
      rateLimit: '2,000/hour',
      currentUsage: 1823,
      topEndpoints: [
        { endpoint: '/api/v1/analytics', calls: 67890, percentage: 60 },
        { endpoint: '/api/v1/reports', calls: 34567, percentage: 31 },
        { endpoint: '/api/v1/metrics', calls: 10687, percentage: 9 },
      ],
      geographicUsage: [
        { country: 'India', calls: 78900, flag: '🇮🇳' },
        { country: 'UAE', calls: 23444, flag: '🇦🇪' },
        { country: 'Germany', calls: 10800, flag: '🇩🇪' },
      ]
    },
  ];

  const recentActivity = [
    { endpoint: '/api/v1/users/create', method: 'POST', status: 'success', responseTime: 142, timestamp: '2s ago', ip: '192.168.1.1' },
    { endpoint: '/api/v1/products/list', method: 'GET', status: 'success', responseTime: 98, timestamp: '5s ago', ip: '192.168.1.2' },
    { endpoint: '/api/v1/orders/update', method: 'PUT', status: 'success', responseTime: 156, timestamp: '12s ago', ip: '192.168.1.3' },
    { endpoint: '/api/v1/auth/token', method: 'POST', status: 'error', responseTime: 523, timestamp: '18s ago', ip: '192.168.1.4' },
    { endpoint: '/api/v1/payments/verify', method: 'GET', status: 'success', responseTime: 201, timestamp: '25s ago', ip: '192.168.1.5' },
  ];

  const getStatusConfig = (status) => {
    const configs = {
      'active': {
        badge: 'bg-emerald-100 text-emerald-700',
        icon: CheckCircle,
        text: 'Active',
        color: 'emerald'
      },
      'warning': {
        badge: 'bg-orange-100 text-orange-700',
        icon: AlertCircle,
        text: 'Near Limit',
        color: 'orange'
      },
      'inactive': {
        badge: 'bg-slate-100 text-slate-700',
        icon: Lock,
        text: 'Inactive',
        color: 'slate'
      }
    };
    return configs[status] || configs.active;
  };

  const toggleKeyVisibility = (keyId) => {
    setShowKey(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Add toast notification here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                API Key Usage
              </h1>
              <Shield className="w-8 h-8 text-indigo-600" />
            </div>
            <p className="text-slate-600">Monitor and analyze API key performance</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors bg-white cursor-pointer font-semibold"
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>{period.label}</option>
              ))}
            </select>
            <button className="flex items-center gap-2 bg-white text-slate-700 px-4 py-3 rounded-xl hover:shadow-lg transition-all duration-300 border border-slate-200">
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300">
              <RefreshCw className="w-5 h-5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {usageStats.map((stat, index) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
            return (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.bgColor} w-12 h-12 rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-semibold ${
                    stat.trend === 'up' ? 'text-emerald-600' : 'text-orange-600'
                  }`}>
                    <TrendIcon className="w-4 h-4" />
                    {stat.change}
                  </span>
                </div>
                <p className="text-slate-600 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* API Keys Cards */}
        <div className="space-y-4">
          {apiKeys.map((apiKey) => {
            const statusConfig = getStatusConfig(apiKey.status);
            const StatusIcon = statusConfig.icon;
            const usagePercentage = (apiKey.currentUsage / parseInt(apiKey.rateLimit.split('/')[0].replace(',', ''))) * 100;

            return (
              <div 
                key={apiKey.id}
                className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-3 rounded-xl">
                          <Key className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-800">{apiKey.name}</h3>
                          <p className="text-sm text-slate-500">Created: {apiKey.created}</p>
                        </div>
                        <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.badge}`}>
                          <StatusIcon className="w-4 h-4" />
                          {statusConfig.text}
                        </span>
                      </div>

                      {/* API Key Display */}
                      <div className="bg-slate-50 rounded-xl p-4 mb-4">
                        <div className="flex items-center justify-between">
                          <code className="text-sm font-mono text-slate-700 flex-1">
                            {showKey[apiKey.id] ? apiKey.key : '•'.repeat(40)}
                          </code>
                          <div className="flex items-center gap-2 ml-4">
                            <button 
                              onClick={() => toggleKeyVisibility(apiKey.id)}
                              className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                              {showKey[apiKey.id] ? (
                                <EyeOff className="w-4 h-4 text-slate-600" />
                              ) : (
                                <Eye className="w-4 h-4 text-slate-600" />
                              )}
                            </button>
                            <button 
                              onClick={() => copyToClipboard(apiKey.key)}
                              className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                              <Copy className="w-4 h-4 text-slate-600" />
                            </button>
                            <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                              <RotateCw className="w-4 h-4 text-slate-600" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Quick Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-xs text-slate-600 mb-1">Total Calls</p>
                          <p className="text-lg font-bold text-slate-800">{apiKey.totalCalls.toLocaleString()}</p>
                        </div>
                        <div className="bg-emerald-50 rounded-lg p-3">
                          <p className="text-xs text-slate-600 mb-1">Success Rate</p>
                          <p className="text-lg font-bold text-emerald-600">{apiKey.successRate}%</p>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-3">
                          <p className="text-xs text-slate-600 mb-1">Failed Calls</p>
                          <p className="text-lg font-bold text-orange-600">{apiKey.failedCalls.toLocaleString()}</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3">
                          <p className="text-xs text-slate-600 mb-1">Avg Response</p>
                          <p className="text-lg font-bold text-purple-600">{apiKey.avgResponseTime}ms</p>
                        </div>
                      </div>

                      {/* Rate Limit Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-600">Rate Limit Usage</span>
                          <span className="font-semibold text-slate-800">
                            {apiKey.currentUsage.toLocaleString()} / {apiKey.rateLimit}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              usagePercentage >= 90 ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                              usagePercentage >= 70 ? 'bg-gradient-to-r from-orange-500 to-yellow-500' :
                              'bg-gradient-to-r from-emerald-500 to-teal-600'
                            }`}
                            style={{ width: `${usagePercentage}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {usagePercentage.toFixed(1)}% of hourly limit used
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Stats Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Endpoints */}
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-4">
                      <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <Server className="w-5 h-5 text-blue-600" />
                        Top Endpoints
                      </h4>
                      <div className="space-y-3">
                        {apiKey.topEndpoints.map((endpoint, idx) => (
                          <div key={idx}>
                            <div className="flex justify-between text-sm mb-1">
                              <code className="text-slate-700 font-mono text-xs">{endpoint.endpoint}</code>
                              <span className="font-semibold text-slate-800">{endpoint.calls.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                                style={{ width: `${endpoint.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Geographic Usage */}
                    <div className="bg-gradient-to-br from-slate-50 to-purple-50 rounded-xl p-4">
                      <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-purple-600" />
                        Geographic Distribution
                      </h4>
                      <div className="space-y-3">
                        {apiKey.geographicUsage.map((geo, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{geo.flag}</span>
                              <span className="font-semibold text-slate-800">{geo.country}</span>
                            </div>
                            <span className="text-sm font-bold text-purple-600">{geo.calls.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Activity className="w-7 h-7 text-indigo-600" />
              Recent API Activity
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b-2 border-slate-200">
                  <th className="text-left py-4 px-6 text-slate-700 font-semibold">Endpoint</th>
                  <th className="text-left py-4 px-6 text-slate-700 font-semibold">Method</th>
                  <th className="text-left py-4 px-6 text-slate-700 font-semibold">Status</th>
                  <th className="text-left py-4 px-6 text-slate-700 font-semibold">Response Time</th>
                  <th className="text-left py-4 px-6 text-slate-700 font-semibold">IP Address</th>
                  <th className="text-left py-4 px-6 text-slate-700 font-semibold">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((activity, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <code className="text-sm font-mono text-slate-700">{activity.endpoint}</code>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        activity.method === 'GET' ? 'bg-blue-100 text-blue-700' :
                        activity.method === 'POST' ? 'bg-emerald-100 text-emerald-700' :
                        activity.method === 'PUT' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {activity.method}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`flex items-center gap-1 ${
                        activity.status === 'success' ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {activity.status === 'success' ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        <span className="font-semibold capitalize">{activity.status}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`font-bold ${
                        activity.responseTime < 200 ? 'text-emerald-600' :
                        activity.responseTime < 400 ? 'text-orange-600' :
                        'text-red-600'
                      }`}>
                        {activity.responseTime}ms
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-sm text-slate-600">{activity.ip}</td>
                    <td className="py-4 px-6 text-slate-600">{activity.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}