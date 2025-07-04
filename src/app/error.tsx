'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { MotionWrapper } from '@/components/motion-wrapper';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  const isApiKeyError = error?.message?.toLowerCase().includes('api key');

  return (
    <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-12">
      <MotionWrapper>
        <Card className="max-w-xl text-center shadow-lg">
          <CardHeader>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="mt-4 text-2xl font-extrabold tracking-tight text-primary md:text-3xl">
              Something went wrong
            </CardTitle>
            <CardDescription className="text-lg">
                We encountered an unexpected issue while trying to load this content.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              This can happen if the AI service is busy, or if the API key is missing or invalid.
            </p>

            {isApiKeyError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>API Key Error Detected</AlertTitle>
                <AlertDescription className="text-left">
                  The AI features require a Google AI API key to function. Please add your key on the settings page.
                  <Button asChild variant="link" className="p-0 h-auto ml-1 font-bold">
                    <Link href="/settings">Go to Settings</Link>
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground text-left">
              <p><strong>Error Details:</strong> {error.message}</p>
            </div>
            
            <Button onClick={() => reset()} size="lg">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </MotionWrapper>
    </div>
  );
}
