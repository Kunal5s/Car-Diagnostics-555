
'use server';
import { createClient, ErrorResponse } from 'pexels';

const PEXELS_API_KEY = process.env.PEXELS_API_KEY || '';

if (!PEXELS_API_KEY) {
  console.warn("PEXELS_API_KEY is not set. Pexels image fetching will be disabled.");
}

const client = createClient(PEXELS_API_KEY);

/**
 * Fetches an image URL from Pexels for a given query.
 */
export async function getPexelsImage(query: string): Promise<string | null> {
  if (!PEXELS_API_KEY) {
    return null;
  }

  try {
    const response = await client.photos.search({ query: `${query} car`, per_page: 1, orientation: 'landscape' });
    
    if ('photos' in response && response.photos.length > 0) {
      // Use a medium-sized image for better performance.
      const imageUrl = response.photos[0].src.large; 
      return imageUrl;
    } else {
      console.warn(`Pexels API returned no photos for query: "${query}"`);
      return null;
    }
  } catch (error) {
    const err = error as ErrorResponse;
    console.error(`Error fetching image from Pexels for query "${query}":`, err.message);
    return null;
  }
}
