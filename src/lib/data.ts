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

const allArticleTopics: ArticleTopic[] = [
  // Engine (6 articles)
  { id: 1, title: "Diagnosing and Fixing Common Modern Car Engine Performance Issues", category: "Engine" },
  { id: 2, title: "Step-by-Step Guide to Resolving Your Car Engine Overheating", category: "Engine" },
  { id: 3, title: "Understanding and Replacing Your Vehicle's Worn Out Timing Belt", category: "Engine" },
  { id: 4, title: "How to Decode Your Car's Annoying Check Engine Light", category: "Engine" },
  { id: 5, title: "A Deep Dive into Advanced Turbocharger System Diagnostic Techniques", category: "Engine" },
  { id: 6, title: "Troubleshooting Low Oil Pressure Problems in Your Vehicle's Engine", category: "Engine" },
  // Sensors (6 articles)
  { id: 7, title: "A Complete Guide to Testing and Replacing Faulty Sensors", category: "Sensors" },
  { id: 8, title: "The Essential Role of Oxygen Sensors in Your Vehicle", category: "Sensors" },
  { id: 9, title: "How to Clean Your Mass Airflow Sensor for Performance", category: "Sensors" },
  { id: 10, title: "Understanding Crankshaft and Camshaft Position Sensors for Engine Timing", category: "Sensors" },
  { id: 11, title: "Diagnosing Issues with Your Car's Modern Tire Pressure Sensors", category: "Sensors" },
  { id: 12, title: "The Importance of a Functioning Coolant Temperature Sensor Today", category: "Sensors" },
  // OBD2 (6 articles)
  { id: 13, title: "Understanding the Most Common On-Board-Diagnostics Two Error Codes", category: "OBD2" },
  { id: 14, title: "A Complete Beginner's Guide to Using OBD2 Scanners Properly", category: "OBD2" },
  { id: 15, title: "Advanced OBD2 Live Data and Freeze Frame Information Guide", category: "OBD2" },
  { id: 16, title: "How to Clear OBD2 Codes After a Car Repair", category: "OBD2" },
  { id: 17, title: "Using Bluetooth OBD2 Scanners with Your Modern Smartphone Apps", category: "OBD2" },
  { id: 18, title: "What is OBD3 and How Will It Change Diagnostics", category: "OBD2" },
  // Alerts (6 articles)
  { id: 19, title: "What to Do When Your Dashboard Warning Lights Come On", category: "Alerts" },
  { id: 20, title: "Understanding Your Car's Most Important Dashboard Warning System Alerts", category: "Alerts" },
  { id: 21, title: "Decoding Your Car's ABS and Traction Control Warning Lights", category: "Alerts" },
  { id: 22, title: "Why Your Car's Battery and Alternator Warning Lights Matter", category: "Alerts" },
  { id: 23, title: "The Meaning Behind Your Vehicle's Oil Pressure Warning Light", category: "Alerts" },
  { id: 24, title: "How to Respond to a Flashing Check Engine Light", category: "Alerts" },
  // Apps (6 articles)
  { id: 25, title: "Top Car Diagnostic Mobile Apps for Android and iOS", category: "Apps" },
  { id: 26, title: "How Modern Car Diagnostic Apps Can Save You Money", category: "Apps" },
  { id: 27, title: "Using Car Apps to Track Maintenance and Vehicle Health", category: "Apps" },
  { id: 28, title: "Comparing the Best Features of Modern Car Diagnostic Apps", category: "Apps" },
  { id: 29, title: "The Future of Car Diagnostics is in Your Pocket", category: "Apps" },
  { id: 30, title: "How to Connect Your Car to a Diagnostic Mobile App", category: "Apps" },
  // Maintenance (6 articles)
  { id: 31, title: "Essential DIY Car Maintenance Tips for Every Car Owner", category: "Maintenance" },
  { id: 32, title: "A Complete Seasonal Car Maintenance Checklist For Your Vehicle", category: "Maintenance" },
  { id: 33, title: "How to Check and Change Your Car's Essential Fluids", category: "Maintenance" },
  { id: 34, title: "The Importance of Regular Brake System Inspection and Maintenance", category: "Maintenance" },
  { id: 35, title: "A Simple Guide to Rotating Your Tires for Longevity", category: "Maintenance" },
  { id: 36, title: "When and Why You Should Replace Your Car's Battery", category: "Maintenance" },
  // Fuel (6 articles)
  { id: 37, title: "Simple and Effective Ways to Maximize Your Car's Fuel Economy", category: "Fuel" },
  { id: 38, title: "Troubleshooting the Most Common Fuel System Problems in Cars", category: "Fuel" },
  { id: 39, title: "How to Know if You Have a Clogged Fuel Filter", category: "Fuel" },
  { id: 40, title: "Understanding the Differences Between Gasoline Grades and Octane Ratings", category: "Fuel" },
  { id: 41, title: "The Role of the Fuel Pump in Your Vehicle", category: "Fuel" },
  { id: 42, title: "Diagnosing a Malfunctioning or Failing Modern Day Fuel Injector", category: "Fuel" },
  // EVs (6 articles)
  { id: 43, title: "A Comprehensive Guide to Electric Vehicle Battery Health Maintenance", category: "EVs" },
  { id: 44, title: "Everything You Need to Know About EV Home Charging", category: "EVs" },
  { id: 45, title: "How Regenerative Braking Works in Modern Electric Vehicle Systems", category: "EVs" },
  { id: 46, title: "Common Maintenance Tasks for Your New Electric Vehicle Today", category: "EVs" },
  { id: 47, title: "Understanding EV Range and How to Maximize It Now", category: "EVs" },
  { id: 48, title: "The Differences Between AC and DC Fast Charging Explained", category: "EVs" },
  // Trends (6 articles)
  { id: 49, title: "The Future of Automotive Technology and AI Car Diagnostics", category: "Trends" },
  { id: 50, title: "Exploring the Latest Innovations in Today's Connected Car Technologies", category: "Trends" },
  { id: 51, title: "How Over-the-Air Updates are Changing Modern Car Ownership", category: "Trends" },
  { id: 52, title: "The Rise of Autonomous Driving and Its Safety Features", category: "Trends" },
  { id: 53, title: "Vehicle-to-Everything (V2X) Communication and the Future of Driving", category: "Trends" },
  { id: 54, title: "Understanding the Role of Big Data in Modern Vehicles", category: "Trends" }
];

