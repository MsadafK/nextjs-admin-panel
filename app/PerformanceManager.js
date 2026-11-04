'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { performanceService } from '@/services/performanceService';

const TITLES = {
  feedback: 'Performance Feedback', 'kras/my': 'My Key Result Areas', 'kras/reports': 'KRA Performance Report',
  'kras/team': 'Team Key Result Areas', 'meetings/actions': 'Meeting Actions', 'meetings/my': 'My Meetings',
  'meetings/templates': 'Meeting Templates', reviews: 'Performance Reviews', skills: 'Skills Overview',
};
const csvExport = (rows) => {
  const keys = ['Table', 'Rows', 'Latency (ms)', 'Status', 'Error'];
  const csv = [keys.join(','), ...rows.map((row) => [row.table, row.count, row.latencyMs.toFixed(2), row.ok ? 'Success' : 'Error', row.error].map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(','))].join('\r\n');
  const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a'); link.href = url; link.download = 'performance-query-report.csv'; link.click(); URL.revokeObjectURL(url);
};

export default function PerformanceManager({ mode }) {
  const [metrics, setMetrics] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [lastMeasured, setLastMeasured] = useState(null);
  const refresh = useCallback(async () => {
    setLoading(true);
    try { setMetrics(await performanceService.measureTables()); setLastMeasured(new Date()); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { refresh(); const timer = setInterval(refresh, 30000); return () => clearInterval(timer); }, [refresh]);

  const filtered = useMemo(() => metrics.filter((item) => `${item.table} ${item.error}`.toLowerCase().includes(search.toLowerCase())), [metrics, search]);
  const totalRows = metrics.reduce((sum, item) => sum + (item.ok ? item.count : 0), 0);
  const average = metrics.length ? metrics.reduce((sum, item) => sum + item.latencyMs, 0) / metrics.length : 0;
  const slowest = [...metrics].sort((a, b) => b.latencyMs - a.latencyMs)[0];
  const successful = metrics.filter((item) => item.ok).length;
  const maxLatency = Math.max(1, ...metrics.map((item) => item.latencyMs));

  return <main className="min-h-screen space-y-6 bg-background p-6 text-foreground">
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5"><div><h1 className="text-2xl font-semibold">{TITLES[mode] || 'Performance'}</h1><p className="mt-1 text-sm text-muted-foreground">Measured Supabase round-trip query time and live row counts for six core tables.</p></div><div className="flex gap-2"><button onClick={refresh} disabled={loading} className="inline-flex items-center gap-2 rounded-md border border-border bg-muted px-4 py-2"><RefreshCw size={16} className={loading ? 'animate-spin' : ''}/> Measure now</button><button onClick={() => csvExport(filtered)} disabled={!filtered.length} className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-background"><Download size={16}/> Export CSV</button></div></header>
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[['Live Row Count', totalRows.toLocaleString('en-IN')], ['Average Query Time', `${average.toFixed(1)} ms`], ['Slowest Table', slowest ? `${slowest.table} · ${slowest.latencyMs.toFixed(1)} ms` : '—'], ['Tables Responding', `${successful} / ${metrics.length}`]].map(([label, value]) => <article key={label} className="rounded-lg border border-border bg-card p-4"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-xl font-semibold">{value}</p></article>)}</section>
    <section className="rounded-lg border border-border bg-card p-5"><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">Round-Trip Latency by Table</h2><span className="text-xs text-muted-foreground">{lastMeasured ? `Measured ${lastMeasured.toLocaleTimeString()}` : 'Measuring…'} · auto refresh 30 sec</span></div><div className="space-y-4">{filtered.map((item) => <div key={item.table}><div className="mb-1 flex justify-between gap-3 text-sm"><span className="capitalize">{item.table}</span><span className="text-muted-foreground">{item.latencyMs.toFixed(1)} ms</span></div><div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-foreground" style={{ width: `${Math.max(1, item.latencyMs / maxLatency * 100)}%` }}/></div></div>)}</div></section>
    <section className="space-y-3"><input aria-label="Search performance tables" placeholder="Search tables" value={search} onChange={(event) => setSearch(event.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2"/><div className="overflow-hidden rounded-lg border border-border bg-card"><div className="overflow-x-auto"><table className="w-full min-w-[600px] text-left text-sm"><thead className="bg-muted text-muted-foreground"><tr>{['Table', 'Live Rows', 'Round-Trip', 'Status', 'Query Result'].map((column) => <th key={column} className="px-4 py-3 font-medium">{column}</th>)}</tr></thead><tbody className="divide-y divide-border">{filtered.map((item) => <tr key={item.table}><td className="px-4 py-3 capitalize font-medium">{item.table}</td><td className="px-4 py-3">{item.ok ? item.count.toLocaleString('en-IN') : '—'}</td><td className="px-4 py-3">{item.latencyMs.toFixed(2)} ms</td><td className="px-4 py-3"><span className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs">{item.ok ? 'Success' : 'Unavailable'}</span></td><td className="px-4 py-3 text-muted-foreground">{item.error || 'Query completed'}</td></tr>)}{!filtered.length && <tr><td colSpan="5" className="px-4 py-8 text-center text-muted-foreground">{loading ? 'Measuring…' : 'No matching tables.'}</td></tr>}</tbody></table></div></div></section>
  </main>;
}
