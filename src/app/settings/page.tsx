import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { KeyRound, Image as ImageIcon, Info } from 'lucide-react';
import { MotionWrapper } from '@/components/motion-wrapper';

export const metadata: Metadata = {
  title: 'Setup Instructions - Car Diagnostics AI',
  description: 'Instructions for setting up the required API keys for all generative features.',
};

export default function SettingsPage() {
  return (
    <MotionWrapper className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-primary md:text-5xl">Setup Instructions</h1>
      
      <Alert variant="destructive" className="mb-8">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Action Required for Full AI Features</AlertTitle>
        <AlertDescription>
          This application uses Google AI for article generation and Pexels for image fetching. Please provide API keys for both services to enable all content generation features.
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
              All AI article generation is powered by Google's Gemini models. This requires a free API key.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">1. Get Your Free API Key</h3>
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
            <div className="space-y-2">
              <h3 className="font-semibold">2. Add Your Key to the `.env` file</h3>
              <p className="text-sm text-muted-foreground">
                In the main root directory of your project, find or create a file named `.env`. Open it and add the following line, replacing `YOUR_API_KEY_HERE` with your actual key.
              </p>
              <pre className="mt-2 w-full overflow-x-auto rounded-md bg-muted p-4">
                <code className="text-sm text-muted-foreground">
                  GOOGLE_API_KEY="YOUR_API_KEY_HERE"
                </code>
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
              <div className='flex items-center gap-2'>
                   <ImageIcon className="h-6 w-6" />
                  <CardTitle>Add Your Pexels API Key</CardTitle>
              </div>
            <CardDescription>
              Article images are fetched from Pexels. This requires a free API key from Pexels.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">1. Get Your Free Pexels Key</h3>
              <p className="text-sm text-muted-foreground">
                  You can get a free API key by signing up on the{' '}
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
             <div className="space-y-2">
              <h3 className="font-semibold">2. Add Your Key to the `.env` file</h3>
              <p className="text-sm text-muted-foreground">
                Open your `.env` file again and add the following line, replacing `YOUR_PEXELS_KEY_HERE` with your actual Pexels key.
              </p>
              <pre className="mt-2 w-full overflow-x-auto rounded-md bg-muted p-4">
                <code className="text-sm text-muted-foreground">
                  PEXELS_API_KEY="YOUR_PEXELS_KEY_HERE"
                </code>
              </pre>
            </div>
          </CardContent>
        </Card>
        
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Important: Restart Required!</AlertTitle>
          <AlertDescription>
            After adding keys to your `.env` file, you must **stop and restart your development server** for the changes to take effect. The application will then perform a one-time generation of all article content. To regenerate content in the future, simply delete the `src/lib/articles.json` file and restart the server again.
          </AlertDescription>
        </Alert>
      </div>
    </MotionWrapper>
  );
}
