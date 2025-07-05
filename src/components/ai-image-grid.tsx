
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface AIImageGridProps {
  title: string;
  category: string;
}

export function AIImageGrid({ title, category }: AIImageGridProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    function generatePrompt(baseTitle: string, baseCategory: string, index: number) {
      // Create a more varied prompt for each image
      const keywords = `${baseTitle.split(' ').slice(0, 4).join(' ')}, ${baseCategory}`;
      return `${keywords}, futuristic car technology, engine diagnostics, clean style, HD, AI blog visuals, variant ${index}`;
    }

    const newImageUrls: string[] = [];
    for (let i = 0; i < 6; i++) {
      const prompt = generatePrompt(title, category, i + 1);
      const encodedPrompt = encodeURIComponent(prompt);
      newImageUrls.push(`https://image.pollinations.ai/prompt/${encodedPrompt}`);
    }
    setImageUrls(newImageUrls);
  }, [title, category]);

  if (imageUrls.length === 0) {
    return (
        <section className="py-12">
            <h2 className="text-center text-2xl font-bold text-primary mb-8">🔧 AI-Generated Images Based on This Article</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-muted rounded-lg aspect-square animate-pulse" />
                ))}
            </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <h2 className="text-center text-2xl font-bold text-primary mb-8">🔧 AI-Generated Images Based on This Article</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {imageUrls.map((url, index) => (
          <div key={index} className="border border-border rounded-lg overflow-hidden shadow-md transition-transform duration-200 hover:scale-105">
            <div className="relative aspect-square bg-muted">
              <Image
                src={url}
                alt={`${title} - AI Generated Image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
