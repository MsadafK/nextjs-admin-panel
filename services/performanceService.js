import { supabase } from '@/lib/supabase';

const TABLES = ['products', 'categories', 'users', 'events', 'orders', 'notifications'];

export const performanceService = {
  async measureTables() {
    return Promise.all(TABLES.map(async (table) => {
      const startedAt = globalThis.performance?.now?.() ?? Date.now();
      try {
        const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
        const finishedAt = globalThis.performance?.now?.() ?? Date.now();
        return { table, count: Number.isFinite(count) ? count : 0, latencyMs: Math.max(0, finishedAt - startedAt), ok: !error, error: error?.message || '' };
      } catch (error) {
        const finishedAt = globalThis.performance?.now?.() ?? Date.now();
        return { table, count: 0, latencyMs: Math.max(0, finishedAt - startedAt), ok: false, error: error?.message || 'Query failed' };
      }
    }));
  },
};
