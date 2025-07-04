'use server';
import { slugify } from '@/lib/utils';
import { z } from 'zod';
import type { ArticleTopic } from '@/lib/definitions';

const TopicSchema = z.object({
  title: z.string().describe("A unique, engaging, 9-word article title about the given automotive category. It should be specific and helpful."),
});

const TopicsResponseSchema = z.object({
  topics: z.array(TopicSchema),
});

/**
 * Generates a list of unique article topics for a given category using OpenRouter.
 * @param category The automotive category (e.g., "Engine", "EVs").
 * @param count The number of topics to generate.
 * @returns A promise that resolves to an array of topic objects.
 */
export async function generateTopicsAction(category: string, count: number = 6): Promise<ArticleTopic[]> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    console.error("OpenRouter API key is not configured.");
    return [];
  }
  
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openrouter/cypher-alpha:free",
        messages: [
          {
            role: "system",
            content: `You are an expert automotive content strategist. Your task is to generate a list of unique and compelling article topics. The response must be a JSON object with a single key "topics", which is an array of objects. Each object in the array must have a single key "title". Do not include any other text, explanation, or markdown formatting in your response. The JSON object must look like this: {"topics": [{"title": "..."}]}`
          },
          {
            role: "user",
            content: `Generate ${count} unique, engaging, and highly specific article titles about "${category}". Each title MUST be exactly 9 words long. Do not repeat topics. Focus on providing real value to a car owner.`
          },
        ],
      }),
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenRouter API error:", errorText);
        throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
        console.error("No content in API response for topic generation");
        return [];
    }
    
    const parsed = TopicsResponseSchema.safeParse(JSON.parse(content));

    if (!parsed.success) {
      console.error("Failed to parse topics from API response:", parsed.error);
      return [];
    }

    return parsed.data.topics.map((topic, index) => ({
      ...topic,
      id: Math.floor(Math.random() * 100000) + index,
      slug: `${slugify(topic.title)}-${Math.floor(Math.random() * 100000)}`,
      category: category,
    }));

  } catch (error: any) {
    console.error(`An error occurred during topic generation for category "${category}":`, error.message);
    return [];
  }
}
