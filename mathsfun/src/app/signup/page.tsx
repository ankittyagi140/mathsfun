'use client';
import { useState } from 'react';
import { auth } from '@/firebase/firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';
import Snack from '@/components/Snack';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snack, setSnack] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSnack(null);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSnack({ message: 'Account created successfully!', type: 'success' });
      router.push('/login');
    } catch (error) {
      const err = error as Error;
      setError(err.message || 'Failed to sign up');
      setSnack({ message: 'Failed to create account', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-xl shadow-sm sm:shadow-md w-full max-w-xs sm:max-w-md px-4 py-8 sm:px-8 sm:py-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 text-blue-600">
          Create Account 🚀
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm sm:text-base">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4 sm:space-y-6">
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
                Creating Account...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <p className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline text-sm sm:text-base">
            Login here
          </Link>
        </p>

        {snack && (
          <Snack
            message={snack.message}
            type={snack.type}
            onClose={() => setSnack(null)}
            className="text-sm sm:text-base"
          />
        )}
      </div>
    </div>
  );
} 