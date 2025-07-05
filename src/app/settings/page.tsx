import type { Metadata } from 'next';
import { SettingsForm } from './settings-form';
import { MotionWrapper } from '@/components/motion-wrapper';

export const metadata: Metadata = {
  title: 'Application Setup',
  description: 'Setup your API keys to enable automatic content generation.',
};

export default function SettingsPage() {
  return (
    <MotionWrapper className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-primary md:text-5xl">Application Setup</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        Follow the instructions below to configure the automated content generation for your website.
      </p>
      <SettingsForm />
    </MotionWrapper>
  );
}
