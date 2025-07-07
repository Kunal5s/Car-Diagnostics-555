
'use client';

import { type ArticleTopic } from '@/lib/definitions';
import { ArticleCard } from './article-card';
import { Card, CardContent } from './ui/card';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ArticleGridProps {
  topics: ArticleTopic[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function ArticleGrid({ topics }: ArticleGridProps) {

  if (!topics || topics.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground shadow-none border-dashed">
        <CardContent className="p-6">
          <AlertCircle className="mx-auto h-10 w-10 text-primary/50 mb-4" />
          <p className="font-semibold text-lg text-foreground mb-2">
            No Articles Available
          </p>
          <p className="max-w-md mx-auto">
            There are currently no articles available for this category. Please check back later as our library is always growing.
          </p>
        </CardContent>
      </Card>
    );
  }

  // The proactive generation logic has been removed for a faster, more reliable
  // static experience as requested. Articles are now pre-generated.
  return (
      <motion.div
        className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {topics.map((topic, index) => (
          <ArticleCard key={topic.id} topic={topic} priority={index < 3} />
        ))}
      </motion.div>
  );
}
