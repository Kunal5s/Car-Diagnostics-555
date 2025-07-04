import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { MotionWrapper } from '@/components/motion-wrapper';

export const metadata: Metadata = {
  title: 'Setup - Car Diagnostics AI',
  description: 'Application setup information.',
};

export default function SettingsPage() {
  return (
    <MotionWrapper className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-primary md:text-5xl">Setup Information</h1>
      
      <Card>
        <CardHeader>
            <div className='flex items-center gap-2'>
                 <Info className="h-6 w-6" />
                <CardTitle>Automatic Configuration</CardTitle>
            </div>
          <CardDescription>
            This application is now fully self-contained and requires no external API keys.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
              All content, including articles and images, is pre-generated and served locally to ensure maximum speed and reliability. The system automatically rotates content throughout the day to keep it fresh. No setup is required.
          </p>
        </CardContent>
      </Card>
    </MotionWrapper>
  );
}
