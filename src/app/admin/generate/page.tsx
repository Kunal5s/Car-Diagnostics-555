'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { triggerGeneration } from './actions';
import Link from 'next/link';

export default function GenerateContentPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{success: boolean; message: string;} | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await triggerGeneration();
      setResult(response);
      if (response.success) {
        toast({
          title: 'Process Started',
          description: response.message,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Process In Progress or Failed',
          description: response.message,
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'An Unexpected Error Occurred',
        description: error.message || 'Please check the server console for more details.',
      });
      setResult({success: false, message: error.message || 'An unexpected error occurred.'});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <Card className="border-2 border-dashed shadow-none">
        <CardHeader>
          <CardTitle>Content Generation Control Panel</CardTitle>
          <CardDescription>
            Click the button below to generate all 54 articles for your website. This is a long-running process and may take up to 10 minutes. It is designed to run once to populate your site. After the process starts, you can safely close this page. The generated articles will then be permanently available on your site.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4">
          <Button onClick={handleGenerate} disabled={isLoading} size="lg">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Starting...
              </>
            ) : (
              'Generate All Articles'
            )}
          </Button>

          {result && (
             <div className="mt-6 w-full rounded-lg border bg-card p-4">
                <div className="flex items-start space-x-3">
                  {result.success ? (
                     <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                     <AlertTriangle className="h-6 w-6 text-destructive" />
                  )}
                  <div>
                    <p className="font-semibold">{result.success ? "Process Started" : "Error"}</p>
                    <p className="text-sm text-muted-foreground">{result.message}</p>
                    {result.success && (
                      <Button asChild variant="link" className="p-0 mt-2">
                        <Link href="/">Go to Home Page to see the results</Link>
                      </Button>
                    )}
                  </div>
                </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
