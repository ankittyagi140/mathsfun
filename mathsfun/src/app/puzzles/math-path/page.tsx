'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import Link from 'next/link';
import Header from '@/components/Header';
import Popup from '@/components/Popup';

type CellType = {
  value: string;
  isNumber: boolean;
  x: number;
  y: number;
};

const MathPathFinder = () => {
  const [grid, setGrid] = useState<CellType[][]>([]);
  const [target, setTarget] = useState(0);
  const [selectedPath, setSelectedPath] = useState<CellType[]>([]);
  const [isValidPath, setIsValidPath] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [showHint, setShowHint] = useState(false);
  const [showError, setShowError] = useState(false);
  const [pathHistory, setPathHistory] = useState<CellType[][]>([]);

  const generateNewPuzzle = () => {
    // Generate a 3x3 grid with numbers and operators
    const newGrid: CellType[][] = [];
    const numbers = Array.from({length: 5}, () => Math.floor(Math.random() * 9) + 1);
    const operators = ['+', '-', '×', '÷'];
    
    for (let y = 0; y < 3; y++) {
      const row: CellType[] = [];
      for (let x = 0; x < 3; x++) {
        const isNumber = (x + y) % 2 === 0; // Checkerboard pattern
        row.push({
          value: isNumber 
            ? numbers.pop()?.toString() || '4' 
            : operators[Math.floor(Math.random() * operators.length)],
          isNumber,
          x,
          y
        });
      }
      newGrid.push(row);
    }
    
    // Calculate valid target
    const solution = findValidSolution(newGrid);
    setTarget(solution.result);
    setGrid(newGrid);
    setSelectedPath([]);
    setHasWon(false);
    setIsValidPath(false);
    setHintsRemaining(3);
    setShowHint(false);
  };

  const findValidSolution = (grid: CellType[][]) => {
    // Simple solver to ensure at least one valid path exists
    const paths = [
      [grid[0][0], grid[0][1], grid[0][2], grid[1][2], grid[2][2]], // Right-right-down-down
      [grid[0][0], grid[1][0], grid[2][0], grid[2][1], grid[2][2]], // Down-down-right-right
      [grid[0][0], grid[0][1], grid[1][1], grid[1][2], grid[2][2]], // Diagonals
    ];

    for (const path of paths) {
      try {
        const equation = path.map(c => c.value).join('');
        const result = eval(equation.replace(/×/g, '*').replace(/÷/g, '/'));
        if (Number.isInteger(result) && result > 0) {
          return { path: [], result };
        }
      } catch {}
    }
    return { path: [], result: 10 }; // Fallback
  };

  useEffect(() => {
    generateNewPuzzle();
  }, []);

  const handleCellClick = (cell: CellType) => {
    if (selectedPath.length === 0 && !cell.isNumber) return;
    if (selectedPath.some(c => c.x === cell.x && c.y === cell.y)) return;

    const lastCell = selectedPath[selectedPath.length - 1];
    if (lastCell) {
      // Validate adjacency
      const xDiff = Math.abs(cell.x - lastCell.x);
      const yDiff = Math.abs(cell.y - lastCell.y);
      if (xDiff + yDiff !== 1) return;
      
      // Validate alternation
      if (cell.isNumber === lastCell.isNumber) return;
    }

    const newPath = [...selectedPath, cell];
    setPathHistory([...pathHistory, selectedPath]); // Save previous state
    setSelectedPath(newPath);
  };

  const validatePath = () => {
    try {
      if (selectedPath.length < 3) {
        setShowError(true);
        return;
      }
      
      const equation = selectedPath.map(c => c.value).join('');
      const result = eval(equation.replace(/×/g, '*').replace(/÷/g, '/'));
      const isValid = Math.abs(result - target) < 0.0001;

      if (isValid) {
        setHasWon(true);
        setShowError(false);
      } else {
        setShowError(true);
      }
    } catch {
      setShowError(true);
    }
  };

  const handleShowHint = () => {
    if (hintsRemaining > 0) {
      setShowHint(true);
      setHintsRemaining(prev => prev - 1);
    }
  };

  const handleUndo = () => {
    if (pathHistory.length > 0) {
      const previousPath = pathHistory[pathHistory.length - 1];
      setSelectedPath(previousPath);
      setPathHistory(pathHistory.slice(0, -1));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-purple-600">
          🧩 Math Path Finder
        </h1>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Instructions Section */}
          <div className="mb-6 bg-yellow-50 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <span className="text-2xl">📝</span> How to Play
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Click numbers (blue) to start your path</li>
              <li>Alternate with operators (green)</li>
              <li>Create equations matching the target</li>
              <li>Move horizontally or vertically</li>
            </ul>
          </div>

          {/* Game Grid */}
          <div className="grid grid-cols-3 gap-2 bg-gray-200 p-2 rounded-lg mb-6">
            {grid.map((row, y) =>
              row.map((cell, x) => (
                <button
                  key={`${x}-${y}`}
                  onClick={() => handleCellClick(cell)}
                  className={`aspect-square flex items-center justify-center text-xl font-bold
                    ${cell.isNumber ? 'bg-blue-100' : 'bg-green-100'}
                    ${selectedPath.some(c => c.x === x && c.y === y) 
                      ? 'ring-4 ring-purple-400' : ''}
                    rounded-lg transition-all`}
                >
                  {cell.value}
                </button>
              ))
            )}
          </div>

          {/* Target & Status */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2">🎯 Target</h3>
              <p className="text-2xl font-mono">{target}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2">📝 Current Equation</h3>
              <p className="text-xl font-mono">
                {selectedPath.map(c => c.value).join(' ') || 'Start your path!'}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 flex gap-4 justify-center">
            <button
              onClick={handleUndo}
              disabled={pathHistory.length === 0}
              className="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 disabled:opacity-50"
            >
              ↩️ Undo
            </button>
            <button
              onClick={validatePath}
              className="px-4 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600"
            >
              ✅ Check Path
            </button>
            <button
              onClick={generateNewPuzzle}
              className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              🔄 New Puzzle
            </button>
            <button
              onClick={() => setShowHelp(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            >
              🆘 Need Help?
            </button>
          </div>
        </div>

        {/* Help Popup */}
        {showHelp && (
          <Popup title="Math Path Help" onClose={() => setShowHelp(false)}>
            <div className="space-y-4">
              <p>✨ Build equations to reach the target! ✨</p>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <span className="font-bold">Tips:</span>
                <ul className="list-disc pl-5 mt-2">
                  <li>Start with multiplication/division first</li>
                  <li>Use parentheses mentally</li>
                  <li>Try different path lengths</li>
                </ul>
              </div>
              <p className="text-center">🎮 Happy calculating! ➗</p>
            </div>
          </Popup>
        )}

        {/* Win Popup */}
        {hasWon && (
          <Popup title="🎉 Congratulations!" onClose={() => setHasWon(false)}>
            <div className="text-center p-4">
              <p className="text-xl mb-4">You found the correct path! 🏆</p>
              <button
                className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                onClick={generateNewPuzzle}
              >
                Play Again
              </button>
              <Confetti recycle={false} numberOfPieces={500} />
            </div>
          </Popup>
        )}

        {showError && (
          <Popup title="⚠️ Oops! Try Again" onClose={() => setShowError(false)}>
            <div className="text-center p-4">
              <p className="text-xl mb-4">
                {selectedPath.length < 3 
                  ? "Path too short! Need at least 3 cells"
                  : "That equation doesn't match the target"}
              </p>
              <button
                className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                onClick={() => setShowError(false)}
              >
                Try Again
              </button>
            </div>
          </Popup>
        )}
      </div>
    </div>
  );
};

export default MathPathFinder; 