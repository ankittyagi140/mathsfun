'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import Link from 'next/link';
import Popup from '@/components/Popup';
import { Howl } from 'howler';

type Cell = {
  value: number;
  isStart: boolean;
  isEnd: boolean;
  isPath: boolean;
};

const NumberMaze = () => {
  const [grid, setGrid] = useState<Cell[][]>(() => {
    const size = 5;
    return Array(size).fill(null).map(() => 
      Array(size).fill({ value: 0, isStart: false, isEnd: false, isPath: false })
    );
  });
  const [currentPath, setCurrentPath] = useState<[number, number][]>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [moves, setMoves] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  const playSound = (sound: 'move' | 'win' | 'error') => {
    const sounds = {
      move: new Howl({ src: ['/sounds/pop.mp3'] }),
      win: new Howl({ src: ['/sounds/win.mp3'] }),
      error: new Howl({ src: ['/sounds/error.mp3'] })
    };
    sounds[sound].play();
  };

  useEffect(() => {
    const initializeGame = () => {
      const size = 5;
      const newGrid: Cell[][] = [];
      
      for (let i = 0; i < size; i++) {
        newGrid[i] = [];
        for (let j = 0; j < size; j++) {
          newGrid[i][j] = {
            value: Math.floor(Math.random() * 3) + 1,
            isStart: i === 0 && j === 0,
            isEnd: i === size - 1 && j === size - 1,
            isPath: false
          };
        }
      }

      newGrid[0][0].isPath = true;
      setGrid(newGrid);
      setCurrentPath([[0, 0]]);
      setMoves(0);
      setGameStatus('playing');
    };

    initializeGame();
  }, []);

  const getCellClasses = (row: number, col: number) => {
    const isCurrent = currentPath[currentPath.length - 1]?.[0] === row && 
                      currentPath[currentPath.length - 1]?.[1] === col;
    const isVisited = currentPath.some(([r, c]) => r === row && c === col);
    
    let classes = 'w-16 h-16 flex items-center justify-center text-3xl rounded-lg ';
    
    if (isCurrent) {
      classes += 'bg-yellow-200 scale-110 shadow-lg';
    } else if (isVisited) {
      classes += 'bg-green-100 scale-100 shadow-md';
    } else if (grid[row][col].isStart) {
      classes += 'bg-blue-200 shadow-md';
    } else if (grid[row][col].isEnd) {
      classes += 'bg-red-200 shadow-md';
    } else {
      classes += 'bg-white shadow-sm';
    }
    
    return classes;
  };

  const handleCellClick = (row: number, col: number) => {
    if (gameStatus !== 'playing' || !grid || grid.length === 0) return;

    const lastPosition = currentPath[currentPath.length - 1];
    if (!lastPosition) return;

    const [lastRow, lastCol] = lastPosition;
    const distance = Math.abs(row - lastRow) + Math.abs(col - lastCol);
    const cellValue = grid[lastRow][lastCol].value;

    if (distance === cellValue) {
      const newPath = [...currentPath, [row, col]];
      setCurrentPath(newPath);
      setMoves(moves + 1);
      playSound('move');

      if (row === grid.length - 1 && col === grid.length - 1) {
        playSound('win');
        setGameStatus('won');
      }
    } else {
      playSound('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
          🏰 Number Maze
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="mb-6 bg-yellow-50 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <span className="text-2xl">📚</span> How to Play
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Start at the <span className="font-semibold text-blue-600">blue flag</span> 🚩</li>
              <li>Click animals to move their number of spaces</li>
              <li>🐭 moves 1 space, 🐹 moves 2 spaces, 🐻 moves 3 spaces</li>
              <li>Reach the <span className="font-semibold text-red-600">finish flag</span> 🏁 to win!</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col items-center gap-4">
              <div className="inline-grid grid-cols-5 gap-2 mb-6">
                {grid?.map((row, rowIndex) =>
                  row?.map((cell, colIndex) => (
                    <motion.div
                      key={`${rowIndex}-${colIndex}`}
                      className={`${getCellClasses(rowIndex, colIndex)} cursor-pointer transition-all duration-200`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <div className="relative">
                        <span className="text-3xl">
                          {cell.value === 1 ? '🐭' : 
                           cell.value === 2 ? '🐹' : 
                           '🐻'}
                        </span>
                        {cell.isStart && <div className="absolute top-0 right-0 text-sm">🚩</div>}
                        {cell.isEnd && <div className="absolute top-0 right-0 text-sm">🏁</div>}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              <div className="w-full bg-gray-100 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Moves: {moves}</span>
                  <button
                    onClick={() => setShowHelp(true)}
                    className="px-4 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 text-sm"
                  >
                    🆘 Need Help?
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2">🐾 Animal Moves</h3>
              <ul className="space-y-2">
                <li>🐭 Mouse - 1 space</li>
                <li>🐹 Hamster - 2 spaces</li>
                <li>🐻 Bear - 3 spaces</li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2">🎮 Game Rules</h3>
              <ul className="space-y-2">
                <li>Move exactly the shown number</li>
                <li>Move horizontally or vertically</li>
                <li>Plan your path carefully!</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center gap-2"
            >
              🔄 New Game
            </button>
            <Link
              href="/puzzles"
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 text-center"
            >
              ← Back to Puzzles
            </Link>
          </div>
        </div>

        {showHelp && (
          <Popup title="Maze Help Guide" onClose={() => setShowHelp(false)}>
            <div className="space-y-4">
              <div className="bg-yellow-100 p-4 rounded-lg">
                <h4 className="font-bold mb-2">🌟 Pro Tips:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Start by planning your route backwards from the finish</li>
                  <li>Look for chains of matching numbers</li>
                  <li>Use bears (3) for long jumps</li>
                  <li>Mice (1) are great for final adjustments</li>
                </ul>
              </div>
              <p className="text-center text-lg">🎮 Happy maze solving! 🧩</p>
            </div>
          </Popup>
        )}

        {gameStatus === 'won' && (
          <Popup title="🎉 Congratulations!" onClose={() => {}}>
            <div className="text-center p-4">
              <p className="text-xl mb-4">You solved the maze in {moves} moves! 🏆</p>
              <button
                className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                onClick={() => window.location.reload()}
              >
                Play Again
              </button>
            </div>
            <Confetti recycle={false} numberOfPieces={500} />
          </Popup>
        )}
      </main>
    </div>
  );
};

export default NumberMaze;
