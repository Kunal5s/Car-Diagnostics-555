'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyRound, Server } from 'lucide-react';

export function SettingsForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Key Configuration</CardTitle>
        <CardDescription>
          This application requires two API keys to generate content.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start gap-4">
          <KeyRound className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-foreground">Google Gemini API Key</h3>
            <p className="text-sm text-muted-foreground">
              Used for generating all article content. You can get your key from{' '}
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
        </div>
        
        <div className="flex items-start gap-4">
          <KeyRound className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-foreground">Pexels API Key</h3>
            <p className="text-sm text-muted-foreground">
              Used for automatically fetching relevant images for each article. You can get a free key from the{' '}
              <a
                href="https://www.pexels.com/api/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Pexels API website
              </a>.
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-4 rounded-lg border bg-card p-4">
           <Server className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-1" />
            <div>
                 <h3 className="font-semibold text-foreground">How to Set Your Keys</h3>
                 <p className="text-sm text-muted-foreground">
                  To enable content generation, create a file named <code className="font-mono text-xs bg-muted p-1 rounded-sm">.env.local</code> in the root of the project and add your keys like this:
                </p>
                <pre className="mt-2 w-full overflow-x-auto rounded-md bg-muted p-3 text-xs">
                  <code>
                    GOOGLE_API_KEY=AIzaSy...your...key...<br />
                    PEXELS_API_KEY=HyqSwx...your...key...
                  </code>
                </pre>
                 <p className="mt-2 text-sm text-muted-foreground">
                    After adding your keys, you will need to restart the development server for the changes to take effect.
                </p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
