'use client';
import { useState, useEffect } from 'react';
import { Activity, Server, Database, Cpu, HardDrive, Wifi, Zap, AlertTriangle, CheckCircle, Clock, TrendingUp, BarChart3, Globe, Shield, RefreshCw, XCircle } from 'lucide-react';

export default function SystemHealthPage() {
  const [cpuUsage, setCpuUsage] = useState(45);
  const [memoryUsage, setMemoryUsage] = useState(62);
  const [networkSpeed, setNetworkSpeed] = useState(487);
  const [uptime, setUptime] = useState(99.98);
  const [activeConnections, setActiveConnections] = useState(1247);

  // Simulate real-time system metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev => Math.max(20, Math.min(90, prev + (Math.random() * 10 - 5))));
      setMemoryUsage(prev => Math.max(30, Math.min(85, prev + (Math.random() * 8 - 4))));
      setNetworkSpeed(prev => Math.max(200, Math.min(800, prev + (Math.random() * 100 - 50))));
      setActiveConnections(prev => Math.max(1000, Math.min(1500, prev + Math.floor(Math.random() * 40 - 20))));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const systemMetrics = [
    { 
      label: 'CPU Usage', 
      value: `${cpuUsage.toFixed(1)}%`, 
      status: cpuUsage < 60 ? 'good' : cpuUsage < 80 ? 'warning' : 'critical',
      icon: Cpu,
      color: cpuUsage < 60 ? 'from-emerald-500 to-teal-600' : cpuUsage < 80 ? 'from-orange-500 to-amber-600' : 'from-red-500 to-pink-600',
      bgColor: cpuUsage < 60 ? 'bg-muted' : cpuUsage < 80 ? 'bg-muted' : 'bg-muted',
      textColor: cpuUsage < 60 ? 'text-emerald-600' : cpuUsage < 80 ? 'text-orange-600' : 'text-red-600',
      percentage: cpuUsage
    },
    { 
      label: 'Memory', 
      value: `${memoryUsage.toFixed(1)}%`, 
      status: memoryUsage < 70 ? 'good' : memoryUsage < 85 ? 'warning' : 'critical',
      icon: HardDrive,
      color: memoryUsage < 70 ? 'from-blue-500 to-indigo-600' : memoryUsage < 85 ? 'from-orange-500 to-amber-600' : 'from-red-500 to-pink-600',
      bgColor: memoryUsage < 70 ? 'bg-muted' : memoryUsage < 85 ? 'bg-muted' : 'bg-muted',
      textColor: memoryUsage < 70 ? 'text-blue-600' : memoryUsage < 85 ? 'text-orange-600' : 'text-red-600',
      percentage: memoryUsage
    },
    { 
      label: 'Network', 
      value: `${networkSpeed.toFixed(0)} Mbps`, 
      status: 'good',
      icon: Wifi,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-muted',
      textColor: 'text-purple-600',
      percentage: (networkSpeed / 800) * 100
    },
    { 
      label: 'Uptime', 
      value: `${uptime.toFixed(2)}%`, 
      status: 'good',
      icon: Clock,
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'bg-muted',
      textColor: 'text-cyan-600',
      percentage: uptime
    }
  ];

  const services = [
    { name: 'API Server', status: 'operational', uptime: '99.99%', responseTime: '45ms', icon: Server, color: 'emerald' },
    { name: 'Database', status: 'operational', uptime: '99.97%', responseTime: '12ms', icon: Database, color: 'blue' },
    { name: 'Cache Layer', status: 'operational', uptime: '99.98%', responseTime: '8ms', icon: Zap, color: 'purple' },
    { name: 'CDN', status: 'operational', uptime: '100%', responseTime: '23ms', icon: Globe, color: 'cyan' },
    { name: 'Authentication', status: 'degraded', uptime: '98.45%', responseTime: '156ms', icon: Shield, color: 'orange' },
    { name: 'Payment Gateway', status: 'operational', uptime: '99.95%', responseTime: '67ms', icon: Activity, color: 'emerald' },
  ];

  const alerts = [
    { type: 'warning', message: 'Authentication service experiencing slower response times', time: '2m ago', severity: 'medium' },
    { type: 'info', message: 'Scheduled maintenance window tomorrow at 2 AM IST', time: '15m ago', severity: 'low' },
    { type: 'success', message: 'Database backup completed successfully', time: '1h ago', severity: 'low' },
  ];

  const recentIncidents = [
    { title: 'Brief API Latency Spike', status: 'resolved', duration: '8 minutes', time: '3 hours ago' },
    { title: 'Database Connection Pool Issue', status: 'resolved', duration: '15 minutes', time: '1 day ago' },
    { title: 'CDN Cache Clear', status: 'resolved', duration: '5 minutes', time: '2 days ago' },
  ];

  const serverLocations = [
    { location: 'Mumbai, India', status: 'operational', load: 45, ping: '12ms', flag: '🇮🇳' },
    { location: 'Singapore', status: 'operational', load: 62, ping: '34ms', flag: '🇸🇬' },
    { location: 'London, UK', status: 'operational', load: 38, ping: '156ms', flag: '🇬🇧' },
    { location: 'New York, USA', status: 'operational', load: 71, ping: '234ms', flag: '🇺🇸' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'operational': return 'emerald';
      case 'degraded': return 'orange';
      case 'outage': return 'red';
      default: return 'slate';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'operational': return CheckCircle;
      case 'degraded': return AlertTriangle;
      case 'outage': return XCircle;
      default: return Activity;
    }
  };

  return (
    <div className="page-container space-y-6">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                System Health
              </h1>
              <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-muted0 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">ALL SYSTEMS OPERATIONAL</span>
              </div>
            </div>
            <p className="text-muted-foreground">Real-time infrastructure monitoring</p>
          </div>
          <button className="flex items-center gap-2 bg-card text-foreground px-6 py-3 rounded-xl hover:shadow-card transition-all duration-300 border border-border">
            <RefreshCw className="w-5 h-5" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Overall Status Hero */}
        <div className="relative bg-foreground text-background rounded-lg p-6 sm:p-8 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-card rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-card rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center md:text-left">
                <Activity className="w-12 h-12 text-background mb-4 mx-auto md:mx-0" />
                <h2 className="text-background text-lg font-medium mb-2">System Status</h2>
                <div className="text-3xl sm:text-4xl font-bold text-background mb-2">100%</div>
                <p className="text-background/70">All services operational</p>
              </div>
              <div className="bg-card/20 backdrop-blur-sm rounded-lg p-6 text-background">
                <p className="text-background/70 text-sm mb-1">Active Connections</p>
                <p className="text-xl sm:text-2xl font-semibold tracking-tight mb-1">{activeConnections.toLocaleString()}</p>
                <p className="text-background/70 text-sm">+3.2% from last hour</p>
              </div>
              <div className="bg-card/20 backdrop-blur-sm rounded-lg p-6 text-background">
                <p className="text-background/70 text-sm mb-1">Avg Response Time</p>
                <p className="text-xl sm:text-2xl font-semibold tracking-tight mb-1">52ms</p>
                <p className="text-background/70 text-sm">Across all services</p>
              </div>
            </div>
          </div>
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {systemMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="bg-card border border-border rounded-lg shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${metric.bgColor} w-12 h-12 rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${metric.textColor}`} />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    metric.status === 'good' ? 'bg-emerald-100 text-emerald-700' :
                    metric.status === 'warning' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {metric.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mb-2">{metric.label}</p>
                <p className="text-lg sm:text-xl font-semibold tracking-tight text-foreground mb-3">{metric.value}</p>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full bg-foreground/60 rounded-full transition-all duration-500`}
                    style={{ width: `${metric.percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Services Status */}
        <div className="bg-card border border-border rounded-lg shadow-card">
          <h3 className="text-base font-semibold text-foreground mb-6 flex items-center gap-2">
            <Server className="w-6 h-6 text-blue-600" />
            Services Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service, index) => {
              const Icon = service.icon;
              const StatusIcon = getStatusIcon(service.status);
              const statusColor = getStatusColor(service.status);
              return (
                <div key={index} className="bg-muted rounded-xl p-5 hover:shadow-card transition-all duration-300 border border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`bg-${statusColor}-100 p-2 rounded-lg`}>
                      <Icon className={`w-5 h-5 text-${statusColor}-600`} />
                    </div>
                    <StatusIcon className={`w-5 h-5 text-${statusColor}-600`} />
                  </div>
                  <h4 className="font-bold text-foreground mb-3">{service.name}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Uptime:</span>
                      <span className="font-semibold text-foreground">{service.uptime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Response:</span>
                      <span className="font-semibold text-foreground">{service.responseTime}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alerts */}
          <div className="bg-card border border-border rounded-lg shadow-card">
            <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              Recent Alerts
            </h3>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-xl border-l-2 ${
                    alert.type === 'warning' ? 'border-orange-500 bg-muted' :
                    alert.type === 'success' ? 'border-emerald-500 bg-muted' :
                    'border-blue-500 bg-muted'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm text-foreground flex-1">{alert.message}</p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{alert.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Incidents */}
          <div className="bg-card border border-border rounded-lg shadow-card">
            <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              Recent Incidents
            </h3>
            <div className="space-y-3">
              {recentIncidents.map((incident, index) => (
                <div key={index} className="p-4 bg-muted rounded-xl border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-foreground">{incident.title}</p>
                    <span className="bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full font-semibold">
                      Resolved
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Duration: {incident.duration}</span>
                    <span>•</span>
                    <span>{incident.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Server Locations */}
        <div className="bg-card border border-border rounded-lg shadow-card">
          <h3 className="text-base font-semibold text-foreground mb-6 flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-600" />
            Server Locations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {serverLocations.map((server, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-5 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{server.flag}</span>
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <h4 className="font-bold text-foreground mb-3">{server.location}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Load:</span>
                    <span className="font-semibold text-foreground">{server.load}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-full rounded-full ${
                        server.load < 60 ? 'bg-muted0' : server.load < 80 ? 'bg-muted0' : 'bg-muted0'
                      }`}
                      style={{ width: `${server.load}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm pt-2">
                    <span className="text-muted-foreground">Ping:</span>
                    <span className="font-semibold text-foreground">{server.ping}</span>
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