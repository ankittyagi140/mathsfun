'use client';

import Link from 'next/link';
import { Search, User } from 'lucide-react';
import { useEffect, useState } from 'react';

const Header = () => {
  const [userName, setUserName] = useState('');
  const [kidIcon] = useState(() => 
    ['👦', '👧', '🧒', '👦🏽', '👧🏾'][Math.floor(Math.random() * 5)]
  );

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserName(profile.fullName || 'Guest');
    }
  }, []);

  const getInitials = () => {
    // return userName.split(' ').map(word => word[0]).join('').toUpperCase();
    return `Welcome ${userName}`;
  };

  const handleLogout = () => {
    // Implement logout functionality
    console.log('Logout clicked');
  };

  return (
    <header className="bg-yellow-500 shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center">
            <img 
              src="/maths4fun.png"
              alt="maths4fun Logo"
              className="h-12 w-auto"
            />
            <span className="text-2xl font-bold pl-2 text-gray-800">Maths4Fun</span>
          </Link>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-full bg-white flex items-center hover:bg-yellow-100 cursor-pointer justify-center text-xl">
                {kidIcon}
              </div>
              <span className="text-gray-800 text-sm font-medium">{getInitials()}</span>
              { (
                <Link 
                  href="/login" 
                  className="bg-white text-gray-800 px-4 py-2 rounded-md hover:bg-yellow-100 hover:text-gray-900"
                >
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