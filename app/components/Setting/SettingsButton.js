'use client';

import { useState } from 'react';
import { Settings } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import SettingsModal from './SettingsModal';

/* Map theme key → Tailwind bg class (safelist mein already hain) */
const THEME_BG = {
  emerald: 'bg-emerald-600 hover:bg-emerald-700',
  blue:    'bg-blue-600    hover:bg-blue-700',
  purple:  'bg-purple-600  hover:bg-purple-700',
  orange:  'bg-orange-600  hover:bg-orange-700',
  rose:    'bg-rose-600    hover:bg-rose-700',
};

export default function SettingsButton({
  sidebarPosition,
  onSidebarPositionChange,
  sidebarDarkMode,
  onSidebarDarkModeToggle,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentTheme, changeTheme, getThemeColors } = useTheme();
  const { language, setLanguage } = useLanguage();

  const colors = getThemeColors();
  const bgClass = THEME_BG[currentTheme] ?? THEME_BG.emerald;

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`
          fixed bottom-6 right-6 z-40
          w-12 h-12 rounded-full
          text-white shadow-modal
          ${bgClass}
          flex items-center justify-center
          transition-all duration-200
          hover:scale-105 hover:shadow-lg
          group
        `}
        aria-label="Open customizer"
      >
        <Settings
          size={20}
          className="transition-transform duration-300 group-hover:rotate-90"
        />
      </button>

      <SettingsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentTheme={currentTheme}
        onThemeChange={changeTheme}
        currentLanguage={language}
        onLanguageChange={setLanguage}
        sidebarDarkMode={sidebarDarkMode}
        onSidebarDarkModeToggle={onSidebarDarkModeToggle}
        sidebarPosition={sidebarPosition}
        onSidebarPositionChange={onSidebarPositionChange}
      />
    </>
  );
}