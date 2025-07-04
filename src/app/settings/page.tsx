import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Settings - Car Diagnostics AI',
  description: 'Manage your API keys and application settings for Car Diagnostics AI.',
};

export default function SettingsPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-primary md:text-5xl">API Key Setup</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        To enable the article and image generation features, you need to provide API keys from Google and Pexels.
      </p>
      
      <Card>
        <CardHeader>
          <CardTitle>Required API Keys</CardTitle>
          <CardDescription>
            Follow these steps to securely add your API keys to the project. These keys are used by the server and are essential for content generation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Step 1: Create a `.env` file</h3>
            <p className="text-sm text-muted-foreground">
              In the main root directory of your project (the same folder where you see `package.json`), create a new file named `.env`.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Step 2: Add Your Keys</h3>
            <p className="text-sm text-muted-foreground">
              Open the `.env` file and paste the following lines, replacing the placeholder text with your actual API keys.
            </p>
            <pre className="mt-2 w-full rounded-md bg-muted p-4">
              <code className="text-sm text-muted-foreground">
                GOOGLE_API_KEY="YOUR_GOOGLE_GEMINI_API_KEY_HERE"<br />
                PEXELS_API_KEY="YOUR_PEXELS_API_KEY_HERE"
              </code>
            </pre>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Step 3: Get Your Keys</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>
                Get your Google Gemini API key from{' '}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google AI Studio
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
            <AlertTitle>Restart Required!</AlertTitle>
            <AlertDescription>
              After saving your `.env` file, you must restart the application for the new keys to be loaded.
            </AlertDescription>
          </Alert>

        </CardContent>
      </Card>
    </div>
  );
}
