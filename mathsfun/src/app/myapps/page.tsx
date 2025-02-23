'use client';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import AppCard from '@/components/AppCard';
import { useState } from 'react';
import Snack from '@/components/Snack';
import { Lock, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { removeApp } from '@/redux/slices/appsSlice';
import Popup from '@/components/Popup';


export default function MyAppsPage() {
  const myApps = useSelector((state: RootState) => state.apps.myApps);
  const [snack, setSnack] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [showConfirm, setShowConfirm] = useState(false);
  

  const handleRemoveAll = () => {
    setShowConfirm(true);
  };

  const handleConfirm = (confirmed: boolean) => {
    setShowConfirm(false);
    
    if (confirmed) {
      myApps.forEach(app => dispatch(removeApp(app.id)));
      setSnack({ 
        message: 'All Apps removed Successfully!',
        type: 'success',
      });
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <main className="w-full max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              My Applications
            </h1>
            {myApps.length > 0 && (
              <button
                onClick={handleRemoveAll}
                className="text-red-600 hover:text-red-700 flex items-center gap-1.5 text-sm sm:text-base"
              >
                <Trash2 className="w-4 h-4" />
                Remove All
              </button>
            )}
          </div>
        </div>

        {isAuthenticated ? (
          <>
            {/* Sorting Controls */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 sm:mb-8">
              <div className="flex-1 sm:max-w-xs">
                <select className="w-full px-4 py-2 border rounded-lg bg-white text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Sort by Recent</option>
                  <option>Sort by Name</option>
                </select>
              </div>
            </div>

            {/* Apps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
              {myApps.length > 0 ? (
                myApps.map((app) => (
                  <AppCard
                    key={app.id}
                    id={app.id}
                            title={app.title}
                            description={app.description}
                            href={app.href}
                            icon={app.icon}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8 sm:py-12">
                  <p className="text-gray-500 text-sm sm:text-base lg:text-lg">
                    No apps installed yet. Browse our collection to get started!
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          // Login Prompt
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center max-w-md px-4">
              <div className="mb-6 sm:mb-8">
                <Lock className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                Login Required
              </h2>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                Please login to manage your applications
              </p>
              <Link
                href="/login"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base rounded-lg transition-colors"
              >
                Sign In Now
              </Link>
            </div>
          </div>
        )}

        {showConfirm && (
          <Popup
            title="Remove All Apps"
            onClose={() => handleConfirm(false)}
          >
            <div className="space-y-4">
              <p className="text-gray-600">
                Are you sure you want to remove all apps from your collection?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => handleConfirm(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleConfirm(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Remove All
                </button>
              </div>
            </div>
          </Popup>
        )}

        {/* Snack Notification */}
        {snack && (
          <Snack
            message={snack.message}
            type={snack.type}
            onClose={() => setSnack(null)}
            className="text-sm sm:text-base"
          />
        )}
      </main>
    </div>
  );
}