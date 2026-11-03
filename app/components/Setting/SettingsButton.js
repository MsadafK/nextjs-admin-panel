'use client';

import { useState } from 'react';
import { Settings } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import SettingsModal from './SettingsModal';

export default function SettingsButton({
  sidebarPosition,
  onSidebarPositionChange,
  sidebarDarkMode,
  onSidebarDarkModeToggle,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentTheme, changeTheme } = useTheme();
  const { language, setLanguage } = useLanguage();


  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`
          fixed bottom-6 right-6 z-40
          w-12 h-12 rounded-full
          border border-border bg-foreground text-background shadow-modal hover:opacity-90
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
