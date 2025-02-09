'use client';
import { useState, useEffect } from 'react';
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../context/Sidebar";
import Breadcrumb from "../components/Breadcrumb";
import AppCard from '../components/AppCard';
import { Search } from 'lucide-react';

import Link from 'next/link';

interface App {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  path: string;
}

const allApps: App[] = [
  {
    id: 'puzzle-1',
    name: 'Kids Sudoku',
    icon: '🧩',
    description: 'Fun number placement puzzle',
    category: 'Puzzles',
    path: '/puzzles/sudoku'
  },
  {
    id: 'puzzle-2',
    name: 'Crossword Fun',
    icon: '🔠',
    description: 'Word discovery game',
    category: 'Puzzles',
    path: '/puzzles/crossword'
  },
  {
    id: 'puzzle-3',
    name: 'Number Maze',
    icon: '🏰',
    description: 'Navigate through numerical challenges',
    category: 'Puzzles',
    path: '/puzzles/numbermaze'
  },
  {
    id: 'puzzle-4',
    name: 'Math Combination',
    icon: '🧮',
    description: 'Combine numbers to reach the target',
    category: 'Puzzles',
    path: '/puzzles/math-combination'
  },
  {
    id: 'puzzle-6',
    name: 'Math Path Finder',
    icon: '🛤️',
    description: 'Connect numbers and operators to reach target',
    category: 'Puzzles',
    path: '/puzzles/math-path'
  },
  {
    id: 'puzzle-7',
    name: 'Magic Square',
    icon: '🧙',
    description: 'Arrange numbers to match row/column sums',
    category: 'Puzzles',
    path: '/puzzles/magic-square'
  },
  {
    id: 'puzzle-8',
    name: 'Prime Hunt',
    icon: '🔢',
    description: 'Find prime numbers against the clock',
    category: 'Puzzles',
    path: '/puzzles/prime-hunt'
  },
  {
    id: 'puzzle-9',
    name: 'Equation Balancer',
    icon: '⚖️',
    description: 'Balance chemical equations through coefficients',
    category: 'Puzzles',
    path: '/puzzles/equation-balancer'
  },
  {
    id: 'puzzle-10',
    name: 'Fibonacci Quest',
    icon: '🔢',
    description: 'Complete Fibonacci sequences',
    category: 'Number-Based Puzzles',
    path: '/puzzles/fibonacci-quest'
  },
  {
    id: 'puzzle-11',
    name: 'Number Sequence',
    icon: '🔣',
    description: 'Identify the next number in patterns',
    category: 'Number-Based Puzzles',
    path: '/puzzles/number-sequence'
  },
];

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

// First, define default icons
const defaultIcons = {
  'Math Puzzle': '/icons/puzzle.svg',
  'Algebra Basics': '/icons/algebra.svg',
  'Geometry Master': '/icons/shapes.svg',
  // Add more default icons as needed
};

const Home = () => {
  const { activeView } = useSidebar();
  const [addedAppIds, setAddedAppIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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
        console.log('Adding app:', appId, 'New state:', newIds);
        return newIds;
      }
      console.log('App already added:', appId);
      return prev;
    });
  };

  const handleRemoveApp = (appId: string) => {
    setAddedAppIds(prev => prev.filter(id => id !== appId));
  };

  console.log('Added Apps:', addedAppIds);

  const getBreadcrumbItems = () => {
    const items = [{ label: 'Home', path: '/' }];
    if (activeView === 'dashboard') {
      items.push({ label: 'Dashboard', path: '/?view=dashboard' });
    } else if (activeView === 'myapps') {
      items.push({ label: 'My Apps', path: '/?view=myapps' });
    }
    return items;
  };

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
                                      className="p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 flex items-center gap-4"
                                    >
                                      <img 
                                        src={app.icon || defaultIcons[app.name]} 
                                        alt={app.name}
                                        className="w-10 h-10 object-contain"
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).src = '/icons/default-app.svg';
                                        }}
                                      />
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
