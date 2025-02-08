'use client';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useEffect } from 'react';

export default function Snack({
  message,
  type,
  onClose
}: {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 p-4 flex items-center gap-3 rounded-lg shadow-lg bg-white border border-gray-100 animate-fade-in-up">
      {type === 'success' ? (
        <CheckCircle2 className="h-5 w-5 text-green-600" />
      ) : (
        <AlertCircle className="h-5 w-5 text-red-600" />
      )}
      <span className="text-gray-700">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
} 