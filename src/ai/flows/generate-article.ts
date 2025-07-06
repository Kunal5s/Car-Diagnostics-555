
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

The article MUST be at least 1600 words long.

Your response MUST be in well-structured Markdown format. The structure is absolutely critical for SEO and readability.
- The article's main title MUST be an H1 heading (e.g., '# Title of the Article'). The H1 heading should be the very first thing in the content.
- You MUST include multiple H2 (##) headings to structure the main sections of the article.
- Within each H2 section, you MUST use several H3 (###) headings to break down the content into sub-sections.
- For even deeper nesting where necessary, you can use H4, H5, and H6 headings.
- The use of this hierarchical heading structure (H1 -> H2 -> H3 etc.) is MANDATORY and must be followed strictly.
- Start the article with a compelling introduction (immediately following the H1 heading).
- Before the final conclusion, you MUST include a section with an H2 heading titled 'Key Takeaways' that summarizes the main points of the article in a bulleted list.
- End the article with a final 'Conclusion' section under an H2 heading.

In addition to the article, you must provide a concise, SEO-friendly summary for the article (approximately 160 characters).

IMPORTANT: Your final output must be a JSON object with two keys: "summary" and "content". The "content" field must contain the full article in the structured Markdown format described above.
The JSON object should look like this:
{
  "summary": "Your short SEO-friendly summary here.",
  "content": "# Your Full Article in Markdown\\n\\n## Section 1\\n\\n..."
}`;

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
        'HTTP-Referer': 'https://oudworkstations.dev', // Recommended by OpenRouter
        'X-Title': 'Car Diagnostics BrainAi',       // Recommended by OpenRouter
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3-70b-instruct", // Using LLaMA 3 as requested
        response_format: { type: "json_object" }, // Enforce JSON output
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
    const parsedContent: GenerateArticleOutput = JSON.parse(contentString);
    
    if (!parsedContent.summary || !parsedContent.content) {
        console.error("Invalid JSON structure in AI response:", parsedContent);
        throw new Error("The AI returned a response with an invalid JSON structure.");
    }
    
    return parsedContent;
  } catch (error) {
    console.error("Failed to generate article:", error);
    if (error instanceof SyntaxError) {
        throw new Error('The AI returned malformed JSON and it could not be parsed.');
    }
    throw error;
  }
}
