import { createClient } from 'pexels';

const pexelsClient = createClient(process.env.PEXELS_API_KEY || '');

const placeholderImage = 'https://placehold.co/600x400.png';

export async function getImageForQuery(query: string): Promise<string> {
  if (!process.env.PEXELS_API_KEY) {
    console.warn("Pexels API key not found. Returning placeholder image.");
    return placeholderImage;
  }
  try {
    const response = await pexelsClient.photos.search({ query: `${query} automotive`, per_page: 1 });
    if ('photos' in response && response.photos.length > 0) {
      return response.photos[0].src.large;
    }
    return placeholderImage;
  } catch (error) {
    console.error("Error fetching image from Pexels:", error);
    return placeholderImage;
  }
}
