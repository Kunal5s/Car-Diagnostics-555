import { slugify } from "./utils";
import { generateArticleAction } from '@/app/actions/generate-article';
import { generateImageAction } from '@/app/actions/generate-image';
import { promises as fs } from 'fs';
import path from 'path';

export interface Article {
  id: number;
  slug: string;
  title: string;
  category: string;
  content: string;
  imageUrl: string;
}

interface MasterTopic {
  id: number;
  title: string;
  category: string;
}

// A master list of topics to ensure consistent generation.
// The system will generate 18 articles in total, 2 for each category.
const masterTopics: MasterTopic[] = [
    // Engine
    { id: 1, title: "Diagnosing Common Car Engine Performance Issues", category: "Engine" },
    { id: 2, title: "Resolving Car Engine Overheating: A Step-by-Step Guide", category: "Engine" },
    // Sensors
    { id: 3, title: "Testing And Replacing Faulty Automotive Sensors", category: "Sensors" },
    { id: 4, title: "The Role of Oxygen Sensors In Modern Vehicles", category: "Sensors" },
    // OBD2
    { id: 5, title: "A Beginner's Guide to Using OBD2 Scanners", category: "OBD2" },
    { id: 6, title: "Understanding Advanced OBD2 Live Data For Diagnostics", category: "OBD2" },
    // Alerts
    { id: 7, title: "What to Do When Your Dashboard Warning Lights Come On", category: "Alerts" },
    { id: 8, title: "Decoding Your Car's ABS And Traction Control Warning Lights", category: "Alerts" },
    // Apps
    { id: 9, title: "How Car Diagnostic Apps Can Save You Money on Repairs", category: "Apps" },
    { id: 10, title: "The Best Features of Modern Car Diagnostic Apps", category: "Apps" },
    // Maintenance
    { id: 11, title: "Essential DIY Car Maintenance Tips For Every Owner", category: "Maintenance" },
    { id: 12, title: "A Complete Seasonal Car Maintenance Checklist", category: "Maintenance" },
    // Fuel
    { id: 13, title: "Troubleshooting Common Fuel System Problems", category: "Fuel" },
    { id: 14, title: "How To Know If You Have A Clogged Fuel Filter", category: "Fuel" },
    // EVs
    { id: 15, title: "A Guide to Electric Vehicle Battery Health and Maintenance", category: "EVs" },
    { id: 16, title: "Regenerative Braking in Modern Electric Vehicles Explained", category: "EVs" },
    // Trends
    { id: 17, title: "The Future of Automotive Technology: AI Diagnostics", category: "Trends" },
    { id: 18, title: "How Over-the-Air Software Updates Are Changing Car Ownership", category: "Trends" }
];

const articlesFilePath = path.join(process.cwd(), 'src', 'lib', 'articles.json');
let articleCache: Article[] | null = null;
let generationPromise: Promise<Article[]> | null = null;

// This function simulates a scheduled job. It generates all content and caches it.
async function generateAndCacheContent(): Promise<Article[]> {
  console.log("Generating articles and fetching images for the first time. This may take a while...");

  if (!process.env.GOOGLE_API_KEY || !process.env.PEXELS_API_KEY) {
      throw new Error("Missing API keys. Please add GOOGLE_API_KEY and PEXELS_API_KEY to your .env file. See /settings for more info.");
  }
  
  const articles: Article[] = [];
  let generatedCount = 0;
  const totalToGenerate = masterTopics.length;
  const requestsPerMinute = 20; // A safe limit for Gemini Flash free tier (usually 60 QPM)
  const delay = 60000 / requestsPerMinute;

  for (const topic of masterTopics) {
    const slug = `${slugify(topic.title)}-${topic.id}`;
    console.log(`- [${++generatedCount}/${totalToGenerate}] Processing topic: "${topic.title}"`);
    
    try {
      const [content, imageUrl] = await Promise.all([
        generateArticleAction(topic.title),
        generateImageAction(`${topic.title} ${topic.category}`)
      ]);
  
      articles.push({
          id: topic.id,
          slug,
          title: topic.title,
          category: topic.category,
          content,
          imageUrl,
      });

    } catch (error) {
        console.error(`- Failed to process topic "${topic.title}". Skipping. Error:`, error);
    }
    
    // Wait before the next request to respect API rate limits.
    if (generatedCount < totalToGenerate) {
        await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  try {
    await fs.writeFile(articlesFilePath, JSON.stringify(articles, null, 2));
    console.log(`Saved ${articles.length} generated articles to cache file: ${articlesFilePath}`);
  } catch (error) {
    console.error("Failed to write articles cache file:", error);
  }
  
  console.log("Finished content generation process.");
  return articles;
}

async function loadArticles(): Promise<Article[]> {
  if (articleCache) {
    return articleCache;
  }
  
  try {
    const data = await fs.readFile(articlesFilePath, 'utf-8');
    // Check if the file has substantial content and is not just an empty array
    if (data.length > 10) { 
      const articles: Article[] = JSON.parse(data);
      console.log(`Loaded ${articles.length} articles from cache file.`);
      articleCache = articles;
      return articleCache;
    }
  } catch (error) {
    // File not found or is invalid, proceed to generation.
    console.log("Article cache not found or is empty. Starting content generation process.");
  }

  // If cache is missing or empty, generate the content.
  const newArticles = await generateAndCacheContent();
  articleCache = newArticles;
  return newArticles;
}

export async function getArticles(): Promise<Article[]> {
  // This "promise lock" ensures that the generation process only runs once, even with concurrent requests.
  if (!generationPromise) {
    generationPromise = loadArticles();
  }
  return generationPromise;
}

export async function getArticlesByCategory(categoryName: string): Promise<Article[]> {
    const allArticles = await getArticles();
    const lowerCategoryName = categoryName.toLowerCase();
    
    if (lowerCategoryName === 'all') {
      return allArticles;
    }
    
    return allArticles.filter(article => article.category.toLowerCase() === lowerCategoryName);
}
  
export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
    const allArticles = await getArticles();
    return allArticles.find(article => article.slug === slug);
}
