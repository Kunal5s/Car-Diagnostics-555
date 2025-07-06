
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, FileText } from 'lucide-react';

export function SettingsInfo() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
                <CardTitle>Pre-Generated Content</CardTitle>
                <CardDescription>
                This site uses a static library of AI-generated content.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <h3 className="font-semibold text-lg">No API Keys Required</h3>
            <p className="text-sm text-muted-foreground">
                All articles you see on this website were pre-generated and are included as part of the application. This ensures the website is always fast, reliable, and does not require any setup or API keys from you to function.
            </p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground space-y-2">
            <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                 <span className="font-mono text-sm font-semibold text-foreground">src/lib/articles.json</span>
            </div>
            <p>
              The content is loaded directly from a static JSON file within the project, making data fetching instantaneous and 100% reliable.
            </p>
        </div>
      </CardContent>
    </Card>
  );
}

