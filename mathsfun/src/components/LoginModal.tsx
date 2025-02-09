'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/slices/userSlice';
import type { RootState, AppDispatch } from '../redux/store';

const LoginModal = ({ isOpen, onClose, onLogin }: { 
  isOpen: boolean;
  onClose: () => void;
  onLogin: (name: string) => void;
}) => {
  const [name, setName] = useState('');
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  if (!isOpen) return null;

  const handleLogin = (name: string, email: string) => {
    dispatch(setUser({ name, email }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Welcome to Maths2Fun! 🎉</h2>
        <input
          type="text"
          placeholder="Enter your name (optional)"
          className="w-full p-2 border rounded mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => onLogin(name)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Continue as {name || 'Guest'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal; 