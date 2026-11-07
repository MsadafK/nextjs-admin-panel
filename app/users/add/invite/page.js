// app/users/add/invite/page.js
'use client';

import { useState } from 'react';
import {
  Send,
  Copy,
  Check,
  Plus,
  Mail,
} from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import { userService } from '@/services/userService';
import UserPageHeader from '@/app/components/Users/UserPageHeader';
import UserKpiSummary from '@/app/components/Users/UserKpiSummary';

export default function InviteUsersPage() {
  const { users, loading, refreshUsers } = useUsers();

  const [emails, setEmails] = useState([{ email: '', role: 'user', department: 'General' }]);
  const [customMessage, setCustomMessage] = useState(
    'You have been invited to join the AdminPro workspace. Click the link below to activate your account.'
  );
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleAddRow = () => {
    setEmails((prev) => [...prev, { email: '', role: 'user', department: 'General' }]);
  };

  const handleEmailChange = (idx, field, value) => {
    setEmails((prev) => prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row)));
  };

  const handleSendInvitations = async (e) => {
    e.preventDefault();
    const validRows = emails.filter((r) => r.email.trim().includes('@'));
    if (validRows.length === 0) return;

    try {
      setSubmitting(true);
      setFeedback(null);
      for (const row of validRows) {
        const namePart = row.email.split('@')[0].replace(/[._-]/g, ' ');
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        await userService.createUser({
          name: formattedName,
          email: row.email.trim(),
          role: row.role,
          department: row.department,
          status: 'active',
        });
      }
      await refreshUsers();
      setEmails([{ email: '', role: 'user', department: 'General' }]);
      setFeedback(`Invited and provisioned ${validRows.length} user(s) in Supabase!`);
    } catch (err) {
      setFeedback('Error sending invite: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://adminpro.app/invite/workspace-access');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="page-container max-w-7xl mx-auto space-y-6">
      <UserPageHeader title="Invite Users" description="Provision new team accounts directly in the live public.users directory." loading={loading} onRefresh={refreshUsers} users={users}/>

      {feedback && (
        <div className="card p-4 border border-foreground bg-foreground text-background text-sm flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-xs underline">
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <UserKpiSummary users={users} loading={loading}/>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invite Form */}
        <form
          onSubmit={handleSendInvitations}
          className="lg:col-span-2 card p-6 shadow-card border border-border space-y-5"
        >
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-base font-semibold text-foreground">Email Addresses</h2>
            <button
              type="button"
              onClick={handleAddRow}
              className="btn btn-outline h-8 px-3 text-xs"
            >
              <Plus size={14} className="mr-1" /> Add More
            </button>
          </div>

          <div className="space-y-3">
            {emails.map((row, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                <div className="sm:col-span-2 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={row.email}
                    onChange={(e) => handleEmailChange(idx, 'email', e.target.value)}
                    placeholder="user@example.com"
                    className="input pl-9 w-full"
                  />
                </div>
                <select
                  value={row.department}
                  onChange={(e) => handleEmailChange(idx, 'department', e.target.value)}
                  className="input w-full"
                >
                  <option value="General">General</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Management">Management</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Support">Support</option>
                </select>
                <select
                  value={row.role}
                  onChange={(e) => handleEmailChange(idx, 'role', e.target.value)}
                  className="input w-full"
                >
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <label className="label block">Custom Invitation Message (Optional)</label>
            <textarea
              rows={3}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="input w-full py-2"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary bg-foreground text-background hover:bg-foreground/90 flex-1"
            >
              <Send size={15} className="mr-2" />
              {submitting ? 'Provisioning in Supabase...' : 'Send Invitations'}
            </button>
          </div>
        </form>

        {/* Right Column: Quick Link & Live Recent Users */}
        <div className="space-y-6">
          <div className="card p-5 shadow-card border border-border space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Quick Invite Link</h3>
            <p className="text-xs text-muted-foreground">
              Share this direct invite URL with team members.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value="adminpro.app/invite/workspace"
                className="input text-xs font-mono flex-1 bg-muted"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="btn btn-primary bg-foreground text-background h-9 px-3"
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
              </button>
            </div>
          </div>

          <div className="card p-5 shadow-card border border-border space-y-3">
            <h3 className="text-sm font-semibold text-foreground">
              Recent Provisioned Users ({users.length})
            </h3>
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {users.slice(0, 6).map((u) => {
                const isActive = (u.status || 'active').toLowerCase() === 'active';
                return (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-2.5 rounded-md bg-muted border border-border text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">{u.email}</p>
                      <p className="text-muted-foreground">
                        {u.name} • {u.role}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[11px] border ${
                        isActive
                          ? 'bg-foreground text-background border-foreground'
                          : 'bg-background text-muted-foreground border-border'
                      }`}
                    >
                      {isActive ? 'Accepted' : u.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
