'use client';
import { createPortal } from 'react-dom';

interface PopupProps {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
}

const Popup = ({ children, title, onClose }: PopupProps) => {
  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full animate-pop-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-600">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl"
          >
            &times;
          </button>
        </div>
        <div className="text-lg text-gray-700">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Popup; 