
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
 * Generates a list of unique article topics using a resilient, multi-model approach.
 * It will try multiple AI models in sequence if one is rate-limited or fails.
 * @param subject The automotive subject (e.g., "Engine", "EVs").
 * @param count The number of topics to generate.
 * @returns A promise that resolves to an array of topic objects.
 */
export async function generateTopicsAction(subject: string, count: number = 6): Promise<ArticleTopic[]> {
  const models = [
    {
      name: 'openrouter/cypher-alpha:free',
      apiKey: process.env.OPENROUTER_API_KEY,
    },
    {
      name: 'meta-llama/llama-4-scout:free',
      apiKey: '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',
    },
  ];

  // Shuffle models to balance the load and not always hit the same one first.
  const shuffledModels = models.sort(() => 0.5 - Math.random());

  for (const model of shuffledModels) {
    const { name: modelName, apiKey } = model;

    if (!apiKey) {
      console.warn(`API key for model ${modelName} is not configured. Skipping.`);
      continue;
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20-second timeout
  
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: modelName,
          response_format: { type: "json_object" },
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
