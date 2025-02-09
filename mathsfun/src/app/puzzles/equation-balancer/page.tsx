'use client';
import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import Link from 'next/link';
import Header from '@/components/Header';
import Popup from '@/components/Popup';

type EquationSide = { element: string; count: number }[];

const EquationBalancer = () => {
  const [leftSide, setLeftSide] = useState<EquationSide>([]);
  const [rightSide, setRightSide] = useState<EquationSide>([]);
  const [score, setScore] = useState(0);
  const [hasWon, setHasWon] = useState(false);
  const [showHelp, setShowHelp] = useState(true);

  const equations = [
    { 
      left: [{ element: 'H₂', count: 2 }, { element: 'O₂', count: 1 }], 
      right: [{ element: 'H₂O', count: 1 }] // Unbalanced (H:4 vs 2, O:2 vs 1)
    },
    { 
      left: [{ element: 'Fe', count: 1 }, { element: 'O₂', count: 3 }], 
      right: [{ element: 'Fe₂O₃', count: 1 }] // Unbalanced (Fe:1 vs 2, O:6 vs 3)
    },
    { 
      left: [{ element: 'CH₄', count: 1 }, { element: 'O₂', count: 2 }], 
      right: [{ element: 'CO₂', count: 1 }, { element: 'H₂O', count: 1 }] // Unbalanced (H:4 vs 2)
    },
  ];

  const generateNewEquation = () => {
    const equation = equations[Math.floor(Math.random() * equations.length)];
    const scrambleCoefficients = (side: EquationSide) => 
      side.map(item => ({ 
        ...item, 
        count: Math.floor(Math.random() * 3) + 1 
      }));
    
    setLeftSide(scrambleCoefficients(equation.left));
    setRightSide(scrambleCoefficients(equation.right));
    setHasWon(false);
    setScore(0);
  };

  const checkBalance = () => {
    const elements = new Set([...leftSide, ...rightSide].map(x => x.element));
    
    for (const element of elements) {
      const leftTotal = leftSide.reduce((sum, item) => 
        sum + (item.element === element ? item.count : 0), 0);
      const rightTotal = rightSide.reduce((sum, item) => 
        sum + (item.element === element ? item.count : 0), 0);
      
      if (leftTotal !== rightTotal) return false;
    }
    return true;
  };

  const handleCoefficientChange = (side: 'left' | 'right', index: number, value: string) => {
    const newValue = Math.max(1, Math.min(10, parseInt(value) || 1));
    const updateSide = side === 'left' ? [...leftSide] : [...rightSide];
    updateSide[index].count = newValue;
    
    if (side === 'left') {
      setLeftSide(updateSide);
    } else {
      setRightSide(updateSide);
    }

    setScore(s => s + 1);
    if (checkBalance()) setHasWon(true);
  };

  useEffect(() => {
    generateNewEquation();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-white bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-purple-600">
          ⚖️ Equation Balancer
        </h1>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="mb-6 bg-yellow-50 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <span className="text-2xl">📝</span> How to Play
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Adjust coefficients to balance the equation</li>
              <li>Use whole numbers between 1-10</li>
              <li>Same number of each element on both sides</li>
              <li>Lowest possible coefficients earn bonus points</li>
            </ul>
          </div>

          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex gap-2 relative">
              {!hasWon && (
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 text-red-500 text-2xl">
                  ≠
                </div>
              )}
              {leftSide.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={item.count}
                    onChange={(e) => handleCoefficientChange('left', i, e.target.value)}
                    className="w-16 text-center border rounded-lg py-2"
                  />
                  <span className="text-xl">{item.element}</span>
                  {i < leftSide.length - 1 && <span className="text-xl">+</span>}
                </div>
              ))}
            </div>
            
            <span className="text-2xl mx-4">→</span>
            
            <div className="flex gap-2">
              {rightSide.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={item.count}
                    onChange={(e) => handleCoefficientChange('right', i, e.target.value)}
                    className="w-16 text-center border rounded-lg py-2"
                  />
                  <span className="text-xl">{item.element}</span>
                  {i < rightSide.length - 1 && <span className="text-xl">+</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex gap-4 justify-center">
            <button
              onClick={generateNewEquation}
              className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              🔄 New Equation
            </button>
            <button
              onClick={() => setShowHelp(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            >
              🆘 Balancing Tips
            </button>
          </div>
        </div>

        {showHelp && (
          <Popup title="Balancing Strategies" onClose={() => setShowHelp(false)}>
            <div className="space-y-4 p-4">
              <p className="text-lg">✨ Effective balancing techniques:</p>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <ul className="list-disc pl-5 space-y-2">
                  <li>Start with elements that appear in only one compound per side</li>
                  <li>Balance metals first, then non-metals</li>
                  <li>Leave oxygen and hydrogen for last</li>
                  <li>Look for common multiples</li>
                  <li>Never change subscripts - only coefficients</li>
                </ul>
              </div>
            </div>
          </Popup>
        )}

        {hasWon && (
          <Popup title="🎉 Equation Balanced!" onClose={() => setHasWon(false)}>
            <div className="text-center p-4">
              <p className="text-xl mb-4">Perfect balance achieved! ⚖️</p>
              <p className="text-2xl font-bold mb-6">Score: {1000 - score * 10}</p>
              <div className="flex gap-4 justify-center">
                <button
                  className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                  onClick={generateNewEquation}
                >
                  Next Equation
                </button>
                <Link
                  href="/puzzles"
                  className="px-6 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600"
                >
                  More Puzzles
                </Link>
              </div>
              <Confetti recycle={false} numberOfPieces={500} />
            </div>
          </Popup>
        )}
      </div>
    </div>
  );
};

export default EquationBalancer; 