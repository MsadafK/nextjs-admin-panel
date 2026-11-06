// app/contexts/ThemeContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const themes = {
  emerald: {
    primary: 'emerald',
    name: 'Emerald',
    lightHsl: '142 76% 36%',
    darkHsl: '142 70% 45%',
  },
  blue: {
    primary: 'blue',
    name: 'Blue',
    lightHsl: '221.2 83.2% 53.3%',
    darkHsl: '217.2 91.2% 59.8%',
  },
  purple: {
    primary: 'purple',
    name: 'Purple',
    lightHsl: '262.1 83.3% 57.8%',
    darkHsl: '263.4 70% 50.4%',
  },
  orange: {
    primary: 'orange',
    name: 'Orange',
    lightHsl: '24.6 95% 53.1%',
    darkHsl: '20.5 90.2% 48.2%',
  },
  rose: {
    primary: 'rose',
    name: 'Rose',
    lightHsl: '346.8 77.2% 49.8%',
    darkHsl: '346.8 77.2% 49.8%',
  },
};

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState('emerald');
  const [isDark, setIsDark] = useState(false);
  const [colorMode, setColorModeState] = useState('light');
  const [mounted, setMounted] = useState(false);

  // Apply CSS variables (--primary & --ring) whenever theme or dark mode changes
  const applyThemeVariables = (themeKey, darkState) => {
    if (typeof document === 'undefined') return;
    const themeObj = themes[themeKey] || themes.emerald;
    const hslValue = darkState ? themeObj.darkHsl : themeObj.lightHsl;
    document.documentElement.style.setProperty('--primary', hslValue);
    document.documentElement.style.setProperty('--ring', hslValue);
  };

  useEffect(() => {
    setMounted(true);

    const savedTheme = localStorage.getItem('theme') || 'emerald';
    const validTheme = savedTheme in themes ? savedTheme : 'emerald';
    setCurrentTheme(validTheme);
    if (!(savedTheme in themes)) {
      localStorage.setItem('theme', 'emerald');
    }

    const savedMode = localStorage.getItem('colorMode');
    const initialMode = ['light', 'dark', 'system'].includes(savedMode) ? savedMode : (localStorage.getItem('darkMode') === 'true' ? 'dark' : 'light');
    const savedDark = initialMode === 'system' ? window.matchMedia('(prefers-color-scheme: dark)').matches : initialMode === 'dark';
    setColorModeState(initialMode);
    setIsDark(savedDark);
    if (savedDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    applyThemeVariables(validTheme, savedDark);
  }, []);

  const applyDarkMode = (darkState) => {
    setIsDark(darkState);
    localStorage.setItem('darkMode', String(darkState));
    document.documentElement.classList.toggle('dark', darkState);
    applyThemeVariables(currentTheme, darkState);
  };

  const setColorMode = (mode) => {
    if (!['light', 'dark', 'system'].includes(mode) || !mounted) return;
    setColorModeState(mode);
    localStorage.setItem('colorMode', mode);
    applyDarkMode(mode === 'system' ? window.matchMedia('(prefers-color-scheme: dark)').matches : mode === 'dark');
  };

  useEffect(() => {
    if (!mounted || colorMode !== 'system') return undefined;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const syncSystemMode = (event) => {
      const darkState = event.matches;
      setIsDark(darkState);
      localStorage.setItem('darkMode', String(darkState));
      document.documentElement.classList.toggle('dark', darkState);
      const themeObj = themes[currentTheme] || themes.emerald;
      const hslValue = darkState ? themeObj.darkHsl : themeObj.lightHsl;
      document.documentElement.style.setProperty('--primary', hslValue);
      document.documentElement.style.setProperty('--ring', hslValue);
    };
    media.addEventListener('change', syncSystemMode);
    return () => media.removeEventListener('change', syncSystemMode);
  }, [colorMode, mounted, currentTheme]);

  const changeTheme = (theme) => {
    if (theme in themes && mounted) {
      setCurrentTheme(theme);
      localStorage.setItem('theme', theme);
      applyThemeVariables(theme, isDark);
    }
  };

  const toggleDarkMode = () => {
    if (!mounted) return;
    const newDark = !isDark;
    setColorMode(newDark ? 'dark' : 'light');
    window.dispatchEvent(new CustomEvent('globalDarkModeChange', { detail: newDark }));
  };

  const getThemeColors = () => {
    const primaryColor = themes[currentTheme]?.primary ?? 'emerald';
    return {
      primary: `bg-${primaryColor}-600`,
      primaryHover: `hover:bg-${primaryColor}-700`,
      primaryText: `text-${primaryColor}-600`,
      primaryBg: `bg-${primaryColor}-50`,
      border: isDark ? 'border-zinc-800' : 'border-zinc-200',
    };
  };

  if (!mounted) {
    return (
      <ThemeContext.Provider
        value={{
          currentTheme: 'emerald',
          changeTheme: () => {},
          colorMode: 'light',
          setColorMode: () => {},
          isDark: false,
          toggleDarkMode: () => {},
          getThemeColors: () => ({
            primary: 'bg-emerald-600',
            primaryHover: 'hover:bg-emerald-700',
            primaryText: 'text-emerald-600',
            primaryBg: 'bg-emerald-50',
            border: 'border-zinc-200',
          }),
          themes,
        }}
      >
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        changeTheme,
        colorMode,
        setColorMode,
        isDark,
        toggleDarkMode,
        getThemeColors,
        themes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
