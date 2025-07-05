'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { KeyRound } from 'lucide-react';

export function SettingsForm() {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [isClient, setIsClient] = useState(false);

  // This ensures localStorage is only accessed on the client
  useEffect(() => {
    setIsClient(true);
    try {
      const storedApiKey = localStorage.getItem('google_api_key');
      if (storedApiKey) {
        setApiKey(storedApiKey);
      }
    } catch (error) {
      console.error('Could not access localStorage.');
    }
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem('google_api_key', apiKey);
      toast({
        title: 'API Key Saved',
        description: 'Your Google Gemini API key has been saved in your browser.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error Saving API Key',
        description: 'Could not save API key to local storage. Please ensure it is enabled in your browser.',
      });
    }
  };

  // Show skeleton while waiting for client-side hydration
  if (!isClient) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>API Key</CardTitle>
                <CardDescription>
                  <Skeleton className="h-4 w-3/4" />
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                      <Skeleton className="h-10 flex-grow" />
                      <Skeleton className="h-10 w-16" />
                  </div>
              </div>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <KeyRound className="h-6 w-6 text-primary" />
            </div>
            <div>
                <CardTitle>Your API Key</CardTitle>
                <CardDescription>
                Your key is stored securely in your browser&apos;s local storage.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">Google Gemini API Key</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <Button onClick={handleSave}>Save</Button>
            </div>
             <p className="text-sm text-muted-foreground">
              You can get your API key from{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google AI Studio
              </a>.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
            <p>
              <strong>Note:</strong> Your key will be used for new interactive AI features. The main article library on this site is pre-built for speed and reliability and does not require a key.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
