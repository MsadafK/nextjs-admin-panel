// app/users/add/bulk/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Upload,
  Download,
  FileSpreadsheet,
  Check,
  AlertCircle,
  Users,
  Trash2,
} from 'lucide-react';
import { userService } from '@/services/userService';
import { useUsers } from '@/hooks/useUsers';
import UserPageHeader from '@/app/components/Users/UserPageHeader';
import UserKpiSummary from '@/app/components/Users/UserKpiSummary';

export default function BulkImportUsersPage() {
  const router = useRouter();
  const { users, loading, refreshUsers } = useUsers();
  const [parsedUsers, setParsedUsers] = useState([]);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleDownloadTemplate = () => {
    const csv = 'Name,Email,Department,Role,Status\n,,,,\n';
    const link = document.createElement('a');
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    link.setAttribute('download', 'bulk_users_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setMessage(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text !== 'string') return;
      const lines = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);

      if (lines.length < 2) {
        setError('CSV file must contain a header row and at least one user row.');
        return;
      }

      const rows = lines.slice(1).map((line) => {
        const [name, email, department, role, status] = line.split(',').map((s) => s?.trim());
        return {
          name: name || 'New User',
          email: email || '',
          department: department || 'General',
          role: (role || 'user').toLowerCase(),
          status: (status || 'active').toLowerCase(),
        };
      });

      setParsedUsers(rows.filter((r) => r.email.includes('@')));
    };
    reader.readAsText(file);
  };

  const handleBulkImportToSupabase = async () => {
    if (parsedUsers.length === 0) return;
    setImporting(true);
    setError(null);

    try {
      for (const user of parsedUsers) {
        await userService.createUser(user);
      }
      await refreshUsers();
      setMessage(`Successfully imported ${parsedUsers.length} users into Supabase!`);
      setParsedUsers([]);
    } catch (err) {
      setError(err.message || 'Failed to import users into Supabase.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="page-container max-w-6xl mx-auto space-y-6">
      <UserPageHeader title="Bulk Import Users" description="Import account records from CSV into the live public.users directory." loading={loading} onRefresh={refreshUsers} users={users}/>
      <UserKpiSummary users={users} loading={loading}/>

      {error && (
        <div className="card p-4 border border-foreground bg-muted text-foreground text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div className="card p-4 border border-foreground bg-foreground text-background text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Check size={16} />
            {message}
          </span>
          <button
            onClick={() => router.push('/users/all/list')}
            className="btn btn-outline bg-background text-foreground h-8 text-xs"
          >
            View User List →
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Instructions */}
        <div className="lg:col-span-2 card p-6 shadow-card border border-border space-y-5">
          <h2 className="text-base font-semibold text-foreground">How to Import Users</h2>
          <div className="space-y-4">
            {[
              {
                step: '1',
                title: 'Download Template',
                desc: 'Click the "Download Template" button to get the CSV format with sample data.',
              },
              {
                step: '2',
                title: 'Fill User Data',
                desc: 'Add Name, Email, Department, Role, and Status rows in the CSV file.',
              },
              {
                step: '3',
                title: 'Upload & Commit to Supabase',
                desc: 'Select your CSV file below, preview parsed rows, and click Import.',
              },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-foreground text-background text-xs font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-lg bg-muted border border-border text-xs space-y-1">
            <p className="text-foreground">
              <strong>Required Columns:</strong> Name, Email, Department, Role, Status
            </p>
            <p className="text-muted-foreground">
              <strong>Supported Format:</strong> Standard UTF-8 `.csv` (Max 10MB)
            </p>
          </div>
        </div>

        {/* Template Card */}
        <div className="card p-6 shadow-card border border-border flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-foreground text-background flex items-center justify-center">
            <Download size={24} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">CSV Template</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Download the sample CSV template with correct columns and example rows
            </p>
          </div>
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="btn btn-primary bg-foreground text-background hover:bg-foreground/90 w-full"
          >
            <Download size={16} className="mr-2" />
            Download Template
          </button>
          <span className="text-[11px] text-muted-foreground">
            CSV column header template
          </span>
        </div>
      </div>

      {/* Upload Box */}
      <div className="card p-8 shadow-card border border-dashed border-border text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-muted border border-border mx-auto flex items-center justify-center">
          <Upload size={22} className="text-foreground" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Upload CSV File</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Select a `.csv` file from your computer to preview and import users
          </p>
        </div>
        <div>
          <label className="btn btn-outline cursor-pointer">
            <FileSpreadsheet size={16} className="mr-2" />
            Choose CSV File
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Preview Parsed Rows */}
      {parsedUsers.length > 0 && (
        <div className="card p-0 overflow-hidden shadow-card border border-border">
          <div className="p-4 bg-muted border-b border-border flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Users size={16} />
              Ready to Import ({parsedUsers.length} Users)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setParsedUsers([])}
                className="btn btn-outline h-8 text-xs"
              >
                <Trash2 size={13} className="mr-1" /> Clear
              </button>
              <button
                disabled={importing}
                onClick={handleBulkImportToSupabase}
                className="btn btn-primary bg-foreground text-background hover:bg-foreground/90 h-8 text-xs"
              >
                <Check size={14} className="mr-1.5" />
                {importing ? 'Importing to Supabase...' : 'Confirm Bulk Import'}
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
                  <th className="text-left py-2.5 px-4">Name</th>
                  <th className="text-left py-2.5 px-4">Email</th>
                  <th className="text-left py-2.5 px-4">Department</th>
                  <th className="text-left py-2.5 px-4">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {parsedUsers.map((u, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 px-4 font-medium text-foreground">{u.name}</td>
                    <td className="py-2.5 px-4 text-muted-foreground">{u.email}</td>
                    <td className="py-2.5 px-4 text-foreground">{u.department}</td>
                    <td className="py-2.5 px-4 font-mono text-xs uppercase text-foreground">
                      {u.role}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
