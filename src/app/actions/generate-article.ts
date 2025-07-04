'use server';

import { z } from 'zod';

const ArticleSchema = z.object({
  content: z.string(),
});

/**
 * Generates an article in real-time using the OpenRouter API with model balancing.
 * This Server Action is platform-agnostic and will work on Vercel and Firebase.
 * @param topic The topic for the article.
 * @returns The generated article content.
 */
export async function generateArticleAction(topic: string): Promise<{ content: string; error?: string }> {
  // We will balance the load between two different free models on OpenRouter.
  const models = [
    {
      name: 'openrouter/cypher-alpha:free',
      // This key is expected to be in the environment variables.
      apiKey: process.env.OPENROUTER_API_KEY,
    },
    {
      name: 'meta-llama/llama-4-scout:free',
      // This is a user-provided key specifically for the Llama 4 Scout model.
      apiKey: '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',
    },
  ];

  // Randomly select one of the models to use for this request.
  const selectedModel = models[Math.floor(Math.random() * models.length)];
  const { name: modelName, apiKey } = selectedModel;

  if (!apiKey) {
    console.error(`OpenRouter API key for model ${modelName} is not configured.`);
    // Provide a generic error to the user.
    return { content: '', error: 'The service is not configured correctly. Missing API Key.' };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60-second timeout

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        // Optional headers for OpenRouter ranking
        'HTTP-Referer': 'https://cardiagnostics.ai',
        'X-Title': 'Car Diagnostics AI',
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          {
            role: 'user',
            content: `You are an expert automotive writer and SEO specialist. Your task is to write a detailed, comprehensive, and engaging article on the topic: "${topic}". The article MUST be at least 1500 words long. The article must be well-structured with proper paragraphs. Format the entire response in Markdown, adhering to the following strict structure: 1. A single H1 heading for the main title. 2. Multiple H2 headings for the main sections. 3. Under each H2, use several H3 headings for sub-sections. 4. Use standard paragraph formatting for the body text. Do not skip headings or use them out of order. This structure is critical for readability and SEO.`,
          },
        ],
      }),
      signal: controller.signal,
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenRouter API error (model: ${modelName}, status: ${response.status}):`, errorText);
      if (response.status === 429) {
        // Provide a user-friendly message for rate limiting
        throw new Error('Our AI is currently busy generating new content. Please try again in a few moments.');
      }
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content || content.trim().length < 200) {
      console.error(`Invalid or insufficient content from OpenRouter API (model: ${modelName}):`, data);
      throw new Error('The AI failed to generate a complete article. Please try again or select a different topic.');
    }

    return { content };

  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error(`Article generation with model ${modelName} timed out after 60 seconds.`);
      return { content: '', error: 'The request to generate the article took too long and timed out. Please try again.' };
    }
    console.error(`An error occurred during article generation with model ${modelName}:`, error);
    // Pass the specific, user-friendly error message to the UI
    return { content: '', error: error.message || 'An unexpected error occurred while generating the article.' };
  }
}
