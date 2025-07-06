
'use server';
/**
 * @fileOverview An AI flow for generating SEO-friendly articles using a direct API call.
 *
 * - generateArticle - A function that handles the article generation process.
 * - GenerateArticleInput - The input type for the generateArticle function.
 * - GenerateArticleOutput - The return type for the generateArticle function.
 */

import {z} from 'zod';

// Define the input and output schemas using Zod.
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


// The main exported function that will be called by the application.
// It now uses a direct fetch call to the OpenRouter API.
export async function generateArticle(
  input: GenerateArticleInput
): Promise<GenerateArticleOutput> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    const errorMsg = "The OpenRouter API key is missing. Please add `OPENROUTER_API_KEY=\"your_key_here\"` to the `.env` file in the project's root directory and restart the application.";
    console.error(errorMsg);
    return {
      summary: "Error: Configuration Issue",
      content: `<h2>API Key Not Found</h2>
                 <p>${errorMsg}</p>
                 <p>For developers: Ensure the environment variable is set correctly on your deployment platform or in your local .env file.</p>`,
    };
  }
  
  const prompt = `You are an expert automotive writer. Your single most important goal is to write an exceptionally long and detailed article about the provided topic.

**CRITICAL REQUIREMENT: The article's content MUST be a minimum of 1700 words.** This is not a suggestion. It is a strict rule. Do not provide a shorter article. The word count is the absolute highest priority.

To achieve this length, you must follow this mandatory structure:
1.  **Main Title (H1):** Start with an H1 heading for the article title.
2.  **Introduction:** A detailed introduction of at least 150 words.
3.  **Main Body (Minimum 5 H2 Sections):**
    *   The core of the article must contain AT LEAST FIVE distinct H2 (##) sections.
    *   Each H2 section MUST be thoroughly explored.
    *   Within EACH H2 section, you MUST include AT LEAST THREE H3 (###) sub-sections to break down the topic in extreme detail.
    *   Each H3 sub-section should be a well-developed paragraph or set of paragraphs. Use bullet points, numbered lists, and bold text where appropriate to add detail and depth.
4.  **Key Takeaways Section (H2):** Before the conclusion, you MUST include an H2 section titled 'Key Takeaways'. This section should contain a detailed bulleted list summarizing the most critical points from the entire article.
5.  **Conclusion (H2):** A final H2 section titled 'Conclusion' that summarizes the article and provides final thoughts. This should be at least 100 words.

**Output Format:**
- You must provide a concise, SEO-friendly summary (around 160 characters) for the 'summary' field.
- The entire article, following the strict structure and word count mentioned above, must be in the 'content' field as a single Markdown string.
- The final output MUST be a valid JSON object that conforms to the specified schema.

Remember: 1700 words is the minimum. Go into extreme detail. Explain every concept thoroughly. Assume the reader is a beginner.

Topic: ${input.topic}
`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 50000); // 50-second timeout

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3-70b-instruct',
        response_format: { "type": "json_object" },
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("OpenRouter API error:", response.status, errorBody);
        
        let displayError: string;
        if (response.status === 401) {
            displayError = `The OpenRouter API request was rejected due to an **invalid or missing API key**. Please verify your key in the <strong>.env</strong> file and ensure it has funds.`
        } else if (response.status === 429) {
            displayError = `The request was rejected due to **rate limiting**. You may have exceeded the free tier limits for the AI model. Please check your OpenRouter account.`
        } else {
            displayError = `The request failed with status code ${response.status}. This could be a network issue or a problem with the AI service.`
        }

        return {
            summary: "Error: Could not generate content.",
            content: `<h2>Article Generation Failed</h2>
                        <p>${displayError}</p>
                        <p><strong>Topic attempted:</strong> ${input.topic}</p>
                        <p><strong>Error Details:</strong> ${errorBody}</p>`,
        };
    }

    const data = await response.json();
    const articleJson = JSON.parse(data.choices[0].message.content);

    // FIX: Handle cases where the AI returns content as an array of strings.
    if (articleJson && Array.isArray(articleJson.content)) {
      console.warn("AI returned content as an array. Joining it into a single string to prevent validation errors.");
      articleJson.content = articleJson.content.join('\n\n');
    }
    
    // Validate the parsed JSON against our schema
    const validationResult = GenerateArticleOutputSchema.safeParse(articleJson);
    if (!validationResult.success) {
      console.error("AI output failed Zod validation:", validationResult.error);
       return {
          summary: "Error: Invalid AI Response",
          content: `<h2>AI Response Error</h2>
                     <p>The AI generated a response, but it did not match the expected format. This can happen with complex requests or inconsistent model behavior.</p>
                     <p><strong>Validation Errors:</strong> ${validationResult.error.toString()}</p>`,
       };
    }

    return validationResult.data;

  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error("API call timed out.");
      return {
        summary: "Error: Request Timed Out",
        content: `<h2>Article Generation Timed Out</h2>
                   <p>The request to the AI service took too long to respond and was cancelled. This can happen during periods of high demand or with very complex requests.</p>
                   <p>If you are deploying on a platform like Vercel, this might also be due to Serverless Function execution limits on your plan (e.g., 10-15 seconds on the Hobby tier).</p>
                   <p>Please try again in a few moments.</p>`,
      };
    }
    
    console.error("Error executing API call:", error);
    const errorMessage = error.message || 'An unknown error occurred.';
    return {
      summary: "Error: Could not generate content.",
      content: `<h2>Article Generation Failed</h2>
                 <p>An unexpected error occurred while trying to generate the article.</p>
                 <p><strong>Topic attempted:</strong> ${input.topic}</p>
                 <p><strong>Error Details:</strong> ${errorMessage}</p>
                 <p>For developers: Check the server logs for more details.</p>`,
    };
  } finally {
      clearTimeout(timeoutId);
  }
}
