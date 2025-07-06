
import type { FullArticle, ArticleTopic } from './definitions';
import allArticlesData from './articles.json';

// Since the data is now static in the JSON file, we can treat it as a simple data source.
// The complex fetching logic is no longer needed.

const articles: FullArticle[] = allArticlesData as FullArticle[];

export async function getAllArticles(): Promise<FullArticle[]> {
  // The function is async to maintain the same signature, but it resolves immediately.
  return articles;
}

export async function getAllTopics(): Promise<ArticleTopic[]> {
  const allArticles = await getAllArticles();
  return allArticles.map(({ id, title, category, slug, imageUrl, imageHint }) => ({
    id,
    title,
    category,
    slug,
    imageUrl,
    imageHint,
  }));
}

export async function getHomepageTopics(): Promise<ArticleTopic[]> {
  const topics = await getAllTopics();
  return topics.slice(0, 6);
}

export async function getTopicsByCategory(categoryName: string): Promise<ArticleTopic[]> {
  const topics = await getAllTopics();
  const lowerCategoryName = categoryName.toLowerCase();
  
  return topics.filter(topic => topic.category.toLowerCase() === lowerCategoryName);
}
  
export async function getArticleBySlug(slug: string): Promise<FullArticle | undefined> {
  const allArticles = await getAllArticles();
  return articles.find(article => article.slug === slug);
}
