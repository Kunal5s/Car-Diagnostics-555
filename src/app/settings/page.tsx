
import type { Metadata } from 'next';
import { SettingsInfo } from './settings-info';

export const metadata: Metadata = {
  title: 'How It Works',
  description: 'Information about how this application works.',
};

export default function SettingsPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-primary md:text-5xl">How It Works</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        This application comes with a pre-generated library of 54 high-quality articles about car diagnostics, written by an advanced AI.
      </p>
      <SettingsInfo />
    </div>
  );
}

