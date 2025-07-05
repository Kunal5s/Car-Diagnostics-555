'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { KeyRound, FileText, ClipboardCopy, Check } from 'lucide-react';

export function SettingsForm() {
  const [googleKey, setGoogleKey] = useState('');
  const [pexelsKey, setPexelsKey] = useState('');
  const [generatedConfig, setGeneratedConfig] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!googleKey || !pexelsKey) {
      toast({
        variant: 'destructive',
        title: 'Missing Keys',
        description: 'Please enter both API keys to generate the configuration.',
      });
      return;
    }
    const config = `GOOGLE_API_KEY="${googleKey}"
PEXELS_API_KEY="${pexelsKey}"`;
    setGeneratedConfig(config);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedConfig).then(() => {
      setIsCopied(true);
      toast({
        title: 'Copied to Clipboard!',
        description: 'You can now paste this into your .env.local file.',
      });
      setTimeout(() => setIsCopied(false), 2000);
    }, (err) => {
      toast({
        variant: 'destructive',
        title: 'Copy Failed',
        description: 'Could not copy text to clipboard.',
      });
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <KeyRound className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>Generate API Configuration</CardTitle>
            <CardDescription>
              Enter your keys below to create your environment file.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="google-key">Google Gemini API Key</Label>
            <Input
              id="google-key"
              type="password"
              placeholder="Enter your Google Gemini key"
              value={googleKey}
              onChange={(e) => setGoogleKey(e.target.value)}
              className="mt-1"
            />
            <p className="mt-1 text-sm text-muted-foreground">
              Get this from{' '}
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Google AI Studio
              </a>.
            </p>
          </div>
          <div>
            <Label htmlFor="pexels-key">Pexels API Key</Label>
            <Input
              id="pexels-key"
              type="password"
              placeholder="Enter your Pexels API key"
              value={pexelsKey}
              onChange={(e) => setPexelsKey(e.target.value)}
              className="mt-1"
            />
            <p className="mt-1 text-sm text-muted-foreground">
              Get this from the{' '}
              <a href="https://www.pexels.com/api/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Pexels API docs page
              </a>.
            </p>
          </div>
        </div>
        <Button onClick={handleGenerate} className="w-full">
          <FileText className="mr-2 h-4 w-4" />
          Generate Configuration
        </Button>

        {generatedConfig && (
          <div className="space-y-4 rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-foreground">Your Generated Configuration</h3>
            <p className="text-sm text-muted-foreground">
              Copy this content into a new file named <code className="font-mono rounded bg-muted px-1 py-0.5">.env.local</code> in your project's main folder. Then, restart your server.
            </p>
            <div className="relative">
              <Textarea
                readOnly
                value={generatedConfig}
                className="h-24 font-mono text-xs"
                aria-label="Generated API key configuration"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-2 top-2 h-7 w-7"
                onClick={handleCopy}
              >
                {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <ClipboardCopy className="h-4 w-4" />}
                <span className="sr-only">Copy to clipboard</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
