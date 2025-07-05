
import type { FullArticle, ArticleTopic } from './definitions';
import allArticles from './articles.json';

// This function simulates an async call, which is good practice for data fetching.
export async function getAllArticles(): Promise<FullArticle[]> {
  return allArticles as FullArticle[];
}

export async function getAllTopics(): Promise<ArticleTopic[]> {
  const articles = await getAllArticles();
  return articles.map(({ id, title, category, slug, imageUrl }) => ({
    id,
    title,
    category,
    slug,
    imageUrl,
  }));
}

export async function getHomepageTopics(): Promise<ArticleTopic[]> {
  const topics = await getAllTopics();
  // Show the first 6 topics on the homepage.
  return topics.slice(0, 6);
}

export async function getTopicsByCategory(categoryName: string): Promise<ArticleTopic[]> {
  const topics = await getAllTopics();
  const lowerCategoryName = categoryName.toLowerCase();
  
  return topics.filter(topic => topic.category.toLowerCase() === lowerCategoryName);
}
  
export async function getArticleBySlug(slug: string): Promise<FullArticle | undefined> {
  const articles = await getAllArticles();
  return articles.find(article => article.slug === slug);
}
