
'use server';
/**
 * @fileOverview An AI flow for generating a "6 Key Takeaways" section for an existing article.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateTakeawaysInputSchema = z.object({
  title: z.string().describe('The title of the article.'),
  content: z.string().describe('The full content of the article in Markdown.'),
});
export type GenerateTakeawaysInput = z.infer<typeof GenerateTakeawaysInputSchema>;

const GenerateTakeawaysOutputSchema = z.object({
  takeaways: z.string().describe('A Markdown formatted section titled "## 6 Key Takeaways" containing a bulleted list of exactly six important points from the article.'),
});
export type GenerateTakeawaysOutput = z.infer<typeof GenerateTakeawaysOutputSchema>;

const takeawaysPrompt = ai.definePrompt({
  name: 'takeawaysGeneratorPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: {schema: GenerateTakeawaysInputSchema},
  output: {schema: GenerateTakeawaysOutputSchema},
  prompt: `Based on the following article content, your task is to generate a concluding section.

Article Title: {{{title}}}
Article Content:
{{{content}}}

---

Your output MUST be a Markdown formatted section titled "## 6 Key Takeaways". This section MUST contain a bulleted list of exactly six of the most important, topic-related, actionable points from the article. This is the only thing you should output.`,
});

export const generateTakeawaysFlow = ai.defineFlow(
  {
    name: 'generateTakeawaysFlow',
    inputSchema: GenerateTakeawaysInputSchema,
    outputSchema: GenerateTakeawaysOutputSchema,
  },
  async (input) => {
    const {output} = await takeawaysPrompt(input);
    if (!output) {
      throw new Error('Failed to generate takeaways.');
    }
    return output;
  }
);

export async function generateTakeaways(
  input: GenerateTakeawaysInput
): Promise<GenerateTakeawaysOutput> {
  return generateTakeawaysFlow(input);
}
