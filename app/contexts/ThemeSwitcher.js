'use client';
import { useTheme } from '@/app/contexts/ThemeContext';

export default function ThemeSwitcher() {
  const { isDark, toggleDarkMode, currentTheme, changeTheme, themes } = useTheme();

  return (
    <div className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
      >
        {isDark ? '🌞' : '🌙'}
      </button>
      
      <div className="flex space-x-2">
        {Object.keys(themes).map((themeKey) => (
          <button
            key={themeKey}
            onClick={() => changeTheme(themeKey)}
            className={`w-6 h-6 rounded-full ${
              currentTheme === themeKey ? 'ring-2 ring-offset-2 ring-current' : ''
            }`}
            style={{
              backgroundColor: `var(--color-${themes[themeKey].primary}-500)`
            }}
            title={themes[themeKey].name}
          />
        ))}
      </div>
    </div>
  );
}