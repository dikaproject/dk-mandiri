'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Fish } from 'lucide-react';

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper = ({ children }: PageWrapperProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [bubblePositions, setBubblePositions] = useState<Array<{ left: string, delay: number, duration: number, xOffset: number }>>([]);

  useEffect(() => {
    // Generate bubble positions once on mount
    const smallBubbles = Array(15).fill(0).map(() => ({
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 2,
      duration: Math.random() * 2 + 3,
      xOffset: Math.random() * 50 - 25
    }));

    const mediumBubbles = Array(8).fill(0).map(() => ({
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 2,
      duration: Math.random() * 3 + 4,
      xOffset: Math.random() * 100 - 50
    }));

    const largeBubbles = Array(5).fill(0).map(() => ({
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 2,
      duration: Math.random() * 4 + 5,
      xOffset: Math.random() * 150 - 75
    }));

    setBubblePositions([...smallBubbles, ...mediumBubbles, ...largeBubbles]);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-100 to-cyan-100 overflow-hidden"
        >
          {/* Custom Wave Background */}
          <div className="wave-container">
            <div className="wave wave1" />
            <div className="wave wave2" />
            <div className="wave wave3" />
          </div>
          
          {/* Loading Container */}
          <div className="relative flex flex-col items-center">
            {/* Animated Logo */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-75 blur-lg animate-pulse"></div>
                <Fish className="w-16 h-16 text-blue-600 relative animate-bounce" />
              </div>
            </motion.div>

            {/* Company Name Animation */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-700 to-blue-900 bg-clip-text text-transparent">
                DK-Mandiri
              </h1>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="h-1 w-full bg-gradient-to-r from-cyan-400 to-blue-500 mt-2 rounded-full"
              />
            </motion.div>

            {/* Loading Dots */}
            <motion.div 
              className="flex space-x-2 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-blue-500 rounded-full"
                  animate={{
                    y: ["0%", "-50%", "0%"],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* Small Bubbles */}
          {bubblePositions.slice(0, 15).map((pos, i) => (
            <motion.div
              key={`small-${i}`}
              className="absolute h-2 w-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"
              initial={{ y: 0, x: 0, opacity: 0 }}
              animate={{
                y: -1000,
                x: pos.xOffset,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: pos.duration,
                repeat: Infinity,
                delay: pos.delay,
              }}
              style={{ left: pos.left, bottom: '-10px' }}
            />
          ))}

          {/* Medium Bubbles */}
          {bubblePositions.slice(15, 23).map((pos, i) => (
            <motion.div
              key={`medium-${i}`}
              className="absolute h-4 w-4 bg-gradient-to-r from-cyan-400/40 to-blue-400/40 rounded-full"
              initial={{ y: 0, x: 0, opacity: 0, scale: 1 }}
              animate={{
                y: -1000,
                x: pos.xOffset,
                opacity: [0, 0.5, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: pos.duration,
                repeat: Infinity,
                delay: pos.delay,
              }}
              style={{ left: pos.left, bottom: '-20px' }}
            />
          ))}

          {/* Large Bubbles */}
          {bubblePositions.slice(23).map((pos, i) => (
            <motion.div
              key={`large-${i}`}
              className="absolute h-6 w-6 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-full"
              initial={{ y: 0, x: 0, opacity: 0, scale: 1 }}
              animate={{
                y: -1000,
                x: pos.xOffset,
                opacity: [0, 0.3, 0],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: pos.duration,
                repeat: Infinity,
                delay: pos.delay,
              }}
              style={{ left: pos.left, bottom: '-30px' }}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageWrapper;