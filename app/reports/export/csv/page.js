'use client';

import React, { useState } from 'react';
import { Download, FileText, Calendar, Filter, CheckCircle2, Clock, Database, Settings, ChevronDown, X, Upload } from 'lucide-react';

const ExportCSV = () => {
  const [selectedDataType, setSelectedDataType] = useState('sales');
  const [dateRange, setDateRange] = useState('last30days');
  const [selectedFields, setSelectedFields] = useState([]);
  const [exportFormat, setExportFormat] = useState('csv');
  const [showPreview, setShowPreview] = useState(false);

  const dataTypes = [
    { id: 'sales', name: 'Sales Data', icon: '💰', records: '45,234', size: '2.3 MB' },
    { id: 'products', name: 'Product Catalog', icon: '📦', records: '1,856', size: '856 KB' },
    { id: 'customers', name: 'Customer Data', icon: '👥', records: '12,456', size: '1.8 MB' },
    { id: 'orders', name: 'Order History', icon: '🛒', records: '23,890', size: '3.1 MB' },
    { id: 'inventory', name: 'Inventory Levels', icon: '📊', records: '3,245', size: '654 KB' },
    { id: 'analytics', name: 'Analytics Data', icon: '📈', records: '89,234', size: '5.2 MB' },
  ];

  const availableFields = {
    sales: ['Order ID', 'Date', 'Customer Name', 'Product', 'Quantity', 'Amount', 'Payment Method', 'Status'],
    products: ['Product ID', 'Name', 'Category', 'Price', 'Stock', 'SKU', 'Description'],
    customers: ['Customer ID', 'Name', 'Email', 'Phone', 'Address', 'City', 'Country', 'Join Date'],
    orders: ['Order ID', 'Date', 'Customer', 'Total', 'Status', 'Shipping Address', 'Tracking'],
    inventory: ['Product ID', 'Name', 'Stock Level', 'Location', 'Reorder Point', 'Supplier'],
    analytics: ['Date', 'Page Views', 'Unique Visitors', 'Conversion Rate', 'Revenue', 'Bounce Rate'],
  };

  const exportHistory = [
    { id: 1, name: 'Sales_Report_Oct_2024.csv', date: '2 hours ago', size: '2.3 MB', status: 'completed' },
    { id: 2, name: 'Customer_Data_Sept_2024.csv', date: '1 day ago', size: '1.8 MB', status: 'completed' },
    { id: 3, name: 'Product_Catalog_Full.csv', date: '3 days ago', size: '856 KB', status: 'completed' },
    { id: 4, name: 'Orders_Q3_2024.csv', date: '5 days ago', size: '4.2 MB', status: 'completed' },
  ];

  const toggleField = (field) => {
    setSelectedFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  const selectAllFields = () => {
    setSelectedFields(availableFields[selectedDataType] || []);
  };

  const clearAllFields = () => {
    setSelectedFields([]);
  };

  const handleExport = () => {
    setShowPreview(true);
    // Simulate export
    setTimeout(() => {
      setShowPreview(false);
    }, 2000);
  };

  const currentDataType = dataTypes.find(dt => dt.id === selectedDataType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Export Data to CSV</h1>
            <p className="text-slate-600">Download your data in CSV format with custom field selection</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-slate-700">
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Export Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Data Type Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Database className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-slate-800">Select Data Type</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {dataTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setSelectedDataType(type.id);
                      setSelectedFields([]);
                    }}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedDataType === type.id
                        ? 'border-purple-500 bg-purple-50 shadow-md'
                        : 'border-slate-200 hover:border-purple-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="font-medium text-slate-800 text-sm mb-1">{type.name}</div>
                    <div className="text-xs text-slate-500">{type.records} records</div>
                    <div className="text-xs text-slate-400 mt-1">{type.size}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range & Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-slate-800">Date Range & Filters</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Date Range</label>
                  <select 
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="last7days">Last 7 Days</option>
                    <option value="last30days">Last 30 Days</option>
                    <option value="thismonth">This Month</option>
                    <option value="lastmonth">Last Month</option>
                    <option value="thisyear">This Year</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Export Format</label>
                  <select 
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="csv">CSV (Comma Separated)</option>
                    <option value="excel">Excel (.xlsx)</option>
                    <option value="tsv">TSV (Tab Separated)</option>
                    <option value="json">JSON</option>
                  </select>
                </div>
              </div>

              {dateRange === 'custom' && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                    <input 
                      type="date"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
                    <input 
                      type="date"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Field Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg font-semibold text-slate-800">Select Fields to Export</h2>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={selectAllFields}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Select All
                  </button>
                  <span className="text-slate-300">|</span>
                  <button 
                    onClick={clearAllFields}
                    className="text-sm text-slate-600 hover:text-slate-700 font-medium"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {(availableFields[selectedDataType] || []).map((field) => (
                  <button
                    key={field}
                    onClick={() => toggleField(field)}
                    className={`px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                      selectedFields.includes(field)
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-slate-200 text-slate-700 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {selectedFields.includes(field) && (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      {field}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-sm text-purple-800">
                  <span className="font-semibold">{selectedFields.length}</span> fields selected out of {(availableFields[selectedDataType] || []).length}
                </div>
              </div>
            </div>

            {/* Export Button */}
            <div className="bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Ready to Export</h3>
                  <p className="text-purple-100 text-sm">
                    {currentDataType?.records} records • {currentDataType?.size} • {selectedFields.length} fields
                  </p>
                </div>
                <button 
                  onClick={handleExport}
                  disabled={selectedFields.length === 0}
                  className="px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-5 h-5" />
                  Export Now
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar - Export History & Info */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Export Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Total Exports</div>
                      <div className="text-xl font-bold text-slate-800">142</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Database className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Data Exported</div>
                      <div className="text-xl font-bold text-slate-800">24.8 GB</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">This Month</div>
                      <div className="text-xl font-bold text-slate-800">18</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Export History */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Exports</h3>
              <div className="space-y-3">
                {exportHistory.map((item) => (
                  <div key={item.id} className="p-3 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-slate-800 truncate">{item.name}</div>
                          <div className="text-xs text-slate-500 mt-1">{item.date}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{item.size}</div>
                        </div>
                      </div>
                      <button className="text-purple-600 hover:text-purple-700">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 text-sm text-purple-600 hover:text-purple-700 font-medium">
                View All Exports
              </button>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-6">
              <h3 className="text-lg font-semibold text-amber-900 mb-3">💡 Pro Tips</h3>
              <ul className="space-y-2 text-sm text-amber-800">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Select only needed fields to reduce file size</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Use date filters for faster exports</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Large exports are sent via email</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Schedule recurring exports in settings</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Export Progress Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-purple-600 animate-bounce" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Export Started!</h3>
              <p className="text-slate-600 mb-4">Your file is being prepared for download</p>
              <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                <div className="bg-purple-600 h-2 rounded-full animate-progress" style={{ width: '100%' }}></div>
              </div>
              <p className="text-sm text-slate-500">Download will start automatically...</p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
        .animate-progress {
          animation: progress 1.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ExportCSV;