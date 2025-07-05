'use server';
/**
 * @fileOverview An AI flow for generating SEO-friendly articles.
 *
 * - generateArticle - A function that handles the article generation process.
 * - GenerateArticleInput - The input type for the generateArticle function.
 * - GenerateArticleOutput - The return type for the generateArticle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateArticleInputSchema = z.object({
  topic: z.string().describe('The topic of the article to generate.'),
});
type GenerateArticleInput = z.infer<typeof GenerateArticleInputSchema>;

const GenerateArticleOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A short, SEO-friendly summary of the article (around 160 characters).'
    ),
  content: z
    .string()
    .min(
      7000,
      'The article content must be at least 7000 characters to be considered a valid, detailed article.'
    )
    .describe(
      'The full, detailed, SEO-friendly article content, in Markdown format. It MUST be at least 7000 characters long. It should be well-structured with Markdown headings.'
    ),
});
export type GenerateArticleOutput = z.infer<typeof GenerateArticleOutputSchema>;

const prompt = ai.definePrompt({
  name: 'articleGeneratorPrompt',
  input: {schema: GenerateArticleInputSchema},
  output: {schema: GenerateArticleOutputSchema},
  prompt: `You are an expert automotive writer and SEO specialist. Your task is to write a detailed, comprehensive, and engaging article on the topic: '{{{topic}}}'.

This is a strict requirement: The article content you generate MUST be very long and detailed, with a minimum length of 7000 characters.

Your response MUST be in well-structured Markdown format. The structure is absolutely critical for SEO and readability.
- Use a single H1 for the main title (e.g., '# Title of the Article'). This must be the first line.
- Use multiple H2 headings for main sections (e.g., '## Section Title').
- Use H3 headings for sub-sections (e.g., '### Sub-section Title').
- CRITICAL: Do NOT write the words "H1", "H2", or "H3" in the article text itself. Use only the Markdown syntax (like '#', '##', '###') to create the headings.

In addition to the article, you must provide a concise, SEO-friendly summary for the article (approximately 160 characters).

IMPORTANT: The final output must conform to the specified JSON schema. The 'content' field must contain the full article in the structured Markdown format and be AT LEAST 7000 characters long.`,
});

const generateArticleFlow = ai.defineFlow(
  {
    name: 'generateArticleFlow',
    inputSchema: GenerateArticleInputSchema,
    outputSchema: GenerateArticleOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate article content. The AI model returned no output.');
    }
    return output;
  }
);

export async function generateArticle(
  input: GenerateArticleInput
): Promise<GenerateArticleOutput> {
    try {
        return await generateArticleFlow(input);
    } catch (error) {
        console.error("Error in generateArticleFlow, the prompt likely failed schema validation:", error);
        // Re-throw the error to be caught by the caller in data.ts
        throw error;
    }
}
