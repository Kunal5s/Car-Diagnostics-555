'use server';

/**
 * Fetches an image URL from Pexels based on a query using Next.js's caching.
 * This version is optimized to avoid rate-limiting by caching API responses
 * and selecting a random image from a batch.
 * @param query The search term for the image.
 * @returns The URL of a matching image or a placeholder.
 */
export async function generateImageAction(query: string): Promise<{ imageUrl:string; error?: string }> {
  const apiKey = process.env.PEXELS_API_KEY;

  if (!apiKey) {
    console.error("Pexels API key is not configured.");
    return { imageUrl: 'https://placehold.co/600x400.png', error: "Image service not configured." };
  }

  // Helper function to perform the fetch and handle responses.
  // By making the fetch URL deterministic (no random page number), we allow Next.js to cache it.
  const fetchAndSelectImage = async (searchQuery: string): Promise<string | null> => {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&per_page=15`;
    
    try {
      const response = await fetch(url, {
        headers: { Authorization: apiKey },
        next: { revalidate: 300 }, // Cache the result for 5 minutes
      });

      if (!response.ok) {
        if (response.status === 429) {
          console.warn(`Pexels API rate limit hit for query: "${searchQuery}".`);
        } else {
          console.error(`Pexels API request failed with status ${response.status} for query: "${searchQuery}"`);
        }
        return null; // Indicate failure to the caller
      }

      const data = await response.json();

      if (data.photos && data.photos.length > 0) {
        // Randomly pick one from the fetched photos to ensure variety on the front-end
        const randomIndex = Math.floor(Math.random() * data.photos.length);
        return data.photos[randomIndex].src.large;
      }
      
      return null; // No photos found
    } catch (error) {
      console.error(`Error fetching from Pexels API with url: ${url}`, error);
      return null; // Indicate failure
    }
  };

  let imageUrl = await fetchAndSelectImage(query);

  if (imageUrl) {
    return { imageUrl };
  }
  
  // If the first attempt fails (e.g., no results or rate limited), try a more generic fallback.
  console.warn(`No image found for query: "${query}". Trying fallback.`);
  imageUrl = await fetchAndSelectImage("car engine mechanic");

  if (imageUrl) {
    return { imageUrl };
  }

  // If all else fails, return a placeholder.
  return { imageUrl: 'https://placehold.co/600x400.png' };
}
