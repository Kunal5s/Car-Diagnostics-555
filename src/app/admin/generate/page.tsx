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
      if (result.errors.length > 0) {
        toast({
            variant: "default",
            title: 'Generation Complete with Some Errors',
            description: `Generated ${result.articlesGenerated}/${result.totalArticles} articles. ${result.errors.length} errors occurred. Check server logs for details.`,
            duration: 15000,
        });
      } else {
         toast({
            title: 'Success!',
            description: `All ${result.totalArticles} articles have been successfully generated and saved. Your website content is now live.`,
            duration: 10000,
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Generation Failed Critically',
        description: `A critical error occurred: ${error.message}. The process could not complete. Please check server logs.`,
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
