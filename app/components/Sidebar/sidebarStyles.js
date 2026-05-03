/**
 * sidebarStyles.js
 * ─────────────────────────────────────────────────────────────────
 * Phase 0.1 — shadCN style tokens for Sidebar & Navbar components.
 *
 * USAGE:
 *   import { S } from './sidebarStyles';
 *   className={S.container(isDarkMode)}
 *
 * All values map to CSS variables defined in globals.css so light/dark
 * mode flips automatically via the `.dark` class on <html>.
 * ─────────────────────────────────────────────────────────────────
 */

export const S = {
  /* ── Sidebar container ── */
  container: (dark) =>
    dark
      ? 'bg-zinc-900 text-zinc-300 border-zinc-800'
      : 'bg-white text-zinc-600 border-zinc-200',

  /* ── Section border (header / footer divider) ── */
  divider: (dark) =>
    dark ? 'border-zinc-800' : 'border-zinc-200',

  /* ── Icon / button that is NOT active ── */
  iconBtn: (dark) =>
    dark
      ? 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
      : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900',

  /* ── Nav item — default (inactive) ── */
  navItem: (dark) =>
    dark
      ? 'text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'
      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900',

  /* ── Nav item — in active path but not the leaf ── */
  navItemInPath: (dark) =>
    dark
      ? 'text-zinc-200 bg-zinc-800/60'
      : 'text-zinc-700 bg-zinc-100/80',

  /* ── Sub-nav item default ── */
  subNavItem: (dark) =>
    dark
      ? 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
      : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700',

  /* ── Tree line (vertical guide) ── */
  treeLine: (dark) =>
    dark ? 'bg-zinc-700' : 'bg-zinc-200',

  /* ── Tree line terminator (hides overshoot) ── */
  treeLineEnd: (dark) =>
    dark ? 'bg-zinc-900' : 'bg-white',

  /* ── Tree dot (inactive) ── */
  treeDot: (dark) =>
    dark ? 'bg-zinc-600' : 'bg-zinc-300',

  /* ── Hover flyout / dropdown panel ── */
  flyout: (dark) =>
    dark
      ? 'bg-zinc-900 border-zinc-800 shadow-dropdown'
      : 'bg-white border-zinc-200 shadow-dropdown',

  /* ── Flyout section header text ── */
  flyoutLabel: (dark) =>
    dark ? 'text-zinc-400' : 'text-zinc-500',

  /* ── User profile section ── */
  userPrimary: (dark) =>
    dark ? 'text-zinc-200' : 'text-zinc-900',

  userSecondary: (dark) =>
    dark ? 'text-zinc-500' : 'text-zinc-500',

  /* ── App name / logo text ── */
  logoText: (dark) =>
    dark ? 'text-zinc-100' : 'text-zinc-900',

  /* ── Badge (unread count) ── */
  badge: () => 'bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium',

  /* ── Position menu (settings popover) ── */
  positionMenu: (dark) =>
    dark
      ? 'bg-zinc-900 border-zinc-800 shadow-dropdown'
      : 'bg-white border-zinc-200 shadow-dropdown',

  positionMenuItem: (dark, active) =>
    active
      ? 'bg-primary/10 text-primary font-medium'
      : dark
      ? 'text-zinc-300 hover:bg-zinc-800'
      : 'text-zinc-600 hover:bg-zinc-50',

  /* ── Custom scrollbar (for <style jsx>) ── */
  scrollbarTrack: (dark) => (dark ? '#18181b' : '#fafafa'),     /* zinc-900 / zinc-50 */
  scrollbarThumb: (dark) => (dark ? '#3f3f46' : '#d4d4d8'),     /* zinc-700 / zinc-300 */
  scrollbarThumbHover: (dark) => (dark ? '#52525b' : '#a1a1aa'), /* zinc-600 / zinc-400 */
};

/* ── Navbar-specific tokens ── */
export const N = {
  /* Navbar wrapper */
  bar: (dark) =>
    dark
      ? 'bg-zinc-900 border-zinc-800'
      : 'bg-white border-zinc-200',

  /* Icon buttons in navbar */
  iconBtn: (dark) =>
    dark
      ? 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 border border-zinc-700'
      : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900',

  /* Search input */
  search: (dark) =>
    dark
      ? 'bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-500 focus:border-zinc-500'
      : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400',

  /* Dropdown panel */
  panel: (dark) =>
    dark
      ? 'bg-zinc-900 border-zinc-800 shadow-dropdown'
      : 'bg-white border-zinc-200 shadow-dropdown',

  /* Divider inside panel */
  panelDivider: (dark) =>
    dark ? 'border-zinc-800' : 'border-zinc-200',

  /* Panel row hover */
  panelRow: (dark) =>
    dark
      ? 'hover:bg-zinc-800 text-zinc-300'
      : 'hover:bg-zinc-50 text-zinc-700',

  /* Text primary inside panel */
  panelTextPrimary: (dark) =>
    dark ? 'text-zinc-100' : 'text-zinc-900',

  /* Text secondary inside panel */
  panelTextSecondary: (dark) =>
    dark ? 'text-zinc-400' : 'text-zinc-500',

  /* Divide lines between rows */
  divideLine: (dark) =>
    dark ? 'divide-zinc-800' : 'divide-zinc-100',

  /* CTA button in panels (See All…) */
  ctaBtn: (dark) =>
    dark
      ? 'border-zinc-600 text-zinc-300 hover:bg-zinc-800'
      : 'border-zinc-300 text-zinc-600 hover:bg-zinc-50',
};