import Link from 'next/link';

export default function Navbar() {
  return (
    <nav aria-label="Main navigation">
      <ul className="flex space-x-4">
        <li>
          <Link 
            href="/quizzes" 
            className="text-blue-700 hover:text-blue-900"
            aria-current="page"
          >
            Quizzes
          </Link>
        </li>
        {/* ... */}
      </ul>
    </nav>
  );
} 