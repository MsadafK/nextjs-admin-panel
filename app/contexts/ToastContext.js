'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismissToast = useCallback((id) => {
    const timer = timers.current.get(id);
    if (timer) window.clearTimeout(timer);
    timers.current.delete(id);
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback(({ title, subtitle = '', onUndo, undo, duration = 7000 } = {}) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const action = onUndo || undo;
    const toast = { id, title: title || 'Workspace updated', subtitle, onUndo: action, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setToasts((current) => [...current.slice(-3), toast]);
    if (duration > 0) timers.current.set(id, window.setTimeout(() => dismissToast(id), duration));
    return id;
  }, [dismissToast]);

  const value = useMemo(() => ({ pushToast, dismissToast }), [pushToast, dismissToast]);

  return <ToastContext.Provider value={value}>
    {children}
    <div aria-live="polite" aria-relevant="additions removals" className="pointer-events-none fixed bottom-4 left-4 right-4 z-[100] flex flex-col gap-2 sm:left-auto sm:w-full sm:max-w-sm">
      {toasts.map((toast) => <article key={toast.id} className="pointer-events-auto flex items-center justify-between gap-3 rounded-lg border border-border bg-background p-3 text-foreground shadow-lg">
        <div className="min-w-0 flex-1"><p className="text-xs font-semibold">{toast.title}</p>{toast.subtitle && <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{toast.subtitle}</p>}<p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{toast.timestamp}</p></div>
        {toast.onUndo && <button type="button" onClick={async () => { try { await toast.onUndo(); } catch (error) { pushToast({ title: 'Undo failed', subtitle: error.message || 'The previous state could not be restored.' }); } finally { dismissToast(toast.id); } }} className="shrink-0 rounded border border-border px-2 py-1 text-[11px] font-medium text-foreground hover:bg-muted">Undo</button>}
        <button type="button" onClick={() => dismissToast(toast.id)} aria-label="Dismiss notification" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"><X size={14}/></button>
      </article>)}
    </div>
  </ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider.');
  return context;
}
