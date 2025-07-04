import type { Metadata } from 'next';
import { ClientDate } from '@/components/client-date';
import { MotionWrapper } from '@/components/motion-wrapper';

export const metadata: Metadata = {
  title: 'Terms of Service - Car Diagnostics AI',
  description: 'Review the terms of service for using the Car Diagnostics AI website and its content.',
};

export default function TermsOfServicePage() {
  return (
    <MotionWrapper className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-primary md:text-5xl">Terms of Service</h1>
      <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
        <p><strong>Last Updated:</strong> <ClientDate /></p>
        
        <p>
          Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the Car Diagnostics AI website (the "Service") operated by Car Diagnostics AI ("us", "we", or "our"). Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.
        </p>

        <h2 className="text-2xl font-semibold">1. Use of Service</h2>
        <p>
          You agree to use the Service for lawful purposes only and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the Service. The content provided is for informational purposes only and should not be considered professional automotive advice.
        </p>

        <h2 className="text-2xl font-semibold">2. Intellectual Property</h2>
        <p>
          The Service and its original content, features, and functionality are and will remain the exclusive property of Car Diagnostics AI and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
        </p>

        <h2 className="text-2xl font-semibold">3. Limitation Of Liability</h2>
        <p>
          In no event shall Car Diagnostics AI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
        </p>
        
        <h2 className="text-2xl font-semibold">4. Governing Law</h2>
        <p>
          These Terms shall be governed and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.
        </p>

        <h2 className="text-2xl font-semibold">5. Changes</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
        </p>
        
        <h2 className="text-2xl font-semibold">Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at: <a href="mailto:terms@cardiagnosticsai.com" className="text-primary hover:underline">terms@cardiagnosticsai.com</a>.
        </p>
      </div>
    </MotionWrapper>
  );
}
