'use client';

import { X, Palette, Sidebar, Globe, Type, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useFonts } from '../../contexts/FontsContext';
import React from 'react';

/* Sidebar position preview mini-diagram */
function PositionPreview({ pos, active, themeColor }) {
  const base = 'rounded-sm';
  const content = 'rounded-sm';
  const activeColor = themeColor;
  const inactiveColor = 'bg-zinc-200 dark:bg-zinc-700';

  const blocks = {
    left:   { side: `${activeColor} w-3 h-6 rounded-l-sm`, body: `${inactiveColor} flex-1 h-6 rounded-r-sm` },
    right:  { side: `${inactiveColor} flex-1 h-6 rounded-l-sm`, body: `${activeColor} w-3 h-6 rounded-r-sm` },
    top:    { side: `${activeColor} w-6 h-3 rounded-t-sm`, body: `${inactiveColor} w-6 h-3 rounded-b-sm` },
    bottom: { side: `${inactiveColor} w-6 h-3 rounded-t-sm`, body: `${activeColor} w-6 h-3 rounded-b-sm` },
  };

  const b = blocks[pos];
  const isHorizontal = pos === 'left' || pos === 'right';

  return (
    <div className={`flex ${isHorizontal ? 'flex-row' : 'flex-col'} gap-0.5`}>
      <div className={b.side} />
      <div className={b.body} />
    </div>
  );
}

