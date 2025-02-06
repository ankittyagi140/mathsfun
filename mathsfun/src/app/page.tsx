'use client';

import Header from "../components/Header";
import { Home, Bell, Plus, LayoutDashboard, Settings, BookOpen, Trophy, HelpCircle } from 'lucide-react';
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";
import { useState, useEffect } from 'react';

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

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: Home, label: 'My Apps' },
  { icon: BookOpen, label: 'Learning' },
  { icon: Trophy, label: 'Achievements' },
  { icon: Bell, label: 'Notifications' },
  { icon: Plus, label: 'Add apps' },
  { icon: Settings, label: 'Settings' },
  { icon: HelpCircle, label: 'Help & Support' },
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
  const [myApps, setMyApps] = useState<App[]>([]);
  const [installedAppIds, setInstalledAppIds] = useState<Set<string>>(new Set());
  const [activeView, setActiveView] = useState<'dashboard' | 'myapps'>('dashboard');

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
  
  return (
    <div className={`flex flex-col min-h-screen ${currentTheme.mainBg} transition-colors duration-200`}>
      <Header />
      
      <main className="flex-1 w-full">
        <div className={`max-w-7xl mx-auto px-4 py-6 ${currentTheme.textColor}`}>
          {/* Sidebar */}
          <div className="flex gap-6">
            <aside className="w-64 space-y-1">
              {sidebarItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (item.label === 'Dashboard') setActiveView('dashboard');
                      if (item.label === 'My Apps') setActiveView('myapps');
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md ${
                      (item.label === 'Dashboard' && activeView === 'dashboard') ||
                      (item.label === 'My Apps' && activeView === 'myapps')
                        ? 'bg-blue-500 text-white'
                        : `${currentTheme.componentBg} ${currentTheme.textColor}`
                    } hover:bg-opacity-80 transition-colors duration-200`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              <h1 className={`text-2xl font-bold mb-6 ${currentTheme.textColor}`}>
                {activeView === 'dashboard' ? 'Dashboard' : 'My Apps'}
              </h1>
              
              {activeView === 'dashboard' ? (
                <>
                  {/* My Apps Section */}
                  {myApps.length > 0 && (
                    <AppGrid 
                      apps={myApps} 
                      title="My Apps" 
                      installedApps={installedAppIds}
                    />
                  )}
                  
                  {/* All Apps Section */}
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
