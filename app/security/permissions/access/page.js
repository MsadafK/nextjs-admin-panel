'use client';

import React, { useState } from 'react';
import { Shield, Lock, Unlock, Key, Eye, EyeOff, Users, Globe, Clock, CheckCircle, XCircle, AlertTriangle, Search, Filter, Plus, Edit2, Trash2, RefreshCw, Download, Settings, Terminal, Database, FileText, Activity } from 'lucide-react';

export default function AccessControl() {
  const [selectedTab, setSelectedTab] = useState('ip-whitelist');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [ipWhitelist, setIpWhitelist] = useState([
    { id: 1, ip: '192.168.1.100', description: 'Office Main Gateway', status: 'active', addedBy: 'Admin', addedAt: '2024-10-15', lastUsed: '2 min ago' },
    { id: 2, ip: '10.0.0.50', description: 'Development Server', status: 'active', addedBy: 'Tech Lead', addedAt: '2024-10-10', lastUsed: '1 hour ago' },
    { id: 3, ip: '172.16.0.25', description: 'Remote Office VPN', status: 'active', addedBy: 'IT Manager', addedAt: '2024-09-28', lastUsed: '5 hours ago' },
    { id: 4, ip: '203.45.67.89', description: 'Client Access Point', status: 'inactive', addedBy: 'Sales Rep', addedAt: '2024-09-15', lastUsed: '2 days ago' },
  ]);

  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: 'Production API', key: 'sk_prod_abc123...', scope: 'Full Access', status: 'active', created: '2024-08-01', expires: '2025-08-01', lastUsed: '5 min ago', requests: 1250000 },
    { id: 2, name: 'Mobile App', key: 'sk_mobile_xyz789...', scope: 'Read Only', status: 'active', created: '2024-09-15', expires: '2025-09-15', lastUsed: '1 hour ago', requests: 450000 },
    { id: 3, name: 'Testing Environment', key: 'sk_test_def456...', scope: 'Limited', status: 'active', created: '2024-10-01', expires: '2025-10-01', lastUsed: '3 hours ago', requests: 89000 },
    { id: 4, name: 'Legacy Integration', key: 'sk_legacy_ghi321...', scope: 'Deprecated', status: 'revoked', created: '2023-06-10', expires: '2024-06-10', lastUsed: '1 month ago', requests: 2340000 },
  ]);

  const [accessPolicies, setAccessPolicies] = useState([
    { id: 1, name: 'Admin Dashboard Access', resource: 'Dashboard', action: 'Full Control', users: 12, status: 'active', priority: 'high' },
    { id: 2, name: 'Read-Only Analytics', resource: 'Analytics', action: 'View Only', users: 45, status: 'active', priority: 'medium' },
    { id: 3, name: 'Customer Data Access', resource: 'Customer DB', action: 'Read/Write', users: 8, status: 'active', priority: 'critical' },
    { id: 4, name: 'API Rate Limiting', resource: 'API Endpoints', action: 'Throttle', users: 150, status: 'active', priority: 'high' },
    { id: 5, name: 'File Upload Permissions', resource: 'File Storage', action: 'Upload/Delete', users: 28, status: 'inactive', priority: 'low' },
  ]);

  const [sessions, setSessions] = useState([
    { id: 1, user: 'John Doe', email: 'john@company.com', ip: '192.168.1.100', device: 'Chrome on Windows', location: 'New York, USA', startTime: '2 hours ago', status: 'active' },
    { id: 2, user: 'Sarah Wilson', email: 'sarah@company.com', ip: '10.0.0.50', device: 'Safari on MacOS', location: 'London, UK', startTime: '1 hour ago', status: 'active' },
    { id: 3, user: 'Mike Chen', email: 'mike@company.com', ip: '172.16.0.25', device: 'Firefox on Linux', location: 'Tokyo, Japan', startTime: '30 min ago', status: 'active' },
    { id: 4, user: 'Emma Brown', email: 'emma@company.com', ip: '203.45.67.89', device: 'Edge on Windows', location: 'Sydney, Australia', startTime: '15 min ago', status: 'active' },
  ]);

  const stats = [
    { title: 'Active IPs', value: ipWhitelist.filter(ip => ip.status === 'active').length, total: ipWhitelist.length, icon: Globe, color: 'blue' },
    { title: 'Active API Keys', value: apiKeys.filter(k => k.status === 'active').length, total: apiKeys.length, icon: Key, color: 'green' },
    { title: 'Active Policies', value: accessPolicies.filter(p => p.status === 'active').length, total: accessPolicies.length, icon: Shield, color: 'purple' },
    { title: 'Active Sessions', value: sessions.filter(s => s.status === 'active').length, total: sessions.length, icon: Users, color: 'orange' },
  ];

  const tabs = [
    { id: 'ip-whitelist', label: 'IP Whitelist', icon: Globe },
    { id: 'api-keys', label: 'API Keys', icon: Key },
    { id: 'policies', label: 'Access Policies', icon: Shield },
    { id: 'sessions', label: 'Active Sessions', icon: Users },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-muted text-foreground border-border';
      case 'revoked': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-muted text-foreground border-border';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-muted text-foreground border-border';
      default: return 'bg-muted text-foreground border-border';
    }
  };

  return (
    <div className="page-container space-y-6">
      <div className="max-w-7xl mx-auto space-y-5">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground mb-2">Access Control</h1>
              <p className="text-muted-foreground">Manage IP whitelists, API keys, and access policies</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
                <Download size={20} />
                Export Logs
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg hover:opacity-90 transition-colors"
              >
                <Plus size={20} />
                Add New
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
              purple: 'bg-muted text-foreground',
              orange: 'bg-muted text-foreground',
            };

            return (
              <div key={index} className="bg-card border border-border rounded-lg shadow-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                    <Icon size={24} />
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold tracking-tight text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">of {stat.total}</p>
                  </div>
                </div>
                <h3 className="text-sm text-muted-foreground">{stat.title}</h3>
              </div>
            );
          })}
        </div>

        <div className="bg-card border border-border rounded-lg shadow-card mb-6">
          <div className="border-b border-border">
            <nav className="flex">
              {tabs.map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                      selectedTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <TabIcon size={20} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="text"
                  placeholder={`Search ${tabs.find(t => t.id === selectedTab)?.label.toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
                <Filter size={20} />
                Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
                <RefreshCw size={20} />
                Refresh
              </button>
            </div>

            {selectedTab === 'ip-whitelist' && (
              <div className="space-y-3">
                {ipWhitelist.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-muted rounded-lg hover:bg-muted transition-colors">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Globe size={24} className="text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{item.ip}</h3>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getStatusColor(item.status)}`}>
                          {item.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Added by {item.addedBy}</span>
                        <span>•</span>
                        <span>{item.addedAt}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          Last used: {item.lastUsed}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-blue-600 hover:bg-muted rounded-lg transition-colors" title="Edit">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-muted rounded-lg transition-colors" title="Remove">
                        <Trash2 size={18} />
                      </button>
                      <button className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors" title="Toggle Status">
                        {item.status === 'active' ? <Lock size={18} /> : <Unlock size={18} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedTab === 'api-keys' && (
              <div className="space-y-3">
                {apiKeys.map((key) => (
                  <div key={key.id} className="flex items-center gap-4 p-4 bg-muted rounded-lg hover:bg-muted transition-colors">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Key size={24} className="text-green-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{key.name}</h3>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getStatusColor(key.status)}`}>
                          {key.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <code className="px-2 py-1 bg-foreground/80 text-green-400 text-xs font-mono rounded">
                          {key.key}
                        </code>
                        <button className="p-1 text-muted-foreground hover:text-foreground" title="Copy">
                          <Eye size={14} />
                        </button>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">{key.scope}</span>
                        <span>Created: {key.created}</span>
                        <span>•</span>
                        <span>Expires: {key.expires}</span>
                        <span>•</span>
                        <span>{key.requests.toLocaleString()} requests</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {key.lastUsed}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-blue-600 hover:bg-muted rounded-lg transition-colors" title="Regenerate">
                        <RefreshCw size={18} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-muted rounded-lg transition-colors" title="Revoke">
                        <XCircle size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedTab === 'policies' && (
              <div className="space-y-3">
                {accessPolicies.map((policy) => (
                  <div key={policy.id} className="flex items-center gap-4 p-4 bg-muted rounded-lg hover:bg-muted transition-colors">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Shield size={24} className="text-purple-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{policy.name}</h3>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getPriorityColor(policy.priority)}`}>
                          {policy.priority.toUpperCase()}
                        </span>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getStatusColor(policy.status)}`}>
                          {policy.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <Database size={14} />
                          Resource: {policy.resource}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Terminal size={14} />
                          Action: {policy.action}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users size={14} />
                          {policy.users} users affected
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-blue-600 hover:bg-muted rounded-lg transition-colors" title="Edit Policy">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors" title="Toggle">
                        {policy.status === 'active' ? <Lock size={18} /> : <Unlock size={18} />}
                      </button>
                      <button className="p-2 text-red-600 hover:bg-muted rounded-lg transition-colors" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedTab === 'sessions' && (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center gap-4 p-4 bg-muted rounded-lg hover:bg-muted transition-colors">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Activity size={24} className="text-orange-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{session.user}</h3>
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded-full border border-green-200 flex items-center gap-1">
                          <Activity size={12} />
                          ACTIVE
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{session.email}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Globe size={12} />
                          {session.ip}
                        </span>
                        <span>•</span>
                        <span>{session.device}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Globe size={12} />
                          {session.location}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          Started {session.startTime}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 text-sm text-red-600 hover:bg-muted rounded-lg transition-colors font-medium">
                        Terminate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-lg shadow-card p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertTriangle size={20} className="text-orange-600" />
              Recent Security Events
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-muted border border-red-200 rounded-lg">
                <XCircle size={16} className="text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Failed login attempt from unknown IP</p>
                  <p className="text-xs text-muted-foreground mt-1">203.45.67.100 • 5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted border border-yellow-200 rounded-lg">
                <AlertTriangle size={16} className="text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">API rate limit exceeded</p>
                  <p className="text-xs text-muted-foreground mt-1">Mobile App Key • 15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted border border-green-200 rounded-lg">
                <CheckCircle size={16} className="text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">New IP whitelisted successfully</p>
                  <p className="text-xs text-muted-foreground mt-1">192.168.1.100 • 1 hour ago</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-muted border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <Shield size={20} />
              Security Best Practices
            </h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                <span>Regularly rotate API keys every 90 days</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                <span>Monitor and audit access logs frequently</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                <span>Use IP whitelisting for sensitive operations</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                <span>Implement least privilege access policies</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                <span>Enable multi-factor authentication</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}