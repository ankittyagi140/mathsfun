'use client';

import { useState, useEffect } from 'react';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { User, Mail, Lock, Bell, Shield, Palette, Save, CheckCircle, Sun } from 'lucide-react';
import { useTheme, themes } from '../../context/ThemeContext';

interface UserProfile {
  fullName: string;
  email: string;
  bio: string;
}

export const SettingsContent = () => {
  const { currentTheme, changeTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    fullName: '',
    email: '',
    bio: ''
  });

  // Load profile data from localStorage on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setShowSaveSuccess(true);
    setTimeout(() => {
      setShowSaveSuccess(false);
    }, 3000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div className={`min-h-screen ${currentTheme.mainBg}`}>
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className={`text-2xl font-bold ${currentTheme.textColor}`}>Settings</h1>
          <p className="text-sm text-gray-500">Manage your account settings and preferences</p>
        </div>

        <div className="flex gap-6">
          {/* Settings Navigation */}
          <aside className="w-64">
            <nav className={`space-y-1 ${currentTheme.componentBg} rounded-lg shadow-sm p-2`}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600'
                        : `${currentTheme.textColor} hover:bg-gray-100`
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Settings Content */}
          <main className={`flex-1 ${currentTheme.componentBg} rounded-lg shadow-sm p-6`}>
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Profile Settings</h2>
                
                {/* Profile Picture */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-10 h-10 text-gray-400" />
                  </div>
                  <button className="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">
                    Change Photo
                  </button>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={profile.fullName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={profile.bio}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      placeholder="Tell us about yourself"
                    />
                  </div>
                </div>

                {/* Save Button and Success Message */}
                <div className="flex justify-end items-center gap-4">
                  {showSaveSuccess && (
                    <span className="flex items-center text-green-600 text-sm">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Changes saved successfully!
                    </span>
                  )}
                  <button 
                    onClick={handleSaveChanges}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Appearance Settings</h2>
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Choose Theme
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {themes.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => changeTheme(theme.id)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          currentTheme.id === theme.id
                            ? 'border-blue-500 ring-2 ring-blue-200'
                            : `${theme.borderColor} hover:border-gray-300`
                        } ${theme.bgColor}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-medium ${theme.textColor}`}>
                            {theme.name}
                          </span>
                          {currentTheme.id === theme.id && (
                            <CheckCircle className="w-5 h-5 text-blue-500" />
                          )}
                        </div>
                        <div className={`mt-2 text-sm ${theme.textColor} opacity-75`}>
                          Preview text
                        </div>
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Select a theme to customize your experience. Changes are saved automatically.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
                {/* Add account settings content */}
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
                {/* Add notification settings content */}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};