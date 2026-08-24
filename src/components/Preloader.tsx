import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';

export const Preloader: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-[#C84B31] flex items-center justify-center overflow-hidden select-none pointer-events-none"
        >
          {/* Impact Shockwave Pulse Ring in Soft Peach Cream */}
          <motion.div
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{
              scale: [0.2, 1, 2.4, 0],
              opacity: [0, 0.8, 0, 0],
            }}
            transition={{
              duration: 2.4,
              times: [0, 0.35, 0.65, 1],
              ease: 'easeOut',
            }}
            className="absolute w-72 h-72 rounded-full border-4 border-[#F9F1F0]/50 pointer-events-none"
          />

          {/* Centered Soft Peach Circle Emblem with Football Bounce & Spin Motion */}
          <motion.div
            initial={{ y: -500, scale: 0.4, rotate: -360, opacity: 0 }}
            animate={{
              y: [-500, 0, -50, 0, 0],
              scale: [0.4, 1.1, 0.95, 1, 38],
              rotate: [-360, 0, 15, 0, 0],
              opacity: [0, 1, 1, 1, 0],
            }}
            transition={{
              duration: 2.4,
              times: [0, 0.35, 0.5, 0.65, 1],
              ease: ['easeOut', 'easeOut', 'easeInOut', 'easeInOut'],
            }}
            className="w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-[#F9F1F0] text-[#C84B31] shadow-2xl flex flex-col items-center justify-center p-6 border-4 border-white/60 z-10"
          >
            {/* PING Brand Title */}
            <span className="font-foudre font-black text-6xl sm:text-7xl text-[#C84B31] uppercase leading-none tracking-tight">
              PING
            </span>

            {/* Sage Emerald Inner Badge */}
            <div className="w-12 h-12 rounded-full bg-[#2D5D4B] text-[#F9F1F0] flex items-center justify-center mt-2 shadow-inner">
              <Zap className="w-6 h-6 fill-current" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
