
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

export function ArticleGrid({ topics: initialTopics }: ArticleGridProps) {
  const [topics, setTopics] = useState<ArticleTopic[]>(initialTopics);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // This effect runs only on the client
    const pendingTopics = topics.filter(t => t.status === 'pending');

    if (pendingTopics.length > 0) {
      const generateSequentially = async () => {
        setIsGenerating(true);
        for (const topic of pendingTopics) {
          // Check if the topic is still pending in the current state
          // to avoid re-generating if state was updated by another process.
          const currentTopicState = topics.find(t => t.slug === topic.slug);
          if(currentTopicState && currentTopicState.status === 'pending') {
            console.log(`[Proactive Gen] Starting generation for: ${topic.title}`);
            const result = await triggerArticleGeneration(topic.slug);
            
            if (result && result.status === 'ready' && result.imageUrl) {
              console.log(`[Proactive Gen] SUCCESS for: ${topic.title}`);
              setTopics(currentTopics =>
                currentTopics.map(t =>
                  t.slug === topic.slug
                    ? { ...t, imageUrl: result.imageUrl, status: 'ready' }
                    : t
                )
              );
            } else {
              console.warn(`[Proactive Gen] Failed to generate or get a ready status for: ${topic.title}`);
            }
          }
        }
        setIsGenerating(false);
      };

      generateSequentially();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // We only want this to run once on mount based on initial topics.

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
    <>
      {isGenerating && (
        <div className="mb-8 flex items-center justify-center gap-3 rounded-lg border border-dashed bg-card p-4 text-center text-muted-foreground shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <p className="font-medium text-primary">Pollination Models Running… Generating fresh content for you.</p>
        </div>
      )}
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
    </>
  );
}
