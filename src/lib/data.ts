
'use server';

import type { FullArticle } from './definitions';
import { promises as fs } from 'fs';
import path from 'path';

// This is now the ONLY way articles are retrieved.
// The app reads from the filesystem, which is populated by the cron job.
// No article generation happens here.

const articlesDir = path.join(process.cwd(), '_articles');

async function getArticleFiles(): Promise<string[]> {
  try {
    // Check if the directory exists
    await fs.access(articlesDir);
    const files = await fs.readdir(articlesDir);
    return files.filter(file => file.endsWith('.json'));
  } catch (error) {
    // Directory doesn't exist, which is a normal state on a clean build before the cron job has run.
    console.warn("'_articles' directory not found. This is normal on a clean build. Articles will be populated by the cron job.");
    return [];
  }
}

async function readArticleFile(file: string): Promise<FullArticle | null> {
  try {
    const filePath = path.join(articlesDir, file);
    const data = await fs.readFile(filePath, 'utf-8');
    const article = JSON.parse(data);

    // Basic validation to ensure the parsed object is an article
    if (article && typeof article.id === 'number' && article.title && article.slug) {
        return article;
    }
    console.warn(`File ${file} is not a valid article. Skipping.`);
    return null;

  } catch (error) {
    console.error(`Error reading or parsing article file: ${file}`, error);
    return null;
  }
}

// This function is the single source of truth for loading articles from the filesystem.
// It is designed to be called by pages and components. It does NOT generate content.
export async function getAllArticles(): Promise<FullArticle[]> {
  const files = await getArticleFiles();
  if (files.length === 0) {
    return [];
  }
  
  const articlePromises = files.map(readArticleFile);
  const articles = (await Promise.all(articlePromises))
    .filter((a): a is FullArticle => a !== null); // Type guard to filter out nulls

  // Sort by ID descending (newest first)
  articles.sort((a, b) => b.id - a.id);

  return articles;
}

export async function getRecentArticles(count: number): Promise<FullArticle[]> {
  const allArticles = await getAllArticles();
  return allArticles.slice(0, count);
}


export async function getArticlesByCategory(category: string): Promise<FullArticle[]> {
  const allArticles = await getAllArticles();
  return allArticles.filter(a => a.category.toLowerCase() === category.toLowerCase());
}

export async function getArticleBySlug(slug: string): Promise<FullArticle | null> {
    const files = await getArticleFiles();
    // The slug is the filename without the extension
    const fileName = files.find(file => file.replace('.json', '') === slug);

    if (!fileName) {
        return null;
    }
    
    return readArticleFile(fileName);
}

export async function getAllArticleSlugs(): Promise<string[]> {
    const files = await getArticleFiles();
    return files.map(file => file.replace('.json', ''));
}
