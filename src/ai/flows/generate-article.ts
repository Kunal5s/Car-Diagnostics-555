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
    .describe('A short, SEO-friendly summary of the article (around 160 characters).'),
  content: z
    .string()
    .describe(
      'The full, detailed, SEO-friendly article content, in Markdown format. It should be well-structured with H1, H2, H3, etc., for headings.'
    ),
});
export type GenerateArticleOutput = z.infer<typeof GenerateArticleOutputSchema>;

const prompt = ai.definePrompt({
  name: 'articleGeneratorPrompt',
  input: {schema: GenerateArticleInputSchema},
  output: {schema: GenerateArticleOutputSchema},
  prompt: `You are an expert automotive writer and SEO specialist. Write a detailed, comprehensive, and engaging article about the following topic: '{{{topic}}}'.

The article should be well-structured, unique, and at least 1700 words long.

Start with a compelling introduction. Use Markdown for formatting. The main title should be an H1 heading (#). Use H2 (##), H3 (###), and even H4-H6 for subheadings to organize the content logically and create a deep structure. Conclude with a useful summary paragraph.

IMPORTANT: The output format for the article content MUST be Markdown.

Provide a concise, SEO-friendly summary for the article (around 160 characters).
Also provide the full article content as Markdown.`,
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
      throw new Error('Failed to generate article content.');
    }
    return output;
  }
);

export async function generateArticle(
  input: GenerateArticleInput
): Promise<GenerateArticleOutput> {
  return await generateArticleFlow(input);
}
