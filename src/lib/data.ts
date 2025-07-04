import { slugify } from "./utils";
import { generateArticle } from "@/ai/flows/generate-article";
import { getImageForQuery } from "./pexels";
import { promises as fs } from 'fs';
import path from 'path';

export interface Article {
  id: number;
  title: string;
  category: string;
  summary: string;
  content: string;
  imageUrl: string;
  slug: string;
}

interface ArticleTopic {
  id: number;
  title: string;
  category: string;
}

const articleTopics: ArticleTopic[] = [
  // Engine
  { id: 1, title: "Advanced Guide to Diagnosing Your Car Engine Performance", category: "Engine" },
  { id: 2, title: "Fixing Common Car Engine Overheating Causes and Issues", category: "Engine" },
  // Sensors
  { id: 3, title: "How to Correctly Test and Replace a Faulty Sensor", category: "Sensors" },
  { id: 4, title: "The Ultimate Guide to Your Vehicle's Oxygen Sensors", category: "Sensors" },
  // OBD2
  { id: 5, title: "Decoding the Most Common On-Board-Diagnostics Two Error Codes", category: "OBD2" },
  { id: 6, title: "A Beginner's Complete Guide to Using OBD2 Scanners", category: "OBD2" },
  // Alerts
  { id: 7, title: "What to Do When Dashboard Warning Lights Turn On", category: "Alerts" },
  { id: 8, title: "Understanding Your Car's Most Important Dashboard Warning Alerts", category: "Alerts" },
  // Apps
  { id: 9, title: "Top Car Diagnostic Mobile Apps for Android & iOS", category: "Apps" },
  { id: 10, title: "How Car Diagnostic Apps Can Save You Big Money", category: "Apps" },
  // Maintenance
  { id: 11, title: "Essential DIY Car Maintenance Tips for Every Single Owner", category: "Maintenance" },
  { id: 12, title: "A Complete Seasonal Car Maintenance Checklist for Vehicles", category: "Maintenance" },
  // Fuel
  { id: 13, title: "How to Maximize Your Car's Fuel Economy Greatly", category: "Fuel" },
  { id: 14, title: "Troubleshooting Common Fuel System Problems in Modern Day Cars", category: "Fuel" },
  // EVs
  { id: 15, title: "A Guide to Electric Vehicle Battery Health Maintenance", category: "EVs" },
  { id: 16, title: "Everything to Know About Electric Vehicle Charging at Home", category: "EVs" },
  // Trends
  { id: 17, title: "The Future of Automotive Technology and AI Diagnostics", category: "Trends" },
  { id: 18, title: "Exploring the Latest Innovations in Connected Car Technologies", category: "Trends" },
];

const articlesFilePath = path.join(process.cwd(), 'src', 'lib', 'articles.json');
let cachedArticles: Article[] | null = null;
let generationPromise: Promise<Article[]> | null = null;

async function generateAndCacheArticles(): Promise<Article[]> {
  console.log("Generating articles and fetching images for the first time. This may take a while...");

  const articles: Article[] = [];
  for (const topic of articleTopics) {
    try {
      console.log(`- Generating article for: "${topic.title}"`);
      // Wait for 5 seconds between requests to respect the free tier rate limit (15 requests/minute).
      await new Promise(resolve => setTimeout(resolve, 5000));

      const [{ summary, content }, imageUrl] = await Promise.all([
        generateArticle({ topic: topic.title }),
        getImageForQuery(topic.title)
      ]);

      articles.push({
        id: topic.id,
        title: topic.title,
        category: topic.category,
        summary,
        content,
        imageUrl,
        slug: `${slugify(topic.title)}-${topic.id}`
      });
    } catch (e) {
      console.error(`Failed to generate article for topic: ${topic.title}`, e);
      // Return a fallback article so the site doesn't crash
      articles.push({
        id: topic.id,
        title: topic.title,
        category: topic.category,
        summary: "Could not load article summary.",
        content: "There was an error generating this article. Please try again later.",
        imageUrl: 'https://placehold.co/600x400.png',
        slug: `${slugify(topic.title)}-${topic.id}`
      });
    }
  }

  try {
    await fs.writeFile(articlesFilePath, JSON.stringify(articles, null, 2));
    console.log(`Saved ${articles.length} generated articles to cache file: ${articlesFilePath}`);
  } catch (error) {
    console.error("Failed to write articles cache file:", error);
  }
  
  console.log("Finished generating articles and fetching images.");
  return articles;
}


async function loadArticles(): Promise<Article[]> {
  // This function contains the logic to either load from file cache or generate.
  // It is wrapped by getArticles to prevent multiple concurrent executions.
  if (cachedArticles) {
    return cachedArticles;
  }
  
  try {
    const data = await fs.readFile(articlesFilePath, 'utf-8');
    const articles = JSON.parse(data);
    if (articles && articles.length > 0) {
      console.log("Loaded articles from file cache.");
      cachedArticles = articles;
      return cachedArticles;
    }
  } catch (error) {
    // If file doesn't exist or is empty, we'll generate the articles.
    console.log("Article cache not found or is empty.");
  }

  cachedArticles = await generateAndCacheArticles();
  return cachedArticles;
}

export async function getArticles(): Promise<Article[]> {
  if (cachedArticles) {
    return cachedArticles;
  }
  // Use a promise-based lock to prevent multiple generation processes from running at the same time.
  // If generation is already in progress, subsequent calls will wait for it to complete.
  if (!generationPromise) {
    generationPromise = loadArticles();
  }
  return generationPromise;
}
