import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Car Diagnostics AI',
  description: 'Read the privacy policy for Car Diagnostics AI to understand how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-primary md:text-5xl">Privacy Policy</h1>
      <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
        <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
        
        <p>
          Car Diagnostics AI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
        </p>

        <h2 className="text-2xl font-semibold">Collection of Your Information</h2>
        <p>
          We may collect information about you in a variety of ways. The information we may collect on the Site includes personal data, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site.
        </p>

        <h2 className="text-2xl font-semibold">Use of Your Information</h2>
        <p>
          Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to create and manage your account, email you regarding your account or order, enable user-to-user communications, and manage purchases, orders, payments, and other transactions related to the Site.
        </p>
        
        <h2 className="text-2xl font-semibold">Disclosure of Your Information</h2>
        <p>
          We may share information we have collected about you in certain situations. Your information may be disclosed as follows: by law or to protect rights, if we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.
        </p>
        
        <h2 className="text-2xl font-semibold">Security of Your Information</h2>
        <p>
          We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
        </p>
        
        <h2 className="text-2xl font-semibold">Contact Us</h2>
        <p>
          If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:privacy@cardiagnosticsai.com" className="text-primary hover:underline">privacy@cardiagnosticsai.com</a>.
        </p>
      </div>
    </div>
  );
}
