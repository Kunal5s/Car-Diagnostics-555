import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: "Get in touch with Car Diagnostics BrainAi. We're here to answer your questions and receive your feedback.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-primary md:text-5xl">Contact Us</h1>
      <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
        <p>
          We'd love to hear from you! Whether you have a question about our services, feedback on our platform, or a partnership inquiry, please don't hesitate to reach out.
        </p>
        
        <div>
          <h2 className="text-2xl font-semibold">General Inquiries</h2>
          <p>
            For all general questions and feedback, please email us at:
            <br />
            <a href="mailto:contact@cardiagnosticsbrainai.com" className="text-primary hover:underline">contact@cardiagnosticsbrainai.com</a>
          </p>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold">Our Office</h2>
          <p>
            Car Diagnostics BrainAi Headquarters
            <br />
            123 Auto Lane
            <br />
            Mechanicsville, CA 90210
            <br />
            United States
          </p>
          <p>
            Please note that our office is not open to the public for walk-in inquiries.
          </p>
        </div>

      </div>
    </div>
  );
}
