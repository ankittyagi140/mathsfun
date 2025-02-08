'use client';
import { useState, useEffect } from 'react';
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../context/Sidebar";
import Breadcrumb from "../components/Breadcrumb";
import AppCard from '../components/AppCard';

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

const Home = () => {
  const { activeView } = useSidebar();
  const [addedAppIds, setAddedAppIds] = useState<string[]>([]);

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

  return (
    <div className="min-h-screen p-8 bg-white">
      <div className={`flex flex-col min-h-screen`}>
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
