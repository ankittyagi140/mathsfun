'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Theme {
  id: string;
  name: string;
  mainBg: string;
  componentBg: string;
  textColor: string;
  borderColor: string;
  buttonBg: string;
  activeBg: string;
  activeText: string;
  hoverBg: string;
}

export const themes: Theme[] = [
  {
    id: 'yellow',
    name: 'Yellow',
    mainBg: 'bg-yellow-50',
    componentBg: 'bg-white',
    textColor: 'text-yellow-900',
    borderColor: 'border-yellow-200',
    buttonBg: 'bg-yellow-500',
    activeBg: 'bg-yellow-600',
    activeText: 'text-white',
    hoverBg: 'hover:bg-yellow-400'
  },
  {
    id: 'green',
    name: 'Green',
    mainBg: 'bg-green-50',
    componentBg: 'bg-white',
    textColor: 'text-green-900',
    borderColor: 'border-green-200',
    buttonBg: 'bg-green-500',
    activeBg: 'bg-green-600',
    activeText: 'text-white',
    hoverBg: 'hover:bg-green-400'
  },
  {
    id: 'orange',
    name: 'Orange',
    mainBg: 'bg-orange-50',
    componentBg: 'bg-white',
    textColor: 'text-orange-900',
    borderColor: 'border-orange-200',
    buttonBg: 'bg-orange-500',
    activeBg: 'bg-orange-600',
    activeText: 'text-white',
    hoverBg: 'hover:bg-orange-400'
  },
  {
    id: 'lightBlue',
    name: 'Light Blue',
    mainBg: 'bg-sky-50',
    componentBg: 'bg-white',
    textColor: 'text-sky-900',
    borderColor: 'border-sky-200',
    buttonBg: 'bg-sky-500',
    activeBg: 'bg-sky-600',
    activeText: 'text-white',
    hoverBg: 'hover:bg-sky-400'
  }
];

interface ThemeContextType {
  currentTheme: Theme;
  changeTheme: (themeId: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: themes[0],
  changeTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      const theme = themes.find(t => t.id === savedTheme);
      if (theme) setCurrentTheme(theme);
    }
  }, []);

  useEffect(() => {
    // Remove all theme classes
    themes.forEach(theme => {
      document.documentElement.classList.remove(
        theme.mainBg,
        theme.componentBg,
        theme.textColor,
        theme.borderColor,
        theme.buttonBg,
        theme.activeBg,
        theme.activeText,
        theme.hoverBg
      );
    });
    
    // Add current theme classes
    document.documentElement.classList.add(currentTheme.mainBg);
  }, [currentTheme]);

  const changeTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      localStorage.setItem('theme', themeId);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);