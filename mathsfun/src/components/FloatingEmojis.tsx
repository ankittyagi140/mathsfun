'use client';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

const EMOJIS = ['🌟', '🎉', '✨', '🚀', '🎈', '⭐️'];

export default function FloatingEmojis() {
  const [isReady, setIsReady] = useState(false);
  const positions = useMemo(() => 
    isReady ? EMOJIS.map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100
    })) : [],
  [isReady]);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) return null;

  return (
    <>
      {EMOJIS.map((emoji, index) => (
        <motion.span
          key={`${positions[index].x}-${positions[index].y}`}
          className="absolute text-3xl transform -translate-x-1/2 -translate-y-1/2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            x: [-50, Math.random() * 100 - 50],
            y: [-50, Math.random() * 100 - 50]
          }}
          transition={{
            duration: 2,
            delay: index * 0.2,
            repeat: Infinity,
            repeatDelay: 15
          }}
          style={{
            left: `${positions[index].x}%`,
            top: `${positions[index].y}%`
          }}
        >
          {emoji}
        </motion.span>
      ))}
    </>
  );
} 