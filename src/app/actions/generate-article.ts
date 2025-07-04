'use server';

import { z } from 'zod';

const ArticleSchema = z.object({
  content: z.string(),
});

/**
 * Generates an article in real-time using the OpenRouter API.
 * This Server Action is platform-agnostic and will work on Vercel and Firebase.
 * @param topic The topic for the article.
 * @returns The generated article content.
 */
export async function generateArticleAction(topic: string): Promise<{ content: string; error?: string }> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    console.error("OpenRouter API key is not configured.");
    return { content: '', error: "The service is not configured correctly. Missing API Key." };
  }
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openrouter/cypher-alpha:free",
        messages: [
          {
            role: "user",
            content: `Write a comprehensive, SEO-friendly article of at least 500 words on the topic: "${topic}". Use a clear structure with a main H1 title, multiple H2 subheadings for major sections, and H3 headings as needed for further detail. Format the entire response in Markdown.`
          },
        ],
      }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenRouter API error:", errorText);
        throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
        console.error("Invalid response structure from OpenRouter API:", data);
        throw new Error("Failed to parse article content from the API response.");
    }
    
    return { content };

  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error("Request to OpenRouter API timed out.");
      return { content: '', error: 'The request took too long and was timed out. Please try again.' };
    }
    console.error("An error occurred during article generation:", error);
    return { content: '', error: error.message || 'An unexpected error occurred while generating the article.' };
  } finally {
      clearTimeout(timeoutId);
  }
}
