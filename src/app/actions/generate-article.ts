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
    const prompt = `You are an expert automotive writer and SEO specialist. Your task is to write a detailed, comprehensive, and engaging article on the topic: "${topic}".

The article MUST be at least 1200 words long.

Your response MUST be in well-structured Markdown format. The structure is absolutely critical for SEO and readability.
- The article's main title MUST be an H1 heading (e.g., '# Title of the Article'). The H1 heading should be the very first thing in the content.
- You MUST include multiple H2 (##) headings to structure the main sections of the article.
- Within each H2 section, you MUST use several H3 (###) headings to break down the content into sub-sections.
- Use standard paragraph formatting for the body text. Do not skip headings or use them out of order. This structure is critical for readability and SEO.
- Do not include any other text or explanations. Your entire response should be only the markdown content of the article.`;
    
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
    // Return a user-friendly error message in markdown format.
    return `## Article Generation Failed\n\nWe're sorry, but there was an error generating the article for "${topic}". This might be due to a temporary issue with the AI service or a missing API key. Please ensure your Google AI API key is configured correctly on the [Setup Page](/settings) and try again.`;
  }
}
