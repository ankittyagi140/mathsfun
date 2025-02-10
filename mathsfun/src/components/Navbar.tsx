export default function Navbar() {
  return (
    <nav aria-label="Main navigation">
      <ul className="flex space-x-4">
        <li>
          <a 
            href="/quizzes" 
            className="text-blue-700 hover:text-blue-900"
            aria-current="page"
          >
            Quizzes
          </a>
        </li>
        {/* ... */}
      </ul>
    </nav>
  );
} 