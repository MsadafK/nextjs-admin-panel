'use client';

import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X, File, Database, RefreshCw, Play, Pause, Settings, Eye, Download, Trash2, FileSpreadsheet, FileJson, FileCode } from 'lucide-react';

const ImportData = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [importSettings, setImportSettings] = useState({
    skipDuplicates: true,
    validateData: true,
    createBackup: true,
    delimiter: 'comma'
  });

  const supportedFormats = [
    { 
      id: 'csv', 
      name: 'CSV Files', 
      icon: '📊', 
      extensions: '.csv',
      color: 'from-green-500 to-green-600',
      description: 'Comma-separated values'
    },
    { 
      id: 'excel', 
      name: 'Excel Files', 
      icon: '📈', 
      extensions: '.xlsx, .xls',
      color: 'from-emerald-500 to-emerald-600',
      description: 'Microsoft Excel workbooks'
    },
    { 
      id: 'json', 
      name: 'JSON Files', 
      icon: '{ }', 
      extensions: '.json',
      color: 'from-blue-500 to-blue-600',
      description: 'JavaScript Object Notation'
    },
    { 
      id: 'xml', 
      name: 'XML Files', 
      icon: '</>', 
      extensions: '.xml',
      color: 'from-purple-500 to-purple-600',
      description: 'Extensible Markup Language'
    },
    { 
      id: 'txt', 
      name: 'Text Files', 
      icon: '📄', 
      extensions: '.txt, .tsv',
      color: 'from-gray-500 to-gray-600',
      description: 'Plain text and tab-separated'
    },
    { 
      id: 'sql', 
      name: 'SQL Dumps', 
      icon: '🗄️', 
      extensions: '.sql',
      color: 'from-indigo-500 to-indigo-600',
      description: 'Database export files'
    }
  ];

  const importHistory = [
    { 
      id: 1, 
      name: 'sales_data_2024.csv', 
      date: '2 hours ago', 
      records: '12,456',
      status: 'success',
      size: '2.3 MB'
    },
    { 
      id: 2, 
      name: 'customer_database.xlsx', 
      date: '5 hours ago', 
      records: '8,901',
      status: 'success',
      size: '4.1 MB'
    },
    { 
      id: 3, 
      name: 'inventory_update.json', 
      date: '1 day ago', 
      records: '3,245',
      status: 'success',
      size: '856 KB'
    },
    { 
      id: 4, 
      name: 'products_catalog.csv', 
      date: '2 days ago', 
      records: '5,678',
      status: 'partial',
      size: '1.2 MB'
    }
  ];

  const validationRules = [
    { id: 1, rule: 'Data Type Validation', enabled: true, description: 'Check column data types' },
    { id: 2, rule: 'Required Fields', enabled: true, description: 'Ensure mandatory fields exist' },
    { id: 3, rule: 'Format Validation', enabled: true, description: 'Validate email, phone, etc.' },
    { id: 4, rule: 'Range Checks', enabled: false, description: 'Verify numeric ranges' },
    { id: 5, rule: 'Duplicate Detection', enabled: true, description: 'Find duplicate records' }
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const newFiles = Array.from(files).map((file, index) => ({
      id: Date.now() + index,
      file: file,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.name.split('.').pop().toUpperCase(),
      status: 'pending',
      progress: 0
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const startImport = () => {
    setImporting(true);
    setImportProgress(0);
    
    const interval = setInterval(() => {
      setImportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setImporting(false);
          // Update file statuses
          setUploadedFiles(prev => prev.map(f => ({...f, status: 'success', progress: 100})));
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const getFileIcon = (type) => {
    const icons = {
      CSV: <FileSpreadsheet className="w-5 h-5 text-green-600" />,
      XLSX: <FileSpreadsheet className="w-5 h-5 text-emerald-600" />,
      XLS: <FileSpreadsheet className="w-5 h-5 text-emerald-600" />,
      JSON: <FileJson className="w-5 h-5 text-blue-600" />,
      XML: <FileCode className="w-5 h-5 text-purple-600" />,
      TXT: <FileText className="w-5 h-5 text-muted-foreground" />,
      SQL: <Database className="w-5 h-5 text-indigo-600" />
    };
    return icons[type] || <File className="w-5 h-5 text-muted-foreground" />;
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">Pending</span>,
      success: <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Success</span>,
      partial: <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">Partial</span>,
      failed: <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">Failed</span>
    };
    return badges[status];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground mb-2">Import Data</h1>
            <p className="text-muted-foreground">Upload and import your data files with automatic validation</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted transition-colors flex items-center gap-2 text-foreground">
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <button className="px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted transition-colors flex items-center gap-2 text-foreground">
              <Download className="w-4 h-4" />
              Template
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Import Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Zone */}
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Upload className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-foreground">Upload Files</h2>
              </div>

              <div
                className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                  dragActive 
                    ? 'border-blue-500 bg-muted' 
                    : 'border-border hover:border-blue-400 hover:bg-muted'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                  accept=".csv,.xlsx,.xls,.json,.xml,.txt,.tsv,.sql"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {dragActive ? 'Drop files here' : 'Drag & drop files here'}
                  </h3>
                  <p className="text-muted-foreground mb-4">or click to browse from your computer</p>
                  <button className="px-6 py-2.5 bg-foreground text-background rounded-lg hover:opacity-90 transition-colors font-medium">
                    Select Files
                  </button>
                </label>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span>Supported formats:</span>
                <span className="font-medium text-foreground">CSV, Excel, JSON, XML, TXT, SQL</span>
              </div>
            </div>

            {/* Supported Formats */}
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-foreground">Supported File Formats</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {supportedFormats.map((format) => (
                  <div
                    key={format.id}
                    className="p-4 rounded-lg border border-border hover:border-blue-300 hover:shadow-card transition-all"
                  >
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${format.color} flex items-center justify-center text-background text-lg mb-3 shadow-inner`}>
                      {format.icon}
                    </div>
                    <div className="font-semibold text-foreground text-sm mb-1">{format.name}</div>
                    <div className="text-xs text-muted-foreground mb-1">{format.description}</div>
                    <div className="text-xs text-muted-foreground">{format.extensions}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-foreground">Uploaded Files ({uploadedFiles.length})</h2>
                  </div>
                  <button 
                    onClick={() => setUploadedFiles([])}
                    className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </button>
                </div>

                <div className="space-y-3">
                  {uploadedFiles.map((file) => (
                    <div 
                      key={file.id} 
                      className="p-4 border border-border rounded-lg hover:shadow-card transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                            {getFileIcon(file.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-foreground truncate">{file.name}</div>
                            <div className="text-sm text-muted-foreground mt-1">{file.size} • {file.type}</div>
                            {file.status === 'success' && (
                              <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Import completed successfully
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(file.status)}
                          <button 
                            onClick={() => removeFile(file.id)}
                            className="text-muted-foreground hover:text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {file.status === 'pending' && file.progress > 0 && (
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all" 
                            style={{ width: `${file.progress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Import Settings */}
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-foreground">Import Settings</h2>
              </div>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 border border-border rounded-lg cursor-pointer hover:bg-muted">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      🔍
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Skip Duplicates</div>
                      <div className="text-xs text-muted-foreground">Ignore records that already exist</div>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={importSettings.skipDuplicates}
                    onChange={(e) => setImportSettings({...importSettings, skipDuplicates: e.target.checked})}
                    className="w-5 h-5 text-blue-600 rounded focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </label>

                <label className="flex items-center justify-between p-3 border border-border rounded-lg cursor-pointer hover:bg-muted">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      ✓
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Validate Data</div>
                      <div className="text-xs text-muted-foreground">Check data integrity before import</div>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={importSettings.validateData}
                    onChange={(e) => setImportSettings({...importSettings, validateData: e.target.checked})}
                    className="w-5 h-5 text-blue-600 rounded focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </label>

                <label className="flex items-center justify-between p-3 border border-border rounded-lg cursor-pointer hover:bg-muted">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      💾
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Create Backup</div>
                      <div className="text-xs text-muted-foreground">Backup existing data before import</div>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={importSettings.createBackup}
                    onChange={(e) => setImportSettings({...importSettings, createBackup: e.target.checked})}
                    className="w-5 h-5 text-blue-600 rounded focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </label>

                <div className="p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      📋
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground">Delimiter</div>
                      <div className="text-xs text-muted-foreground">CSV file delimiter character</div>
                    </div>
                  </div>
                  <select 
                    value={importSettings.delimiter}
                    onChange={(e) => setImportSettings({...importSettings, delimiter: e.target.value})}
                    className="w-full mt-2 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring text-sm"
                  >
                    <option value="comma">Comma (,)</option>
                    <option value="semicolon">Semicolon (;)</option>
                    <option value="tab">Tab</option>
                    <option value="pipe">Pipe (|)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Start Import Button */}
            {uploadedFiles.length > 0 && (
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-card p-6 text-background">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Ready to Import</h3>
                    <p className="text-background/70 text-sm">
                      {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''} ready • {uploadedFiles.reduce((sum, f) => sum + parseFloat(f.size), 0).toFixed(2)} MB total
                    </p>
                  </div>
                  <button 
                    onClick={startImport}
                    disabled={importing}
                    className="px-6 py-3 bg-card text-blue-600 rounded-lg hover:bg-muted transition-colors flex items-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {importing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        Importing...
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        Start Import
                      </>
                    )}
                  </button>
                </div>
                {importing && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Processing...</span>
                      <span>{importProgress}%</span>
                    </div>
                    <div className="w-full bg-blue-300 rounded-full h-2">
                      <div 
                        className="bg-card h-2 rounded-full transition-all" 
                        style={{ width: `${importProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Import Statistics</h3>
              <div className="space-y-4">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Total Imports</span>
                    <Database className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-lg font-semibold tracking-tight text-foreground">1,247</div>
                </div>
                
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Success Rate</span>
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-lg font-semibold tracking-tight text-foreground">98.3%</div>
                </div>

                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Records Imported</span>
                    <FileText className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-lg font-semibold tracking-tight text-foreground">2.4M</div>
                </div>
              </div>
            </div>

            {/* Validation Rules */}
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Validation Rules</h3>
              <div className="space-y-2">
                {validationRules.map((rule) => (
                  <div key={rule.id} className="flex items-start gap-2 text-sm">
                    <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      rule.enabled ? 'bg-green-100' : 'bg-muted'
                    }`}>
                      {rule.enabled ? (
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                      ) : (
                        <X className="w-3 h-3 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{rule.rule}</div>
                      <div className="text-xs text-muted-foreground">{rule.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Import History */}
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Recent Imports</h3>
              <div className="space-y-3">
                {importHistory.map((item) => (
                  <div key={item.id} className="p-3 border border-border rounded-lg hover:shadow-card transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          {getFileIcon(item.name.split('.').pop().toUpperCase())}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">{item.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">{item.date}</div>
                        </div>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2 pt-2 border-t border-border">
                      <span>{item.records} records</span>
                      <span>{item.size}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-semibold text-amber-900">Import Tips</h3>
              </div>
              <ul className="space-y-2 text-sm text-amber-800">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Ensure CSV files have headers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Check data format before upload</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Use templates for best results</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Large files may take longer</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportData;