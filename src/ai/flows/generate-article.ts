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
    .describe(
      'A short, unique, and SEO-friendly summary of the article (around 160 characters).'
    ),
  content: z
    .string()
    .describe(
      'The full, detailed, unique, and SEO-friendly article content, in Markdown format. It should be well-structured with Markdown headings.'
    ),
});
export type GenerateArticleOutput = z.infer<typeof GenerateArticleOutputSchema>;

const prompt = ai.definePrompt({
  name: 'articleGeneratorPrompt',
  input: {schema: GenerateArticleInputSchema},
  output: {schema: GenerateArticleOutputSchema},
  prompt: `You are a world-class automotive writer and SEO expert. Your mission is to generate a completely unique, comprehensive, and engaging article on the provided topic.

Topic: '{{{topic}}}'

**Strict Requirements:**
1.  **Uniqueness:** The generated article must be original and pass plagiarism checks. Do not copy-paste content.
2.  **Length:** The article must be substantial and detailed, aiming for a length of at least 1500 words.
3.  **Markdown Structure:** The response MUST be in well-structured Markdown format. This is critical for SEO and readability.
    - Start with a single H1 for the main title (e.g., '# Title of the Article'). This MUST be the first line.
    - Use multiple H2 headings for main sections (e.g., '## Section Title').
    - Use H3 headings for sub-sections (e.g., '### Sub-section Title').
    - Do NOT write the words "H1", "H2", etc. in the text. Use only Markdown syntax ('#', '##').
4.  **Summary:** Provide a concise, SEO-friendly summary for the article (approximately 160 characters). It must also be unique.

**IMPORTANT:** The final output must strictly conform to the specified JSON schema. The 'content' field must contain the full article in the structured Markdown format.`,
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
    return await generateArticleFlow(input);
}
