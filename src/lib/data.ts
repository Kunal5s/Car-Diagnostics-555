'use server';

import type { FullArticle, ArticleTopic } from './definitions';
import articlesData from './articles.json';

const allArticles: FullArticle[] = articlesData as FullArticle[];

// This function provides a stable, seeded shuffle based on the current date.
// This means the "random" order will be the same for all users for an entire day.
function seededShuffle(array: any[], seed: number) {
  let currentIndex = array.length, temporaryValue, randomIndex;
  const random = () => {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
  while (0 !== currentIndex) {
    randomIndex = Math.floor(random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

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
  
  // Create a seed based on the current date (YYYYMMDD format)
  const now = new Date();
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();

  // Shuffle the topics using the daily seed
  const shuffledTopics = seededShuffle(topics, seed);
  
  // Return the first 6 topics from the daily shuffled list
  return shuffledTopics.slice(0, 6);
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
