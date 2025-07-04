'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { ArticleTopic } from '@/lib/definitions';

const TopicSchema = z.object({
  title: z.string().describe("A unique, engaging, 9-word article title about an automotive topic."),
  category: z.string().describe("The most relevant category for the article title (e.g., 'Engine', 'EVs')."),
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
      prompt: `You are an expert automotive content strategist. Your task is to generate a list of unique and compelling article topics. The response must be a JSON object with a single key "topics", which is an array of objects. Each object must have a "title" (a string) and a "category" (a relevant string like "Engine" or "EVs"). The response must be only the JSON object itself, without any surrounding text or markdown.

      Generate ${count} unique, engaging, and highly specific article titles about "${subject}". Each title MUST be exactly 9 words long. Do not repeat topics. Focus on providing real value to a car owner. For each title, assign the most appropriate category.`,
      config: {
        output: {
          format: 'json',
          schema: TopicsResponseSchema,
        },
      },
    });

    const structuredResponse = llmResponse.output();
    if (!structuredResponse) {
      throw new Error('Failed to generate topics: AI returned no structured output.');
    }
    return structuredResponse;
  }
);


export async function generateTopicsAction(subject: string, count: number = 6): Promise<ArticleTopic[]> {
  try {
    const result = await generateTopicsFlow({ subject, count });
    
    // The flow returns the structured data directly.
    // We just need to add the dynamic 'id' and 'slug' for front-end use.
    return result.topics.map((topic, index) => {
      const slugData = {
          title: topic.title,
          category: topic.category,
          // Add a nonce to ensure slug is unique even for identical titles
          nonce: Math.floor(Math.random() * 100000) 
      };
      // Create a URL-safe base64 slug
      const slug = Buffer.from(JSON.stringify(slugData)).toString('base64url');
      
      return {
        // Use a random ID for the key prop in React
        id: Math.floor(Math.random() * 100000) + index, 
        slug: slug,
        ...topic,
      };
    });
  } catch (error) {
    console.error(`An error occurred during topic generation for subject "${subject}":`, error);
    // Return an empty array to prevent the page from crashing.
    return [];
  }
}
