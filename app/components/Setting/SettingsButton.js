// components/SettingsButton.jsx
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
  onSidebarDarkModeToggle
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentTheme, changeTheme, getThemeColors } = useTheme();
  const { language, setLanguage } = useLanguage();

  const colors = getThemeColors();

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-40 flex items-center justify-center group`}
        style={{
          backgroundColor: `var(--color-${currentTheme}-500)`,
          border: `2px solid var(--color-${currentTheme}-500)`
        }}
        aria-label="Settings"
      >
        <Settings 
          size={24} 
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