
'use client';

import { useState } from 'react';
import type { ArticleTopic } from '@/lib/definitions';
import { ArticleCard } from './article-card';
import { Card, CardContent } from './ui/card';
import { AlertCircle, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

interface ArticleGridProps {
  topics: ArticleTopic[];
  showImageGenerator?: boolean;
}

export function ArticleGrid({ topics, showImageGenerator = false }: ArticleGridProps) {
  const { toast } = useToast();
  const [showImages, setShowImages] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleImages = () => {
    setIsLoading(true);
    // This is now just a simple state toggle.
    setShowImages(prev => !prev);
    // Simulate a brief load time for better UX, then turn off loader.
    setTimeout(() => {
        setIsLoading(false);
        if (!showImages) {
             toast({
                title: "AI Images Loaded",
                description: "Showing pre-generated, high-quality images for each article.",
            });
        }
    }, 300);
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
              Click the button to toggle between category icons and the unique, high-quality image for each article below.
            </p>
          </div>
          <Button onClick={handleToggleImages} disabled={isLoading}>
            <ImageIcon className="mr-2 h-4 w-4" />
            {isLoading ? 'Loading...' : (showImages ? 'Show Category Icons' : 'Show Images with AI')}
          </Button>
        </div>
      )}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic, index) => (
          <ArticleCard 
            key={topic.id} 
            topic={topic} 
            displayState={(showImages && topic.imageUrl && !topic.imageUrl.includes('placehold.co')) ? 'image' : 'icon'} 
            priority={index < 3} 
          />
        ))}
      </div>
    </div>
  );
}
