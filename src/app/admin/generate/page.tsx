'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { populateAllArticles } from '@/ai/flows/populate-articles';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function GenerateArticlesPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsLoading(true);
    toast({
      title: 'Article Generation Started',
      description: 'This process can take up to 10 minutes. Please do not navigate away from this page.',
      duration: 10000,
    });

    try {
      const result = await populateAllArticles();
      if (result.success) {
        toast({
          title: 'Success!',
          description: `${result.articlesGenerated} articles have been successfully generated and saved. Your website content is now live.`,
          duration: 10000,
        });
      } else {
        throw new Error(result.error || 'An unknown error occurred.');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: error.message || 'An unexpected error occurred during article generation.',
        duration: 10000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Generate Website Content</CardTitle>
          <CardDescription>
            Click the button below to generate all 54 articles for the website. This is a one-time process that may take up to 10 minutes to complete due to API rate limits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-start gap-4">
            <Button onClick={handleGenerate} disabled={isLoading} size="lg">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Generating... Please Wait' : 'Generate All Articles'}
            </Button>
            {isLoading && (
              <p className="text-sm text-muted-foreground">
                Please keep this browser tab open. The generation is happening in the background and can take a while.
              </p>
            )}
            <div className="mt-4 w-full rounded-lg border bg-card p-4 text-sm text-muted-foreground">
              <p>
                <strong>Important:</strong> This action will overwrite the existing articles file with newly generated content from the AI. This should only be run once to populate your site. Running it again will replace all existing articles.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
