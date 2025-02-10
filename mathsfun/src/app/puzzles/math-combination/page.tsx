'use client';
import { useState, useEffect, useCallback } from 'react';
import Confetti from 'react-confetti';
import Link from 'next/link';
import Popup from '@/components/Popup';

type Step = {
  value: string;
  type: 'number' | 'operator';
};

const MathCombination = () => {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [target, setTarget] = useState(0);

  const [isCorrect, setIsCorrect] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [operators, setOperators] = useState<string[]>(['+', '+', '+']);
  const [showError, setShowError] = useState(false);
  const steps: Step[] = [];
  const generateSolvableGame = useCallback(() => {
    const MAX_ATTEMPTS = 100;
    let attempts = 0;


    
    while (attempts < MAX_ATTEMPTS) {
      const newNumbers = Array.from({length: 4}, () => Math.floor(Math.random() * 9) + 1);
      const newTarget = Math.floor(Math.random() * 50) + 10;
      
      if (hasSolution(newNumbers, newTarget)) {
        return { newNumbers, newTarget };
      }
      attempts++;
    }
    
    // Fallback to guaranteed solvable combination
    return { 
      newNumbers: [6, 3, 2, 4], 
      newTarget: 24 
    };
  }, [hasSolution]);

  const hasSolution = useCallback((numbers: number[], target: number) => {
    const operatorCombinations = generateAllOperatorCombinations();
    return operatorCombinations.some(ops => {
      try {
        const equation = numbers
          .map((num, index) => `${index > 0 ? ops[index - 1] : ''}${num}`)
          .join('')
          .replace(/×/g, '*')
          .replace(/÷/g, '/');
        
        const result = eval(equation);
        return Math.abs(result - target) < 0.0001;
      } catch {
        return false;
      }
    });
  }, [generateAllOperatorCombinations]);

  const generateAllOperatorCombinations = useCallback(() => {
    const operators = ['+', '-', '×', '÷'];
    const combinations: string[][] = [];
    
    for (let i = 0; i < operators.length; i++) {
      for (let j = 0; j < operators.length; j++) {
        for (let k = 0; k < operators.length; k++) {
          combinations.push([operators[i], operators[j], operators[k]]);
        }
      }
    }
    return combinations;
  }, []);

  const generateNewGame = useCallback(() => {
    const { newNumbers, newTarget } = generateSolvableGame();
    setNumbers(newNumbers);
    setTarget(newTarget);
    setOperators(['+', '+', '+']);
    setIsCorrect(false);
    setShowError(false);
  }, [generateSolvableGame]);

  useEffect(() => {
    generateNewGame();
  }, [generateNewGame]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && !isCorrect) {
      interval = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isCorrect]);

  const handleOperatorChange = (index: number, value: string) => {
    const newOperators = [...operators];
    newOperators[index] = value;
    setOperators(newOperators);
  };



  const validateSolution = () => {
    try {
      const equation = numbers
        .map((num, index) => 
          `${index > 0 ? operators[index - 1] : ''}${num}`
        )
        .join('')
        .replace(/×/g, '*')
        .replace(/÷/g, '/');
      
      const result = eval(equation);
      const isValid = Math.abs(result - target) < 0.0001;
      
      if (isValid) {
        setIsCorrect(true);
        setIsActive(false);
        setShowError(false);
      } else {
        setShowError(true);
      }
    } catch {
      setShowError(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen p-8 bg-white bg-gray-50">
      
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
          ➗ Math Combination
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="mb-6 bg-yellow-50 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <span className="text-2xl">🎯</span> How to Play
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Use all four numbers exactly once</li>
              <li>Combine using +, -, ×, ÷</li>
              <li>Reach the target number</li>
              <li>Example: (3 + 5) × (6 - 2) = 32</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col items-center gap-4">
              <div className="text-3xl font-bold text-purple-600 mb-4">
                Target: {target}
              </div>
              
              <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
                {numbers.map((num, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <span className="text-xl px-4 py-2 bg-white rounded-lg shadow">
                      {num}
                    </span>
                    {index < 3 && (
                      <select
                        value={operators[index]}
                        onChange={(e) => handleOperatorChange(index, e.target.value)}
                        className="px-2 py-1 border rounded bg-white text-lg"
                      >
                        <option value="+">+</option>
                        <option value="-">-</option>
                        <option value="×">×</option>
                        <option value="÷">÷</option>
                      </select>
                    )}
                  </div>
                ))}
                <span className="text-xl ml-2">= ?</span>
              </div>

              {showError && (
                <div className="bg-red-100 p-3 rounded-lg text-red-700 text-center">
                  ❌ That combination doesn&apos;t reach the target. Keep trying!
                </div>
              )}

              <div className="flex justify-between items-center mt-4">
                <span className="text-gray-600">
                  Time: {formatTime(time)}
                </span>
                <button
                  onClick={validateSolution}
                  className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600"
                >
                  Check Solution
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={generateNewGame}
              className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              New Game
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
          <Popup title="Math Combination Help" onClose={() => setShowHelp(false)}>
            <div className="space-y-4">
              <div className="bg-yellow-100 p-4 rounded-lg">
                <h4 className="font-bold mb-2">💡 Pro Tips:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Start with multiplication/division to reach bigger numbers</li>
                  <li>Use parentheses to control operation order</li>
                  <li>Sometimes subtracting negatives helps</li>
                  <li>Try different operator combinations</li>
                </ul>
              </div>
              <p className="text-center text-lg">🧠 Think outside the box! 🎲</p>
            </div>
          </Popup>
        )}

        {isCorrect && (
          <Popup title="Correct Solution!" onClose={() => {}}>
            <div className="text-center p-4">
              <p className="text-xl mb-4">
                Solved in {formatTime(time)}! 🏆<br/>
                {steps.map(s => s.value).join('')} = {target}
              </p>
              <button
                className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                onClick={generateNewGame}
              >
                Play Again
              </button>
              <Confetti recycle={false} numberOfPieces={500} />
            </div>
          </Popup>
        )}
      </main>
    </div>
  );
};

export default MathCombination; 