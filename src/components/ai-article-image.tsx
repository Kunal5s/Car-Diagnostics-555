
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Skeleton } from './ui/skeleton';

interface AiArticleImageProps {
  title: string;
}

export function AiArticleImage({ title }: AiArticleImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    // This runs only on the client, after hydration, to prevent mismatches
    const prompt = encodeURIComponent(title.trim());
    const model = 'flux-realism';
    const seed = Math.floor(Math.random() * 999999);
    const width = 896; // Corresponds to max-w-4xl
    const height = 504; // Maintain a ~16:9 aspect ratio

    const url = `https://image.pollinations.ai/prompt/${prompt}?model=${model}&width=${width}&height=${height}&nologo=true&seed=${seed}`;
    setImageUrl(url);
  }, [title]);

  return (
    <div className="relative mb-8 h-64 w-full overflow-hidden rounded-lg md:h-96">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title + ' (AI generated)'}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 896px"
        />
      ) : (
        <Skeleton className="h-full w-full" />
      )}
    </div>
  );
}
