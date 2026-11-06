'use client';

import { ArrowUpRight, Calendar, FileText, Mail, PackagePlus, Plus, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

const actions = [
  { title: 'Add New User', description: 'Invite a workspace member', icon: Users, href: '/users/add/single' },
  { title: 'Add New Product', description: 'Expand your catalog', icon: PackagePlus, href: '/products/all/catalog' },
  { title: 'Generate Report', description: 'Review workspace metrics', icon: FileText, href: '/reports' },
  { title: 'Send Message', description: 'Compose a notification', icon: Mail, href: '/messages/compose' },
  { title: 'Schedule Event', description: 'Add to the calendar', icon: Calendar, href: '/calendar/events/create' },
];

export default function QuickActions() {
  const router = useRouter();
  return <section className="min-w-0 rounded-xl border border-border bg-card">
    <div className="flex items-center justify-between border-b border-border px-4 py-4"><div><h2 className="text-sm font-semibold text-foreground">Quick Actions</h2><p className="mt-1 text-xs text-muted-foreground">Common workspace tasks</p></div><Plus size={16} className="text-muted-foreground"/></div>
    <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-1">
      {actions.map(({ title, description, icon: Icon, href }) => <button key={title} onClick={() => router.push(href)} className="group flex min-w-0 items-center justify-between gap-3 rounded-lg border border-border bg-background p-3 text-left transition-colors hover:bg-muted/60">
        <span className="flex min-w-0 flex-1 items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-foreground"><Icon size={16}/></span><span className="min-w-0 flex-1"><span className="block break-words text-sm font-medium leading-snug text-foreground">{title}</span><span className="mt-0.5 block break-words text-xs leading-snug text-muted-foreground">{description}</span></span></span><ArrowUpRight size={15} className="shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"/>
      </button>)}
    </div>
  </section>;
}

