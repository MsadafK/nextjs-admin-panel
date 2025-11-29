'use client';

import React, { useState } from 'react';
import { Calendar, Search, Filter, Download, Eye, RotateCcw, Trash2, CheckCircle2, XCircle, AlertTriangle, Clock, FileText, FileSpreadsheet, FileJson, Database, TrendingUp, Users, Package, DollarSign, ChevronDown, ChevronRight } from 'lucide-react';

const ImportHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [expandedRow, setExpandedRow] = useState(null);

  const importRecords = [
    {
      id: 1,
      fileName: 'sales_data_Q4_2024.csv',
      type: 'Sales',
      fileType: 'CSV',
      date: '2024-10-30',
      time: '10:45 AM',
      status: 'success',
      records: 12456,
      processed: 12456,
      failed: 0,
      duration: '2m 34s',
      size: '2.3 MB',
      user: 'John Doe',
      details: {
        duplicates: 145,
        validated: 12311,
        skipped: 0,
        errors: []
      }
    },
    {
      id: 2,
      fileName: 'customer_database_oct.xlsx',
      type: 'Customers',
      fileType: 'Excel',
      date: '2024-10-29',
      time: '3:20 PM',
      status: 'success',
      records: 8901,
      processed: 8901,
      failed: 0,
      duration: '1m 52s',
      size: '4.1 MB',
      user: 'Sarah Smith',
      details: {
        duplicates: 78,
        validated: 8823,
        skipped: 0,
        errors: []
      }
    },
    {
      id: 3,
      fileName: 'product_inventory_update.json',
      type: 'Inventory',
      fileType: 'JSON',
      date: '2024-10-29',
      time: '11:15 AM',
      status: 'partial',
      records: 3456,
      processed: 3289,
      failed: 167,
      duration: '45s',
      size: '856 KB',
      user: 'Mike Johnson',
      details: {
        duplicates: 23,
        validated: 3266,
        skipped: 23,
        errors: [
          'Invalid SKU format in rows 234, 567',
          'Missing required field "price" in 145 records'
        ]
      }
    },
    {
      id: 4,
      fileName: 'financial_transactions.csv',
      type: 'Financial',
      fileType: 'CSV',
      date: '2024-10-28',
      time: '9:30 AM',
      status: 'success',
      records: 5678,
      processed: 5678,
      failed: 0,
      duration: '1m 18s',
      size: '1.2 MB',
      user: 'Emily Davis',
      details: {
        duplicates: 34,
        validated: 5644,
        skipped: 0,
        errors: []
      }
    },
    {
      id: 5,
      fileName: 'employee_records_2024.xlsx',
      type: 'Employees',
      fileType: 'Excel',
      date: '2024-10-27',
      time: '2:45 PM',
      status: 'failed',
      records: 450,
      processed: 0,
      failed: 450,
      duration: '15s',
      size: '234 KB',
      user: 'John Doe',
      details: {
        duplicates: 0,
        validated: 0,
        skipped: 0,
        errors: [
          'Invalid file format',
          'Required columns missing: employee_id, department',
          'Date format not recognized'
        ]
      }
    },
    {
      id: 6,
      fileName: 'order_history_sept.csv',
      type: 'Orders',
      fileType: 'CSV',
      date: '2024-10-26',
      time: '4:10 PM',
      status: 'success',
      records: 9234,
      processed: 9234,
      failed: 0,
      duration: '3m 12s',
      size: '3.8 MB',
      user: 'Sarah Smith',
      details: {
        duplicates: 156,
        validated: 9078,
        skipped: 0,
        errors: []
      }
    },
    {
      id: 7,
      fileName: 'supplier_contacts.json',
      type: 'Suppliers',
      fileType: 'JSON',
      date: '2024-10-25',
      time: '11:00 AM',
      status: 'partial',
      records: 234,
      processed: 198,
      failed: 36,
      duration: '28s',
      size: '145 KB',
      user: 'Mike Johnson',
      details: {
        duplicates: 12,
        validated: 186,
        skipped: 12,
        errors: [
          'Invalid email format in 24 records',
          'Missing phone numbers in 12 records'
        ]
      }
    }
  ];

  const stats = {
    total: importRecords.length,
    success: importRecords.filter(r => r.status === 'success').length,
    partial: importRecords.filter(r => r.status === 'partial').length,
    failed: importRecords.filter(r => r.status === 'failed').length,
    totalRecords: importRecords.reduce((sum, r) => sum + r.records, 0),
    successRate: ((importRecords.filter(r => r.status === 'success').length / importRecords.length) * 100).toFixed(1)
  };

  const filteredRecords = importRecords.filter(record => {
    const matchesSearch = record.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const recordDate = new Date(record.date);
      const today = new Date();
      const daysDiff = Math.floor((today - recordDate) / (1000 * 60 * 60 * 24));
      
      if (dateFilter === 'today' && daysDiff !== 0) matchesDate = false;
      if (dateFilter === 'week' && daysDiff > 7) matchesDate = false;
      if (dateFilter === 'month' && daysDiff > 30) matchesDate = false;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status) => {
    const badges = {
      success: (
        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Success
        </span>
      ),
      partial: (
        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Partial
        </span>
      ),
      failed: (
        <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          Failed
        </span>
      )
    };
    return badges[status];
  };

  const getFileIcon = (type) => {
    const icons = {
      CSV: <FileText className="w-5 h-5 text-green-600" />,
      Excel: <FileSpreadsheet className="w-5 h-5 text-emerald-600" />,
      JSON: <FileJson className="w-5 h-5 text-blue-600" />
    };
    return icons[type] || <FileText className="w-5 h-5 text-slate-600" />;
  };

  const toggleExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Import History</h1>
            <p className="text-slate-600">Track and manage all your data import activities</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-slate-700">
              <Download className="w-4 h-4" />
              Export History
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Total Imports</span>
              <Database className="w-5 h-5 text-cyan-600" />
            </div>
            <div className="text-3xl font-bold text-slate-800">{stats.total}</div>
            <div className="text-xs text-slate-500 mt-1">{stats.totalRecords.toLocaleString()} records</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Successful</span>
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600">{stats.success}</div>
            <div className="text-xs text-slate-500 mt-1">{stats.successRate}% success rate</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Partial Success</span>
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold text-yellow-600">{stats.partial}</div>
            <div className="text-xs text-slate-500 mt-1">With some errors</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Failed</span>
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-3xl font-bold text-red-600">{stats.failed}</div>
            <div className="text-xs text-slate-500 mt-1">Need attention</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by file name or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>
            <div className="flex gap-2">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="partial">Partial</option>
                <option value="failed">Failed</option>
              </select>
              <select 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Import History Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">
              Import Records ({filteredRecords.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    File
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Records
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRecords.map((record) => (
                  <React.Fragment key={record.id}>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleExpand(record.id)}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            {expandedRow === record.id ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            {getFileIcon(record.fileType)}
                          </div>
                          <div>
                            <div className="font-medium text-slate-800">{record.fileName}</div>
                            <div className="text-xs text-slate-500">{record.type} • {record.size}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-800">{record.date}</div>
                        <div className="text-xs text-slate-500">{record.time}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-800">{record.records.toLocaleString()}</div>
                        {record.failed > 0 && (
                          <div className="text-xs text-red-600">{record.failed} failed</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(record.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {record.duration}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-700">{record.user}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="View Details">
                            <Eye className="w-4 h-4 text-slate-600" />
                          </button>
                          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Download">
                            <Download className="w-4 h-4 text-slate-600" />
                          </button>
                          {record.status === 'failed' && (
                            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Retry">
                              <RotateCcw className="w-4 h-4 text-cyan-600" />
                            </button>
                          )}
                          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expanded Details Row */}
                    {expandedRow === record.id && (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 bg-slate-50">
                          <div className="space-y-4">
                            {/* Summary Stats */}
                            <div className="grid grid-cols-4 gap-4">
                              <div className="p-3 bg-white rounded-lg border border-slate-200">
                                <div className="text-xs text-slate-600 mb-1">Total Records</div>
                                <div className="text-lg font-semibold text-slate-800">{record.records.toLocaleString()}</div>
                              </div>
                              <div className="p-3 bg-white rounded-lg border border-slate-200">
                                <div className="text-xs text-slate-600 mb-1">Processed</div>
                                <div className="text-lg font-semibold text-green-600">{record.processed.toLocaleString()}</div>
                              </div>
                              <div className="p-3 bg-white rounded-lg border border-slate-200">
                                <div className="text-xs text-slate-600 mb-1">Duplicates</div>
                                <div className="text-lg font-semibold text-yellow-600">{record.details.duplicates}</div>
                              </div>
                              <div className="p-3 bg-white rounded-lg border border-slate-200">
                                <div className="text-xs text-slate-600 mb-1">Validated</div>
                                <div className="text-lg font-semibold text-blue-600">{record.details.validated.toLocaleString()}</div>
                              </div>
                            </div>

                            {/* Errors Section */}
                            {record.details.errors.length > 0 && (
                              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <AlertTriangle className="w-4 h-4 text-red-600" />
                                  <span className="font-semibold text-red-800">Errors Encountered</span>
                                </div>
                                <ul className="space-y-1">
                                  {record.details.errors.map((error, idx) => (
                                    <li key={idx} className="text-sm text-red-700 flex items-start gap-2">
                                      <span className="text-red-500 mt-1">•</span>
                                      {error}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Success Message */}
                            {record.status === 'success' && (
                              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                                  <span className="font-semibold text-green-800">Import completed successfully</span>
                                </div>
                                <p className="text-sm text-green-700 mt-1">
                                  All records were processed and validated without errors.
                                </p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRecords.length === 0 && (
            <div className="p-12 text-center">
              <Database className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-600 mb-1">No records found</h3>
              <p className="text-sm text-slate-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportHistory;