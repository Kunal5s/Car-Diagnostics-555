import {slugify} from './utils';
import {generateArticle} from '@/ai/flows/generate-article';
import {getImageForQuery} from './pexels';
import {promises as fs} from 'fs';
import path from 'path';
import type {FullArticle, ArticleTopic} from './definitions';

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


const articlesFilePath = path.join(process.cwd(), 'src', 'lib', 'articles.json');
let cachedArticles: FullArticle[] | null = null;
let generationPromise: Promise<FullArticle[]> | null = null;

const CACHE_DURATION_HOURS = 12;

async function generateAndCacheArticles(): Promise<FullArticle[]> {
  console.log('Starting to generate new articles and fetch images. This may take a few minutes...');

  const articles: FullArticle[] = [];
  for (const topic of allArticleTopics) {
    // Stagger API calls to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 6000));
    console.log(`- Processing topic: "${topic.title}"`);

    let articleData = {
      summary: 'Summary generation failed.',
      content: 'Could not generate the article content. Please check the Gemini API key and try again later.',
    };
    try {
      console.log('  - Generating article content with Gemini...');
      const generatedData = await generateArticle({topic: topic.title});
      if (generatedData) {
        articleData = generatedData;
      }
    } catch (e) {
      console.error(`  - ERROR: Failed to generate article for "${topic.title}"`, e);
    }
    
    let imageUrl = 'https://placehold.co/600x400.png';
    const imageHint = `${topic.category} technology`; // Create a more generic hint for better matches
    try {
        console.log(`  - Fetching image from Pexels with query: "${topic.title} ${topic.category}"`);
        const pexelsQuery = `${topic.title} ${topic.category}`;
        const fetchedImageUrl = await getImageForQuery(pexelsQuery);
        if (fetchedImageUrl) {
            imageUrl = fetchedImageUrl;
        }
    } catch (e) {
        console.error(`  - ERROR: Failed to fetch image for "${topic.title}"`, e);
    }
    

    articles.push({
      id: topic.id,
      title: topic.title,
      category: topic.category,
      summary: articleData.summary,
      content: articleData.content,
      slug: `${slugify(topic.title)}-${topic.id}`,
      imageUrl: imageUrl,
      imageHint: imageHint
    });
  }

  try {
    await fs.writeFile(articlesFilePath, JSON.stringify(articles, null, 2));
    console.log(`Successfully saved ${articles.length} articles to cache file: ${articlesFilePath}`);
  } catch (error) {
    console.error('Failed to write articles cache file:', error);
  }

  console.log('Finished generating and caching all articles.');
  return articles;
}

async function loadArticles(): Promise<FullArticle[]> {
  if (cachedArticles) {
    return cachedArticles;
  }

  if (!process.env.GOOGLE_API_KEY || !process.env.PEXELS_API_KEY) {
    console.error("API KEYS ARE MISSING. Please provide GOOGLE_API_KEY and PEXELS_API_KEY in your .env.local file. Cannot generate content.");
    // Try to load from cache even if keys are missing
    try {
        const data = await fs.readFile(articlesFilePath, 'utf-8');
        cachedArticles = JSON.parse(data);
        console.log("Loaded articles from cache file as API keys are missing.");
        return cachedArticles;
    } catch (error) {
        console.error("Could not load articles from cache, and API keys are missing. Returning empty array.");
        return [];
    }
  }

  try {
    const stats = await fs.stat(articlesFilePath);
    const lastModified = new Date(stats.mtime);
    const now = new Date();
    const hoursDiff = (now.getTime() - lastModified.getTime()) / (1000 * 60 * 60);

    if (hoursDiff < CACHE_DURATION_HOURS) {
      console.log(`Cache is fresh (less than ${CACHE_DURATION_HOURS} hours old). Loading articles from file.`);
      const data = await fs.readFile(articlesFilePath, 'utf-8');
      cachedArticles = JSON.parse(data);
      return cachedArticles;
    } else {
      console.log(`Cache is stale (older than ${CACHE_DURATION_HOURS} hours). Triggering regeneration.`);
    }
  } catch (error) {
    console.log('Article cache not found. Generating new articles for the first time.');
  }

  // If we reach here, cache is stale or doesn't exist. Regenerate.
  cachedArticles = await generateAndCacheArticles();
  return cachedArticles;
}

// Function to manage concurrent requests for article generation
export async function getArticles(): Promise<FullArticle[]> {
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
