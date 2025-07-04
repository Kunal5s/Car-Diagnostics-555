import Link from 'next/link';

export function Footer() {
  const footerLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms-of-service', label: 'Terms of Service' },
    { href: '/disclaimer', label: 'Disclaimer' },
  ];

  return (
    <footer className="border-t bg-background">
      <div className="container py-8 text-center text-sm text-muted-foreground">
        <div className="mb-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-primary">
              {link.label}
            </Link>
          ))}
        </div>
        <p>
          © {new Date().getFullYear()} Car Diagnostics AI. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
