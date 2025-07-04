'use client';

import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MotionWrapperProps {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
  duration?: number;
}

export function MotionWrapper({
  children,
  className,
  variants,
  delay = 0,
  duration = 0.5,
}: MotionWrapperProps) {
  const defaultVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay,
        duration,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={variants || defaultVariants}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
