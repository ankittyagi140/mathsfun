'use client';
import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { InfoIcon, LightbulbIcon } from 'lucide-react';
import Header from '@/components/Header';

type SequenceType = 'arithmetic' | 'geometric' | 'quadratic';

export default function NumberSequence() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [showHint, setShowHint] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [sequenceType, setSequenceType] = useState<SequenceType>('arithmetic');

  const generateSequence = () => {
    const types: SequenceType[] = ['arithmetic', 'geometric', 'quadratic'];
    const type = types[Math.floor(Math.random() * types.length)];
    setSequenceType(type);
    
    // Ensure minimum length of 4 (3 shown + 1 hidden)
    const baseLength = 3 + Math.floor(level / 2);
    const length = Math.max(baseLength, 4);
    
    let newSequence: number[] = [];
    let start = Math.floor(Math.random() * 20) + 1;

    switch(type) {
      case 'arithmetic':
        const diff = Math.floor(Math.random() * 5) + 2;
        newSequence = Array.from({length}, (_, i) => start + i * diff);
        break;
      case 'geometric':
        const ratio = Math.floor(Math.random() * 3) + 2;
        newSequence = Array.from({length}, (_, i) => start * Math.pow(ratio, i));
        break;
      case 'quadratic':
        newSequence = Array.from({length}, (_, i) => start + i*i);
        break;
    }

    // Verify sequence validity before setting state
    if (newSequence.some(num => isNaN(num))) {
      return generateSequence(); // Regenerate if invalid
    }
    
    setSequence(newSequence.slice(0, -1));
    setIsCorrect(null);
    setUserAnswer('');
  };

  const validateAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    
    const fullSequence = generateFullSequence();
    if (!fullSequence || fullSequence.length < 4) {
      setIsCorrect(false);
      return;
    }
    
    const correctAnswer = fullSequence[3];
    
    if (Number(userAnswer) === correctAnswer) {
      setIsCorrect(true);
      setScore(prev => prev + 15 * level);
      
      setTimeout(() => {
        // Reset states before level change
        setIsCorrect(null);
        setUserAnswer('');
        setLevel(prev => prev + 1);
      }, 1500);
      
    } else {
      setIsCorrect(false);
    }
  };

  const generateFullSequence = () => {
    if (sequence.length < 3) return [];
    
    const start = sequence[0];
    switch(sequenceType) {
      case 'arithmetic':
        const diff = sequence[1] - sequence[0];
        if (sequence[2] - sequence[1] !== diff) return [];
        return [start, start + diff, start + 2*diff, start + 3*diff];
        
      case 'geometric':
        if (sequence[0] === 0) return []; // Prevent division by zero
        const ratio = sequence[1] / sequence[0];
        if (sequence[2] / sequence[1] !== ratio) return [];
        return [start, start * ratio, start * ratio**2, start * ratio**3];
        
      case 'quadratic':
        // Verify quadratic pattern (n² difference)
        const diff1 = sequence[1] - sequence[0];
        const diff2 = sequence[2] - sequence[1];
        if (diff2 - diff1 !== 2) return []; // Quadratic difference should increase by 2
        return [start, start + 1, start + 1 + 3, start + 1 + 3 + 5];
        
      default:
        return [];
    }
  };

  useEffect(() => {
    generateSequence();
  }, [level]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-8">
            <h1 className="text-3xl font-bold">🔢 Number Sequence Puzzle</h1>
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
                <li>Identify the pattern in the number sequence</li>
                <li>Enter the correct next number</li>
                <li>Pattern types include arithmetic, geometric, and quadratic</li>
                <li>Correct answers give 15× level points</li>
                <li>Difficulty increases with each level</li>
              </ul>
            </div>
          )}

          <form onSubmit={validateAnswer} className="space-y-6">
            <div className="flex flex-wrap gap-4 justify-center items-center text-2xl font-mono">
              {sequence.map((num, index) => (
                <span key={index} className="px-4 py-2 bg-gray-100 rounded">
                  {num}
                </span>
              ))}
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className={`w-20 text-center border-2 rounded p-2 ${
                  isCorrect === false ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="?"
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-lg"
              >
                Check Answer
              </button>
            </div>
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
              onClick={generateSequence}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Skip Puzzle
            </button>
          </div>

          {showHint && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <p className="text-yellow-700">
                💡 Pattern type: {sequenceType.replace(/-/g, ' ')} - 
                {sequenceType === 'arithmetic' && ' Constant difference between numbers'}
                {sequenceType === 'geometric' && ' Multiplying by a constant ratio'}
                {sequenceType === 'quadratic' && ' Numbers increase by square numbers'}
              </p>
            </div>
          )}

          {isCorrect === true && (
            <div className="text-center text-green-600 font-bold animate-bounce mt-4">
              ✓ Correct! Next level...
            </div>
          )}
          {isCorrect === false && (
            <div className="text-center text-red-500 font-bold mt-4">
              ✗ Try again! Look for the pattern type
            </div>
          )}
          
          {isCorrect && <Confetti recycle={false} numberOfPieces={300} />}
        </div>
      </div>
    </div>
  );
} 