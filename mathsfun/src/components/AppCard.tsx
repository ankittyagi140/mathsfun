'use client'
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { addApp, removeApp } from '@/redux/slices/appsSlice';
import { useSnackbar } from '@/context/SnackbarContext';

interface AppCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  href: string;
  id: string;
  isAdded?: boolean;
  onRemove?: (appId: string) => void;
}

export default function AppCard({ title, description, icon, href, id, isAdded, onRemove }: AppCardProps) {
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleAddRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      showSnackbar('Please login to add apps to My Apps', 'error');
      return;
    }

    if (isAdded && onRemove) {
      onRemove(id);
      dispatch(removeApp(id));
      showSnackbar(`${title} removed from My Apps`, 'success');
    } else {
      dispatch(addApp({
        id: id,
        title: title,
        description: description,
        href: href,
        icon: typeof icon === 'string' ? icon : '⭐'
      }));
      showSnackbar(`${title} added to My Apps`, 'success');
    }
  };

  return (
    <Link
      href={href}
      className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl hover:bg-yellow-100 transition-all duration-300 ease-out border border-yellow-300 overflow-hidden transform hover:-translate-y-1.5"
    >
      <button
        onClick={handleAddRemove}

        className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white border shadow-md hover:bg-gray-50 transition-colors"
      >
        {isAdded ? (
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        )}
      </button>

      <div className="p-6 space-y-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 group-hover:scale-105 transition-transform duration-300 shadow-sm">
          {icon}
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  );
} 