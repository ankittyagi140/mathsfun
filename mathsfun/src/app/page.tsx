'use client';

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";
import { useState, useEffect } from 'react';
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../context/Sidebar";
import Breadcrumb from "../components/Breadcrumb";

interface App {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
}

const allApps: App[] = [
  { id: '1', name: 'Learning App', icon: '🎓', description: 'Track your learning progress', category: 'Education' },
  { id: '2', name: 'Analytics Dashboard', icon: '📊', description: 'View your performance', category: 'Analytics' },
  { id: '3', name: 'Note Taking', icon: '📝', description: 'Take and organize notes', category: 'Productivity' },
  { id: '4', name: 'Task Manager', icon: '🎯', description: 'Manage tasks efficiently', category: 'Productivity' },
  { id: '5', name: 'Calendar', icon: '📅', description: 'Schedule your activities', category: 'Planning' },
  { id: '6', name: 'Study Material', icon: '📚', description: 'Access study resources', category: 'Education' },
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
  const { currentTheme } = useTheme();
  
  return (
    <div className="mb-8">
      <h2 className={`text-xl font-semibold mb-4 ${currentTheme.textColor}`}>{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {apps.map((app) => (
          <div
            key={app.id}
            className={`${currentTheme.componentBg} p-4 rounded-lg border ${currentTheme.borderColor} hover:border-blue-500 transition-colors duration-200`}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{app.icon}</div>
              <div className="flex-1">
                <h3 className={`font-semibold ${currentTheme.textColor}`}>{app.name}</h3>
                <p className="text-sm text-gray-500">{app.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`inline-block text-xs px-2 py-1 rounded-full ${currentTheme.componentBg} border ${currentTheme.borderColor}`}>
                    {app.category}
                  </span>
                  {showAddButton && !installedApps.has(app.id) && (
                    <button
                      onClick={() => onAddApp?.(app)}
                      className="text-sm px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Add App
                    </button>
                  )}
                  {installedApps.has(app.id) && (
                    <span className="text-sm text-green-500">Installed</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function HomePage() {
  const { currentTheme } = useTheme();
  const { activeView } = useSidebar();
  const [myApps, setMyApps] = useState<App[]>([]);
  const [installedAppIds, setInstalledAppIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load installed apps from localStorage
    const savedApps = localStorage.getItem('myApps');
    if (savedApps) {
      const apps = JSON.parse(savedApps);
      setMyApps(apps);
      setInstalledAppIds(new Set(apps.map((app: App) => app.id)));
    }
  }, []);

  const handleAddApp = (app: App) => {
    const updatedApps = [...myApps, app];
    setMyApps(updatedApps);
    setInstalledAppIds(new Set([...installedAppIds, app.id]));
    localStorage.setItem('myApps', JSON.stringify(updatedApps));
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
  
  return (
    <div className={`flex flex-col min-h-screen ${currentTheme.mainBg} transition-colors duration-200`}>
      <Header />
      <main className="flex-1 w-full">
        <div className={`max-w-7xl mx-auto px-4 py-6 ${currentTheme.textColor}`}>
          <div className="flex gap-6">
            <Sidebar />
            <div className="flex-1">
              <div className="mb-8">
                <Breadcrumb items={getBreadcrumbItems()} />
                <h1 className={`text-2xl font-bold ${currentTheme.textColor}`}>
                  {activeView === 'dashboard' ? 'Dashboard' : 'My Apps'}
                </h1>
              </div>
              
              {activeView === 'dashboard' ? (
                <>
                  {myApps.length > 0 && (
                    <AppGrid 
                      apps={myApps} 
                      title="My Apps" 
                      installedApps={installedAppIds}
                    />
                  )}
                  
                  <AppGrid 
                    apps={allApps} 
                    title="All Apps" 
                    onAddApp={handleAddApp}
                    showAddButton={true}
                    installedApps={installedAppIds}
                  />
                </>
              ) : (
                <AppGrid 
                  apps={myApps} 
                  title="My Installed Apps" 
                  installedApps={installedAppIds}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
