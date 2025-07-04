'use server';

import { z } from 'zod';
import type { ArticleTopic } from '@/lib/definitions';
import { categories } from '@/lib/definitions';

// Filter out "All" as it's not a real category for an article
const validCategories = categories.filter(c => c !== "All") as [string, ...string[]];

const TopicSchema = z.object({
  title: z.string().describe("A unique, engaging, 9-word article title about an automotive topic."),
  // The AI must choose a category from this specific list.
  category: z.enum(validCategories)
             .describe("The most relevant category for the article title from the provided list."),
});

const TopicsResponseSchema = z.object({
  topics: z.array(TopicSchema),
});

/**
 * Generates a list of unique article topics for a given subject using OpenRouter.
 * @param subject The automotive subject (e.g., "Engine", "EVs", "a diverse range of topics").
 * @param count The number of topics to generate.
 * @returns A promise that resolves to an array of topic objects.
 */
export async function generateTopicsAction(subject: string, count: number = 6): Promise<ArticleTopic[]> {
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
            content: `You are an expert automotive content strategist. Your task is to generate a list of unique and compelling article topics. The response must be a JSON object with a single key "topics", which is an array of objects. Each object in the array must have a "title" and a "category". The category MUST be one of the following: ${validCategories.map(c => `"${c}"`).join(', ')}. Do not include any other text, explanation, or markdown formatting in your response. The JSON object must look like this: {"topics": [{"title": "...", "category": "..."}]}`
          },
          {
            role: "user",
            content: `Generate ${count} unique, engaging, and highly specific article titles about "${subject}". Each title MUST be exactly 9 words long. Do not repeat topics. Focus on providing real value to a car owner. For each title, assign the most appropriate category from the allowed list.`
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
    let content = data.choices?.[0]?.message?.content;
    
    if (!content) {
        console.error("No content in API response for topic generation");
        return [];
    }
    
    // Sometimes the API wraps the JSON in markdown backticks, so we clean it.
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      content = jsonMatch[0];
    }
    
    const parsed = TopicsResponseSchema.safeParse(JSON.parse(content));

    if (!parsed.success) {
      console.error("Failed to parse topics from API response:", parsed.error);
      return [];
    }

    // Helper function to map topics and create slugs
    return parsed.data.topics.map((topic, index) => {
      const slugData = {
          title: topic.title,
          category: topic.category,
          nonce: Math.floor(Math.random() * 100000)
      };
      // Encode topic data into a URL-safe Base64 slug
      const slug = Buffer.from(JSON.stringify(slugData)).toString('base64url');
      
      return {
        id: Math.floor(Math.random() * 100000) + index,
        slug: slug,
        ...topic, // includes title and category from the AI
      };
    });

  } catch (error: any) {
    console.error(`An error occurred during topic generation for subject "${subject}":`, error.message);
    return [];
  }
}
