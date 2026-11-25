'use client';

import { useEffect } from 'react';

export default function GlobalError({ reset }) {
  useEffect(() => {
    // Keep the browser console useful without exposing details in the UI.
    console.error('Uncaught application error');
  }, []);

  return (
    <html lang="en">
      <body className="min-h-dvh bg-white text-zinc-950 antialiased">
        <main className="flex min-h-dvh items-center justify-center px-4 py-12">
          <section role="alert" className="w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-6 text-center shadow-sm sm:p-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Application error</p>
            <h1 className="mt-2 text-xl font-semibold tracking-tight">The workspace couldn&apos;t start</h1>
            <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-600">A critical error interrupted the application. Retry to start the workspace again.</p>
            <button type="button" onClick={() => reset()} className="mt-6 inline-flex h-9 items-center justify-center rounded-md bg-zinc-950 px-4 text-xs font-medium text-white hover:opacity-90">Reload workspace</button>
          </section>
        </main>
      </body>
    </html>
  );
}
