
'use client';

import { useState, useEffect, useRef } from 'react';
import { type ArticleTopic } from '@/lib/definitions';
import { ArticleCard } from './article-card';
import { Card, CardContent } from './ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { triggerArticleGeneration } from '@/app/actions';

interface ArticleGridProps {
  topics: ArticleTopic[];
  proactiveGeneration?: boolean;
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

export function ArticleGrid({ topics: initialTopics, proactiveGeneration = false }: ArticleGridProps) {
  const [topics, setTopics] = useState(initialTopics);
  const [isGenerating, setIsGenerating] = useState(false);
  // Use a ref to ensure the generation logic only runs once per topic list.
  const generationTriggered = useRef(false);

  useEffect(() => {
    // When the component receives new topics (e.g., on navigation), update the state.
    setTopics(initialTopics);
    // Reset the trigger so that generation can happen on the new page if needed.
    generationTriggered.current = false;
  }, [initialTopics]);

  useEffect(() => {
    // This effect handles the proactive, sequential generation of articles.
    // It will only run if the proactiveGeneration flag is true and it hasn't run for this set of topics yet.
    if (!proactiveGeneration || generationTriggered.current) {
      return;
    }

    const pendingTopics = topics.filter(t => t.status === 'pending');
    
    // Only proceed if there are articles to generate.
    if (pendingTopics.length > 0) {
      // Set the ref to true immediately to lock this effect and prevent re-runs.
      generationTriggered.current = true;
      setIsGenerating(true);

      const generateSequentially = async () => {
        // Sequentially process each pending topic to avoid overloading the server.
        for (const topic of pendingTopics) {
          let success = false;
          let attempts = 0;
          const maxAttempts = 3;

          while (!success && attempts < maxAttempts) {
            attempts++;
            const result = await triggerArticleGeneration(topic.slug);

            if (result && result.status === 'ready') {
              // Update the state for this specific topic to turn its dot green and show the image.
              setTopics(prevTopics =>
                prevTopics.map(t =>
                  t.id === topic.id ? { ...t, status: 'ready', imageUrl: result.imageUrl } : t
                )
              );
              success = true; // Mark as successful to exit the while loop
            } else {
              // If not successful, and we haven't reached max attempts, wait and retry.
              if (attempts < maxAttempts) {
                 console.warn(`[Proactive Gen] Attempt ${attempts} failed for "${topic.title}". Retrying in 2 seconds...`);
                 await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay before retrying
              }
            }
          }

          if (!success) {
             console.error(`[Proactive Gen] Failed to generate or get a ready status for: ${topic.title} after ${maxAttempts} attempts.`);
          }
        }
        // Hide the loader once all pending topics for this batch have been processed.
        setIsGenerating(false);
      };

      generateSequentially();
    }
  }, [topics, proactiveGeneration]);

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
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-6 p-3 rounded-md bg-secondary/50 border border-dashed">
                <Loader2 className="h-5 w-5 animate-spin" />
                <p className="font-medium">Pollination Models Running… Preparing fresh articles.</p>
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
    </div>
  );
}
