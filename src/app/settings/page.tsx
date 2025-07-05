import type { Metadata } from 'next';
import { SettingsForm } from './settings-form';
import { MotionWrapper } from '@/components/motion-wrapper';

export const metadata: Metadata = {
  title: 'Setup Instructions',
  description: 'Instructions for setting up the required API keys for content generation.',
};

export default function SettingsPage() {
  return (
    <MotionWrapper className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-primary md:text-5xl">Setup Instructions</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        This application uses AI to generate articles and find images automatically. To enable this functionality, you need to provide API keys from Google and Pexels.
      </p>
      <SettingsForm />
    </MotionWrapper>
  );
}
