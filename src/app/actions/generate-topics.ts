'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { ArticleTopic } from '@/lib/definitions';

const TopicSchema = z.object({
  title: z.string().describe("A compelling, short article title about an automotive topic."),
  category: z.string().describe("A relevant category for the article title (e.g., 'Engine', 'EVs', 'Maintenance')."),
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
    const prompt = `You are an automotive content strategist. Generate ${count} compelling and distinct article topics about "${subject}".
For each topic, provide a short, catchy title and its most relevant category.
Your response MUST be ONLY a valid JSON object following this exact structure: { "topics": [{"title": "...", "category": "..."}, ...] }.
Do not include any other text, markdown formatting, or explanations outside of the JSON object.`;

    const { output } = await ai.generate({
      prompt,
      model: 'googleai/gemini-1.5-flash-latest',
      output: {
        schema: TopicsResponseSchema,
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


export async function generateTopicsAction(subject: string, count: number = 6): Promise<ArticleTopic[]> {
  if (!process.env.GOOGLE_API_KEY) {
    console.warn("Google API key is missing, cannot generate topics. See /settings for setup instructions.");
    return [];
  }

  try {
    const result = await generateTopicsFlow({ subject, count });

    if (!result || !result.topics || result.topics.length === 0) {
      console.error(`Failed to generate topics for subject "${subject}": AI returned invalid or empty topic list.`);
      return [];
    }

    return result.topics.map((topic) => {
        const slug = Buffer.from(topic.title).toString('base64url');
        return {
          id: slug,
          slug: slug,
          ...topic,
        };
      });

  } catch (error: any) {
    console.error(`An error occurred during topic generation for subject "${subject}":`, error);
    return [];
  }
}
