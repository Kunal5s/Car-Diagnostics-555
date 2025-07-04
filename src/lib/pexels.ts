import { createClient } from 'pexels';

const pexelsClient = process.env.PEXELS_API_KEY
  ? createClient(process.env.PEXELS_API_KEY)
  : null;

const placeholderImage = 'https://placehold.co/600x400.png';

export async function getImageForQuery(query: string): Promise<string> {
  if (!pexelsClient) {
    console.warn("Pexels API key not found or client not initialized. Returning placeholder image.");
    return placeholderImage;
  }
  try {
    // Make query more specific to get better results
    const response = await pexelsClient.photos.search({ query: `${query} automotive technology`, per_page: 1 });
    if ('photos' in response && response.photos.length > 0) {
      return response.photos[0].src.large;
    }
    return placeholderImage;
  } catch (error) {
    console.error("Error fetching image from Pexels:", error);
    return placeholderImage;
  }
}
