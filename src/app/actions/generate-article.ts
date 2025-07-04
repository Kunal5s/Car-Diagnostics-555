'use server';

import { z } from 'zod';

const ArticleSchema = z.object({
  content: z.string(),
});

/**
 * Generates an article using a resilient, multi-model approach.
 * It will try multiple AI models in sequence if one is rate-limited or fails.
 * @param topic The topic for the article.
 * @returns The generated article content or an error message.
 */
export async function generateArticleAction(topic: string): Promise<{ content: string; error?: string }> {
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
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60-second timeout

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
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

      // If rate-limited, log it and try the next model in the loop.
      if (response.status === 429) {
          console.warn(`Model ${modelName} is rate-limited. Trying next available model for article generation.`);
          continue;
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenRouter API error (model: ${modelName}, status: ${response.status}):`, errorText);
        continue;
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content || content.trim().length < 200) {
        console.error(`Invalid or insufficient content from OpenRouter API (model: ${modelName}):`, data);
        continue;
      }
      
      // If we get here, the request was successful. Return the content.
      console.log(`Successfully generated article using model: ${modelName}`);
      return { content };

    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.error(`Article generation with model ${modelName} timed out. Trying next model.`);
      } else {
        console.error(`An error occurred during article generation with model ${modelName}:`, error);
      }
      // On any error (timeout, network, etc.), continue to the next model.
      continue;
    }
  }
  
  // If the loop completes, all models have failed.
  const finalError = 'All our AI models are currently busy or unavailable. Please try again in a few moments.';
  console.error(finalError);
  return { content: '', error: finalError };
}
