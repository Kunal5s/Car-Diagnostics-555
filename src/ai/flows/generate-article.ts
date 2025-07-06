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

**Instructions:**
1.  **Content:** The article should be substantial, detailed, and well-researched. Ensure it is original and passes plagiarism checks.
2.  **Markdown Structure:** The response MUST be in well-structured Markdown format.
    - Start with a single H1 heading for the main title (e.g., '# Title of the Article'). This MUST be the very first line of the 'content' field.
    - Use H2 headings for main sections and H3 headings for sub-sections. This hierarchical structure is critical for readability and SEO.
3.  **Summary:** Provide a concise, unique, and SEO-friendly summary for the article (approximately 160 characters).

**Output Format:** Your final output MUST be a valid JSON object that strictly conforms to the requested schema. Pay close attention to creating a 'content' field with the full article in structured Markdown, and a 'summary' field.`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ],
  },
});

const generateArticleFlow = ai.defineFlow(
  {
    name: 'generateArticleFlow',
    inputSchema: GenerateArticleInputSchema,
    outputSchema: GenerateArticleOutputSchema,
  },
  async (input) => {
    const result = await prompt(input);
    const { output } = result;

    if (!output) {
      const candidate = result.candidates?.[0];
      const finishReason = candidate?.finishReason;
      const finishMessage = candidate?.finishMessage;
      
      let errorMessage = 'Failed to generate article content. The AI model returned no output.';

      if (finishReason) {
        errorMessage += ` Reason: ${finishReason}.`;
      }
      if (finishMessage) {
        errorMessage += ` Details: "${finishMessage}".`;
      }
      if (finishReason === 'SAFETY') {
        errorMessage += ' The content may have been blocked by safety filters. This has been relaxed, but may still occur. Please check the prompt configuration.';
      }
      
      // Throw a proper Error object so it can be logged with a stack trace.
      throw new Error(errorMessage);
    }
    
    return output;
  }
);

export async function generateArticle(
  input: GenerateArticleInput
): Promise<GenerateArticleOutput> {
    return await generateArticleFlow(input);
}
