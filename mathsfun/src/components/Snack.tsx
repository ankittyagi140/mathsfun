'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

type SnackProps = {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
};

export default function Snack({ message, type, onClose }: SnackProps) {
  const colors = {
    success: 'bg-green-100 text-green-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };

  const icons = {
    success: <CheckCircle2 className="h-5 w-5" />,
    error: <AlertCircle className="h-5 w-5" />,
    info: <AlertCircle className="h-5 w-5" />,
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className={`fixed bottom-4 left-1/2 -translate-x-1/2 p-4 rounded-md flex items-center gap-3 ${colors[type]} shadow-lg min-w-[300px] justify-between`}
      >
        <div className="flex items-center gap-3">
          {icons[type]}
          <span className="text-sm">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="hover:opacity-70 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
} 