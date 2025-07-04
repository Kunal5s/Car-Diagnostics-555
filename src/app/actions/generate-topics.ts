
'use server';

import { z } from 'zod';
import type { ArticleTopic } from '@/lib/definitions';
import { categories } from '@/lib/definitions';

// Filter out "All" as it's not a real category for an article
const validCategories = categories.filter(c => c !== "All") as [string, ...string[]];

const TopicSchema = z.object({
  title: z.string().describe("A unique, engaging, 9-word article title about an automotive topic."),
  // This is now a flexible string, which makes the parsing much more robust.
  // The AI is still instructed to provide a relevant category, but we no longer fail validation
  // if it deviates slightly from our predefined list (e.g., "Electric Cars" vs "EVs").
  category: z.string()
             .describe("The most relevant category for the article title (e.g., 'Engine', 'EVs')."),
});

const TopicsResponseSchema = z.object({
  topics: z.array(TopicSchema),
});

/**
 * Generates a list of unique article topics using a resilient, multi-model approach.
 * It will try multiple AI models in sequence if one is rate-limited or fails.
 * @param subject The automotive subject (e.g., "Engine", "EVs").
 * @param count The number of topics to generate.
 * @returns A promise that resolves to an array of topic objects.
 */
export async function generateTopicsAction(subject: string, count: number = 6): Promise<ArticleTopic[]> {
  const models = [
    { name: 'openrouter/cypher-alpha:free' },
    { name: 'meta-llama/llama-4-scout:free' },
  ];

  // Shuffle models to balance the load and not always hit the same one first.
  const shuffledModels = models.sort(() => 0.5 - Math.random());

  for (const model of shuffledModels) {
    const { name: modelName } = model;
    // Use the single, correct API key from environment variables for all models.
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      console.warn(`OPENROUTER_API_KEY is not configured. Skipping topic generation.`);
      // If no key, no point in trying other models.
      break; 
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20-second timeout
  
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          'HTTP-Referer': 'https://cardiagnostics.ai',
          'X-Title': 'Car Diagnostics AI',
        },
        body: JSON.stringify({
          model: modelName,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: `You are an expert automotive content strategist. Your task is to generate a list of unique and compelling article topics. The response must be a JSON object with a single key "topics", which is an array of objects. Each object must have a "title" (a string) and a "category" (a relevant string like "Engine" or "EVs"). The response must be only the JSON object itself, without any surrounding text or markdown. Example format: {"topics": [{"title": "...", "category": "..."}]}`
            },
            {
              role: "user",
              content: `Generate ${count} unique, engaging, and highly specific article titles about "${subject}". Each title MUST be exactly 9 words long. Do not repeat topics. Focus on providing real value to a car owner. For each title, assign the most appropriate category.`
            },
          ],
        }),
        signal: controller.signal,
        next: { revalidate: 300 }, // Cache for 5 minutes
      });
      
      clearTimeout(timeoutId);

      // If rate-limited, log it and try the next model in the loop.
      if (response.status === 429) {
          console.warn(`Model ${modelName} is rate-limited. Trying next available model.`);
          continue;
      }

      if (!response.ok) {
          const errorText = await response.text();
          console.error(`OpenRouter API error (model: ${modelName}):`, errorText);
          continue; // Try next model on other errors too.
      }

      const data = await response.json();
      let content = data.choices?.[0]?.message?.content;
      
      if (!content) {
          console.error(`No content in API response for topic generation (model: ${modelName})`);
          continue;
      }
      
      // The 'response_format: { type: "json_object" }' should ensure valid JSON,
      // but we'll keep the matcher as a fallback for models that don't fully respect it.
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        content = jsonMatch[0];
      }
      
      const parsed = TopicsResponseSchema.safeParse(JSON.parse(content));

      if (!parsed.success) {
        console.error(`Failed to parse topics from API response (model: ${modelName}):`, parsed.error);
        continue;
      }
      
      // If we get here, the request was successful. Return the topics.
      console.log(`Successfully generated topics using model: ${modelName}`);
      return parsed.data.topics.map((topic, index) => {
        const slugData = {
            title: topic.title,
            category: topic.category,
            nonce: Math.floor(Math.random() * 100000)
        };
        const slug = Buffer.from(JSON.stringify(slugData)).toString('base64url');
        
        return {
          id: Math.floor(Math.random() * 100000) + index,
          slug: slug,
          ...topic,
        };
      });

    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.error(`Topic generation with model ${modelName} timed out. Trying next model.`);
      } else {
        console.error(`An error occurred during topic generation for subject "${subject}" (model: ${modelName}):`, error.message);
      }
      // On any error (timeout, network, etc.), continue to the next model.
      continue;
    }
  }
  
  // If the loop completes without a successful return, all models have failed.
  console.error("All available AI models failed to generate topics. Returning an empty array.");
  return [];
}
