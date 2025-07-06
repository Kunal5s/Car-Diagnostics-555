
'use server';
import { createClient, ErrorResponse } from 'pexels';

const PEXELS_API_KEY = process.env.PEXELS_API_KEY || '';

if (!PEXELS_API_KEY) {
  console.warn("PEXELS_API_KEY is not set. Image fetching will be disabled.");
}

const client = createClient(PEXELS_API_KEY);

// In-memory cache to store Pexels search results for the lifetime of the server instance.
// This prevents re-fetching the same query multiple times.
const queryCache = new Map<string, string>();

/**
 * Fetches an image URL from Pexels for a given query.
 * Caches results in memory to avoid redundant API calls.
 */
export async function getImageForQuery(query: string): Promise<string | null> {
  if (!PEXELS_API_KEY) {
    return null;
  }

  if (queryCache.has(query)) {
    return queryCache.get(query)!;
  }
  
  console.log(`- Pexels cache miss. Fetching new image for query: "${query}"`);

  try {
    const response = await client.photos.search({ query: `${query} car`, per_page: 1 });
    
    if ('photos' in response && response.photos.length > 0) {
      // Use a medium-sized image for better performance.
      const imageUrl = response.photos[0].src.large; 
      queryCache.set(query, imageUrl);
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
