'use client';

import Link from 'next/link';
import { Search, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
  const [userName, setUserName] = useState('');
  const { currentTheme } = useTheme();

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserName(profile.fullName || 'Guest');
    }
  }, []);

  const getInitials = () => {
    return userName.split(' ').map(word => word[0]).join('');
  };

  const handleLogout = () => {
    // Implement logout functionality
    console.log('Logout clicked');
  };

  return (
    <header className="bg-[var(--primary)] shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-2xl font-bold text-white hover:text-blue-100">
            🧮 MathsFun
          </Link>
          <div className="flex items-center gap-8">
           
            <div className="flex items-center gap-4">
              <Link 
                href="/settings" 
                className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-medium text-blue-600 hover:bg-blue-200 transition-colors cursor-pointer"
              >
                {getInitials()}
              </Link>
              { (
                <Link href="/login" className="btn-primary">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;