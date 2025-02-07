import GameCard from '../../components/GameCard';

export default function PuzzlesPage() {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
        🎮 All Math Games
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Existing Games */}
        <GameCard
          title="Sudoku"
          description="Number placement puzzle"
          href="/puzzles/sudoku"
          emoji="🧩"
        />

        {/* Add Crossword Puzzle Entry */}
        <GameCard
          title="Crossword Puzzle"
          description="Find hidden words across and down"
          href="/puzzles/crossword"
          emoji="🔠"
        />

        {/* ... other game cards ... */}
      </div>
    </div>
  );
}
