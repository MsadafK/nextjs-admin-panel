'use client';

import { useState, useRef } from 'react';
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle2, X, Users, FileText, Eye, Trash2, RefreshCw, Check, AlertTriangle, Info } from 'lucide-react';

export default function BulkImportUsers() {
  const fileInputRef = useRef(null);
  
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [importStatus, setImportStatus] = useState(null); // 'success', 'partial', 'error'
  const [importResults, setImportResults] = useState({ success: 0, failed: 0, total: 0 });

  // Sample CSV template structure
  const csvTemplate = [
    ['First Name*', 'Last Name*', 'Email*', 'Phone*', 'Department*', 'Position*', 'Role*', 'Employee ID'],
    ['John', 'Doe', 'john.doe@company.com', '+1-555-0001', 'Engineering', 'Software Engineer', 'user', 'EMP-001'],
    ['Jane', 'Smith', 'jane.smith@company.com', '+1-555-0002', 'Marketing', 'Marketing Manager', 'manager', 'EMP-002'],
    ['Bob', 'Johnson', 'bob.j@company.com', '+1-555-0003', 'Sales', 'Sales Rep', 'user', 'EMP-003']
  ];

  const downloadTemplate = () => {
    const csvContent = csvTemplate.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'user_import_template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateCSVData = (data) => {
    const newErrors = [];
    const validData = [];
    
    data.forEach((row, index) => {
      const rowErrors = [];
      if (!row.firstName && !row.lastName && !row.email) return;
      
      if (!row.firstName) rowErrors.push('First Name is required');
      if (!row.lastName) rowErrors.push('Last Name is required');
      if (!row.email) {
        rowErrors.push('Email is required');
      } else if (!/\S+@\S+\.\S+/.test(row.email)) {
        rowErrors.push('Invalid email format');
      }
      if (!row.phone) rowErrors.push('Phone is required');
      if (!row.department) rowErrors.push('Department is required');
      if (!row.position) rowErrors.push('Position is required');
      if (!row.role) rowErrors.push('Role is required');
      
      if (rowErrors.length > 0) {
        newErrors.push({ row: index + 1, errors: rowErrors, data: row });
      } else {
        validData.push(row);
      }
    });
    
    return { validData, errors: newErrors };
  };

  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().replace('*', '').toLowerCase().replace(/ /g, ''));
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const row = {};
      headers.forEach((header, index) => { row[header] = values[index] || ''; });
      return row;
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    setErrors([]);
    setParsedData([]);
    setImportStatus(null);
    setShowPreview(false);
    
    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      setErrors([{ row: 0, errors: ['Please upload a valid CSV or Excel file'], data: {} }]);
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setErrors([{ row: 0, errors: ['File size should be less than 10MB'], data: {} }]);
      return;
    }
    
    setUploadedFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const data = parseCSV(text);
        const { validData, errors: validationErrors } = validateCSVData(data);
        
        setParsedData(validData);
        setErrors(validationErrors);
        if (data.length > 0) setShowPreview(true);
      } catch (error) {
        setErrors([{ row: 0, errors: ['Failed to parse file. Please check the format.'], data: {} }]);
      }
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (parsedData.length === 0) return;
    
    setIsProcessing(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
    
    setTimeout(() => {
      const total = parsedData.length;
      const failed = errors.length;
      const success = total - failed;
      
      setImportResults({ success, failed, total });
      
      if (failed === 0) setImportStatus('success');
      else if (success > 0) setImportStatus('partial');
      else setImportStatus('error');
      
      setIsProcessing(false);
    }, 2500);
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setParsedData([]);
    setErrors([]);
    setImportStatus(null);
    setShowPreview(false);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const StatCard = ({ icon: Icon, label, value, iconClass }) => (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-lg font-semibold tracking-tight mt-1 text-foreground">{value}</p>
        </div>
        <div className="p-3 bg-muted rounded-lg">
          <Icon size={24} className={iconClass} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-container max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight text-foreground mb-1">
          Bulk Import Users
        </h1>
        <p className="text-sm text-muted-foreground">
          Import multiple users at once using CSV or Excel files
        </p>
      </div>

      {/* Success/Error Messages */}
      {importStatus === 'success' && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="p-1.5 bg-emerald-500 rounded-full flex-shrink-0 mt-0.5">
              <CheckCircle2 size={16} className="text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-emerald-700 dark:text-emerald-400">Import Successful!</h4>
              <p className="text-sm text-emerald-600 dark:text-emerald-500 mt-1">
                All {importResults.success} users have been imported successfully.
              </p>
            </div>
            <button onClick={resetUpload} className="text-emerald-600 hover:text-emerald-800 transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {importStatus === 'partial' && (
        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="p-1.5 bg-amber-500 rounded-full flex-shrink-0 mt-0.5">
              <AlertTriangle size={16} className="text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-amber-800 dark:text-amber-400">Partial Import</h4>
              <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
                {importResults.success} users imported successfully, {importResults.failed} failed. Check errors below.
              </p>
            </div>
            <button onClick={resetUpload} className="text-amber-600 hover:text-amber-800 transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Instructions Card */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center space-x-3 mb-5">
            <div className="p-2 bg-muted rounded-lg">
              <Info size={20} className="text-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">How to Import Users</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="mt-0.5 w-6 h-6 rounded-full bg-foreground flex items-center justify-center text-background text-xs font-bold flex-shrink-0">1</div>
              <div>
                <p className="font-medium text-foreground">Download Template</p>
                <p className="text-sm text-muted-foreground">Click the "Download Template" button to get the CSV format with sample data</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="mt-0.5 w-6 h-6 rounded-full bg-foreground flex items-center justify-center text-background text-xs font-bold flex-shrink-0">2</div>
              <div>
                <p className="font-medium text-foreground">Fill User Data</p>
                <p className="text-sm text-muted-foreground">Add user information in the template. Fields marked with * are required</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="mt-0.5 w-6 h-6 rounded-full bg-foreground flex items-center justify-center text-background text-xs font-bold flex-shrink-0">3</div>
              <div>
                <p className="font-medium text-foreground">Upload & Import</p>
                <p className="text-sm text-muted-foreground">Upload your file and review the data before importing</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-muted border border-border">
            <p className="text-sm text-foreground">
              <span className="font-semibold">Required Fields:</span> First Name, Last Name, Email, Phone, Department, Position, Role
            </p>
            <p className="text-sm text-foreground mt-1">
              <span className="font-semibold">Supported Formats:</span> CSV, XLS, XLSX (Max 10MB)
            </p>
          </div>
        </div>

        {/* Template Download Card */}
        <div className="card bg-muted/30 flex flex-col items-center justify-center text-center p-6">
          <div className="inline-flex p-4 bg-foreground rounded-full mb-4 shadow-sm">
            <Download size={28} className="text-background" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">CSV Template</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Download the sample template with correct format and example data
          </p>
          <button onClick={downloadTemplate} className="btn btn-primary w-full flex items-center justify-center space-x-2">
            <Download size={18} />
            <span>Download Template</span>
          </button>
          <p className="text-xs text-muted-foreground mt-3">Includes sample data for reference</p>
        </div>
      </div>

      {/* Upload Area */}
      {!uploadedFile ? (
        <div
          className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
            dragActive ? `border-foreground bg-muted` : `border-border hover:border-foreground/50`
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input ref={fileInputRef} type="file" onChange={handleFileInput} accept=".csv,.xlsx,.xls" className="hidden" id="file-upload" />
          
          <div className="space-y-4">
            <div className="inline-flex p-6 bg-muted rounded-full">
              <Upload size={40} className="text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {dragActive ? 'Drop your file here' : 'Upload User Data File'}
              </h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop your CSV or Excel file here, or click to browse
              </p>
            </div>
            
            <label htmlFor="file-upload" className="btn btn-primary px-8 py-2.5 cursor-pointer inline-flex">
              <FileSpreadsheet size={18} className="mr-2" /> Choose File
            </label>
            <p className="text-sm text-muted-foreground mt-2">Supported formats: CSV, XLS, XLSX (Max 10MB)</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* File Info */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-muted rounded-lg">
                  <FileText size={24} className="text-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{uploadedFile.name}</h4>
                  <p className="text-sm text-muted-foreground">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              <button onClick={resetUpload} className="btn btn-ghost p-2 text-destructive hover:bg-destructive/10">
                <Trash2 size={20} />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <StatCard icon={Users} label="Total Records" value={parsedData.length + errors.length} iconClass="text-blue-500" />
              <StatCard icon={CheckCircle2} label="Valid Records" value={parsedData.length} iconClass="text-emerald-500" />
              <StatCard icon={AlertCircle} label="Errors" value={errors.length} iconClass="text-destructive" />
            </div>

            {/* Import Button */}
            {!isProcessing && !importStatus && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleImport}
                  disabled={parsedData.length === 0}
                  className="btn btn-primary flex-1 py-3 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <Upload size={18} />
                  <span>Import {parsedData.length} Users</span>
                </button>
                <button onClick={() => setShowPreview(!showPreview)} className="btn btn-outline py-3 flex items-center space-x-2">
                  <Eye size={18} />
                  <span>{showPreview ? 'Hide Preview' : 'Preview Data'}</span>
                </button>
              </div>
            )}

            {/* Progress Bar */}
            {isProcessing && (
              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground font-medium">Importing users...</span>
                  <span className="text-muted-foreground">{uploadProgress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-foreground transition-all duration-300 rounded-full" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* Errors Display */}
          {errors.length > 0 && (
            <div className="card border-destructive/30 bg-destructive/5 space-y-4">
              <div className="flex items-center space-x-3">
                <AlertCircle size={20} className="text-destructive" />
                <h3 className="font-semibold text-destructive">
                  {errors.length} Validation Error{errors.length > 1 ? 's' : ''} Found
                </h3>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                {errors.slice(0, 10).map((error, index) => (
                  <div key={index} className="p-3 rounded-lg bg-background border border-destructive/20 shadow-sm">
                    <p className="text-sm font-medium text-destructive mb-1">
                      Row {error.row}: {error.errors.join(', ')}
                    </p>
                    {error.data.email && <p className="text-xs text-muted-foreground">Email: {error.data.email}</p>}
                  </div>
                ))}
                {errors.length > 10 && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    ... and {errors.length - 10} more errors
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Data Preview */}
          {showPreview && parsedData.length > 0 && (
            <div className="card p-0 overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Data Preview ({parsedData.length} records)</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground uppercase tracking-wide text-xs">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground uppercase tracking-wide text-xs">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground uppercase tracking-wide text-xs">Phone</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground uppercase tracking-wide text-xs">Department</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground uppercase tracking-wide text-xs">Position</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground uppercase tracking-wide text-xs">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {parsedData.slice(0, 5).map((row, index) => (
                      <tr key={index} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4 text-foreground font-medium">{row.firstname} {row.lastname}</td>
                        <td className="py-3 px-4 text-muted-foreground">{row.email}</td>
                        <td className="py-3 px-4 text-muted-foreground">{row.phone}</td>
                        <td className="py-3 px-4 text-muted-foreground">{row.department}</td>
                        <td className="py-3 px-4 text-muted-foreground">{row.position}</td>
                        <td className="py-3 px-4">
                          <span className={`badge ${row.role.toLowerCase() === 'admin' ? 'bg-foreground text-background' : 'bg-muted text-foreground'}`}>
                            {row.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parsedData.length > 5 && (
                  <div className="bg-muted/10 p-3 border-t border-border text-center">
                    <p className="text-sm text-muted-foreground">... and {parsedData.length - 5} more records</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}