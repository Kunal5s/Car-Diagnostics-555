'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { ArticleTopic } from '@/lib/definitions';

const TopicSchema = z.object({
  title: z.string().describe("A compelling, short article title about an automotive topic."),
  category: z.string().describe("The most relevant category for the article title (e.g., 'Engine', 'EVs', 'Maintenance')."),
});

const TopicsResponseSchema = z.object({
  topics: z.array(TopicSchema),
});

const generateTopicsFlow = ai.defineFlow(
  {
    name: 'generateTopicsFlow',
    inputSchema: z.object({
      subject: z.string(),
      count: z.number(),
    }),
    outputSchema: TopicsResponseSchema,
  },
  async ({ subject, count }) => {
    const llmResponse = await ai.generate({
      model: 'googleai/gemini-1.5-pro-latest',
      prompt: `You are an automotive content strategist. Generate ${count} compelling and distinct article topics about "${subject}".

      For each topic, provide a short, catchy title and its most relevant category (e.g., 'Engine', 'EVs', 'Maintenance').

      Your response MUST be a valid JSON object following this structure: { "topics": [{"title": "...", "category": "..."}, ...] }.
      Do not include any other text or markdown formatting outside of the JSON object.`,
      config: {
        output: {
          format: 'json',
          schema: TopicsResponseSchema,
        },
        safetySettings: [
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_NONE',
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
          ],
      },
    });

    const structuredResponse = llmResponse.output();
    if (!structuredResponse || !structuredResponse.topics || structuredResponse.topics.length === 0) {
      throw new Error('Failed to generate topics: AI returned invalid or empty topic list.');
    }
    return structuredResponse;
  }
);


export async function generateTopicsAction(subject: string, count: number = 6): Promise<ArticleTopic[]> {
  const MAX_RETRIES = 3;
  let lastError: any = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await generateTopicsFlow({ subject, count });
      
      // Success, process and return the topics
      return result.topics.map((topic) => {
        // The slug is now a simple, robust base64 encoding of the title.
        const slug = Buffer.from(topic.title).toString('base64url');
        
        return {
          id: slug, // Use the stable slug as the key
          slug: slug,
          ...topic,
        };
      });
    } catch (error: any) {
      lastError = error;
      console.error(`Topic generation attempt ${attempt} failed for subject "${subject}":`, error.message);
      if (attempt < MAX_RETRIES) {
        // Wait for 1 second before retrying
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  }

  // If all retries fail, throw the last captured error to the boundary
  console.error(`All ${MAX_RETRIES} topic generation attempts failed for subject "${subject}".`, lastError);
  throw new Error('Failed to generate dynamic content. This might be due to a missing or invalid API key or a temporary service issue.');
}
