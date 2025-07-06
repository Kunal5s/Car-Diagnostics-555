'use server';

import { createApi } from 'unsplash-js';

const FALLBACK_IMAGE = 'https://placehold.co/600x400.png';

const unsplashClient = process.env.UNSPLASH_ACCESS_KEY
  ? createApi({
      accessKey: process.env.UNSPLASH_ACCESS_KEY,
    })
  : null;

export async function getImageForQuery(query: string): Promise<string> {
  if (!unsplashClient) {
    console.error('Unsplash API key not configured.');
    return FALLBACK_IMAGE;
  }

  try {
    const result = await unsplashClient.search.getPhotos({
      query: query,
      page: 1,
      perPage: 1,
      orientation: 'landscape',
    });

    if (result.response && result.response.results.length > 0) {
      return result.response.results[0].urls.regular;
    } else {
      console.warn(`No Unsplash image found for query: "${query}". Using fallback.`);
      return FALLBACK_IMAGE;
    }
  } catch (error) {
    console.error('Error fetching image from Unsplash:', error);
    return FALLBACK_IMAGE;
  }
}
