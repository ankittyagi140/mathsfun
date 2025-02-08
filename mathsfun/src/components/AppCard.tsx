import Link from 'next/link';
import { useState } from 'react';

interface AppCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

export default function AppCard({ title, description, icon, href }: AppCardProps) {
  return (
    <Link
      href={href}
      className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ease-out border border-gray-100 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative p-6 space-y-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
          {icon}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Link>
  );
} 