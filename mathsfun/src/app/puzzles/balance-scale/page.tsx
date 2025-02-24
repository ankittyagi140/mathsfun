'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Weight, Scale, RotateCw, Check, X, ChevronRight } from 'lucide-react';
import Confetti from 'react-confetti';
import Popup from '@/components/Popup';
import Loader from '@/components/Loader';

type WeightItem = {
  id: string;
  value: number;
  position: number;
  side: 'left' | 'right' | null;
};

type Puzzle = {
  id: string; // Add an ID to the puzzle type
  leftWeights: WeightItem[];
  rightWeights: WeightItem[];
  targetDifference: number;
  question: string;
  correctAnswer: number;
};

const generatePuzzle = (): Puzzle => {
  const leftCount = 3;
  const rightCount = 2;
  const baseValue = Math.floor(Math.random() * 4) + 2; // 2-5
  const correctValue = (baseValue * leftCount) / rightCount;
  
  return {
    id: `puzzle-${Date.now()}`, // Add unique ID for each puzzle
    leftWeights: Array.from({ length: leftCount }, (_, i) => ({
      id: `left-${i}-${Date.now()}`, // Make weight IDs unique
      value: baseValue,
      position: i * 50,
      side: 'left',
    })),
    rightWeights: Array.from({ length: rightCount }, (_, i) => ({
      id: `right-${i}-${Date.now()}`, // Make weight IDs unique
      value: baseValue,
      position: i * 50,
      side: 'right',
    })),
    targetDifference: baseValue,
    question: `The left side has ${leftCount} weights of ${baseValue}kg each. The right side has ${rightCount} weights. What should each right weight be to balance?`,
    correctAnswer: correctValue,
  };
};

const InstructionsModal = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full"
      >
        <div className="flex items-center gap-2 mb-4">
          <Scale className="w-8 h-8 text-blue-500" />
          <h2 className="text-2xl font-bold">How to Play</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Weight className="flex-shrink-0 w-6 h-6 text-blue-500 mt-1" />
            <div>
              <p className="font-medium mb-1">Goal:</p>
              <p>Make both sides of the scale equal by entering the correct weight!</p>
            </div>
          </div>
  
          <div className="flex items-start gap-3">
            <ChevronRight className="flex-shrink-0 w-6 h-6 text-green-500 mt-1" />
            <div>
              <p className="font-medium mb-1">Steps:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Count the weights on each side</li>
                <li>Multiply number of weights × value</li>
                <li>Enter the missing value for the empty side</li>
                <li>Check if the scale balances!</li>
              </ol>
            </div>
          </div>
  
          <div className="flex items-start gap-3">
            <Info className="flex-shrink-0 w-6 h-6 text-yellow-500 mt-1" />
            <div>
              <p className="font-medium mb-1">Tips:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Look for matching totals</li>
                <li>Use multiplication</li>
                <li>Try different numbers</li>
              </ul>
            </div>
          </div>
        </div>
  
        <button
          onClick={onClose}
          className="mt-6 w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-bold"
        >
          Start Balancing! ⚖️
        </button>
      </motion.div>
    </div>
  );

