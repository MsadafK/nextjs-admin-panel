'use client';

import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Key,
  Users,
  Search,
  Filter,
  ChevronDown,
  Edit,
  Trash2,
  Plus,
  Check,
  X,
  AlertTriangle,
  Crown,
  User,
  Settings,
  FileText,
  Mail,
  Calendar,
  BarChart3,
  Database,
  Eye,
  EyeOff,
  Save,
  RotateCcw
} from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

export default function UserPermissionsPage() {
  const { isDark } = useTheme();
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Permission categories
  const permissionCategories = [
    {
      name: 'Dashboard',
      icon: BarChart3,
      permissions: [
        { id: 'dash_view', name: 'View Dashboard', description: 'Access to main dashboard' },
        { id: 'dash_edit', name: 'Edit Widgets', description: 'Modify dashboard widgets' },
        { id: 'dash_export', name: 'Export Data', description: 'Export dashboard data' }
      ]
    },
    {
      name: 'Users Management',
      icon: Users,
      permissions: [
        { id: 'user_view', name: 'View Users', description: 'View user list and profiles' },
        { id: 'user_create', name: 'Create Users', description: 'Add new users to system' },
        { id: 'user_edit', name: 'Edit Users', description: 'Modify user information' },
        { id: 'user_delete', name: 'Delete Users', description: 'Remove users from system' }
      ]
    },
    {
      name: 'Content',
      icon: FileText,
      permissions: [
        { id: 'content_view', name: 'View Content', description: 'Access all content' },
        { id: 'content_create', name: 'Create Content', description: 'Add new content' },
        { id: 'content_edit', name: 'Edit Content', description: 'Modify existing content' },
        { id: 'content_publish', name: 'Publish Content', description: 'Publish content to live' },
        { id: 'content_delete', name: 'Delete Content', description: 'Remove content' }
      ]
    },
    {
      name: 'Reports',
      icon: BarChart3,
      permissions: [
        { id: 'report_view', name: 'View Reports', description: 'Access all reports' },
        { id: 'report_create', name: 'Create Reports', description: 'Generate new reports' },
        { id: 'report_export', name: 'Export Reports', description: 'Download report data' }
      ]
    },
    {
      name: 'Settings',
      icon: Settings,
      permissions: [
        { id: 'settings_view', name: 'View Settings', description: 'Access system settings' },
        { id: 'settings_edit', name: 'Edit Settings', description: 'Modify system settings' },
        { id: 'settings_security', name: 'Security Settings', description: 'Manage security options' }
      ]
    },
    {
      name: 'Database',
      icon: Database,
      permissions: [
        { id: 'db_view', name: 'View Database', description: 'Access database records' },
        { id: 'db_backup', name: 'Backup Database', description: 'Create database backups' },
        { id: 'db_restore', name: 'Restore Database', description: 'Restore from backups' }
      ]
    }
  ];

  // Mock users data with roles
  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      avatar: 'JD',
      permissions: ['dash_view', 'dash_edit', 'dash_export', 'user_view', 'user_create', 'user_edit', 'user_delete', 'content_view', 'content_create', 'content_edit', 'content_publish', 'content_delete', 'report_view', 'report_create', 'report_export', 'settings_view', 'settings_edit', 'settings_security', 'db_view', 'db_backup', 'db_restore'],
      lastActive: '2 hours ago',
      status: 'active'
    },
    {
      id: 2,
      name: 'Sarah Smith',
      email: 'sarah@example.com',
      role: 'Editor',
      avatar: 'SS',
      permissions: ['dash_view', 'content_view', 'content_create', 'content_edit', 'content_publish', 'report_view'],
      lastActive: '5 minutes ago',
      status: 'active'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'Viewer',
      avatar: 'MJ',
      permissions: ['dash_view', 'content_view', 'report_view'],
      lastActive: '1 day ago',
      status: 'inactive'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily@example.com',
      role: 'Manager',
      avatar: 'ED',
      permissions: ['dash_view', 'dash_edit', 'user_view', 'user_edit', 'content_view', 'content_create', 'content_edit', 'report_view', 'report_create', 'report_export'],
      lastActive: '30 minutes ago',
      status: 'active'
    },
    {
      id: 5,
      name: 'David Wilson',
      email: 'david@example.com',
      role: 'Editor',
      avatar: 'DW',
      permissions: ['dash_view', 'content_view', 'content_create', 'content_edit'],
      lastActive: '3 hours ago',
      status: 'active'
    }
  ];

  // Role definitions
  const roles = [
    { 
      name: 'Admin', 
      color: 'bg-red-100 text-red-700 border-red-200',
      icon: Crown,
      count: users.filter(u => u.role === 'Admin').length
    },
    { 
      name: 'Manager', 
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      icon: Shield,
      count: users.filter(u => u.role === 'Manager').length
    },
    { 
      name: 'Editor', 
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: Edit,
      count: users.filter(u => u.role === 'Editor').length
    },
    { 
      name: 'Viewer', 
      color: 'bg-gray-100 text-gray-700 border-gray-200',
      icon: Eye,
      count: users.filter(u => u.role === 'Viewer').length
    }
  ];

  const [userPermissions, setUserPermissions] = useState(
    users.reduce((acc, user) => {
      acc[user.id] = user.permissions;
      return acc;
    }, {})
  );

  const togglePermission = (userId, permissionId) => {
    setUserPermissions(prev => ({
      ...prev,
      [userId]: prev[userId].includes(permissionId)
        ? prev[userId].filter(p => p !== permissionId)
        : [...prev[userId], permissionId]
    }));
  };

  const hasPermission = (userId, permissionId) => {
    return userPermissions[userId]?.includes(permissionId) || false;
  };

  const getPermissionStats = (userId) => {
    const totalPermissions = permissionCategories.reduce((acc, cat) => acc + cat.permissions.length, 0);
    const userPerms = userPermissions[userId]?.length || 0;
    return {
      total: totalPermissions,
      granted: userPerms,
      percentage: Math.round((userPerms / totalPermissions) * 100)
    };
  };

  return (
    <div className={`p-6 min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              User Permissions
            </h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Manage user access and permissions across the system
            </p>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={20} />
            <span>Add Role</span>
          </button>
        </div>

        {/* Breadcrumb */}
        <div className={`flex items-center space-x-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <span>Users</span>
          <ChevronDown size={16} className="rotate-[-90deg]" />
          <span>All Users</span>
          <ChevronDown size={16} className="rotate-[-90deg]" />
          <span className="text-blue-600 font-medium">User Permissions</span>
        </div>
      </div>

      {/* Roles Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {roles.map((role, index) => {
          const RoleIcon = role.icon;
          return (
            <div key={index} className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl p-6 shadow-sm border`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg border ${role.color}`}>
                  <RoleIcon size={24} />
                </div>
                <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {role.count}
                </span>
              </div>
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{role.name}</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {role.count} {role.count === 1 ? 'user' : 'users'}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users List */}
        <div className={`lg:col-span-1 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border`}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Users</h2>
            
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
                }`}
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
              }`}
            >
              <option value="all">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Editor">Editor</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>

          {/* Users List */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[600px] overflow-y-auto">
            {users
              .filter(user => roleFilter === 'all' || user.role === roleFilter)
              .filter(user => 
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((user) => {
                const stats = getPermissionStats(user.id);
                const roleInfo = roles.find(r => r.name === user.role);
                return (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`w-full p-4 text-left transition-colors ${
                      selectedUser?.id === user.id 
                        ? 'bg-blue-50 dark:bg-blue-900/20' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-sm">{user.avatar}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {user.name}
                          </h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${roleInfo?.color}`}>
                            {user.role}
                          </span>
                        </div>
                        <p className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {user.email}
                        </p>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                              Permissions
                            </span>
                            <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              {stats.granted}/{stats.total}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                            <div 
                              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${stats.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Permissions Panel */}
        <div className={`lg:col-span-2 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border`}>
          {selectedUser ? (
            <>
              {/* Selected User Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">{selectedUser.avatar}</span>
                    </div>
                    <div>
                      <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {selectedUser.name}
                      </h2>
                      <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        {selectedUser.email}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${
                          roles.find(r => r.name === selectedUser.role)?.color
                        }`}>
                          {selectedUser.role}
                        </span>
                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Last active: {selectedUser.lastActive}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className={`p-2 rounded-lg transition-colors ${
                      isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                    }`}>
                      <RotateCcw size={20} />
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Save size={20} />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>

                {/* Permission Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {(() => {
                    const stats = getPermissionStats(selectedUser.id);
                    return (
                      <>
                        <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Total Permissions
                          </p>
                          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {stats.total}
                          </p>
                        </div>
                        <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Granted
                          </p>
                          <p className="text-2xl font-bold text-green-600">
                            {stats.granted}
                          </p>
                        </div>
                        <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Access Level
                          </p>
                          <p className="text-2xl font-bold text-blue-600">
                            {stats.percentage}%
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Permissions List */}
              <div className="p-6 max-h-[600px] overflow-y-auto">
                <div className="space-y-6">
                  {permissionCategories.map((category) => {
                    const CategoryIcon = category.icon;
                    const grantedInCategory = category.permissions.filter(p => 
                      hasPermission(selectedUser.id, p.id)
                    ).length;
                    
                    return (
                      <div key={category.name} className={`border rounded-lg ${
                        isDark ? 'border-gray-700' : 'border-gray-200'
                      }`}>
                        <div className={`p-4 border-b ${
                          isDark ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <CategoryIcon className="text-blue-600" size={20} />
                              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {category.name}
                              </h3>
                            </div>
                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              {grantedInCategory}/{category.permissions.length} granted
                            </span>
                          </div>
                        </div>
                        <div className="p-4 space-y-3">
                          {category.permissions.map((permission) => {
                            const isGranted = hasPermission(selectedUser.id, permission.id);
                            return (
                              <div key={permission.id} className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {permission.name}
                                  </h4>
                                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {permission.description}
                                  </p>
                                </div>
                                <button
                                  onClick={() => togglePermission(selectedUser.id, permission.id)}
                                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    isGranted ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                  }`}
                                >
                                  <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                      isGranted ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                  />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full p-12">
              <div className="text-center">
                <Shield className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} size={64} />
                <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Select a User
                </h3>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  Choose a user from the list to view and manage their permissions
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}