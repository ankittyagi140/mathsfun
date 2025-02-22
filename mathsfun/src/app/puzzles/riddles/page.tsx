'use client';
import { useState, useEffect, useCallback } from 'react';
import Popup from '../../../components/Popup';
import ProgressBar from '../../../components/ProgressBar';
import { motion } from 'framer-motion';
import ReactConfetti from 'react-confetti';
import { allRiddles } from '@/utils/allRiddles';

type Riddle = {
  question: string;
  answer: string;
  hint: string;
  difficulty: number;
};

const riddles:Riddle[] = allRiddles;

// Add animation variants
const inputVariants = {
  shake: {
    x: [-5, 5, -5, 5, 0],
    transition: { duration: 0.5 }
  },
  correct: {
    scale: [1, 1.1, 1],
    backgroundColor: "#DCFCE7",
    transition: { duration: 0.3 }
  },
  wrong: {
    backgroundColor: "#FEE2E2",
    scale: [1, 1.05, 1],
    transition: { duration: 0.4 }
  }
};

// Add difficulty levels
const DIFFICULTY_LEVELS = [
  { id: 'all', label: 'All Levels' },
  { id: '1', label: 'Easy ★' },
  { id: '2', label: 'Medium ★★' },
  { id: '3', label: 'Hard ★★★' },
];

const RiddlePuzzle = () => {
  const [currentRiddle, setCurrentRiddle] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [isWrongAnswer, setIsWrongAnswer] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [filteredRiddles, setFilteredRiddles] = useState<Riddle[]>(riddles);

  const nextRiddle = useCallback(() => {
    if (currentRiddle < riddles.length - 1) {
      setCurrentRiddle(prev => prev + 1);
      setUserAnswer('');
      setShowHint(false);
      setIsCorrect(false);
    }
  }, [currentRiddle]);

  const checkAnswer = useCallback(() => {
    const cleanedAnswer = userAnswer.trim().toUpperCase().replace(/[^A-Z]/g, '');
    const correctAnswer = riddles[currentRiddle].answer.toUpperCase().replace(/[^A-Z]/g, '');

    if (cleanedAnswer === correctAnswer) {
      setIsCorrect(true);
      setScore(prev => prev + (3 - riddles[currentRiddle].difficulty));
      setTimeout(nextRiddle, 2000);
    } else {
      setUserAnswer('');
      setIsWrongAnswer(true);
    }
  }, [currentRiddle, nextRiddle, userAnswer]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') checkAnswer();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [checkAnswer]);

  // Add effect to filter riddles
  useEffect(() => {
    if (selectedDifficulty === 'all') {
      setFilteredRiddles(riddles);
    } else {
      setFilteredRiddles(
        riddles.filter(r => r.difficulty === parseInt(selectedDifficulty))
      );
    }
    setCurrentRiddle(0);
    setUserAnswer('');
    setShowHint(false);
    setIsCorrect(false);
  }, [selectedDifficulty]);

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-gray-50">
      <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-600 mb-4">
            🧠 Riddle Challenge
          </h1>
          
          {/* Difficulty Selector */}
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {DIFFICULTY_LEVELS.map((level) => (
              <motion.button
                key={level.id}
                onClick={() => setSelectedDifficulty(level.id)}
                className={`
                  px-4 py-2 rounded-full text-sm sm:text-base
                  ${selectedDifficulty === level.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {level.label}
              </motion.button>
            ))}
          </div>

          <ProgressBar 
            progress={(currentRiddle + 1) / filteredRiddles.length * 100} 
            className="h-3 sm:h-4"
          />
        </div>

        {/* Game Area */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          {/* Riddle Card */}
          <div className="mb-6 sm:mb-8 bg-indigo-50 p-4 sm:p-6 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm sm:text-base font-medium text-indigo-600">
                Riddle #{currentRiddle + 1} of {filteredRiddles.length}
              </span>
              <span className="text-xs sm:text-sm text-yellow-600">
                Difficulty: {'★'.repeat(filteredRiddles[currentRiddle].difficulty)}
              </span>
            </div>
            
            <p className="text-lg sm:text-xl md:text-2xl font-medium mb-4">
              {filteredRiddles[currentRiddle].question}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value.toUpperCase())}
                placeholder="Type your answer..."
                className="flex-1 px-4 py-2 sm:py-3 border rounded-lg text-base sm:text-lg"
                variants={inputVariants}
                animate={isWrongAnswer ? 'shake' : isCorrect ? 'correct' : 'default'}
                onAnimationComplete={() => {
                  if (isWrongAnswer) {
                    setIsWrongAnswer(false);
                  }
                }}
                style={{
                  backgroundColor: isWrongAnswer ? '#FEE2E2' : '#fff'
                }}
              />
              <button
                onClick={checkAnswer}
                className="px-6 py-2 sm:py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm sm:text-base"
              >
                Submit
              </button>
            </div>
          </div>

          {/* Hint & Help */}
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            <button
              onClick={() => setShowHint(true)}
              className="p-3 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 text-sm sm:text-base"
            >
              💡 Show Hint
            </button>
            <button
              onClick={() => setShowHelp(true)}
              className="p-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 text-sm sm:text-base"
            >
              🆘 Need Help?
            </button>
          </div>
        </div>

        {/* Score Panel */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center">
          <h3 className="text-xl sm:text-2xl font-bold mb-2">Score: {score}</h3>
          <p className="text-gray-600 sm:text-lg">
            Correct answers: {currentRiddle} / {filteredRiddles.length}
          </p>
        </div>

        {/* Popups */}
        {showHint && (
          <Popup title="Hint" onClose={() => setShowHint(false)}>
            <div className="text-center p-4 sm:p-6">
              <p className="text-lg sm:text-xl font-medium mb-4">
                {filteredRiddles[currentRiddle].hint}
              </p>
              <button
                className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                onClick={() => setShowHint(false)}
              >
                Close
              </button>
            </div>
          </Popup>
        )}

        {showHelp && (
          <Popup title="How to Play" onClose={() => setShowHelp(false)}>
            <div className="space-y-4 p-4 sm:p-6">
              <ul className="list-disc pl-5 space-y-3 text-sm sm:text-base">
                <li>Read the riddle carefully</li>
                <li>Type your answer in the input box</li>
                <li>Press Enter or click Submit to check</li>
                <li>Use hints sparingly - they reduce points!</li>
              </ul>
            </div>
          </Popup>
        )}

        {isCorrect && (
          <Popup title="🎉 Correct Answer!" onClose={() => setIsCorrect(false)}>
            <div className="text-center p-4 sm:p-6">
              <p className="text-xl sm:text-2xl mb-4">Well done! Next riddle loading...</p>
            </div>
          </Popup>
        )}
        {isCorrect && <ReactConfetti recycle={false} numberOfPieces={300} />}
      </div>
    </div>
  );
};

export default RiddlePuzzle; 