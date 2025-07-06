
import type { Metadata } from 'next';
import { GenerateContentCard } from './settings-info';

export const metadata: Metadata = {
  title: 'Content Management',
  description: 'Manage content generation for the application.',
};

export default function SettingsPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-primary md:text-5xl">Content Management</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        This application uses a "generate-once" strategy. Use the tool below to generate all site content for the first time.
      </p>
      <GenerateContentCard />
    </div>
  );
}
