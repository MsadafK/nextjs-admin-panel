// app/users/add/single/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  UserPlus,
  User,
  Mail,
  Phone,
  Briefcase,
  Shield,
  Lock,
  Check,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import { userService } from '@/services/userService';

export default function AddSingleUserPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: 'Engineering',
    position: '',
    employeeId: '',
    role: 'user',
    status: 'active',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setSubmitting(true);
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      await userService.createUser({
        name: fullName || formData.email.split('@')[0],
        email: formData.email.trim(),
        phone: formData.phone,
        department: formData.department,
        role: formData.role,
        status: formData.status,
      });

      setSuccess(true);
      setTimeout(() => router.push('/users/all/list'), 900);
    } catch (err) {
      setError(err.message || 'Failed to create user in Supabase');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground mb-1 flex items-center gap-2">
            <UserPlus size={22} className="text-foreground" />
            Add New User
          </h1>
          <p className="text-sm text-muted-foreground">
            Create a new user record directly in Supabase (`public.users`)
          </p>
        </div>
        <button onClick={() => router.push('/users/all/list')} className="btn btn-outline">
          <ArrowLeft size={15} className="mr-2" />
          Back to User List
        </button>
      </div>

      {error && (
        <div className="card p-4 border border-foreground bg-muted text-foreground text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="card p-4 border border-foreground bg-foreground text-background text-sm flex items-center gap-2">
          <Check size={16} />
          <span>User created in Supabase! Redirecting to User List...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <div className="card p-6 shadow-card border border-border space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <User size={18} className="text-foreground" />
            <h2 className="text-base font-semibold text-foreground">Personal Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label block mb-1.5">First Name *</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Mohd"
                className="input w-full"
              />
            </div>
            <div>
              <label className="label block mb-1.5">Last Name *</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Sadaf"
                className="input w-full"
              />
            </div>
            <div>
              <label className="label block mb-1.5">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@example.com"
                  className="input pl-9 w-full"
                />
              </div>
            </div>
            <div>
              <label className="label block mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="input pl-9 w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Professional Info */}
        <div className="card p-6 shadow-card border border-border space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Briefcase size={18} className="text-foreground" />
            <h2 className="text-base font-semibold text-foreground">Professional Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label block mb-1.5">Department *</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="input w-full"
              >
                <option value="Engineering">Engineering</option>
                <option value="Management">Management</option>
                <option value="Marketing">Marketing</option>
                <option value="Support">Support</option>
                <option value="General">General</option>
              </select>
            </div>
            <div>
              <label className="label block mb-1.5">Position</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="Frontend Engineer"
                className="input w-full"
              />
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="card p-6 shadow-card border border-border space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Shield size={18} className="text-foreground" />
            <h2 className="text-base font-semibold text-foreground">Account Settings</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label block mb-1.5">User Role *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="input w-full"
              >
                <option value="user">User</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="label block mb-1.5">Account Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="input w-full"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="label block mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter password"
                  className="input pl-9 w-full"
                />
              </div>
            </div>
            <div>
              <label className="label block mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Re-enter password"
                  className="input pl-9 w-full"
                />
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-muted border border-border text-xs text-foreground">
            <strong>Password Requirements:</strong> Minimum 8 characters recommended for administrative accounts.
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push('/users/all/list')}
            className="btn btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary bg-foreground text-background hover:bg-foreground/90"
          >
            <Check size={16} className="mr-2" />
            {submitting ? 'Creating User...' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  );
}