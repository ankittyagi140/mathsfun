'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumb({ items }: { items: { label: string; path: string }[] }) {
  return (
    <nav className="sticky top-16 z-10 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center py-4 space-x-2">
          {items.map((item, index) => (
            <li key={item.path} className="flex items-center">
              {index === 0 ? (
                <Link
                  href={item.path}
                  className="flex items-center text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors"
                >
                  <Home className="h-4 w-4 mr-2" />
                  {item.label}
                </Link>
              ) : (
                <div className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
                  {index === items.length - 1 ? (
                    <span className="text-sm font-medium text-gray-500">
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.path}
                      className="text-sm font-medium text-gray-500 hover:text-blue-700 transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}