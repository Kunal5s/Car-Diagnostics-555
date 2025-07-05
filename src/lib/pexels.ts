'use server';
import {z} from 'zod';

const PexelsImageSchema = z.object({
  id: z.number(),
  src: z.object({
    large: z.string().url(),
    original: z.string().url(),
  }),
  photographer: z.string(),
});

const PexelsResponseSchema = z.object({
  photos: z.array(PexelsImageSchema),
  total_results: z.number(),
});

/**
 * @fileOverview A service for fetching images from Pexels API.
 * - getImageForQuery - Fetches an image for a given query string.
 */

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

/**
 * Fetches a single, relevant image from Pexels for a given query.
 * @param query The search query for the image.
 * @returns The URL of the large version of the image, or null if not found.
 */
export async function getImageForQuery(query: string): Promise<string | null> {
  if (!PEXELS_API_KEY) {
    console.warn(
      'Pexels API key is not configured. Skipping image fetch. Set the PEXELS_API_KEY environment variable.'
    );
    return null;
  }

  const searchUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
    query
  )}&per_page=1&orientation=landscape`;

  try {
    const response = await fetch(searchUrl, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    });

    if (!response.ok) {
      console.error(
        `Pexels API request failed with status: ${response.status}. Response: ${await response.text()}`
      );
      return null;
    }

    const data = await response.json();
    const parsedData = PexelsResponseSchema.safeParse(data);

    if (!parsedData.success || parsedData.data.photos.length === 0) {
      console.warn(`No image found on Pexels for query: "${query}"`);
      return null;
    }

    return parsedData.data.photos[0].src.large;
  } catch (error) {
    console.error(`An error occurred while fetching image from Pexels:`, error);
    return null;
  }
}
