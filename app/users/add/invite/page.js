'use client';

import React, { useState } from 'react';
import { Mail, UserPlus, Trash2, Copy, Send, CheckCircle, XCircle, Upload, Download, Plus, X, AlertCircle } from 'lucide-react';

export default function InviteUsers() {
  const [inviteMethod, setInviteMethod] = useState('single');
  const [emailList, setEmailList] = useState([{ id: 1, email: '', role: 'User', status: 'pending' }]);
  const [bulkEmails, setBulkEmails] = useState('');
  const [inviteMessage, setInviteMessage] = useState('You have been invited to join our platform. Click the link below to create your account and get started.');
  const [selectedRole, setSelectedRole] = useState('User');
  const [sendingInvites, setSendingInvites] = useState(false);
  const [successCount, setSuccessCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const roles = ['Admin', 'Manager', 'User', 'Viewer'];
  
  const [sentInvites] = useState([
    { id: 1, email: 'john@example.com', role: 'Manager', sentAt: '2 hours ago', status: 'accepted' },
    { id: 2, email: 'sarah@example.com', role: 'User', sentAt: '1 day ago', status: 'pending' },
    { id: 3, email: 'mike@example.com', role: 'User', sentAt: '3 days ago', status: 'expired' },
  ]);

  const addEmailField = () => { setEmailList([...emailList, { id: Date.now(), email: '', role: 'User', status: 'pending' }]); };
  const removeEmailField = (id) => { if (emailList.length > 1) setEmailList(emailList.filter(item => item.id !== id)); };
  const updateEmail = (id, email) => { setEmailList(emailList.map(item => item.id === id ? { ...item, email } : item)); };
  const updateRole = (id, role) => { setEmailList(emailList.map(item => item.id === id ? { ...item, role } : item)); };

  const handleSendInvites = () => {
    setSendingInvites(true);
    setTimeout(() => {
      if (inviteMethod === 'single') {
        setSuccessCount(emailList.filter(e => e.email).length);
      } else if (inviteMethod === 'bulk') {
        const emails = bulkEmails.split(/[\n,]/).filter(e => e.trim());
        setSuccessCount(emails.length);
      }
      setSendingInvites(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        setEmailList([{ id: 1, email: '', role: 'User', status: 'pending' }]);
        setBulkEmails('');
      }, 3000);
    }, 2000);
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText('https://yourapp.com/invite/abc123def456');
    alert('Invite link copied to clipboard!');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'pending': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'expired': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-foreground border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return <CheckCircle size={16} className="text-emerald-600" />;
      case 'pending': return <AlertCircle size={16} className="text-amber-600" />;
      case 'expired': return <XCircle size={16} className="text-destructive" />;
      default: return null;
    }
  };

  return (
    <div className="page-container max-w-7xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-foreground mb-1">Invite Users</h1>
        <p className="text-sm text-muted-foreground">Send email invitations to new users to join your platform</p>
      </div>

      {showSuccess && (
        <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 flex items-center gap-3">
          <div className="p-1.5 bg-emerald-500 rounded-full flex-shrink-0">
            <CheckCircle className="text-white" size={16} />
          </div>
          <div>
            <h3 className="font-semibold text-emerald-700 dark:text-emerald-400">Invitations Sent Successfully!</h3>
            <p className="text-sm text-emerald-600 dark:text-emerald-500">
              {successCount} invitation{successCount > 1 ? 's' : ''} sent. Users will receive an email shortly.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Sent</p>
              <p className="text-2xl font-semibold tracking-tight text-foreground">248</p>
            </div>
            <div className="bg-blue-500/10 p-3 rounded-lg"><Send className="text-blue-500" size={24} /></div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Accepted</p>
              <p className="text-2xl font-semibold tracking-tight text-emerald-600">186</p>
            </div>
            <div className="bg-emerald-500/10 p-3 rounded-lg"><CheckCircle className="text-emerald-500" size={24} /></div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pending</p>
              <p className="text-2xl font-semibold tracking-tight text-amber-600">47</p>
            </div>
            <div className="bg-amber-500/10 p-3 rounded-lg"><AlertCircle className="text-amber-500" size={24} /></div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Expired</p>
              <p className="text-2xl font-semibold tracking-tight text-destructive">15</p>
            </div>
            <div className="bg-destructive/10 p-3 rounded-lg"><XCircle className="text-destructive" size={24} /></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-0 overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Invitation Method</h2>
            <div className="flex gap-3">
              <button
                onClick={() => setInviteMethod('single')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  inviteMethod === 'single' ? 'border-foreground bg-foreground/5 text-foreground' : 'border-border text-muted-foreground hover:border-foreground/50'
                }`}
              >
                <Mail size={20} /> <span className="font-medium">Single/Multiple</span>
              </button>
              <button
                onClick={() => setInviteMethod('bulk')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  inviteMethod === 'bulk' ? 'border-foreground bg-foreground/5 text-foreground' : 'border-border text-muted-foreground hover:border-foreground/50'
                }`}
              >
                <UserPlus size={20} /> <span className="font-medium">Bulk Import</span>
              </button>
              <button
                onClick={() => setInviteMethod('csv')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  inviteMethod === 'csv' ? 'border-foreground bg-foreground/5 text-foreground' : 'border-border text-muted-foreground hover:border-foreground/50'
                }`}
              >
                <Upload size={20} /> <span className="font-medium">CSV Upload</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            {inviteMethod === 'single' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Email Addresses</h3>
                  <button onClick={addEmailField} className="btn btn-outline text-xs h-8 px-3">
                    <Plus size={14} className="mr-1" /> Add More
                  </button>
                </div>
                {emailList.map((item) => (
                  <div key={item.id} className="flex gap-3 items-start">
                    <div className="flex-1">
                      <input
                        type="email"
                        placeholder="user@example.com"
                        value={item.email}
                        onChange={(e) => updateEmail(item.id, e.target.value)}
                        className="input w-full"
                      />
                    </div>
                    <select value={item.role} onChange={(e) => updateRole(item.id, e.target.value)} className="input w-32">
                      {roles.map(role => <option key={role} value={role}>{role}</option>)}
                    </select>
                    {emailList.length > 1 && (
                      <button onClick={() => removeEmailField(item.id)} className="btn btn-ghost p-2 text-destructive hover:bg-destructive/10">
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {inviteMethod === 'bulk' && (
              <div className="space-y-4">
                <div>
                  <label className="label mb-2 block">Email Addresses (one per line or comma-separated)</label>
                  <textarea
                    value={bulkEmails}
                    onChange={(e) => setBulkEmails(e.target.value)}
                    placeholder="user1@example.com&#10;user2@example.com&#10;user3@example.com"
                    rows={8}
                    className="input w-full h-auto py-3 font-mono text-sm"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    {bulkEmails.split(/[\n,]/).filter(e => e.trim()).length} email(s) detected
                  </p>
                </div>
                <div>
                  <label className="label mb-2 block">Default Role for All Users</label>
                  <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="input w-full">
                    {roles.map(role => <option key={role} value={role}>{role}</option>)}
                  </select>
                </div>
              </div>
            )}

            {inviteMethod === 'csv' && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-foreground/50 transition-colors cursor-pointer bg-muted/20">
                  <Upload className="mx-auto mb-4 text-muted-foreground" size={48} />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Upload CSV File</h3>
                  <p className="text-sm text-muted-foreground mb-4">Drag and drop your CSV file here, or click to browse</p>
                  <button className="btn btn-primary">Choose File</button>
                </div>
                <div className="bg-muted border border-border rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">CSV Format Requirements:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Column 1: Email address (required)</li>
                    <li>• Column 2: Role (optional, defaults to "User")</li>
                    <li>• Column 3: First Name (optional)</li>
                    <li>• Column 4: Last Name (optional)</li>
                  </ul>
                  <button className="flex items-center gap-2 mt-3 text-sm text-foreground hover:underline font-medium">
                    <Download size={16} /> Download Sample CSV Template
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6">
              <label className="label mb-2 block">Custom Invitation Message (Optional)</label>
              <textarea
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                placeholder="Add a personal message to your invitation..."
                rows={4}
                className="input w-full h-auto py-3"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSendInvites}
                disabled={sendingInvites}
                className="btn btn-primary flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {sendingInvites ? (
                  <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div> Sending...</>
                ) : (
                  <><Send size={18} /> <span>Send Invitations</span></>
                )}
              </button>
              <button className="btn btn-outline py-3 px-8">Cancel</button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card space-y-4">
            <h3 className="font-semibold text-foreground">Quick Invite Link</h3>
            <p className="text-sm text-muted-foreground">Share this link directly with users. Anyone with this link can sign up.</p>
            <div className="flex gap-2">
              <input type="text" value="yourapp.com/invite/abc123" readOnly className="input flex-1 bg-muted font-mono text-xs" />
              <button onClick={copyInviteLink} className="btn btn-primary p-2" title="Copy Link"><Copy size={18} /></button>
            </div>
            <p className="text-xs text-muted-foreground">Link expires in 7 days</p>
          </div>

          <div className="card">
            <h3 className="font-semibold text-foreground mb-4">Recent Invitations</h3>
            <div className="space-y-3">
              {sentInvites.map(invite => (
                <div key={invite.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                  <div className="mt-1">{getStatusIcon(invite.status)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{invite.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{invite.sentAt}</span>
                      <span className={`badge capitalize ${getStatusBadge(invite.status)}`}>{invite.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-sm font-medium text-foreground hover:underline">
              View All Invitations →
            </button>
          </div>

          <div className="card bg-muted/50">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><Info size={16} /> Tips</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Invites expire after 7 days</li>
              <li>• Users can resend expired invites</li>
              <li>• Bulk invites support up to 100 emails</li>
              <li>• Custom messages increase acceptance rate</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}