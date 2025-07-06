'use server';
/**
 * @fileOverview An AI flow for generating SEO-friendly articles.
 *
 * - generateArticle - A function that handles the article generation process.
 * - GenerateArticleInput - The input type for the generateArticle function.
 * - GenerateArticleOutput - The return type for the generateArticle function.
 */

import {z} from 'zod';

// Define the input and output schemas using Zod, same as before.
const GenerateArticleInputSchema = z.object({
  topic: z.string().describe('The topic of the article to generate.'),
});
export type GenerateArticleInput = z.infer<typeof GenerateArticleInputSchema>;

const GenerateArticleOutputSchema = z.object({
  summary: z
    .string()
    .describe('A short, SEO-friendly summary of the article (around 160 characters).'),
  content: z
    .string()
    .describe(
      'The full, detailed, SEO-friendly article content, in Markdown format. It should be well-structured with H1, H2, H3, etc., for headings.'
    ),
});
export type GenerateArticleOutput = z.infer<typeof GenerateArticleOutputSchema>;


// The prompt for the AI model.
const SYSTEM_PROMPT = `You are an expert automotive writer and SEO specialist. Your task is to write a detailed, comprehensive, and engaging article on the given topic.

Your highest priority is to meet the required length. The article MUST be extremely detailed and comprehensive, with a strict minimum word count of 1500 words. Do not write an article shorter than 1500 words under any circumstances.

Your response MUST be in well-structured Markdown format. The structure is absolutely critical for SEO and readability.
- The article's main title MUST be an H1 heading (e.g., '# Title of the Article'). The H1 heading should be the very first thing in the content.
- You MUST include multiple H2 (##) headings to structure the main sections of the article.
- Within each H2 section, you MUST use several H3 (###) headings to break down the content into sub-sections.
- For even deeper nesting where necessary, you can use H4, H5, and H6 headings.
- The use of this hierarchical heading structure (H1 -> H2 -> H3 etc.) is MANDATORY and must be followed strictly.
- Start the article with a compelling introduction (immediately following the H1 heading).
- Before the final conclusion, you MUST include a section with an H2 heading titled 'Key Takeaways' that summarizes the main points of the article in a bulleted list.
- End the article with a final 'Conclusion' section under an H2 heading.

You must also provide a concise, SEO-friendly summary for the article (approximately 160 characters).

The final output must be a valid JSON object that conforms to the specified schema, containing a 'summary' and a 'content' field.`;

// The function that calls the OpenRouter API.
export async function generateArticle(
  input: GenerateArticleInput
): Promise<GenerateArticleOutput> {
  
  if (!process.env.OPENROUTER_API_KEY) {
      console.error("OpenRouter API key is not set in environment variables.");
      return {
        summary: "Error: API key not configured.",
        content: `<h2>Article Generation Failed</h2><p>The <strong>OpenRouter API key</strong> is missing. Please ensure it is correctly configured in the <strong>.env</strong> file.</p>`,
      };
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://car-diagnostics-ai.vercel.app',
            'X-Title': 'Car Diagnostics BrainAi',
        },
        body: JSON.stringify({
            model: 'qwen/qwen-2-7b-instruct',
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `Generate an article on the topic: "${input.topic}"` }
            ]
        })
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("OpenRouter API error:", response.status, errorBody);
        throw new Error(`OpenRouter API request failed with status ${response.status}. Body: ${errorBody}`);
    }

    const jsonResponse = await response.json();
    const content = jsonResponse.choices[0].message.content;
    
    // Sometimes the response can be a string that needs parsing, sometimes it's already an object.
    const data = typeof content === 'string' ? JSON.parse(content) : content;
    
    const parsedResult = GenerateArticleOutputSchema.safeParse(data);

    if (!parsedResult.success) {
        console.error("Failed to parse AI response:", parsedResult.error.toString());
        throw new Error("AI response did not match the expected format.");
    }
    
    return parsedResult.data;

  } catch (error) {
    console.error("Error in generateArticle:", error);
    // Ensure we return a valid structure even on error, to avoid crashing the caller
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      summary: "Error: Could not generate summary.",
      content: `<h2>Article Generation Failed</h2><p>There was an error generating the content for this topic. This could be due to a network issue or a problem with the AI service.</p><p><strong>Topic attempted:</strong> ${input.topic}</p><p><strong>Details:</strong> ${errorMessage}</p><p>For developers: Check the server logs for more details.</p>`,
    };
  }
}
