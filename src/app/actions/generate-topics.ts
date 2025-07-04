'use server';

import { z } from 'zod';
import type { ArticleTopic } from '@/lib/definitions';

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';

const TopicSchema = z.object({
  title: z.string().describe("A compelling, short article title about an automotive topic."),
  category: z.string().describe("The most relevant category for the article title (e.g., 'Engine', 'EVs', 'Maintenance')."),
});

const TopicsResponseSchema = z.object({
  topics: z.array(TopicSchema),
});

const OllamaResponseSchema = z.object({
    model: z.string(),
    created_at: z.string(),
    response: z.string(), // This is a stringified JSON
    done: z.boolean(),
});

export async function generateTopicsAction(subject: string, count: number = 6): Promise<ArticleTopic[]> {
  const prompt = `You are an automotive content strategist. Generate ${count} compelling and distinct article topics about "${subject}".
For each topic, provide a short, catchy title and its most relevant category.
Your response MUST be ONLY a valid JSON object following this exact structure: { "topics": [{"title": "...", "category": "..."}, ...] }.
Do not include any other text, markdown formatting, or explanations outside of the JSON object.`;

  try {
    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral',
        prompt: prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Ollama API error:", errorText);
        throw new Error(`Ollama API request failed with status ${response.status}`);
    }

    const ollamaData = await response.json();
    const validatedOllamaResponse = OllamaResponseSchema.parse(ollamaData);
    
    const jsonResponseString = validatedOllamaResponse.response;
    const structuredResponse = JSON.parse(jsonResponseString);
    
    const parsedTopics = TopicsResponseSchema.parse(structuredResponse);

    if (!parsedTopics || !parsedTopics.topics || parsedTopics.topics.length === 0) {
      throw new Error('Failed to generate topics: AI returned invalid or empty topic list.');
    }
    
    return parsedTopics.topics.map((topic) => {
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
