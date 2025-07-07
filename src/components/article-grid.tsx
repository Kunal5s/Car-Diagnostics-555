
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
  // State to hold the generated image URLs, keyed by topic ID
  const [imageUrls, setImageUrls] = useState<Record<number, string | null>>({});
  const [showImages, setShowImages] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingImageIds, setLoadingImageIds] = useState<Set<number>>(new Set());

  // Effect to reset everything when the list of topics changes (e.g., navigating to a new category)
  useEffect(() => {
    setImageUrls({});
    setShowImages(false);
    setIsGenerating(false);
    setLoadingImageIds(new Set());
  }, [topics]);

  const handleGenerateImages = async () => {
    setShowImages(true);
    setIsGenerating(true);
    
    // Set all topics to a loading state and clear old images
    setLoadingImageIds(new Set(topics.map(t => t.id)));
    setImageUrls({});

    toast({
      title: "Generating Live AI Images...",
      description: `Please wait. Requests are sent one by one to ensure quality.`,
    });

    let generatedCount = 0;
    // Process requests sequentially to avoid overwhelming the API and hitting rate limits.
    for (const topic of topics) {
      try {
        const result = await generateLiveImage({ slug: topic.slug, title: topic.title, category: topic.category });
        if (result?.imageUrl) {
          // As each image is generated, update its URL in our state
          setImageUrls(prev => ({ ...prev, [topic.id]: result.imageUrl }));
          generatedCount++;
        } else {
          toast({ variant: 'destructive', title: `Image failed for "${topic.title}"` });
        }
      } catch (error) {
        console.error(`Failed to generate image for ${topic.title}:`, error);
        toast({ variant: 'destructive', title: `Image failed for "${topic.title}"` });
      } finally {
        // Remove from loading set one by one as they finish, success or fail
        setLoadingImageIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(topic.id);
          return newSet;
        });
      }
    }

    setIsGenerating(false);
    toast({
      title: "AI Images Ready",
      description: `${generatedCount} of ${topics.length} images were generated successfully.`,
    });
  };

  // This function now handles both showing/hiding and triggering regeneration
  const handleToggleOrGenerate = () => {
    if (showImages) {
      setShowImages(false); // Just hide the images
    } else {
      handleGenerateImages(); // Always generate new images when showing
    }
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
            <h3 className="font-semibold text-lg text-primary">View with Live AI-Generated Images</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Click to generate a new, unique set of images. Click again to hide them.
            </p>
          </div>
          <Button onClick={handleToggleOrGenerate} disabled={isGenerating}>
            <ImageIcon className="mr-2 h-4 w-4" />
            {isGenerating ? 'Generating...' : (showImages ? 'Hide Images' : 'Show Images with AI')}
          </Button>
        </div>
      )}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic, index) => {
          // Create a temporary topic object with the live generated image URL for the card
          const topicWithLiveImage: ArticleTopic = {
            ...topic,
            imageUrl: imageUrls[topic.id] || null,
          };
          return (
            <ArticleCard
              key={`${topic.id}-${index}`}
              topic={topicWithLiveImage}
              showImage={showImages}
              isLoading={loadingImageIds.has(topic.id)}
              priority={index < 3}
            />
          );
        })}
      </div>
    </div>
  );
}
