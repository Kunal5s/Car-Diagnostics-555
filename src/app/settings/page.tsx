import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { KeyRound, AlertTriangle } from 'lucide-react';
import { MotionWrapper } from '@/components/motion-wrapper';

export const metadata: Metadata = {
  title: 'Setup Instructions - Car Diagnostics AI',
  description: 'Instructions for setting up the required Google AI API key for all generative features.',
};

export default function SettingsPage() {
  return (
    <MotionWrapper className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-primary md:text-5xl">Setup Instructions</h1>
      
      <Alert variant="destructive" className="mb-8">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Action Required for All AI Features</AlertTitle>
        <AlertDescription>
          This application uses the Google AI platform (Gemini) for real-time article and image generation. Please follow the step below to enable all features.
        </AlertDescription>
      </Alert>

      <div className="space-y-8">
        <Card>
          <CardHeader>
              <div className='flex items-center gap-2'>
                   <KeyRound className="h-6 w-6" />
                  <CardTitle>Add Your Google AI API Key</CardTitle>
              </div>
            <CardDescription>
              All AI features, including text and image generation, are powered by Google's Gemini models. This requires a free API key.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold">1. Locate your `.env` file</h3>
              <p className="text-sm text-muted-foreground">
                In the main root directory of your project, you should find a file named `.env`. If it does not exist, please create it.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">2. Add Your Key</h3>
              <p className="text-sm text-muted-foreground">
                Open the `.env` file and add the following line, replacing `YOUR_API_KEY_HERE` with your actual Google AI API key.
              </p>
              <pre className="mt-2 w-full rounded-md bg-muted p-4">
                <code className="text-sm text-muted-foreground">
                  GOOGLE_API_KEY="YOUR_API_KEY_HERE"
                </code>
              </pre>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">3. Get Your Free API Key</h3>
              <p className="text-sm text-muted-foreground">
                  You can get a free API key from{' '}
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Google AI Studio
                  </a>. The free tier is generous and suitable for development.
              </p>
            </div>

             <Alert>
              <KeyRound className="h-4 w-4" />
              <AlertTitle>Important: Restart Required!</AlertTitle>
              <AlertDescription>
                After creating or updating your `.env` file, you must stop and restart your development server for the changes to take effect.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </MotionWrapper>
  );
}
