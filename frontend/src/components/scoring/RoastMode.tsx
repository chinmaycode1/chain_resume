import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';

interface RoastModeProps {
  roastText: string;
  onShare?: () => void;
}

export const RoastMode = ({ roastText, onShare }: RoastModeProps) => {
  const [isActive, setIsActive] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [showScanline, setShowScanline] = useState(false);

  // Typewriter effect
  useEffect(() => {
    if (!isActive) {
      setDisplayedText('');
      return;
    }

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= roastText.length) {
        setDisplayedText(roastText.slice(0, currentIndex));
        currentIndex++;

        // Add random skull emoji between sentences
        if (roastText[currentIndex - 1] === '.' && Math.random() > 0.5) {
          setDisplayedText((prev) => prev + ' 💀');
        }
      } else {
        clearInterval(interval);
      }
    }, 30); // 30ms per character

    return () => clearInterval(interval);
  }, [isActive, roastText]);

  const handleActivate = () => {
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    setShowScanline(true);
    
    // Show scanline briefly
    setTimeout(() => {
      setShowScanline(false);
      setIsActive(true);
    }, 500);
  };

  return (
    <div className="space-y-4">
      {/* Toggle button */}
      {!isActive && (
        <Button
          variant="outline"
          onClick={handleActivate}
          className="w-full border-[#FF006E] text-[#FF006E] hover:bg-[#FF006E]/10"
          style={{
            boxShadow: '0 0 20px rgba(255, 0, 110, 0.3)',
          }}
        >
          ROAST ME 🔥
        </Button>
      )}

      {/* Confirmation modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-dark-navy border-2 border-[#FF006E] rounded-lg p-6 max-w-md w-full"
              style={{
                boxShadow: '0 0 40px rgba(255, 0, 110, 0.5)',
              }}
            >
              <div className="text-center space-y-4">
                <div className="text-4xl">⚠️</div>
                <h3 className="text-xl font-bold font-mono text-[#FF006E]">
                  WARNING: ROAST MODE
                </h3>
                <p className="text-gray-300 font-mono text-sm">
                  This AI will be brutally honest about your resume. It's savage but helpful.
                  Can you handle the truth?
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirm(false)}
                    className="flex-1"
                  >
                    Nevermind
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleConfirm}
                    className="flex-1 bg-[#FF006E] hover:bg-[#FF006E]/80"
                  >
                    I can take it 💪
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanline overlay */}
      <AnimatePresence>
        {showScanline && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-40 pointer-events-none"
            style={{
              background: 'repeating-linear-gradient(0deg, rgba(255, 0, 110, 0.1) 0px, transparent 2px, transparent 4px)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Roast terminal */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-black border-2 border-[#FF006E] rounded-lg p-6 font-mono"
            style={{
              boxShadow: '0 0 30px rgba(255, 0, 110, 0.4)',
            }}
          >
            {/* Terminal header */}
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#FF006E]/30">
              <div className="w-3 h-3 rounded-full bg-[#FF006E]" />
              <div className="w-3 h-3 rounded-full bg-[#FF006E]/50" />
              <div className="w-3 h-3 rounded-full bg-[#FF006E]/30" />
              <span className="ml-2 text-[#FF006E] text-sm">ROAST_MODE.exe</span>
            </div>

            {/* Roast text with typewriter effect */}
            <div className="text-[#FF006E] text-sm leading-relaxed whitespace-pre-wrap">
              {displayedText}
              {displayedText.length < roastText.length && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block w-2 h-4 bg-[#FF006E] ml-1"
                />
              )}
            </div>

            {/* Actions */}
            {displayedText.length >= roastText.length && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 pt-4 border-t border-[#FF006E]/30 flex gap-3"
              >
                <Button
                  variant="outline"
                  onClick={() => setIsActive(false)}
                  className="flex-1 border-[#FF006E] text-[#FF006E]"
                >
                  Close
                </Button>
                {onShare && (
                  <Button
                    variant="primary"
                    onClick={onShare}
                    className="flex-1 bg-[#FF006E] hover:bg-[#FF006E]/80"
                  >
                    Share Roast 📤
                  </Button>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
