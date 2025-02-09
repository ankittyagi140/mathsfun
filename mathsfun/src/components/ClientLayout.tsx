'use client';
import { useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { currentTheme } = useTheme();

  useEffect(() => {
    document.documentElement.className = `${currentTheme.mainBg} ${currentTheme.textColor}`;
    document.body.className = `${currentTheme.mainBg} ${currentTheme.textColor}`;
  }, [currentTheme]);

  return (
    <html lang="en" className={`${currentTheme.mainBg} ${currentTheme.textColor}`}>
      <body className="min-h-screen p-8 bg-white">
        {children}
      </body>
    </html>
  );
} 