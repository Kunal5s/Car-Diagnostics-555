'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, FileJson, KeyRound } from 'lucide-react';

export function SettingsInfo() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileJson className="h-6 w-6 text-primary" />
            </div>
            <div>
                <CardTitle>Static Content Strategy</CardTitle>
                <CardDescription>
                Generate-once, read-many from a local file.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <h3 className="font-semibold text-lg flex items-center"><Bot className="mr-2 h-5 w-5" /> First-Time Generation</h3>
            <p className="text-sm text-muted-foreground pl-7">
                The very first time the application runs, it uses AI to generate a complete library of articles and fetches images from Pexels. This initial process can take several minutes.
            </p>
        </div>
        <div className="space-y-2">
            <h3 className="font-semibold text-lg flex items-center"><FileJson className="mr-2 h-5 w-5" /> Local JSON Cache</h3>
            <p className="text-sm text-muted-foreground pl-7">
              All generated content is saved to a local `articles.json` file inside a new `src/data` directory. After the first run, the site reads directly from this file, making it extremely fast and reliable. To regenerate content, you can delete this file and restart the server.
            </p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
           <h3 className="font-semibold text-lg flex items-center text-foreground mb-2"><KeyRound className="mr-2 h-5 w-5" /> API Keys Required</h3>
            <p>
              The initial content generation requires two API keys to be set in a <strong>.env</strong> file: an <strong>OPENROUTER_API_KEY</strong> for content generation and a <strong>PEXELS_API_KEY</strong> for fetching images.
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
