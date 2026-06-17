'use client';

import React, { useState } from 'react';
import { Key, Eye, EyeOff, Copy, RefreshCw, Trash2, Lock, Unlock, Plus, Search, Filter, Download, BarChart3, Clock, AlertCircle, CheckCircle, TrendingUp, Calendar, Settings, Activity, Shield, Terminal, Code } from 'lucide-react';

export default function ActiveKeys() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterScope, setFilterScope] = useState('all');
  const [selectedKey, setSelectedKey] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState({});

  const [apiKeys, setApiKeys] = useState([
    {
      id: 1,
      name: 'Production API',
      key: 'sk_prod_1a2b3c4d5e6f7g8h9i0j',
      prefix: 'sk_prod_',
      scope: 'Full Access',
      environment: 'Production',
      created: '2024-08-01',
      expires: '2025-08-01',
      lastUsed: '2 minutes ago',
      requests: 1250000,
      rateLimit: '10000/hour',
      status: 'active',
      createdBy: 'Admin',
      ipRestriction: 'Enabled',
      allowedIPs: ['192.168.1.0/24', '10.0.0.0/8']
    },
    {
      id: 2,
      name: 'Mobile App Integration',
      key: 'sk_mobile_9z8y7x6w5v4u3t2s1r0q',
      prefix: 'sk_mobile_',
      scope: 'Read Only',
      environment: 'Production',
      created: '2024-09-15',
      expires: '2025-09-15',
      lastUsed: '15 minutes ago',
      requests: 450000,
      rateLimit: '5000/hour',
      status: 'active',
      createdBy: 'Tech Lead',
      ipRestriction: 'Disabled',
      allowedIPs: []
    },
    {
      id: 3,
      name: 'Development Environment',
      key: 'sk_dev_p9o8i7u6y5t4r3e2w1q0',
      prefix: 'sk_dev_',
      scope: 'Limited',
      environment: 'Development',
      created: '2024-10-01',
      expires: '2025-10-01',
      lastUsed: '1 hour ago',
      requests: 89000,
      rateLimit: '1000/hour',
      status: 'active',
      createdBy: 'Developer',
      ipRestriction: 'Enabled',
      allowedIPs: ['172.16.0.0/16']
    },
    {
      id: 4,
      name: 'Third-Party Integration',
      key: 'sk_3rd_a1s2d3f4g5h6j7k8l9m0',
      prefix: 'sk_3rd_',
      scope: 'Custom',
      environment: 'Production',
      created: '2024-07-20',
      expires: '2025-07-20',
      lastUsed: '3 hours ago',
      requests: 678000,
      rateLimit: '3000/hour',
      status: 'active',
      createdBy: 'Integration Team',
      ipRestriction: 'Enabled',
      allowedIPs: ['203.45.67.89']
    },
    {
      id: 5,
      name: 'Testing Suite',
      key: 'sk_test_m9n8b7v6c5x4z3l2k1j0',
      prefix: 'sk_test_',
      scope: 'Full Access',
      environment: 'Testing',
      created: '2024-10-10',
      expires: '2025-10-10',
      lastUsed: '5 hours ago',
      requests: 125000,
      rateLimit: '2000/hour',
      status: 'active',
      createdBy: 'QA Team',
      ipRestriction: 'Disabled',
      allowedIPs: []
    }
  ]);

  const stats = [
    {
      title: 'Total Active Keys',
      value: apiKeys.length,
      change: '+2',
      trend: 'up',
      icon: Key,
      color: 'blue'
    },
    {
      title: 'Total API Calls',
      value: `${(apiKeys.reduce((sum, key) => sum + key.requests, 0) / 1000000).toFixed(1)}M`,
      change: '+18.5%',
      trend: 'up',
      icon: Activity,
      color: 'green'
    },
    {
      title: 'Keys Expiring Soon',
      value: '2',
      change: 'Next 30 days',
      trend: 'neutral',
      icon: AlertCircle,
      color: 'orange'
    },
    {
      title: 'Avg Response Time',
      value: '124ms',
      change: '-5.2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'purple'
    }
  ];

  const toggleKeyVisibility = (keyId) => {
    setVisibleKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('API key copied to clipboard!');
  };

  const getScopeColor = (scope) => {
    switch (scope) {
      case 'Full Access': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Read Only': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Limited': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Custom': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-muted text-foreground border-border';
    }
  };

  const getEnvironmentColor = (env) => {
    switch (env) {
      case 'Production': return 'bg-red-100 text-red-800 border-red-200';
      case 'Development': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Testing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-muted text-foreground border-border';
    }
  };

  const maskKey = (key) => {
    if (!key) return '';
    return key.substring(0, 10) + '••••••••••••';
  };

  const calculateDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredKeys = apiKeys.filter(key => {
    const matchesSearch = key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         key.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         key.environment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesScope = filterScope === 'all' || key.scope === filterScope;
    return matchesSearch && matchesScope;
  });

  return (
    <div className="page-container space-y-6">
      <div className="max-w-7xl mx-auto space-y-5">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground mb-2">Active API Keys</h1>
              <p className="text-muted-foreground">Manage and monitor your active API keys and usage</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
                <Download size={20} />
                Export
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg hover:opacity-90 transition-colors"
              >
                <Plus size={20} />
                Generate New Key
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: 'bg-muted text-foreground',
              green: 'bg-muted text-foreground',
              orange: 'bg-muted text-foreground',
              purple: 'bg-muted text-foreground',
            };

            return (
              <div key={index} className="bg-card border border-border rounded-lg shadow-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                    <Icon size={24} />
                  </div>
                  {stat.trend !== 'neutral' && (
                    <div className={`flex items-center gap-1 text-sm font-semibold ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp size={16} />
                      {stat.change}
                    </div>
                  )}
                  {stat.trend === 'neutral' && (
                    <span className="text-xs text-muted-foreground">{stat.change}</span>
                  )}
                </div>
                <h3 className="text-sm text-muted-foreground mb-1">{stat.title}</h3>
                <p className="text-lg font-semibold tracking-tight text-foreground">{stat.value}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-card border border-border rounded-lg shadow-card p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Search API keys..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring"
              />
            </div>
            <select
              value={filterScope}
              onChange={(e) => setFilterScope(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="all">All Scopes</option>
              <option value="Full Access">Full Access</option>
              <option value="Read Only">Read Only</option>
              <option value="Limited">Limited</option>
              <option value="Custom">Custom</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
              <Filter size={20} />
              More Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {filteredKeys.map((key) => {
              const isVisible = visibleKeys[key.id];
              const daysUntilExpiry = calculateDaysUntilExpiry(key.expires);

              return (
                <div
                  key={key.id}
                  className={`bg-card rounded-lg shadow border-2 transition-all ${
                    selectedKey?.id === key.id ? 'border-blue-500' : 'border-border'
                  }`}
                  onClick={() => setSelectedKey(key)}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-foreground rounded-lg flex items-center justify-center">
                        <Key size={24} className="text-background" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-base font-semibold text-foreground">{key.name}</h3>
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getScopeColor(key.scope)}`}>
                            {key.scope}
                          </span>
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getEnvironmentColor(key.environment)}`}>
                            {key.environment}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <code className="px-3 py-1.5 bg-foreground text-green-400 text-sm font-mono rounded">
                            {isVisible ? key.key : maskKey(key.key)}
                          </code>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleKeyVisibility(key.id);
                            }}
                            className="p-1.5 text-muted-foreground hover:bg-muted rounded transition-colors"
                            title={isVisible ? 'Hide' : 'Show'}
                          >
                            {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(key.key);
                            }}
                            className="p-1.5 text-muted-foreground hover:bg-muted rounded transition-colors"
                            title="Copy"
                          >
                            <Copy size={18} />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Activity size={16} />
                            <span><span className="font-semibold">{key.requests.toLocaleString()}</span> requests</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <BarChart3 size={16} />
                            <span>Limit: <span className="font-semibold">{key.rateLimit}</span></span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock size={16} />
                            <span>Last used: <span className="font-semibold">{key.lastUsed}</span></span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar size={16} />
                            <span>Expires in: <span className={`font-semibold ${daysUntilExpiry < 30 ? 'text-orange-600' : 'text-foreground'}`}>
                              {daysUntilExpiry} days
                            </span></span>
                          </div>
                        </div>

                        {key.ipRestriction === 'Enabled' && (
                          <div className="p-3 bg-muted border border-blue-200 rounded-lg mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Shield size={16} className="text-blue-600" />
                              <span className="text-sm font-semibold text-blue-900">IP Restriction Enabled</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {key.allowedIPs.map((ip, idx) => (
                                <code key={idx} className="px-2 py-1 bg-card text-blue-700 text-xs font-mono rounded border border-blue-200">
                                  {ip}
                                </code>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="text-xs text-muted-foreground">
                            Created by {key.createdBy} on {new Date(key.created).toLocaleDateString()}
                          </div>
                          <div className="flex gap-2">
                            <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-muted rounded-lg transition-colors">
                              <RefreshCw size={16} />
                              Regenerate
                            </button>
                            <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-orange-600 hover:bg-muted rounded-lg transition-colors">
                              <Lock size={16} />
                              Disable
                            </button>
                            <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-muted rounded-lg transition-colors">
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-6">
            {selectedKey && (
              <div className="bg-card border border-border rounded-lg shadow-card p-6">
                <h3 className="font-semibold text-foreground mb-4">Key Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide">Key Name</label>
                    <p className="text-sm font-medium text-foreground">{selectedKey.name}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide">Prefix</label>
                    <p className="text-sm font-mono text-foreground">{selectedKey.prefix}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide">Environment</label>
                    <p className="text-sm font-medium text-foreground">{selectedKey.environment}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide">Status</label>
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full border border-green-200">
                      <CheckCircle size={12} />
                      Active
                    </span>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide">Total Requests</label>
                    <p className="text-sm font-medium text-foreground">{selectedKey.requests.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide">Rate Limit</label>
                    <p className="text-sm font-medium text-foreground">{selectedKey.rateLimit}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-card border border-border rounded-lg shadow-card p-6">
              <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-muted text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                  <Plus size={20} />
                  <span className="font-medium">Generate New Key</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-muted text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                  <Code size={20} />
                  <span className="font-medium">API Documentation</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-muted text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                  <Terminal size={20} />
                  <span className="font-medium">Test API Call</span>
                </button>
              </div>
            </div>

            <div className="bg-muted border border-orange-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-orange-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-orange-900 mb-2">Security Tips</h3>
                  <ul className="text-sm text-orange-800 space-y-2">
                    <li>• Never expose API keys in public repositories</li>
                    <li>• Rotate keys every 90 days</li>
                    <li>• Use environment-specific keys</li>
                    <li>• Enable IP restrictions when possible</li>
                    <li>• Monitor usage regularly</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg shadow-card p-6">
              <h3 className="font-semibold text-foreground mb-4">Usage Statistics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Today's Requests</span>
                    <span className="text-sm font-bold text-foreground">45.2K</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Success Rate</span>
                    <span className="text-sm font-bold text-green-600">98.5%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-600 rounded-full" style={{ width: '98.5%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Error Rate</span>
                    <span className="text-sm font-bold text-red-600">1.5%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-red-600 rounded-full" style={{ width: '1.5%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}