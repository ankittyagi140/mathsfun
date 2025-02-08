'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Lock, Bell, Shield, Palette, Save, CheckCircle, Sun } from 'lucide-react';
import { useTheme, themes } from '../../context/ThemeContext';
import Snack from '@/components/Snack';
import Loader from '@/components/Loader';
import { cn } from '@/lib/utils';

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
    componentBg: string;
  };
};

const themeOptions: Theme[] = [
  { 
    name: 'Light',
    colors: {
      primary: '#3b82f6',
      background: '#f8fafc',
      secondary: '#e2e8f0',
      text: '#1e293b',
      componentBg: '#f8fafc'
    }
  },
  {
    name: 'Dark',
    colors: {
      primary: '#60a5fa',
      background: '#1e293b',
      secondary: '#334155',
      text: '#f8fafc',
      componentBg: '#1e293b'
    }
  },
  {
    name: 'Ocean',
    colors: {
      primary: '#06b6d4',
      background: '#ecfeff',
      secondary: '#a5f3fc',
      text: '#164e63',
      componentBg: '#ecfeff'
    }
  },
  {
    name: 'Sunset',
    colors: {
      primary: '#f97316',
      background: '#fff7ed',
      secondary: '#fed7aa',
      text: '#9a3412',
      componentBg: '#fff7ed'
    }
  }
];

export default function SettingsContent() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: '',
    email: '',
    bio: ''
  });
  const [snackState, setSnackState] = useState<{
    visible: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    visible: false,
    type: 'success',
    message: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showSnack, setShowSnack] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    // Load user profile from localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
  }, []);

  

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      if (!userProfile.fullName.trim()) {
        setSnackState({
          visible: true,
          type: 'error',
          message: 'Please fill the required name field'
        });
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
      
      setSnackState({
        visible: true,
        type: 'success',
        message: 'Settings saved successfully!'
      });
    } catch (error) {
      setSnackState({
        visible: true,
        type: 'error',
        message: 'Failed to save settings'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setIsDirty(true);
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isNameValid = () => {
    return userProfile.fullName.trim().length > 0;
  };

 
  

  const tabContent = {
    profile: (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name<span className="text-red-500 ml-1">*</span>
          </label>
          <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
            <User className="h-5 w-5 text-gray-400" />
            <input
              value={userProfile.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className="flex-1 bg-transparent focus:outline-none"
              placeholder="John Doe"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={userProfile.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`mt-1 block w-full rounded-md border p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            value={userProfile.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            rows={4}
            className={`mt-1 block w-full rounded-md border  p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
          />
        </div>
      </div>
    ),
    account: (
      <div className="space-y-6">
        <div>
          <h3 className={`text-lg font-medium `}>Password</h3>
          <p className="text-sm text-gray-500">Update your password or enable two-factor authentication.</p>
        </div>
        <div>
          <h3 className={`text-lg font-medium `}>Connected Accounts</h3>
          <p className="text-sm text-gray-500">Connect your accounts to enable single sign-on.</p>
        </div>
      </div>
    ),
    notifications: (
      <div className="space-y-6">
        <div>
          <h3 className={`text-lg font-medium `}>Email Notifications</h3>
          <p className="text-sm text-gray-500">Choose what updates you want to receive.</p>
        </div>
        <div>
          <h3 className={`text-lg font-medium `}>Push Notifications</h3>
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
           
          </div>
        </div>
      </div>
    ),
  };

  return (
    <div 
      className="rounded-lg p-6"
     
    >
      <h2 className="text-xl font-semibold mb-4">Appearance</h2>
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
          disabled={!isDirty || !isNameValid() || isSaving}
          className={cn(
            "flex items-center px-4 py-2 bg-blue-500 text-white rounded-md",
            "hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500",
            "focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {isSaving ? (
            <>
              <Loader size="sm" color="text-white" className="mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-5 w-5 mr-2" />
              Save Changes
            </>
          )}
        </button>
        
        {snackState.visible && (
          <Snack
            type={snackState.type}
            message={snackState.message}
            onClose={() => setSnackState(prev => ({...prev, visible: false}))}
          />
        )}
      </div>
    </div>
  );
}