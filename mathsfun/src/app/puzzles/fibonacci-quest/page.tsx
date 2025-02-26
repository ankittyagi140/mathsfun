'use client';
import { useState, useEffect, useCallback } from 'react';
import Confetti from 'react-confetti';
import { InfoIcon, LightbulbIcon } from 'lucide-react';

export default function FibonacciQuest() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [missingIndex, setMissingIndex] = useState<number>(2);
  const [userInputs, setUserInputs] = useState<(number | null)[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [showHint, setShowHint] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const generatePuzzle = useCallback(() => {
    const base1 = Math.floor(Math.random() * 5) + 1;
    const base2 = Math.floor(Math.random() * 5) + 1;
    
    // Generate full valid Fibonacci sequence
    const fullSequence = [
      base1,
      base2,
      base1 + base2,
      base2 + (base1 + base2),
      (base1 + base2) + (base2 + (base1 + base2))
    ];

    // Ensure sequence is valid
    if (fullSequence.some(num => num <= 0 || !Number.isInteger(num))) {
      return generatePuzzle(); // Regenerate if invalid
    }

    // Randomly choose a position to hide (but not first two)
    const hideIndex = Math.floor(Math.random() * 3) + 2;
    const puzzleSequence = fullSequence.map((num, index) => 
      index === hideIndex ? null : num
    );

    setMissingIndex(hideIndex);
    setUserInputs(puzzleSequence.map(() => null));
    setSequence(puzzleSequence);
    setIsCorrect(null);
  }, []);

  useEffect(() => {
    generatePuzzle();
  }, [generatePuzzle]);

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...userInputs];
    newInputs[index] = value === '' ? null : Number(value);
    setUserInputs(newInputs);
  };

  const validateAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get the correct answer based on Fibonacci rules
    const correctAnswer = sequence[missingIndex - 1]! + sequence[missingIndex - 2]!;
    
    if (userInputs[missingIndex] === correctAnswer) {
      setIsCorrect(true);
      setScore(prev => prev + 10 * level);
      setTimeout(() => {
        setLevel(prev => prev + 1);
        generatePuzzle();
      }, 5000);
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-white bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-8">
            <h1 className="text-3xl font-bold">🔢 Fibonacci Quest</h1>
            <div className="text-lg font-semibold">
              Level: {level} | Score: {score}
            </div>
          </div>

          {showInstructions && (
            <div className="bg-blue-50 p-6 rounded-lg mb-8">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <InfoIcon className="w-5 h-5" /> How to Play
                </h2>
                <button 
                  onClick={() => setShowInstructions(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <ul className="list-disc pl-6 space-y-2">
                <li>Each sequence follows the Fibonacci pattern</li>
                <li>Find the missing number in the sequence</li>
                <li>Remember: Each number is the sum of the two preceding ones</li>
                <li>Correct answers give 10× level points</li>
                <li>Reach higher levels for longer sequences</li>
              </ul>
            </div>
          )}

          <form onSubmit={validateAnswer} className="space-y-6">
            <div className="flex flex-wrap gap-4 justify-center items-center text-2xl font-mono">
              {sequence.map((num, index) => (
                <div key={index} className="flex items-center gap-2">
                  {num === null ? (
                    <input
                      type="number"
                      value={userInputs[index] || ''}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      className={`w-20 text-center border-2 rounded p-2 ${
                        isCorrect === false && index === missingIndex 
                          ? 'border-red-500' 
                          : 'border-gray-300'
                      }`}
                      placeholder="?"
                      disabled={index !== missingIndex}
                    />
                  ) : (
                    <span className="px-4 py-2 bg-gray-100 rounded">{num}</span>
                  )}
                  {index < sequence.length - 1 && <span>+</span>}
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-lg"
              >
                Check Answer
              </button>
            </div>

            {isCorrect === true && (
              <div className="text-center text-green-600 font-bold animate-bounce">
                ✓ Correct! Next level...
              </div>
            )}
            {isCorrect === false && (
              <div className="text-center text-red-500 font-bold">
                ✗ Try again! Remember each number is the sum of the two before it
              </div>
            )}
          </form>

          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <LightbulbIcon className="w-5 h-5" />
              Need a hint?
            </button>
            <button
              onClick={generatePuzzle}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Skip Puzzle
            </button>
          </div>

          {showHint && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <p className="text-yellow-700">
                💡 Remember the Fibonacci rule: Each number is the sum of the two 
                numbers before it. For example: 0, 1, 1, 2, 3, 5, 8...
              </p>
            </div>
          )}
        </div>
      </div>
      {isCorrect && <Confetti recycle={false} numberOfPieces={300} />}
    </div>
  );
} 