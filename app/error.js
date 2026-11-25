'use client';

import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function RouteError({ reset }) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-background px-4 py-12 text-foreground">
      <section role="alert" className="w-full max-w-lg rounded-xl border border-border bg-card p-6 text-center shadow-sm sm:p-8">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-border bg-muted text-foreground">
          <AlertTriangle size={19} aria-hidden="true" />
        </span>
        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Workspace error</p>
        <h1 className="mt-2 text-xl font-semibold tracking-tight">This page couldn&apos;t load</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          An unexpected error interrupted this page. You can retry it or return to the dashboard.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <button type="button" onClick={() => reset()} className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-foreground px-4 text-xs font-medium text-background hover:opacity-90">
            <RefreshCw size={14} aria-hidden="true" />Try again
          </button>
          <Link href="/" className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 text-xs font-medium text-foreground hover:bg-muted">
            <Home size={14} aria-hidden="true" />Go to dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
