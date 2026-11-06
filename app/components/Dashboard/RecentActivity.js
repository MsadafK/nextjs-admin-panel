'use client';

import { Clock, Package, Shield, ShoppingCart, Settings, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

const MODULE_ICONS = { Auth: User, Products: Package, Orders: ShoppingCart, Security: Shield, Settings };

export default function RecentActivity({ activities = [], loading }) {
  const router = useRouter();
  return <section className="min-w-0 rounded-xl border border-border bg-card">
    <div className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-5"><div><h2 className="text-sm font-semibold text-foreground">Recent Activity (Live DB)</h2><p className="mt-1 text-xs text-muted-foreground">Latest changes across your workspace</p></div><span className="inline-flex items-center gap-1.5 rounded border border-border bg-muted px-2 py-1 font-mono text-[10px] text-foreground"><Clock size={12}/>{loading ? '…' : activities.length}</span></div>
    <div className="overflow-x-auto pb-2">
      <div className="min-w-[580px] divide-y divide-border sm:min-w-full">
      {loading ? Array.from({ length: 4 }).map((_, index) => <div key={index} className="m-4 h-12 animate-pulse rounded-md bg-muted"/>) : activities.length === 0 ? <p className="px-4 py-10 text-center text-sm text-muted-foreground">No recent activity found in Supabase.</p> : activities.map((log) => {
        const Icon = MODULE_ICONS[log.module] || Clock;
        return <article key={log.id} className="flex min-w-max items-start justify-between gap-5 p-3.5 transition-colors hover:bg-muted/40">
          <div className="flex min-w-0 flex-1 items-start gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-foreground"><Icon size={14}/></span><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="whitespace-nowrap text-sm font-medium text-foreground">{log.action}</p><span className="shrink-0 whitespace-nowrap rounded border border-border bg-muted px-2 py-0.5 font-mono text-[10px] uppercase text-foreground">{log.user}</span></div><p className="mt-1 whitespace-nowrap text-xs text-muted-foreground" title={log.details}>{log.details}</p></div></div>
          <span className="shrink-0 whitespace-nowrap pt-0.5 text-[10px] text-muted-foreground">{log.time}</span>
        </article>;
      })}
      </div>
    </div>
    <div className="border-t border-border px-4 py-3"><button onClick={() => router.push('/users/all/activity')} className="text-xs font-medium text-foreground underline-offset-2 hover:text-muted-foreground hover:underline">View all activity →</button></div>
  </section>;
}
