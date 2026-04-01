import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const AnimatedButton = ({ children, variant = 'primary', size = 'md', className, onClick }: AnimatedButtonProps) => {
  const baseStyles = "relative font-semibold uppercase rounded-full overflow-hidden transition-all duration-300 inline-flex items-center";
  const sizeStyles = {
    sm: "px-4 py-2",
    md: "px-6 py-3",
    lg: "px-8 py-4",
  }[size];
  const typography = size === 'sm' ? 'text-xs tracking-wide' : 'text-sm tracking-widest';
  const gapClass = size === 'sm' ? 'gap-1' : 'gap-2';
  
  const variants = {
    primary: "btn-hero",
    ghost: "btn-ghost",
    gold: "bg-gradient-gold text-charcoal-deep hover:shadow-gold hover:-translate-y-0.5",
  };
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, sizeStyles, typography, gapClass, variants[variant], className)}
      onClick={onClick}
    >
      <motion.span
        className={cn("relative z-10 flex items-center", gapClass)}
        initial={false}
      >
        {children}
      </motion.span>
    </motion.button>
  );
};

export default AnimatedButton;
