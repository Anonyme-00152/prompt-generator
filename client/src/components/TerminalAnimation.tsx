import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TerminalAnimationProps {
  isActive: boolean;
  prompt: string;
}

export function TerminalAnimation({ isActive, prompt }: TerminalAnimationProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setDisplayedText('');
      setCurrentIndex(0);
      return;
    }

    const interval = setInterval(() => {
      if (currentIndex < prompt.length) {
        setDisplayedText((prev) => prev + prompt[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      } else {
        clearInterval(interval);
      }
    }, 5); // Vitesse de typage

    return () => clearInterval(interval);
  }, [isActive, prompt, currentIndex]);

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
    >
      <div className="bg-black/80 backdrop-blur-sm rounded-xl border border-amber-500/30 p-6 max-w-2xl max-h-96 overflow-hidden">
        <div className="font-mono text-sm text-amber-400 whitespace-pre-wrap break-words">
          <span>{displayedText}</span>
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="ml-1"
          >
            ▌
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}
