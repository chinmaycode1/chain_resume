import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CircularScoreProps {
  score: number;
  label: string;
  delay?: number;
  size?: number;
}

export const CircularScore = ({ score, label, delay = 0, size = 120 }: CircularScoreProps) => {
  const [displayScore, setDisplayScore] = useState(0);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  // Determine color based on score
  const getColor = (score: number) => {
    if (score >= 76) return '#00FF94'; // neon-green
    if (score >= 51) return '#FFD700'; // yellow/gold
    return '#FF006E'; // hot-pink/red
  };

  const color = getColor(score);

  // Animate score counting up
  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0;
      const increment = score / 60; // 60 frames for smooth animation
      const interval = setInterval(() => {
        current += increment;
        if (current >= score) {
          setDisplayScore(score);
          clearInterval(interval);
        } else {
          setDisplayScore(Math.floor(current));
        }
      }, 25); // ~40fps

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [score, delay]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="8"
            fill="none"
          />
          {/* Animated progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut', delay }}
            style={{
              filter: `drop-shadow(0 0 8px ${color})`,
            }}
          />
        </svg>

        {/* Score number in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.5 }}
            className="text-center"
          >
            <div
              className="text-3xl font-bold font-mono"
              style={{ color }}
            >
              {displayScore}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Label */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: delay + 0.8 }}
        className="text-sm text-gray-400 font-mono text-center"
      >
        {label}
      </motion.div>
    </div>
  );
};
