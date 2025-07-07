
'use server';
/**
 * @fileOverview An AI flow for generating images for articles using a direct API call to OpenRouter's image generation endpoint.
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
export async function generateImage(
  input: GenerateImageInput
): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    console.error("[Image Generation] The OpenRouter API key is missing.");
    return null;
  }
  
  const controller = new AbortController();
  // Image generation can be slow, 25s timeout per image
  const timeoutId = setTimeout(() => controller.abort(), 25000); 

  try {
    // Using the correct OpenRouter endpoint for image generation
    const response = await fetch('https://openrouter.ai/api/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Using a reliable and fast image generation model
        model: 'stability-ai/sdxl', 
        prompt: input.prompt,
        n: 1, // We only need one image
        response_format: 'b64_json', // Request base64 data
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("OpenRouter Image API error:", response.status, errorBody);
        return null;
    }

    const data = await response.json();
    
    // Extract base64 image data from the response
    const base64Json = data?.data?.[0]?.b64_json;
    if (base64Json) {
        // Return the data URI, which includes the necessary prefix
        return `data:image/png;base64,${base64Json}`;
    }
    
    console.error("No valid base64 image data found in API response for prompt:", input.prompt);
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
