
'use client';

import { type ArticleTopic } from "@/lib/definitions";
import { ArticleCard } from "./article-card";
import { Card, CardContent } from "./ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getGeneratedImageUrl } from '@/app/actions';

interface ArticleGridProps {
  topics: ArticleTopic[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export function ArticleGrid({ topics: initialTopics }: ArticleGridProps) {
  const [topics, setTopics] = useState(initialTopics);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const topicsToGenerate = initialTopics.filter(t => !t.imageUrl);
    if (topicsToGenerate.length === 0) return;

    setIsGenerating(true);

    const firstBatch = topicsToGenerate.slice(0, 2);
    const secondBatch = topicsToGenerate.slice(2, 4);
    let completedCount = 0;
    const totalToGenerate = topicsToGenerate.length;

    const generateAndUpdate = async (topic: ArticleTopic) => {
        const newImageUrl = await getGeneratedImageUrl(topic.slug, topic.title, topic.category);
        if (newImageUrl) {
            setTopics(prev => prev.map(p => p.id === topic.id ? { ...p, imageUrl: newImageUrl } : p));
        }
        completedCount++;
        if (completedCount >= totalToGenerate) {
            setIsGenerating(false);
        }
    };

    const timer1 = setTimeout(() => {
        firstBatch.forEach(generateAndUpdate);
    }, 10000);

    const timer2 = setTimeout(() => {
        secondBatch.forEach(generateAndUpdate);
    }, 20000);

    return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
    };
  }, [initialTopics]);


  if (!topics || topics.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground shadow-none border-dashed">
        <CardContent className="p-6">
            <AlertCircle className="mx-auto h-10 w-10 text-destructive mb-4" />
            <p className="font-semibold text-lg text-foreground mb-2">No Topics Found</p>
            <p className="max-w-md mx-auto">
              There was an issue loading the article topics for this category. Please check your configuration.
            </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
        {isGenerating && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-6 p-4 border-dashed border-2 rounded-lg">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="font-medium">Pollination Models Running…</span>
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
