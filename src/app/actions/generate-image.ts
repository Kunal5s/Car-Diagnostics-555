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
    // Fetch a random page to ensure image uniqueness on revalidation
    const randomPage = Math.floor(Math.random() * 50) + 1; // 1 to 50
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&page=${randomPage}`, {
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
      console.warn(`No image found on Pexels for query: "${query}" on page ${randomPage}. Trying again with a broader query.`);
      // Fallback to a more generic query if the specific one fails
      const fallbackResponse = await fetch(`https://api.pexels.com/v1/search?query=car%20engine%20mechanic&per_page=1&page=${randomPage}`, {
          headers: { Authorization: apiKey },
          next: { revalidate: 300 },
      });
      if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          if (fallbackData.photos && fallbackData.photos.length > 0) {
              return { imageUrl: fallbackData.photos[0].src.large };
          }
      }
      return { imageUrl: 'https://placehold.co/600x400.png' };
    }
  } catch (error: any) {
    console.error("An error occurred while fetching an image from Pexels:", error);
    return { imageUrl: 'https://placehold.co/600x400.png', error: `An unexpected error occurred while fetching the image: ${error.message}` };
  }
}
