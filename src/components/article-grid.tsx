
'use client';

import { useState, useEffect } from 'react';
import type { ArticleTopic } from '@/lib/definitions';
import { ArticleCard } from './article-card';
import { Card, CardContent } from './ui/card';
import { AlertCircle, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { generateLiveImage } from '@/app/actions';

interface ArticleGridProps {
  topics: ArticleTopic[];
  showImageGenerator?: boolean;
}

export function ArticleGrid({ topics, showImageGenerator = false }: ArticleGridProps) {
  const { toast } = useToast();
  const [localTopics, setLocalTopics] = useState<ArticleTopic[]>([]);
  const [showImages, setShowImages] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingImageIds, setLoadingImageIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    // When the initial topics prop changes, update the local state.
    // Ensure imageUrl is null initially so it always starts with icons.
    setLocalTopics(topics.map(t => ({ ...t, imageUrl: null })));
    setShowImages(false);
  }, [topics]);

  const handleGenerateImages = async () => {
    setShowImages(true);
    setIsGenerating(true);
    
    // Start loading state for all topics in the grid
    const topicsToGenerate = localTopics;
    setLoadingImageIds(new Set(topicsToGenerate.map(t => t.id)));
    
    toast({
        title: "Generating Live AI Images...",
        description: `Please wait while ${topicsToGenerate.length} new image(s) are created for this session.`,
    });

    const updatePromises = topicsToGenerate.map(async (topic) => {
      try {
        const result = await generateLiveImage({ slug: topic.slug, title: topic.title, category: topic.category });
        if (result?.imageUrl) {
          // Update only the specific topic with the new URL
          setLocalTopics(prev => 
            prev.map(t => t.id === topic.id ? { ...t, imageUrl: result.imageUrl } : t)
          );
        } else {
          // Handle failure for a single image
           toast({ variant: 'destructive', title: `Image failed for ${topic.title}` });
        }
      } catch (error) {
        console.error(`Failed to generate image for ${topic.title}`, error);
        toast({ variant: 'destructive', title: `Image failed for ${topic.title}` });
      } finally {
        // Remove from loading set one by one
        setLoadingImageIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(topic.id);
          return newSet;
        });
      }
    });

    await Promise.all(updatePromises);
    setIsGenerating(false);
    toast({
      title: "AI Images Ready",
      description: "Live images have been generated for this session.",
    });
  };

  const handleToggleImages = () => {
    if (showImages) {
      // Hide images and reset URLs to null for re-generation next time
      setShowImages(false);
      setLocalTopics(prev => prev.map(t => ({...t, imageUrl: null})));
    } else {
      handleGenerateImages();
    }
  };
  
  if (!localTopics || localTopics.length === 0) {
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
            <h3 className="font-semibold text-lg text-primary">View with Live AI-Generated Images</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Click the button to generate a new, unique set of high-quality images for each article below.
            </p>
          </div>
          <Button onClick={handleToggleImages} disabled={isGenerating}>
            <ImageIcon className="mr-2 h-4 w-4" />
            {isGenerating ? 'Generating...' : (showImages ? 'Show Category Icons' : 'Show Images with AI')}
          </Button>
        </div>
      )}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {localTopics.map((topic, index) => (
          <ArticleCard 
            key={topic.id} 
            topic={topic}
            showImage={showImages}
            isLoading={loadingImageIds.has(topic.id)}
            priority={index < 3} 
          />
        ))}
      </div>
    </div>
  );
}
