'use client';

import React, { useState } from 'react';
import { FileSpreadsheet, Download, Layers, Grid, BarChart3, Table, CheckCircle2, Sparkles, TrendingUp, Calendar, Database, Settings, Eye, Plus, Trash2, Edit3 } from 'lucide-react';

const ExportExcel = () => {
  const [selectedSheets, setSelectedSheets] = useState(['sales']);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includePivot, setIncludePivot] = useState(false);
  const [includeFormatting, setIncludeFormatting] = useState(true);
  const [includeFormulas, setIncludeFormulas] = useState(true);
  const [protectSheets, setProtectSheets] = useState(false);
  const [fileFormat, setFileFormat] = useState('xlsx');
  const [generating, setGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const availableSheets = [
    { 
      id: 'sales', 
      name: 'Sales Data', 
      icon: '💰', 
      rows: '12,456',
      columns: '18',
      description: 'Detailed sales transactions and revenue data'
    },
    { 
      id: 'products', 
      name: 'Product Catalog', 
      icon: '📦', 
      rows: '2,345',
      columns: '12',
      description: 'Complete product inventory and pricing'
    },
    { 
      id: 'customers', 
      name: 'Customer Database', 
      icon: '👥', 
      rows: '8,901',
      columns: '15',
      description: 'Customer information and contact details'
    },
    { 
      id: 'orders', 
      name: 'Order History', 
      icon: '🛒', 
      rows: '15,678',
      columns: '20',
      description: 'Complete order tracking and fulfillment'
    },
    { 
      id: 'inventory', 
      name: 'Inventory Levels', 
      icon: '📊', 
      rows: '3,456',
      columns: '10',
      description: 'Stock levels and warehouse locations'
    },
    { 
      id: 'analytics', 
      name: 'Analytics Summary', 
      icon: '📈', 
      rows: '5,234',
      columns: '25',
      description: 'KPIs and performance metrics'
    },
    { 
      id: 'financial', 
      name: 'Financial Reports', 
      icon: '💵', 
      rows: '4,567',
      columns: '16',
      description: 'Revenue, expenses, and profit analysis'
    },
    { 
      id: 'dashboard', 
      name: 'Executive Dashboard', 
      icon: '📊', 
      rows: '890',
      columns: '8',
      description: 'High-level summary for stakeholders'
    }
  ];

  const chartTypes = [
    { id: 'line', name: 'Line Charts', icon: '📈', enabled: true },
    { id: 'bar', name: 'Bar Charts', icon: '📊', enabled: true },
    { id: 'pie', name: 'Pie Charts', icon: '🥧', enabled: true },
    { id: 'scatter', name: 'Scatter Plots', icon: '⚫', enabled: false }
  ];

  const recentExports = [
    { id: 1, name: 'Sales_Analysis_Q4_2024.xlsx', date: '30 mins ago', size: '4.8 MB', sheets: 5 },
    { id: 2, name: 'Product_Inventory_Full.xlsx', date: '2 hours ago', size: '2.3 MB', sheets: 3 },
    { id: 3, name: 'Customer_Report_Oct.xlsx', date: '5 hours ago', size: '3.1 MB', sheets: 4 },
    { id: 4, name: 'Financial_Summary_2024.xlsx', date: '1 day ago', size: '5.6 MB', sheets: 8 }
  ];

  const formatOptions = [
    { id: 'xlsx', name: 'Excel Workbook (.xlsx)', description: 'Latest Excel format with all features', recommended: true },
    { id: 'xlsm', name: 'Excel Macro-Enabled (.xlsm)', description: 'For workbooks with VBA macros' },
    { id: 'xls', name: 'Excel 97-2003 (.xls)', description: 'Compatible with older Excel versions' },
    { id: 'csv', name: 'CSV (Comma Separated)', description: 'Simple text format, single sheet only' }
  ];

  const toggleSheet = (sheetId) => {
    setSelectedSheets(prev => 
      prev.includes(sheetId) 
        ? prev.filter(id => id !== sheetId)
        : [...prev, sheetId]
    );
  };

  const selectAllSheets = () => {
    setSelectedSheets(availableSheets.map(s => s.id));
  };

  const clearAllSheets = () => {
    setSelectedSheets([]);
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
    }, 2000);
  };

  const totalRows = availableSheets
    .filter(s => selectedSheets.includes(s.id))
    .reduce((sum, s) => sum + parseInt(s.rows.replace(',', '')), 0);

  const estimatedSize = (selectedSheets.length * 0.5 + (includeCharts ? 1 : 0) + (includePivot ? 0.5 : 0)).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Export to Excel</h1>
            <p className="text-slate-600">Create comprehensive Excel workbooks with multiple sheets and advanced features</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-slate-700">
              <Settings className="w-4 h-4" />
              Advanced Settings
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sheet Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-lg font-semibold text-slate-800">Select Sheets to Include</h2>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={selectAllSheets}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Select All
                  </button>
                  <span className="text-slate-300">|</span>
                  <button 
                    onClick={clearAllSheets}
                    className="text-sm text-slate-600 hover:text-slate-700 font-medium"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableSheets.map((sheet) => (
                  <button
                    key={sheet.id}
                    onClick={() => toggleSheet(sheet.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedSheets.includes(sheet.id)
                        ? 'border-emerald-500 bg-emerald-50 shadow-md'
                        : 'border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{sheet.icon}</span>
                        <div>
                          <div className="font-semibold text-slate-800 text-sm">{sheet.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{sheet.description}</div>
                        </div>
                      </div>
                      {selectedSheets.includes(sheet.id) && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex gap-3 text-xs text-slate-500 mt-2">
                      <span>📄 {sheet.rows} rows</span>
                      <span>📊 {sheet.columns} cols</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="text-sm text-emerald-800">
                  <span className="font-semibold">{selectedSheets.length}</span> sheets selected • 
                  <span className="font-semibold"> {totalRows.toLocaleString()}</span> total rows
                </div>
              </div>
            </div>

            {/* File Format */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-slate-800">File Format</h2>
              </div>
              <div className="space-y-3">
                {formatOptions.map((format) => (
                  <label
                    key={format.id}
                    className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      fileFormat === format.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="format"
                      value={format.id}
                      checked={fileFormat === format.id}
                      onChange={(e) => setFileFormat(e.target.value)}
                      className="mt-1 w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">{format.name}</span>
                        {format.recommended && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{format.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Advanced Features */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-slate-800">Advanced Features</h2>
              </div>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      📊
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">Include Charts & Graphs</div>
                      <div className="text-xs text-slate-500">Add visual data representations to sheets</div>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={includeCharts}
                    onChange={(e) => setIncludeCharts(e.target.checked)}
                    className="w-5 h-5 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      🔄
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">Create Pivot Tables</div>
                      <div className="text-xs text-slate-500">Auto-generate summary pivot tables</div>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={includePivot}
                    onChange={(e) => setIncludePivot(e.target.checked)}
                    className="w-5 h-5 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                      🎨
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">Rich Formatting</div>
                      <div className="text-xs text-slate-500">Colors, fonts, and cell styling</div>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={includeFormatting}
                    onChange={(e) => setIncludeFormatting(e.target.checked)}
                    className="w-5 h-5 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      🧮
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">Include Formulas</div>
                      <div className="text-xs text-slate-500">Keep Excel formulas for calculations</div>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={includeFormulas}
                    onChange={(e) => setIncludeFormulas(e.target.checked)}
                    className="w-5 h-5 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      🔒
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">Password Protection</div>
                      <div className="text-xs text-slate-500">Lock sheets with password</div>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={protectSheets}
                    onChange={(e) => setProtectSheets(e.target.checked)}
                    className="w-5 h-5 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                  />
                </label>
              </div>
            </div>

            {/* Chart Types (shown when includeCharts is true) */}
            {includeCharts && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-lg font-semibold text-slate-800">Chart Types to Include</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {chartTypes.map((chart) => (
                    <div
                      key={chart.id}
                      className={`p-4 rounded-lg border-2 text-center ${
                        chart.enabled
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <div className="text-3xl mb-2">{chart.icon}</div>
                      <div className="text-sm font-medium text-slate-800">{chart.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Generate Button */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Ready to Export</h3>
                  <p className="text-emerald-100 text-sm">
                    {selectedSheets.length} sheets • {estimatedSize} MB estimated • {fileFormat.toUpperCase()} format
                  </p>
                </div>
                <button 
                  onClick={handleGenerate}
                  disabled={selectedSheets.length === 0 || generating}
                  className="px-6 py-3 bg-white text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors flex items-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Generate Excel
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Preview */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-semibold text-slate-800">Export Preview</h3>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <div className="text-xs text-emerald-600 font-medium mb-1">WORKBOOK INFO</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Sheets:</span>
                      <span className="font-semibold text-slate-800">{selectedSheets.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Rows:</span>
                      <span className="font-semibold text-slate-800">{totalRows.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Est. Size:</span>
                      <span className="font-semibold text-slate-800">{estimatedSize} MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Format:</span>
                      <span className="font-semibold text-slate-800">.{fileFormat}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-xs text-blue-600 font-medium mb-1">FEATURES</div>
                  <div className="flex flex-wrap gap-1">
                    {includeCharts && <span className="px-2 py-1 bg-white rounded text-xs">📊 Charts</span>}
                    {includePivot && <span className="px-2 py-1 bg-white rounded text-xs">🔄 Pivot</span>}
                    {includeFormatting && <span className="px-2 py-1 bg-white rounded text-xs">🎨 Styling</span>}
                    {includeFormulas && <span className="px-2 py-1 bg-white rounded text-xs">🧮 Formulas</span>}
                    {protectSheets && <span className="px-2 py-1 bg-white rounded text-xs">🔒 Protected</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Export Statistics</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-emerald-100 text-sm mb-1">Total Exports</div>
                  <div className="text-3xl font-bold">1,247</div>
                </div>
                <div>
                  <div className="text-emerald-100 text-sm mb-1">This Month</div>
                  <div className="text-3xl font-bold">89</div>
                </div>
                <div>
                  <div className="text-emerald-100 text-sm mb-1">Total Size</div>
                  <div className="text-3xl font-bold">8.4 GB</div>
                </div>
              </div>
            </div>

            {/* Recent Exports */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Exports</h3>
              <div className="space-y-3">
                {recentExports.map((item) => (
                  <div key={item.id} className="p-3 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-slate-800 truncate">{item.name}</div>
                          <div className="text-xs text-slate-500 mt-1">{item.date}</div>
                          <div className="text-xs text-slate-400">{item.size} • {item.sheets} sheets</div>
                        </div>
                      </div>
                      <button className="text-emerald-600 hover:text-emerald-700">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-semibold text-amber-900">Excel Tips</h3>
              </div>
              <ul className="space-y-2 text-sm text-amber-800">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Use .xlsx for maximum compatibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Pivot tables work best with clean data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Charts update automatically with data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Password protection adds security</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 animate-bounce" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Excel Workbook Generated!</h3>
              <p className="text-slate-600 mb-4">Your comprehensive Excel file is ready for download</p>
              <div className="bg-emerald-50 rounded-lg p-4 mb-4">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Sheets:</span>
                    <span className="font-semibold text-slate-800">{selectedSheets.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Size:</span>
                    <span className="font-semibold text-slate-800">{estimatedSize} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Format:</span>
                    <span className="font-semibold text-slate-800">.{fileFormat}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-500">Download starting automatically...</p>
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
      `}</style>
    </div>
  );
};

export default ExportExcel;