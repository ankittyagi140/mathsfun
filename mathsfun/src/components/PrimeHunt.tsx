'use client';
import { useState, useEffect, useCallback } from 'react';
import Confetti from 'react-confetti';
import Link from 'next/link';
import Popup from '@/components/Popup';

export default function PrimeHunt() {
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [numbers, setNumbers] = useState<number[]>([]);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [showHelp, setShowHelp] = useState(true);
  const [wrongSelections, setWrongSelections] = useState<number[]>([]);

  const isPrime = (num: number) => {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  };

  const generateNumbers = useCallback(() => {
    const primes = new Set<number>();
    while (primes.size < 10) {
      const num = Math.floor(Math.random() * 50) + 2;
      if (isPrime(num)) primes.add(num);
    }
    
    const nonPrimes = new Set<number>();
    while (nonPrimes.size < 10) {
      const num = Math.floor(Math.random() * 50) + 2;
      if (!isPrime(num)) nonPrimes.add(num);
    }

    setNumbers([...Array.from(primes), ...Array.from(nonPrimes)]
      .sort(() => Math.random() - 0.5));
  }, []);

  const handleNumberClick = (num: number) => {
    if (gameStatus !== 'playing' || selectedNumbers.includes(num)) return;

    if (isPrime(num)) {
      setScore(s => s + 100);
      setSelectedNumbers([...selectedNumbers, num]);
      if(selectedNumbers.length + 1 === 10) setGameStatus('won');
    } else {
      setWrongSelections([...wrongSelections, num]);
      setTimeLeft(t => Math.max(0, t - 3));
      setScore(s => Math.max(0, s - 50));
    }
  };

  useEffect(() => {
    generateNumbers();
  }, [generateNumbers]);

  useEffect(() => {
    if (timeLeft > 0 && gameStatus === 'playing') {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setGameStatus('lost');
    }
  }, [timeLeft, gameStatus]);

  return (
    <div className="min-h-screen p-8 bg-white bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-purple-600">
          🔢 Prime Number Hunt
        </h1>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="mb-6 bg-yellow-50 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <span className="text-2xl">📝</span> How to Play
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Click only prime numbers (divisible by 1 and itself)</li>
              <li>Avoid composite numbers (-3 seconds, -50 points)</li>
              <li>Find all 10 primes before time runs out</li>
              <li>Earn 100 points per correct prime</li>
            </ul>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="bg-blue-100 px-4 py-2 rounded-lg">
              ⏳ Time Left: {timeLeft}s
            </div>
            <div className="bg-green-100 px-4 py-2 rounded-lg">
              🏆 Score: {score}
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2 bg-gray-200 p-2 rounded-lg mb-6">
            {numbers.map((num, i) => (
              <button
                key={i}
                onClick={() => handleNumberClick(num)}
                disabled={gameStatus !== 'playing' || selectedNumbers.includes(num)}
                className={`aspect-square flex items-center justify-center text-xl font-bold
                  ${selectedNumbers.includes(num) 
                    ? isPrime(num) ? 'bg-green-200' : 'bg-red-200'
                    : wrongSelections.includes(num) 
                      ? 'bg-red-100 ring-2 ring-red-500'
                      : 'bg-white hover:bg-blue-50'}
                  ${gameStatus !== 'playing' && !selectedNumbers.includes(num) && isPrime(num)
                    ? 'ring-4 ring-purple-400' : ''}
                  transition-all duration-200 rounded-lg`}
              >
                {num}
              </button>
            ))}
          </div>

          <div className="mt-6 flex gap-4 justify-center">
            <button
              onClick={() => {
                generateNumbers();
                setTimeLeft(30);
                setScore(0);
                setSelectedNumbers([]);
                setWrongSelections([]);
                setGameStatus('playing');
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              🔄 New Game
            </button>
            <button
              onClick={() => setShowHelp(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            >
              🆘 Prime Tips
            </button>
          </div>
        </div>

        {showHelp && (
          <Popup title="Prime Number Tips" onClose={() => setShowHelp(false)}>
            <div className="space-y-4 p-4">
              <p className="text-lg">✨ Quick prime checks:</p>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <ul className="list-disc pl-5 space-y-2">
                  <li>Even numbers &gt; 2 are not prime</li>
                  <li>Numbers ending with 5 (except 5) aren&apos;t prime</li>
                  <li>Check divisibility up to square root</li>
                  <li>Primes under 50: 2,3,5,7,11,13,17,19,23,29,31,37,41,43,47</li>

                </ul>
              </div>
              <p className="text-center text-sm text-gray-600">
                Look for numbers that can&apos;t be divided easily!
              </p>
            </div>

          </Popup>
        )}

        {(gameStatus === 'won' || gameStatus === 'lost') && (
          <Popup title={gameStatus === 'won' ? "🎉 You Won!" : "😢 Time's Up!"} onClose={() => {}}>
            <div className="text-center p-4">
              <p className="text-xl mb-4">
                {gameStatus === 'won' 
                  ? `Found all primes with ${timeLeft}s remaining!` 
                  : "Better luck next time!"}
              </p>
              <p className="text-2xl font-bold mb-6">Final Score: {score}</p>
              <div className="flex gap-4 justify-center">
                <button
                  className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                  onClick={() => {
                    generateNumbers();
                    setTimeLeft(30);
                    setScore(0);
                    setSelectedNumbers([]);
                    setWrongSelections([]);
                    setGameStatus('playing');
                  }}
                >
                  Play Again
                </button>
                <Link
                  href="/puzzles"
                  className="px-6 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600"
                >
                  More Puzzles
                </Link>
              </div>
              {gameStatus === 'won' && (
                <Confetti recycle={false} numberOfPieces={500} />
              )}
            </div>
          </Popup>
        )}
      </div>
    </div>
  );
} 