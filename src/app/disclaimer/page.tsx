import type { Metadata } from 'next';
import { ClientDate } from '@/components/client-date';
import { MotionWrapper } from '@/components/motion-wrapper';

export const metadata: Metadata = {
  title: 'Disclaimer - Car Diagnostics AI',
  description: 'Disclaimer for Car Diagnostics AI. The information provided on this website is for informational purposes only.',
};

export default function DisclaimerPage() {
  return (
    <MotionWrapper className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-primary md:text-5xl">Disclaimer</h1>
      <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
        <p><strong>Last Updated:</strong> <ClientDate /></p>
        
        <p>
          The information provided by Car Diagnostics AI ("we," "us," or "our") on this website is for general informational and educational purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
        </p>
        
        <h2 className="text-2xl font-semibold">Not Professional Advice</h2>
        <p>
          The information on this website is not intended as, and shall not be understood or construed as, professional automotive advice. The information is not a substitute for advice from a professional who is aware of the facts and circumstances of your individual situation. Always seek the advice of a qualified mechanic or automotive technician with any questions you may have regarding a vehicle's condition. Never disregard professional automotive advice or delay in seeking it because of something you have read on this website.
        </p>

        <h2 className="text-2xl font-semibold">External Links Disclaimer</h2>
        <p>
          The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.
        </p>

        <h2 className="text-2xl font-semibold">Errors and Omissions Disclaimer</h2>
        <p>
          While we have made every attempt to ensure that the information contained in this site has been obtained from reliable sources, Car Diagnostics AI is not responsible for any errors or omissions or for the results obtained from the use of this information.
        </p>
      </div>
    </MotionWrapper>
  );
}
