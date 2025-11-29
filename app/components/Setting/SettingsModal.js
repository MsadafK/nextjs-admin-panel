// components/SettingsModal.jsx
'use client';

import { X, Palette, Layout, Sidebar, Navigation, Globe, Monitor, Sun, Moon, Type } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useFonts } from '../../contexts/FontsContext';
import React from 'react';

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
  onSidebarPositionChange
}) {
  const { themes, getThemeColors } = useTheme();
  const { t } = useLanguage() || {};
  const { currentFont, changeFont, fonts } = useFonts();

  const colors = getThemeColors();
  const themeOptions = themes || {};

  // Disable body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
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
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-end p-0">
      <div className={`${sidebarDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-none shadow-2xl w-full max-w-sm h-full overflow-hidden flex flex-col`}>
        {/* Header */}
        <div className={`p-3 border-b ${sidebarDarkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between flex-shrink-0`}>
          <div>
            <h2 className={`text-md font-bold ${sidebarDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {t ? t('customizer') : 'Customizer'}
            </h2>
            <p className={`text-sm ${sidebarDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
              {t ? t('customizeOverview') : 'Customize your dashboard'}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${sidebarDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-8 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {/* Theme Colors */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Palette className={`w-5 h-5 ${colors.primaryText}`} />
              <h3 className={`font-semibold ${sidebarDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {t ? t('themeColors') : 'Theme Colors'}
              </h3>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(themeOptions).map(([key, theme]) => {
                const bgColor = `var(--color-${theme.primary}-500)`;

                return (
                  <button
                    key={key}
                    onClick={() => {
                      onThemeChange(key);
                    }}
                    className={`
                      relative w-10 h-10 rounded-full flex items-center justify-center 
                      font-bold text-sm transition-all duration-200
                      ${currentTheme === key ? 'ring-2 scale-110' : 'hover:scale-105'}
                    `}
                    style={{
                      backgroundColor: bgColor,
                      color: 'white',
                      textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                      '--tw-ring-color': bgColor,
                      '--tw-ring-offset-shadow': `var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)`,
                      '--tw-ring-shadow': `var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color)`,
                      '--tw-ring-offset-width': '2px',
                      '--tw-ring-offset-color': sidebarDarkMode ? '#111827' : '#fff',
                      boxShadow: `var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)`,
                    }}
                    title={theme.name}
                  >
                    {key.charAt(0).toUpperCase()}
                    {currentTheme === key && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/20 rounded-full"></div>
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Font Selector */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Type className={`w-5 h-5 ${colors.primaryText}`} />
              <h3 className={`font-semibold ${sidebarDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Font Family
              </h3>
            </div>
            <select
              value={currentFont}
              onChange={(e) => changeFont(e.target.value)}
              className={`w-full p-3 rounded-lg border transition-colors ${
                sidebarDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' 
                  : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50'
              } focus:outline-none focus:ring-2`}
              style={{
                '--tw-ring-color': `var(--color-${currentTheme}-500)`,
                fontFamily: fonts[currentFont]?.value
              }}
            >
              {Object.entries(fonts).map(([key, font]) => (
                <option key={key} value={key} style={{ fontFamily: font.value }}>
                  {font.name}
                </option>
              ))}
            </select>
            <p className={`text-xs mt-2 ${sidebarDarkMode ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontFamily: fonts[currentFont]?.value }}>
              Preview: The quick brown fox jumps over the lazy dog
            </p>
          </div>

          {/* Dark Mode Toggle - Only for Sidebar & Modal */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Monitor className={`w-5 h-5 ${colors.primaryText}`} />
              <h3 className={`font-semibold ${sidebarDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {t ? t('sidebarAppearance') : 'Sidebar & Modal Appearance'}
              </h3>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-opacity-50" style={{ backgroundColor: sidebarDarkMode ? 'rgba(31, 41, 55, 0.5)' : 'rgba(243, 244, 246, 0.5)' }}>
              <div className="flex items-center space-x-3">
                {sidebarDarkMode ? (
                  <Moon className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-500" />
                )}
                <div>
                  <span className={`block ${sidebarDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    {sidebarDarkMode ? (t ? t('darkMode') : 'Dark Mode') : (t ? t('lightMode') : 'Light Mode')}
                  </span>
                  <span className={`text-xs ${sidebarDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    For Sidebar, Navbar & Settings
                  </span>
                </div>
              </div>
              <button
                onClick={onSidebarDarkModeToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${sidebarDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}
              >
                <span
                  className={`${sidebarDarkMode ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </button>
            </div>
          </div>

          {/* Sidebar Position */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Sidebar className={`w-5 h-5 ${colors.primaryText}`} />
              <h3 className={`font-semibold ${sidebarDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {t ? t('sidebarPosition') : 'Sidebar Position'}
              </h3>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <button
                onClick={() => {
                  onSidebarPositionChange('left');
                }}
                className={`flex items-center justify-center p-3 rounded-lg border transition-colors ${sidebarPosition === 'left'
                  ? `ring-2 ring-offset-2 ${sidebarDarkMode ? 'ring-offset-gray-900' : 'ring-offset-white'} border-transparent`
                  : `${sidebarDarkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'}`
                  }`}
                style={sidebarPosition === 'left' ? {
                  '--tw-ring-color': `var(--color-${currentTheme}-500)`,
                  borderColor: `var(--color-${currentTheme}-500)`
                } : {}}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex">
                    <div 
                      className="w-6 h-6 rounded-l"
                      style={{ backgroundColor: `var(--color-${currentTheme}-500)` }}
                    />
                    <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-r" />
                  </div>
                  <span className={`text-sm ${sidebarPosition === 'left' ? `${colors.primaryText}` : sidebarDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t ? t('left') : 'Left'}
                  </span>
                </div>
              </button>
              
              <button
                onClick={() => {
                  onSidebarPositionChange('right');
                }}
                className={`flex items-center justify-center p-3 rounded-lg border transition-colors ${sidebarPosition === 'right'
                  ? `ring-2 ring-offset-2 ${sidebarDarkMode ? 'ring-offset-gray-900' : 'ring-offset-white'} border-transparent`
                  : `${sidebarDarkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'}`
                  }`}
                style={sidebarPosition === 'right' ? {
                  '--tw-ring-color': `var(--color-${currentTheme}-500)`,
                  borderColor: `var(--color-${currentTheme}-500)`
                } : {}}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex">
                    <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-l" />
                    <div 
                      className="w-6 h-6 rounded-r"
                      style={{ backgroundColor: `var(--color-${currentTheme}-500)` }}
                    />
                  </div>
                  <span className={`text-sm ${sidebarPosition === 'right' ? `${colors.primaryText}` : sidebarDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t ? t('right') : 'Right'}
                  </span>
                </div>
              </button>

              <button
                onClick={() => {
                  onSidebarPositionChange('top');
                }}
                className={`flex items-center justify-center p-3 rounded-lg border transition-colors ${sidebarPosition === 'top'
                  ? `ring-2 ring-offset-2 ${sidebarDarkMode ? 'ring-offset-gray-900' : 'ring-offset-white'} border-transparent`
                  : `${sidebarDarkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'}`
                  }`}
                style={sidebarPosition === 'top' ? {
                  '--tw-ring-color': `var(--color-${currentTheme}-500)`,
                  borderColor: `var(--color-${currentTheme}-500)`
                } : {}}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex flex-col">
                    <div 
                      className="w-6 h-6 rounded-t"
                      style={{ backgroundColor: `var(--color-${currentTheme}-500)` }}
                    />
                    <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-b" />
                  </div>
                  <span className={`text-sm ${sidebarPosition === 'top' ? `${colors.primaryText}` : sidebarDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t ? t('top') : 'Top'}
                  </span>
                </div>
              </button>

              <button
                onClick={() => {
                  onSidebarPositionChange('bottom');
                }}
                className={`flex items-center justify-center p-3 rounded-lg border transition-colors ${sidebarPosition === 'bottom'
                  ? `ring-2 ring-offset-2 ${sidebarDarkMode ? 'ring-offset-gray-900' : 'ring-offset-white'} border-transparent`
                  : `${sidebarDarkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'}`
                  }`}
                style={sidebarPosition === 'bottom' ? {
                  '--tw-ring-color': `var(--color-${currentTheme}-500)`,
                  borderColor: `var(--color-${currentTheme}-500)`
                } : {}}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex flex-col w-full">
                    <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-t" />
                    <div 
                      className="w-6 h-6 rounded-b"
                      style={{ backgroundColor: `var(--color-${currentTheme}-500)` }}
                    />
                  </div>
                  <span className={`text-xs ${sidebarPosition === 'bottom' ? `${colors.primaryText}` : sidebarDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t ? t('bottom') : 'Bottom'}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Language Selector */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Globe className={`w-5 h-5 ${colors.primaryText}`} />
              <h3 className={`font-semibold ${sidebarDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {t ? t('language') : 'Language'}
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onLanguageChange(lang.code);
                  }}
                  className={`flex items-center justify-center p-3 rounded-lg border transition-colors ${
                    currentLanguage === lang.code
                      ? `${colors.primary} text-white border-transparent`
                      : sidebarDarkMode
                      ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${sidebarDarkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-end flex-shrink-0`}>
          <button
            onClick={handleReset}
            className={`px-4 py-2 rounded-lg ${sidebarDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
            {t ? t('resetToDefaults') : 'Reset to Defaults'}
          </button>
        </div>
      </div>
    </div>
  );
}