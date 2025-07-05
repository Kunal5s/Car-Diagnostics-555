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
  topic: z.string().describe('The topic of the article to generate, which should be around 9 words long.'),
});
export type GenerateArticleInput = z.infer<typeof GenerateArticleInputSchema>;

const GenerateArticleOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A short, SEO-friendly summary of the article (around 160 characters).'
    ),
  content: z
    .string()
    .describe(
      'The full, detailed, SEO-friendly article content, in Markdown format. It should be well-structured with H1, H2, H3, H4, H5, and H6 headings for a professional layout.'
    ),
});
export type GenerateArticleOutput = z.infer<typeof GenerateArticleOutputSchema>;

const prompt = ai.definePrompt({
  name: 'articleGeneratorPrompt',
  input: {schema: GenerateArticleInputSchema},
  output: {schema: GenerateArticleOutputSchema},
  prompt: `You are an AI writer tasked with generating a long-form, expert-level automotive article. Your single most important directive is to meet the minimum word count.

**PRIMARY DIRECTIVE: The article content MUST be a MINIMUM of 1600 words.** This is not a suggestion; it is a strict requirement. A response under 1600 words is considered a failure. Do not summarize. Write a full, comprehensive, and exhaustive article.

**SECONDARY DIRECTIVE: The response MUST be in well-structured Markdown and fit the provided JSON schema.**
- The article MUST begin with an H1 heading for the title. Do not just repeat the topic; create a compelling, SEO-friendly title based on the topic.
- You MUST use a deep hierarchy of H2, H3, and H4 headings to structure the content logically. This is mandatory for readability and SEO.
- Do not use filler content. The text must be valuable, informative, and detailed.
- Provide a short, SEO-friendly summary (around 160 characters) as a separate field.

Topic to write about: '{{{topic}}}'

Re-confirming your main goal: Generate a complete article of **at least 1600 words**.`,
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
