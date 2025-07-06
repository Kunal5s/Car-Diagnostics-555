
'use server';

interface PexelsPhoto {
  src: {
    landscape: string;
    large2x: string;
    large: string;
    medium: string;
  };
  alt: string;
}

interface PexelsResponse {
  photos: PexelsPhoto[];
}

export async function getImageForQuery(query: string): Promise<string | null> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    console.error("Pexels API key is not configured.");
    return null;
  }

  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: apiKey,
      },
      next: { revalidate: 3600 * 24 } // Cache the result for a day
    });

    if (!response.ok) {
      console.error(`Pexels API error: ${response.status} ${response.statusText}`);
      const errorBody = await response.text();
      console.error(`Error body: ${errorBody}`);
      return null;
    }

    const data: PexelsResponse = await response.json();

    if (data.photos && data.photos.length > 0) {
      return data.photos[0].src.landscape;
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch image from Pexels:", error);
    return null;
  }
}
