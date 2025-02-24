'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Zap, Clock, Star, Info, Smile, Gamepad } from 'lucide-react';

// First define the proper Puzzle interface
interface Puzzle {
  type: 'multiple' | 'sequence' | 'parity' | 'prime';
  numbers: number[];
  answer: number;
  correctIndex: number;
  hint: string;
}

// Update puzzle generators to include all required properties
const puzzleTypes = [
  {
    type: 'multiple' as const,
    generate: () => {
      const base = Math.floor(Math.random() * 5) + 2;
      const numbers = [base*2, base*3, base*4, base*5, base*7];
      const answer = base*7;
      // Shuffle and find index
      const shuffled = shuffleArray(numbers);
      return {
        numbers: shuffled,
        answer,
        correctIndex: shuffled.indexOf(answer),
        hint: `All numbers except one are multiples of ${base}`
      };
    }
  },
  {
    type: 'sequence' as const,
    generate: () => {
      const start = Math.floor(Math.random() * 10) + 1;
      const numbers = [start, start+2, start+4, start+6, start+7];
      const answer = start+7;
      const shuffled = shuffleArray(numbers);
      return {
        numbers: shuffled,
        answer,
        correctIndex: shuffled.indexOf(answer),
        hint: `The sequence follows a pattern except for one number`
      };
    }
  },
  {
    type: 'parity' as const,
    generate: () => {
      const evenCount = Math.random() > 0.5;
      const numbers = Array(4).fill(null).map(() => {
        const base = Math.floor(Math.random() * 10) * 2;
        return evenCount ? base : base + 1;
      });
      
      // Add the odd one out
      const answer = evenCount 
        ? numbers[0] + 1  // Make odd
        : numbers[0] - 1; // Make even
        
      numbers.push(answer);
      const shuffled = shuffleArray(numbers);
      
      return {
        numbers: shuffled,
        answer: answer,
        correctIndex: shuffled.indexOf(answer),
        hint: evenCount 
          ? "All numbers are even except one" 
          : "All numbers are odd except one",
        type: 'parity'
      };
    }
  },
  // Add other puzzle types with same structure
];

// Helper function to shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

// Update generatePuzzle to return full Puzzle type
const generatePuzzle = (): Puzzle => {
  const selectedType = puzzleTypes[Math.floor(Math.random() * puzzleTypes.length)];
  return {
    type: selectedType.type,
    ...selectedType.generate()
  };
};

export default function OddOneOut() {
  const [puzzle, setPuzzle] = useState<Puzzle>(() => ({
    numbers: [],
    correctIndex: -1,
    hint: '',
    answer: -1,
    type: 'multiple'
  }));
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    setIsClient(true);
    setPuzzle(generatePuzzle());
  }, []);

  // Game timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    
    if (index === puzzle.correctIndex) {
      setScore(s => s + 10);
      setIsCelebrating(true);
      
      setTimeout(() => {
        setPuzzle(generatePuzzle());
        setIsCelebrating(false);
        setSelectedIndex(-1)
      }, 2500);
    } else {
      setScore(s => Math.max(0, s - 2));
    }
  };

  const handleHint = () => {
    if (hintsUsed < 3) {
      setHintsUsed(prev => prev + 1);
      setShowHint(true);
      setTimeout(() => setShowHint(false), 3000);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-md mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">
            🔢 Odd One Out
          </h1>
          
          {/* Progress & Stats */}
          <div className="bg-white p-4 rounded-xl shadow-lg mb-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-100 p-2 rounded-lg">
                <div className="flex items-center justify-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{timeElapsed}s</span>
                </div>
                <span className="text-xs text-gray-600">Time</span>
              </div>
              <div className="bg-yellow-100 p-2 rounded-lg">
                <div className="flex items-center justify-center gap-1">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm">{score}</span>
                </div>
                <span className="text-xs text-gray-600">Score</span>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <div className="flex items-center justify-center gap-1">
                  <Lightbulb className="w-4 h-4" />
                  <span className="text-sm">{3 - hintsUsed}</span>
                </div>
                <span className="text-xs text-gray-600">Hints</span>
              </div>
            </div>
          </div>
        </div>

        {/* Puzzle Area */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Puzzle Type Indicator */}
          {isClient && (
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500">
                {puzzle.type.charAt(0).toUpperCase() + puzzle.type.slice(1)} Puzzle
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm">+10 per correct</span>
              </div>
            </div>
          )}

          {/* Numbers Grid */}
          {isClient ? (
            <div className="grid grid-cols-2 gap-4 mb-6">
              {puzzle.numbers.map((number, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleSelect(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-4 text-xl font-bold rounded-lg transition-colors
                    ${selectedIndex === index 
                      ? index === puzzle.correctIndex 
                        ? 'bg-green-100 border-2 border-green-500' 
                        : 'bg-red-100 border-2 border-red-500'
                      : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  {number}
                </motion.button>
              ))}
            </div>
          ) : (
            Array(4).fill(0).map((_, index) => (
              <div 
                key={index}
                className="p-4 text-xl font-bold rounded-lg bg-gray-100 animate-pulse"
              />
            ))
          )}

          {/* Hint System */}
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-50 p-3 rounded-lg mb-4 flex items-start gap-2"
            >
              <Smile className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <div>
                <p className="text-sm text-yellow-800 font-medium">Hint Helper:</p>
                <p className="text-sm text-yellow-800">{puzzle.hint}</p>
              </div>
            </motion.div>
          )}

          {/* Controls */}
          <div className="flex justify-between gap-4">
            <button
              onClick={handleHint}
              disabled={hintsUsed >= 3}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              <Lightbulb className="w-4 h-4" />
              Get Hint
            </button>
            <button
              onClick={() => setPuzzle(generatePuzzle())}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Skip Puzzle
            </button>
          </div>
        </div>

        {/* Celebration Effects */}
        <AnimatePresence>
          {isCelebrating && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 text-center"
            >
              <div className="bg-white p-8 rounded-2xl shadow-xl border-4 border-blue-500">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 20, -20, 0],
                  }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <Star className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                </motion.div>
                
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Great Job! 🎉
                </h2>
                <p className="text-lg mb-4">You found the odd one out!</p>
                
                <button
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:scale-105 transition-transform"
                  onClick={() => {
                    setPuzzle(generatePuzzle());
                    setIsCelebrating(false);
                  }}
                >
                  Next Puzzle
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions Modal */}
        {showInstructions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center gap-2 mb-4">
                <Gamepad className="w-8 h-8 text-blue-500" />
                <h2 className="text-2xl font-bold">How to Play</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Star className="flex-shrink-0 w-6 h-6 text-yellow-500" />
                  <p>
                    <strong>Goal:</strong> Find the number that doesn`&lsquo;`t belong!
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <Smile className="flex-shrink-0 w-6 h-6 text-green-500" />
                  <div>
                    <p className="font-medium mb-1">Look for:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Even/Odd numbers</li>
                      <li>Prime numbers</li>
                      <li>Number patterns</li>
                      <li>Multiples</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Info className="flex-shrink-0 w-6 h-6 text-blue-500" />
                  <p>
                    <strong>Tip:</strong> Use hints when stuck! 
                    <span className="text-sm text-gray-600">(3 per game)</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowInstructions(false)}
                className="mt-6 w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-bold"
              >
                Start Playing! 🎮
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
