import { slugify } from "./utils";
import { generateArticle, type GenerateArticleOutput } from "@/ai/flows/generate-article";
import type { FullArticle, ArticleTopic } from './definitions';
import { allArticleTopics } from './topics';

// A simple in-memory cache for generated articles to avoid re-generating during the same request lifecycle.
const requestCache = new Map<string, FullArticle>();

async function generateFullArticle(topic: ArticleTopic): Promise<FullArticle> {
  const cacheKey = topic.slug;
  if (requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey)!;
  }

  console.log(`- Live generating article for topic: "${topic.title}"`);
  
  let articleData: GenerateArticleOutput;
  try {
    articleData = await generateArticle({ topic: topic.title });
  } catch (e) {
    console.error(`  - Failed to generate article content for topic: ${topic.title}`, e);
    articleData = {
        summary: "Error: Could not generate article summary.",
        content: `# Error: Content Generation Failed\n\nThere was an error generating the content for this article. Please try again later. The AI model may be temporarily unavailable or there could be an issue with the API key.\n\n**Topic Attempted:** ${topic.title}`,
    };
  }

  // Quality Check: Ensure the generated article is not too short.
  const wordCount = articleData.content.split(/\s+/).length;
  if (wordCount < 1000) { 
      console.error(`  - Generated article is too short (${wordCount} words) for topic: ${topic.title}`);
      articleData.summary = "Error: Could not generate a complete article.";
      articleData.content = `# Error: Content Generation Failed\n\nThe AI failed to generate a sufficiently long article. This might be a temporary issue with the service. Please try again later.\n\n**Topic Attempted:** ${topic.title}`;
  }


  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    `${topic.title}, ${topic.category}, photorealistic, automotive, detailed, professional photography`
  )}`;

  const fullArticle: FullArticle = {
    id: topic.id,
    title: topic.title,
    category: topic.category,
    slug: topic.slug,
    summary: articleData.summary,
    content: articleData.content,
    imageUrl: imageUrl
  };

  requestCache.set(cacheKey, fullArticle);

  // Clear cache after a short period to allow for re-generation on new requests
  setTimeout(() => requestCache.delete(cacheKey), 5000);

  return fullArticle;
}

export async function getTopics(): Promise<ArticleTopic[]> {
  return allArticleTopics;
}

export async function getHomepageTopics(): Promise<ArticleTopic[]> {
  const topics = await getTopics();
  // Show the first 6 topics on the homepage.
  return topics.slice(0, 6);
}

export async function getTopicsByCategory(categoryName: string): Promise<ArticleTopic[]> {
  const topics = await getTopics();
  const lowerCategoryName = categoryName.toLowerCase();
  
  return topics.filter(topic => topic.category.toLowerCase() === lowerCategoryName);
}
  
export async function getArticleBySlug(slug: string): Promise<FullArticle | undefined> {
  const topics = await getTopics();
  const topic = topics.find(topic => topic.slug === slug);
  if (!topic) {
    return undefined;
  }
  return await generateFullArticle(topic);
}
