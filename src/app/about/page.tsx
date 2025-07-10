import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about Car Diagnostics AI, our mission, and our team of experts dedicated to helping you understand your vehicle better.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-primary md:text-5xl">About Car Diagnostics AI</h1>
      <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
        <p>
          Welcome to Car Diagnostics AI, your intelligent partner in understanding and maintaining your vehicle. Our mission is to demystify car troubles and empower every car owner, from the novice driver to the seasoned DIY mechanic, with accurate, accessible, and easy-to-understand diagnostic information.
        </p>
        <p>
          In a world where automotive technology is constantly evolving, keeping up can be a challenge. That's where we come in. We leverage cutting-edge artificial intelligence to analyze symptoms, interpret complex diagnostic codes, and provide clear, concise guidance. Whether you're dealing with a mysterious check engine light, a strange noise, or just want to learn more about preventative maintenance, our platform is here to help.
        </p>
        <p>
          Our team is composed of seasoned automotive experts, software engineers, and AI specialists who are passionate about cars and technology. We believe that everyone deserves to feel confident and informed about their vehicle's health. By combining deep industry knowledge with powerful AI, we're building the most comprehensive and user-friendly car diagnostics resource on the web.
        </p>
        <p>
          Thank you for trusting Car Diagnostics AI. We're excited to be on this journey with you, helping you keep your car running smoothly and safely for years to come.
        </p>
      </div>
    </div>
  );
}
