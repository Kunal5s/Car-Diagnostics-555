'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, FileText, RefreshCw, KeyRound } from 'lucide-react';

export function SettingsInfo() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
                <CardTitle>A Dynamic & Reliable Approach</CardTitle>
                <CardDescription>
                Combining a rich content library with a dynamic homepage.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <h3 className="font-semibold text-lg flex items-center"><FileText className="mr-2 h-5 w-5" /> Static Content Library</h3>
            <p className="text-sm text-muted-foreground pl-7">
                To ensure 100% reliability and lightning-fast speed, this website uses a pre-generated library of 54 high-quality, comprehensive articles. This content is stored in a local `articles.json` file, eliminating any reliance on external APIs that can cause errors or slowdowns.
            </p>
        </div>
        <div className="space-y-2">
            <h3 className="font-semibold text-lg flex items-center"><RefreshCw className="mr-2 h-5 w-5" /> Daily Homepage Refresh</h3>
            <p className="text-sm text-muted-foreground pl-7">
              To keep the experience fresh for returning users, the homepage automatically shuffles the article library every 24 hours to feature a new set of 6 "trending" articles. This provides the feeling of a dynamic, constantly updated site without the risks of live content generation.
            </p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
           <h3 className="font-semibold text-lg flex items-center text-foreground mb-2"><KeyRound className="mr-2 h-5 w-5" /> No API Keys Needed</h3>
            <p>
              This content strategy means you do not need to provide an API key for the site to work. The website is fully functional and will feature different articles on the homepage each day, all without the risk of API failures.
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
