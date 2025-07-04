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

  try