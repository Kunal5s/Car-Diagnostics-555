'use server';
import { createApi } from 'unsplash-js';
import type { Random } from 'unsplash-js/dist/methods/photos/types';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || '';

if (!UNSPLASH_ACCESS_KEY) {
  console.warn("UNSPLASH_ACCESS_KEY is not set. Unsplash image fetching will be disabled.");
}

// @ts-ignore
const unsplash = createApi({
  accessKey: UNSPLASH_ACCESS_KEY,
});

export async function getUnsplashImage(query: string): Promise<string | null> {
  if (!UNSPLASH_ACCESS_KEY) return null;
  
  try {
    const response = await unsplash.photos.getRandom({
      query: `${query} car automotive`,
      orientation: 'landscape',
    });

    if (response.type === 'success') {
      // The response for a single random photo is not an array
      const photo = response.response as Random;
      // Use a regular-sized image for good balance of quality and performance
      return photo.urls.regular;
    } else {
      console.error(`Unsplash API error for query "${query}":`, response.errors.join(', '));
      return null;
    }
  } catch (error) {
    console.error(`Failed to fetch image from Unsplash for query "${query}":`, error);
    return null;
  }
}
