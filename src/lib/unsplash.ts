
'use server';

interface UnsplashPhoto {
  urls: {
    regular: string;
  };
  alt_description: string;
}

interface UnsplashResponse {
  results: UnsplashPhoto[];
}

export async function getImageForQuery(query: string): Promise<string | null> {
  const apiKey = process.env.UNSPLASH_API_KEY;
  if (!apiKey) {
    console.error("Unsplash API key is not configured.");
    return null;
  }

  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${apiKey}`,
      },
      next: { revalidate: 3600 * 24 } // Cache the result for a day
    });

    if (!response.ok) {
      console.error(`Unsplash API error: ${response.status} ${response.statusText}`);
      const errorBody = await response.text();
      console.error(`Error body: ${errorBody}`);
      return null;
    }

    const data: UnsplashResponse = await response.json();

    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch image from Unsplash:", error);
    return null;
  }
}
