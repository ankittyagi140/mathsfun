'use client';
import { useState, useEffect } from 'react';
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../context/Sidebar";
import Breadcrumb from "../components/Breadcrumb";
import AppCard from '../components/AppCard';
import { Search } from 'lucide-react';
import {allPuzzleApps} from '../utils/allPuzzleApps';
import { useRouter } from 'next/navigation';
interface App {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  path: string;
}

const allApps:App[] = allPuzzleApps;

const AppGrid = ({
  apps,
  title,
  onAddApp,
  showAddButton = false,
  installedApps = new Set()
}: {
  apps: App[],
  title: string,
  onAddApp?: (app: App) => void,
  showAddButton?: boolean,
  installedApps?: Set<string>
}) => {
  return (
    <div className="mb-8">
      <h2
        className="text-xl font-semibold mb-4"
      >
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {apps.map((app) => (
          <AppCard
            key={app.id}
            title={app.name}
            description={app.description}
            href={app.path}
            icon={app.icon}
            id={app.id}
          />
        ))}
      </div>
    </div>
  );
};



const Home = () => {
  const { activeView } = useSidebar();
  const [addedAppIds, setAddedAppIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('addedAppIds');
    if (saved) setAddedAppIds(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('addedAppIds', JSON.stringify(addedAppIds));
  }, [addedAppIds]);

  const handleAddApp = (appId: string) => {
    setAddedAppIds(prev => {
      // Prevent duplicates
      if (!prev.includes(appId)) {
        const newIds = [...prev, appId];
        return newIds;
      }
      return prev;
    });
  };

  const handleRemoveApp = (appId: string) => {
    setAddedAppIds(prev => prev.filter(id => id !== appId));
  };


  const getBreadcrumbItems = () => {
    const items = [{ label: 'Home', path: '/' }];
    if (activeView === 'dashboard') {
      items.push({ label: 'Dashboard', path: '/?view=dashboard' });
    } else if (activeView === 'myapps') {
      items.push({ label: 'My Apps', path: '/?view=myapps' });
    }
    return items;
  };

const handleAppClick = (app: App) => () => {
 router.push(app.path);}
  const myApps = allApps.filter(app => addedAppIds.includes(app.id));

  const filteredApps = allApps.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <div className={`flex flex-col min-h-screen p-8 bg-white`}>
        <main className="flex-1 w-full">
          <div className="max-w-7xl mx-auto px-4 py-6">

            <div className="flex gap-6">
              <Sidebar />
              <div className="flex-1">
                <div className="mb-8">
                  <Breadcrumb items={getBreadcrumbItems()} />
                  <h1 className={`text-2xl font-bold`}>
                    {activeView === 'dashboard' ? 'Dashboard' : 'My Apps'}
                  </h1>
                </div>

                {activeView === 'dashboard' ? (
                  <>
                    <header className="mb-8">
                      <div className="max-w-7xl mx-auto px-4 py-6">
                        <div className="flex justify-between items-center">
                         
                          <div className="relative w-96">
                            <div className="flex items-center border rounded-lg px-4 py-2">
                              <Search className="h-5 w-5 text-gray-400" />
                              <input
                                type="text"
                                placeholder="Search apps..."
                                className="ml-2 flex-1 outline-none bg-transparent"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                              />
                            </div>
                            
                            {isSearchFocused && searchQuery && (
                              <div className="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto">
                                {filteredApps.length > 0 ? (
                                  filteredApps.map((app) => (
                                    <div
                                      key={app.id}
                                      onClick={handleAppClick(app)}
                                      className="p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 flex items-center gap-4"
                                    >
                                        <span className="text-2xl">{app.icon}</span> {/* Render icon as text */}
                                      <div>
                                        <h3 className="font-medium">{app.name}</h3>
                                        <p className="text-sm text-gray-500">{app.category}</p>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="p-4 text-gray-500">No apps found</div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </header>

                    {myApps.length > 0 && (
                      <AppGrid
                        apps={myApps}
                        title="My Apps"
                      />
                    )}

                    <section className="mb-12">
                      <div className="flex justify-between items-center mb-6">
                      </div>
                      <AppGrid
                        apps={allApps}
                        title="All Apps"
                      />
                    </section>
                  </>
                ) : (
                  <section className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-3xl font-bold">⭐ My Apps</h2>
                      {myApps.length > 0 && (
                        <button
                          onClick={() => setAddedAppIds([])}
                          className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm"
                        >
                          Remove All
                        </button>
                      )}
                    </div>
                    {myApps.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myApps.map((app) => (
                          <AppCard
                            key={app.id}
                            title={app.name}
                            description={app.description}
                            href={app.path}
                            icon={app.icon}
                            onRemove={handleRemoveApp}
                            isAdded={true}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <p className="text-gray-500">No apps added yet. Browse below!</p>
                      </div>
                    )}
                  </section>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