export default function SettingsModal({
  isOpen,
  onClose,
  currentTheme,
  onThemeChange,
  currentLanguage,
  onLanguageChange,
  sidebarDarkMode,
  onSidebarDarkModeToggle,
  sidebarPosition,
  onSidebarPositionChange,
}) {
  const { themes, getThemeColors } = useTheme();
  const { t } = useLanguage() || {};
  const { currentFont, changeFont, fonts } = useFonts();

  const colors = getThemeColors();
  const themeOptions = themes || {};

  /* Theme key → Tailwind bg class for swatches */
  const SWATCH_BG = {
    emerald: 'bg-emerald-600',
    blue:    'bg-blue-600',
    purple:  'bg-purple-600',
    orange:  'bg-orange-600',
    rose:    'bg-rose-600',
  };

  /* Theme key → active ring colour for position buttons */
  const RING_COLOR = {
    emerald: 'ring-emerald-600',
    blue:    'ring-blue-600',
    purple:  'ring-purple-600',
    orange:  'ring-orange-600',
    rose:    'ring-rose-600',
  };

  const PREVIEW_COLOR = {
    emerald: 'bg-emerald-500',
    blue:    'bg-blue-500',
    purple:  'bg-purple-500',
    orange:  'bg-orange-500',
    rose:    'bg-rose-500',
  };

  React.useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleReset = () => {
    onThemeChange('emerald');
    onSidebarPositionChange('left');
    onLanguageChange('en');
    changeFont('inter');
    if (sidebarDarkMode) onSidebarDarkModeToggle();
  };

  const languages = [
    { code: 'en', name: 'English',  flag: '🇺🇸' },
    { code: 'es', name: 'Español',  flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch',  flag: '🇩🇪' },
    { code: 'zh', name: '中文',      flag: '🇨🇳' },
  ];

  const positions = ['left', 'right', 'top', 'bottom'];

  /* shared classes */
  const sectionTitle = 'text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3';
  const sectionIcon  = `w-4 h-4 ${colors.primaryText}`;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-end">
      <div className="bg-card text-card-foreground w-full max-w-sm h-full flex flex-col border-l border-border shadow-modal">

        {/* ── Header ── */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              {t ? t('customizer') : 'Customizer'}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t ? t('customizeOverview') : 'Customize your dashboard'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Scrollable content ── */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-7 no-scrollbar">

          {/* ── Theme Colors ── */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Palette className={sectionIcon} />
              <p className={sectionTitle}>{t ? t('themeColors') : 'Accent Color'}</p>
            </div>
            <div className="flex items-center gap-2">
              {Object.entries(themeOptions).map(([key, theme]) => {
                const isActive = currentTheme === key;
                const bg = SWATCH_BG[key] ?? 'bg-zinc-600';
                return (
                  <button
                    key={key}
                    onClick={() => onThemeChange(key)}
                    title={theme.name}
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      ${bg} transition-all duration-150
                      ${isActive
                        ? 'ring-2 ring-offset-2 ring-offset-card scale-110 ' + (RING_COLOR[key] ?? 'ring-zinc-600')
                        : 'hover:scale-105 opacity-70 hover:opacity-100'
                      }
                    `}
                  >
                    {isActive && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Font Family ── */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Type className={sectionIcon} />
              <p className={sectionTitle}>Font Family</p>
            </div>
            <select
              value={currentFont}
              onChange={(e) => changeFont(e.target.value)}
              className="input w-full text-sm"
              style={{ fontFamily: fonts[currentFont]?.value }}
            >
              {Object.entries(fonts).map(([key, font]) => (
                <option key={key} value={key} style={{ fontFamily: font.value }}>
                  {font.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-2" style={{ fontFamily: fonts[currentFont]?.value }}>
              Preview: The quick brown fox jumps over the lazy dog
            </p>
          </div>

          {/* ── Sidebar Dark Mode ── */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Moon className={sectionIcon} />
              <p className={sectionTitle}>Sidebar Style</p>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
              <div>
                <p className="text-sm font-medium text-foreground">Dark sidebar</p>
                <p className="text-xs text-muted-foreground">Independent of global dark mode</p>
              </div>
              <button
                onClick={onSidebarDarkModeToggle}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                  sidebarDarkMode
                    ? (SWATCH_BG[currentTheme] ?? 'bg-zinc-600')
                    : 'bg-zinc-300 dark:bg-zinc-700'
                }`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${sidebarDarkMode ? 'translate-x-[18px]' : 'translate-x-[3px]'}`} />
              </button>
            </div>
          </div>

          {/* ── Sidebar Position ── */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sidebar className={sectionIcon} />
              <p className={sectionTitle}>{t ? t('sidebarPosition') : 'Sidebar Position'}</p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {positions.map((pos) => {
                const isActive = sidebarPosition === pos;
                return (
                  <button
                    key={pos}
                    onClick={() => onSidebarPositionChange(pos)}
                    className={`
                      flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors
                      ${isActive
                        ? `border-transparent ring-2 ${RING_COLOR[currentTheme] ?? 'ring-zinc-600'} ring-offset-1 ring-offset-card`
                        : 'border-border hover:bg-accent'
                      }
                    `}
                  >
                    <PositionPreview
                      pos={pos}
                      active={isActive}
                      themeColor={PREVIEW_COLOR[currentTheme] ?? 'bg-zinc-500'}
                    />
                    <span className={`text-xs font-medium capitalize ${isActive ? colors.primaryText : 'text-muted-foreground'}`}>
                      {t ? t(pos) : pos.charAt(0).toUpperCase() + pos.slice(1)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Language ── */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Globe className={sectionIcon} />
              <p className={sectionTitle}>{t ? t('language') : 'Language'}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => {
                const isActive = currentLanguage === lang.code;
                const activeBg = SWATCH_BG[currentTheme] ?? 'bg-zinc-600';
                return (
                  <button
                    key={lang.code}
                    onClick={() => onLanguageChange(lang.code)}
                    className={`
                      flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors
                      ${isActive
                        ? `${activeBg} text-white border-transparent`
                        : 'border-border text-foreground hover:bg-accent'
                      }
                    `}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-5 py-4 border-t border-border flex-shrink-0">
          <button
            onClick={handleReset}
            className="w-full py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-md hover:bg-accent transition-colors"
          >
            {t ? t('resetToDefaults') : 'Reset to defaults'}
          </button>
        </div>
      </div>
    </div>
  );
}