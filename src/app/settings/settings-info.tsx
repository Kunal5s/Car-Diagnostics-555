'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { triggerArticleGeneration } from './actions';
import { Loader2 } from 'lucide-react';

export function GenerateContentCard() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    toast({
      title: "Starting Content Generation...",
      description: "This can take several minutes. Please don't close this page.",
    });

    try {
        const result = await triggerArticleGeneration();

        if (result.success) {
          toast({
            title: "Generation Complete!",
            description: result.message,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Generation Failed",
            description: result.message,
          });
        }
    } catch (error) {
         toast({
            variant: "destructive",
            title: "An Error Occurred",
            description: "Something went wrong while trying to start generation.",
        });
    }

    setIsGenerating(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Site Content</CardTitle>
        <CardDescription>
          Click the button below to generate all articles and images for the first time. This is a one-time process that may take several minutes to complete.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-start gap-4">
            <p className="text-sm text-muted-foreground">
                Once generated, the content is saved to a local file for maximum performance. To refresh all content, you must delete the `src/data/articles.json` file and run this process again.
            </p>
            <Button onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isGenerating ? 'Generating...' : 'Generate All Content'}
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
