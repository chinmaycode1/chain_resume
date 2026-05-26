import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';

interface BulletSuggestion {
  original: string;
  suggestion: string;
  improvement: number; // score delta
}

interface PolishModeProps {
  suggestions: BulletSuggestion[];
  onApplyOne?: (index: number) => void;
  onApplyAll?: () => void;
}

export const PolishMode = ({ suggestions, onApplyOne, onApplyAll }: PolishModeProps) => {
  const [appliedIndices, setAppliedIndices] = useState<Set<number>>(new Set());
  const [highlightedWords, setHighlightedWords] = useState<number | null>(null);

  const handleApplyOne = (index: number) => {
    setHighlightedWords(index);
    setTimeout(() => {
      setAppliedIndices((prev) => new Set([...prev, index]));
      setHighlightedWords(null);
      onApplyOne?.(index);
    }, 400);
  };

  const handleApplyAll = () => {
    onApplyAll?.();
    setAppliedIndices(new Set(suggestions.map((_, i) => i)));
  };

  const totalImprovement = suggestions.reduce((sum, s) => sum + s.improvement, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-dark-navy/50 backdrop-blur-sm border border-electric-blue/30 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold font-mono text-electric-blue">
            ✨ Polish Mode
          </h3>
          <div className="text-sm font-mono text-neon-green">
            +{totalImprovement} points if applied
          </div>
        </div>
        <p className="text-sm text-gray-400 font-mono">
          AI-improved versions of your weak bullet points
        </p>
      </div>

      {/* Apply All button */}
      {suggestions.length > 0 && appliedIndices.size < suggestions.length && (
        <Button
          variant="primary"
          onClick={handleApplyAll}
          className="w-full bg-electric-blue hover:bg-electric-blue/80"
        >
          Apply All Suggestions ({suggestions.length})
        </Button>
      )}

      {/* Suggestions list */}
      <div className="space-y-4">
        {suggestions.map((item, index) => {
          const isApplied = appliedIndices.has(index);
          const isHighlighted = highlightedWords === index;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-dark-navy/50 backdrop-blur-sm border border-electric-blue/30 rounded-lg overflow-hidden"
            >
              <div className="p-4 space-y-4">
                {/* Before (Original) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-gray-500">BEFORE</span>
                    {!isApplied && (
                      <span className="text-xs font-mono text-[#FF006E]">
                        Needs improvement
                      </span>
                    )}
                  </div>
                  <div
                    className="p-3 rounded border text-sm font-mono"
                    style={{
                      backgroundColor: isApplied ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 0, 110, 0.05)',
                      borderColor: isApplied ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 0, 110, 0.3)',
                      color: isApplied ? '#666' : '#FF006E',
                      textDecoration: isApplied ? 'line-through' : 'none',
                    }}
                  >
                    {item.original}
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center">
                  <motion.div
                    animate={{
                      y: [0, 5, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="text-electric-blue text-2xl"
                  >
                    ↓
                  </motion.div>
                </div>

                {/* After (Improved) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-gray-500">AFTER</span>
                    <span className="text-xs font-mono text-neon-green">
                      +{item.improvement} points
                    </span>
                  </div>
                  <motion.div
                    className="p-3 rounded border text-sm font-mono relative overflow-hidden"
                    style={{
                      backgroundColor: 'rgba(0, 255, 148, 0.05)',
                      borderColor: isApplied ? 'rgba(0, 255, 148, 0.5)' : 'rgba(0, 255, 148, 0.2)',
                      color: '#00FF94',
                    }}
                    animate={
                      isHighlighted
                        ? {
                            boxShadow: [
                              '0 0 0px rgba(0, 255, 148, 0.5)',
                              '0 0 20px rgba(0, 255, 148, 0.8)',
                              '0 0 0px rgba(0, 255, 148, 0.5)',
                            ],
                          }
                        : {}
                    }
                    transition={{ duration: 0.4 }}
                  >
                    {item.suggestion}

                    {/* Applied checkmark */}
                    <AnimatePresence>
                      {isApplied && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute top-2 right-2 bg-neon-green text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                        >
                          ✓
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>

                {/* Apply button */}
                {!isApplied && onApplyOne && (
                  <Button
                    variant="outline"
                    onClick={() => handleApplyOne(index)}
                    className="w-full border-electric-blue text-electric-blue hover:bg-electric-blue/10"
                  >
                    Apply This One
                  </Button>
                )}

                {isApplied && (
                  <div className="text-center text-sm font-mono text-neon-green">
                    ✓ Applied
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* All applied message */}
      {appliedIndices.size === suggestions.length && suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-neon-green/10 border border-neon-green/30 rounded-lg p-4 text-center"
        >
          <div className="text-2xl mb-2">🎉</div>
          <div className="text-neon-green font-mono font-bold">
            All suggestions applied!
          </div>
          <div className="text-sm text-gray-400 font-mono mt-1">
            Your resume just got +{totalImprovement} points better
          </div>
        </motion.div>
      )}
    </div>
  );
};
