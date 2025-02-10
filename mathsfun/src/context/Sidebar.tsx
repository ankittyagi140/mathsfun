'use client';

import { createContext, useContext, useState } from 'react';
import { Home, LayoutDashboard, Settings, Trophy, HelpCircle } from 'lucide-react';

interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
  activeView: 'dashboard' | 'myapps';
  setActiveView: (view: 'dashboard' | 'myapps') => void;
}

export const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', view: 'dashboard' as const, path: '/' },
  { icon: Home, label: 'My Apps', view: 'myapps' as const, path: '/?view=myapps' },
  { icon: Trophy, label: 'Achievements', path: '/achievements' },
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: HelpCircle, label: 'Help & Support', path: '/help' },
];

const SidebarContext = createContext<SidebarContextType>({
  isOpen: true,
  toggle: () => {},
  activeView: 'dashboard',
  setActiveView: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeView, setActiveView] = useState<'dashboard' | 'myapps'>('dashboard');

  const toggle = () => {
    console.log("toggle clicked")
    setIsOpen(!isOpen);
  };


  return (
    <SidebarContext.Provider value={{ isOpen, toggle, activeView, setActiveView }}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);