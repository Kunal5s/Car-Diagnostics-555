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
            role: "user",
            content: `Write a 1200-word SEO-friendly article using H1, H2, and H3 headings on the topic: ${topic}`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`API Error: ${response.status} ${response.statusText}`, errorBody);
      return { content: '', error: `Failed to generate article. API returned status ${response.status}.` };
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
        console.error("API Error: No content in response from OpenRouter", data);
        return { content: '', error: "Failed to generate article. The API returned an empty response." };
    }

    return { content };

  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return { content: '', error: "An unexpected error occurred while generating the article." };
  }
}
