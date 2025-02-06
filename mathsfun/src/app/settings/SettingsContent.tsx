'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Lock, Bell, Shield, Palette, Save, CheckCircle, Sun } from 'lucide-react';
import { useTheme, themes } from '../../context/ThemeContext';

interface UserProfile {
  fullName: string;
  email: string;
  bio: string;
}

export default function SettingsContent() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const { currentTheme, changeTheme } = useTheme();
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: '',
    email: '',
    bio: ''
  });

  useEffect(() => {
    // Load user profile from localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
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
          <h3 className={`text-lg font-medium ${currentTheme.textColor}`}>Theme</h3>
          <p className="text-sm text-gray-500 mb-4">Select your preferred theme.</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => changeTheme(theme.id)}
                className={`p-4 rounded-lg border ${
                  currentTheme.id === theme.id
                    ? 'border-blue-500 ring-2 ring-blue-500'
                    : currentTheme.borderColor
                } ${currentTheme.componentBg} transition-all hover:border-blue-500`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${currentTheme.textColor}`}>{theme.name}</span>
                  {currentTheme.id === theme.id && (
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    ),
  };

  return (
    <div className={`${currentTheme.componentBg} rounded-lg border ${currentTheme.borderColor} overflow-hidden`}>
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