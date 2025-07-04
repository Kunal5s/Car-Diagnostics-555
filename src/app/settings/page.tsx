import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { MotionWrapper } from '@/components/motion-wrapper';

export const metadata: Metadata = {
  title: 'API Key Setup - Car Diagnostics AI',
  description: 'Instructions for setting up the required API keys for Car Diagnostics AI content generation features.',
};

export default function SettingsPage() {
  return (
    <MotionWrapper className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-primary md:text-5xl">API Key Setup</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        To enable the article and image generation features, you need to provide API keys from OpenRouter and Pexels. These keys are stored on the server and used for content generation.
      </p>
      
      <Card>
        <CardHeader>
          <CardTitle>Required API Keys</CardTitle>
          <CardDescription>
            Follow these steps to securely add your API keys to the project's environment variables.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Step 1: Locate your `.env` file</h3>
            <p className="text-sm text-muted-foreground">
              In the main root directory of your project (the same folder where you see `package.json`), you should find a file named `.env`. If it does not exist, you can create it.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Step 2: Add Your Keys</h3>
            <p className="text-sm text-muted-foreground">
              Open the `.env` file and ensure it contains the following lines, with your actual API keys.
            </p>
            <pre className="mt-2 w-full rounded-md bg-muted p-4">
              <code className="text-sm text-muted-foreground">
                OPENROUTER_API_KEY="YOUR_OPENROUTER_API_KEY_HERE"<br />
                PEXELS_API_KEY="YOUR_PEXELS_API_KEY_HERE"
              </code>
            </pre>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Step 3: Get Your Keys</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>
                Get your OpenRouter API key from{' '}
                <a
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  OpenRouter
                </a>.
              </li>
              <li>
                Get your Pexels API key from the{' '}
                <a
                  href="https://www.pexels.com/api/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Pexels API page
                </a>.
              </li>
            </ul>
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
