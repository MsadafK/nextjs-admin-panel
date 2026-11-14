'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar/Sidebar';
import Navbar from './Navbar';
import SettingsButton from './Setting/SettingsButton';

export default function ClientLayoutWrapper({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, authReady, resumeDemo } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [position, setPosition] = useState('left');
  const [contentWidth, setContentWidth] = useState('fluid');
  const [radiusMode, setRadiusMode] = useState('default');
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [sidebarDarkMode, setSidebarDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { currentTheme, customColors, isDark, colorMode, setColorMode, toggleDarkMode } = useTheme();
  const isAuthRoute = ['/login', '/signup', '/forgot-password'].includes(pathname);

  useEffect(() => {
    if (authReady && !isAuthRoute && !currentUser) router.replace('/login');
  }, [authReady, currentUser, isAuthRoute, router]);

  useEffect(() => {
    if (currentTheme === 'custom' && customColors) document.documentElement.style.setProperty('--color-primary-500', customColors.primary);
  }, [currentTheme, customColors]);

  useEffect(() => {
    const savedPosition = localStorage.getItem('sidebarPosition');
    setPosition(savedPosition === 'right' ? 'right' : 'left');
    setSidebarDarkMode(localStorage.getItem('sidebarDarkMode') === 'true');
    setIsCollapsed(localStorage.getItem('sidebarCollapsed') === 'true');
    setContentWidth(localStorage.getItem('contentWidth') === 'boxed' ? 'boxed' : 'fluid');
    setRadiusMode(['sharp', 'default', 'rounded'].includes(localStorage.getItem('uiRadius')) ? localStorage.getItem('uiRadius') : 'default');
    setPreferencesLoaded(true);
  }, []);

  useEffect(() => {
    if (!preferencesLoaded) return;
    localStorage.setItem('sidebarCollapsed', String(isCollapsed));
    localStorage.setItem('contentWidth', contentWidth);
    localStorage.setItem('uiRadius', radiusMode);
    const radius = { sharp: '0rem', default: '0.5rem', rounded: '0.75rem' }[radiusMode] || '0.5rem';
    document.documentElement.style.setProperty('--radius', radius);
  }, [preferencesLoaded, isCollapsed, contentWidth, radiusMode]);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1023px)');
    const update = () => {
      const mobile = media.matches;
      setIsMobile(mobile);
      if (!mobile) setIsMobileMenuOpen(false);
    };
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);
  const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen((open) => !open), []);
  const toggleSidebarDarkMode = () => {
    setSidebarDarkMode((current) => {
      localStorage.setItem('sidebarDarkMode', String(!current));
      return !current;
    });
  };
  const handlePositionChange = useCallback((nextPosition) => {
    const normalizedPosition = nextPosition === 'right' ? 'right' : 'left';
    setPosition(normalizedPosition);
    localStorage.setItem('sidebarPosition', normalizedPosition);
  }, []);
  const handleSidebarCollapsedChange = useCallback((nextCollapsed) => setIsCollapsed(Boolean(nextCollapsed)), []);
  const handleContentWidthChange = useCallback((nextWidth) => setContentWidth(nextWidth === 'boxed' ? 'boxed' : 'fluid'), []);
  const handleRadiusModeChange = useCallback((nextRadius) => setRadiusMode(['sharp', 'default', 'rounded'].includes(nextRadius) ? nextRadius : 'default'), []);

  const collapsed = !isMobile && isCollapsed;
  const finalSidebarDark = isDark || sidebarDarkMode;
  const contentOffset = !isMobile ? (position === 'right' ? (collapsed ? 'mr-16' : 'mr-64') : (collapsed ? 'ml-16' : 'ml-64')) : '';

  if (isAuthRoute) return <div className="flex min-h-dvh flex-col bg-background text-foreground">
    <header className="absolute right-0 top-0 z-20 flex items-center gap-2 p-3 sm:p-5">
      <button type="button" onClick={toggleDarkMode} className="h-9 rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground hover:bg-muted">{isDark ? 'Switch to Light' : 'Switch to Dark'}</button>
      <button type="button" onClick={resumeDemo} className="h-9 rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground hover:bg-muted">Back to Live Demo →</button>
    </header>
    {children}
  </div>;
  if (authReady && !currentUser) return null;

  return <div className="min-h-screen bg-background text-foreground">
    <Sidebar
      isCollapsed={collapsed}
      onToggle={() => setIsCollapsed((current) => !current)}
      position={position}
      isDarkMode={finalSidebarDark}
      isMobile={isMobile}
      isMobileOpen={isMobileMenuOpen}
      onMobileClose={closeMobileMenu}
    />
    <div className={`flex min-h-screen flex-col transition-[margin] duration-200 ${contentOffset}`}>
      <Navbar onMenuClick={toggleMobileMenu} sidebarPosition={position} sidebarDarkMode={finalSidebarDark}/>
      <main className="flex-1 bg-muted/30 dark:bg-background"><div className={contentWidth === 'boxed' ? 'mx-auto w-full max-w-[1440px]' : 'w-full'}>{children}</div></main>
    </div>
    <SettingsButton
      sidebarPosition={position}
      onSidebarPositionChange={handlePositionChange}
      sidebarDarkMode={sidebarDarkMode}
      onSidebarDarkModeToggle={toggleSidebarDarkMode}
      sidebarCollapsed={isCollapsed}
      onSidebarCollapsedChange={handleSidebarCollapsedChange}
      contentWidth={contentWidth}
      onContentWidthChange={handleContentWidthChange}
      radiusMode={radiusMode}
      onRadiusModeChange={handleRadiusModeChange}
      colorMode={colorMode}
      onColorModeChange={setColorMode}
    />
  </div>;
}
