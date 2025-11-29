'use client';
import { useState } from 'react';
import { Shield, AlertTriangle, XCircle, CheckCircle, Lock, Unlock, Key, UserX, Globe, Activity, Zap, Bug, Eye, EyeOff, Filter, Search, Download, RefreshCw, Clock, MapPin, Server, Database, AlertCircle, TrendingUp, TrendingDown, Ban, ShieldAlert, ShieldCheck, Fingerprint } from 'lucide-react';

export default function SecurityEventsPage() {
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedEvent, setExpandedEvent] = useState(null);

  const severityFilters = [
    { value: 'all', label: 'All Events', count: 456, color: 'blue' },
    { value: 'critical', label: 'Critical', count: 12, color: 'red' },
    { value: 'high', label: 'High', count: 34, color: 'orange' },
    { value: 'medium', label: 'Medium', count: 89, color: 'yellow' },
    { value: 'low', label: 'Low', count: 321, color: 'green' },
  ];

  const categoryFilters = [
    { value: 'all', label: 'All Categories' },
    { value: 'authentication', label: 'Authentication' },
    { value: 'authorization', label: 'Authorization' },
    { value: 'intrusion', label: 'Intrusion Attempt' },
    { value: 'data-breach', label: 'Data Breach' },
    { value: 'malware', label: 'Malware Detection' },
    { value: 'policy-violation', label: 'Policy Violation' },
  ];

  const securityStats = [
    { 
      label: 'Total Threats', 
      value: '456', 
      change: '-8.2%',
      trend: 'down',
      icon: Shield, 
      color: 'from-red-500 to-pink-600', 
      bgColor: 'bg-red-50', 
      textColor: 'text-red-600' 
    },
    { 
      label: 'Critical Events', 
      value: '12', 
      change: '-3',
      trend: 'down',
      icon: AlertTriangle, 
      color: 'from-orange-500 to-red-600', 
      bgColor: 'bg-orange-50', 
      textColor: 'text-orange-600' 
    },
    { 
      label: 'Blocked IPs', 
      value: '89', 
      change: '+12',
      trend: 'up',
      icon: Ban, 
      color: 'from-purple-500 to-pink-600', 
      bgColor: 'bg-purple-50', 
      textColor: 'text-purple-600' 
    },
    { 
      label: 'Protection Rate', 
      value: '99.8%', 
      change: '+0.2%',
      trend: 'up',
      icon: ShieldCheck, 
      color: 'from-emerald-500 to-teal-600', 
      bgColor: 'bg-emerald-50', 
      textColor: 'text-emerald-600' 
    },
  ];

  const securityEvents = [
    {
      id: 1,
      severity: 'critical',
      category: 'intrusion',
      title: 'Brute Force Attack Detected',
      description: 'Multiple failed login attempts from single IP address targeting admin accounts',
      timestamp: '2024-10-31 16:45:23',
      source: 'Auth Service',
      ip: '185.234.19.67',
      location: 'Unknown (VPN/Proxy)',
      status: 'blocked',
      threatLevel: 'High',
      affectedResources: ['Admin Panel', 'User Authentication'],
      actionTaken: 'IP permanently blocked, accounts locked temporarily',
      details: {
        attempts: 147,
        duration: '3 minutes',
        targetAccounts: ['admin@company.com', 'root@company.com', 'superadmin@company.com'],
        attackPattern: 'Dictionary attack with common passwords',
        mitigationTime: '23 seconds'
      },
      indicators: ['Rapid requests', 'Multiple accounts targeted', 'VPN usage'],
      risk_score: 95
    },
    {
      id: 2,
      severity: 'critical',
      category: 'data-breach',
      title: 'Unauthorized Data Access Attempt',
      description: 'Suspicious API calls attempting to access customer database without proper authorization',
      timestamp: '2024-10-31 16:32:18',
      source: 'API Gateway',
      ip: '203.45.178.92',
      location: 'Moscow, Russia',
      status: 'prevented',
      threatLevel: 'Critical',
      affectedResources: ['Customer Database', 'Payment Information'],
      actionTaken: 'Request blocked, API key revoked, incident escalated',
      details: {
        apiKey: 'sk_compromised_...7x9',
        endpoint: '/api/v1/customers/export',
        dataRequested: 'Full customer records (47,892 entries)',
        authMethod: 'Stolen API key',
        detection: 'Anomaly detection algorithm'
      },
      indicators: ['Unusual geographic location', 'Bulk data request', 'Revoked credentials'],
      risk_score: 98
    },
    {
      id: 3,
      severity: 'high',
      category: 'authentication',
      title: 'Suspicious Login from New Location',
      description: 'Account access from unusual geographic location with impossible travel time',
      timestamp: '2024-10-31 16:18:45',
      source: 'Security Monitor',
      ip: '198.51.100.45',
      location: 'Lagos, Nigeria',
      status: 'challenged',
      threatLevel: 'Medium',
      affectedResources: ['User Account: priya.sharma@company.com'],
      actionTaken: 'MFA challenge issued, temporary session restriction',
      details: {
        user: 'priya.sharma@company.com',
        previousLocation: 'Mumbai, India (12 minutes ago)',
        travelDistance: '6,847 km',
        impossibleTravel: true,
        mfaStatus: 'Pending verification'
      },
      indicators: ['Impossible travel', 'New device', 'New location'],
      risk_score: 72
    },
    {
      id: 4,
      severity: 'high',
      category: 'malware',
      title: 'Malicious File Upload Detected',
      description: 'File upload containing potential malware signatures blocked by security scanner',
      timestamp: '2024-10-31 16:05:33',
      source: 'File Scanner',
      ip: '192.168.1.89',
      location: 'Pune, India',
      status: 'quarantined',
      threatLevel: 'High',
      affectedResources: ['File Upload Service'],
      actionTaken: 'File quarantined, user notified, admin alerted',
      details: {
        fileName: 'invoice_document.pdf.exe',
        fileSize: '2.4 MB',
        malwareType: 'Trojan.Generic.KD.12345',
        scanEngine: 'ClamAV + VirusTotal',
        threats: ['Code injection', 'Keylogger', 'RAT (Remote Access)']
      },
      indicators: ['Double extension', 'Suspicious signature', 'Known malware hash'],
      risk_score: 85
    },
    {
      id: 5,
      severity: 'medium',
      category: 'authorization',
      title: 'Privilege Escalation Attempt',
      description: 'User attempting to access resources beyond assigned role permissions',
      timestamp: '2024-10-31 15:52:16',
      source: 'Authorization Service',
      ip: '192.168.1.134',
      location: 'Delhi, India',
      status: 'denied',
      threatLevel: 'Medium',
      affectedResources: ['Admin Dashboard', 'User Management'],
      actionTaken: 'Access denied, incident logged, manager notified',
      details: {
        user: 'developer_user_847',
        requestedRole: 'Admin',
        currentRole: 'Developer',
        attemptedAction: 'Delete user account',
        method: 'Direct API call with elevated permissions'
      },
      indicators: ['Role mismatch', 'Unusual API usage', 'Permission bypass attempt'],
      risk_score: 68
    },
    {
      id: 6,
      severity: 'medium',
      category: 'policy-violation',
      title: 'Password Policy Violation',
      description: 'Multiple users attempting to set weak passwords that do not meet security requirements',
      timestamp: '2024-10-31 15:38:42',
      source: 'Password Service',
      ip: 'Multiple IPs',
      location: 'Various',
      status: 'prevented',
      threatLevel: 'Low',
      affectedResources: ['Password Management'],
      actionTaken: 'Password rejected, users prompted for stronger passwords',
      details: {
        violations: 23,
        commonIssues: ['Too short (< 12 chars)', 'No special characters', 'Common dictionary words'],
        affectedUsers: '23 unique users',
        recommendation: 'Security awareness training'
      },
      indicators: ['Policy non-compliance', 'Weak passwords', 'Multiple violations'],
      risk_score: 45
    },
    {
      id: 7,
      severity: 'low',
      category: 'authentication',
      title: 'Expired Session Token Usage',
      description: 'Attempt to use expired authentication token detected and rejected',
      timestamp: '2024-10-31 15:25:19',
      source: 'Token Validator',
      ip: '192.168.1.56',
      location: 'Bangalore, India',
      status: 'rejected',
      threatLevel: 'Low',
      affectedResources: ['API Access'],
      actionTaken: 'Request rejected, user prompted to re-authenticate',
      details: {
        tokenExpiry: '2024-10-31 15:20:00',
        attemptTime: '2024-10-31 15:25:19',
        timeDifference: '5 minutes 19 seconds',
        tokenType: 'JWT Bearer Token',
        autoRenewal: 'Failed - Manual login required'
      },
      indicators: ['Expired credentials', 'Standard security protocol'],
      risk_score: 15
    },
    {
      id: 8,
      severity: 'high',
      category: 'intrusion',
      title: 'SQL Injection Attempt Detected',
      description: 'Malicious SQL code detected in user input attempting database manipulation',
      timestamp: '2024-10-31 15:12:07',
      source: 'Web Application Firewall',
      ip: '201.23.45.178',
      location: 'Sao Paulo, Brazil',
      status: 'blocked',
      threatLevel: 'High',
      affectedResources: ['Database', 'Search Function'],
      actionTaken: 'Request blocked, IP flagged, security team notified',
      details: {
        injectionType: 'SQL Injection (SQLi)',
        payload: "' OR '1'='1' --",
        targetTable: 'users',
        wafRule: 'OWASP Core Rule Set',
        confidenceLevel: '99.7%'
      },
      indicators: ['SQL syntax in input', 'OWASP Top 10 threat', 'Known attack pattern'],
      risk_score: 88
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
        pulse: true,
        borderColor: 'border-red-300'
      },
      'high': {
        badge: 'bg-orange-100 text-orange-700 border-orange-300',
        icon: ShieldAlert,
        iconColor: 'text-orange-600',
        bgColor: 'bg-orange-50/50',
        text: 'HIGH',
        pulse: false,
        borderColor: 'border-orange-300'
      },
      'medium': {
        badge: 'bg-yellow-100 text-yellow-700 border-yellow-300',
        icon: AlertCircle,
        iconColor: 'text-yellow-600',
        bgColor: 'bg-yellow-50/50',
        text: 'MEDIUM',
        pulse: false,
        borderColor: 'border-yellow-300'
      },
      'low': {
        badge: 'bg-green-100 text-green-700 border-green-300',
        icon: CheckCircle,
        iconColor: 'text-green-600',
        bgColor: 'bg-green-50/50',
        text: 'LOW',
        pulse: false,
        borderColor: 'border-green-300'
      }
    };
    return configs[severity] || configs.low;
  };

  const getStatusConfig = (status) => {
    const configs = {
      'blocked': { badge: 'bg-red-100 text-red-700', icon: Ban, text: 'BLOCKED' },
      'prevented': { badge: 'bg-orange-100 text-orange-700', icon: ShieldCheck, text: 'PREVENTED' },
      'challenged': { badge: 'bg-yellow-100 text-yellow-700', icon: Lock, text: 'CHALLENGED' },
      'quarantined': { badge: 'bg-purple-100 text-purple-700', icon: AlertCircle, text: 'QUARANTINED' },
      'denied': { badge: 'bg-blue-100 text-blue-700', icon: XCircle, text: 'DENIED' },
      'rejected': { badge: 'bg-slate-100 text-slate-700', icon: XCircle, text: 'REJECTED' }
    };
    return configs[status] || configs.rejected;
  };

  const filteredEvents = securityEvents.filter(event => 
    (selectedSeverity === 'all' || event.severity === selectedSeverity) &&
    (selectedCategory === 'all' || event.category === selectedCategory) &&
    (event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     event.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                Security Events
              </h1>
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-slate-600">Monitor and respond to security threats in real-time</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white text-slate-700 px-4 py-3 rounded-xl hover:shadow-lg transition-all duration-300 border border-slate-200">
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300">
              <RefreshCw className="w-5 h-5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {securityStats.map((stat, index) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
            return (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.bgColor} w-12 h-12 rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-semibold ${
                    stat.trend === 'down' && stat.label !== 'Protection Rate' ? 'text-emerald-600' : 'text-orange-600'
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

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search security events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700 mb-2">Severity Level</p>
              <div className="flex flex-wrap gap-2">
                {severityFilters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setSelectedSeverity(filter.value)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                      selectedSeverity === filter.value
                        ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
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

            <div>
              <p className="text-sm font-semibold text-slate-700 mb-2">Category</p>
              <div className="flex flex-wrap gap-2">
                {categoryFilters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setSelectedCategory(filter.value)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                      selectedCategory === filter.value
                        ? 'bg-red-600 text-white shadow-lg'
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

        {/* Events List */}
        <div className="space-y-4">
          {filteredEvents.map((event) => {
            const severityConfig = getSeverityConfig(event.severity);
            const SeverityIcon = severityConfig.icon;
            const statusConfig = getStatusConfig(event.status);
            const StatusIcon = statusConfig.icon;
            const isExpanded = expandedEvent === event.id;

            return (
              <div 
                key={event.id}
                className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden transition-all duration-300 hover:shadow-xl ${severityConfig.borderColor} ${severityConfig.bgColor}`}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Left: Severity Icon */}
                    <div className="flex flex-col items-center gap-2 flex-shrink-0">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                        event.severity === 'critical' ? 'bg-red-100' :
                        event.severity === 'high' ? 'bg-orange-100' :
                        event.severity === 'medium' ? 'bg-yellow-100' :
                        'bg-green-100'
                      }`}>
                        <SeverityIcon className={`w-7 h-7 ${severityConfig.iconColor} ${
                          severityConfig.pulse ? 'animate-pulse' : ''
                        }`} />
                      </div>
                      <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold border ${severityConfig.badge}`}>
                        {severityConfig.text}
                      </span>
                    </div>

                    {/* Middle: Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-slate-800">{event.title}</h3>
                            <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${statusConfig.badge}`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig.text}
                            </span>
                          </div>
                          <p className="text-slate-700 mb-3">{event.description}</p>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span className="text-xs text-slate-600">Timestamp</span>
                          </div>
                          <p className="text-sm font-semibold text-slate-800 font-mono text-xs">{event.timestamp}</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Globe className="w-4 h-4 text-slate-400" />
                            <span className="text-xs text-slate-600">IP Address</span>
                          </div>
                          <p className="text-sm font-semibold text-slate-800 font-mono">{event.ip}</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span className="text-xs text-slate-600">Location</span>
                          </div>
                          <p className="text-sm font-semibold text-slate-800">{event.location}</p>
                        </div>
                        <div className={`rounded-lg p-3 ${
                          event.risk_score >= 80 ? 'bg-red-100' :
                          event.risk_score >= 60 ? 'bg-orange-100' :
                          event.risk_score >= 40 ? 'bg-yellow-100' :
                          'bg-green-100'
                        }`}>
                          <div className="flex items-center gap-2 mb-1">
                            <Fingerprint className="w-4 h-4 text-slate-400" />
                            <span className="text-xs text-slate-600">Risk Score</span>
                          </div>
                          <p className={`text-lg font-bold ${
                            event.risk_score >= 80 ? 'text-red-600' :
                            event.risk_score >= 60 ? 'text-orange-600' :
                            event.risk_score >= 40 ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>{event.risk_score}/100</p>
                        </div>
                      </div>

                      {/* Threat Info */}
                      <div className="flex items-center gap-4 mb-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Server className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">Source:</span>
                          <span className="font-semibold text-slate-800">{event.source}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">Threat Level:</span>
                          <span className={`font-bold ${
                            event.threatLevel === 'Critical' ? 'text-red-600' :
                            event.threatLevel === 'High' ? 'text-orange-600' :
                            'text-yellow-600'
                          }`}>{event.threatLevel}</span>
                        </div>
                      </div>

                      {/* Indicators */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {event.indicators.map((indicator, idx) => (
                          <span key={idx} className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full font-semibold">
                            🚨 {indicator}
                          </span>
                        ))}
                      </div>

                      {/* Expand Button */}
                      <button
                        onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                        className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        {isExpanded ? 'Hide Details' : 'View Full Details'}
                      </button>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-slate-200 space-y-4">
                          <div>
                            <h4 className="font-bold text-slate-800 mb-2">Affected Resources</h4>
                            <div className="flex flex-wrap gap-2">
                              {event.affectedResources.map((resource, idx) => (
                                <span key={idx} className="bg-slate-100 text-slate-700 text-sm px-3 py-1 rounded-lg">
                                  {resource}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4">
                            <h4 className="font-bold text-slate-800 mb-2">Action Taken</h4>
                            <p className="text-slate-700">{event.actionTaken}</p>
                          </div>

                          <div className="bg-slate-50 rounded-xl p-4">
                            <h4 className="font-bold text-slate-800 mb-3">Event Details</h4>
                            <div className="space-y-2">
                              {Object.entries(event.details).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-start text-sm">
                                  <span className="text-slate-600 font-semibold capitalize">
                                    {key.replace(/_/g, ' ')}:
                                  </span>
                                  <span className="text-slate-800 text-right ml-4 font-mono text-xs">
                                    {Array.isArray(value) ? value.join(', ') : value.toString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Stripe */}
                {(event.severity === 'critical' || event.severity === 'high') && (
                  <div className={`h-1 ${
                    event.severity === 'critical' 
                      ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                      : 'bg-gradient-to-r from-orange-500 to-amber-500'
                  }`}></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-slate-100 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">All Clear!</h3>
            <p className="text-slate-600">No security events found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}