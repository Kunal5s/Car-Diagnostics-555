import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, KeyRound } from 'lucide-react';
import { MotionWrapper } from '@/components/motion-wrapper';

export const metadata: Metadata = {
  title: 'API Key Setup - Car Diagnostics AI',
  description: 'Instructions for setting up the required Google AI API key for all generative features.',
};

export default function SettingsPage() {
  return (
    <MotionWrapper className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-primary md:text-5xl">API Key Setup</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        To enable the powerful AI article and image generation features across the site, you need to provide a Google AI API key.
      </p>
      
      <Card>
        <CardHeader>
            <div className='flex items-center gap-2'>
                 <KeyRound className="h-6 w-6" />
                <CardTitle>Required API Key</CardTitle>
            </div>
          <CardDescription>
            Follow these steps to securely add your Google AI API key to the project's environment variables.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Step 1: Locate your `.env` file</h3>
            <p className="text-sm text-muted-foreground">
              In the main root directory of your project (the same folder where you see `package.json`), you should find a file named `.env`. If it does not exist, please create it.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Step 2: Add Your Key</h3>
            <p className="text-sm text-muted-foreground">
              Open the `.env` file and add the following line, replacing the placeholder with your actual API key.
            </p>
            <pre className="mt-2 w-full rounded-md bg-muted p-4">
              <code className="text-sm text-muted-foreground">
                GOOGLE_API_KEY="YOUR_GOOGLE_AI_API_KEY_HERE"
              </code>
            </pre>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Step 3: Get Your Key</h3>
            <p className="text-sm text-muted-foreground">
                You can generate a free API key from{' '}
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

           <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Important: Restart Required!</AlertTitle>
            <AlertDescription>
              After creating or updating your `.env` file, you must restart your application for the changes to take effect.
            </AlertDescription>
          </Alert>

        </CardContent>
      </Card>
    </MotionWrapper>
  );
}
