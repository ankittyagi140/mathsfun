'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSidebar, sidebarItems } from '../context/Sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const { isOpen, toggle, activeView, setActiveView } = useSidebar();
  const pathname = usePathname();

  return (
    <div className="relative">
      <aside 
        className={`${isOpen ? 'w-64' : 'w-16'} transition-all duration-300 ease-in-out space-y-1 p-2 rounded-lg border `}
        
      >
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
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 
               
              }`}
            >
              <Icon className={`h-5 w-5 transition-colors duration-200 `} />
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
        className={`absolute -right-3 top-2 p-1.5 rounded-full border shadow-sm hover: transition-all duration-200`}
        aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        {isOpen ? (
          <ChevronLeft className={`h-4 w-4 `} />
        ) : (
          <ChevronRight className={`h-4 w-4 `} />
        )}
      </button>
    </div>
  );
}