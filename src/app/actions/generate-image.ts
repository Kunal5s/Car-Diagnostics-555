'use server';

import { createClient } from 'pexels';

const pexelsClient = process.env.PEXELS_API_KEY ? createClient(process.env.PEXELS_API_KEY) : null;

/**
 * Fetches an image URL from Pexels based on a query.
 * @param query The search term for the image.
 * @returns The URL of the first matching image or a placeholder.
 */
export async function generateImageAction(query: string): Promise<{ imageUrl: string; error?: string }> {
  if (!pexelsClient) {
    console.error("Pexels API key is not configured.");
    return { imageUrl: 'https://placehold.co/600x400.png', error: "The image service is not configured correctly." };
  }

  try {
    const response = await pexelsClient.photos.search({ query, per_page: 1 });
    
    if ('photos' in response && response.photos.length > 0) {
      return { imageUrl: response.photos[0].src.large };
    } else {
      console.warn(`No image found on Pexels for query: "${query}". Using placeholder.`);
      return { imageUrl: 'https://placehold.co/600x400.png' };
    }
  } catch (error) {
    console.error("An error occurred while fetching an image from Pexels:", error);
    return { imageUrl: 'https://placehold.co/600x400.png', error: "An unexpected error occurred while fetching the image." };
  }
}
