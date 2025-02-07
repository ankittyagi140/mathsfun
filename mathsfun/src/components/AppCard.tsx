import Link from 'next/link';
import { useState } from 'react';

interface AppCardProps {
  app: App;
  onAdd?: (appId: string) => void;
  onRemove?: (appId: string) => void;
  isAdded?: boolean;
}

const AppCard = ({ app, onAdd, onRemove, isAdded }: AppCardProps) => {
  const [isJustAdded, setIsJustAdded] = useState(false);

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAdd?.(app.id);
    setIsJustAdded(true);
    setTimeout(() => setIsJustAdded(false), 1000);
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove?.(app.id);
  };

  return (
    <div className={`relative bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow h-full
      ${isJustAdded ? 'animate-pulse ring-2 ring-blue-200' : ''}
    `}>
      <div className="absolute top-2 right-2 z-10">
        {onRemove ? (
          <button
            onClick={handleRemoveClick}
            className="text-red-500 hover:text-red-600 transition-colors px-2 py-1 rounded"
          >
            Remove
          </button>
        ) : (
          <button
            onClick={handleAddClick}
            className={`${
              isAdded 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            } px-3 py-1 rounded-full text-sm transition-colors`}
            disabled={isAdded}
          >
            {isAdded ? 'Added' : 'Add'}
          </button>
        )}
      </div>
      
      <Link 
        href={app.path} 
        className="flex items-start gap-4"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('button')) {
            e.preventDefault();
          }
        }}
      >
        <span className="text-3xl">{app.icon}</span>
        <div>
          <h2 className="text-xl font-bold mb-2">{app.name}</h2>
          <p className="text-gray-600">{app.description}</p>
          <div className="mt-2 text-sm text-gray-500">
            Category: {app.category}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AppCard; 