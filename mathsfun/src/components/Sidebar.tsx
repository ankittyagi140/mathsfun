'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSidebar, sidebarItems } from '../context/Sidebar';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

const links = [
  { href: '/', icon: 'dashboard', text: 'Dashboard' },
  { href: '/myapps', icon: 'myapps', text: 'My Apps', checkQuery: true },
  { href: '/achievements', icon: 'achievements', text: 'Achievements' },
  { href: '/settings', icon: 'settings', text: 'Settings' },
  { href: '/help', icon: 'help', text: 'Help & Support' }
];

export default function Sidebar() {
  const { isOpen, toggle, activeView, setActiveView } = useSidebar();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const checkActive = (href: string, checkQuery = false) => {
    if (checkQuery) {
      return href === `${pathname}?${searchParams.toString()}`;
    }
    return pathname === href;
  };

  const toggleSidebar = () => {
    toggle();
  };

  return (
    <div className="relative">
      <aside 
        className={`${isOpen ? 'w-64' : 'w-16'} transition-all duration-300 ease-in-out space-y-1 p-2 rounded-lg border `}
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200',
              checkActive(link.href, link.checkQuery) 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'text-gray-700 hover:bg-gray-100'
            )}
          >
            {/* Icon components here */}
            <span>{link.text}</span>
          </Link>
        ))}
      </aside>
      <button
        onClick={toggleSidebar}
        className={`absolute -right-3 top-4 z-10 p-1.5 rounded-full border bg-white shadow-md hover:bg-gray-50 transition-all`}
        aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        {isOpen ? (
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-600" />
        )}
      </button>
    </div>
  );
}