'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, RotateCw, Check, X, Info, AlertTriangle } from 'lucide-react';
import Confetti from 'react-confetti';

type Time = { hours: number; minutes: number };

const generatePuzzle = () => {
  const startHours = Math.floor(Math.random() * 12);
  const startMinutes = Math.floor(Math.random() * 12) * 5;
  const endHours = (startHours + Math.floor(Math.random() * 3)) % 24;
  const endMinutes = Math.floor(Math.random() * 12) * 5;

  // Calculate time difference
  const startTotal = startHours * 60 + startMinutes;
  const endTotal = endHours * 60 + endMinutes;
  let diff = endTotal - startTotal;
  
  // Handle overnight cases
  if (diff < 0) diff += 24 * 60; // Add full day minutes
  
  return {
    startTime: { hours: startHours, minutes: startMinutes },
    endTime: { hours: endHours, minutes: endMinutes },
    correctAnswer: {
      hours: Math.floor(diff / 60),
      minutes: diff % 60
    },
    maxAttempts: 3
  };
};

const ClockFace = ({ time }: { time: Time }) => {
  const hourAngle = (time.hours % 12) * 30 + time.minutes * 0.5;
  const minuteAngle = time.minutes * 6;

  return (
    <div className="relative w-32 h-32 sm:w-48 sm:h-48 bg-gray-100 rounded-full shadow-lg">
      {/* Clock numbers */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{ transform: `rotate(${i * 30}deg)` }}
        >
          <div className="absolute left-1/2 top-2 -translate-x-1/2 text-sm font-medium">
            {i === 0 ? 12 : i}
          </div>
        </div>
      ))}
      
      {/* Clock hand container - ensures proper centering */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        {/* Hour hand */}
        <div 
          className="absolute w-1 bg-gray-800" 
          style={{
            height: '35%',
            bottom: '50%',
            transformOrigin: 'bottom center',
            transform: `rotate(${hourAngle}deg)`
          }}
        />
        
        {/* Minute hand */}
        <div 
          className="absolute w-1 bg-gray-600" 
          style={{
            height: '45%',
            bottom: '50%',
            transformOrigin: 'bottom center',
            transform: `rotate(${minuteAngle}deg)`
          }}
        />
      
        {/* Center dot */}
        <div className="absolute w-3 h-3 bg-red-500 rounded-full" />
      </div>
    </div>
  );
};

export default function ClockChallenge() {
  const [puzzle, setPuzzle] = useState(() => generatePuzzle());
  const [userHours, setUserHours] = useState('');
  const [userMinutes, setUserMinutes] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hours = parseInt(userHours) || 0;
    const minutes = parseInt(userMinutes) || 0;

    if (hours === puzzle.correctAnswer.hours && minutes === puzzle.correctAnswer.minutes) {
      setIsCorrect(true);
    } else {
      setAttempts(prev => prev + 1);
    }
  };

  const newPuzzle = () => {
    setPuzzle(generatePuzzle());
    setUserHours('');
    setUserMinutes('');
    setAttempts(0);
    setIsCorrect(false);
    setShowHint(false);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          Clock Math Challenge
          <span className="block text-lg sm:text-xl mt-2 font-normal text-gray-600">
            Calculate the time difference between the clocks
          </span>
        </h1>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mb-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Start Time</h3>
            <ClockFace time={puzzle.startTime} />
          </div>
          
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">End Time</h3>
            <ClockFace time={puzzle.endTime} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={userHours}
                onChange={e => setUserHours(e.target.value)}
                placeholder="Hours"
                className="w-20 px-4 py-2 text-center border-2 border-blue-300 rounded-lg"
                min="0"
                required
              />
              <span className="text-gray-600">hours</span>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={userMinutes}
                onChange={e => setUserMinutes(e.target.value)}
                placeholder="Minutes"
                className="w-20 px-4 py-2 text-center border-2 border-blue-300 rounded-lg"
                min="0"
                max="59"
                required
              />
              <span className="text-gray-600">minutes</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-bold"
            >
              Check Answer
            </button>
            
            <button
              type="button"
              onClick={newPuzzle}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              <RotateCw className="inline-block mr-2" />
              New Puzzle
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              <Info className="inline-block mr-2" />
              {showHint ? 'Hide Hint' : 'Need Hint?'}
            </button>
            {showHint && (
              <p className="mt-2 text-gray-600 text-sm">
                Calculate the difference between {puzzle.startTime.hours}:{puzzle.startTime.minutes.toString().padStart(2, '0')} 
                and {puzzle.endTime.hours}:{puzzle.endTime.minutes.toString().padStart(2, '0')}
              </p>
            )}
          </div>
        </form>

        <div className="mt-4 text-center text-gray-600 text-sm">
          Attempts remaining: {puzzle.maxAttempts - attempts}
        </div>

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
                Correct! The difference is {puzzle.correctAnswer.hours} hours and {puzzle.correctAnswer.minutes} minutes
                <button
                  onClick={newPuzzle}
                  className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Next Challenge
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
              Time's up! The correct answer was {puzzle.correctAnswer.hours} hours and {puzzle.correctAnswer.minutes} minutes
              <button
                onClick={newPuzzle}
                className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}