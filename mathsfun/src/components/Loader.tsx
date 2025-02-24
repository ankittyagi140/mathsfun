import { cn } from '@/lib/utils';

type LoaderProps = {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
};

export default function Loader({ size = 'md', color = 'text-blue-600', className }: LoaderProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/10 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-2xl shadow-xl">
        <div
          role="status"
          aria-label="Loading"
          className={cn(
            'animate-spin rounded-full border-4 border-t-transparent',
            sizes[size],
            color,
            className
          )}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="opacity-75"
          >
            <path
              d="M12 2a10 10 0 1 0 10 10"
              strokeLinecap="round"
              className="text-current"
            />
          </svg>
        </div>
        <p className="text-lg font-medium text-gray-700">Loading...</p>
      </div>
    </div>
  );
} 