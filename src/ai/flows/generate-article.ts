'use server';
/**
 * @fileOverview A flow for generating SEO-friendly articles using OpenRouter.
 *
 * - generateArticle - A function that handles the article generation process.
 * - GenerateArticleInput - The input type for the generateArticle function.
 * - GenerateArticleOutput - The return type for the generateArticle function.
 */

import { z } from 'zod';

const GenerateArticleInputSchema = z.object({
  topic: z.string().describe('The topic of the article to generate.'),
});
export type GenerateArticleInput = z.infer<typeof GenerateArticleInputSchema>;

export interface GenerateArticleOutput {
  summary: string;
  content: string;
}

const promptTemplate = `You are an expert automotive writer and SEO specialist. Your task is to write a detailed, comprehensive, and engaging article on the topic: '{TOPIC}'.

IMPORTANT: You must follow this output format EXACTLY.

First, on the very first line, write a concise, SEO-friendly summary for the article (approximately 160 characters).

After the summary, on a new line, you MUST add the exact separator '|||ARTICLE_SEPARATOR|||'.

After the separator, write the full article.

The article MUST be at least 1600 words long.

The article's content MUST be in well-structured Markdown format. The structure is absolutely critical for SEO and readability.
- The article's main title MUST be an H1 heading (e.g., '# Title of the Article'). The H1 heading should be the very first thing in the article content.
- You MUST include multiple H2 (##) headings to structure the main sections of the article.
- Within each H2 section, you MUST use several H3 (###) headings to break down the content into sub-sections.
- For even deeper nesting where necessary, you can use H4, H5, and H6 headings.
- The use of this hierarchical heading structure (H1 -> H2 -> H3 etc.) is MANDATORY and must be followed strictly.
- Start the article with a compelling introduction (immediately following the H1 heading).
- Before the final conclusion, you MUST include a section with an H2 heading titled 'Key Takeaways' that summarizes the main points of the article in a bulleted list.
- End the article with a final 'Conclusion' section under an H2 heading.

Your final output must be structured like this, with NO extra text or explanations before or after:
[The summary text goes here]
|||ARTICLE_SEPARATOR|||
# The Full Article in Markdown
## Section 1
...`;

export async function generateArticle(
  input: GenerateArticleInput
): Promise<GenerateArticleOutput> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OpenRouter API key is not configured in .env file.');
  }

  const prompt = promptTemplate.replace('{TOPIC}', input.topic);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        'HTTP-Referer': 'https://car-diagnostics-ai.vercel.app', // IMPORTANT: Replace with your deployed URL if different
        'X-Title': 'Car Diagnostics BrainAi',      
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3-70b-instruct",
        messages: [
          {
            role: "user",
            content: prompt,
          }
        ]
      })
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("OpenRouter API error:", response.status, errorBody);
        throw new Error(`OpenRouter API request failed with status ${response.status}.`);
    }

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0 || !data.choices[0].message.content) {
        console.error("Invalid response structure from OpenRouter:", data);
        throw new Error("Received an invalid response from the AI service.");
    }

    const contentString = data.choices[0].message.content;
    const parts = contentString.split('|||ARTICLE_SEPARATOR|||');

    if (parts.length < 2) {
        console.error("AI response did not contain the expected separator.", contentString.substring(0, 500)); // Log first 500 chars for debugging
        throw new Error("The AI returned a response with an invalid structure (separator not found).");
    }

    const parsedContent: GenerateArticleOutput = {
        summary: parts[0].trim(),
        content: parts[1].trim()
    };
    
    if (!parsedContent.summary || !parsedContent.content) {
        console.error("Invalid structure in AI response after splitting:", parsedContent);
        throw new Error("The AI returned an empty summary or content.");
    }
    
    return parsedContent;
  } catch (error) {
    console.error("Failed to generate article:", error);
    throw error;
  }
}
