import { slugify } from "./utils";
import { generateArticleAction } from '@/app/actions/generate-article';
import { generateImageAction } from '@/app/actions/generate-image';
import { promises as fs } from 'fs';
import path from 'path';
import { categories } from "./definitions";

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
// The system will generate 54 articles in total, 6 for each category.
const masterTopics: MasterTopic[] = [
    // Engine
    { id: 1, title: "Diagnosing Common Car Engine Performance Issues", category: "Engine" },
    { id: 2, title: "Resolving Car Engine Overheating: A Step-by-Step Guide", category: "Engine" },
    { id: 3, title: "Understanding and Replacing Your Car's Timing Belt", category: "Engine" },
    { id: 4, title: "The Top 5 Reasons Your Check Engine Light is On", category: "Engine" },
    { id: 5, title: "A Guide to Turbocharger Systems and Potential Failures", category: "Engine" },
    { id: 6, title: "How to Troubleshoot Low Oil Pressure in Your Vehicle", category: "Engine" },
    // Sensors
    { id: 7, title: "Testing And Replacing Faulty Automotive Sensors", category: "Sensors" },
    { id: 8, title: "The Role of Oxygen Sensors In Modern Vehicles", category: "Sensors" },
    { id: 9, title: "Cleaning Your Mass Airflow (MAF) Sensor for Better Performance", category: "Sensors" },
    { id: 10, title: "How Crankshaft and Camshaft Position Sensors Affect Engine Timing", category: "Sensors" },
    { id: 11, title: "Diagnosing a Faulty Coolant Temperature Sensor", category: "Sensors" },
    { id: 12, title: "Understanding Tire Pressure Monitoring Systems (TPMS)", category: "Sensors" },
    // OBD2
    { id: 13, title: "A Beginner's Guide to Using OBD2 Scanners", category: "OBD2" },
    { id: 14, title: "Understanding Advanced OBD2 Live Data For Diagnostics", category: "OBD2" },
    { id: 15, title: "The 10 Most Common OBD2 Codes and What They Mean", category: "OBD2" },
    { id: 16, title: "How to Use Freeze Frame Data from Your OBD2 Scanner", category: "OBD2" },
    { id: 17, title: "The Difference Between Generic and Manufacturer-Specific OBD2 Codes", category: "OBD2" },
    { id: 18, title: "What is OBD3 and How Will It Change Car Diagnostics?", category: "OBD2" },
    // Alerts
    { id: 19, title: "What to Do When Your Dashboard Warning Lights Come On", category: "Alerts" },
    { id: 20, title: "Decoding Your Car's ABS And Traction Control Warning Lights", category: "Alerts" },
    { id: 21, title: "Why Your Car's Battery and Alternator Lights are Important", category: "Alerts" },
    { id: 22, title: "The Meaning Behind a Flashing Check Engine Light", category: "Alerts" },
    { id: 23, title: "Understanding Your Vehicle's Oil Pressure Warning Light", category: "Alerts" },
    { id: 24, title: "How to Respond to a Low Tire Pressure (TPMS) Alert", category: "Alerts" },
    // Apps
    { id: 25, title: "How Car Diagnostic Apps Can Save You Money on Repairs", category: "Apps" },
    { id: 26, title: "The Best Features of Modern Car Diagnostic Apps", category: "Apps" },
    { id: 27, title: "Top Car Diagnostic Apps for iOS and Android in 2024", category: "Apps" },
    { id: 28, title: "Using Car Apps to Track Maintenance and Vehicle Health", category: "Apps" },
    { id: 29, title: "The Future of Car Diagnostics is in Your Pocket", category: "Apps" },
    { id: 30, title: "How to Connect Your Car to a Diagnostic App via Bluetooth", category: "Apps" },
    // Maintenance
    { id: 31, title: "Essential DIY Car Maintenance Tips For Every Owner", category: "Maintenance" },
    { id: 32, title: "A Complete Seasonal Car Maintenance Checklist", category: "Maintenance" },
    { id: 33, title: "How to Check And Change Your Car's Essential Fluids", category: "Maintenance" },
    { id: 34, title: "The Importance of Regular Brake System Inspection", category: "Maintenance" },
    { id: 35, title: "A Simple Guide to Rotating Your Tires for Longevity", category: "Maintenance" },
    { id: 36, title: "When And Why You Should Replace Your Car's Battery", category: "Maintenance" },
    // Fuel
    { id: 37, title: "Troubleshooting Common Fuel System Problems", category: "Fuel" },
    { id: 38, title: "How To Know If You Have A Clogged Fuel Filter", category: "Fuel" },
    { id: 39, title: "The Role of The Fuel Pump in Your Vehicle's Performance", category: "Fuel" },
    { id: 40, title: "Diagnosing A Malfunctioning Fuel Injector", category: "Fuel" },
    { id: 41, title: "Simple Ways to Maximize Your Car's Fuel Economy", category: "Fuel" },
    { id: 42, title: "Understanding Gasoline Grades And Octane Ratings", category: "Fuel" },
    // EVs
    { id: 43, title: "A Guide to Electric Vehicle Battery Health and Maintenance", category: "EVs" },
    { id: 44, title: "Regenerative Braking in Modern Electric Vehicles Explained", category: "EVs" },
    { id: 45, title: "Common Maintenance Tasks For Your Electric Vehicle", category: "EVs" },
    { id: 46, title: "Everything You Need to Know About EV Home Charging", category: "EVs" },
    { id: 47, title: "Understanding EV Range and How to Maximize It", category: "EVs" },
    { id: 48, title: "The Differences Between AC and DC Fast Charging", category: "EVs" },
    // Trends
    { id: 49, title: "The Future of Automotive Technology: AI Diagnostics", category: "Trends" },
    { id: 50, title: "How Over-the-Air Software Updates Are Changing Car Ownership", category: "Trends" },
    { id: 51, title: "Vehicle-to-Everything (V2X) Communication Explained", category: "Trends" },
    { id: 52, title: "The Rise of Autonomous Driving and Its Safety Features", category: "Trends" },
    { id: 53, title: "Exploring Innovations In Connected Car Technology", category: "Trends" },
    { id: 54, title: "Understanding The Role of Big Data In Modern Vehicles", category: "Trends" }
];

