'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pizza } from 'lucide-react';
import { GLSLHills } from '@/components/ui/glsl-hills';
import Link from 'next/link';

const PizzaSliceIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="currentColor"
  >
    <path d="M50 50 L50 10 A40 40 0 0 1 78.28 28.28 Z" fill="#FFA500" />
    <circle cx="60" cy="25" r="3" fill="#FF0000" />
    <circle cx="70" cy="35" r="3" fill="#FF0000" />
    <circle cx="58" cy="35" r="2.5" fill="#FFFF00" />
    <path d="M50 50 L50 10 A40 40 0 0 1 78.28 28.28 Z" fill="none" stroke="#D2691E" strokeWidth="2" />
  </svg>
);

export function LandingContent() {
  const [projectName, setProjectName] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Project Name:', projectName);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden cursor-none bg-black" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* GLSL Hills Background */}
      <div className="absolute inset-0">
        <GLSLHills speed={0.3} />
      </div>

      {/* Custom Pizza Cursor */}
      <motion.div
        className="fixed pointer-events-none z-50"
        animate={{
          x: cursorPosition.x - 20,
          y: cursorPosition.y - 20,
        }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 300,
          mass: 0.5,
        }}
      >
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <PizzaSliceIcon className="w-10 h-10" />
        </motion.div>
      </motion.div>

      {/* Central Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="w-full max-w-3xl text-center"
        >
          {/* Pizza Icon */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="mb-6 flex justify-center"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <Pizza className="w-12 h-12 text-orange-500" strokeWidth={1} />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-5xl md:text-7xl mb-4 text-white font-semibold tracking-tight"
            style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}
          >
            Monad Blitz Arena
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-sm md:text-base text-gray-400 mb-12 font-light tracking-widest uppercase"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            High-energy Arcade dApp
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/arena">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full hover:from-orange-400 hover:to-orange-500 transition shadow-lg"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Enter Arena
              </motion.button>
            </Link>
          </motion.div>

          {/* Footer text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="text-xs text-gray-600 mt-12 uppercase tracking-widest"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Mint Pizza Pass · Play Reflex Game · Bet on Winners
          </motion.p>
        </motion.div>
      </div>

      {/* Google Fonts import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
      `}</style>
    </div>
  );
}
