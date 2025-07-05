'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyRound, FileCode } from 'lucide-react';

export function SettingsForm() {

  const envContent = `GOOGLE_API_KEY="YOUR_GEMINI_API_KEY"
PEXELS_API_KEY="YOUR_PEXELS_API_KEY"`;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <KeyRound className="h-6 w-6 text-primary" />
            </div>
            <div>
                <CardTitle>API Key Setup</CardTitle>
                <CardDescription>
                Follow these steps to securely configure your API keys.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <h3 className="font-semibold text-lg">Step 1: Get Your API Keys</h3>
            <p className="text-sm text-muted-foreground">
                You will need two free API keys to run this application:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>
                    <strong>Google Gemini API Key:</strong> Get this from{' '}
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google AI Studio</a>.
                </li>
                 <li>
                    <strong>Pexels API Key:</strong> Get this from the{' '}
                    <a href="https://www.pexels.com/api/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Pexels API documentation</a> page.
                </li>
            </ul>
        </div>

        <div className="space-y-2">
            <h3 className="font-semibold text-lg">Step 2: Create a Local Environment File</h3>
             <p className="text-sm text-muted-foreground">
               In the root directory of your project, create a new file named exactly:
            </p>
            <div className="flex items-center gap-2 rounded-md bg-muted p-3">
                 <FileCode className="h-5 w-5 text-muted-foreground" />
                 <span className="font-mono text-sm font-semibold text-foreground">.env.local</span>
            </div>
        </div>
        
        <div className="space-y-2">
            <h3 className="font-semibold text-lg">Step 3: Add Your Keys to the File</h3>
             <p className="text-sm text-muted-foreground">
               Copy the text below, paste it into your `.env.local` file, and replace the placeholders with your actual API keys.
            </p>
            <pre className="w-full overflow-x-auto rounded-md bg-muted p-4">
              <code className="font-mono text-sm text-foreground">
                {envContent}
              </code>
            </pre>
        </div>

        <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
            <p>
              <strong>Important:</strong> After creating and saving the `.env.local` file, you must **restart your application server** for the changes to take effect. This file is kept private and will not be visible in your version control system.
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
