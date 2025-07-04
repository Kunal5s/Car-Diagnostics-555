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
  prompt: `You are an expert automotive writer and SEO specialist. Your task is to write a detailed, comprehensive, and engaging article on the following topic: '{{{topic}}}'.

You must follow this set of non-negotiable rules precisely. Failure to comply will result in an unacceptable output.

**RULE 1: ARTICLE LENGTH (MANDATORY)**
The article's total word count MUST be AT LEAST 1700 words. A shorter article is not acceptable. Aim for depth and comprehensiveness.

**RULE 2: MARKDOWN STRUCTURE (MANDATORY AND STRICT)**
The entire response body MUST be in well-structured Markdown format. This structure is critical for SEO and readability, and you MUST adhere to it.
- **H1 Heading:** The article's main title MUST be an H1 heading (e.g., '# Title of the Article'). This MUST be the very first line of the content. There can only be ONE H1 heading.
- **H2 Headings:** You MUST include at least five (5) H2 (##) headings to structure the main sections of the article.
- **H3 Headings:** Within EACH H2 section, you MUST use at least two (2) H3 (###) headings to break down the content into more specific sub-sections.
- **Deeper Headings:** You may use H4, H5, and H6 headings for deeper nesting where appropriate, but the H1, H2, and H3 structure is the minimum requirement and is not optional.
- **Content Flow:** Start the article with a compelling introduction (immediately following the H1 heading) and conclude with a useful summary paragraph.

**RULE 3: CONTENT RELEVANCE (MANDATORY)**
The entire article must be 100% focused on the provided topic: '{{{topic}}}'. Do not include any unrelated information.

**RULE 4: SEO SUMMARY (MANDATORY)**
In addition to the full article, you must provide a concise, SEO-friendly summary for the article (approximately 160 characters). This summary is for metadata purposes.

**FINAL INSTRUCTION:**
The final output must strictly conform to the specified JSON schema. The 'content' field must contain the full 1700+ word article in the structured Markdown format described above, and the 'summary' field must contain the short summary. Adhere to all rules strictly.`,
});

const generateArticleFlow = ai.defineFlow(
  {
    name: 'generateArticleFlow',
    inputSchema: GenerateArticleInputSchema,
    outputSchema: GenerateArticleOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    
    if (!output || !output.content || !output.summary) {
      throw new Error(`AI failed to generate valid content for topic: "${input.topic}". The output was empty or incomplete.`);
    }

    if (!output.content.includes('## ') || !output.content.includes('### ')) {
        throw new Error(`AI failed to follow mandatory Markdown structure for topic: "${input.topic}". Missing H2 or H3 headings.`);
    }

    if (output.content.split(' ').length < 1500) {
        throw new Error(`AI failed to meet the minimum word count for topic: "${input.topic}".`);
    }

    return output;
  }
);

export async function generateArticle(
  input: GenerateArticleInput
): Promise<GenerateArticleOutput> {
  return await generateArticleFlow(input);
}
