'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSidebar } from '../context/Sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard,
  Package,
  Trophy,
  Settings,
  HelpCircle,
} from 'lucide-react';

const links = [
  { href: '/', icon: LayoutDashboard, text: 'Dashboard' },
  { href: '/myapps', icon: Package, text: 'My Apps'},
  { href: '/achievements', icon: Trophy, text: 'Achievements' },
  { href: '/settings', icon: Settings, text: 'Settings' },
  { href: '/help', icon: HelpCircle, text: 'Help & Support' }
];

export default function Sidebar() {
  const { isOpen, toggle } = useSidebar();
  const pathname = usePathname();

  const toggleSidebar = () => {
    toggle();
  };

  return (
    <div className="relative">
      <aside 
        className={`${isOpen ? 'w-64' : 'w-16'} transition-all duration-300 ease-in-out p-2 rounded-lg border position-sticky top-74`}
      >
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 group',
                pathname === link.href 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <Icon className={`h-5 w-5 ${isOpen ? 'ml-1' : 'mx-auto'}`} />
              <span 
                className={`${
                  isOpen 
                    ? 'opacity-100 w-auto ml-2' 
                    : 'opacity-0 w-0 invisible'
                } transition-all duration-200 whitespace-nowrap`}
              >
                {link.text}
              </span>
            </Link>
          );
        })}
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