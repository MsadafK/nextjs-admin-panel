const highlights = [
  ['90', 'Static App Router pages'],
  ['LIVE', 'Supabase PostgreSQL sync'],
  ['1-click', 'Workspace role switching'],
];

export default function AuthLayout({ children, eyebrow = 'ADMINPRO WORKSPACE' }) {
  return <main className="auth-shell grid min-h-screen min-h-dvh grid-cols-1 bg-background text-foreground xl:grid-cols-2">
    <aside className="hidden min-h-dvh flex-col justify-between border-r border-border bg-zinc-950 p-10 text-white xl:flex xl:p-12">
      <div><div className="inline-flex items-center gap-2.5"><span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white text-zinc-950"><span className="text-lg font-semibold">N</span></span><span className="flex items-center gap-2 text-lg font-semibold tracking-tight">AdminPro<span className="rounded border border-white/25 px-1.5 py-0.5 text-[9px] font-semibold tracking-wider text-white/70">PRO</span></span></div><p className="mt-16 text-[11px] font-mono uppercase tracking-[0.22em] text-white/55">{eyebrow}</p><h2 className="mt-4 max-w-lg text-4xl font-semibold leading-tight tracking-tight text-white xl:text-5xl">Clarity for every part of your workspace.</h2><p className="mt-4 max-w-md text-sm leading-6 text-white/65">A live operations console for people, products, schedules, messages, and system health.</p></div>
      <div className="space-y-6"><div className="grid grid-cols-3 gap-3">{highlights.map(([metric, label]) => <div key={label} className="rounded-lg border border-white/15 bg-white/[0.04] p-3"><p className="font-mono text-sm font-semibold">{metric}</p><p className="mt-1 text-[10px] leading-4 text-white/55">{label}</p></div>)}</div><div className="rounded-xl border border-white/15 bg-black p-4 font-mono text-[11px]"><div className="flex items-center justify-between border-b border-white/10 pb-3 text-white/55"><span>workspace.health</span><span>LIVE</span></div><div className="mt-3 grid grid-cols-3 gap-3"><div><p className="text-white/45">MODULES</p><p className="mt-1 text-white">10 connected</p></div><div><p className="text-white/45">DATABASE</p><p className="mt-1 text-white">PostgreSQL</p></div><div><p className="text-white/45">THEME</p><p className="mt-1 text-white">Monochrome</p></div></div><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-4/5 rounded-full bg-white"/></div><p className="mt-2 text-[10px] text-white/45">Your team workspace, in sync.</p></div><p className="text-[10px] text-white/40">SECURE WORKSPACE ACCESS · NEXADMIN</p></div>
    </aside>
    <section className="flex min-h-dvh items-center justify-center px-4 pb-8 pt-24 sm:px-8 xl:px-10 xl:pt-20"><div className="w-full max-w-md">{children}</div></section>
  </main>;
}
