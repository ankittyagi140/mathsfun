'use client';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useEffect } from 'react';

interface SnackProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function Snack({ message, type, onClose }: SnackProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-20 right-4 p-4 flex items-center gap-3 rounded-lg shadow-lg z-50 ${
      type === 'success' 
        ? 'bg-green-100 border border-green-200 text-green-700'
        : 'bg-red-100 border border-red-200 text-red-700'
    }`}>
      {type === 'success' ? (
        <CheckCircle2 className="h-5 w-5 text-green-600" />
      ) : (
        <AlertCircle className="h-5 w-5 text-red-600" />
      )}
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
} 