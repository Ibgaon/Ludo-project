import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 400);
          return 100;
        }
        return prev + 5;
      });
    }, 80);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div
      onClick={onFinish}
      className="fixed inset-0 z-50 bg-[#f7f9fb] flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden"
    >
      <div className="absolute inset-0 bg-pattern z-0" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-sm px-5 text-center">
        {/* Animated 3D Dice Graphic */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotate: -15 }}
          animate={{ scale: 1, opacity: 1, rotate: 12 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-8 relative floating-dice"
        >
          <div className="w-32 h-32 bg-[#4648d4] rounded-2xl shadow-xl flex items-center justify-center relative overflow-hidden border-4 border-white pulse-glow">
            {/* Soft inner highlight */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-white/40 rounded-2xl pointer-events-none" />
            <div className="grid grid-cols-3 grid-rows-3 gap-2 p-4 w-full h-full">
              <div className="bg-white rounded-full w-4 h-4 self-center justify-self-center shadow-xs" />
              <div />
              <div className="bg-white rounded-full w-4 h-4 self-center justify-self-center shadow-xs" />
              <div />
              <div className="bg-white rounded-full w-4 h-4 self-center justify-self-center shadow-xs" />
              <div />
              <div className="bg-white rounded-full w-4 h-4 self-center justify-self-center shadow-xs" />
              <div />
              <div className="bg-white rounded-full w-4 h-4 self-center justify-self-center shadow-xs" />
            </div>
          </div>

          {/* Secondary decorative pawn piece */}
          <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-[#fd761a] rounded-full shadow-lg flex items-center justify-center border-2 border-white z-20">
            <div className="w-8 h-8 rounded-full border-2 border-white/60 bg-gradient-to-b from-white/40 to-transparent flex items-center justify-center">
              <div className="w-4 h-4 bg-white/90 rounded-full shadow-xs" />
            </div>
          </div>
        </motion.div>

        {/* Brand Typography */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-extrabold text-[36px] md:text-[42px] text-[#4648d4] tracking-tight mb-2"
        >
          LUDO PREMIER
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-[17px] font-semibold text-[#464554] mb-12"
        >
          The Classic Game, Reimagined.
        </motion.p>
      </div>

      {/* Loading Progress Bar */}
      <div className="absolute bottom-16 left-0 right-0 px-8 flex flex-col items-center z-10 max-w-sm mx-auto">
        <div className="w-full h-3 bg-[#e0e3e5] rounded-full overflow-hidden shadow-inner p-0.5">
          <div
            className="h-full bg-gradient-to-r from-[#4648d4] to-[#6063ee] rounded-full transition-all duration-150 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
          </div>
        </div>
        <p className="mt-4 text-[12px] font-bold tracking-widest text-[#6063ee] uppercase">
          {progress < 100 ? 'LOADING ASSETS...' : 'READY!'}
        </p>
      </div>
    </div>
  );
};
