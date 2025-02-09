'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import Link from 'next/link';
import Header from '@/components/Header';
import Popup from '@/components/Popup';

const MagicSquare = () => {
  const [grid, setGrid] = useState<number[][]>([]);
  const [targetSum, setTargetSum] = useState(0);
  const [selectedCell, setSelectedCell] = useState<{row: number; col: number} | null>(null);
  const [hasWon, setHasWon] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const generateNewPuzzle = () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
    const newGrid = [
      numbers.slice(0, 3),
      numbers.slice(3, 6),
      numbers.slice(6, 9)
    ];
    setGrid(newGrid);
    setTargetSum(15); // Magic constant for 3x3
    setHasWon(false);
  };

  const checkMagicSquare = (currentGrid: number[][]) => {
    const magicSum = 15;
    // Check rows
    for (let row of currentGrid) {
      if (row.reduce((a, b) => a + b, 0) !== magicSum) return false;
    }
    // Check columns
    for (let col = 0; col < 3; col++) {
      const colSum = currentGrid[0][col] + currentGrid[1][col] + currentGrid[2][col];
      if (colSum !== magicSum) return false;
    }
    // Check diagonals
    const diag1 = currentGrid[0][0] + currentGrid[1][1] + currentGrid[2][2];
    const diag2 = currentGrid[0][2] + currentGrid[1][1] + currentGrid[2][0];
    return diag1 === magicSum && diag2 === magicSum;
  };

  const handleNumberSwap = (row: number, col: number) => {
    if (!selectedCell) {
      setSelectedCell({ row, col });
      return;
    }

    // Swap numbers
    const newGrid = [...grid];
    const temp = newGrid[row][col];
    newGrid[row][col] = newGrid[selectedCell.row][selectedCell.col];
    newGrid[selectedCell.row][selectedCell.col] = temp;
    
    setGrid(newGrid);
    setSelectedCell(null);
    
    if (checkMagicSquare(newGrid)) {
      setHasWon(true);
    }
  };

  useEffect(() => {
    generateNewPuzzle();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-white bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-purple-600">
          🧙 Magic Square
        </h1>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Instructions */}
          <div className="mb-6 bg-yellow-50 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <span className="text-2xl">📝</span> How to Play
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Click two numbers to swap their positions</li>
              <li>All rows, columns, and diagonals must sum to {targetSum}</li>
              <li>Use numbers 1-9 exactly once</li>
            </ul>
          </div>

          {/* Game Grid */}
          <div className="grid grid-cols-3 gap-2 bg-gray-200 p-2 rounded-lg mb-6">
            {grid.map((row, rowIndex) =>
              row.map((number, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleNumberSwap(rowIndex, colIndex)}
                  className={`aspect-square flex items-center justify-center text-2xl font-bold
                    ${selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                      ? 'bg-purple-200 ring-4 ring-purple-400'
                      : 'bg-white hover:bg-blue-50'}
                    transition-all duration-200 rounded-lg`}
                >
                  {number}
                </button>
              ))
            )}
          </div>

          {/* Controls */}
          <div className="mt-6 flex gap-4 justify-center">
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
          <Popup title="Magic Square Tips" onClose={() => setShowHelp(false)}>
            <div className="space-y-4">
              <p>✨ Arrange numbers so every line sums to {targetSum}! ✨</p>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <span className="font-bold">Tips:</span>
                <ul className="list-disc pl-5 mt-2">
                  <li>Place 5 in the center</li>
                  <li>Even numbers in corners</li>
                  <li>Odd numbers on edges</li>
                </ul>
              </div>
              <p className="text-center">🎮 Happy puzzling! 🧩</p>
            </div>
          </Popup>
        )}

        {/* Win Popup */}
        {hasWon && (
          <Popup title="🎉 Congratulations!" onClose={() => setHasWon(false)}>
            <div className="text-center p-4">
              <div className="text-4xl mb-4">✨ Perfect Magic Square! ✨</div>
              <p className="text-xl mb-6">All rows, columns, and diagonals sum to {targetSum} 🏆</p>
              <div className="flex gap-4 justify-center">
                <button
                  className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                  onClick={generateNewPuzzle}
                >
                  Play Again
                </button>
                <Link
                  href="/puzzles"
                  className="px-6 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600"
                >
                  More Puzzles
                </Link>
              </div>
              <Confetti 
                recycle={false} 
                numberOfPieces={500}
                colors={['#FF69B4', '#4B0082', '#00BFFF']}
              />
            </div>
          </Popup>
        )}
      </div>
    </div>
  );
};

export default MagicSquare; 