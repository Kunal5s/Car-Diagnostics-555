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
  category: z.string().describe('The category of the article.'),
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
  imageHint: z.string().describe('A concise two-word search query hint (e.g., "engine diagnostics", "sensor cleaning") for finding a relevant stock photo for the article.'),
});
export type GenerateArticleOutput = z.infer<typeof GenerateArticleOutputSchema>;

const prompt = ai.definePrompt({
  name: 'articleGeneratorPrompt',
  input: {schema: GenerateArticleInputSchema},
  output: {schema: GenerateArticleOutputSchema},
  prompt: `You are an expert automotive writer and SEO specialist. Your task is to write a detailed, comprehensive, and engaging article on the provided topic.

The article MUST be **at least 1600 words long**.

Your response MUST be in well-structured Markdown format. The structure is absolutely critical for SEO and readability.
- The article's main title MUST be an H1 heading (e.g., '# Title of the Article'), which should be the very first thing in the content. Do NOT repeat the topic as an H1, but create a compelling title based on it.
- You MUST include multiple H2 (##) headings to structure the main sections of the article.
- Within each H2 section, you MUST use several H3 (###) headings to break down the content into sub-sections.
- For even deeper nesting where necessary, you MUST use H4, H5, and H6 headings.
- The use of this hierarchical heading structure (H1 -> H2 -> H3 -> H4 -> H5 -> H6) is MANDATORY and must be followed strictly.
- Start the article with a compelling introduction (immediately following the H1 heading) and conclude with a useful summary paragraph.

In addition to the full article content, you must provide:
1. A concise, SEO-friendly summary for the article (approximately 160 characters).
2. A two-word "imageHint" that is a perfect, concise search term for finding a stock photo for this article. Examples: "engine diagnostics", "sensor cleaning", "EV charging", "brake maintenance".

The topic you must write about is: '{{{topic}}}'

IMPORTANT: The final output must conform to the specified JSON schema. Failure to follow the Markdown structure or word count will result in an invalid response.`,
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
