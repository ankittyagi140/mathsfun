'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSidebar, sidebarItems } from '../context/Sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const { currentTheme } = useTheme();
  const { isOpen, toggle, activeView, setActiveView } = useSidebar();
  const pathname = usePathname();

  return (
    <div className="relative">
      <aside className={`${isOpen ? 'w-64' : 'w-16'} transition-all duration-300 ease-in-out space-y-1 p-2 rounded-lg ${currentTheme.componentBg} border ${currentTheme.borderColor}`}>
        {sidebarItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = 
            (item.view === 'dashboard' && activeView === 'dashboard') ||
            (item.view === 'myapps' && activeView === 'myapps') ||
            (!item.view && pathname === item.path);
          
          return (
            <Link
              key={index}
              href={item.path}
              onClick={() => {
                if (item.view) {
                  setActiveView(item.view);
                }
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
                isActive
                  ? `${currentTheme.activeBg || 'bg-blue-500'} ${currentTheme.activeText || 'text-white'}`
                  : `${currentTheme.buttonBg || currentTheme.componentBg} ${currentTheme.textColor} hover:bg-opacity-80`
              }`}
            >
              <Icon className={`h-5 w-5 transition-colors duration-200 ${isActive ? currentTheme.activeText || 'text-white' : currentTheme.textColor}`} />
              {isOpen && (
                <span className="transition-colors duration-200">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </aside>
      <button
        onClick={toggle}
        className={`absolute -right-3 top-2 p-1.5 rounded-full ${currentTheme.componentBg} ${currentTheme.borderColor} border shadow-sm hover:${currentTheme.hoverBg || 'hover:bg-opacity-80'} transition-all duration-200`}
        aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        {isOpen ? (
          <ChevronLeft className={`h-4 w-4 ${currentTheme.textColor}`} />
        ) : (
          <ChevronRight className={`h-4 w-4 ${currentTheme.textColor}`} />
        )}
      </button>
    </div>
  );
}