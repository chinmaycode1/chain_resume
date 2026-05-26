import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';

interface BulletFeedbackItem {
  original: string;
  issue: string;
  suggestion: string;
  severity: 'high' | 'medium' | 'low';
}

interface BulletFeedbackProps {
  feedback: BulletFeedbackItem[];
  onFixBullet?: (index: number) => void;
}

export const BulletFeedback = ({ feedback, onFixBullet }: BulletFeedbackProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return '#FF006E'; // hot-pink/red
      case 'medium':
        return '#FFD700'; // yellow
      case 'low':
        return '#00FF94'; // neon-green
      default:
        return '#00D4FF'; // electric-blue
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      default:
        return '⚪';
    }
  };

  const needsImprovement = feedback.filter(f => f.severity !== 'low').length;
  const total = feedback.length;

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="bg-dark-navy/50 backdrop-blur-sm border border-neon-green/30 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-mono text-gray-400">
            {needsImprovement} of {total} bullets need improvement
          </span>
          <span className="text-sm font-mono text-neon-green">
            {Math.round(((total - needsImprovement) / total) * 100)}% optimized
          </span>
        </div>
        <div className="h-2 bg-dark-navy rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-neon-green to-electric-blue"
            initial={{ width: 0 }}
            animate={{ width: `${((total - needsImprovement) / total) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Bullet list */}
      <div className="space-y-3">
        {feedback.map((item, index) => {
          const isExpanded = expandedIndex === index;
          const color = getSeverityColor(item.severity);

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-dark-navy/50 backdrop-blur-sm border rounded-lg overflow-hidden"
              style={{
                borderColor: `${color}40`,
                borderLeftWidth: '4px',
                borderLeftColor: color,
              }}
            >
              {/* Header */}
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                className="w-full p-4 text-left hover:bg-white/5 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{getSeverityIcon(item.severity)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono text-gray-300 break-words">
                      {item.original}
                    </p>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-gray-400"
                  >
                    ▼
                  </motion.div>
                </div>
              </button>

              {/* Expanded content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t"
                    style={{ borderColor: `${color}20` }}
                  >
                    <div className="p-4 space-y-3">
                      {/* Issue */}
                      <div>
                        <div className="text-xs font-mono text-gray-500 mb-1">ISSUE</div>
                        <p className="text-sm text-gray-300 font-mono">{item.issue}</p>
                      </div>

                      {/* Suggestion */}
                      <div>
                        <div className="text-xs font-mono text-gray-500 mb-1">SUGGESTION</div>
                        <p
                          className="text-sm font-mono p-3 rounded border"
                          style={{
                            color: '#00FF94',
                            backgroundColor: 'rgba(0, 255, 148, 0.05)',
                            borderColor: 'rgba(0, 255, 148, 0.2)',
                          }}
                        >
                          {item.suggestion}
                        </p>
                      </div>

                      {/* Fix button */}
                      {onFixBullet && (
                        <Button
                          variant="primary"
                          onClick={() => onFixBullet(index)}
                          className="w-full"
                        >
                          Fix with AI ✨
                        </Button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
