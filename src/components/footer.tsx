
import Link from 'next/link';
import type { SVGProps } from 'react';
import { Car, Mail, Phone, MapPin, Heart, Twitter, Linkedin } from 'lucide-react';

const PinterestIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.117.223.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.492-.695-2.424-2.878-2.424-4.627 0-3.775 2.748-7.252 7.85-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.627-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
  </svg>
);

export function Footer() {
  const quickLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms-of-service', label: 'Terms of Service' },
    { href: '/disclaimer', label: 'Disclaimer' },
  ];

  const socialLinks = [
    { href: '#', icon: Twitter, name: 'Twitter' },
    { href: '#', icon: PinterestIcon, name: 'Pinterest' },
    { href: '#', icon: Linkedin, name: 'LinkedIn' },
  ];

  const contactInfo = [
    { icon: Mail, text: 'info@cardiagnosticsbrainai.com', href: 'mailto:info@cardiagnosticsbrainai.com' },
    { icon: Phone, text: '+1 (555) 123-4567', href: 'tel:+15551234567' },
    { icon: MapPin, text: 'San Francisco, CA' },
  ];

  return (
    <footer className="border-t bg-background text-muted-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 text-lg font-bold text-foreground">
              <Car className="h-6 w-6 text-primary" />
              <span>Car Diagnostics BrainAi</span>
            </Link>
            <p className="text-sm">
              Your ultimate destination for AI-powered car diagnostics, maintenance tips, and automotive technology insights. Stay ahead with expert-curated content and cutting-edge diagnostic solutions.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <Link key={link.name} href={link.href} className="text-muted-foreground transition-colors hover:text-primary">
                  <link.icon className="h-5 w-5" />
                  <span className="sr-only">{link.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Contact Info</h3>
            <ul className="space-y-3 text-sm">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 flex-shrink-0 text-primary" />
                  {item.href ? (
                    <a href={item.href} className="transition-colors hover:text-primary">{item.text}</a>
                  ) : (
                    <span>{item.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="container flex flex-col items-center justify-between py-6 text-sm sm:flex-row">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} Car Diagnostics BrainAi. All rights reserved.
          </p>
          <p className="mt-2 flex items-center gap-1.5 sm:mt-0">
            Made with <Heart className="h-4 w-4 text-red-500" fill="currentColor" /> for automotive enthusiasts
          </p>
        </div>
      </div>
    </footer>
  );
}
