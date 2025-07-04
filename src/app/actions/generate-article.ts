'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ArticleResponseSchema = z.object({
    response: z.string().describe('The markdown content of the article.'),
});

const generateArticleFlow = ai.defineFlow(
  {
    name: 'generateArticleFlow',
    inputSchema: z.string(),
    outputSchema: ArticleResponseSchema,
  },
  async (topic) => {
    const prompt = `You are a world-class automotive writer and SEO expert. Your task is to write an exceptionally detailed, comprehensive, and engaging article on the topic: "${topic}".

The article MUST be at least 1600 words long.

Your response MUST be in well-structured Markdown format. The structure is absolutely critical for SEO and readability.
- The article's main title MUST be an H1 heading (e.g., '# Title of the Article'). This must be the very first line.
- You MUST include multiple H2 (##) headings for the main sections.
- Within each H2 section, you MUST use several H3 (###) headings to break down the content into sub-sections.
- For even deeper nesting and detail, you MUST use H4 (####), H5 (#####), and H6 (######) headings where appropriate.
- This hierarchical heading structure (H1 -> H2 -> H3 -> H4 -> H5 -> H6) is MANDATORY. Do not skip heading levels.
- Use standard paragraph formatting for the body text.
- Do not include any other text, introductory phrases, or explanations outside of the Markdown content itself. Your entire response must be only the article.`;
    
    const { output } = await ai.generate({
        prompt: prompt,
        model: 'googleai/gemini-1.5-flash-latest',
        output: {
            schema: ArticleResponseSchema
        },
        config: {
            safetySettings: [
                { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
            ]
        }
    });
    
    if (!output) {
      throw new Error('AI failed to generate a response.');
    }
    
    return output;
  }
);

export async function generateArticleAction(topic: string): Promise<string> {
  try {
    const result = await generateArticleFlow(topic);

    if (!result || !result.response) {
      throw new Error('Failed to generate article: AI returned empty content.');
    }

    return result.response;

  } catch (error: any) {
    console.error(`An error occurred during article generation for topic "${topic}":`, error);
    return `## Article Generation Failed\n\nWe're sorry, but there was an error generating the article for "${topic}". This might be due to a temporary issue with the AI service or a missing API key. Please check your setup and try again.`;
  }
}
