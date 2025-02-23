'use client';
import { useState } from 'react';
import { auth } from '@/firebase/firebase-config';
import {
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import Snack from '@/components/Snack';
import Loader from '@/components/Loader';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import Link from 'next/link';
import { Lock } from 'lucide-react';

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState(auth.currentUser?.displayName || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [snack, setSnack] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingProfile(true);

    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName });
        setSnack({ message: 'Profile updated successfully!', type: 'success' });
      }
    } catch (error) {
      const err = error as Error;
      setSnack({ message: err.message || 'Failed to update profile', type: 'error' });
    } finally {
      setLoadingProfile(false);
    }

  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setSnack({ message: 'New passwords do not match', type: 'error' });
      return;
    }

    setLoadingPassword(true);

    try {
      const user = auth.currentUser;
      if (user && user.email) {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        setSnack({ message: 'Password updated successfully!', type: 'success' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      const err = error as Error;
      setSnack({ message: err.message || 'Failed to update password', type: 'error' });
    } finally {
      setLoadingPassword(false);
    }
  };

  

  return (
    <div className="min-h-screen bg-white">
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-4 sm:gap-6">
            <div className="flex-1">
              <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
              </div>
              {isAuthenticated ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Profile Section */}
                  <div className="bg-white p-4 sm:p-6 rounded-xl border shadow-sm">
                    <h2 className="text-lg sm:text-xl font-semibold mb-4">Profile Information</h2>
                    <form onSubmit={handleProfileUpdate} className="space-y-4 sm:space-y-5">
                      <div>
                        <label className="block text-sm sm:text-base font-medium mb-1.5">Email</label>
                        <input
                          type="email"
                          value={auth.currentUser?.email || ''}
                          disabled
                          className="w-full p-2.5 sm:p-3 border rounded-lg bg-gray-50 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm sm:text-base font-medium mb-1.5">Display Name</label>
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="w-full p-2.5 sm:p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loadingProfile}
                        className="w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                      >
                        {loadingProfile ? (
                          <>
                            <Loader className="h-4 w-4 sm:h-5 sm:w-5" />
                            Updating...
                          </>
                        ) : (
                          'Update Profile'
                        )}
                      </button>
                    </form>
                  </div>

                  {/* Password Section */}
                  <div className="bg-white p-4 sm:p-6 rounded-xl border shadow-sm">
                    <h2 className="text-lg sm:text-xl font-semibold mb-4">Security Settings</h2>
                    <form onSubmit={handlePasswordChange} className="space-y-4 sm:space-y-5">
                      <div>
                        <label className="block text-sm sm:text-base font-medium mb-1.5">Current Password</label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full p-2.5 sm:p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm sm:text-base font-medium mb-1.5">New Password</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full p-2.5 sm:p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm sm:text-base font-medium mb-1.5">Confirm New Password</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full p-2.5 sm:p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loadingPassword}
                        className="w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                      >
                        {loadingPassword ? (
                          <>
                            <Loader className="h-4 w-4 sm:h-5 sm:w-5" />
                            Updating...
                          </>
                        ) : (
                          'Change Password'
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="min-h-[70vh] flex items-center justify-center px-4">
                  <div className="text-center max-w-md mx-auto">
                    <div className="flex justify-center mb-4 sm:mb-6">
                      <Lock className="h-14 w-14 sm:h-16 sm:w-16 text-gray-400" />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                      Login Required
                    </h1>
                    <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
                      Please login to change your profile information and security settings.
                    </p>
                    <Link
                      href="/login"
                      className="inline-block bg-blue-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                    >
                      Login to Continue
                    </Link>
                  </div>
                </div>
              )}
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
        </div>
      </main>
    </div>
  );
}