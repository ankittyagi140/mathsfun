'use client';

import { ChevronRight } from 'lucide-react';
import { useTheme } from "../context/ThemeContext";
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  path: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const { currentTheme } = useTheme();
  
  return (
    <nav className="flex items-center space-x-2 mb-6" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <ChevronRight className={`h-4 w-4 mx-2 ${currentTheme.textColor} opacity-50`} />
          )}
          {index === items.length - 1 ? (
            <span className={`${currentTheme.textColor} font-semibold text-sm`}>
              {item.label}
            </span>
          ) : (
            <Link 
              href={item.path}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}