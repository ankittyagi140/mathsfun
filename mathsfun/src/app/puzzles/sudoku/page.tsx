'use client'; 
import React, { useState, useEffect } from 'react';
import Popup from '../../../components/Popup';

// Simplified 4x4 Sudoku generator with emoji support
const generateKidsSudoku = () => {
  // Predefined kid-friendly symbols (can be replaced with emojis)
  const symbols = [1, 2, 3, 4];
  const solution = [
    [1, 2, 3, 4],
    [3, 4, 1, 2],
    [2, 1, 4, 3],
    [4, 3, 2, 1]
  ];
  
  // Create puzzle by blanking out some cells
  return solution.map(row => 
    row.map(cell => Math.random() < 0.4 ? 0 : cell)
  );
};

// Add this proper generateSolution implementation
const generateSolution = (size: number): number[][] => {
  // Basic 4x4 solution pattern
  if (size === 4) {
    return [
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [2, 1, 4, 3],
      [4, 3, 2, 1]
    ];
  }

  // For larger grids, use a simple pattern (you can expand this later)
  const solution: number[][] = [];
  for (let i = 0; i < size; i++) {
    const row: number[] = [];
    for (let j = 0; j < size; j++) {
      row.push((i + j) % size + 1);
    }
    solution.push(row);
  }
  return solution;
};

// Update generateSudoku to handle initial state
const generateSudoku = (level: number) => {
  const { size, filledCells } = DIFFICULTY_LEVELS[Math.min(level - 1, DIFFICULTY_LEVELS.length - 1)];
  const solution = generateSolution(size);
  
  // Add null check for solution
  if (!solution || solution.length === 0) {
    console.error('Failed to generate solution');
    return [[]];
  }

  return solution.map(row => 
    row.map(cell => Math.random() < filledCells ? cell : 0)
  );
};

