'use client';

import React, { useState } from 'react';
import { TrendingUp, DollarSign, Package, Download, RefreshCw, AlertTriangle, ChevronUp, ChevronDown } from 'lucide-react';

const SalesForecast = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const [forecastModel, setForecastModel] = useState('advanced');

  // Historical and forecasted data
  const forecastData = [
    { month: 'Jan', actual: 45000, forecast: 45000, lower: 43000, upper: 47000 },
    { month: 'Feb', actual: 52000, forecast: 52000, lower: 50000, upper: 54000 },
    { month: 'Mar', actual: 48000, forecast: 48000, lower: 46000, upper: 50000 },
    { month: 'Apr', actual: 61000, forecast: 61000, lower: 59000, upper: 63000 },
    { month: 'May', actual: 55000, forecast: 55000, lower: 53000, upper: 57000 },
    { month: 'Jun', actual: 67000, forecast: 67000, lower: 65000, upper: 69000 },
    { month: 'Jul', actual: null, forecast: 72000, lower: 68000, upper: 76000 },
    { month: 'Aug', actual: null, forecast: 76000, lower: 71000, upper: 81000 },
    { month: 'Sep', actual: null, forecast: 81000, lower: 75000, upper: 87000 },
    { month: 'Oct', actual: null, forecast: 85000, lower: 78000, upper: 92000 },
    { month: 'Nov', actual: null, forecast: 93000, lower: 85000, upper: 101000 },
    { month: 'Dec', actual: null, forecast: 98000, lower: 89000, upper: 107000 },
  ];

  const categoryForecast = [
    { category: 'Electronics', current: 125000, forecast: 145000, growth: 16 },
    { category: 'Clothing', current: 98000, forecast: 112000, growth: 14.3 },
    { category: 'Home & Garden', current: 78000, forecast: 86000, growth: 10.3 },
    { category: 'Sports', current: 56000, forecast: 71000, growth: 26.8 },
    { category: 'Beauty', current: 43000, forecast: 49000, growth: 14 },
  ];

  const confidenceMetrics = [
    { metric: 'Forecast Accuracy', value: '94.2%', trend: 'up', color: 'text-green-600' },
    { metric: 'Confidence Level', value: '89%', trend: 'up', color: 'text-blue-600' },
    { metric: 'Model Precision', value: '91.7%', trend: 'stable', color: 'text-purple-600' },
    { metric: 'Data Quality Score', value: '96%', trend: 'up', color: 'text-indigo-600' },
  ];

  const insights = [
    {
      title: 'Strong Q4 Growth Expected',
      description: 'Holiday season forecasts show 35% increase in sales volume',
      impact: 'high',
      probability: 92
    },
    {
      title: 'Electronics Category Surge',
      description: 'New product launches predicted to drive 40% category growth',
      impact: 'high',
      probability: 87
    },
    {
      title: 'Seasonal Pattern Detected',
      description: 'Historical data shows consistent 15% uptick in August-September',
      impact: 'medium',
      probability: 95
    },
  ];

  const maxValue = Math.max(...forecastData.map(d => Math.max(d.actual || 0, d.forecast, d.upper)));
  const minValue = Math.min(...forecastData.map(d => Math.min(d.actual || d.forecast, d.forecast, d.lower)));

  const getYPosition = (value) => {
    return 100 - ((value - minValue) / (maxValue - minValue)) * 90;
  };

  const maxCategory = Math.max(...categoryForecast.map(c => Math.max(c.current, c.forecast)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Sales Forecast</h1>
            <p className="text-slate-600">AI-powered predictive analytics and trend forecasting</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-slate-700">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">Forecast Period</label>
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="3months">Next 3 Months</option>
                <option value="6months">Next 6 Months</option>
                <option value="12months">Next 12 Months</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">Forecast Model</label>
              <select 
                value={forecastModel}
                onChange={(e) => setForecastModel(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="basic">Basic Trend</option>
                <option value="advanced">Advanced ML</option>
                <option value="seasonal">Seasonal ARIMA</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">Confidence Level</label>
              <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                <option>80% Confidence</option>
                <option>90% Confidence</option>
                <option>95% Confidence</option>
              </select>
            </div>
          </div>
        </div>

        {/* Confidence Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {confidenceMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">{metric.metric}</span>
                {metric.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
              </div>
              <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
            </div>
          ))}
        </div>

        {/* Main Forecast Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Sales Forecast with Confidence Intervals</h2>
              <p className="text-sm text-slate-600 mt-1">Historical data vs predicted future sales</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                <span className="text-slate-600">Actual</span>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-slate-600">Forecast</span>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                <span className="text-slate-600">Confidence Range</span>
              </div>
            </div>
          </div>
          
          {/* Custom SVG Chart */}
          <div className="relative" style={{ height: '400px' }}>
            <svg width="100%" height="100%" viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4, 5].map(i => (
                <g key={i}>
                  <line x1="80" y1={50 + i * 60} x2="950" y2={50 + i * 60} stroke="#e2e8f0" strokeDasharray="5,5" />
                  <text x="70" y={50 + i * 60 + 5} textAnchor="end" fontSize="12" fill="#64748b">
                    ${Math.round(maxValue - (i * (maxValue - minValue) / 5) / 1000)}K
                  </text>
                </g>
              ))}

              {/* Confidence interval area */}
              <path
                d={forecastData.map((d, i) => {
                  const x = 80 + (i * 72.5);
                  const yUpper = getYPosition(d.upper);
                  return `${i === 0 ? 'M' : 'L'}${x},${yUpper}`;
                }).join(' ') + 
                forecastData.slice().reverse().map((d, i) => {
                  const x = 80 + ((forecastData.length - 1 - i) * 72.5);
                  const yLower = getYPosition(d.lower);
                  return `L${x},${yLower}`;
                }).join(' ') + 'Z'}
                fill="#e2e8f0"
                opacity="0.4"
              />

              {/* Actual line */}
              <path
                d={forecastData.filter(d => d.actual !== null).map((d, i) => {
                  const x = 80 + (i * 72.5);
                  const y = getYPosition(d.actual);
                  return `${i === 0 ? 'M' : 'L'}${x},${y}`;
                }).join(' ')}
                stroke="#4f46e5"
                strokeWidth="3"
                fill="none"
              />

              {/* Forecast line */}
              <path
                d={forecastData.map((d, i) => {
                  const x = 80 + (i * 72.5);
                  const y = getYPosition(d.forecast);
                  return `${i === 0 ? 'M' : 'L'}${x},${y}`;
                }).join(' ')}
                stroke="#10b981"
                strokeWidth="3"
                fill="none"
                strokeDasharray="8,4"
              />

              {/* Data points */}
              {forecastData.map((d, i) => {
                const x = 80 + (i * 72.5);
                if (d.actual !== null) {
                  const y = getYPosition(d.actual);
                  return <circle key={`actual-${i}`} cx={x} cy={y} r="5" fill="#4f46e5" />;
                }
                return null;
              })}

              {forecastData.map((d, i) => {
                if (d.actual === null) {
                  const x = 80 + (i * 72.5);
                  const y = getYPosition(d.forecast);
                  return <circle key={`forecast-${i}`} cx={x} cy={y} r="5" fill="#10b981" />;
                }
                return null;
              })}

              {/* X-axis labels */}
              {forecastData.map((d, i) => (
                <text key={i} x={80 + (i * 72.5)} y="380" textAnchor="middle" fontSize="12" fill="#64748b">
                  {d.month}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Category Forecast and Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Forecast */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Category Forecast</h2>
            <div className="space-y-5">
              {categoryForecast.map((cat, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">{cat.category}</span>
                    <span className="text-sm font-semibold text-emerald-600">+{cat.growth}%</span>
                  </div>
                  <div className="flex gap-2 items-end h-12">
                    <div className="flex-1 relative">
                      <div className="absolute bottom-0 w-full bg-indigo-200 rounded-t" style={{ height: `${(cat.current / maxCategory) * 100}%` }}>
                        <div className="absolute inset-0 bg-indigo-600 rounded-t opacity-70"></div>
                      </div>
                    </div>
                    <div className="flex-1 relative">
                      <div className="absolute bottom-0 w-full bg-emerald-200 rounded-t" style={{ height: `${(cat.forecast / maxCategory) * 100}%` }}>
                        <div className="absolute inset-0 bg-emerald-500 rounded-t opacity-70"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-slate-600">
                    <span>${(cat.current / 1000).toFixed(0)}K</span>
                    <span>${(cat.forecast / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              ))}
              <div className="flex gap-4 pt-4 border-t border-slate-200 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-indigo-600 rounded"></div>
                  <span className="text-slate-600">Current Sales</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded"></div>
                  <span className="text-slate-600">Forecasted Sales</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Insights */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Key Insights</h2>
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-slate-800">{insight.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      insight.impact === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {insight.impact.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{insight.description}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full transition-all" 
                        style={{ width: `${insight.probability}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-slate-700">{insight.probability}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Growth Projections */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5" />
                <span className="text-indigo-100">Projected Revenue</span>
              </div>
              <div className="text-3xl font-bold">$1.2M</div>
              <div className="text-indigo-100 text-sm mt-1">Next 6 months</div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5" />
                <span className="text-indigo-100">Growth Rate</span>
              </div>
              <div className="text-3xl font-bold">+24.5%</div>
              <div className="text-indigo-100 text-sm mt-1">Year over year</div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-5 h-5" />
                <span className="text-indigo-100">Units Forecast</span>
              </div>
              <div className="text-3xl font-bold">15.4K</div>
              <div className="text-indigo-100 text-sm mt-1">Total units projected</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesForecast;