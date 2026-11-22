'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Activity, Database, Download, Gauge, RefreshCw, Search, Zap } from 'lucide-react';
import { performanceService } from '@/services/performanceService';

const TITLES = {
  overview: 'System Performance & Latency',
  feedback: 'System Performance & Latency', 'kras/my': 'Database Health & Row Metrics', 'kras/reports': 'Query Benchmarks',
  'kras/team': 'Database Health & Row Metrics', 'meetings/actions': 'Query Benchmarks', 'meetings/my': 'System Performance & Latency',
  'meetings/templates': 'Query Benchmarks', reviews: 'System Performance & Latency', skills: 'Database Health & Row Metrics',
};
const csvExport = (rows) => {
  const keys = ['Table', 'Rows', 'Latency (ms)', 'Payload Share (%)', 'Status', 'Error'];
  const csv = [keys.join(','), ...rows.map((row) => [row.table, row.count, row.latencyMs.toFixed(2), row.share.toFixed(2), row.ok ? 'Connected' : 'Unavailable', row.error].map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(','))].join('\r\n');
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

  const totalRows = metrics.reduce((sum, item) => sum + (item.ok ? item.count : 0), 0);
  const rowsWithShare = useMemo(() => metrics.map((item) => ({ ...item, share: totalRows ? (item.count / totalRows) * 100 : 0 })), [metrics, totalRows]);
  const filtered = useMemo(() => rowsWithShare.filter((item) => item.table.toLowerCase().includes(search.toLowerCase())), [rowsWithShare, search]);
  const average = metrics.length ? metrics.reduce((sum, item) => sum + item.latencyMs, 0) / metrics.length : 0;
  const slowest = [...metrics].sort((a, b) => b.latencyMs - a.latencyMs)[0];
  const fastest = [...metrics].filter((item) => item.ok).sort((a, b) => a.latencyMs - b.latencyMs)[0];
  const successful = metrics.filter((item) => item.ok).length;
  const maxLatency = Math.max(1, ...metrics.map((item) => item.latencyMs));
  const retestTable = async (table) => {
    setLoading(true);
    try { const fresh = await performanceService.measureTable(table); setMetrics((current) => current.map((item) => item.table === table ? fresh : item)); setLastMeasured(new Date()); }
    finally { setLoading(false); }
  };
  const kpis = [
    ['Avg Supabase Latency (ms)', `${average.toFixed(2)} ms`, 'Across live table queries', Activity],
    ['Total Synced DB Rows', totalRows.toLocaleString('en-IN'), 'Six measured tables', Database],
    ['Healthy Tables', `${successful} / 6`, 'Successful count queries', Gauge],
    ['Fastest / Slowest Table', `${fastest?.table || '—'} / ${slowest?.table || '—'}`, `${fastest?.latencyMs.toFixed(2) || '0.00'} / ${slowest?.latencyMs.toFixed(2) || '0.00'} ms`, Zap],
  ];
  const title = TITLES[mode] || 'System Performance & Latency';

  return <main className="mx-auto min-h-full max-w-7xl space-y-5 bg-background p-4 text-foreground sm:p-6">
    <header className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight sm:text-2xl">{title}<span className="h-2 w-2 rounded-full bg-foreground" title="Live measurements"/></h1><p className="mt-1 text-sm text-muted-foreground">Real Supabase round-trip timing and row counts for six workspace tables.</p></div><div className="flex flex-wrap gap-2"><button onClick={refresh} disabled={loading} className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3.5 text-xs font-medium hover:bg-muted"><RefreshCw size={14} className={loading ? 'animate-spin' : ''}/>{loading ? 'Measuring…' : 'Run Benchmark / Refresh'}</button><button onClick={() => csvExport(rowsWithShare)} disabled={!rowsWithShare.length} className="inline-flex h-9 items-center gap-2 rounded-md bg-foreground px-3.5 text-xs font-medium text-background"><Download size={14}/>Export CSV</button></div></header>
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{kpis.map(([label, value, context, Icon]) => <article key={label} className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5"><div className="flex items-start justify-between gap-2"><p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted/70 text-foreground"><Icon size={15}/></span></div><p className="mt-3 break-words font-mono text-2xl font-bold tracking-tight">{value}</p><div className="mt-3 flex flex-wrap items-center gap-2"><span className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] uppercase">LIVE</span><span className="text-xs text-muted-foreground">{context}</span></div></article>)}</section>
    <section className="grid grid-cols-1 gap-6 xl:grid-cols-2"><article className="rounded-xl border border-border bg-card p-4 sm:p-5"><div className="mb-4 flex flex-wrap items-center justify-between gap-2"><div><h2 className="text-base font-semibold">Round-Trip Latency by Table</h2><p className="mt-1 text-xs text-muted-foreground">Measured against live Supabase queries.</p></div><span className="text-xs text-muted-foreground">{lastMeasured ? lastMeasured.toLocaleTimeString() : 'Measuring…'}</span></div><div className="space-y-4">{metrics.map((item) => <div key={item.table}><div className="mb-1.5 flex items-center justify-between gap-3 text-xs"><span className="capitalize text-foreground">{item.table}</span><span className="shrink-0 font-mono text-muted-foreground">{item.latencyMs.toFixed(2)} ms</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-foreground" style={{ width: `${Math.max(item.latencyMs ? 1 : 0, item.latencyMs / maxLatency * 100)}%` }}/></div></div>)}</div></article><article className="rounded-xl border border-border bg-card p-4 sm:p-5"><h2 className="text-base font-semibold">Live Row Distribution</h2><p className="mt-1 text-xs text-muted-foreground">Share of all rows returned by the six measured tables.</p><div className="mt-5 space-y-4">{rowsWithShare.map((item) => <div key={item.table}><div className="mb-1.5 flex items-center justify-between gap-3 text-xs"><span className="capitalize">{item.table} <span className="text-muted-foreground">· {item.count.toLocaleString('en-IN')} rows</span></span><span className="shrink-0 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">{item.share.toFixed(1)}%</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-foreground" style={{ width: `${item.share}%` }}/></div></div>)}</div></article></section>
    <section className="space-y-3"><div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/><input aria-label="Search benchmark tables" placeholder="Search tables" value={search} onChange={(event) => setSearch(event.target.value)} className="h-9 w-full rounded-md border border-border bg-background px-3 pl-9 text-xs text-foreground"/></div><div className="overflow-hidden rounded-xl border border-border bg-card"><div className="flex items-center justify-between gap-3 border-b border-border p-4"><div><h2 className="text-sm font-semibold">Supabase Benchmark Ledger</h2><p className="mt-1 text-xs text-muted-foreground">{filtered.length} measured tables</p></div><span className="rounded border border-border bg-muted px-2 py-1 font-mono text-[10px] uppercase">Live Data</span></div><div className="w-full overflow-x-auto"><table className="w-full min-w-[760px] border-collapse text-left text-sm"><thead className="bg-muted text-[10px] uppercase text-muted-foreground"><tr>{['Table Name', 'Live Row Count', 'Measured Latency (ms)', 'Payload Share (%)', 'Sync Status', 'Action'].map((column) => <th key={column} className="whitespace-nowrap px-4 py-3 font-semibold">{column}</th>)}</tr></thead><tbody className="divide-y divide-border">{filtered.map((item) => <tr key={item.table} className="hover:bg-muted/40"><td className="whitespace-nowrap px-4 py-3 capitalize font-medium">{item.table}</td><td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{item.ok ? item.count.toLocaleString('en-IN') : '—'}</td><td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{item.latencyMs.toFixed(2)}</td><td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{item.share.toFixed(2)}%</td><td className="whitespace-nowrap px-4 py-3"><span className={`rounded-full px-2 py-1 text-[10px] font-medium ${item.ok ? 'bg-foreground text-background' : 'border border-border bg-muted text-muted-foreground'}`}>{item.ok ? 'Connected' : 'Unavailable'}</span></td><td className="whitespace-nowrap px-4 py-3"><button onClick={() => retestTable(item.table)} disabled={loading} className="h-8 rounded-md border border-border px-2.5 text-xs font-medium hover:bg-muted">Re-test Table</button></td></tr>)}{!filtered.length && <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">{loading ? 'Measuring…' : 'No tables match this search.'}</td></tr>}</tbody></table></div></div></section>
  </main>;
}
