'use client';
import { useState, useEffect } from 'react';
import { Users, Globe, Monitor, Smartphone, Tablet, MapPin, Activity, Clock, Eye, MousePointer, TrendingUp, Zap } from 'lucide-react';

export default function LiveUsersPage() {
  const [liveCount, setLiveCount] = useState(1847);
  const [pulse, setPulse] = useState(false);

  // Simulate live user count changes
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => {
        const change = Math.floor(Math.random() * 20) - 10;
        return Math.max(1500, Math.min(2000, prev + change));
      });
      setPulse(true);
      setTimeout(() => setPulse(false), 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const deviceStats = [
    { type: 'Desktop', count: 1124, percentage: 61, icon: Monitor, color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50' },
    { type: 'Mobile', count: 589, percentage: 32, icon: Smartphone, color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-50' },
    { type: 'Tablet', count: 134, percentage: 7, icon: Tablet, color: 'from-orange-500 to-amber-500', bgColor: 'bg-orange-50' },
  ];

  const topPages = [
    { page: '/products/electronics', users: 342, views: 1567, avgTime: '3:24' },
    { page: '/dashboard', users: 289, views: 891, avgTime: '5:12' },
    { page: '/checkout', users: 234, views: 456, avgTime: '2:45' },
    { page: '/categories/fashion', users: 187, views: 723, avgTime: '4:18' },
    { page: '/profile/settings', users: 156, views: 312, avgTime: '6:32' },
  ];

  const topLocations = [
    { city: 'Mumbai', country: 'India', users: 423, flag: '🇮🇳' },
    { city: 'Delhi', country: 'India', users: 387, flag: '🇮🇳' },
    { city: 'Bangalore', country: 'India', users: 298, flag: '🇮🇳' },
    { city: 'New York', country: 'USA', users: 156, flag: '🇺🇸' },
    { city: 'London', country: 'UK', users: 134, flag: '🇬🇧' },
    { city: 'Singapore', country: 'Singapore', users: 98, flag: '🇸🇬' },
  ];

  const recentActivities = [
    { user: 'User #8234', action: 'Viewed product', page: '/products/laptop', time: '2s ago' },
    { user: 'User #7891', action: 'Added to cart', page: '/products/phone', time: '5s ago' },
    { user: 'User #9012', action: 'Completed purchase', page: '/checkout/success', time: '8s ago' },
    { user: 'User #6754', action: 'Signed up', page: '/register', time: '12s ago' },
    { user: 'User #5432', action: 'Started chat', page: '/support', time: '15s ago' },
  ];

  const quickStats = [
    { label: 'Avg. Session', value: '4:32', icon: Clock, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { label: 'Pages/Session', value: '5.8', icon: Eye, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Bounce Rate', value: '32%', icon: MousePointer, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { label: 'Active Now', value: `${liveCount}`, icon: Activity, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Live Users
              </h1>
              <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">LIVE</span>
              </div>
            </div>
            <p className="text-slate-600">Real-time user activity monitoring</p>
          </div>
          <div className="text-right">
            <p className="text-slate-500 text-sm mb-1">Last updated</p>
            <p className="text-slate-700 font-semibold">{new Date().toLocaleTimeString()}</p>
          </div>
        </div>

        {/* Live Counter - Hero Section */}
        <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Users className="w-16 h-16 text-white" />
              <Zap className={`w-8 h-8 text-yellow-300 ${pulse ? 'animate-ping' : ''}`} />
            </div>
            <h2 className="text-white text-2xl font-medium mb-2">Users Online Right Now</h2>
            <div className={`text-8xl font-bold text-white mb-4 transition-all duration-500 ${pulse ? 'scale-110' : 'scale-100'}`}>
              {liveCount.toLocaleString()}
            </div>
            <p className="text-indigo-100 text-lg">People are actively browsing your platform</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
                <div className={`${stat.bgColor} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <p className="text-slate-600 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Device Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Globe className="w-6 h-6 text-indigo-600" />
            Device Distribution
          </h3>
          <div className="space-y-4">
            {deviceStats.map((device, index) => {
              const Icon = device.icon;
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`${device.bgColor} p-2 rounded-lg`}>
                        <Icon className="w-5 h-5 text-slate-700" />
                      </div>
                      <span className="font-semibold text-slate-800">{device.type}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-800">{device.count}</span>
                      <span className="text-slate-500 text-sm ml-2">({device.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${device.color} rounded-full transition-all duration-500`}
                      style={{ width: `${device.percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Pages */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
              Top Active Pages
            </h3>
            <div className="space-y-3">
              {topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm text-slate-700 truncate">{page.page}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                      <span>{page.users} users</span>
                      <span>•</span>
                      <span>{page.views} views</span>
                      <span>•</span>
                      <span>{page.avgTime}</span>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 bg-indigo-100 text-indigo-700 font-bold text-sm px-3 py-1 rounded-full">
                    #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Locations */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-indigo-600" />
              Top Locations
            </h3>
            <div className="space-y-3">
              {topLocations.map((location, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{location.flag}</span>
                    <div>
                      <p className="font-semibold text-slate-800">{location.city}</p>
                      <p className="text-xs text-slate-500">{location.country}</p>
                    </div>
                  </div>
                  <div className="bg-purple-100 text-purple-700 font-bold px-4 py-2 rounded-full">
                    {location.users}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Activity className="w-6 h-6 text-indigo-600" />
            Recent Activity Feed
            <span className="ml-auto text-sm font-normal text-slate-500">Auto-refreshing</span>
          </h3>
          <div className="space-y-2">
            {recentActivities.map((activity, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-4 border-l-4 border-indigo-500 bg-gradient-to-r from-indigo-50 to-transparent rounded-r-xl hover:from-indigo-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {activity.user.slice(-2)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{activity.user}</p>
                    <p className="text-sm text-slate-600">{activity.action} • <span className="font-mono text-xs">{activity.page}</span></p>
                  </div>
                </div>
                <span className="text-xs text-slate-500 font-medium">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}