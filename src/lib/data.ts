'use server';

import type { FullArticle, ArticleTopic } from './definitions';
import articlesData from './articles.json';

const allArticles: FullArticle[] = articlesData as FullArticle[];

export async function getAllTopics(): Promise<ArticleTopic[]> {
  // The 'content' and 'summary' are large, so let's not send them unless needed.
  return allArticles.map(({ id, title, category, slug }) => ({
    id,
    title,
    category,
    slug,
  }));
}

export async function getHomepageTopics(): Promise<ArticleTopic[]> {
  const topics = allArticles.map(({ id, title, category, slug }) => ({
    id,
    title,
    category,
    slug,
  }));
  return topics.slice(0, 6);
}

export async function getTopicsByCategory(categoryName: string): Promise<ArticleTopic[]> {
  const lowerCategoryName = categoryName.toLowerCase();
  const filteredArticles = allArticles.filter(topic => topic.category.toLowerCase() === lowerCategoryName);
  
  return filteredArticles.map(({ id, title, category, slug }) => ({
    id,
    title,
    category,
    slug,
  }));
}
  
export async function getArticleBySlug(slug: string): Promise<FullArticle | undefined> {
    const article = allArticles.find(article => article.slug === slug);
    return article;
}

// This function is used by the sitemap. It returns all possible article topics.
export async function getAllArticles(): Promise<ArticleTopic[]> {
    return allArticles.map(({ id, title, category, slug }) => ({
    id,
    title,
    category,
    slug,
  }));
}
