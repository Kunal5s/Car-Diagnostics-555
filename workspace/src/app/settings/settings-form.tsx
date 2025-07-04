'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export function SettingsForm() {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [isClient, setIsClient] = useState(false);

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
        title: 'Error saving API Key',
        description: 'Could not save API key to local storage. Please ensure it is enabled in your browser.',
      });
    }
  };

  if (!isClient) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  <Skeleton className="h-4 w-3/4" />
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                  <Label htmlFor="api-key">Google Gemini API Key</Label>
                  <div className="flex items-center space-x-2">
                      <Skeleton className="h-10 flex-grow" />
                      <Skeleton className="h-10 w-16" />
                  </div>
              </div>
              <Skeleton className="h-20 w-full" />
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Keys</CardTitle>
        <CardDescription>
          Provide your API keys to enable extra generative AI features. Your key is stored only in your browser.
        </CardDescription>
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
              <strong>Note:</strong> Currently, this API key is saved in your browser for upcoming client-side AI tools. The existing article generation feature on this site uses a pre-configured server-side key.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
