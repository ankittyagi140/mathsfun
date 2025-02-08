import Link from 'next/link';
import { useState } from 'react';

interface AppCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  href: string;
}

export default function AppCard({ title, description, icon, href }: AppCardProps) {
  return (
    <Link
      href={href || '#'}
      className="group block w-full max-w-[280px] p-4 bg-white border border-yellow-100 rounded-xl shadow-sm 
        hover:shadow-md hover:border-yellow-200 hover:bg-yellow-50 transition-all duration-200 ease-in-out"
    >
      <div className="flex flex-col items-center text-center space-y-3">
        {/* Icon container */}
        <div className="w-12 h-12 flex items-center justify-center text-yellow-600 
          group-hover:text-yellow-700 group-hover:scale-110 transition-transform duration-200">
          {icon}
        </div>

        {/* Title */}
        <h5 className="text-base font-semibold text-gray-900 group-hover:text-gray-800">
          {title}
        </h5>

        {/* Description */}
        <p className="text-sm text-gray-600 group-hover:text-gray-700 line-clamp-2">
          {description}
        </p>
      </div>
    </Link>
  );
} 