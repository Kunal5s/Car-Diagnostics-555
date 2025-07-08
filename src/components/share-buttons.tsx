
'use client';

import { useState, useEffect, type SVGProps } from 'react';
import { Twitter, Linkedin, Mail, Link as LinkIcon, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const FacebookIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);


interface ShareButtonsProps {
  title: string;
}

export function ShareButtons({ title }: ShareButtonsProps) {
  const { toast } = useToast();
  const [currentUrl, setCurrentUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    // Ensure this runs only on the client
    setCurrentUrl(window.location.href);
  }, []);

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(title);

  const socialLinks = [
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: FacebookIcon,
    },
    {
      name: 'Twitter',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: Twitter,
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
      icon: Linkedin,
    },
    {
      name: 'Email',
      href: `mailto:?subject=${encodedTitle}&body=Check out this article: ${encodedUrl}`,
      icon: Mail,
    },
  ];

  const handleCopy = () => {
    if (!currentUrl) return;
    navigator.clipboard.writeText(currentUrl).then(() => {
      setIsCopied(true);
      toast({
        title: 'Link Copied!',
        description: 'You can now share it with others.',
      });
      setTimeout(() => setIsCopied(false), 2000); // Reset icon after 2 seconds
    });
  };

  if (!currentUrl) {
    // Don't render on the server or before hydration to avoid mismatches
    return <div className="my-8 h-9 w-full" />; // Placeholder for layout consistency
  }

  return (
    <div className="my-8 flex flex-wrap items-center gap-2">
      <p className="mr-2 text-sm font-semibold text-muted-foreground">Share this article:</p>
      {socialLinks.map((link) => (
        <Button
          key={link.name}
          asChild
          variant="outline"
          size="icon"
          aria-label={`Share on ${link.name}`}
          className="h-9 w-9"
        >
          <a href={link.href} target="_blank" rel="noopener noreferrer">
            <link.icon className="h-4 w-4" />
          </a>
        </Button>
      ))}
      <Button
        variant="outline"
        size="icon"
        aria-label="Copy link"
        className="h-9 w-9"
        onClick={handleCopy}
      >
        {isCopied ? <Check className="h-4 w-4 text-emerald-500" /> : <LinkIcon className="h-4 w-4" />}
      </Button>
    </div>
  );
}
