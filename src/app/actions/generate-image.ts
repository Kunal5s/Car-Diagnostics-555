'use server';

import { ai } from '@/ai/genkit';

/**
 * Generates an image using Gemini based on a query.
 * This replaces the Pexels API to provide unique, AI-generated images.
 * @param query The search term for the image.
 * @returns The URL of a matching image or a placeholder.
 */
export async function generateImageAction(query: string): Promise<{ imageUrl: string; error?: string }> {
  try {
    // Generate a more descriptive prompt for the image model
    const imagePrompt = `Create a photorealistic, high-resolution image for a technical automotive blog article about "${query}". The image should be professional, well-lit, and suitable for a header. Avoid text and logos. Focus on a clean, modern aesthetic.`;

    const { media } = await ai.generate({
      // IMPORTANT: This specific model is for image generation.
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: imagePrompt,
      config: {
        // Image generation requires specifying both IMAGE and TEXT as response modalities.
        responseModalities: ['IMAGE', 'TEXT'],
        safetySettings: [
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_NONE',
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
          ],
      },
    });
    
    // The generated media.url is a base64 data URI.
    const imageUrl = media.url;
    if (!imageUrl) {
      throw new Error('Image generation failed: AI did not return an image.');
    }

    return { imageUrl };

  } catch (error) {
    console.error(`Failed to generate image for query: "${query}"`, error);
    // Fallback to a placeholder image if generation fails.
    return { 
        imageUrl: 'https://placehold.co/600x400.png', 
        error: 'Image generation service is currently unavailable.'
    };
  }
}
