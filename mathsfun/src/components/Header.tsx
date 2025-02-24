'use client';

import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { Bubblegum_Sans } from 'next/font/google';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/firebase-config'
import Snack from './Snack';
import Loader from './Loader';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store/store';
import { checkAuthStatus, signOutUser } from '@/redux/slices/authSlice';
import Image from 'next/image';
import SubHeader from './SubHeader';


const bubblegum = Bubblegum_Sans({ subsets: ['latin'], weight: '400' });

const Header = () => {

  const [kidIcon, setKidIcon] = useState('👦'); // Default emoji for SSR
  const kidEmojis = useMemo(() => ['👦', '👧', '🧒', '🏽', '👧🏾'], []);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [snack, setSnack] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // This will only run on client side after hydration
    setKidIcon(kidEmojis[Math.floor(Math.random() * kidEmojis.length)]);
  }, [kidEmojis]);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  // useEffect(() => {
  //   console.log('Auth State:', { 
  //     user: user?.email, 
  //     isAuthenticated, 
  //     loading 
  //   });
  // }, [user, isAuthenticated, loading]);

  const getInitials = () => {
    if (typeof window === 'undefined') return 'Guest';
    const user = auth?.currentUser;
    return user?.email?.slice(0, 2).toUpperCase() || 'Guest';
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
      dispatch(signOutUser());
    } catch (error) {
      console.error('Logout failed:', error);
      setSnack({ message: 'Logout failed. Please try again.', type: 'error' });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleProfileSettings=()=>{
    router.push('/settings')
  }

  return (
    <header className="bg-yellow-500/50 shadow-sm sticky top-0 z-50 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center">
            <Image 
              src="/maths2fun.png"
              alt="maths2fun Logo"
              width={80}
              height={80}
              priority
              className="w-16 h-12 md:w-18 md:h-14"
            />
            <span className={`text-xl md:text-2xl font-bold text-gray-800 ${bubblegum.className}`}>
              Maths2Fun
            </span>
          </Link>
          
          <div className="hidden custom:flex ">
            <SubHeader/>
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white flex items-center hover:bg-green-600 cursor-pointer justify-center text-xl" 
                   onClick={handleProfileSettings}>
                {kidIcon}
              </div>
              
              <span className="hidden sm:block text-gray-800 text-sm font-medium">
                Welcome {getInitials()}
              </span>

              {isLoggedIn ? (
                <button 
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded hover:bg-red-700 transition-colors flex items-center gap-2 text-sm md:text-base"
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? (
                    <>
                      <Loader className="animate-spin h-4 w-4 md:h-5 md:w-5" />
                      <span className="hidden sm:inline">Logging Out...</span>
                    </>
                  ) : (
                    <>
                      <span className="sm:inline">Logout</span>
                    </>
                  )}
                </button>
              ) : (
                <button onClick={handleLogin} 
                        className="bg-blue-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded hover:bg-green-600 transition-colors flex items-center gap-2 text-sm md:text-base">
                  <span className="sm:inline">Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="custom:hidden p-2 bg-yellow-500/50 shadow-sm sticky z-50 backdrop-blur-md">
        <SubHeader/>
      </div>

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