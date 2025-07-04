'use server';

/**
 * Fetches an image URL from Pexels based on a query using Next.js's caching.
 * @param query The search term for the image.
 * @returns The URL of the first matching image or a placeholder.
 */
export async function generateImageAction(query: string): Promise<{ imageUrl: string; error?: string }> {
  const apiKey = process.env.PEXELS_API_KEY;

  if (!apiKey) {
    console.error("Pexels API key is not configured.");
    return { imageUrl: 'https://placehold.co/600x400.png', error: "The image service is not configured correctly." };
  }

  try {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`, {
      headers: {
        Authorization: apiKey,
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
        throw new Error(`Pexels API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (data.photos && data.photos.length > 0) {
      return { imageUrl: data.photos[0].src.large };
    } else {
      console.warn(`No image found on Pexels for query: "${query}". Using placeholder.`);
      return { imageUrl: 'https://placehold.co/600x400.png' };
    }
  } catch (error: any) {
    console.error("An error occurred while fetching an image from Pexels:", error);
    return { imageUrl: 'https://placehold.co/600x400.png', error: `An unexpected error occurred while fetching the image: ${error.message}` };
  }
}
