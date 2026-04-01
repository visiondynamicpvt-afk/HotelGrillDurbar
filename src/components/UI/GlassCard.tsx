import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  delay?: number;
}

const GlassCard = ({ children, className, hover = true, glow = false, delay = 0 }: GlassCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      whileHover={hover ? { y: -8, transition: { duration: 0.3 } } : undefined}
      className={cn(
        "glass-card p-6",
        hover && "cursor-pointer transition-all duration-300",
        glow && "jade-glow",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
