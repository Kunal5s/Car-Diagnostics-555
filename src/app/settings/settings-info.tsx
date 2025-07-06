'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Database, KeyRound } from 'lucide-react';

export function SettingsInfo() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
                <CardTitle>Dynamic AI Content Strategy</CardTitle>
                <CardDescription>
                Live AI generation with a smart caching system.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <h3 className="font-semibold text-lg flex items-center"><Bot className="mr-2 h-5 w-5" /> Live AI Generation</h3>
            <p className="text-sm text-muted-foreground pl-7">
                When a user visits an article page for the first time on any given day, the content is generated in real-time by a powerful large language model via the OpenRouter service. This ensures the information is always fresh and detailed.
            </p>
        </div>
        <div className="space-y-2">
            <h3 className="font-semibold text-lg flex items-center"><Database className="mr-2 h-5 w-5" /> Supabase Smart Caching</h3>
            <p className="text-sm text-muted-foreground pl-7">
              Once an article is generated, it is automatically saved (cached) in a Supabase database for 24 hours. Any other user visiting that same article on the same day will be served the content instantly from the cache, reducing API calls and improving speed.
            </p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
           <h3 className="font-semibold text-lg flex items-center text-foreground mb-2"><KeyRound className="mr-2 h-5 w-5" /> API Keys Required</h3>
            <p>
              This dynamic strategy requires two API keys to be set in a <strong>.env</strong> file: an <strong>OPENROUTER_API_KEY</strong> for content generation and a <strong>PEXELS_API_KEY</strong> for fetching images. Without these, the article generation will fail.
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
