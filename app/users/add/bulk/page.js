'use client';

import { useState, useRef } from 'react';
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle2, X, Users, FileText, Eye, Trash2, RefreshCw, Check, AlertTriangle, Info } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function BulkImportUsers() {
  const { isDark, getThemeColors } = useTheme();
  const { t } = useLanguage();
  const colors = getThemeColors();
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
      
      // Skip empty rows
      if (!row.firstName && !row.lastName && !row.email) return;
      
      // Required fields validation
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
        newErrors.push({
          row: index + 1,
          errors: rowErrors,
          data: row
        });
      } else {
        validData.push(row);
      }
    });
    
    return { validData, errors: newErrors };
  };

  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().replace('*', '').toLowerCase().replace(/ /g, ''));
    
    const data = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });
    
    return data;
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
    // Reset previous state
    setErrors([]);
    setParsedData([]);
    setImportStatus(null);
    setShowPreview(false);
    
    // Validate file type
    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      setErrors([{ row: 0, errors: ['Please upload a valid CSV or Excel file'], data: {} }]);
      return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrors([{ row: 0, errors: ['File size should be less than 10MB'], data: {} }]);
      return;
    }
    
    setUploadedFile(file);
    
    // Read and parse file
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const data = parseCSV(text);
        const { validData, errors: validationErrors } = validateCSVData(data);
        
        setParsedData(validData);
        setErrors(validationErrors);
        
        if (data.length > 0) {
          setShowPreview(true);
        }
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
    
    // Simulate import progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
    
    // Simulate API call
    setTimeout(() => {
      const total = parsedData.length;
      const failed = errors.length;
      const success = total - failed;
      
      setImportResults({ success, failed, total });
      
      if (failed === 0) {
        setImportStatus('success');
      } else if (success > 0) {
        setImportStatus('partial');
      } else {
        setImportStatus('error');
      }
      
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-4`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{label}</p>
          <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</p>
        </div>
        <div className={`p-3 ${color} bg-opacity-10 rounded-lg`}>
          <Icon size={24} className={color} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
          Bulk Import Users
        </h1>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Import multiple users at once using CSV or Excel files
        </p>
      </div>

      {/* Success/Error Messages */}
      {importStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-green-500 rounded-full flex-shrink-0">
              <CheckCircle2 size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-green-800 dark:text-green-300">Import Successful!</h4>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                All {importResults.success} users have been imported successfully.
              </p>
            </div>
            <button onClick={resetUpload} className="text-green-600 hover:text-green-800">
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {importStatus === 'partial' && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-yellow-500 rounded-full flex-shrink-0">
              <AlertTriangle size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-300">Partial Import</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                {importResults.success} users imported successfully, {importResults.failed} failed. Check errors below.
              </p>
            </div>
            <button onClick={resetUpload} className="text-yellow-600 hover:text-yellow-800">
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Instructions Card */}
        <div className={`lg:col-span-2 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6`}>
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-2 ${colors.primaryBg} rounded-lg`}>
              <Info size={20} className={colors.primaryText} />
            </div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              How to Import Users
            </h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className={`mt-0.5 w-6 h-6 rounded-full ${colors.primary} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>1</div>
              <div>
                <p className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Download Template</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Click the "Download Template" button to get the CSV format with sample data
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className={`mt-0.5 w-6 h-6 rounded-full ${colors.primary} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>2</div>
              <div>
                <p className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Fill User Data</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Add user information in the template. Fields marked with * are required
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className={`mt-0.5 w-6 h-6 rounded-full ${colors.primary} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>3</div>
              <div>
                <p className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Upload & Import</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Upload your file and review the data before importing
                </p>
              </div>
            </div>
          </div>

          <div className={`mt-6 p-4 rounded-lg ${isDark ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'}`}>
            <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
              <strong>Required Fields:</strong> First Name, Last Name, Email, Phone, Department, Position, Role
            </p>
            <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-800'} mt-1`}>
              <strong>Supported Formats:</strong> CSV, XLS, XLSX (Max 10MB)
            </p>
          </div>
        </div>

        {/* Template Download Card */}
        <div className={`${isDark ? 'bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-blue-700' : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'} rounded-xl border p-6`}>
          <div className="text-center">
            <div className={`inline-flex p-4 ${colors.primary} rounded-full mb-4`}>
              <Download size={32} className="text-white" />
            </div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
              CSV Template
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              Download the sample template with correct format and example data
            </p>
            <button
              onClick={downloadTemplate}
              className={`w-full ${colors.primary} text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center space-x-2`}
            >
              <Download size={18} />
              <span>Download Template</span>
            </button>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-3`}>
              Includes sample data for reference
            </p>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      {!uploadedFile ? (
        <div
          className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
            dragActive
              ? `${colors.primary.replace('bg-', 'border-')} bg-opacity-5`
              : `${isDark ? 'border-gray-700 hover:border-gray-600' : 'border-gray-300 hover:border-gray-400'}`
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileInput}
            accept=".csv,.xlsx,.xls"
            className="hidden"
            id="file-upload"
          />
          
          <div className="space-y-4">
            <div className={`inline-flex p-6 ${isDark ? 'bg-gray-800' : 'bg-gray-100'} rounded-full`}>
              <Upload size={48} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
            </div>
            
            <div>
              <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                {dragActive ? 'Drop your file here' : 'Upload User Data File'}
              </h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                Drag and drop your CSV or Excel file here, or click to browse
              </p>
            </div>
            
            <label
              htmlFor="file-upload"
              className={`inline-flex items-center px-6 py-3 ${colors.primary} text-white rounded-lg font-medium hover:opacity-90 transition-opacity cursor-pointer`}
            >
              <FileSpreadsheet size={18} className="mr-2" />
              Choose File
            </label>
            
            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Supported formats: CSV, XLS, XLSX (Max 10MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* File Info */}
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 ${colors.primaryBg} rounded-lg`}>
                  <FileText size={24} className={colors.primaryText} />
                </div>
                <div>
                  <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {uploadedFile.name}
                  </h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {(uploadedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={resetUpload}
                className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
              >
                <Trash2 size={20} />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <StatCard
                icon={Users}
                label="Total Records"
                value={parsedData.length + errors.length}
                color="text-blue-500"
              />
              <StatCard
                icon={CheckCircle2}
                label="Valid Records"
                value={parsedData.length}
                color="text-green-500"
              />
              <StatCard
                icon={AlertCircle}
                label="Errors"
                value={errors.length}
                color="text-red-500"
              />
            </div>

            {/* Import Button */}
            {!isProcessing && !importStatus && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleImport}
                  disabled={parsedData.length === 0}
                  className={`flex-1 ${colors.primary} text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
                >
                  <Upload size={18} />
                  <span>Import {parsedData.length} Users</span>
                </button>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className={`px-6 py-3 rounded-lg border ${isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} transition-colors flex items-center space-x-2`}
                >
                  <Eye size={18} />
                  <span>{showPreview ? 'Hide' : 'Preview'}</span>
                </button>
              </div>
            )}

            {/* Progress Bar */}
            {isProcessing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    Importing users...
                  </span>
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    {uploadProgress}%
                  </span>
                </div>
                <div className={`h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                  <div
                    className={`h-full ${colors.primary} transition-all duration-300 rounded-full`}
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Errors Display */}
          {errors.length > 0 && (
            <div className={`${isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'} rounded-xl border p-6`}>
              <div className="flex items-center space-x-3 mb-4">
                <AlertCircle size={20} className="text-red-500" />
                <h3 className={`font-semibold ${isDark ? 'text-red-300' : 'text-red-800'}`}>
                  {errors.length} Validation Error{errors.length > 1 ? 's' : ''} Found
                </h3>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {errors.slice(0, 10).map((error, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${isDark ? 'bg-red-900/30' : 'bg-red-100'}`}
                  >
                    <p className={`text-sm font-medium ${isDark ? 'text-red-300' : 'text-red-800'} mb-1`}>
                      Row {error.row}: {error.errors.join(', ')}
                    </p>
                    {error.data.email && (
                      <p className={`text-xs ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                        Email: {error.data.email}
                      </p>
                    )}
                  </div>
                ))}
                {errors.length > 10 && (
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} text-center py-2`}>
                    ... and {errors.length - 10} more errors
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Data Preview */}
          {showPreview && parsedData.length > 0 && (
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6`}>
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                Data Preview ({parsedData.length} records)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                      <th className={`text-left py-3 px-4 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Name</th>
                      <th className={`text-left py-3 px-4 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email</th>
                      <th className={`text-left py-3 px-4 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Phone</th>
                      <th className={`text-left py-3 px-4 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Department</th>
                      <th className={`text-left py-3 px-4 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Position</th>
                      <th className={`text-left py-3 px-4 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedData.slice(0, 5).map((row, index) => (
                      <tr key={index} className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                        <td className={`py-3 px-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {row.firstname} {row.lastname}
                        </td>
                        <td className={`py-3 px-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{row.email}</td>
                        <td className={`py-3 px-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{row.phone}</td>
                        <td className={`py-3 px-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{row.department}</td>
                        <td className={`py-3 px-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{row.position}</td>
                        <td className={`py-3 px-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          <span className={`px-2 py-1 rounded text-xs ${
                            row.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                            row.role === 'manager' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {row.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parsedData.length > 5 && (
                  <p className={`text-center py-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    ... and {parsedData.length - 5} more records
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}