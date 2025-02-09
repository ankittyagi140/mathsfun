'use client';
import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { 
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import Snack from '@/components/Snack';
import Loader from '@/components/Loader';
import Breadcrumb from "../../components/Breadcrumb";
import Sidebar from "../../components/Sidebar";

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState(auth.currentUser?.displayName || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [snack, setSnack] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingProfile(true);
    
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName });
        setSnack({ message: 'Profile updated successfully!', type: 'success' });
      }
    } catch (error) {
      setSnack({ message: 'Failed to update profile', type: 'error' });
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
    } catch (error: any) {
      setSnack({ 
        message: error.message || 'Failed to update password', 
        type: 'error' 
      });
    } finally {
      setLoadingPassword(false);
    }
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Settings', path: '/settings' }
  ];

  return (
    <div className="min-h-screen p-8 bg-white p-8 bg-white">
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-6">
            <Sidebar />
            <div className="flex-1">
              <div className="mb-8">
                <Breadcrumb items={breadcrumbItems} />
                <h1 className="text-2xl font-bold">Settings</h1>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Section */}
                <div className="bg-white p-6 rounded-lg border">
                  <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        value={auth.currentUser?.email || ''}
                        disabled
                        className="w-full p-2 border rounded bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Display Name</label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loadingProfile}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      {loadingProfile ? (
                        <>
                          <Loader className="h-4 w-4" />
                          Updating...
                        </>
                      ) : (
                        'Update Profile'
                      )}
                    </button>
                  </form>
                </div>

                {/* Password Section */}
                <div className="bg-white p-6 rounded-lg border">
                  <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Current Password</label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loadingPassword}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      {loadingPassword ? (
                        <>
                          <Loader className="h-4 w-4" />
                          Updating...
                        </>
                      ) : (
                        'Change Password'
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {snack && (
                <Snack
                  message={snack.message}
                  type={snack.type}
                  onClose={() => setSnack(null)}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}