const BalanceVisualization = ({ 
  puzzle,
  isBalanced,
  leftTotal,
  rightTotal
}: {
  puzzle: Puzzle;
  isBalanced: boolean;
  leftTotal: number;
  rightTotal: number;
}) => {
  const leftPositions = [20, 80, 140];
  const rightPositions = [40, 120];

  return (
    <div className="relative h-64">
      <motion.div
        className="absolute left-20 -translate-x-1/2 w-4/5 h-2 bg-gray-400 top-1/2 origin-center"
        animate={{
          rotate: isBalanced ? 0 : leftTotal > rightTotal ? -3 : 3
        }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-600 rounded-full" />
      </motion.div>

      <div className="absolute left-0 w-1/2 h-full">
        {puzzle.leftWeights.map((weight, index) => (
          <motion.div
            key={weight.id}
            className="absolute"
            style={{ left: `${leftPositions[index]}px`, bottom: '50px' }}
            animate={{
              y: isBalanced ? 0 : leftTotal > rightTotal ? 0 : [0, -15, 0]
            }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {weight.value}kg
            </div>
          </motion.div>
        ))}
      </div>

      <div className="absolute right-0 w-1/2 h-full">
        {puzzle.rightWeights.map((weight, index) => (
          <motion.div
            key={weight.id}
            className="absolute"
            style={{ right: `${rightPositions[index]}px`, bottom: '50px' }}
            animate={{
              y: isBalanced ? 0 : rightTotal > leftTotal ? 0 : [0, -15, 0]
            }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {weight.value}kg
            </div>
          </motion.div>
        ))}
      </div>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center">
        <motion.div
          className={`flex items-center gap-2 text-lg font-bold ${
            isBalanced ? 'text-green-600' : 'text-orange-600'
          }`}
        >
          {isBalanced ? (
            <div className="flex items-center">
              <Check className="w-6 h-6" />
              <span>Balanced!</span>
            </div>
          ) : (
            <div className="flex items-center">
              <X className="w-6 h-6" />
              <span>{leftTotal > rightTotal ? 'Left heavier' : 'Right heavier'}</span>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default function BalanceScale() {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isBalanced, setIsBalanced] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const leftTotal = useMemo(() => 
    puzzle?.leftWeights.reduce((sum, w) => sum + w.value, 0) || 0,
    [puzzle?.leftWeights]
  );
  
  const rightTotal = useMemo(() => 
    puzzle?.rightWeights.reduce((sum, w) => sum + w.value, 0) || 0,
    [puzzle?.rightWeights]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setPuzzle(generatePuzzle());
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (puzzle) {
      const balance = leftTotal === rightTotal;
      setIsBalanced(balance);
    }
  }, [leftTotal, rightTotal, puzzle]);

  if (!puzzle) {
    return <Loader />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const answer = parseFloat(userAnswer);

    if (Math.abs(answer - puzzle.correctAnswer) < 0.01 && !isBalanced) {
      setPuzzle(prev => ({
        ...prev!,
        rightWeights: prev!.rightWeights.map(w => ({
          ...w,
          value: answer
        }))
      }));

      setTimeout(() => {
        setPuzzle(generatePuzzle());
        setUserAnswer('');
      }, 2000);
    }
  };

  const handleReset = () => {
    setPuzzle(generatePuzzle());
    setUserAnswer('');
    setIsBalanced(false);
  };

  return (
    <div className="min-h-screen p-6 bg-white-50">
      {showInstructions && (
        <InstructionsModal key="instructions" onClose={() => setShowInstructions(false)} />
      )}

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Balance the Scale! ⚖️
          <span className="block text-xl mt-2 font-normal">
            {puzzle.question}
          </span>
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <BalanceVisualization 
            puzzle={puzzle}
            isBalanced={isBalanced}
            leftTotal={leftTotal}
            rightTotal={rightTotal}
          />

          <form onSubmit={handleSubmit} className="mt-8 flex gap-4 items-center justify-center">
            <input 
              type="number" 
              value={userAnswer} 
              onChange={e => setUserAnswer(e.target.value)} 
              className="w-32 px-4 py-2 text-2xl font-bold text-center border-4 border-blue-300 rounded-lg" 
              required 
            />
            <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-bold">
              Check
            </button>
            <button 
              type="button" 
              onClick={handleReset} 
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              <RotateCw className="inline-block mr-2" /> Reset
            </button>
          </form>
        </div>

        <AnimatePresence>
          {isBalanced && (
            <>
              <Confetti 
                key={`confetti-${puzzle.id}`}
                recycle={false} 
                numberOfPieces={200} 
                colors={['#3B82F6', '#10B981', '#F59E0B']} 
              />
              <Popup 
                key={`popup-${puzzle.id}`}
                title="🎉 Correct Answer!" 
                onClose={() => setIsBalanced(false)}
              >
                <div className="text-center p-4 sm:p-6">
                  <p className="text-xl sm:text-2xl mb-4">Well done! Next puzzle loading...</p>
                </div>
              </Popup>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}