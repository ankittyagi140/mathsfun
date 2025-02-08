'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  path: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  
  return (
    <nav className="flex items-center space-x-2 mb-6" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <div key={item.path} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="h-5 w-5 mx-2 text-gray-400" />
          )}
          {index === items.length - 1 ? (
            <span className={`font-semibold text-sm `}>
              {item.label}
            </span>
          ) : (
            <Link 
              href={item.path}
              className={`text-sm  hover:text-gray-700`}
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}