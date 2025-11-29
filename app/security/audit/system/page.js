'use client';
import { useState } from 'react';
import { FileText, AlertTriangle, CheckCircle, XCircle, Info, Bug, Zap, Shield, Server, Database, Activity, Clock, User, MapPin, Filter, Search, Download, RefreshCw, Calendar, Eye, Code, Terminal, Cpu, HardDrive, Network, AlertCircle } from 'lucide-react';

export default function SystemLogsPage() {
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  const severityFilters = [
    { value: 'all', label: 'All Logs', count: 1247, color: 'blue' },
    { value: 'critical', label: 'Critical', count: 8, color: 'red' },
    { value: 'error', label: 'Error', count: 34, color: 'orange' },
    { value: 'warning', label: 'Warning', count: 89, color: 'yellow' },
    { value: 'info', label: 'Info', count: 876, color: 'blue' },
    { value: 'debug', label: 'Debug', count: 240, color: 'purple' },
  ];

  const categoryFilters = [
    { value: 'all', label: 'All Categories' },
    { value: 'authentication', label: 'Authentication' },
    { value: 'database', label: 'Database' },
    { value: 'api', label: 'API' },
    { value: 'security', label: 'Security' },
    { value: 'performance', label: 'Performance' },
  ];

  const logStats = [
    { 
      label: 'Total Events', 
      value: '1,247', 
      subtext: 'Last 24 hours',
      icon: FileText, 
      color: 'from-blue-500 to-indigo-600', 
      bgColor: 'bg-blue-50', 
      textColor: 'text-blue-600' 
    },
    { 
      label: 'Critical Issues', 
      value: '8', 
      subtext: 'Needs attention',
      icon: AlertTriangle, 
      color: 'from-red-500 to-pink-600', 
      bgColor: 'bg-red-50', 
      textColor: 'text-red-600' 
    },
    { 
      label: 'System Uptime', 
      value: '99.97%', 
      subtext: 'This month',
      icon: CheckCircle, 
      color: 'from-emerald-500 to-teal-600', 
      bgColor: 'bg-emerald-50', 
      textColor: 'text-emerald-600' 
    },
    { 
      label: 'Avg Response', 
      value: '124ms', 
      subtext: 'System latency',
      icon: Zap, 
      color: 'from-purple-500 to-pink-600', 
      bgColor: 'bg-purple-50', 
      textColor: 'text-purple-600' 
    },
  ];

  const systemLogs = [
    {
      id: 1,
      severity: 'critical',
      category: 'database',
      message: 'Database connection pool exhausted - unable to allocate new connections',
      timestamp: '2024-10-31 14:23:45',
      source: 'PostgreSQL Primary',
      user: 'system',
      ip: '10.0.1.45',
      details: {
        connectionPool: 'max_connections reached (200/200)',
        affectedServices: ['API Gateway', 'User Service', 'Order Service'],
        duration: '45 seconds',
        resolution: 'Auto-scaled connection pool to 300'
      },
      stackTrace: 'at ConnectionPool.allocate (pool.js:234)\nat Database.query (db.js:156)',
      tags: ['production', 'high-priority', 'auto-resolved']
    },
    {
      id: 2,
      severity: 'error',
      category: 'api',
      message: 'API rate limit exceeded for endpoint /api/v1/users',
      timestamp: '2024-10-31 14:22:18',
      source: 'API Gateway',
      user: 'api_client_847',
      ip: '203.45.67.89',
      details: {
        endpoint: '/api/v1/users',
        requestCount: '1523 requests/minute',
        limit: '1000 requests/minute',
        action: 'Request blocked'
      },
      stackTrace: null,
      tags: ['rate-limiting', 'client-error']
    },
    {
      id: 3,
      severity: 'warning',
      category: 'performance',
      message: 'High memory usage detected on application server',
      timestamp: '2024-10-31 14:20:33',
      source: 'App Server 03',
      user: 'system',
      ip: '10.0.2.12',
      details: {
        memoryUsage: '7.8 GB / 8 GB (97.5%)',
        recommendation: 'Consider scaling horizontally',
        affectedProcesses: ['node-worker-1', 'node-worker-2']
      },
      stackTrace: null,
      tags: ['performance', 'monitoring']
    },
    {
      id: 4,
      severity: 'critical',
      category: 'security',
      message: 'Multiple failed login attempts detected - potential brute force attack',
      timestamp: '2024-10-31 14:18:56',
      source: 'Auth Service',
      user: 'unknown',
      ip: '185.234.19.67',
      details: {
        attempts: '47 failed attempts in 2 minutes',
        targetAccount: 'admin@company.com',
        action: 'IP blocked for 24 hours',
        threat_level: 'High'
      },
      stackTrace: null,
      tags: ['security', 'blocked', 'threat-detected']
    },
    {
      id: 5,
      severity: 'info',
      category: 'authentication',
      message: 'User logged in successfully',
      timestamp: '2024-10-31 14:15:42',
      source: 'Auth Service',
      user: 'priya.sharma@company.com',
      ip: '192.168.1.34',
      details: {
        method: 'OAuth2',
        provider: 'Google',
        device: 'Chrome on MacOS',
        location: 'Mumbai, India'
      },
      stackTrace: null,
      tags: ['authentication', 'success']
    },
    {
      id: 6,
      severity: 'error',
      category: 'database',
      message: 'Slow query detected - execution time exceeded threshold',
      timestamp: '2024-10-31 14:12:27',
      source: 'Database Monitor',
      user: 'db_query_analyzer',
      ip: '10.0.1.45',
      details: {
        query: 'SELECT * FROM orders WHERE created_at > ...',
        executionTime: '3.4 seconds',
        threshold: '1 second',
        recommendation: 'Add index on created_at column'
      },
      stackTrace: null,
      tags: ['performance', 'database', 'optimization-needed']
    },
    {
      id: 7,
      severity: 'warning',
      category: 'api',
      message: 'Deprecated API endpoint usage detected',
      timestamp: '2024-10-31 14:10:15',
      source: 'API Gateway',
      user: 'mobile_app_v2.3',
      ip: '203.45.67.91',
      details: {
        endpoint: '/api/v1/products/legacy',
        deprecationDate: '2024-12-31',
        newEndpoint: '/api/v2/products',
        impact: 'Low'
      },
      stackTrace: null,
      tags: ['deprecation', 'api-migration']
    },
    {
      id: 8,
      severity: 'debug',
      category: 'performance',
      message: 'Cache hit rate optimization in progress',
      timestamp: '2024-10-31 14:08:50',
      source: 'Redis Cache',
      user: 'system',
      ip: '10.0.3.22',
      details: {
        hitRate: '89.4%',
        target: '95%',
        cacheSize: '2.3 GB',
        evictions: '156 in last hour'
      },
      stackTrace: null,
      tags: ['caching', 'optimization', 'monitoring']
    },
  ];

  const getSeverityConfig = (severity) => {
    const configs = {
      'critical': {
        badge: 'bg-red-100 text-red-700 border-red-300',
        icon: AlertTriangle,
        iconColor: 'text-red-600',
        bgColor: 'bg-red-50/50',
        text: 'CRITICAL',
        pulse: true
      },
      'error': {
        badge: 'bg-orange-100 text-orange-700 border-orange-300',
        icon: XCircle,
        iconColor: 'text-orange-600',
        bgColor: 'bg-orange-50/50',
        text: 'ERROR',
        pulse: false
      },
      'warning': {
        badge: 'bg-yellow-100 text-yellow-700 border-yellow-300',
        icon: AlertCircle,
        iconColor: 'text-yellow-600',
        bgColor: 'bg-yellow-50/50',
        text: 'WARNING',
        pulse: false
      },
      'info': {
        badge: 'bg-blue-100 text-blue-700 border-blue-300',
        icon: Info,
        iconColor: 'text-blue-600',
        bgColor: 'bg-blue-50/50',
        text: 'INFO',
        pulse: false
      },
      'debug': {
        badge: 'bg-purple-100 text-purple-700 border-purple-300',
        icon: Bug,
        iconColor: 'text-purple-600',
        bgColor: 'bg-purple-50/50',
        text: 'DEBUG',
        pulse: false
      }
    };
    return configs[severity] || configs.info;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'authentication': User,
      'database': Database,
      'api': Code,
      'security': Shield,
      'performance': Cpu,
    };
    return icons[category] || Server;
  };

  const filteredLogs = systemLogs.filter(log => 
    (selectedSeverity === 'all' || log.severity === selectedSeverity) &&
    (selectedCategory === 'all' || log.category === selectedCategory) &&
    (log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
     log.source.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-700 to-blue-600 bg-clip-text text-transparent">
                System Logs
              </h1>
              <Terminal className="w-8 h-8 text-slate-700" />
            </div>
            <p className="text-slate-600">Real-time system events and activity monitoring</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white text-slate-700 px-4 py-3 rounded-xl hover:shadow-lg transition-all duration-300 border border-slate-200">
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button className="flex items-center gap-2 bg-gradient-to-r from-slate-700 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300">
              <RefreshCw className="w-5 h-5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {logStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
                <div className={`${stat.bgColor} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <p className="text-slate-600 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.subtext}</p>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search logs by message or source..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Severity Filters */}
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-2">Severity Level</p>
              <div className="flex flex-wrap gap-2">
                {severityFilters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setSelectedSeverity(filter.value)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                      selectedSeverity === filter.value
                        ? 'bg-gradient-to-r from-slate-700 to-blue-600 text-white shadow-lg'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {filter.label}
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/20">
                      {filter.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filters */}
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-2">Category</p>
              <div className="flex flex-wrap gap-2">
                {categoryFilters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setSelectedCategory(filter.value)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                      selectedCategory === filter.value
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Logs List */}
        <div className="space-y-3">
          {filteredLogs.map((log) => {
            const severityConfig = getSeverityConfig(log.severity);
            const SeverityIcon = severityConfig.icon;
            const CategoryIcon = getCategoryIcon(log.category);

            return (
              <div 
                key={log.id}
                className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer ${
                  log.severity === 'critical' ? 'border-red-300' : 
                  log.severity === 'error' ? 'border-orange-300' : 
                  'border-slate-200'
                } ${severityConfig.bgColor}`}
                onClick={() => setSelectedLog(selectedLog === log.id ? null : log.id)}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Left: Icon and Severity */}
                    <div className="flex flex-col items-center gap-2 flex-shrink-0">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        log.severity === 'critical' ? 'bg-red-100' :
                        log.severity === 'error' ? 'bg-orange-100' :
                        log.severity === 'warning' ? 'bg-yellow-100' :
                        log.severity === 'info' ? 'bg-blue-100' :
                        'bg-purple-100'
                      }`}>
                        <SeverityIcon className={`w-6 h-6 ${severityConfig.iconColor}`} />
                      </div>
                      <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold border ${severityConfig.badge} ${
                        severityConfig.pulse ? 'animate-pulse' : ''
                      }`}>
                        {severityConfig.text}
                      </span>
                    </div>

                    {/* Middle: Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2">
                          <CategoryIcon className="w-5 h-5 text-slate-400" />
                          <span className="text-xs font-semibold text-slate-500 uppercase">{log.category}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Clock className="w-4 h-4" />
                          <span className="font-mono text-xs">{log.timestamp}</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-slate-800 mb-2">{log.message}</h3>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Server className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600 truncate">{log.source}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600 truncate">{log.user}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600 font-mono text-xs">{log.ip}</span>
                        </div>
                        <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
                          <Eye className="w-4 h-4" />
                          <span className="font-semibold">View Details</span>
                        </button>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap items-center gap-2">
                        {log.tags.map((tag, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Expanded Details */}
                      {selectedLog === log.id && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <h4 className="font-bold text-slate-800 mb-3">Detailed Information</h4>
                          <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                            {Object.entries(log.details).map(([key, value]) => (
                              <div key={key} className="flex justify-between items-start text-sm">
                                <span className="text-slate-600 font-semibold capitalize">
                                  {key.replace(/_/g, ' ')}:
                                </span>
                                <span className="text-slate-800 text-right ml-4">
                                  {Array.isArray(value) ? value.join(', ') : value}
                                </span>
                              </div>
                            ))}
                          </div>

                          {log.stackTrace && (
                            <div className="mt-3">
                              <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                <Terminal className="w-4 h-4" />
                                Stack Trace
                              </h4>
                              <div className="bg-slate-900 rounded-xl p-4">
                                <pre className="text-emerald-400 text-xs font-mono overflow-x-auto">
                                  {log.stackTrace}
                                </pre>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Critical/Error Bottom Stripe */}
                {(log.severity === 'critical' || log.severity === 'error') && (
                  <div className={`h-1 ${
                    log.severity === 'critical' 
                      ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                      : 'bg-gradient-to-r from-orange-500 to-amber-500'
                  }`}></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredLogs.length === 0 && (
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-slate-100 text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No logs found</h3>
            <p className="text-slate-600">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
}