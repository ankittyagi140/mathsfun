'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Lilita_One } from 'next/font/google';
import { Permanent_Marker } from 'next/font/google';
import { Bubblegum_Sans } from 'next/font/google';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { firebaseApp } from '@/lib/firebase';
import Snack from './Snack';
import Loader from './Loader';
import { useRouter } from 'next/navigation';

const headingFont = Lilita_One({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const marker = Permanent_Marker({ subsets: ['latin'], weight: '400' });

const bubblegum = Bubblegum_Sans({ subsets: ['latin'], weight: '400' });

const Header = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const [userName, setUserName] = useState('');
  const [kidIcon, setKidIcon] = useState('👦'); // Default emoji for SSR
  const kidEmojis = ['👦', '👧', '🧒', '👦🏽', '👧🏾'];
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [snack, setSnack] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const auth = getAuth(firebaseApp);
  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    // This will only run on client side after hydration
    setKidIcon(kidEmojis[Math.floor(Math.random() * kidEmojis.length)]);
  }, []);

  const getInitials = () => {
    const user = auth.currentUser;
    return user?.email?.split('@').map(n => n[0]).join('').toUpperCase() || 'Guest';
  };
  const handleLogin = () => {
    router.push('/login');
  };
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut(auth);
      setSnack({ message: 'Logged out successfully!', type: 'success' });
      setTimeout(() => window.location.href = '/', 1500); // Delay redirect for snack visibility

    } catch (error) {
      console.error('Logout failed:', error);
      setSnack({ message: 'Logout failed. Please try again.', type: 'error' });
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!hasMounted) {
    // Server-side render fallback
    return (
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
              Maths 2 Fun
            </Link>
            <div className="flex items-center gap-8">
              <Link href="/puzzles" className="text-gray-700 hover:text-blue-600 transition-colors">
                Games
              </Link>
            </div>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className="bg-yellow-500 shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center">
            <img 
              src="/maths2fun.png"
              alt="maths2fun Logo"
              className="h-12 w-auto"
            />
            <span className={`text-2xl font-bold pl-2 text-gray-800 ${bubblegum.className}`}>
              Maths2Fun
            </span>
          </Link>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">

              <div className="w-9 h-9 rounded-full bg-white flex items-center hover:bg-green-600 cursor-pointer justify-center text-xl">
                {kidIcon}
              </div>
              <span className="text-gray-800 text-sm font-medium">Welcome {getInitials()}</span>



              {isLoggedIn ? (
                <button 
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors flex items-center gap-2"
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? (
                    <>
                      <Loader className="animate-spin h-20 w-20"  />
                      Logging Out...
                    </>
                  ) : (
                    'Logout'
                  )}
                </button>
              ) : (
                <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors flex items-center gap-2">
                  Login
                </button>
              )}

            </div>
          </div>
        </div>
      </nav>

      {snack && (
        <Snack
          message={snack.message}
          type={snack.type}
          onClose={() => setSnack(null)}
        />
      )}
    </header>
  );
};

export default Header;