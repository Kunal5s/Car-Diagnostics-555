
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
  { id: 1, title: "Diagnosing Common Car Engine Performance Issues For Beginners", category: "Engine" },
  { id: 2, title: "Your Step-by-Step Guide to Resolving Car Engine Overheating", category: "Engine" },
  { id: 3, title: "How to Know When to Replace Your Timing Belt", category: "Engine" },
  { id: 4, title: "Top Five Reasons Your Car's Check Engine Light Is On", category: "Engine" },
  { id: 5, title: "Advanced Turbocharger System Diagnostic Techniques For Modern Cars", category: "Engine" },
  { id: 6, title: "Troubleshooting Low Oil Pressure Problems In Your Vehicle", category: "Engine" },
  // Sensors (6 articles)
  { id: 7, title: "A Complete Guide To Testing And Replacing Faulty Sensors", category: "Sensors" },
  { id: 8, title: "The Essential Role of Oxygen Sensors In Modern Vehicles", category: "Sensors" },
  { id: 9, title: "How to Clean Your Mass Airflow Sensor For Performance", category: "Sensors" },
  { id: 10, title: "Crankshaft and Camshaft Position Sensors And Engine Timing", category: "Sensors" },
  { id: 11, title: "Diagnosing Issues With Your Car's Tire Pressure Sensors", category: "Sensors" },
  { id: 12, title: "The Importance of Functioning Coolant Temperature Sensor Today", category: "Sensors" },
  // OBD2 (6 articles)
  { id: 13, title: "Top 10 Most Common OBD2 Codes and What They Mean", category: "OBD2" },
  { id: 14, title: "A Beginner's Guide to Using OBD2 Scanners Properly", category: "OBD2" },
  { id: 15, title: "Guide to Advanced OBD2 Live Data And Freeze Frame", category: "OBD2" },
  { id: 16, title: "How to Clear OBD2 Codes After A Car Repair", category: "OBD2" },
  { id: 17, title: "Using Bluetooth OBD2 Scanners With Your Smartphone Apps", category: "OBD2" },
  { id: 18, title: "What is OBD3 And How Will It Change Diagnostics", category: "OBD2" },
  // Alerts (6 articles)
  { id: 19, title: "What to Do When Your Dashboard Warning Lights On", category: "Alerts" },
  { id: 20, title: "Understanding Your Car's Most Important Dashboard Warning Alerts", category: "Alerts" },
  { id: 21, title: "Decoding Your Car's ABS And Traction Control Lights", category: "Alerts" },
  { id: 22, title: "Why Your Car's Battery And Alternator Lights Matter", category: "Alerts" },
  { id: 23, title: "The Meaning Behind Your Vehicle's Oil Pressure Light", category: "Alerts" },
  { id: 24, title: "How to Respond to a Flashing Check Engine Light", category: "Alerts" },
  // Apps (6 articles)
  { id: 25, title: "Top Car Diagnostic Mobile Apps For Android And iOS", category: "Apps" },
  { id: 26, title: "How Modern Car Diagnostic Apps Can Save You Money", category: "Apps" },
  { id: 27, title: "Using Car Apps to Track Maintenance and Vehicle Health", category: "Apps" },
  { id: 28, title: "Comparing The Best Features of Modern Car Diagnostic Apps", category: "Apps" },
  { id: 29, title: "The Future of Car Diagnostics Is In Your Pocket", category: "Apps" },
  { id: 30, title: "How to Connect Your Car to A Diagnostic App", category: "Apps" },
  // Maintenance (6 articles)
  { id: 31, title: "Essential DIY Car Maintenance Tips For Every Car Owner", category: "Maintenance" },
  { id: 32, title: "A Complete Seasonal Car Maintenance Checklist For Vehicles", category: "Maintenance" },
  { id: 33, title: "How to Check And Change Your Car's Essential Fluids", category: "Maintenance" },
  { id: 34, title: "The Importance of Regular Brake System Inspection Maintenance", category: "Maintenance" },
  { id: 35, title: "A Simple Guide to Rotating Your Tires For Longevity", category: "Maintenance" },
  { id: 36, title: "When And Why You Should Replace Your Car's Battery", category: "Maintenance" },
  // Fuel (6 articles)
  { id: 37, title: "Simple Ways to Maximize Your Car's Fuel Economy Now", category: "Fuel" },
  { id: 38, title: "Troubleshooting The Most Common Fuel System Problems Cars", category: "Fuel" },
  { id: 39, title: "How To Know If You Have A Clogged Filter", category: "Fuel" },
  { id: 40, title: "Understanding The Differences Between Gasoline Grades And Ratings", category: "Fuel" },
  { id: 41, title: "The Role of The Fuel Pump In Your Vehicle", category: "Fuel" },
  { id: 42, title: "Diagnosing A Malfunctioning Or Failing Modern Fuel Injector", category: "Fuel" },
  // EVs (6 articles)
  { id: 43, title: "A Guide to Electric Vehicle Battery Health Maintenance", category: "EVs" },
  { id: 44, title: "Everything You Need to Know About EV Home Charging", category: "EVs" },
  { id: 45, title: "How Regenerative Braking Works In Modern Electric Vehicles", category: "EVs" },
  { id: 46, title: "Common Maintenance Tasks For Your New Electric Vehicle", category: "EVs" },
  { id: 47, title: "Understanding EV Range And How to Maximize It Now", category: "EVs" },
  { id: 48, title: "The Differences Between AC And DC Fast Charging Explained", category: "EVs" },
  // Trends (6 articles)
  { id: 49, title: "The Future of Automotive Technology and AI Car Diagnostics", category: "Trends" },
  { id: 50, title: "Exploring Latest Innovations In Today's Connected Car Technologies", category: "Trends" },
  { id: 51, title: "How Over-the-Air Updates Are Changing Modern Car Ownership", category: "Trends" },
  { id: 52, title: "The Rise of Autonomous Driving And Its Safety Features", category: "Trends" },
  { id: 53, title: "Vehicle-to-Everything Communication and The Future of Driving", category: "Trends" },
  { id: 54, title: "Understanding The Role of Big Data In Modern Vehicles", category: "Trends" }
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
    // Wait for 6 seconds between requests to respect the free tier rate limit.
    await new Promise(resolve => setTimeout(resolve, 6000));
    console.log(`- Processing topic: "${topic.title}"`);
    
    let articleData = {
        summary: "Could not load article summary.",
        content: "There was an error generating this article. Please try again later.",
    };
    let imageUrl = 'https://placehold.co/600x400.png';

    try {
        console.log(`  - Generating article content...`);
        const generatedData = await generateArticle({ topic: topic.title });
        if (generatedData) {
            articleData = generatedData;
        }
    } catch (e) {
        console.error(`  - Failed to generate article content for topic: ${topic.title}`, e);
        // Keep default error content if generation fails
    }

    try {
        console.log(`  - Fetching image...`);
        const fetchedImageUrl = await getImageForQuery(`${topic.title} ${topic.category}`);
        if(fetchedImageUrl) {
            imageUrl = fetchedImageUrl;
        }
    } catch(e) {
        console.error(`  - Failed to fetch image for topic: ${topic.title}`, e);
        // Keep default placeholder image if fetch fails
    }

    articles.push({
        id: topic.id,
        title: topic.title,
        category: topic.category,
        summary: articleData.summary,
        content: articleData.content,
        imageUrl,
        slug: `${slugify(topic.title)}-${topic.id}`
    });
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
  if (cachedArticles) {
    return cachedArticles;
  }
  
  try {
    const data = await fs.readFile(articlesFilePath, 'utf-8');
    const articles: Article[] = JSON.parse(data);
    
    // Check if the file is valid and doesn't contain errors
    if (articles && articles.length > 0) {
      const hasErrors = articles.some((a) => a.content.includes("error generating this article"));
      if (!hasErrors) {
        console.log("Loaded articles from valid and permanent file cache.");
        cachedArticles = articles;
        return cachedArticles;
      } else {
        console.log("Cache file contains errors. Will attempt to regenerate.");
      }
    }
  } catch (error) {
    // If file doesn't exist or there's an error reading/parsing it, we'll generate new ones.
    console.log("Article cache not found or is invalid. Generating new articles for the first time.");
  }

  // If we reach here, it means we need to generate articles.
  // This will now only happen if the cache is missing or corrupt.
  const newArticles = await generateAndCacheArticles();
  cachedArticles = newArticles;
  return newArticles;
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
