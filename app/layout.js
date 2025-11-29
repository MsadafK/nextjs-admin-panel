'use client';
import { useEffect, useState, useRef } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { FontsProvider } from './contexts/FontsContext';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar';
import SettingsButton from './components/Setting/SettingsButton';
import './globals.css';

function ThemeWrapper({ children }) {
  const { currentTheme, customColors } = useTheme();
  
  useEffect(() => {
    if (typeof window !== 'undefined' && currentTheme === 'custom') {
      document.documentElement.style.setProperty('--color-primary-500', customColors.primary);
    }
  }, [currentTheme, customColors]);

  return children;
}

function LayoutContent({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [position, setPosition] = useState('left');
  const [sidebarDarkMode, setSidebarDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const positionMenuButtonRef = useRef(null);
  const { currentTheme, isDark } = useTheme();

  useEffect(() => {
    // ✅ Add typeof window check
    if (typeof window !== 'undefined') {
      const savedPosition = localStorage.getItem('sidebarPosition');
      if (savedPosition) {
        setPosition(savedPosition);
      }
      
      const savedSidebarDark = localStorage.getItem('sidebarDarkMode') === 'true';
      setSidebarDarkMode(savedSidebarDark);
    }
  }, []);

  useEffect(() => {
    // ✅ Add typeof window check
    if (typeof window === 'undefined') return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebarDarkMode = () => {
    const newValue = !sidebarDarkMode;
    setSidebarDarkMode(newValue);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarDarkMode', newValue.toString());
    }
  };

  const handlePositionChange = (newPosition) => {
    setPosition(newPosition);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarPosition', newPosition);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const finalSidebarDark = isDark || sidebarDarkMode;

  return (
    <div className={`flex min-h-screen ${position === 'top' || position === 'bottom' ? 'flex-col' : ''}`}>
      {/* Hamburger Menu Button - Mobile Only */}
      {isMobile && !isMobileMenuOpen && (
        <button
          onClick={toggleMobileMenu}
          className="fixed top-4 left-4 z-[60] rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 text-gray-900 dark:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      )}

      {/* Overlay for mobile menu */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar - Hidden on mobile by default, shown when menu is open */}
      {position === 'top' && (
        <div className={`fixed top-0 left-0 right-0 z-50 ${isMobile && !isMobileMenuOpen ? 'hidden' : ''}`}>
          <Sidebar
            isCollapsed={isMobile ? false : isCollapsed}
            onToggle={() => setIsCollapsed(!isCollapsed)}
            position={position}
            onPositionChange={handlePositionChange}
            isDarkMode={finalSidebarDark}
          />
        </div>
      )}
      
      {position !== 'top' && position !== 'bottom' && (
        <div className={`${isMobile ? 'fixed z-50' : ''} ${isMobile && !isMobileMenuOpen ? 'hidden' : ''}`}>
          <Sidebar
            isCollapsed={isMobile ? false : isCollapsed}
            onToggle={() => setIsCollapsed(!isCollapsed)}
            position={position}
            onPositionChange={handlePositionChange}
            isDarkMode={finalSidebarDark}
          />
        </div>
      )}
      
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          !isMobile && position === 'left' ? (isCollapsed ? 'ml-16' : 'ml-64') :
          !isMobile && position === 'right' ? (isCollapsed ? 'mr-16' : 'mr-64') :
          !isMobile && position === 'top' ? 'mt-16' :
          !isMobile && position === 'bottom' ? 'mb-16' : ''
        }`}
      >
        <Navbar sidebarDarkMode={finalSidebarDark} />
        <main className="flex-1 bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>

      {position === 'bottom' && (
        <div className={`${isMobile && !isMobileMenuOpen ? 'hidden' : ''}`}>
          <Sidebar
            isCollapsed={isMobile ? false : isCollapsed}
            onToggle={() => setIsCollapsed(!isCollapsed)}
            position={position}
            onPositionChange={handlePositionChange}
            isDarkMode={finalSidebarDark}
          />
        </div>
      )}

      <SettingsButton
        sidebarPosition={position}
        onSidebarPositionChange={handlePositionChange}
        sidebarDarkMode={sidebarDarkMode}
        onSidebarDarkModeToggle={toggleSidebarDarkMode}
      />
    </div>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white" suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            <FontsProvider>
              <ThemeWrapper>
                <LayoutContent>
                  {children}
                </LayoutContent>
              </ThemeWrapper>
            </FontsProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}