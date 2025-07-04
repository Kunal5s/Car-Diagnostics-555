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
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openrouter/cypher-alpha:free",
        messages: [
          {
            role: "user",
            content: `You are an expert automotive writer and SEO specialist. Write a detailed, comprehensive, and SEO-friendly article of at least 500 words on the topic: "${topic}". The article MUST be structured with proper headings for maximum readability and SEO value. You must use a main H1 heading for the title, multiple H2 headings for primary sections, and H3, H4, H5, and H6 headings for sub-sections as appropriate. This hierarchical heading structure is mandatory.`
          }
        ]
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

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

  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.error("Article generation timed out.");
      return { content: '', error: "The request to generate the article took too long and was timed out. Please try again." };
    }
    console.error("An unexpected error occurred:", error);
    return { content: '', error: "An unexpected error occurred while generating the article." };
  }
}
