'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { populateAllArticles } from '@/ai/flows/populate-articles';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
          description: `${result.articlesGenerated} articles have been successfully generated and saved. Your website content is now live. Please refresh the homepage.`,
          duration: 10000,
        });
      } else {
        // This case might not be hit if errors are thrown, but kept for safety.
        throw new Error(result.error || 'An unknown error occurred.');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: `An error occurred: ${error.message}. Please check your API keys and server logs.`,
        duration: 15000,
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
            Click the button below to generate all 54 articles for the website. This is a one-time process that may take up to 10 minutes to complete.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-start gap-4">

            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Important: API Keys Required</AlertTitle>
              <AlertDescription>
                This feature requires both a `GOOGLE_API_KEY` and a `PEXELS_API_KEY` to be set in a `.env` file at the root of the project. Please ensure they are correctly configured before running the generator.
              </AlertDescription>
            </Alert>
            
            <Button onClick={handleGenerate} disabled={isLoading} size="lg">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Generating... Please Wait' : 'Generate All Articles'}
            </Button>
            
            {isLoading && (
              <p className="text-sm text-muted-foreground">
                Please keep this browser tab open. The generation is happening in the background and can take a while.
              </p>
            )}

          </div>
        </CardContent>
      </Card>
    </div>
  );
}
