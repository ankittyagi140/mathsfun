'use client';
import { useState, useEffect, useCallback } from 'react';
import Popup from '../../../components/Popup';

type Cell = {
  letter: string;
  number?: number;
  isBlack: boolean;
};

const initialGrid: Cell[][] = [
  [
    { letter: 'C', number: 1, isBlack: false },
    { letter: 'A', isBlack: false },
    { letter: 'T', isBlack: false },
    { letter: '', isBlack: true },
    { letter: '', isBlack: false },
  ],
  [
    { letter: '', isBlack: false },
    { letter: '', isBlack: false },
    { letter: 'O', isBlack: false },
    { letter: '', isBlack: true },
    { letter: '', isBlack: false },
  ],
  [
    { letter: 'D', number: 2, isBlack: false },
    { letter: 'O', isBlack: false },
    { letter: 'G', isBlack: false },
    { letter: '', isBlack: false },
    { letter: '', isBlack: true },
  ],
  [
    { letter: '', isBlack: true },
    { letter: '', isBlack: false },
    { letter: '', isBlack: false },
    { letter: '', isBlack: true },
    { letter: '', isBlack: false },
  ],
  [
    { letter: '', isBlack: false },
    { letter: '', isBlack: true },
    { letter: '', isBlack: false },
    { letter: '', isBlack: false },
    { letter: '', isBlack: false },
  ],
];

const CrosswordPuzzle = () => {
  const [grid, setGrid] = useState<Cell[][]>(initialGrid);
  const [selectedCell, setSelectedCell] = useState<{row: number; col: number} | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [direction, setDirection] = useState<'across'|'down'>('across');

  const handleCellClick = (row: number, col: number) => {
    if (grid[row][col].isBlack) return;
    setSelectedCell({ row, col });
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    const newGrid = [...grid];
    
    if (e.key.match(/^[a-z]$/i)) {
      newGrid[row][col].letter = e.key.toUpperCase();
      setGrid(newGrid);
      moveToNextCell();
    }
  }, [selectedCell, grid, moveToNextCell]);

  const moveToNextCell = useCallback(() => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
       
    if (direction === 'across' && col < grid[0].length - 1) {
      setSelectedCell({ row, col: col + 1 });
    } else if (direction === 'down' && row < grid.length - 1) {
      setSelectedCell({ row: row + 1, col });
    }
  }, [selectedCell, direction, grid]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedCell, direction, handleKeyPress]);

  const checkCompletion = () => {
    return grid.every(row => 
      row.every(cell => 
        cell.isBlack || cell.letter !== ''
      )
    );
  };

  return (
    <div className="min-h-screen p-8 bg-white bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
          🧩 Kids Crossword
        </h1>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Instructions */}
          <div className="mb-6 bg-yellow-50 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <span className="text-2xl">📝</span> How to Play
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Click a numbered box to start</li>
              <li>Type letters to fill words</li>
              <li>Press → ← ↑ ↓ to move between boxes</li>
              <li>Double-click to switch direction (Across ↔ Down)</li>
            </ul>
          </div>

          {/* Crossword Grid */}
          <div className="grid grid-cols-5 gap-px bg-gray-200 mb-6">
            {grid.map((row, rowIndex) => (
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    relative aspect-square flex items-center justify-center
                    text-xl font-bold cursor-pointer
                    ${cell.isBlack ? 'bg-gray-800' : 'bg-white'}
                    ${selectedCell?.row === rowIndex && selectedCell?.col === colIndex 
                      ? 'ring-4 ring-blue-400' : ''}
                  `}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onDoubleClick={() => setDirection(prev => prev === 'across' ? 'down' : 'across')}
                >
                  {cell.number && (
                    <span className="absolute top-0 left-0 text-xs p-0.5">
                      {cell.number}
                    </span>
                  )}
                  {cell.letter}
                </div>
              ))
            ))}
          </div>

          {/* Clues */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2">Across ➡️</h3>
              <p>1. Small furry animal (3 letters)</p>
              <p>3. Loyal pet (3 letters)</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2">Down ⬇️</h3>
              <p>2. Best friend of man (3 letters)</p>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 flex gap-4 justify-center">
            <button
              onClick={() => setShowHelp(true)}
              className="px-4 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600"
            >
              🆘 Need Help?
            </button>
            <button
              onClick={() => setGrid(initialGrid)}
              className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              🔄 Reset Puzzle
            </button>
          </div>
        </div>

        {/* Help Popup */}
        {showHelp && (
          <Popup title="Crossword Help" onClose={() => setShowHelp(false)}>
            <div className="space-y-4">
              <p>✨ Find all the hidden words! ✨</p>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <span className="font-bold">Tips:</span>
                <ul className="list-disc pl-5 mt-2">
                  <li>Start with short words first</li>
                  <li>Look for overlapping letters</li>
                  <li>Use the clues to help guess</li>
                </ul>
              </div>
              <p className="text-center">🎮 Happy puzzling! 🧩</p>
            </div>
          </Popup>
        )}

        {/* Completion Popup */}
        {checkCompletion() && (
          <Popup title="🎉 Congratulations!" onClose={() => setShowHelp(false)}>
            <div className="text-center p-4">
              <p className="text-xl mb-4">You solved the crossword! 🏆</p>
              <button
                className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                onClick={() => setGrid(initialGrid)}
              >
                Play Again
              </button>
            </div>
          </Popup>
        )}
      </div>
    </div>
  );
};

export default CrosswordPuzzle;
