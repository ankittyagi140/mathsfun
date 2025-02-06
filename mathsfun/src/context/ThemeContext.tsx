'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Theme {
  id: string;
  name: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  mainBg: string;
  componentBg: string;
  headerBg: string;
}

interface ThemeContextType {
  currentTheme: Theme;
  changeTheme: (themeId: string) => void;
}

export const themes: Theme[] = [
  { 
    id: 'light', 
    name: 'Light', 
    bgColor: 'bg-white',
    textColor: 'text-gray-900',
    borderColor: 'border-gray-200',
    mainBg: 'bg-gray-50',
    componentBg: 'bg-white',
    headerBg: 'bg-white'
  },
  { 
    id: 'green', 
    name: 'Light Green', 
    bgColor: 'bg-green-50',
    textColor: 'text-green-900',
    borderColor: 'border-green-200',
    mainBg: 'bg-green-100',
    componentBg: 'bg-green-50',
    headerBg: 'bg-green-50'
  },
  { 
    id: 'yellow', 
    name: 'Yellow', 
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-900',
    borderColor: 'border-yellow-200',
    mainBg: 'bg-yellow-100',
    componentBg: 'bg-yellow-50',
    headerBg: 'bg-yellow-50'
  },
  { 
    id: 'orange', 
    name: 'Light Orange', 
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-900',
    borderColor: 'border-orange-200',
    mainBg: 'bg-orange-100',
    componentBg: 'bg-orange-50',
    headerBg: 'bg-orange-50'
  }
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState(themes[0]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
      const theme = themes.find(t => t.id === savedTheme);
      if (theme) {
        setCurrentTheme(theme);
      }
    }
  }, []);

  useEffect(() => {
    // Apply theme classes to the root div
    const rootDiv = document.querySelector('body > div');
    if (rootDiv) {
      // Remove existing theme classes
      themes.forEach(theme => {
        rootDiv.classList.remove(
          theme.mainBg,
          theme.componentBg,
          theme.textColor,
          theme.bgColor
        );
      });
      
      // Add new theme classes
      rootDiv.classList.add(currentTheme.mainBg, currentTheme.textColor);
    }

    // Store in localStorage
    localStorage.setItem('selectedTheme', currentTheme.id);
  }, [currentTheme]);

  const changeTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, changeTheme }}>
      <div className={`min-h-screen ${currentTheme.mainBg} transition-colors duration-200`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}