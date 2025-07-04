import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, KeyRound, AlertTriangle } from 'lucide-react';
import { MotionWrapper } from '@/components/motion-wrapper';

export const metadata: Metadata = {
  title: 'Setup Instructions - Car Diagnostics AI',
  description: 'Instructions for setting up the required Pexels API key and local Ollama server for all generative features.',
};

export default function SettingsPage() {
  return (
    <MotionWrapper className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-primary md:text-5xl">Setup Instructions</h1>
      
      <Alert variant="destructive" className="mb-8">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Action Required for AI Features</AlertTitle>
        <AlertDescription>
          This application uses a local AI model (Ollama) for article generation and the Pexels API for images. Please follow the steps below to enable all features.
        </AlertDescription>
      </Alert>

      <div className="space-y-8">
        <Card>
          <CardHeader>
              <div className='flex items-center gap-2'>
                   <Terminal className="h-6 w-6" />
                  <CardTitle>Step 1: Run Local AI Model (Ollama)</CardTitle>
              </div>
            <CardDescription>
              Article generation is powered by a free, open-source model that you run on your own computer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This ensures unlimited, free article generation without needing a paid API key from a cloud provider.
            </p>
            <div className="space-y-2">
              <h3 className="font-semibold">1. Install Ollama</h3>
              <p className="text-sm text-muted-foreground">
                Download and install Ollama for your operating system from{' '}
                  <a href="https://ollama.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    ollama.com
                  </a>.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">2. Run the Mistral Model</h3>
              <p className="text-sm text-muted-foreground">
                Open your terminal or command prompt and run the following command. The first time you run it, it will download the Mistral model.
              </p>
              <pre className="mt-2 w-full rounded-md bg-muted p-4">
                <code className="text-sm text-muted-foreground">
                  ollama run mistral
                </code>
              </pre>
               <p className="text-sm text-muted-foreground">
                Leave this terminal window running. The AI model is now ready to receive requests from the application.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
              <div className='flex items-center gap-2'>
                   <KeyRound className="h-6 w-6" />
                  <CardTitle>Step 2: Add Pexels API Key</CardTitle>
              </div>
            <CardDescription>
              Article images are fetched from Pexels, which requires a free API key.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold">1. Locate your `.env` file</h3>
              <p className="text-sm text-muted-foreground">
                In the main root directory of your project, you should find a file named `.env`. If it does not exist, create it.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">2. Add Your Key</h3>
              <p className="text-sm text-muted-foreground">
                Open the `.env` file and add the following line, replacing the placeholder with your actual Pexels API key.
              </p>
              <pre className="mt-2 w-full rounded-md bg-muted p-4">
                <code className="text-sm text-muted-foreground">
                  PEXELS_API_KEY="YOUR_PEXELS_API_KEY_HERE"
                </code>
              </pre>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">3. Get Your Free Key</h3>
              <p className="text-sm text-muted-foreground">
                  You can get a free API key from the{' '}
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

             <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle>Important: Restart Required!</AlertTitle>
              <AlertDescription>
                After creating or updating your `.env` file, you must restart your application for the changes to take effect.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </MotionWrapper>
  );
}
