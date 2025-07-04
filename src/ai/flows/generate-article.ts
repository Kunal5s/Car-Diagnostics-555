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
export type GenerateArticleInput = z.infer<typeof GenerateArticleInputSchema>;

const GenerateArticleOutputSchema = z.object({
  summary: z
    .string()
    .describe('A short, SEO-friendly summary of the article (around 160 characters).'),
  content: z
    .string()
    .describe(
      'The full, detailed, SEO-friendly article content, as plain text with paragraphs separated by double newlines.'
    ),
});
export type GenerateArticleOutput = z.infer<typeof GenerateArticleOutputSchema>;

const prompt = ai.definePrompt({
  name: 'articleGeneratorPrompt',
  input: {schema: GenerateArticleInputSchema},
  output: {schema: GenerateArticleOutputSchema},
  prompt: `You are an expert automotive writer and SEO specialist. Write a detailed, comprehensive, and engaging article about the following topic: '{{{topic}}}'.

The article should be well-structured and easy to read. It should be at least 600 words long.

Start with a compelling introduction, then use headings and subheadings to organize the content logically. Conclude with a useful summary.

IMPORTANT: The output format for the article content must be plain text, with paragraphs separated by double newlines (\\n\\n). Do not use Markdown formatting like # for headings or * for lists.

Provide a concise, SEO-friendly summary for the article (around 160 characters).
Also provide the full article content as plain text.`,
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