const articlesFilePath = path.join(process.cwd(), 'src', 'lib', 'articles.json');
let articleCache: Article[] | null = null;
let generationPromise: Promise<Article[]> | null = null;

async function generateAndCacheContent(): Promise<Article[]> {
  console.log("Generating a large pool of articles and fetching images for the first time. This may take a while...");

  if (!process.env.GOOGLE_API_KEY || !process.env.PEXELS_API_KEY) {
      throw new Error("Missing API keys. Please add GOOGLE_API_KEY and PEXELS_API_KEY to your .env file. See /settings for more info.");
  }
  
  const articles: Article[] = [];
  let generatedCount = 0;
  const totalToGenerate = masterTopics.length;
  // Limit to 20 requests per minute to stay within Gemini free tier.
  const delay = 60000 / 20;

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
    // Check if file contains a full set of 54 articles
    const parsedArticles: Article[] = JSON.parse(data);
    if (parsedArticles.length >= masterTopics.length) {
      console.log(`Loaded ${parsedArticles.length} articles from cache file.`);
      articleCache = parsedArticles;
      return articleCache;
    } else {
        console.log(`Cache file is incomplete (${parsedArticles.length}/${masterTopics.length}). Regenerating content.`);
    }
  } catch (error) {
    // File not found or is invalid, proceed to generation.
    console.log("Article cache not found or is empty. Starting content generation process.");
  }

  const newArticles = await generateAndCacheContent();
  articleCache = newArticles;
  return newArticles;
}

// This "promise lock" ensures that the generation process only runs once, even with concurrent requests.
async function getFullArticleSet(): Promise<Article[]> {
  if (!generationPromise) {
    generationPromise = loadArticles();
  }
  return generationPromise;
}

/**
 * Gets the current time slot of the day, from 0 to 4.
 * This is used to rotate content and simulate 5 refreshes per day.
 * @returns The current time slot (0-4).
 */
function getCurrentTimeSlot(): number {
    const hours = new Date().getUTCHours(); // Use UTC for global consistency
    return Math.floor(hours / (24 / 5)); // 24 hours / 5 slots
}

/**
 * Rotates an array to simulate fresh content.
 * @param arr The array to rotate.
 * @param count The number of positions to rotate.
 * @returns The rotated array.
 */
function rotateArray<T>(arr: T[], count: number): T[] {
    const rotation = count % arr.length;
    return [...arr.slice(rotation), ...arr.slice(0, rotation)];
}


export async function getArticles(): Promise<Article[]> {
  const allArticles = await getFullArticleSet();
  const slot = getCurrentTimeSlot();
  // Rotate the entire list for the /blog page to show a different order.
  return rotateArray(allArticles, slot * 6); // Rotate by a larger amount for variety
}

export async function getHomepageArticles(): Promise<Article[]> {
    const allArticles = await getFullArticleSet();
    const slot = getCurrentTimeSlot();
    const homepageArticles: Article[] = [];
  
    // Filter non-"All" categories
    const articleCategories = categories.filter(c => c !== "All");
  
    articleCategories.forEach(category => {
      // Get all articles for the current category
      const categoryArticles = allArticles.filter(a => a.category === category);
      
      if (categoryArticles.length > 0) {
        // Rotate the articles for this category based on the time slot
        const rotated = rotateArray(categoryArticles, slot);
        // Add the "freshest" article for this time slot to our homepage list
        homepageArticles.push(rotated[0]);
      }
    });
  
    return homepageArticles;
}

export async function getArticlesByCategory(categoryName: string): Promise<Article[]> {
    const allArticles = await getFullArticleSet();
    const lowerCategoryName = categoryName.toLowerCase();
    
    if (lowerCategoryName === 'all') {
      return getArticles(); // Return the time-rotated list for 'All'
    }
    
    const categoryArticles = allArticles.filter(article => article.category.toLowerCase() === lowerCategoryName);
    
    // For a specific category, rotate its articles based on the time slot to keep it fresh
    const slot = getCurrentTimeSlot();
    return rotateArray(categoryArticles, slot);
}
  
export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
    const allArticles = await getFullArticleSet();
    // Search the entire list regardless of time slot for direct link access
    return allArticles.find(article => article.slug === slug);
}
