'use server';

import { createClient } from 'pexels';

const FALLBACK_IMAGE_URL = 'https://placehold.co/600x400.png';

async function getPexelsImage(query: string): Promise<string> {
  if (!process.env.PEXELS_API_KEY) {
    console.warn("Pexels API key is missing. Returning fallback image. See /settings for setup instructions.");
    return FALLBACK_IMAGE_URL;
  }
  
  try {
    const client = createClient(process.env.PEXELS_API_KEY);
    const response = await client.photos.search({ query, per_page: 1, orientation: 'landscape' });
    
    if ('photos' in response && response.photos.length > 0) {
      return response.photos[0].src.large;
    }
    
    console.warn(`No Pexels image found for query: "${query}". Returning fallback.`);
    return FALLBACK_IMAGE_URL;

  } catch (error) {
    console.error(`Failed to fetch image from Pexels for query: "${query}"`, error);
    return FALLBACK_IMAGE_URL;
  }
}


export async function generateImageAction(query: string): Promise<string> {
    return getPexelsImage(query);
}
