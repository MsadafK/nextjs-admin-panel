'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, UserPlus } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import UserPageHeader from '@/app/components/Users/UserPageHeader';
import UserKpiSummary from '@/app/components/Users/UserKpiSummary';

const controlClass = 'h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground outline-none transition-colors focus:border-foreground';

export default function AddSingleUserPage() {
  const router = useRouter();
  const { users, loading, refreshUsers, addUser } = useUsers();
  const [form, setForm] = useState({ name: '', email: '', role: 'user', department: 'Engineering', status: 'active' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const initials = (form.name || 'New User').trim().split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true); setError(''); setSuccess(false);
    try {
      await addUser(form);
      setSuccess(true);
      window.setTimeout(() => router.push('/users/all/list'), 800);
    } catch (submitError) { setError(submitError.message || 'Could not save the user.'); }
    finally { setSubmitting(false); }
  };

  return <div className="page-container mx-auto max-w-7xl space-y-6">
    <UserPageHeader title="Add New User" description="Create an account in your live public.users directory." loading={loading} onRefresh={refreshUsers} users={users}/>
    <UserKpiSummary users={users} loading={loading}/>
    {error && <p role="alert" className="rounded-lg border border-border bg-muted p-3 text-sm text-foreground">{error}</p>}
    {success && <p role="status" className="rounded-lg border border-border bg-foreground p-3 text-sm text-background">User saved. Returning to the directory…</p>}

    <form onSubmit={handleSubmit} className="grid grid-cols-1 items-start gap-5 xl:grid-cols-3">
      <section className="rounded-xl border border-border bg-background p-5 sm:p-6 xl:col-span-2">
        <div className="mb-5 flex items-center gap-3 border-b border-border pb-4"><span className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-muted text-foreground"><UserPlus size={17}/></span><div><h2 className="text-sm font-semibold text-foreground">User Details</h2><p className="mt-0.5 text-xs text-muted-foreground">Enter account identity, role, and workspace assignment.</p></div></div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="space-y-1.5 text-xs font-medium text-foreground">Full Name<input required value={form.name} onChange={update('name')} placeholder="Full name" className={controlClass}/></label>
          <label className="space-y-1.5 text-xs font-medium text-foreground">Email Address<input type="email" required value={form.email} onChange={update('email')} placeholder="name@company.com" className={controlClass}/></label>
          <label className="space-y-1.5 text-xs font-medium text-foreground">Role<select value={form.role} onChange={update('role')} className={controlClass}><option value="admin">Admin</option><option value="manager">Manager</option><option value="user">User</option></select></label>
          <label className="space-y-1.5 text-xs font-medium text-foreground">Department<select value={form.department} onChange={update('department')} className={controlClass}><option>Engineering</option><option>Management</option><option>Marketing</option><option>Support</option><option>General</option></select></label>
          <label className="space-y-1.5 text-xs font-medium text-foreground">Status<select value={form.status} onChange={update('status')} className={controlClass}><option value="active">Active</option><option value="suspended">Suspended</option></select></label>
        </div>
        <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-border pt-4"><button type="button" onClick={() => router.push('/users/all/list')} className="h-9 rounded-md border border-border px-4 text-xs font-medium text-foreground hover:bg-muted">Cancel</button><button type="submit" disabled={submitting} className="inline-flex h-9 items-center gap-2 rounded-md bg-foreground px-5 text-xs font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60"><Check size={14}/>{submitting ? 'Saving…' : 'Save User'}</button></div>
      </section>
      <aside className="rounded-xl border border-border bg-background p-5 sm:p-6"><h2 className="text-sm font-semibold text-foreground">Live Profile Preview</h2><p className="mt-1 text-xs text-muted-foreground">Preview updates as you edit the form.</p><div className="mt-5 rounded-lg border border-border bg-muted/20 p-4"><div className="flex items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground font-mono text-xs font-semibold text-background">{initials}</span><span className="min-w-0"><span className="block truncate text-sm font-semibold text-foreground">{form.name || 'Full Name'}</span><span className="block truncate text-xs text-muted-foreground">{form.email || 'email@company.com'}</span></span></div><div className="mt-4 flex flex-wrap gap-2"><span className="rounded border border-border bg-muted px-2 py-1 font-mono text-[10px] uppercase text-foreground">{form.role}</span><span className="rounded border border-border bg-muted px-2 py-1 text-[10px] text-foreground">{form.department}</span><span className={`rounded px-2 py-1 text-[10px] font-medium ${form.status === 'active' ? 'bg-foreground text-background' : 'border border-border bg-muted text-muted-foreground'}`}>{form.status}</span></div></div></aside>
    </form>
  </div>;
}
