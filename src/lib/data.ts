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
  { id: 1, title: "Understanding Why Your Modern Car Engine Misfires And How To Fix", category: "Engine" },
  { id: 2, title: "The Ultimate Guide to Diagnosing Your Car's Overheating Engine Issues", category: "Engine" },
  { id: 3, title: "How to Tell if Your Car's Timing Belt Needs Replacement", category: "Engine" },
  { id: 5, title: "Top Five Reasons Your Car's Check Engine Light Is On", category: "Engine" },
  { id: 7, title: "How to Test and Replace a Faulty Oxygen Sensor Today", category: "Sensors" },
  { id: 8, title: "The Role of the Mass Airflow Sensor in Your Vehicle", category: "Sensors" },
  { id: 13, title: "A Beginner's Guide to Using an OBD2 Scanner Correctly", category: "OBD2" },
  { id: 14, title: "Top 10 Most Common OBD2 Codes and What They Mean", category: "OBD2" },
  { id: 19, title: "Understanding Electric Vehicle Battery Health And Maximizing Its Lifespan Now", category: "EVs" },
  { id: 20, title: "Common Maintenance Tasks For Electric Vehicles You Should Know About", category: "EVs" },
  { id: 21, "title": "How Regenerative Braking Works In An Electric Vehicle System", category: "EVs" },
  { id: 16, title: "Advanced OBD2 Diagnostics: Understanding Live Data And Freeze Frame Information", category: "OBD2" },
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
        getImageForQuery(topic.category)
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
