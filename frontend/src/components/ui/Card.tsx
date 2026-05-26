import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export const Card = ({ children, className = '', glow = false }: CardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        glass-card p-6
        ${glow ? 'glow-green' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};
