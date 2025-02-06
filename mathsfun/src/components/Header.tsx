'use client';

import Link from 'next/link';
import { Search, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface UserProfile {
  fullName: string;
  email: string;
  bio: string;
}

const Header = () => {
  const [userName, setUserName] = useState('');
  const { currentTheme } = useTheme();

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const profile: UserProfile = JSON.parse(savedProfile);
      setUserName(profile.fullName || 'Guest');
    }
  }, []);

  return (
    <header className={`${currentTheme.headerBg} border-b ${currentTheme.borderColor} transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <span className={`font-semibold ${currentTheme.textColor}`}>MathFun</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search your apps"
                className={`w-full pl-10 pr-4 py-2 rounded-md border ${currentTheme.borderColor} ${currentTheme.componentBg} ${currentTheme.textColor} focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-4">
            <span className={`text-sm ${currentTheme.textColor}`}>{userName}</span>
            <Link href="/settings">
              <button className={`flex items-center gap-2 text-sm ${currentTheme.textColor}`}>
                <User className="h-5 w-5" />
                <span className="hidden sm:inline">Profile</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;