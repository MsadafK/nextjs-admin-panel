'use client';

import React, { useState } from 'react';
import { FileText, Download, Layout, Palette, Image, Type, Settings, CheckCircle2, Eye, Sparkles, ChevronDown, Save, Printer } from 'lucide-react';

const ExportPDF = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [reportType, setReportType] = useState('sales');
  const [pageSize, setPageSize] = useState('a4');
  const [orientation, setOrientation] = useState('portrait');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeLogo, setIncludeLogo] = useState(true);
  const [includeFooter, setIncludeFooter] = useState(true);
  const [colorScheme, setColorScheme] = useState('default');
  const [showPreview, setShowPreview] = useState(false);
  const [generating, setGenerating] = useState(false);

  const templates = [
    {
      id: 'professional',
      name: 'Professional',
      preview: '📊',
      description: 'Clean corporate design with charts',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'modern',
      name: 'Modern',
      preview: '✨',
      description: 'Contemporary layout with bold colors',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      preview: '📄',
      description: 'Simple and elegant design',
      color: 'from-slate-500 to-slate-600'
    },
    {
      id: 'executive',
      name: 'Executive',
      preview: '👔',
      description: 'Premium design for stakeholders',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      id: 'creative',
      name: 'Creative',
      preview: '🎨',
      description: 'Vibrant and eye-catching',
      color: 'from-pink-500 to-pink-600'
    },
    {
      id: 'technical',
      name: 'Technical',
      preview: '⚙️',
      description: 'Detailed technical documentation',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  const reportTypes = [
    { id: 'sales', name: 'Sales Report', icon: '💰', pages: '12-15' },
    { id: 'financial', name: 'Financial Summary', icon: '📈', pages: '20-25' },
    { id: 'inventory', name: 'Inventory Status', icon: '📦', pages: '8-10' },
    { id: 'customer', name: 'Customer Analytics', icon: '👥', pages: '15-18' },
    { id: 'performance', name: 'Performance Review', icon: '⚡', pages: '10-12' },
    { id: 'custom', name: 'Custom Report', icon: '🔧', pages: 'Variable' }
  ];

  const colorSchemes = [
    { id: 'default', name: 'Default Blue', colors: ['#3b82f6', '#1e40af', '#dbeafe'] },
    { id: 'emerald', name: 'Emerald Green', colors: ['#10b981', '#047857', '#d1fae5'] },
    { id: 'purple', name: 'Royal Purple', colors: ['#8b5cf6', '#6d28d9', '#ede9fe'] },
    { id: 'orange', name: 'Sunset Orange', colors: ['#f97316', '#c2410c', '#ffedd5'] },
    { id: 'rose', name: 'Rose Red', colors: ['#f43f5e', '#be123c', '#ffe4e6'] },
    { id: 'slate', name: 'Classic Gray', colors: ['#64748b', '#334155', '#f1f5f9'] }
  ];

  const recentExports = [
    { id: 1, name: 'Sales_Report_Q4_2024.pdf', date: '1 hour ago', size: '3.2 MB', template: 'Professional' },
    { id: 2, name: 'Financial_Summary_Oct.pdf', date: '5 hours ago', size: '5.1 MB', template: 'Executive' },
    { id: 3, name: 'Inventory_Report_2024.pdf', date: '1 day ago', size: '2.8 MB', template: 'Minimal' },
    { id: 4, name: 'Customer_Analytics_Sept.pdf', date: '2 days ago', size: '4.5 MB', template: 'Modern' }
  ];

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setShowPreview(true);
      setTimeout(() => setShowPreview(false), 2500);
    }, 2000);
  };

  const currentTemplate = templates.find(t => t.id === selectedTemplate);
  const currentReport = reportTypes.find(r => r.id === reportType);
  const currentColorScheme = colorSchemes.find(c => c.id === colorScheme);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Export to PDF</h1>
            <p className="text-slate-600">Create beautiful, professional PDF reports with custom styling</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-slate-700">
              <Save className="w-4 h-4" />
              Save Template
            </button>
            <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-slate-700">
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Template Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Layout className="w-5 h-5 text-rose-600" />
                <h2 className="text-lg font-semibold text-slate-800">Choose Template</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedTemplate === template.id
                        ? 'border-rose-500 shadow-lg scale-105'
                        : 'border-slate-200 hover:border-rose-300'
                    }`}
                  >
                    <div className={`w-full h-24 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center text-4xl mb-3 shadow-inner`}>
                      {template.preview}
                    </div>
                    <div className="font-semibold text-slate-800 text-sm mb-1">{template.name}</div>
                    <div className="text-xs text-slate-500">{template.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Report Type Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-rose-600" />
                <h2 className="text-lg font-semibold text-slate-800">Report Type</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {reportTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setReportType(type.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      reportType === type.id
                        ? 'border-rose-500 bg-rose-50'
                        : 'border-slate-200 hover:border-rose-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="font-medium text-slate-800 text-sm mb-1">{type.name}</div>
                    <div className="text-xs text-slate-500">{type.pages} pages</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Page Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-rose-600" />
                <h2 className="text-lg font-semibold text-slate-800">Page Settings</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Page Size</label>
                  <select 
                    value={pageSize}
                    onChange={(e) => setPageSize(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  >
                    <option value="a4">A4 (210 × 297 mm)</option>
                    <option value="letter">Letter (8.5 × 11 in)</option>
                    <option value="legal">Legal (8.5 × 14 in)</option>
                    <option value="a3">A3 (297 × 420 mm)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Orientation</label>
                  <select 
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Color Scheme */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-rose-600" />
                <h2 className="text-lg font-semibold text-slate-800">Color Scheme</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {colorSchemes.map((scheme) => (
                  <button
                    key={scheme.id}
                    onClick={() => setColorScheme(scheme.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      colorScheme === scheme.id
                        ? 'border-rose-500 bg-rose-50'
                        : 'border-slate-200 hover:border-rose-300'
                    }`}
                  >
                    <div className="flex gap-1 mb-2">
                      {scheme.colors.map((color, idx) => (
                        <div key={idx} className="w-8 h-8 rounded" style={{ backgroundColor: color }}></div>
                      ))}
                    </div>
                    <div className="font-medium text-slate-800 text-sm">{scheme.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Options */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Image className="w-5 h-5 text-rose-600" />
                <h2 className="text-lg font-semibold text-slate-800">Content Options</h2>
              </div>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      📊
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">Include Charts & Graphs</div>
                      <div className="text-xs text-slate-500">Add visual data representations</div>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={includeCharts}
                    onChange={(e) => setIncludeCharts(e.target.checked)}
                    className="w-5 h-5 text-rose-600 rounded focus:ring-2 focus:ring-rose-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      🖼️
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">Include Company Logo</div>
                      <div className="text-xs text-slate-500">Show branding on header</div>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={includeLogo}
                    onChange={(e) => setIncludeLogo(e.target.checked)}
                    className="w-5 h-5 text-rose-600 rounded focus:ring-2 focus:ring-rose-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      📝
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">Include Footer Info</div>
                      <div className="text-xs text-slate-500">Page numbers and timestamps</div>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={includeFooter}
                    onChange={(e) => setIncludeFooter(e.target.checked)}
                    className="w-5 h-5 text-rose-600 rounded focus:ring-2 focus:ring-rose-500"
                  />
                </label>
              </div>
            </div>

            {/* Generate Button */}
            <div className="bg-gradient-to-r from-rose-600 to-orange-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Ready to Generate</h3>
                  <p className="text-rose-100 text-sm">
                    {currentReport?.name} • {currentTemplate?.name} Template • {pageSize.toUpperCase()} {orientation}
                  </p>
                </div>
                <button 
                  onClick={handleGenerate}
                  disabled={generating}
                  className="px-6 py-3 bg-white text-rose-600 rounded-lg hover:bg-rose-50 transition-colors flex items-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Generate PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-rose-600" />
                <h3 className="text-lg font-semibold text-slate-800">Preview</h3>
              </div>
              <div className="aspect-[8.5/11] bg-slate-100 rounded-lg border-2 border-slate-200 flex items-center justify-center overflow-hidden">
                <div className={`w-full h-full bg-gradient-to-br ${currentTemplate?.color} opacity-20 flex items-center justify-center text-6xl`}>
                  {currentTemplate?.preview}
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Template:</span>
                  <span className="font-medium text-slate-800">{currentTemplate?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Est. Size:</span>
                  <span className="font-medium text-slate-800">3-5 MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Pages:</span>
                  <span className="font-medium text-slate-800">{currentReport?.pages}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-rose-600 to-pink-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Export Statistics</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-rose-100 text-sm mb-1">Total PDFs Generated</div>
                  <div className="text-3xl font-bold">284</div>
                </div>
                <div>
                  <div className="text-rose-100 text-sm mb-1">This Month</div>
                  <div className="text-3xl font-bold">42</div>
                </div>
                <div>
                  <div className="text-rose-100 text-sm mb-1">Total Size</div>
                  <div className="text-3xl font-bold">1.2 GB</div>
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
                        <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-rose-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-slate-800 truncate">{item.name}</div>
                          <div className="text-xs text-slate-500 mt-1">{item.date}</div>
                          <div className="text-xs text-slate-400">{item.size} • {item.template}</div>
                        </div>
                      </div>
                      <button className="text-rose-600 hover:text-rose-700">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">Pro Tips</h3>
              </div>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Use landscape for wide charts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Professional template for stakeholders</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Disable charts to reduce file size</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Save templates for quick access</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-rose-600 animate-bounce" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">PDF Generated Successfully!</h3>
              <p className="text-slate-600 mb-4">Your professional PDF report is ready</p>
              <div className="bg-rose-50 rounded-lg p-4 mb-4">
                <div className="text-sm text-slate-700 mb-1">
                  <span className="font-semibold">{currentReport?.name}</span>
                </div>
                <div className="text-xs text-slate-500">
                  {currentTemplate?.name} Template • {pageSize.toUpperCase()} {orientation}
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

export default ExportPDF;