
'use client';

import { useState, useEffect } from 'react';
import { type ArticleTopic } from '@/lib/definitions';
import { ArticleCard } from './article-card';
import { Card, CardContent } from './ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { triggerArticleGeneration } from '@/app/actions';

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
  const [currentTopics, setCurrentTopics] = useState<ArticleTopic[]>(topics);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    // This effect runs once on mount to proactively generate pending articles.
    const generatePendingArticles = async () => {
      const pendingTopics = topics.filter((t) => t.status === 'pending');

      if (pendingTopics.length === 0) {
        return;
      }

      setIsGenerating(true);

      // Trigger all generations in parallel
      await Promise.all(
        pendingTopics.map(async (topic) => {
          try {
            const result = await triggerArticleGeneration(topic.slug);
            if (result && result.imageUrl && result.status === 'ready') {
              // Update the state for this specific topic to turn its dot green
              setCurrentTopics((prev) =>
                prev.map((p) =>
                  p.id === topic.id
                    ? { ...p, status: 'ready', imageUrl: result.imageUrl }
                    : p
                )
              );
            }
          } catch (error) {
            console.error(
              `Client-side trigger failed for ${topic.slug}:`,
              error
            );
            // Optionally, handle the error in the UI, e.g., show a failed state
          }
        })
      );

      setIsGenerating(false);
    };

    generatePendingArticles();
    // We only want this to run once on component mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topics]); // Depend on topics prop to re-trigger if the list changes

  if (!topics || topics.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground shadow-none border-dashed">
        <CardContent className="p-6">
          <AlertCircle className="mx-auto h-10 w-10 text-destructive mb-4" />
          <p className="font-semibold text-lg text-foreground mb-2">
            No Topics Found
          </p>
          <p className="max-w-md mx-auto">
            There was an issue loading the article topics for this category.
            Please check your configuration.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-6 flex items-center justify-center gap-3 rounded-lg border bg-card p-3 text-sm font-medium text-muted-foreground"
        >
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Pollination Models Running… Generating new content.</span>
        </motion.div>
      )}
      <motion.div
        className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {currentTopics.map((topic, index) => (
          <ArticleCard key={topic.id} topic={topic} priority={index < 3} />
        ))}
      </motion.div>
    </div>
  );
}
