'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, KeyRound } from 'lucide-react';

export function SettingsForm() {
  const envFileContent = `GOOGLE_API_KEY="YOUR_GEMINI_API_KEY"
PEXELS_API_KEY="YOUR_PEXELS_API_KEY"`;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <KeyRound className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>API Key Configuration</CardTitle>
            <CardDescription>
              Enable automatic article and image generation.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4 rounded-lg border bg-card p-6">
          <div className="flex items-start gap-4">
            <FileText className="h-8 w-8 flex-shrink-0 text-amber-500" />
            <div>
              <h3 className="font-semibold text-foreground">Step 1: Create a Local Environment File</h3>
              <p className="text-sm text-muted-foreground">
                In the root directory of your project, create a new file named <code className="font-mono rounded bg-muted px-1 py-0.5">.env.local</code>. This file will securely store your secret API keys.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <KeyRound className="h-8 w-8 flex-shrink-0 text-green-500" />
            <div>
              <h3 className="font-semibold text-foreground">Step 2: Add Your API Keys</h3>
              <p className="text-sm text-muted-foreground">
                Copy the following content into your <code className="font-mono rounded bg-muted px-1 py-0.5">.env.local</code> file and replace the placeholder text with your actual keys.
              </p>
              <pre className="mt-2 w-full overflow-x-auto rounded-md bg-muted p-4 text-xs font-mono text-muted-foreground">
                {envFileContent}
              </pre>
               <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <p>
                    - Get your Google Gemini API key from{' '}
                    <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                    >
                        Google AI Studio
                    </a>.
                    </p>
                    <p>
                    - Get your Pexels API key from{' '}
                    <a
                        href="https://www.pexels.com/api/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                    >
                        Pexels
                    </a>.
                    </p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center text-sm text-muted-foreground">
          <p>Once you save the file, the application will automatically start generating content on the next server start.</p>
        </div>
      </CardContent>
    </Card>
  );
}
