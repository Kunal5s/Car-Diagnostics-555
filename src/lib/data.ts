import { slugify } from "./utils";
import { generateArticle } from "@/ai/flows/generate-article";
import { getImageForQuery } from "./pexels";
import { promises as fs } from 'fs';
import path from 'path';
import type { FullArticle } from './definitions';
import { differenceInHours } from 'date-fns';

interface ArticleTopic {
  id: number;
  title: string;
  category: string;
}

// 54 unique, 9-word topics (6 for each of the 9 categories)
const allArticleTopics: ArticleTopic[] = [
    // Engine (6)
    { id: 1, title: "Advanced Methods for Diagnosing Common Engine Performance Issues Today", category: "Engine" },
    { id: 2, title: "A Step-by-Step Guide for Safely Resolving Engine Overheating", category: "Engine" },
    { id: 3, title: "Understanding When to Replace Your Car's Critical Timing Belt", category: "Engine" },
    { id: 4, title: "The Top Five Reasons Your Car's Check Engine Light is On", category: "Engine" },
    { id: 5, title: "Modern Diagnostic Techniques for Advanced Turbocharger System Problems", category: "Engine" },
    { id: 6, title: "How to Troubleshoot and Fix Low Oil Pressure Problems", category: "Engine" },
    // Sensors (6)
    { id: 7, title: "Complete Guide to Testing and Replacing Faulty Automotive Sensors", category: "Sensors" },
    { id: 8, title: "Explaining the Essential Role of Oxygen Sensors in Vehicles", category: "Sensors" },
    { id: 9, title: "How to Properly Clean Your Mass Airflow Sensor", category: "Sensors" },
    { id: 10, title: "Understanding Crankshaft and Camshaft Sensors for Engine Timing", category: "Sensors" },
    { id: 11, title: "A Guide to Diagnosing Your Car's Tire Pressure Sensors", category: "Sensors" },
    { id: 12, title: "Why The Coolant Temperature Sensor Is Vital for Engines", category: "Sensors" },
    // OBD2 (6)
    { id: 13, title: "The Top 10 Most Common OBD2 Codes Explained", category: "OBD2" },
    { id: 14, title: "A Beginner's Guide to Using an OBD2 Scanner Correctly", category: "OBD2" },
    { id: 15, title: "Using Advanced OBD2 Live Data and Freeze Frame Diagnostics", category: "OBD2" },
    { id: 16, title: "How to Correctly Clear OBD2 Codes After a Repair", category: "OBD2" },
    { id: 17, title: "Using Bluetooth OBD2 Scanners with Your Smartphone for Diagnostics", category: "OBD2" },
    { id: 18, title: "Exploring OBD3: The Next Generation of On-Board Diagnostics", category: "OBD2" },
    // Alerts (6)
    { id: 19, title: "What to Do When Dashboard Warning Lights Come On", category: "Alerts" },
    { id: 20, title: "A Guide to Your Car's Most Important Warning Alerts", category: "Alerts" },
    { id: 21, title: "Decoding Your Vehicle's ABS And Traction Control System Lights", category: "Alerts" },
    { id: 22, title: "Why Your Car's Battery and Alternator Warning Lights Matter", category: "Alerts" },
    { id: 23, title: "The Critical Meaning Behind Your Vehicle's Oil Pressure Light", category: "Alerts" },
    { id: 24, title: "How You Should Respond to a Flashing Check Engine Light", category: "Alerts" },
    // Apps (6)
    { id: 25, title: "Reviewing Top Car Diagnostic Mobile Apps for Android, iOS", category: "Apps" },
    { id: 26, title: "How Modern Car Diagnostic Applications Can Save You Money", category: "Apps" },
    { id: 27, title: "Using Modern Apps to Track Maintenance and Vehicle Health", category: "Apps" },
    { id: 28, title: "A Comparison of the Best Car Diagnostic App Features", category: "Apps" },
    { id: 29, title: "The Future of Car Diagnostics is in Your Pocket", category: "Apps" },
    { id: 30, title: "A Simple Guide to Connecting Your Car to Diagnostic Apps", category: "Apps" },
    // Maintenance (6)
    { id: 31, title: "Essential DIY Car Maintenance Tips for Every Car Owner", category: "Maintenance" },
    { id: 32, title: "A Seasonal Car Maintenance Checklist for Your Vehicle Today", category: "Maintenance" },
    { id: 33, title: "How to Properly Check and Change Your Car's Fluids", category: "Maintenance" },
    { id: 34, title: "The Importance of Regular Brake System Inspection and Maintenance", category: "Maintenance" },
    { id: 35, title: "Simple Guide to Rotating Your Car's Tires for Longevity", category: "Maintenance" },
    { id: 36, title: "Knowing When and Why You Should Replace Your Car Battery", category: "Maintenance" },
    // Fuel (6)
    { id: 37, title: "Simple and Effective Ways to Maximize Your Car's Fuel Economy", category: "Fuel" },
    { id: 38, title: "Troubleshooting the Most Common Fuel System Problems in Cars", category: "Fuel" },
    { id: 39, title: "How to Easily Know If You Have a Clogged Fuel Filter", category: "Fuel" },
    { id: 40, title: "Understanding the Key Differences Between Various Gasoline Grades", category: "Fuel" },
    { id: 41, title: "The Critical Role of the Fuel Pump In Your Vehicle", category: "Fuel" },
    { id: 42, title: "Diagnosing a Malfunctioning or Failing Modern Day Fuel Injector", category: "Fuel" },
    // EVs (6)
    { id: 43, title: "A Complete Guide to Electric Vehicle Battery Health Maintenance", category: "EVs" },
    { id: 44, title: "Everything You Need to Know About EV Home Charging", category: "EVs" },
    { id: 45, title: "How Regenerative Braking Works In Modern Electric Vehicles Today", category: "EVs" },
    { id: 46, title: "Common and Important Maintenance Tasks For Your Electric Vehicle", category: "EVs" },
    { id: 47, title: "Understanding Electric Vehicle Range and How to Maximize It", category: "EVs" },
    { id: 48, title: "The Key Differences Between AC and DC Fast Charging", category: "EVs" },
    // Trends (6)
    { id: 49, title: "The Future of Automotive Technology and AI Car Diagnostics", category: "Trends" },
    { id: 50, title: "Exploring the Latest Innovations in Connected Car Technologies", category: "Trends" },
    { id: 51, title: "How Over-the-Air Updates Are Changing Modern Car Ownership", category: "Trends" },
    { id: 52, title: "The Inevitable Rise of Autonomous Driving and Its Safety", category: "Trends" },
    { id: 53, title: "Vehicle-to-Everything (V2X) Communication and the Future of Driving", category: "Trends" },
    { id: 54, title: "Understanding the Role of Big Data In Modern Vehicles", category: "Trends" },
];

