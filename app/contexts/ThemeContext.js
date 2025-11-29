// contexts/ThemeContext.jsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState('emerald');
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Define your themes here (expand as needed based on your app)
  const themes = {
    emerald: { primary: 'emerald', name: 'Emerald' },
    blue: { primary: 'blue', name: 'Blue' },
    purple: { primary: 'purple', name: 'Purple' },
    orange: { primary: 'orange', name: 'Orange' },
    rose: { primary: 'rose', name: 'Rose' },
    // indigo: { primary: 'indigo', name: 'Indigo' },
    // green: { primary: 'green', name: 'Green' },
    // red: { primary: 'red', name: 'Red' },
  };

  useEffect(() => {
    setMounted(true);
    
    // Only access localStorage after mounting (client-side only)
    const savedTheme = localStorage.getItem('theme') || 'emerald';
    if (savedTheme in themes) {
      setCurrentTheme(savedTheme);
    } else {
      setCurrentTheme('emerald');
      localStorage.setItem('theme', 'emerald');
    }

    // Load GLOBAL dark mode from localStorage
    const savedDark = localStorage.getItem('darkMode') === 'true';
    setIsDark(savedDark);
    if (savedDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const changeTheme = (theme) => {
    if (theme in themes && mounted) {
      setCurrentTheme(theme);
      localStorage.setItem('theme', theme);
    }
  };

  const toggleDarkMode = () => {
    if (!mounted) return;
    
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem('darkMode', newDark.toString());
    if (newDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Dispatch custom event for components to react
    window.dispatchEvent(new CustomEvent('globalDarkModeChange', { detail: newDark }));
  };

  const getThemeColors = () => {
    const primaryColor = themes[currentTheme]?.primary ?? 'emerald';
    return {
      primary: `bg-${primaryColor}-600`,
      primaryHover: `hover:bg-${primaryColor}-700`,
      primaryText: `text-${primaryColor}-600`,
      primaryBg: `bg-${primaryColor}-50`,
      border: isDark ? 'border-gray-700' : 'border-gray-200',
      // Add more color mappings as needed
    };
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <ThemeContext.Provider
        value={{
          currentTheme: 'emerald',
          changeTheme: () => {},
          isDark: false,
          toggleDarkMode: () => {},
          getThemeColors: () => ({
            primary: 'bg-emerald-600',
            primaryHover: 'hover:bg-emerald-700',
            primaryText: 'text-emerald-600',
            primaryBg: 'bg-emerald-50',
            border: 'border-gray-200',
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