'use client';
import { useState } from 'react';
import { auth } from '@/firebase/firebase-config';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, setPersistence, browserSessionPersistence } from 'firebase/auth';
import Link from 'next/link';
import Loader from '@/components/Loader';
import Snack from '@/components/Snack';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snack, setSnack] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSnack(null);

    try {
      await setPersistence(auth, browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      setSnack({ message: 'Login successful!', type: 'success' });
      setTimeout(() => window.location.href = '/', 1500);
    } catch (error) {
      const err = error as Error;
      const errorMessage = err.message.includes('user-not-found') 
        ? 'Account not found' 
        : 'Invalid email or password';

      setSnack({ message: errorMessage, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setSnack(null);
    const provider = new GoogleAuthProvider();
    
    try {
      await signInWithPopup(auth, provider);
      setSnack({ message: 'Google login successful!', type: 'success' });
      setTimeout(() => window.location.href = '/', 1500);
    } catch (error) {
      const err = error as Error;
      console.log(err.message);
      setSnack({ message: 'Google login failed. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-xl shadow-sm sm:shadow-md w-full max-w-xs sm:max-w-md px-4 py-8 sm:px-8 sm:py-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 text-blue-600">
          Welcome Back! 👋
        </h1>

        {snack && (
          <Snack
            message={snack.message}
            type={snack.type}
            onClose={() => setSnack(null)}
            className="text-sm sm:text-base"
          />
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm sm:text-base font-medium mb-1.5 sm:mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 sm:p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm sm:text-base font-medium mb-1.5 sm:mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 sm:p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            {isLoading ? (
              <>
                <Loader className="h-4 w-4 sm:h-5 sm:w-5" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 sm:mt-8">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white text-gray-700 py-2.5 sm:py-3 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 border border-gray-300 disabled:opacity-50 text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V9h2c1.1 0 2-.9 2-2V5.08c2.87.86 5 3.54 5 6.92 0 2.21-.98 4.19-2.53 5.39z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <p className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline text-sm sm:text-base">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
} 