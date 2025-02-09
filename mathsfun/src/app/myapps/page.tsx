'use client';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import AppCard from '@/components/AppCard';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';
import Snack from '@/components/Snack';
import Breadcrumb from '@/components/Breadcrumb';

export default function MyAppsPage() {
  const myApps = useSelector((state: RootState) => state.apps.myApps);
  const pathname = usePathname();
  const [snack, setSnack] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleAddToMyApps = async (appId: string) => {
    try {
      // ... API call
      setSnack({ message: 'App added successfully!', type: 'success' });
    } catch (error) {
      setSnack({ message: 'Failed to add app', type: 'error' });
    }
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'My Apps', path: '/myapps' }
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
                <h1 className="text-2xl font-bold">My Applications</h1>
              </div>

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