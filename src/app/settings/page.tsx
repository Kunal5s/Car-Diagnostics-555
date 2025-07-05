import type { Metadata } from 'next';
import { SettingsForm } from './settings-form';
import { MotionWrapper } from '@/components/motion-wrapper';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your API keys and application settings.',
};

export default function SettingsPage() {
  return (
    <MotionWrapper className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-primary md:text-5xl">Settings</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        Manage your API Keys and preferences for interactive AI features.
      </p>
      <SettingsForm />
    </MotionWrapper>
  );
}
