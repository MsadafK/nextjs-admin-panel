'use client';
import { useState } from 'react';
import { MessageSquare, Send, Search, Filter, MoreVertical, Pin, Star, Clock, Check, CheckCheck, Paperclip, Smile, ImageIcon, File, Users, Video, Phone, Archive, Trash2, AlertCircle, Circle } from 'lucide-react';

export default function TeamMessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const statusFilters = [
    { value: 'all', label: 'All Messages', count: 45 },
    { value: 'unread', label: 'Unread', count: 12 },
    { value: 'pinned', label: 'Pinned', count: 3 },
    { value: 'archived', label: 'Archived', count: 8 },
  ];

  const conversations = [
    {
      id: 1,
      name: 'Design Team',
      avatar: '🎨',
      lastMessage: 'Updated the landing page mockups',
      lastMessageTime: '2m ago',
      unreadCount: 3,
      isPinned: true,
      isOnline: true,
      type: 'group',
      members: 5
    },
    {
      id: 2,
      name: 'Rahul Sharma',
      avatar: '👨‍💼',
      lastMessage: 'Can we schedule a meeting tomorrow?',
      lastMessageTime: '15m ago',
      unreadCount: 0,
      isPinned: true,
      isOnline: true,
      type: 'direct'
    },
    {
      id: 3,
      name: 'Development Squad',
      avatar: '💻',
      lastMessage: 'New PR is ready for review',
      lastMessageTime: '1h ago',
      unreadCount: 7,
      isPinned: false,
      isOnline: true,
      type: 'group',
      members: 8
    },
    {
      id: 4,
      name: 'Priya Patel',
      avatar: '👩‍💻',
      lastMessage: 'Thanks for the quick update!',
      lastMessageTime: '2h ago',
      unreadCount: 0,
      isPinned: false,
      isOnline: false,
      type: 'direct'
    },
    {
      id: 5,
      name: 'Marketing Team',
      avatar: '📢',
      lastMessage: 'Campaign results are looking great',
      lastMessageTime: '3h ago',
      unreadCount: 2,
      isPinned: true,
      isOnline: true,
      type: 'group',
      members: 4
    },
    {
      id: 6,
      name: 'Amit Kumar',
      avatar: '👨‍🔧',
      lastMessage: 'Fixed the deployment issue',
      lastMessageTime: '5h ago',
      unreadCount: 0,
      isPinned: false,
      isOnline: true,
      type: 'direct'
    },
  ];

  const messages = [
    {
      id: 1,
      sender: 'Sarah Chen',
      avatar: '👩‍🎨',
      content: 'Hey team! I\'ve just uploaded the new landing page designs to Figma. Would love to get everyone\'s feedback!',
      timestamp: '10:30 AM',
      isSent: false,
      status: 'read',
      attachments: []
    },
    {
      id: 2,
      sender: 'You',
      avatar: '😊',
      content: 'Looks amazing! The color scheme is much better now.',
      timestamp: '10:32 AM',
      isSent: true,
      status: 'read',
      attachments: []
    },
    {
      id: 3,
      sender: 'Mike Johnson',
      avatar: '👨‍💼',
      content: 'I agree! The spacing feels more natural too.',
      timestamp: '10:35 AM',
      isSent: false,
      status: 'read',
      attachments: []
    },
    {
      id: 4,
      sender: 'You',
      avatar: '😊',
      content: 'Should we schedule a quick call to discuss the animations?',
      timestamp: '10:38 AM',
      isSent: true,
      status: 'read',
      attachments: []
    },
    {
      id: 5,
      sender: 'Sarah Chen',
      avatar: '👩‍🎨',
      content: 'Great idea! How about 3 PM today?',
      timestamp: '10:40 AM',
      isSent: false,
      status: 'read',
      attachments: [
        { name: 'design-specs.pdf', size: '2.4 MB', type: 'pdf' }
      ]
    },
    {
      id: 6,
      sender: 'You',
      avatar: '😊',
      content: 'Perfect! See you all then 👍',
      timestamp: '10:42 AM',
      isSent: true,
      status: 'delivered',
      attachments: []
    },
  ];

  const quickStats = [
    { label: 'Total Chats', value: '45', icon: MessageSquare, color: 'from-blue-500 to-indigo-600', bgColor: 'bg-muted', textColor: 'text-blue-600' },
    { label: 'Unread', value: '12', icon: AlertCircle, color: 'from-orange-500 to-amber-600', bgColor: 'bg-muted', textColor: 'text-orange-600' },
    { label: 'Active Today', value: '23', icon: Users, color: 'from-emerald-500 to-teal-600', bgColor: 'bg-muted', textColor: 'text-emerald-600' },
    { label: 'Pinned', value: '3', icon: Pin, color: 'from-purple-500 to-pink-600', bgColor: 'bg-muted', textColor: 'text-purple-600' },
  ];

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Handle send message
      setMessageText('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Team Messages
            </h1>
            <p className="text-muted-foreground">Stay connected with your team in real-time</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-card border border-border rounded-lg shadow-card hover:shadow-dropdown transition-all duration-300">
                <div className={`${stat.bgColor} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                <p className="text-lg sm:text-xl font-semibold tracking-tight text-foreground">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Main Chat Interface */}
        <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12" style={{ height: '600px' }}>
            {/* Conversations Sidebar */}
            <div className="lg:col-span-4 border-r border-border flex flex-col">
              {/* Search and Filters */}
              <div className="p-4 border-b border-border">
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-border rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {statusFilters.map(filter => (
                    <button
                      key={filter.value}
                      onClick={() => setFilterStatus(filter.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                        filterStatus === filter.value
                          ? 'bg-foreground text-background'
                          : 'bg-muted text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {filter.label} ({filter.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`p-4 border-b border-border cursor-pointer transition-all hover:bg-muted ${
                      selectedConversation === conv.id ? 'bg-muted border-l-2 border-l-blue-600' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-2xl">
                          {conv.avatar}
                        </div>
                        {conv.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-muted0 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-foreground truncate">{conv.name}</h3>
                            {conv.isPinned && <Pin className="w-4 h-4 text-blue-600" />}
                            {conv.type === 'group' && (
                              <span className="text-xs text-muted-foreground">({conv.members})</span>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">{conv.lastMessageTime}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                          {conv.unreadCount > 0 && (
                            <span className="bg-foreground text-background text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-8 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-border bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-2xl">
                        {selectedConv?.avatar}
                      </div>
                      {selectedConv?.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-muted0 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h2 className="font-bold text-foreground text-lg">{selectedConv?.name}</h2>
                      <p className="text-sm text-muted-foreground">
                        {selectedConv?.isOnline ? 'Active now' : 'Offline'}
                        {selectedConv?.type === 'group' && ` • ${selectedConv?.members} members`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                    </button>
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                      <Video className="w-5 h-5 text-muted-foreground" />
                    </button>
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.isSent ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {!message.isSent && (
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                        {message.avatar}
                      </div>
                    )}
                    <div className={`flex flex-col max-w-[70%] ${message.isSent ? 'items-end' : 'items-start'}`}>
                      {!message.isSent && (
                        <span className="text-xs font-semibold text-muted-foreground mb-1">{message.sender}</span>
                      )}
                      <div
                        className={`rounded-lg px-4 py-3 ${
                          message.isSent
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-background'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        {message.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {message.attachments.map((att, idx) => (
                              <div key={idx} className={`flex items-center gap-2 p-2 rounded-lg ${
                                message.isSent ? 'bg-card/20' : 'bg-card'
                              }`}>
                                <File className="w-4 h-4" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold truncate">{att.name}</p>
                                  <p className="text-xs opacity-70">{att.size}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                        {message.isSent && (
                          <span>
                            {message.status === 'delivered' ? (
                              <Check className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <CheckCheck className="w-4 h-4 text-blue-600" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-border bg-muted">
                <div className="flex items-center gap-3">
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <Paperclip className="w-5 h-5 text-muted-foreground" />
                  </button>
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <ImageIcon className="w-5 h-5 text-muted-foreground" />
                  </button>
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <Smile className="w-5 h-5 text-muted-foreground" />
                  </button>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 px-4 py-3 border-2 border-border rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-background p-3 rounded-xl hover:shadow-card transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!messageText.trim()}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}