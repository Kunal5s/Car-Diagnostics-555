import type { Metadata } from 'next';
import { SettingsForm } from './settings-form';
import { MotionWrapper } from '@/components/motion-wrapper';

export const metadata: Metadata = {
  title: 'API Key Setup',
  description: 'Configure your API keys to enable automatic content generation.',
};

export default function SettingsPage() {
  return (
    <MotionWrapper className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-primary md:text-5xl">API Key Setup</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        Use this form to generate the necessary configuration to enable all AI features for your website.
      </p>
      <SettingsForm />
    </MotionWrapper>
  );
}
