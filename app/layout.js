import { Inter } from 'next/font/google';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { FontsProvider } from './contexts/FontsContext';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import ClientLayoutWrapper from './components/ClientLayoutWrapper';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata = {
  title: 'NexAdmin — Admin Dashboard',
  description: 'A modern, full-featured admin dashboard built with Next.js.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body
        className="min-h-screen font-sans antialiased bg-background text-foreground"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <LanguageProvider>
            <FontsProvider>
              <ToastProvider>
                <AuthProvider>
                  <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
                </AuthProvider>
              </ToastProvider>
            </FontsProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
