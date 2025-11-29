'use client';

import React, { useState } from 'react';
import { Shield, Users, Plus, Edit2, Trash2, Copy, Search, Filter, Check, X, ChevronDown, ChevronUp, Lock, Unlock, Key, Eye, Settings, Database, FileText, ShoppingCart, BarChart3, AlertCircle, CheckCircle } from 'lucide-react';

export default function RoleManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedRoles, setExpandedRoles] = useState({});

  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'Super Admin',
      description: 'Full system access with all permissions',
      users: 3,
      color: 'red',
      isSystem: true,
      createdAt: '2024-01-15',
      permissions: {
        users: { view: true, create: true, edit: true, delete: true },
        products: { view: true, create: true, edit: true, delete: true },
        orders: { view: true, create: true, edit: true, delete: true },
        analytics: { view: true, create: true, edit: true, delete: true },
        settings: { view: true, create: true, edit: true, delete: true },
        security: { view: true, create: true, edit: true, delete: true }
      }
    },
    {
      id: 2,
      name: 'Admin',
      description: 'Administrative access with most permissions',
      users: 8,
      color: 'purple',
      isSystem: true,
      createdAt: '2024-01-15',
      permissions: {
        users: { view: true, create: true, edit: true, delete: false },
        products: { view: true, create: true, edit: true, delete: true },
        orders: { view: true, create: true, edit: true, delete: false },
        analytics: { view: true, create: false, edit: false, delete: false },
        settings: { view: true, create: false, edit: true, delete: false },
        security: { view: true, create: false, edit: false, delete: false }
      }
    },
    {
      id: 3,
      name: 'Manager',
      description: 'Team management and operational access',
      users: 15,
      color: 'blue',
      isSystem: false,
      createdAt: '2024-02-10',
      permissions: {
        users: { view: true, create: false, edit: true, delete: false },
        products: { view: true, create: true, edit: true, delete: false },
        orders: { view: true, create: true, edit: true, delete: false },
        analytics: { view: true, create: false, edit: false, delete: false },
        settings: { view: true, create: false, edit: false, delete: false },
        security: { view: false, create: false, edit: false, delete: false }
      }
    },
    {
      id: 4,
      name: 'Sales Representative',
      description: 'Sales and order management access',
      users: 28,
      color: 'green',
      isSystem: false,
      createdAt: '2024-02-15',
      permissions: {
        users: { view: true, create: false, edit: false, delete: false },
        products: { view: true, create: false, edit: false, delete: false },
        orders: { view: true, create: true, edit: true, delete: false },
        analytics: { view: false, create: false, edit: false, delete: false },
        settings: { view: false, create: false, edit: false, delete: false },
        security: { view: false, create: false, edit: false, delete: false }
      }
    },
    {
      id: 5,
      name: 'Viewer',
      description: 'Read-only access to basic information',
      users: 42,
      color: 'gray',
      isSystem: false,
      createdAt: '2024-03-01',
      permissions: {
        users: { view: true, create: false, edit: false, delete: false },
        products: { view: true, create: false, edit: false, delete: false },
        orders: { view: true, create: false, edit: false, delete: false },
        analytics: { view: true, create: false, edit: false, delete: false },
        settings: { view: false, create: false, edit: false, delete: false },
        security: { view: false, create: false, edit: false, delete: false }
      }
    }
  ]);

  const permissionCategories = [
    { id: 'users', name: 'User Management', icon: Users, description: 'Manage user accounts and profiles' },
    { id: 'products', name: 'Products', icon: ShoppingCart, description: 'Manage product catalog' },
    { id: 'orders', name: 'Orders', icon: FileText, description: 'Handle order processing' },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, description: 'View reports and insights' },
    { id: 'settings', name: 'Settings', icon: Settings, description: 'Configure system settings' },
    { id: 'security', name: 'Security', icon: Shield, description: 'Manage security and roles' }
  ];

  const permissionActions = [
    { id: 'view', name: 'View', icon: Eye },
    { id: 'create', name: 'Create', icon: Plus },
    { id: 'edit', name: 'Edit', icon: Edit2 },
    { id: 'delete', name: 'Delete', icon: Trash2 }
  ];

  const getColorClasses = (color) => {
    const colors = {
      red: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', badge: 'bg-red-500' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200', badge: 'bg-purple-500' },
      blue: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', badge: 'bg-blue-500' },
      green: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', badge: 'bg-green-500' },
      gray: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200', badge: 'bg-gray-500' }
    };
    return colors[color] || colors.gray;
  };

  const toggleRoleExpand = (roleId) => {
    setExpandedRoles(prev => ({
      ...prev,
      [roleId]: !prev[roleId]
    }));
  };

  const calculatePermissionScore = (permissions) => {
    let total = 0;
    let granted = 0;
    Object.values(permissions).forEach(category => {
      Object.values(category).forEach(permission => {
        total++;
        if (permission) granted++;
      });
    });
    return Math.round((granted / total) * 100);
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Role Management</h1>
              <p className="text-gray-600">Define and manage user roles and permissions</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Create Role
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Shield size={24} className="text-blue-600" />
              </div>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">Total Roles</h3>
            <p className="text-2xl font-bold text-gray-900">{roles.length}</p>
            <p className="text-xs text-gray-500 mt-1">{roles.filter(r => r.isSystem).length} system roles</p>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users size={24} className="text-green-600" />
              </div>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">Total Users</h3>
            <p className="text-2xl font-bold text-gray-900">
              {roles.reduce((sum, role) => sum + role.users, 0)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Across all roles</p>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Key size={24} className="text-purple-600" />
              </div>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">Custom Roles</h3>
            <p className="text-2xl font-bold text-gray-900">
              {roles.filter(r => !r.isSystem).length}
            </p>
            <p className="text-xs text-gray-500 mt-1">User created</p>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Lock size={24} className="text-orange-600" />
              </div>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">Most Used</h3>
            <p className="text-xl font-bold text-gray-900">
              {roles.reduce((max, role) => role.users > max.users ? role : max, roles[0])?.name}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {roles.reduce((max, role) => role.users > max.users ? role : max, roles[0])?.users} users
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter size={20} />
              Filter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {filteredRoles.map((role) => {
              const colorClasses = getColorClasses(role.color);
              const isExpanded = expandedRoles[role.id];
              const permissionScore = calculatePermissionScore(role.permissions);

              return (
                <div
                  key={role.id}
                  className={`bg-white rounded-lg shadow border-2 transition-all ${
                    selectedRole?.id === role.id ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 ${colorClasses.bg} rounded-lg`}>
                        <Shield size={24} className={colorClasses.text} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-bold text-gray-900">{role.name}</h3>
                              {role.isSystem && (
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full border border-gray-300">
                                  System Role
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{role.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Users size={16} className="text-gray-500" />
                            <span className="text-sm text-gray-700">
                              <span className="font-semibold">{role.users}</span> users
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Key size={16} className="text-gray-500" />
                            <span className="text-sm text-gray-700">
                              <span className="font-semibold">{permissionScore}%</span> permissions
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              Created: {new Date(role.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => toggleRoleExpand(role.id)}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp size={16} />
                                Hide Permissions
                              </>
                            ) : (
                              <>
                                <ChevronDown size={16} />
                                View Permissions
                              </>
                            )}
                          </button>

                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelectedRole(role)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Role"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Duplicate Role"
                            >
                              <Copy size={18} />
                            </button>
                            {!role.isSystem && (
                              <button
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Role"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-4">Role Permissions</h4>
                        <div className="space-y-4">
                          {permissionCategories.map((category) => {
                            const CategoryIcon = category.icon;
                            const categoryPerms = role.permissions[category.id];

                            return (
                              <div key={category.id} className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3 mb-3">
                                  <CategoryIcon size={20} className="text-gray-600" />
                                  <div className="flex-1">
                                    <h5 className="font-semibold text-gray-900">{category.name}</h5>
                                    <p className="text-xs text-gray-600">{category.description}</p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                  {permissionActions.map((action) => {
                                    const ActionIcon = action.icon;
                                    const hasPermission = categoryPerms[action.id];

                                    return (
                                      <div
                                        key={action.id}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                                          hasPermission
                                            ? 'bg-green-50 border-green-200'
                                            : 'bg-white border-gray-200'
                                        }`}
                                      >
                                        {hasPermission ? (
                                          <CheckCircle size={16} className="text-green-600" />
                                        ) : (
                                          <X size={16} className="text-gray-400" />
                                        )}
                                        <span className={`text-sm font-medium ${
                                          hasPermission ? 'text-green-900' : 'text-gray-500'
                                        }`}>
                                          {action.name}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                  <Plus size={20} />
                  <span className="font-medium">Create New Role</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                  <Copy size={20} />
                  <span className="font-medium">Duplicate Role</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                  <Users size={20} />
                  <span className="font-medium">Assign Users</span>
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle size={20} className="text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Role Best Practices</h3>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li>• Follow principle of least privilege</li>
                    <li>• Regular permission audits</li>
                    <li>• Use descriptive role names</li>
                    <li>• Document role purposes</li>
                    <li>• Avoid over-privileged roles</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Permission Categories</h3>
              <div className="space-y-3">
                {permissionCategories.map((category) => {
                  const CategoryIcon = category.icon;
                  return (
                    <div key={category.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <CategoryIcon size={18} className="text-gray-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{category.name}</p>
                        <p className="text-xs text-gray-600 truncate">{category.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}