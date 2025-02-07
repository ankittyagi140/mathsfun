'use client';
import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import Link from 'next/link';
import Header from '@/components/Header';
import Popup from '@/components/Popup';

type Card = {
  id: string;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const MathMatch = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isInteractable, setIsInteractable] = useState(true);

  const numberPairs = [
    { number: '12', expression: '3×4' },
    { number: '8', expression: '2³' },
    { number: '15', expression: '30÷2' },
    { number: '25', expression: '5²' },
    { number: '18', expression: '9+9' },
    { number: '10', expression: '√100' },
  ];

  const initializeGame = () => {
    const generatedCards = numberPairs
      .flatMap(pair => [
        { id: Math.random().toString(), value: pair.number, isFlipped: false, isMatched: false },
        { id: Math.random().toString(), value: pair.expression, isFlipped: false, isMatched: false },
      ])
      .sort(() => Math.random() - 0.5);
    
    setCards(generatedCards);
    setMatches(0);
    setMoves(0);
  };

  const handleCardClick = (id: string) => {
    if (!isInteractable || flippedCards.length === 2 || cards.find(c => c.id === id)?.isMatched) return;

    setCards(cards.map(card => 
      card.id === id ? { ...card, isFlipped: true } : card
    ));
    setFlippedCards([...flippedCards, id]);
    setMoves(m => m + 1);
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsInteractable(false);
      const [firstId, secondId] = flippedCards;
      const firstCard = cards.find(c => c.id === firstId)!;
      const secondCard = cards.find(c => c.id === secondId)!;

      const isMatch = numberPairs.some(pair => 
        (pair.number === firstCard.value && pair.expression === secondCard.value) ||
        (pair.expression === firstCard.value && pair.number === secondCard.value)
      );

      if (isMatch) {
        setCards(cards.map(card => 
          flippedCards.includes(card.id) ? { ...card, isMatched: true } : card
        ));
        setMatches(m => m + 1);
      }

      setTimeout(() => {
        setCards(cards.map(card => 
          !card.isMatched ? { ...card, isFlipped: false } : card
        ));
        setFlippedCards([]);
        setIsInteractable(true);
      }, 1000);
    }
  }, [flippedCards]);

  useEffect(() => {
    initializeGame();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-purple-600">
          🧠 Math Match
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="mb-6 bg-yellow-50 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <span className="text-2xl">🎯</span> How to Play
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Match numbers with their equivalent expressions</li>
              <li>Find all pairs in the fewest moves possible</li>
              <li>Watch out for similar-looking expressions</li>
            </ul>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            {cards.map(card => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`aspect-square flex items-center justify-center text-xl font-bold 
                  transition-all duration-300 transform hover:scale-105
                  ${card.isMatched ? 'bg-green-200' : card.isFlipped ? 'bg-blue-100' : 'bg-gray-200'}
                  ${card.isFlipped ? 'rotate-0' : 'rotate-y-180'}
                  rounded-lg shadow-md`}
                disabled={!isInteractable || card.isMatched}
              >
                {card.isFlipped || card.isMatched ? card.value : '?'}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="bg-blue-100 px-4 py-2 rounded-lg">
              Moves: {moves}
            </div>
            <div className="bg-green-100 px-4 py-2 rounded-lg">
              Matches: {matches}/{numberPairs.length}
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={initializeGame}
              className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              🔄 New Game
            </button>
          </div>
        </div>

        {matches === numberPairs.length && (
          <Popup title="🎉 Perfect Match!" onClose={() => {}}>
            <div className="text-center p-4">
              <p className="text-xl mb-4">You matched all pairs in {moves} moves! 🏆</p>
              <div className="flex gap-4 justify-center">
                <button
                  className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                  onClick={initializeGame}
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
              <Confetti recycle={false} numberOfPieces={500} />
            </div>
          </Popup>
        )}
      </div>
    </div>
  );
};

export default MathMatch; 