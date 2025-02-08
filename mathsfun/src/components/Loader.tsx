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
    <div
      role="status"
      aria-label="Loading"
      className={cn('animate-spin', sizes[size], color, className)}
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
  );
} 