// We will only generate a subset of articles on the first run to avoid timeouts.
const articleTopics = allArticleTopics.slice(0, 12);


const articlesFilePath = path.join(process.cwd(), 'src', 'lib', 'articles.json');
let cachedArticles: Article[] | null = null;
let generationPromise: Promise<Article[]> | null = null;

async function generateAndCacheArticles(): Promise<Article[]> {
  console.log("Generating articles and fetching images. This may take a while...");

  const articles: Article[] = [];
  for (const topic of articleTopics) {
    try {
      console.log(`- Generating article for: "${topic.title}"`);
      // Wait for 6 seconds between requests to respect the free tier rate limit (15 requests/minute).
      await new Promise(resolve => setTimeout(resolve, 6000));

      const [{ summary, content }, imageUrl] = await Promise.all([
        generateArticle({ topic: topic.title }),
        getImageForQuery(`${topic.title} ${topic.category}`)
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
  const CACHE_TTL_MINUTES = 5;

  if (cachedArticles) {
    return cachedArticles;
  }
  
  try {
    const stats = await fs.stat(articlesFilePath);
    const lastModified = new Date(stats.mtime);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastModified.getTime()) / (1000 * 60);

    if (diffMinutes < CACHE_TTL_MINUTES) {
      const data = await fs.readFile(articlesFilePath, 'utf-8');
      const articles = JSON.parse(data);
      if (articles && articles.length > 0) {
        console.log("Loaded articles from valid file cache.");
        cachedArticles = articles;
        return cachedArticles;
      }
    } else {
      console.log(`Article cache is older than ${CACHE_TTL_MINUTES} minutes. Regenerating...`);
    }
  } catch (error) {
    // If file doesn't exist or there was an error reading it, generate new articles.
    console.log("Article cache not found or is invalid. Generating new articles.");
  }

  // If we reach here, it means we need to generate articles.
  const newArticles = await generateAndCacheArticles();
  cachedArticles = newArticles;
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
