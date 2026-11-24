'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

function applyMonochromeTokens(isDark) {
  if (typeof document === 'undefined') return;
  const primary = isDark ? '0 0% 98%' : '240 10% 3.9%';
  const primaryForeground = isDark ? '240 10% 3.9%' : '0 0% 98%';
  const ring = isDark ? '0 0% 98%' : '240 10% 3.9%';
  document.documentElement.style.setProperty('--primary', primary);
  document.documentElement.style.setProperty('--primary-foreground', primaryForeground);
  document.documentElement.style.setProperty('--ring', ring);
}

function applyColorMode(mode, isDark) {
  document.documentElement.classList.toggle('dark', isDark);
  localStorage.setItem('colorMode', mode);
  localStorage.setItem('darkMode', String(isDark));
  applyMonochromeTokens(isDark);
}

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [colorMode, setColorModeState] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('colorMode');
    const initialMode = ['light', 'dark', 'system'].includes(savedMode)
      ? savedMode
      : localStorage.getItem('darkMode') === 'true' ? 'dark' : 'light';
    const initialDark = initialMode === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : initialMode === 'dark';

    setColorModeState(initialMode);
    setIsDark(initialDark);
    applyColorMode(initialMode, initialDark);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || colorMode !== 'system') return undefined;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const syncSystemMode = (event) => {
      setIsDark(event.matches);
      applyColorMode('system', event.matches);
    };
    media.addEventListener('change', syncSystemMode);
    return () => media.removeEventListener('change', syncSystemMode);
  }, [colorMode, mounted]);

  const setColorMode = (mode) => {
    if (!mounted || !['light', 'dark', 'system'].includes(mode)) return;
    const nextDark = mode === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : mode === 'dark';
    setColorModeState(mode);
    setIsDark(nextDark);
    applyColorMode(mode, nextDark);
  };

  const toggleDarkMode = () => {
    if (!mounted) return;
    const nextDark = !isDark;
    setColorMode(nextDark ? 'dark' : 'light');
    window.dispatchEvent(new CustomEvent('globalDarkModeChange', { detail: nextDark }));
  };

  return (
    <ThemeContext.Provider value={{ isDark: mounted && isDark, colorMode: mounted ? colorMode : 'light', setColorMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
