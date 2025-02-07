'use client';

import SettingsContent from "./SettingsContent";
import Breadcrumb from "../../components/Breadcrumb";
import { useTheme } from "../../context/ThemeContext";
import Sidebar from "../../components/Sidebar";

export default function SettingsPage() {
  const { currentTheme } = useTheme();
  
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Settings', path: '/settings' }
  ];

  return (
    <div className={`flex flex-col min-h-screen ${currentTheme.mainBg}`}>
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-6">
            <Sidebar />
            <div className="flex-1">
              <div className="mb-8">
                <Breadcrumb items={breadcrumbItems} />
                <h1 className={`text-2xl font-bold ${currentTheme.textColor}`}>Settings</h1>
              </div>
              <SettingsContent />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}