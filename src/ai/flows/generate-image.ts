'use server';
/**
 * @fileOverview An AI flow for generating images based on a topic.
 */

import {z} from 'zod';

// Define the input and output schemas using Zod.
const GenerateImageInputSchema = z.object({
  topic: z.string().describe('The topic to generate an image for.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.object({
  base64: z.string().describe('The base64 encoded PNG image data.'),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export async function generateImage(
  input: GenerateImageInput
): Promise<GenerateImageOutput> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    console.error('The OpenRouter API key is missing.');
    throw new Error('Server configuration error: Missing OpenRouter API key.');
  }

  const prompt = `Automotive professional photograph, realistic, high-detail, cinematic lighting, of: ${input.topic}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60-second timeout for image gen

  try {
    const response = await fetch('https://openrouter.ai/api/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Using a fast, reliable model
        model: 'stabilityai/stable-diffusion-xl',
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        response_format: "b64_json",
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("OpenRouter Image API error:", response.status, errorBody);
      throw new Error(`Image generation failed with status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.data || !data.data[0] || !data.data[0].b64_json) {
        console.error("Invalid response structure from image API", data);
        throw new Error("Invalid response from image generation API.");
    }
    
    return { base64: data.data[0].b64_json };

  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error("Image generation API call timed out.");
      throw new Error("Image generation timed out.");
    }
    
    console.error("Error executing image generation API call:", error);
    throw new Error(error.message || 'An unknown error occurred during image generation.');
  } finally {
      clearTimeout(timeoutId);
  }
}
