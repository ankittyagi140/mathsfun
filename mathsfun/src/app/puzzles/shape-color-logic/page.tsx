'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Lightbulb, Sparkles, Shapes } from 'lucide-react';
import Confetti from 'react-confetti';

type Shape = {
  type: 'circle' | 'square' | 'triangle' | 'star';
  color: string;
  size: number;
  rotation: number;
};

type Puzzle = {
  shapes: Shape[];
  correctIndex: number;
  logicRule: string;
  hint: string;
};

const generatePuzzle = (): Puzzle => {
  const rules = [
    {
      name: 'color-progression',
      generate: () => {
        const colors = ['#FF6B6B', '#4D96FF', '#6BCB77', '#FFD93D'];
        const correctColor = colors.pop()!;
        const baseColor = colors[0];
        const oddShape = {
          type: 'circle' as const,
          color: correctColor,
          size: 80,
          rotation: 0
        };
        
        return {
          shapes: [
            ...Array(3).fill({ 
              type: 'circle' as const,
              color: baseColor,
              size: 80,
              rotation: 0
            }),
            oddShape
          ],
          logicRule: 'Color progression',
          hint: 'Look at the color sequence!'
        };
      }
    },
    {
      name: 'shape-pattern',
      generate: () => {
        const shapes: ('circle' | 'square' | 'triangle')[] = ['circle', 'square', 'triangle'];
        const oddShape = {
          type: 'star' as const,
          color: '#FF6B6B',
          size: 80,
          rotation: 0
        };
        
        return {
          shapes: [
            ...shapes.map(shape => ({
              type: shape,
              color: '#FF6B6B',
              size: 80,
              rotation: 0
            })),
            oddShape
          ],
          logicRule: 'Shape pattern',
          hint: 'Follow the shape order!'
        };
      }
    },
    {
      name: 'rotation-sequence',
      generate: () => {
        const rotations = [0, 90, 180];
        const oddRotation = 270;
        const baseShape = {
          type: 'triangle' as const,
          color: '#4D96FF',
          size: 80
        };
        
        return {
          shapes: [
            ...rotations.map(rotation => ({
              ...baseShape,
              rotation
            })),
            {
              ...baseShape,
              rotation: oddRotation
            }
          ],
          logicRule: 'Rotation pattern',
          hint: 'Check the rotation angles!'
        };
      }
    }
  ];

  const selectedRule = rules[Math.floor(Math.random() * rules.length)];
  const puzzle = selectedRule.generate();
  
  // Shuffle and find correct index
  const shuffled = [...puzzle.shapes].sort(() => Math.random() - 0.5);
  const correctIndex = shuffled.findIndex(shape => 
    shape.color !== puzzle.shapes[0].color ||
    shape.type !== puzzle.shapes[0].type ||
    shape.rotation !== puzzle.shapes[0].rotation
  );

  return {
    shapes: shuffled,
    correctIndex: correctIndex !== -1 ? correctIndex : 3,
    logicRule: puzzle.logicRule,
    hint: puzzle.hint
  };
};

export default function ShapeColorLogic() {
  const [puzzle, setPuzzle] = useState<Puzzle>(generatePuzzle());
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    
    // Check against the actual pattern
    const isCorrect = index === puzzle.correctIndex;
    
    if (isCorrect) {
      setScore(s => s + 10);
      setIsCelebrating(true);
      setTimeout(() => {
        setPuzzle(generatePuzzle());
        setIsCelebrating(false);
        setSelectedIndex(null)
      }, 2000);
    } else {
      setScore(s => Math.max(0, s - 2));
      // Show visual feedback for incorrect selection
      setTimeout(() => setSelectedIndex(null), 500);
    }
  };

  const handleHint = () => {
    if (hintsUsed < 3) {
      setHintsUsed(h => h + 1);
      setScore(s => Math.max(0, s - 1));
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-purple-600 mb-6 text-center">
          🔷 Shape Logic
        </h1>

        {/* Instructions Modal */}
        {showInstructions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center gap-2 mb-4">
                <Shapes className="w-8 h-8 text-purple-500" />
                <h2 className="text-2xl font-bold">How to Play</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="flex-shrink-0 w-6 h-6 text-yellow-500" />
                  <p>
                    <strong>Goal:</strong> Find the shape that breaks the pattern!
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <Info className="flex-shrink-0 w-6 h-6 text-blue-500" />
                  <div>
                    <p className="font-medium mb-1">Look for:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Color patterns</li>
                      <li>Shape sequences</li>
                      <li>Rotation angles</li>
                      <li>Size changes</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowInstructions(false)}
                className="mt-6 w-full py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-bold"
              >
                Start Playing! 🎮
              </button>
            </motion.div>
          </div>
        )}

        {/* Game Area */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-purple-600">Score: {score}</span>
              <div className="flex gap-1">
                {[...Array(3 - hintsUsed)].map((_, i) => (
                  <Lightbulb key={i} className="w-5 h-5 text-yellow-400" />
                ))}
              </div>
            </div>
            <button
              onClick={handleHint}
              disabled={hintsUsed >= 3}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 disabled:opacity-50"
            >
              <Lightbulb className="w-5 h-5" />
              Hint ({3 - hintsUsed})
            </button>
          </div>

          {/* Shapes Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {puzzle.shapes.map((shape, index) => {
              const isCorrectAnswer = index === puzzle.correctIndex;
              const isSelected = selectedIndex === index;
              
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? isCorrectAnswer
                        ? 'bg-green-100 border-4 border-green-500'
                        : 'bg-red-100 border-4 border-red-500'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  onClick={() => handleSelect(index)}
                >
                  <div className="flex items-center justify-center">
                    <div
                      className={`transform transition-transform duration-300`}
                      style={{
                        width: `${shape.size}px`,
                        height: `${shape.size}px`,
                        backgroundColor: shape.color,
                        rotate: `${shape.rotation}deg`,
                        clipPath: shape.type === 'star' ? 
                          'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' :
                          shape.type === 'triangle' ?
                          'polygon(50% 0%, 0% 100%, 100% 100%)' :
                          shape.type === 'square' ? 'none' : 'circle(50%)'
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Hint Display */}
          {hintsUsed > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-yellow-50 p-3 rounded-lg flex items-start gap-2"
            >
              <Info className="w-5 h-5 text-yellow-600" />
              <p className="text-sm text-yellow-800">{puzzle.hint}</p>
            </motion.div>
          )}
        </div>

        {/* Celebration Effects */}
        <AnimatePresence>
          {isCelebrating && (
            <>
              <Confetti 
                recycle={false} 
                numberOfPieces={300}
                colors={['#FF6B6B', '#4D96FF', '#6BCB77']}
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 text-center"
              >
                <div className="bg-white p-8 rounded-2xl shadow-xl border-4 border-purple-500">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 20, -20, 0],
                    }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <Sparkles className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                  </motion.div>
                  <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Perfect! 🎉
                  </h2>
                  <button
                    className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:scale-105 transition-transform"
                    onClick={() => setPuzzle(generatePuzzle())}
                  >
                    Next Puzzle
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
