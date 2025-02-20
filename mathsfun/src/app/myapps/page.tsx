'use client';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import AppCard from '@/components/AppCard';
import { useState } from 'react';
import Snack from '@/components/Snack';
import { Lock } from 'lucide-react';
import Link from 'next/link';


export default function MyAppsPage() {
  const myApps = useSelector((state: RootState) => state.apps.myApps);
  const [snack, setSnack] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen p-8 bg-white p-8 bg-white">
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-6">
            <div className="flex-1">
              <div className="mb-8">
                <h1 className="text-2xl font-bold">My Applications</h1>
              </div>
              {
                isAuthenticated ?
                  <section className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold">Installed Applications</h2>
                      <select className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5">
                        <option>Sort by Recent</option>
                        <option>Sort by Name</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                        <div className="col-span-full text-center py-12">
                          <p className="text-gray-500 text-lg">
                            No apps installed yet. Browse our collection to get started!
                          </p>
                        </div>
                      )}
                    </div>
                  </section>
                  :
                  <div className="min-h-[80vh] flex items-center justify-center px-4">
                    <div className="text-center max-w-md mx-auto">
                      <div className="flex justify-center mb-6">
                        <Lock className="h-16 w-16 text-gray-400" />
                      </div>
                      <h1 className="text-2xl font-bold text-gray-800 mb-4">
                        Login Required
                      </h1>
                      <p className="text-gray-600 mb-8">
                        Please login to add your favorite apps to your account.
                      </p>
                      <Link
                        href="/login"
                        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Login to Continue
                      </Link>
                    </div>
                  </div>
              }
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