import type { Metadata } from 'next';
import { SettingsForm } from './settings-form';

export const metadata: Metadata = {
  title: 'Settings - Car Diagnostics AI',
  description: 'Manage your API keys and application settings for Car Diagnostics AI.',
};

export default function SettingsPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-primary md:text-5xl">Settings</h1>
      <p className="text-lg text-muted-foreground">Manage your API Keys and preferences.</p>
      <div className="mt-8">
        <SettingsForm />
      </div>
    </div>
  );
}
