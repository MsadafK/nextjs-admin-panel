'use client';

import React, { useState } from 'react';
import { Mail, MailOpen, Star, Archive, Trash2, Reply, Forward, MoreVertical, Search, Filter, CheckSquare, Square, Clock, Paperclip, Flag, User, AlertCircle, X, Send, Smile, Image, FileText } from 'lucide-react';

export default function UnreadMessages() {
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState('');

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Sarah Johnson',
      email: 'sarah.j@company.com',
      subject: 'Q4 Marketing Campaign Review',
      preview: 'Hi team, I wanted to discuss the upcoming Q4 marketing campaign strategy. We need to finalize...',
      time: '5 min ago',
      priority: 'high',
      hasAttachment: true,
      starred: false,
      avatar: 'SJ',
      unread: true
    },
    {
      id: 2,
      sender: 'Mike Chen',
      email: 'mike.chen@company.com',
      subject: 'Budget Approval Needed',
      preview: 'Please review and approve the budget proposal for the next quarter. The deadline is approaching...',
      time: '15 min ago',
      priority: 'high',
      hasAttachment: true,
      starred: true,
      avatar: 'MC',
      unread: true
    },
    {
      id: 3,
      sender: 'Emma Wilson',
      email: 'emma.w@company.com',
      subject: 'Team Meeting Notes',
      preview: 'Here are the notes from today\'s team meeting. Action items are highlighted below...',
      time: '1 hour ago',
      priority: 'normal',
      hasAttachment: false,
      starred: false,
      avatar: 'EW',
      unread: true
    },
    {
      id: 4,
      sender: 'David Park',
      email: 'david.p@company.com',
      subject: 'Project Timeline Update',
      preview: 'The development timeline has been updated based on our discussion. Please review the changes...',
      time: '2 hours ago',
      priority: 'normal',
      hasAttachment: true,
      starred: false,
      avatar: 'DP',
      unread: true
    },
    {
      id: 5,
      sender: 'Lisa Anderson',
      email: 'lisa.a@company.com',
      subject: 'Customer Feedback Summary',
      preview: 'I\'ve compiled the customer feedback from last month. Overall satisfaction is up by 12%...',
      time: '3 hours ago',
      priority: 'low',
      hasAttachment: false,
      starred: false,
      avatar: 'LA',
      unread: true
    },
  ]);

  const toggleSelectMessage = (id) => {
    setSelectedMessages(prev =>
      prev.includes(id) ? prev.filter(msgId => msgId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedMessages.length === filteredMessages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(filteredMessages.map(msg => msg.id));
    }
  };

  const toggleStar = (id) => {
    setMessages(messages.map(msg =>
      msg.id === id ? { ...msg, starred: !msg.starred } : msg
    ));
  };

  const markAsRead = (id) => {
    setMessages(messages.map(msg =>
      msg.id === id ? { ...msg, unread: false } : msg
    ));
  };

  const deleteMessages = () => {
    setMessages(messages.filter(msg => !selectedMessages.includes(msg.id)));
    setSelectedMessages([]);
  };

  const archiveMessages = () => {
    setMessages(messages.filter(msg => !selectedMessages.includes(msg.id)));
    setSelectedMessages([]);
  };

  const handleReply = () => {
    if (replyText.trim()) {
      console.log('Reply sent:', replyText);
      setReplyText('');
      setShowReplyBox(false);
    }
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         msg.preview.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || msg.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Unread Messages</h1>
              <p className="text-gray-600">You have {filteredMessages.length} unread messages</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Mail size={20} />
                Compose
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSelectAll}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title={selectedMessages.length === filteredMessages.length ? 'Deselect All' : 'Select All'}
              >
                {selectedMessages.length === filteredMessages.length && filteredMessages.length > 0 ? (
                  <CheckSquare size={20} className="text-blue-600" />
                ) : (
                  <Square size={20} className="text-gray-600" />
                )}
              </button>

              <div className="h-6 w-px bg-gray-300"></div>

              {selectedMessages.length > 0 ? (
                <>
                  <button
                    onClick={archiveMessages}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Archive"
                  >
                    <Archive size={20} className="text-gray-600" />
                  </button>
                  <button
                    onClick={deleteMessages}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={20} className="text-red-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded transition-colors" title="Mark as Read">
                    <MailOpen size={20} className="text-gray-600" />
                  </button>
                  <span className="text-sm text-gray-600">{selectedMessages.length} selected</span>
                </>
              ) : (
                <>
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Priority</option>
                    <option value="high">High Priority</option>
                    <option value="normal">Normal</option>
                    <option value="low">Low Priority</option>
                  </select>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`${selectedMessage ? 'lg:col-span-1' : 'lg:col-span-3'} space-y-2`}>
            {filteredMessages.length === 0 ? (
              <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
                <MailOpen size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No unread messages</h3>
                <p className="text-gray-600">You're all caught up! Great work.</p>
              </div>
            ) : (
              filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className={`bg-white rounded-lg shadow border-2 transition-all cursor-pointer hover:shadow-md ${
                    selectedMessage?.id === message.id
                      ? 'border-blue-500'
                      : 'border-gray-200 hover:border-gray-300'
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
                          <Square size={20} className="text-gray-400" />
                        )}
                      </button>

                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">{message.avatar}</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{message.sender}</h3>
                              {message.priority === 'high' && (
                                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                                  High Priority
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{message.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 whitespace-nowrap">{message.time}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleStar(message.id);
                              }}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                            >
                              <Star
                                size={16}
                                className={message.starred ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}
                              />
                            </button>
                          </div>
                        </div>

                        <h4 className="font-medium text-gray-900 mb-1 truncate">{message.subject}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{message.preview}</p>

                        <div className="flex items-center gap-3 mt-2">
                          {message.hasAttachment && (
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <Paperclip size={14} />
                              Attachment
                            </span>
                          )}
                          {message.unread && (
                            <span className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                              <Mail size={14} />
                              Unread
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
            <div className="lg:col-span-2 bg-white rounded-lg shadow border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">{selectedMessage.avatar}</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedMessage.subject}</h2>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
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
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowReplyBox(!showReplyBox)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Reply size={18} />
                    Reply
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Forward size={18} />
                    Forward
                  </button>
                  <button
                    onClick={() => markAsRead(selectedMessage.id)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    title="Mark as Read"
                  >
                    <MailOpen size={18} />
                  </button>
                  <button
                    onClick={() => toggleStar(selectedMessage.id)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    title="Star"
                  >
                    <Star
                      size={18}
                      className={selectedMessage.starred ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}
                    />
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" title="More">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {selectedMessage.preview}
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>

                  {selectedMessage.hasAttachment && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Paperclip size={18} />
                        Attachments (2)
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200 hover:border-blue-300 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded">
                              <FileText size={20} className="text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Q4_Report.pdf</p>
                              <p className="text-sm text-gray-500">2.4 MB</p>
                            </div>
                          </div>
                          <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors">
                            Download
                          </button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200 hover:border-blue-300 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded">
                              <FileText size={20} className="text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Budget_Spreadsheet.xlsx</p>
                              <p className="text-sm text-gray-500">1.8 MB</p>
                            </div>
                          </div>
                          <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors">
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {showReplyBox && (
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Reply to {selectedMessage.sender}</h3>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply..."
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded transition-colors" title="Emoji">
                          <Smile size={20} className="text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded transition-colors" title="Attach">
                          <Paperclip size={20} className="text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded transition-colors" title="Image">
                          <Image size={20} className="text-gray-600" />
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowReplyBox(false)}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleReply}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Send size={18} />
                          Send Reply
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}