const articlesFilePath = path.join(process.cwd(), 'src', 'lib', 'articles.json');
let cachedArticles: FullArticle[] | null = null;
let generationPromise: Promise<FullArticle[]> | null = null;
const CACHE_EXPIRATION_HOURS = 12;

async function generateAndCacheArticles(): Promise<FullArticle[]> {
  console.log("Generating 54 articles and fetching images. This may take a while...");

  const articles: FullArticle[] = [];
  for (const topic of allArticleTopics) {
    // Wait for 6 seconds between requests to respect potential free tier rate limits.
    await new Promise(resolve => setTimeout(resolve, 6000));
    console.log(`- Processing topic: "${topic.title}"`);
    
    let articleData = {
        summary: "Could not load article summary.",
        content: "There was an error generating this article. Please try again later.",
        imageHint: topic.category.toLowerCase(),
    };
    let imageUrl = 'https://placehold.co/600x400.png';

    try {
        console.log(`  - Generating article content for "${topic.title}"...`);
        const generatedData = await generateArticle({ topic: topic.title, category: topic.category });
        if (generatedData) {
            articleData = generatedData;
        }
    } catch (e) {
        console.error(`  - Failed to generate article content for topic: ${topic.title}`, e);
    }

    try {
        console.log(`  - Fetching image for hint: "${articleData.imageHint}"...`);
        const fetchedImageUrl = await getImageForQuery(articleData.imageHint);
        if(fetchedImageUrl) {
            imageUrl = fetchedImageUrl;
        }
    } catch(e) {
        console.error(`  - Failed to fetch image for topic: ${topic.title}`, e);
    }

    articles.push({
        id: topic.id,
        title: topic.title,
        category: topic.category,
        summary: articleData.summary,
        content: articleData.content,
        imageUrl,
        slug: `${slugify(topic.title)}-${topic.id}`,
        imageHint: articleData.imageHint,
    });
  }

  try {
    await fs.writeFile(articlesFilePath, JSON.stringify(articles, null, 2));
    console.log(`Saved ${articles.length} generated articles to cache file: ${articlesFilePath}`);
  } catch (error) {
    console.error("Failed to write articles cache file:", error);
  }
  
  console.log("Finished generating all articles and fetching images.");
  return articles;
}


async function loadArticles(): Promise<FullArticle[]> {
  try {
    const stats = await fs.stat(articlesFilePath);
    const fileAgeInHours = differenceInHours(new Date(), stats.mtime);
    
    if (fileAgeInHours < CACHE_EXPIRATION_HOURS) {
        const data = await fs.readFile(articlesFilePath, 'utf-8');
        const articles: FullArticle[] = JSON.parse(data);
        if (articles && articles.length > 0) {
            console.log(`Loaded ${articles.length} articles from fresh cache.`);
            cachedArticles = articles;
            return cachedArticles;
        }
    } else {
        console.log(`Cache is older than ${CACHE_EXPIRATION_HOURS} hours. Regenerating content.`);
    }
  } catch (error) {
    console.log("Article cache not found or is invalid. Generating new articles for the first time.");
  }

  const newArticles = await generateAndCacheArticles();
  cachedArticles = newArticles;
  return newArticles;
}

export async function getArticles(): Promise<FullArticle[]> {
  if (cachedArticles) {
    return cachedArticles;
  }
  
  if (!generationPromise) {
    generationPromise = loadArticles();
  }
  
  return generationPromise;
}

export async function getHomepageArticles(): Promise<FullArticle[]> {
  const articles = await getArticles();
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
