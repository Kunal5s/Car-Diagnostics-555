
'use server';

import { createClient } from 'pexels';
import type { ErrorResponse, PhotosWithTotalResults } from 'pexels';

const FALLBACK_IMAGE_URL = 'https://placehold.co/600x400.png';

export async function generateImageAction(query: string): Promise<string> {
  if (!process.env.PEXELS_API_KEY) {
    console.warn("Pexels API key is missing. Returning fallback image. See /settings for setup instructions.");
    return FALLBACK_IMAGE_URL;
  }

  // Initialize the client only when we know the key exists.
  const client = createClient(process.env.PEXELS_API_KEY);

  try {
    const response = await client.photos.search({ query: `${query} automotive`, per_page: 1, orientation: 'landscape' });
    
    // Type guard to check if it's not an error response
    if ('photos' in response) {
      const photosResponse = response as PhotosWithTotalResults;
      if (photosResponse.photos.length > 0) {
        return photosResponse.photos[0].src.large;
      }
    } else {
      const errorResponse = response as ErrorResponse;
      console.error('Pexels API error:', errorResponse.error);
    }
  } catch (error) {
    console.error(`Failed to fetch image from Pexels for query: "${query}"`, error);
  }

  return FALLBACK_IMAGE_URL;
}
