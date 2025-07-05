
'use client'; 

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-12">
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
            Please try again in a few moments. If the problem persists, please contact support.
          </p>

          <div className="flex items-center justify-center space-x-4">
              <Button onClick={() => reset()} size="lg">
              Try Again
              </Button>
              <Button asChild variant="outline" size="lg">
                  <Link href="/">Go Home</Link>
              </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
