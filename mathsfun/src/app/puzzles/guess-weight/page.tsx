'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Weight, RotateCw, Check, Info, AlertTriangle, ArrowLeft } from 'lucide-react';
import Confetti from 'react-confetti';
import Link from 'next/link';

const generatePuzzle = () => {
  const targetWeight = Math.floor(Math.random() * 50) + 10; // 10-60kg
  const availableWeights = [1, 5, 10, 20]; // Standard weights
  return {
    targetWeight,
    availableWeights,
    maxAttempts: 3,
    object: ['🏋️', '🐘', '🚚', '🏗️', '🐋'][Math.floor(Math.random() * 5)] // Random object emoji
  };
};

export default function GuessWeightPuzzle() {
  const [puzzle, setPuzzle] = useState(() => generatePuzzle());
  const [selectedWeights, setSelectedWeights] = useState<number[]>([]);
  const [userGuess, setUserGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const totalWeight = useMemo(() => 
    selectedWeights.reduce((sum, weight) => sum + weight, 0)
  , [selectedWeights]);

  const weightDifference = totalWeight - puzzle.targetWeight;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const guess = parseInt(userGuess);
    if (guess === puzzle.targetWeight) {
      setIsCorrect(true);
    } else {
      setAttempts(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setPuzzle(generatePuzzle());
    setSelectedWeights([]);
    setUserGuess('');
    setAttempts(0);
    setIsCorrect(false);
    setShowHint(false);
  };

 
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
      <Link href="/" className="flex items-center text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to All Puzzles
          </Link>
          <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold mb-6 text-center">
          Guess the Weight! {puzzle.object}
          
        </h1>
          </div>
        </div>
      
        <span className="block text-xl mt-2 font-normal text-center">
            Use the weights to estimate the object's mass
          </span>

        {/* Scale Visualization */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="relative h-64">
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 w-4/5 h-2 bg-gray-400 top-1/2 origin-center"
              animate={{ rotate: Math.min(Math.max(weightDifference * 0.5, -15), 15) }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-600 rounded-full" />
            </motion.div>

            {/* Object Side */}
            <div className="absolute left-0 w-1/2 h-full flex items-end justify-center">
              <div className="text-6xl mb-4">{puzzle.object}</div>
            </div>

            {/* Weights Side */}
            <div className="absolute right-0 w-1/2 h-full flex items-end justify-center">
              <div className="flex gap-2 mb-4">
                {selectedWeights.map((weight, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold"
                  >
                    {weight}kg
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center text-lg font-semibold mt-4">
            Total Weight: {totalWeight}kg
          </div>
        </div>

        {/* Weight Selection */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {puzzle.availableWeights.map(weight => (
            <button
              key={weight}
              onClick={() => setSelectedWeights(prev => [...prev, weight])}
              className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-2xl font-bold text-blue-600">{weight}kg</div>
              <Weight className="mx-auto mt-2 text-gray-600" />
            </button>
          ))}
        </div>

        {/* Guess Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <input
              type="number"
              value={userGuess}
              onChange={e => setUserGuess(e.target.value)}
              placeholder="Enter your guess (kg)"
              className="w-full sm:w-48 px-4 py-2 text-xl text-center border-4 border-blue-300 rounded-lg"
              min="1"
              required
            />
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-bold"
              >
                Check Answer
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                <RotateCw className="inline-block mr-2" />
                {attempts > 0 || isCorrect ? 'New Game' : 'Reset'}
              </button>
            </div>
          </div>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="text-blue-600 hover:text-blue-700"
            >
              <Info className="inline-block mr-2" />
              {showHint ? 'Hide Hint' : 'Need Hint?'}
            </button>
            {showHint && (
              <p className="mt-2 text-gray-600">
                The scale tips towards the heavier side. Current difference: {Math.abs(weightDifference)}kg
              </p>
            )}
          </div>
        </form>

        {/* Attempts Counter */}
        <div className="mt-4 text-center text-gray-600">
          Attempts remaining: {puzzle.maxAttempts - attempts}
        </div>

        {/* Feedback & Results */}
        <AnimatePresence>
          {isCorrect && (
            <>
              <Confetti recycle={false} numberOfPieces={200} />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-green-100 rounded-lg text-green-700 text-center"
              >
                <Check className="inline-block mr-2" />
                Correct! The weight was {puzzle.targetWeight}kg
                <button
                  onClick={handleReset}
                  className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  New Game
                </button>
              </motion.div>
            </>
          )}

          {attempts >= puzzle.maxAttempts && !isCorrect && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-red-100 rounded-lg text-red-700 text-center"
            >
              <AlertTriangle className="inline-block mr-2" />
              Out of attempts! The correct weight was {puzzle.targetWeight}kg
              <button
                onClick={handleReset}
                className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                New Game
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
