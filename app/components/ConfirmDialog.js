'use client';

import { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isPending = false,
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null);
  const cancelRef = useRef(null);
  const returnFocusRef = useRef(null);
  const onCancelRef = useRef(onCancel);
  const isPendingRef = useRef(isPending);
  onCancelRef.current = onCancel;
  isPendingRef.current = isPending;

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    returnFocusRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';
    const frame = requestAnimationFrame(() => cancelRef.current?.focus());
    const closeOnEscape = (event) => {
      if (event.key === 'Escape' && !isPendingRef.current) onCancelRef.current?.();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = previousOverflow;
      if (returnFocusRef.current?.isConnected) returnFocusRef.current.focus();
    };
  }, [open]);

  if (!open) return null;

  const keepFocusInside = (event) => {
    if (event.key !== 'Tab') return;
    const controls = dialogRef.current?.querySelectorAll('button:not([disabled])');
    if (!controls?.length) return;
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget && !isPending) onCancel?.(); }}>
    <section ref={dialogRef} role="alertdialog" aria-modal="true" aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-description" onKeyDown={keepFocusInside} className="w-full max-w-md rounded-xl border border-border bg-background p-5 text-foreground shadow-2xl sm:p-6">
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted"><AlertTriangle size={16}/></span>
        <div className="min-w-0"><h2 id="confirm-dialog-title" className="text-sm font-semibold">{title}</h2><p id="confirm-dialog-description" className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p></div>
      </div>
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button ref={cancelRef} type="button" disabled={isPending} onClick={onCancel} className="h-9 rounded-md border border-border bg-background px-4 text-xs font-medium text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60">{cancelLabel}</button>
        <button type="button" disabled={isPending} onClick={onConfirm} className="h-9 rounded-md bg-foreground px-4 text-xs font-medium text-background hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">{isPending ? 'Working…' : confirmLabel}</button>
      </div>
    </section>
  </div>;
}
