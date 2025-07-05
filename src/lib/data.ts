
import { promises as fs } from 'fs';
import path from 'path';
import type { FullArticle } from './definitions';

const articlesFilePath = path.join(process.cwd(), 'src', 'lib', 'articles.json');
let cachedArticles: FullArticle[] | null = null;

async function loadArticles(): Promise<FullArticle[]> {
  // This function now simply reads the pre-generated file.
  // This is fast, reliable, and prevents server crashes.
  if (cachedArticles) {
    return cachedArticles;
  }
  try {
    const data = await fs.readFile(articlesFilePath, 'utf-8');
    const articles: FullArticle[] = JSON.parse(data);
    cachedArticles = articles;
    return articles;
  } catch (error) {
    console.error("Fatal: Could not read or parse src/lib/articles.json. The app cannot function without this file.", error);
    // Return an empty array to prevent the app from crashing entirely.
    // The ArticleGrid component will show an error message.
    return [];
  }
}

export async function getArticles(): Promise<FullArticle[]> {
  return await loadArticles();
}

export async function getHomepageArticles(): Promise<FullArticle[]> {
  const articles = await getArticles();
  // Show the first 6 articles on the homepage.
  return articles.slice(0, 6);
}

export async function getArticlesByCategory(categoryName: string): Promise<FullArticle[]> {
  const articles = await getArticles();
  const lowerCategoryName = categoryName.toLowerCase();
  
  if (lowerCategoryName === 'all') {
    return articles;
  }
  
  return articles.filter(article => article.category.toLowerCase() === lowerCategoryName);
}
  
export async function getArticleBySlug(slug: string): Promise<FullArticle | undefined> {
  const articles = await getArticles();
  return articles.find(article => article.slug === slug);
}

    