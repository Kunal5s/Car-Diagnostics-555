
import type { FullArticle, ArticleTopic } from './definitions';
import allArticlesData from './articles.json';

const articles: FullArticle[] = allArticlesData as FullArticle[];

// Functions are kept async to avoid changing signatures in all page components.
// They now resolve immediately with static data.

export async function getAllArticles(): Promise<FullArticle[]> {
  return Promise.resolve(articles);
}

export async function getAllTopics(): Promise<ArticleTopic[]> {
  return Promise.resolve(
    articles.map(({ id, title, category, slug, imageUrl, imageHint }) => ({
      id,
      title,
      category,
      slug,
      imageUrl,
      imageHint,
    }))
  );
}

export async function getHomepageTopics(): Promise<ArticleTopic[]> {
  // We take the first 6 articles from the static JSON for consistency on the homepage
  return Promise.resolve(articles.slice(0, 6));
}

export async function getTopicsByCategory(categoryName: string): Promise<ArticleTopic[]> {
  const allArticles = await getAllTopics();
  const lowerCategoryName = categoryName.toLowerCase();
  
  return allArticles.filter(topic => topic.category.toLowerCase() === lowerCategoryName);
}
  
export async function getArticleBySlug(slug: string): Promise<FullArticle | undefined> {
  const article = articles.find(article => article.slug === slug);
  return Promise.resolve(article);
}
