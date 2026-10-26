'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Mail, MailOpen, Star, Archive, Trash2, Reply, Forward,
  MoreVertical, Search, CheckSquare, Square, Paperclip,
  X, Send, Smile, ImageIcon, FileText, RefreshCw, Plus
} from 'lucide-react';
import { messageService } from '@/services/messageService';

export default function UnreadMessages() {
  const [messages, setMessages]                 = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [error, setError]                       = useState(null);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [filterPriority, setFilterPriority]     = useState('all');
  const [searchTerm, setSearchTerm]             = useState('');
  const [selectedMessage, setSelectedMessage]   = useState(null);
  const [showReplyBox, setShowReplyBox]         = useState(false);
  const [replyText, setReplyText]               = useState('');

  // Compose Modal State
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [composeData, setComposeData]           = useState({
    title: '',
    message: '',
    priority: 'normal',
  });
  const [sending, setSending]                   = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await messageService.getMessages();
      setMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err.message || 'Failed to load messages from Supabase');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const toggleSelectMessage = (id) => {
    setSelectedMessages((prev) =>
      prev.includes(id) ? prev.filter((msgId) => msgId !== id) : [...prev, id]
    );
  };

  const filteredMessages = messages.filter((msg) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      msg.sender.toLowerCase().includes(q) ||
      msg.subject.toLowerCase().includes(q) ||
      msg.preview.toLowerCase().includes(q);
    const matchesPriority = filterPriority === 'all' || msg.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const toggleSelectAll = () => {
    if (selectedMessages.length === filteredMessages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(filteredMessages.map((msg) => msg.id));
    }
  };

  const toggleStar = (id) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, starred: !msg.starred } : msg))
    );
    if (selectedMessage?.id === id) {
      setSelectedMessage((prev) => ({ ...prev, starred: !prev.starred }));
    }
  };

  const markAsRead = async (id) => {
    try {
      await messageService.markAsRead(id);
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, unread: false } : msg))
      );
      if (selectedMessage?.id === id) {
        setSelectedMessage((prev) => ({ ...prev, unread: false }));
      }
    } catch (err) {
      alert('Failed to mark as read: ' + err.message);
    }
  };

  const deleteMessages = async () => {
    if (selectedMessages.length === 0) return;
    try {
      await messageService.deleteMessages(selectedMessages);
      setMessages((prev) => prev.filter((msg) => !selectedMessages.includes(msg.id)));
      if (selectedMessage && selectedMessages.includes(selectedMessage.id)) {
        setSelectedMessage(null);
      }
      setSelectedMessages([]);
    } catch (err) {
      alert('Failed to delete messages: ' + err.message);
    }
  };

  const archiveMessages = async () => {
    for (const id of selectedMessages) {
      await messageService.markAsRead(id);
    }
    setMessages((prev) =>
      prev.map((m) => (selectedMessages.includes(m.id) ? { ...m, unread: false } : m))
    );
    setSelectedMessages([]);
  };

  const handleReply = async () => {
    if (!replyText.trim() || !selectedMessage) return;
    try {
      setSending(true);
      await messageService.createMessage({
        title: `Re: ${selectedMessage.subject}`,
        message: replyText.trim(),
        priority: selectedMessage.priority,
      });
      setReplyText('');
      setShowReplyBox(false);
      await fetchMessages();
    } catch (err) {
      alert('Error sending reply: ' + err.message);
    } finally {
      setSending(false);
    }
  };

  const handleComposeSubmit = async (e) => {
    e.preventDefault();
    if (!composeData.title.trim() || !composeData.message.trim()) return;
    try {
      setSending(true);
      await messageService.createMessage(composeData);
      setComposeData({ title: '', message: '', priority: 'normal' });
      setShowComposeModal(false);
      await fetchMessages();
    } catch (err) {
      alert('Error broadcasting message: ' + err.message);
    } finally {
      setSending(false);
    }
  };

  const unreadCount = messages.filter((m) => m.unread).length;

  return (
    <div className="page-container space-y-6">
      <div className="max-w-7xl mx-auto space-y-5">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground mb-1">
                Messages & Notifications
              </h1>
              <p className="text-sm text-muted-foreground">
                Connected to Supabase (`public.notifications`) • {unreadCount} unread
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={fetchMessages}
                className="p-2.5 border border-border rounded-lg hover:bg-muted transition-colors"
                title="Refresh Messages"
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              </button>
              <button
                onClick={() => setShowComposeModal(true)}
                className="px-4 py-2 bg-foreground text-background rounded-lg hover:opacity-90 transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                Compose
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="card p-4 border-destructive/40 bg-destructive/10 text-destructive text-sm">
            <strong>Database Error:</strong> {error}
          </div>
        )}

        <div className="bg-card border border-border rounded-lg shadow-card p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSelectAll}
                className="p-2 hover:bg-muted rounded transition-colors"
              >
                {selectedMessages.length === filteredMessages.length && filteredMessages.length > 0 ? (
                  <CheckSquare size={20} className="text-blue-600" />
                ) : (
                  <Square size={20} className="text-muted-foreground" />
                )}
              </button>

              <div className="h-6 w-px bg-muted" />

              {selectedMessages.length > 0 ? (
                <>
                  <button
                    onClick={archiveMessages}
                    className="p-2 hover:bg-muted rounded transition-colors"
                    title="Mark Selected as Read"
                  >
                    <MailOpen size={20} className="text-muted-foreground" />
                  </button>
                  <button
                    onClick={deleteMessages}
                    className="p-2 hover:bg-muted rounded transition-colors"
                    title="Delete from Supabase"
                  >
                    <Trash2 size={20} className="text-red-600" />
                  </button>
                  <span className="text-sm text-muted-foreground">
                    {selectedMessages.length} selected
                  </span>
                </>
              ) : (
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="all">All Priority</option>
                  <option value="high">High Priority</option>
                  <option value="normal">Normal</option>
                  <option value="low">Low Priority</option>
                </select>
              )}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`${selectedMessage ? 'lg:col-span-1' : 'lg:col-span-3'} space-y-2`}>
            {loading ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center text-muted-foreground">
                <RefreshCw size={24} className="animate-spin mx-auto mb-2" />
                Loading notifications from Supabase...
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="bg-card border border-border rounded-lg shadow-card p-12 text-center">
                <MailOpen size={64} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No messages found</h3>
                <p className="text-muted-foreground mb-4">
                  Click &quot;Compose&quot; above to broadcast a new message to the database.
                </p>
              </div>
            ) : (
              filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className={`bg-card rounded-lg shadow border-2 transition-all cursor-pointer hover:shadow-card ${
                    selectedMessage?.id === message.id
                      ? 'border-blue-500'
                      : 'border-border'
                  }`}
                  onClick={() => setSelectedMessage(message)}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelectMessage(message.id);
                        }}
                        className="mt-1"
                      >
                        {selectedMessages.includes(message.id) ? (
                          <CheckSquare size={20} className="text-blue-600" />
                        ) : (
                          <Square size={20} className="text-muted-foreground" />
                        )}
                      </button>

                      <div className="flex-shrink-0 w-10 h-10 bg-foreground rounded-full flex items-center justify-center">
                        <span className="text-background font-semibold text-sm">{message.avatar}</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <h3 className="font-semibold text-foreground truncate">{message.sender}</h3>
                              {message.priority === 'high' && (
                                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                                  High Priority
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{message.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground whitespace-nowrap">{message.time}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleStar(message.id);
                              }}
                              className="p-1 hover:bg-muted rounded transition-colors"
                            >
                              <Star
                                size={16}
                                className={message.starred ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}
                              />
                            </button>
                          </div>
                        </div>

                        <h4 className="font-medium text-foreground mb-1 truncate">{message.subject}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">{message.preview}</p>

                        <div className="flex items-center gap-3 mt-2">
                          {message.unread ? (
                            <span className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                              <Mail size={13} />
                              Unread
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MailOpen size={13} />
                              Read
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {selectedMessage && (
            <div className="lg:col-span-2 bg-card border border-border rounded-lg shadow-card">
              <div className="p-6 border-b border-border">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-foreground rounded-full flex items-center justify-center">
                      <span className="text-background font-semibold">{selectedMessage.avatar}</span>
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-foreground mb-1">
                        {selectedMessage.subject}
                      </h2>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-medium">{selectedMessage.sender}</span>
                        <span>•</span>
                        <span>{selectedMessage.email}</span>
                        <span>•</span>
                        <span>{selectedMessage.time}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="p-2 hover:bg-muted rounded transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowReplyBox(!showReplyBox)}
                    className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg hover:opacity-90 transition-colors"
                  >
                    <Reply size={18} />
                    Reply
                  </button>
                  <button
                    onClick={() => markAsRead(selectedMessage.id)}
                    className="px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm flex items-center gap-1.5"
                  >
                    <MailOpen size={16} />
                    Mark as Read
                  </button>
                </div>
              </div>

              <div className="p-6">
                <p className="text-foreground leading-relaxed whitespace-pre-line">
                  {selectedMessage.preview}
                </p>

                {showReplyBox && (
                  <div className="mt-6 border-t border-border pt-6">
                    <h3 className="font-semibold text-foreground mb-3">
                      Reply to {selectedMessage.sender}
                    </h3>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply..."
                      rows={4}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                    />
                    <div className="flex justify-end gap-2 mt-3">
                      <button
                        onClick={() => setShowReplyBox(false)}
                        className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleReply}
                        disabled={sending}
                        className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg hover:opacity-90 transition-colors"
                      >
                        <Send size={16} />
                        {sending ? 'Sending...' : 'Send Reply'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compose Broadcast Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-lg font-semibold text-foreground">Broadcast New Message</h2>
              <button onClick={() => setShowComposeModal(false)} className="p-1 hover:bg-muted rounded">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleComposeSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Subject / Title *</label>
                <input
                  type="text"
                  required
                  value={composeData.title}
                  onChange={(e) => setComposeData({ ...composeData, title: e.target.value })}
                  placeholder="e.g. Server Maintenance Tonight"
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Priority</label>
                <select
                  value={composeData.priority}
                  onChange={(e) => setComposeData({ ...composeData, priority: e.target.value })}
                  className="input w-full"
                >
                  <option value="normal">Normal</option>
                  <option value="high">High Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Message Body *</label>
                <textarea
                  rows={4}
                  required
                  value={composeData.message}
                  onChange={(e) => setComposeData({ ...composeData, message: e.target.value })}
                  placeholder="Write your announcement or message..."
                  className="input w-full py-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowComposeModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" disabled={sending} className="btn btn-primary">
                  <Send size={15} className="mr-2" />
                  {sending ? 'Sending...' : 'Send Broadcast'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}