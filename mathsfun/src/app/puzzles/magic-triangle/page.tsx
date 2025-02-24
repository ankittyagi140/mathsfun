'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCw, Lightbulb, PartyPopper, Sparkles, Smile, Trophy, Gamepad } from 'lucide-react';
import Confetti from 'react-confetti';
import { Howl } from 'howler';

type TriangleState = {
  top: number | null;
  left: number | null;
  right: number | null;
  bottomLeft: number | null;
  bottomRight: number | null;
  bottom: number | null;
};

const generatePuzzle = () => {
  const targetSum = 20; // Can be made dynamic for different difficulty levels
  const numbers = [1, 2, 3, 4, 5, 6];
  
  // Shuffle and assign random positions
  const shuffled = [...numbers].sort(() => Math.random() - 0.5);
  
  return {
    targetSum,
    initialValues: {
      top: shuffled[0],
      left: shuffled[1],
      right: shuffled[2],
      bottomLeft: null,
      bottomRight: null,
      bottom: null
    } as TriangleState,
    solution: {
      top: shuffled[0],
      left: shuffled[1],
      right: shuffled[2],
      bottomLeft: shuffled[3],
      bottomRight: shuffled[4],
      bottom: shuffled[5]
    }
  };
};

export default function MagicTriangle() {
  const [puzzle, setPuzzle] = useState(generatePuzzle());
  const [values, setValues] = useState<TriangleState>(puzzle.initialValues);
  const [isSolved, setIsSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [revealedNumbers, setRevealedNumbers] = useState<number[]>([]);
  const [showInstructions, setShowInstructions] = useState(true);

  const playSuccessSound = () => {
    new Howl({
      src: ['/sounds/success.mp3'],
      volume: 0.5
    }).play();
  };

  const handleHint = () => {
    if (hintsUsed < 3) {
      const missingNumbers = Object.values(puzzle.solution)
        .filter(num => !Object.values(values).includes(num))
        .filter(num => !revealedNumbers.includes(num));

      if (missingNumbers.length > 0) {
        const randomNumber = missingNumbers[Math.floor(Math.random() * missingNumbers.length)];
        setRevealedNumbers([...revealedNumbers, randomNumber]);
        setHintsUsed(hintsUsed + 1);
        setShowHint(true);
      }
    }
  };

  const checkSolution = () => {
    const newErrors: string[] = [];
    const { targetSum } = puzzle;

    const topSide = values.top! + values.left! + values.bottomLeft!;
    const leftSide = values.left! + values.bottom! + values.right!;
    const rightSide = values.right! + values.bottomRight! + values.top!;

    if (topSide !== targetSum) newErrors.push('Top side incorrect');
    if (leftSide !== targetSum) newErrors.push('Left side incorrect');
    if (rightSide !== targetSum) newErrors.push('Right side incorrect');

    setErrors(newErrors);
    if (newErrors.length === 0) {
      playSuccessSound();
      setIsSolved(true);
    }
  };

  const handleReset = () => {
    setPuzzle(generatePuzzle());
    setValues(puzzle.initialValues);
    setIsSolved(false);
    setErrors([]);
    setHintsUsed(0);
    setRevealedNumbers([]);
  };

  const NumberPad = ({ onSelect }: { onSelect: (num: number) => void }) => (
    <div className="grid grid-cols-3 gap-2 mb-6">
      {[1, 2, 3, 4, 5, 6].map((num) => (
        <motion.button
          key={num}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-4 text-2xl bg-purple-100 rounded-lg hover:bg-purple-200"
          onClick={() => onSelect(num)}
        >
          <span className="text-purple-600 font-bold">{num}</span>
        </motion.button>
      ))}
    </div>
  );

  const NumberInput = ({ value, onChange, disabled }: {
    value: number | null;
    onChange: (value: number) => void;
    disabled?: boolean;
  }) => (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className="relative"
    >
      <input
        type="number"
        value={value || ''}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className={`w-16 h-16 text-center border-4 rounded-full text-2xl font-bold 
          ${disabled ? 'bg-purple-100' : 'bg-white'} 
          ${value ? 'border-green-400' : 'border-purple-200'}
          focus:outline-none focus:ring-4 focus:ring-purple-300`}
        min="1"
        max="6"
      />
      {!value && (
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-300">
          ?
        </span>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-purple-600 mb-6 text-center">
          🔺 Magic Triangle
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="relative h-64 w-64 mx-auto mb-8">
            {/* Top Input */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2">
              <NumberInput
                value={values.top}
                onChange={(v) => setValues({ ...values, top: v })}
                disabled={!!values.top}
              />
            </div>

            {/* Left Input */}
            <div className="absolute top-1/3 left-0 -translate-y-1/2">
              <NumberInput
                value={values.left}
                onChange={(v) => setValues({ ...values, left: v })}
                disabled={!!values.left}
              />
            </div>

            {/* Right Input */}
            <div className="absolute top-1/3 right-0 -translate-y-1/2">
              <NumberInput
                value={values.right}
                onChange={(v) => setValues({ ...values, right: v })}
                disabled={!!values.right}
              />
            </div>

            {/* Bottom Left Input */}
            <div className="absolute bottom-1/3 left-1/4 -translate-x-1/2">
              <NumberInput
                value={values.bottomLeft}
                onChange={(v) => setValues({ ...values, bottomLeft: v })}
              />
            </div>

            {/* Bottom Right Input */}
            <div className="absolute bottom-1/3 right-1/4 translate-x-1/2">
              <NumberInput
                value={values.bottomRight}
                onChange={(v) => setValues({ ...values, bottomRight: v })}
              />
            </div>

            {/* Bottom Input */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
              <NumberInput
                value={values.bottom}
                onChange={(v) => setValues({ ...values, bottom: v })}
              />
            </div>
          </div>

          <div className="text-center mb-6">
            <p className="text-xl font-bold text-purple-600">
              Target Sum: {puzzle.targetSum}
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-green-500 text-white rounded-lg"
              onClick={checkSolution}
            >
              Check Solution
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg"
              onClick={handleReset}
            >
              <RotateCw className="inline-block mr-2" />
              Reset
            </motion.button>
          </div>

          {errors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mt-4 p-3 bg-red-100 rounded-lg"
            >
              <div className="relative">
                <Smile className="w-8 h-8 text-red-500" />
                <X className="absolute -right-1 -top-1 w-4 h-4 text-white bg-red-500 rounded-full p-0.5" />
              </div>
              <div>
                <p className="font-medium">Oopsie! 🤭</p>
                <p>Try different numbers! You got this!</p>
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleHint}
            disabled={hintsUsed >= 3}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 disabled:opacity-50"
          >
            <Lightbulb className="w-5 h-5" />
            Get Hint ({3 - hintsUsed} left)
          </button>
        </div>

        {showHint && revealedNumbers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-100 p-3 rounded-lg mb-4 flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-yellow-600" />
            <span>
              Try using {revealedNumbers.join(' or ')} in the empty spots!
            </span>
          </motion.div>
        )}

        <div className="flex justify-center gap-1 mb-6">
          {[...Array(3 - hintsUsed)].map((_, i) => (
            <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
          ))}
          {[...Array(hintsUsed)].map((_, i) => (
            <Star key={i} className="w-6 h-6 text-gray-300" />
          ))}
        </div>

        <NumberPad onSelect={(num) => {
          // Find first empty spot
          const emptySpot = Object.entries(values).find(([key, val]) => 
            !puzzle.initialValues[key as keyof TriangleState] && val === null
          );
          if (emptySpot) {
            setValues({ ...values, [emptySpot[0]]: num });
          }
        }} />

        <AnimatePresence>
          {isSolved && (
            <>
              <Confetti 
                recycle={false} 
                numberOfPieces={500}
                colors={['#8B5CF6', '#EC4899', '#3B82F6']}
                gravity={0.1}
              />
              
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ 
                  scale: 1,
                  rotate: 0,
                  transition: { type: 'spring', stiffness: 200 }
                }}
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
                    <PartyPopper className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                  </motion.div>
                  
                  <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Magic Solved! 🎉
                  </h2>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-2 mb-6"
                  >
                    <p className="text-lg font-medium">All sides add up to {puzzle.targetSum}</p>
                    <p className="text-sm text-gray-600">Hints used: {hintsUsed}</p>
                  </motion.div>

                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: 0 }}
                      animate={{ y: [0, -20, 0] }}
                      transition={{
                        delay: i * 0.3,
                        repeat: Infinity,
                        duration: 2
                      }}
                      className="absolute"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                    >
                      ⭐
                    </motion.div>
                  ))}

                  <button
                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:scale-105 transition-transform"
                    onClick={handleReset}
                  >
                    Play Again
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {showInstructions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center gap-2 mb-4">
                <Gamepad className="w-8 h-8 text-purple-500" />
                <h2 className="text-2xl font-bold">How to Play</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Trophy className="flex-shrink-0 w-6 h-6 text-yellow-500" />
                  <p>
                    <strong>Goal:</strong> Fill the triangle so each side adds up to {puzzle.targetSum}!
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <Smile className="flex-shrink-0 w-6 h-6 text-blue-500" />
                  <div>
                    <p className="font-medium mb-1">Steps:</p>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Click on empty circles</li>
                      <li>Choose numbers from the pad</li>
                      <li>Make all three sides equal {puzzle.targetSum}</li>
                      <li>Press Check to see if you`&apos;`re right!</li>
                    </ol>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowInstructions(false)}
                className="mt-6 w-full py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-bold"
              >
                Let`&apos;`s Play! 🎮
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

const Star = ({ className }: { className: string }) => (
  <svg className={`w-6 h-6 ${className}`} viewBox="0 0 24 24">
    <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
  </svg>
);
