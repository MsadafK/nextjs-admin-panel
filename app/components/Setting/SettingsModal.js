'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, LayoutDashboard, Monitor, Moon, PanelLeft, PanelLeftClose, Printer, RotateCcw, Shield, Sun, X } from 'lucide-react';

const optionClass = (active) => `flex min-w-0 items-center justify-center gap-1.5 rounded-lg border px-1.5 py-3 text-[11px] transition-colors ${active ? 'border-foreground bg-foreground font-medium text-background' : 'border-border bg-background text-foreground hover:bg-muted/50'}`;
const sectionHeading = 'text-sm font-semibold text-foreground';

function OptionButton({ active, onClick, icon: Icon, children }) {
  return <button type="button" aria-pressed={active} onClick={onClick} className={optionClass(active)}>
    {Icon && <Icon size={15} className="shrink-0"/>}<span className="min-w-0 text-center leading-tight">{children}</span>
  </button>;
}

export default function SettingsModal({
  isOpen,
  onClose,
  colorMode = 'light',
  onColorModeChange = () => {},
  sidebarCollapsed = false,
  onSidebarCollapsedChange = () => {},
  sidebarPosition = 'left',
  onSidebarPositionChange = () => {},
  contentWidth = 'fluid',
  onContentWidthChange = () => {},
  radiusMode = 'default',
  onRadiusModeChange = () => {},
}) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const resetDefaults = () => {
    onColorModeChange('light');
    onSidebarCollapsedChange(false);
    onSidebarPositionChange('left');
    onContentWidthChange('fluid');
    onRadiusModeChange('default');
  };

  return <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <aside role="dialog" aria-modal="true" aria-labelledby="workspace-customizer-title" className="fixed inset-y-0 right-0 z-50 flex h-dvh max-h-dvh w-full max-w-sm flex-col border-l border-border bg-background bg-white text-foreground shadow-2xl dark:bg-zinc-950" style={{ animation: 'workspace-sheet-in 220ms ease-out' }}>
      <header className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
        <div className="min-w-0"><h2 id="workspace-customizer-title" className="text-sm font-semibold text-foreground">Workspace Customizer</h2><p className="mt-1 text-xs text-muted-foreground">Real-time layout &amp; interface preferences</p></div>
        <button type="button" onClick={onClose} aria-label="Close customizer" className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"><X size={16}/></button>
      </header>

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain p-5">
        <section aria-labelledby="appearance-heading">
          <h3 id="appearance-heading" className={sectionHeading}>Appearance / Color Mode</h3>
          <p className="mt-1 text-xs text-muted-foreground">Choose how the workspace follows your display.</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[{ value: 'light', label: 'Light', icon: Sun }, { value: 'dark', label: 'Dark', icon: Moon }, { value: 'system', label: 'System', icon: Monitor }].map((option) => <OptionButton key={option.value} active={colorMode === option.value} onClick={() => onColorModeChange(option.value)} icon={option.icon}>{option.label}</OptionButton>)}
          </div>
        </section>

        <section aria-labelledby="sidebar-heading">
          <h3 id="sidebar-heading" className={sectionHeading}>Sidebar Behavior &amp; Position</h3>
          <p className="mt-1 text-xs text-muted-foreground">Set the desktop navigation layout.</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <OptionButton active={!sidebarCollapsed} onClick={() => onSidebarCollapsedChange(false)} icon={PanelLeft}>Expanded</OptionButton>
            <OptionButton active={sidebarCollapsed} onClick={() => onSidebarCollapsedChange(true)} icon={PanelLeftClose}>Collapsed Rail</OptionButton>
            <OptionButton active={sidebarPosition === 'left'} onClick={() => onSidebarPositionChange('left')}>Dock Left</OptionButton>
            <OptionButton active={sidebarPosition === 'right'} onClick={() => onSidebarPositionChange('right')}>Dock Right</OptionButton>
          </div>
        </section>

        <section aria-labelledby="layout-heading">
          <h3 id="layout-heading" className={sectionHeading}>Interface Density &amp; Container Width</h3>
          <p className="mt-1 text-xs text-muted-foreground">Tune the available content space and corner radius.</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <OptionButton active={contentWidth === 'fluid'} onClick={() => onContentWidthChange('fluid')}>Fluid Full-Width</OptionButton>
            <OptionButton active={contentWidth === 'boxed'} onClick={() => onContentWidthChange('boxed')}>Boxed · 1440px</OptionButton>
          </div>
          <p className="mt-4 text-xs font-medium text-muted-foreground">UI Density / Radius</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <OptionButton active={radiusMode === 'sharp'} onClick={() => onRadiusModeChange('sharp')}>Sharp · 0px</OptionButton>
            <OptionButton active={radiusMode === 'default'} onClick={() => onRadiusModeChange('default')}>Default · 8px</OptionButton>
            <OptionButton active={radiusMode === 'rounded'} onClick={() => onRadiusModeChange('rounded')}>Rounded · 12px</OptionButton>
          </div>
        </section>

        <section aria-labelledby="shortcuts-heading">
          <h3 id="shortcuts-heading" className={sectionHeading}>Quick Workspace Shortcuts</h3>
          <div className="mt-3 space-y-1.5">
            <Link href="/settings" onClick={onClose} className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"><span className="flex items-center gap-2.5"><LayoutDashboard size={15}/>Full Account Settings</span><ChevronRight size={14} className="text-muted-foreground"/></Link>
            <Link href="/security/audit/security" onClick={onClose} className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"><span className="flex items-center gap-2.5"><Shield size={15}/>Security Logs</span><ChevronRight size={14} className="text-muted-foreground"/></Link>
            <button type="button" onClick={() => window.print()} className="flex w-full items-center justify-between rounded-lg border border-border px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-muted"><span className="flex items-center gap-2.5"><Printer size={15}/>Print Current Page</span><ChevronRight size={14} className="text-muted-foreground"/></button>
          </div>
        </section>
      </div>

      <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-border bg-background px-5 py-4">
        <button type="button" onClick={resetDefaults} className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"><RotateCcw size={14}/>Reset to Defaults</button>
        <button type="button" onClick={onClose} className="inline-flex h-9 cursor-pointer items-center justify-center rounded-md bg-foreground px-5 py-2 text-xs font-medium text-background shadow-2xs transition-opacity hover:opacity-90">Done</button>
      </footer>
    </aside>
  </div>;
}
