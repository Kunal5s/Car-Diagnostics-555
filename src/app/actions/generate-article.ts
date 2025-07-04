'use server';

import { z } from 'zod';

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';

const OllamaResponseSchema = z.object({
    model: z.string(),
    created_at: z.string(),
    response: z.string(), // This is the markdown string
    done: z.boolean(),
});

export async function generateArticleAction(topic: string): Promise<string> {
  const prompt = `You are an expert automotive writer and SEO specialist. Your task is to write a detailed, comprehensive, and engaging article on the topic: "${topic}".

The article MUST be at least 1200 words long.

Your response MUST be in well-structured Markdown format. The structure is absolutely critical for SEO and readability.
- The article's main title MUST be an H1 heading (e.g., '# Title of the Article'). The H1 heading should be the very first thing in the content.
- You MUST include multiple H2 (##) headings to structure the main sections of the article.
- Within each H2 section, you MUST use several H3 (###) headings to break down the content into sub-sections.
- Use standard paragraph formatting for the body text. Do not skip headings or use them out of order. This structure is critical for readability and SEO.
- Do not include any other text or explanations. Your entire response should be only the markdown content of the article.`;

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

    if (!validatedOllamaResponse.response) {
      throw new Error('Failed to generate article: AI returned empty content.');
    }

    return validatedOllamaResponse.response;

  } catch (error: any) {
    console.error(`An error occurred during article generation for topic "${topic}":`, error);
    return `## Article Generation Failed\n\nWe're sorry, but there was an error generating the article for "${topic}". Please ensure your local Ollama server is running and try again. For setup instructions, please visit the [Setup Page](/settings).`;
  }
}
