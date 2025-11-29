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

  const addEmailField = () => {
    setEmailList([...emailList, { id: Date.now(), email: '', role: 'User', status: 'pending' }]);
  };

  const removeEmailField = (id) => {
    if (emailList.length > 1) {
      setEmailList(emailList.filter(item => item.id !== id));
    }
  };

  const updateEmail = (id, email) => {
    setEmailList(emailList.map(item => 
      item.id === id ? { ...item, email } : item
    ));
  };

  const updateRole = (id, role) => {
    setEmailList(emailList.map(item => 
      item.id === id ? { ...item, role } : item
    ));
  };

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return <CheckCircle size={16} className="text-green-600" />;
      case 'pending': return <AlertCircle size={16} className="text-yellow-600" />;
      case 'expired': return <XCircle size={16} className="text-red-600" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Invite Users</h1>
          <p className="text-gray-600">Send email invitations to new users to join your platform</p>
        </div>

        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="text-green-600" size={24} />
            <div>
              <h3 className="font-semibold text-green-900">Invitations Sent Successfully!</h3>
              <p className="text-sm text-green-700">
                {successCount} invitation{successCount > 1 ? 's' : ''} sent. Users will receive an email shortly.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Sent</p>
                <p className="text-2xl font-bold text-gray-900">248</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Send className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Accepted</p>
                <p className="text-2xl font-bold text-green-600">186</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">47</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <AlertCircle className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Expired</p>
                <p className="text-2xl font-bold text-red-600">15</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <XCircle className="text-red-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Invitation Method</h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => setInviteMethod('single')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                      inviteMethod === 'single'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Mail size={20} />
                    <span className="font-medium">Single/Multiple</span>
                  </button>
                  
                  <button
                    onClick={() => setInviteMethod('bulk')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                      inviteMethod === 'bulk'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <UserPlus size={20} />
                    <span className="font-medium">Bulk Import</span>
                  </button>
                  
                  <button
                    onClick={() => setInviteMethod('csv')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                      inviteMethod === 'csv'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Upload size={20} />
                    <span className="font-medium">CSV Upload</span>
                  </button>
                </div>
              </div>

              <div className="p-6">
                {inviteMethod === 'single' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Email Addresses</h3>
                      <button
                        onClick={addEmailField}
                        className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus size={16} />
                        Add More
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <select
                          value={item.role}
                          onChange={(e) => updateRole(item.id, e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {roles.map(role => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                        {emailList.length > 1 && (
                          <button
                            onClick={() => removeEmailField(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Addresses (one per line or comma-separated)
                      </label>
                      <textarea
                        value={bulkEmails}
                        onChange={(e) => setBulkEmails(e.target.value)}
                        placeholder="user1@example.com&#10;user2@example.com&#10;user3@example.com"
                        rows={8}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        {bulkEmails.split(/[\n,]/).filter(e => e.trim()).length} email(s) detected
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Role for All Users
                      </label>
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {roles.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {inviteMethod === 'csv' && (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                      <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload CSV File</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Drag and drop your CSV file here, or click to browse
                      </p>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Choose File
                      </button>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">CSV Format Requirements:</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Column 1: Email address (required)</li>
                        <li>• Column 2: Role (optional, defaults to "User")</li>
                        <li>• Column 3: First Name (optional)</li>
                        <li>• Column 4: Last Name (optional)</li>
                      </ul>
                      <button className="flex items-center gap-2 mt-3 text-sm text-blue-700 hover:text-blue-900 font-medium">
                        <Download size={16} />
                        Download Sample CSV Template
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Invitation Message (Optional)
                  </label>
                  <textarea
                    value={inviteMessage}
                    onChange={(e) => setInviteMessage(e.target.value)}
                    placeholder="Add a personal message to your invitation..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSendInvites}
                    disabled={sendingInvites}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingInvites ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Send Invitations
                      </>
                    )}
                  </button>
                  
                  <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Invite Link</h3>
              <p className="text-sm text-gray-600 mb-4">
                Share this link directly with users. Anyone with this link can sign up.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value="yourapp.com/invite/abc123"
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                />
                <button
                  onClick={copyInviteLink}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  title="Copy Link"
                >
                  <Copy size={20} />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Link expires in 7 days
              </p>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Invitations</h3>
              <div className="space-y-3">
                {sentInvites.map(invite => (
                  <div key={invite.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                    <div className="mt-1">
                      {getStatusIcon(invite.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{invite.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{invite.sentAt}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(invite.status)}`}>
                          {invite.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All Invitations →
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">💡 Tips</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Invites expire after 7 days</li>
                <li>• Users can resend expired invites</li>
                <li>• Bulk invites support up to 100 emails</li>
                <li>• Custom messages increase acceptance rate</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}