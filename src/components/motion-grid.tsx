'use client';

import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MotionGridProps {
    children: React.ReactNode;
    className?: string;
}

// Animate the container as a single block to improve performance
const containerVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};


export function MotionGrid({ children, className }: MotionGridProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {children}
    </motion.div>
  );
}
