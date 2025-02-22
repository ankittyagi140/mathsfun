'use client';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useEffect } from 'react';

interface SnackProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  action?: {
    label: string;
    handler: () => void;
  };
  className?: string;
}

export default function Snack({ message, type, onClose, action, className }: SnackProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-20 right-4 p-4 flex items-center gap-3 rounded-lg shadow-lg z-50 ${
      type === 'success' 
        ? 'bg-green-100 border border-green-200 text-green-700'
        : 'bg-red-100 border border-red-200 text-red-700'
    } ${className || ''}`}>
      {type === 'success' ? (
        <CheckCircle2 className="h-5 w-5 text-green-600" />
      ) : (
        <AlertCircle className="h-5 w-5 text-red-600" />
      )}
      <span>{message}</span>
      {action && (
        <button 
          onClick={action.handler}
          className="px-2 py-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30"
        >
          {action.label}
        </button>
      )}
      <button
        onClick={onClose}
        className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
} 