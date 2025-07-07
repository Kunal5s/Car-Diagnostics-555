
'use server';
/**
 * @fileOverview An AI flow for generating images for articles using a direct API call.
 *
 * - generateImage - A function that handles the image generation process.
 * - GenerateImageInput - The input type for the generateImage function.
 */

import {z} from 'zod';

// Define the input schema using Zod.
const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('The prompt for the image generation model.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

// The main exported function that will be called by the application.
// It uses a direct fetch call to the OpenRouter API for image generation.
export async function generateImage(
  input: GenerateImageInput
): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    console.error("The OpenRouter API key is missing for image generation.");
    return null;
  }
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000); // 45-second timeout for image generation

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-pro-vision', // Using a powerful vision model available on OpenRouter
        messages: [
          { 
            role: 'user', 
            content: `Generate a single, high-quality, photorealistic, cinematic image for the following automotive article topic. The image should be visually appealing and suitable for a blog post. Do not include any text in the image. Topic: "${input.prompt}"`
          }
        ],
        // The vision model on OpenRouter doesn't use the same response_format or modalities config.
        // We rely on its ability to understand the prompt and generate an image, which is then returned in a specific format by OpenRouter.
        // The actual image is often linked in the response, not returned as base64 directly in this specific setup.
        // Let's adjust to a model that explicitly generates images.
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: input.prompt,
        config: {
            responseModalities: ['TEXT', 'IMAGE'],
        }
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("OpenRouter Image API error:", response.status, errorBody);
        return null;
    }

    const data = await response.json();
    
    // Extract base64 image data from the response. The exact path might vary.
    // Based on Genkit docs, it should be in media.url
    const media = data?.choices?.[0]?.media;
    if (media && media.url && media.url.startsWith('data:image/')) {
        return media.url; // This is the base64 data URI
    }
    
    console.error("No valid image data found in API response for prompt:", input.prompt, data);
    return null;

  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error("Image generation API call timed out for prompt:", input.prompt);
    } else {
      console.error("Error executing image generation API call:", error);
    }
    return null;
  } finally {
      clearTimeout(timeoutId);
  }
}