const SudokuPuzzle = () => {
  const [grid, setGrid] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [showHint, setShowHint] = useState(false);

  // Add emoji display for numbers
  const numberEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣'];
  
  // Add celebration animation
  const [isWinning, setIsWinning] = useState(false);

  const hintContent = (
    <div className="space-y-3">
      <div className="flex items-center gap-2 bg-yellow-50 p-3 rounded-lg">
        <span className="text-2xl">🔍</span>
        <p>Look for rows or columns that have 3 numbers already filled!</p>
      </div>
      <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg">
        <span className="text-2xl">🎯</span>
        <p>Start with numbers that only appear once in a row/column</p>
      </div>
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg">
        <span className="text-2xl">💡</span>
        <p>If you get stuck, try guessing and see if it creates duplicates!</p>
      </div>
    </div>
  );

  useEffect(() => {
    setGrid(generateKidsSudoku());
  }, []);

  const handleCellClick = (row: number, col: number) => {
    if (grid[row][col] === 0) {
      setSelectedCell({ row, col });
    }
  };

  const handleNumberInput = (number: number) => {
    if (!selectedCell) return;
    
    const newGrid = [...grid];
    newGrid[selectedCell.row][selectedCell.col] = number;
    setGrid(newGrid);
    validateGrid(newGrid);
  };

  const validateGrid = (currentGrid: number[][]) => {
    const newErrors = new Set<string>();
    
    // Check rows and columns for duplicates
    currentGrid.forEach((row, rowIndex) => {
      const rowItems = row.filter(x => x !== 0);
      if (new Set(rowItems).size !== rowItems.length) {
        row.forEach((_, colIndex) => newErrors.add(`${rowIndex}-${colIndex}`));
      }
    });

    for (let col = 0; col < 4; col++) {
      const columnItems = currentGrid.map(row => row[col]).filter(x => x !== 0);
      if (new Set(columnItems).size !== columnItems.length) {
        currentGrid.forEach((_, rowIndex) => newErrors.add(`${rowIndex}-${col}`));
      }
    }

    setErrors(newErrors);
    checkWinCondition(currentGrid);
  };

  const checkWinCondition = (currentGrid: number[][]) => {
    const isComplete = currentGrid.every(row => 
      row.every(cell => cell !== 0) && new Set(row).size === 4
    );
    if (isComplete) {
      setIsWinning(true);
      setTimeout(() => {
        setIsWinning(false);
        alert('🎉🌟 Amazing Job! You Solved the Puzzle! 🌟🎉');
      }, 500);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">     
      <main className="flex-1">
        <div className="container mx-auto p-4 min-h-screen p-8 bg-white bg-gray-50">
          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Instructions Section */}
            <div className="mb-6 bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
              <h2 className="text-xl font-bold text-yellow-600 mb-3 flex items-center gap-2">
                <span className="text-2xl">🐧</span> How to Play
              </h2>
              <ul className="space-y-2 text-yellow-800">
                <li className="flex items-center gap-2">
                  <span className="text-xl">👉</span> Click an empty box
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-xl">🎯</span> Choose a number below
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-xl">🚫</span> No repeats in rows or columns!
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-xl">🌈</span> Fill all boxes to win!
                </li>
              </ul>
            </div>

            {/* Game Grid */}
            <div className={`relative ${isWinning ? 'animate-bounce' : ''}`}>
              <h1 className="text-3xl font-bold mb-4 text-center text-blue-600">
                🧩 Kids Sudoku Fun!
              </h1>
              <div className="grid grid-cols-4 gap-1 bg-gray-100 p-2 rounded-xl">
                {grid.map((row, rowIndex) => (
                  row.map((value, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`
                        w-16 h-16 flex items-center justify-center text-3xl
                        ${value === 0 ? 'bg-white' : 'bg-blue-50'} 
                        ${selectedCell?.row === rowIndex && selectedCell?.col === colIndex ? 
                          'ring-4 ring-blue-300' : ''}
                        ${errors.has(`${rowIndex}-${colIndex}`) ? 
                          'bg-red-100 animate-shake' : ''}
                        rounded-lg shadow-sm cursor-pointer
                        transition-all duration-150
                      `}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                    >
                      {value !== 0 ? numberEmojis[value - 1] : ''}
                    </div>
                  ))
                ))}
              </div>
            </div>

            {/* Number Buttons */}
            <div className="mt-6 grid grid-cols-4 gap-2 p-2 bg-blue-50 rounded-xl">
              {[1, 2, 3, 4].map(num => (
                <button
                  key={num}
                  onClick={() => handleNumberInput(num)}
                  className="p-4 text-2xl bg-blue-500 text-white rounded-lg 
                    hover:bg-blue-600 active:scale-95 transition-all
                    shadow-lg hover:shadow-xl"
                >
                  {numberEmojis[num - 1]}
                </button>
              ))}
            </div>

            {/* Control Buttons */}
            <div className="mt-4 flex gap-2 justify-center">
              <button
                onClick={() => setGrid(generateKidsSudoku())}
                className="px-4 py-2 bg-green-500 text-white rounded-full
                  hover:bg-green-600 flex items-center gap-2"
              >
                <span>🔄</span> New Game
              </button>
              <button
                onClick={() => setShowHint(true)}
                className="px-4 py-2 bg-purple-500 text-white rounded-full
                  hover:bg-purple-600 flex items-center gap-2"
              >
                <span>💡</span> Hint
              </button>
            </div>

            {/* Progress Indicator */}
            <div className="mt-4 text-center text-gray-600">
              {isWinning ? (
                <div className="text-2xl animate-pulse">🎉 Winning! 🎉</div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl">🌟</span>
                  {grid.flat().filter(cell => cell === 0).length} boxes left
                  <span className="text-xl">🚀</span>
                </div>
              )}
            </div>
          </div>

          {showHint && (
            <Popup 
              title="Sudoku Help Tips 🧠" 
              onClose={() => setShowHint(false)}
            >
              {hintContent}
            </Popup>
          )}

          {/* <SudokuGame /> */}
        </div>
      </main>

     
    </div>
  );
};

export default SudokuPuzzle;