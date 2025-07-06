
import type { Metadata } from 'next';
import { SettingsInfo } from './settings-info';

export const metadata: Metadata = {
  title: 'Content Strategy',
  description: 'Learn about how this application manages and displays content to ensure a reliable and engaging experience.',
};

export default function SettingsPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-primary md:text-5xl">Our Content Strategy</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        This application uses a robust and reliable content strategy to ensure a fast, engaging, and always-available experience for users.
      </p>
      <SettingsInfo />
    </div>
  );
}
