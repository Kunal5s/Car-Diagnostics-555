'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateArticleOutputSchema = z.object({
  content: z.string().describe(
    'The full article content in Markdown format. The content must be well-structured with a single H1 heading for the title, multiple H2 headings for main sections, and H3 headings for sub-sections. The article MUST be at least 1500 words long.'
  ),
});

const generateArticleFlow = ai.defineFlow(
  {
    name: 'generateArticleFlow',
    inputSchema: z.string(),
    outputSchema: GenerateArticleOutputSchema,
  },
  async (topic) => {
    const llmResponse = await ai.generate({
      model: 'googleai/gemini-1.5-pro-latest',
      prompt: `You are an expert automotive writer and SEO specialist. Your task is to write a detailed, comprehensive, and engaging article on the topic: "${topic}".

      The article MUST be at least 1500 words long.

      Your response MUST be in well-structured Markdown format. The structure is absolutely critical for SEO and readability.
      - The article's main title MUST be an H1 heading (e.g., '# Title of the Article'). The H1 heading should be the very first thing in the content.
      - You MUST include multiple H2 (##) headings to structure the main sections of the article.
      - Within each H2 section, you MUST use several H3 (###) headings to break down the content into sub-sections.
      - Use standard paragraph formatting for the body text. Do not skip headings or use them out of order. This structure is critical for readability and SEO.

      IMPORTANT: The final output must conform to the specified JSON schema, with the 'content' field containing the full article in the structured Markdown format described above.`,
      config: {
        output: {
          format: 'json',
          schema: GenerateArticleOutputSchema,
        },
        // Increased temperature for more creative and varied writing
        temperature: 0.7, 
      },
    });

    const output = llmResponse.output();
    if (!output || !output.content) {
      throw new Error('Failed to generate article: AI returned invalid or empty content.');
    }
    return output;
  }
);


export async function generateArticleAction(topic: string): Promise<{ content: string; error?: string }> {
  try {
    const result = await generateArticleFlow(topic);
    return { content: result.content };
  } catch (error: any) {
    console.error(`An error occurred during article generation for topic "${topic}":`, error);
    const finalError = 'Our AI is currently busy or unable to generate this article. Please try again in a few moments.';
    return { content: '', error: finalError };
  }
}
