'use client';
import { useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { currentTheme } = useTheme();

  useEffect(() => {
    document.documentElement.className = currentTheme;
  }, [currentTheme]);

  return <>{children}</>;
} 