import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  isLoading = false,
  className = '',
  ...props 
}: ButtonProps) => {
  const baseStyles = 'px-6 py-3 rounded-lg font-mono font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-neon-green text-deep-black hover:bg-opacity-90 glow-green',
    secondary: 'bg-electric-blue text-deep-black hover:bg-opacity-90 glow-blue',
    outline: 'border-2 border-neon-green text-neon-green hover:bg-neon-green hover:text-deep-black',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading}
      {...(props as any)}
    >
      {isLoading ? (
        <span className="terminal-text">Loading</span>
      ) : (
        children
      )}
    </motion.button>
  );
};
