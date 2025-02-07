'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Lock, Bell, Shield, Palette, Save, CheckCircle, Sun } from 'lucide-react';
import { useTheme, themes } from '../../context/ThemeContext';

interface UserProfile {
  fullName: string;
  email: string;
  bio: string;
}

type Theme = {
  name: string;
  colors: {
    primary: string;
    background: string;
    secondary: string;
    text: string;
  };
};

const themeOptions: Theme[] = [
  { 
    name: 'Light',
    colors: {
      primary: '#3b82f6',
      background: '#f8fafc',
      secondary: '#e2e8f0',
      text: '#1e293b'
    }
  },
  {
    name: 'Dark',
    colors: {
      primary: '#60a5fa',
      background: '#1e293b',
      secondary: '#334155',
      text: '#f8fafc'
    }
  },
  {
    name: 'Ocean',
    colors: {
      primary: '#06b6d4',
      background: '#ecfeff',
      secondary: '#a5f3fc',
      text: '#164e63'
    }
  },
  {
    name: 'Sunset',
    colors: {
      primary: '#f97316',
      background: '#fff7ed',
      secondary: '#fed7aa',
      text: '#9a3412'
    }
  }
];

export default function SettingsContent() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const { currentTheme, changeTheme } = useTheme();
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: '',
    email: '',
    bio: ''
  });
  const [selectedTheme, setSelectedTheme] = useState<Theme>(themeOptions[0]);

  useEffect(() => {
    // Load user profile from localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      const theme = themeOptions.find(t => t.name === savedTheme) || themeOptions[0];
      applyTheme(theme);
    }
  }, []);

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    
    // Show success message
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.colors.primary);
    root.style.setProperty('--background', theme.colors.background);
    root.style.setProperty('--secondary', theme.colors.secondary);
    root.style.setProperty('--text', theme.colors.text);
    localStorage.setItem('theme', theme.name);
  };

  const handleThemeChange = (themeName: string) => {
    const theme = themeOptions.find(t => t.name === themeName) || themeOptions[0];
    setSelectedTheme(theme);
    applyTheme(theme);
  };

  const tabContent = {
    profile: (
      <div className="space-y-6">
        <div>
          <label className={`block text-sm font-medium ${currentTheme.textColor}`}>
            Full Name
          </label>
          <input
            type="text"
            value={userProfile.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className={`mt-1 block w-full rounded-md border ${currentTheme.borderColor} ${currentTheme.componentBg} p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
          />
        </div>
        <div>
          <label className={`block text-sm font-medium ${currentTheme.textColor}`}>
            Email
          </label>
          <input
            type="email"
            value={userProfile.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`mt-1 block w-full rounded-md border ${currentTheme.borderColor} ${currentTheme.componentBg} p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
          />
        </div>
        <div>
          <label className={`block text-sm font-medium ${currentTheme.textColor}`}>
            Bio
          </label>
          <textarea
            value={userProfile.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            rows={4}
            className={`mt-1 block w-full rounded-md border ${currentTheme.borderColor} ${currentTheme.componentBg} p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
          />
        </div>
      </div>
    ),
    account: (
      <div className="space-y-6">
        <div>
          <h3 className={`text-lg font-medium ${currentTheme.textColor}`}>Password</h3>
          <p className="text-sm text-gray-500">Update your password or enable two-factor authentication.</p>
        </div>
        <div>
          <h3 className={`text-lg font-medium ${currentTheme.textColor}`}>Connected Accounts</h3>
          <p className="text-sm text-gray-500">Connect your accounts to enable single sign-on.</p>
        </div>
      </div>
    ),
    notifications: (
      <div className="space-y-6">
        <div>
          <h3 className={`text-lg font-medium ${currentTheme.textColor}`}>Email Notifications</h3>
          <p className="text-sm text-gray-500">Choose what updates you want to receive.</p>
        </div>
        <div>
          <h3 className={`text-lg font-medium ${currentTheme.textColor}`}>Push Notifications</h3>
          <p className="text-sm text-gray-500">Configure your mobile push notifications.</p>
        </div>
      </div>
    ),
    appearance: (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Theme Settings</h2>
          <p className="text-sm text-gray-500 mb-4">Select your preferred theme.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {themeOptions.map(theme => (
              <button
                key={theme.name}
                onClick={() => handleThemeChange(theme.name)}
                className={`p-4 rounded-lg border-2 ${
                  selectedTheme.name === theme.name 
                    ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]' 
                    : 'border-gray-200'
                } transition-all`}
                style={{
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text
                }}
              >
                <div className="space-y-2">
                  <div 
                    className="w-full h-16 rounded-md"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <div 
                    className="w-full h-8 rounded-md"
                    style={{ backgroundColor: theme.colors.secondary }}
                  />
                </div>
                <span className="mt-2 block font-medium">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    ),
  };

  return (
    <div className="p-6 space-y-6 bg-white rounded-xl shadow-sm">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center px-4 py-2 border-b-2 text-sm font-medium ${
            activeTab === 'profile'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <User className="h-5 w-5 mr-2" />
          Profile
        </button>
        <button
          onClick={() => setActiveTab('account')}
          className={`flex items-center px-4 py-2 border-b-2 text-sm font-medium ${
            activeTab === 'account'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Lock className="h-5 w-5 mr-2" />
          Account
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center px-4 py-2 border-b-2 text-sm font-medium ${
            activeTab === 'notifications'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Bell className="h-5 w-5 mr-2" />
          Notifications
        </button>
        <button
          onClick={() => setActiveTab('appearance')}
          className={`flex items-center px-4 py-2 border-b-2 text-sm font-medium ${
            activeTab === 'appearance'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Palette className="h-5 w-5 mr-2" />
          Appearance
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {tabContent[activeTab as keyof typeof tabContent]}
      </div>

      {/* Save Button */}
      <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
        <button
          onClick={handleSave}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Save className="h-5 w-5 mr-2" />
          Save Changes
        </button>
        
        {/* Success Message */}
        {showSaveSuccess && (
          <div className="flex items-center text-green-500">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>Changes saved successfully!</span>
          </div>
        )}
      </div>
    </div>
  );
}