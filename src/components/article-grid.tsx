
'use client';

import { useState } from 'react';
import type { ArticleTopic } from '@/lib/definitions';
import { ArticleCard } from './article-card';
import { Card, CardContent } from './ui/card';
import { AlertCircle, Image as ImageIcon } from 'lucide-react';
import { generateImageForArticle } from '@/app/actions';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

interface ArticleGridProps {
  topics: ArticleTopic[];
  showImageGenerator?: boolean;
}

type DisplayTopic = ArticleTopic & {
  displayState: 'icon' | 'loading' | 'image';
};

export function ArticleGrid({ topics, showImageGenerator = false }: ArticleGridProps) {
  const { toast } = useToast();

  const [displayTopics, setDisplayTopics] = useState<DisplayTopic[]>(() =>
    topics.map(topic => ({
      ...topic,
      displayState: (topic.imageUrl && !topic.imageUrl.includes('placehold.co')) ? 'image' : 'icon',
    }))
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateImages = async () => {
    setIsGenerating(true);
    const topicsToGenerate = displayTopics.filter(t => t.displayState === 'icon');

    if (topicsToGenerate.length === 0) {
        toast({
            title: "Images Already Loaded",
            description: "All article images for the current view have already been generated.",
        });
        setIsGenerating(false);
        return;
    }

    setDisplayTopics(prevTopics =>
      prevTopics.map(t =>
        t.displayState === 'icon' ? { ...t, displayState: 'loading' } : t
      )
    );
    
    const generationPromises = topicsToGenerate.map(async (topic) => {
      try {
        const result = await generateImageForArticle(topic.slug);
        if (result?.imageUrl) {
          setDisplayTopics(prevTopics =>
            prevTopics.map(t =>
              t.slug === topic.slug
                ? { ...t, imageUrl: result.imageUrl, displayState: 'image' }
                : t
            )
          );
        } else {
          throw new Error('Image URL was null');
        }
      } catch (error) {
        console.error(`Failed to generate image for ${topic.title}:`, error);
        toast({
            variant: "destructive",
            title: "Image Generation Failed",
            description: `Could not generate an image for "${topic.title}". Please try again.`,
        });
        setDisplayTopics(prevTopics =>
          prevTopics.map(t =>
            t.slug === topic.slug ? { ...t, displayState: 'icon' } : t
          )
        );
      }
    });

    await Promise.all(generationPromises);
    setIsGenerating(false);
    toast({
        title: "Image Generation Complete",
        description: "All requested article images have been loaded.",
    });
  };
  
  if (!topics || topics.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground shadow-none border-dashed">
        <CardContent className="p-6">
          <AlertCircle className="mx-auto h-10 w-10 text-primary/50 mb-4" />
          <p className="font-semibold text-lg text-foreground mb-2">
            No Articles Available
          </p>
          <p className="max-w-md mx-auto">
            There are currently no articles available for this category. Please check back later.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div>
      {showImageGenerator && (
        <div className="mb-8 flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-6 text-center sm:flex-row">
          <div>
            <h3 className="font-semibold text-lg text-primary">View with AI-Generated Images</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Click the button to use our Pollination Models to generate a unique, high-quality image for each article below.
            </p>
          </div>
          <Button onClick={handleGenerateImages} disabled={isGenerating}>
            <ImageIcon className="mr-2 h-4 w-4" />
            {isGenerating ? 'Generating...' : 'Show Images with AI'}
          </Button>
        </div>
      )}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {displayTopics.map((topic, index) => (
          <ArticleCard key={topic.id} topic={topic} displayState={topic.displayState} priority={index < 3} />
        ))}
      </div>
    </div>
  );
}
