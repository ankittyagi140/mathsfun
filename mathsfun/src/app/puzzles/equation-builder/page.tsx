'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import Link from 'next/link';
import Header from '@/components/Header';
import Popup from '@/components/Popup';

const EquationBuilder = () => {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [target, setTarget] = useState(0);
  const [operators, setOperators] = useState<string[]>(['+', '+', '+']);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const generateNewGame = () => {
    const newNumbers = Array.from({length: 4}, () => Math.floor(Math.random() * 9) + 1);
    const newTarget = Math.floor(Math.random() * 50) + 10;
    setNumbers(newNumbers);
    setTarget(newTarget);
    setOperators(['+', '+', '+']);
    setIsCorrect(false);
  };

  const handleOperatorChange = (index: number, value: string) => {
    const newOperators = [...operators];
    newOperators[index] = value;
    setOperators(newOperators);
  };

  const validateEquation = () => {
    try {
      const equation = numbers
        .map((num, index) => 
          index < operators.length ? `${num} ${operators[index]} ` : num
        )
        .join('')
        .trim()
        .replace(/ /g, '')
        .replace(/×/g, '*')
        .replace(/÷/g, '/');

      const result = eval(equation);
      return Math.abs(result - target) < 0.0001;
    } catch {
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
          🧩 Equation Builder
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="mb-6 bg-yellow-50 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <span className="text-2xl">🔢</span> How to Play
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Use all four numbers in order</li>
              <li>Choose operators between them</li>
              <li>Match the target number below</li>
              <li>Parentheses not needed in this version</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="text-2xl font-bold text-center mb-4">
              Target: {target}
            </h3>
            
            <div className="bg-white p-4 rounded-lg mb-4">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {numbers.map((num, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-xl px-3 py-1 bg-gray-100 rounded">
                      {num}
                    </span>
                    {index < numbers.length - 1 && (
                      <select
                        value={operators[index]}
                        onChange={(e) => handleOperatorChange(index, e.target.value)}
                        className="px-2 py-1 border rounded bg-white"
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
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  if (validateEquation()) {
                    setIsCorrect(true);
                  } else {
                    alert("Equation doesn't match target. Try again!");
                  }
                }}
                className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600"
              >
                Check Solution
              </button>
              <button
                onClick={generateNewGame}
                className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                New Game
              </button>
            </div>
          </div>
        </div>

        {isCorrect && (
          <Popup title="🎉 Correct Solution!" onClose={() => setIsCorrect(false)}>
            <div className="text-center p-4">
              <p className="text-xl mb-4">
                {numbers.map((num, index) => (
                  <span key={index}>
                    {num}
                    {index < operators.length && ` ${operators[index]} `}
                  </span>
                ))} = {target}
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

export default EquationBuilder; 