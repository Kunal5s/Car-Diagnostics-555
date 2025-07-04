'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const FALLBACK_IMAGE_URL = 'https://placehold.co/600x400.png';

const generateImageFlow = ai.defineFlow(
    {
        name: 'generateImageFlow',
        inputSchema: z.string(),
        outputSchema: z.string()
    },
    async (query) => {
        const { media } = await ai.generate({
            model: 'googleai/gemini-2.0-flash-preview-image-generation',
            prompt: `A photorealistic, high-quality image for a blog article about cars. The topic is: "${query}". The image should be in landscape orientation, suitable for a hero image. Do not include any text in the image.`,
            config: {
              responseModalities: ['TEXT', 'IMAGE'],
            },
        });
        
        if (!media?.url) {
            throw new Error('AI did not return an image.');
        }

        return media.url;
    }
);


export async function generateImageAction(query: string): Promise<string> {
  if (!process.env.GOOGLE_API_KEY) {
    console.warn("Google API key is missing. Returning fallback image. See /settings for setup instructions.");
    return FALLBACK_IMAGE_URL;
  }
  
  try {
    const imageUrl = await generateImageFlow(query);
    return imageUrl;
  } catch (error) {
    console.error(`Failed to generate image from AI for query: "${query}"`, error);
    return FALLBACK_IMAGE_URL;
  }
}
