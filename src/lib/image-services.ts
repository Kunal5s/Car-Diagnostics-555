'use server';

import { createClient as createPexelsClient } from 'pexels';
import { createApi as createUnsplashApi } from 'unsplash-js';

const pexelsClient = process.env.PEXELS_API_KEY ? createPexelsClient(process.env.PEXELS_API_KEY) : null;

const unsplashClient = process.env.UNSPLASH_ACCESS_KEY ? createUnsplashApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
}) : null;

const FALLBACK_IMAGE = 'https://placehold.co/720x405.png';

export async function getImageFromPexels(query: string): Promise<string> {
  if (!pexelsClient) {
    console.error("Pexels API key not configured.");
    return FALLBACK_IMAGE;
  }
  try {
    const response = await pexelsClient.photos.search({ query, per_page: 1, orientation: 'landscape' });
    if ('photos' in response && response.photos.length > 0) {
      return response.photos[0].src.large; 
    }
    return FALLBACK_IMAGE;
  } catch (error) {
    console.error("Error fetching from Pexels:", error);
    return FALLBACK_IMAGE;
  }
}

export async function getImageFromUnsplash(query: string): Promise<string> {
  if (!unsplashClient) {
    console.error("Unsplash API key not configured.");
    return FALLBACK_IMAGE;
  }
  try {
    const response = await unsplashClient.search.getPhotos({ query, per_page: 1, orientation: 'landscape' });
    if (response.response && response.response.results.length > 0) {
      return response.response.results[0].urls.regular;
    }
    return FALLBACK_IMAGE;
  } catch (error) {
    console.error("Error fetching from Unsplash:", error);
    return FALLBACK_IMAGE;
  }
}
