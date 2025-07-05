import { slugify } from "./utils";
import { generateArticle } from "@/ai/flows/generate-article";
import { getImageForQuery } from "./pexels";
import { promises as fs } from 'fs';
import path from 'path';
import type { FullArticle } from "./definitions";

const allArticleTopics = [
  { id: 1, title: "Diagnosing Common Car Engine Performance Issues", category: "Engine" },
  { id: 2, title: "Resolving Car Engine Overheating: A Step-by-Step Guide", category: "Engine" },
  { id: 3, title: "Understanding and Replacing Your Car's Timing Belt", category: "Engine" },
  { id: 4, title: "The Top 5 Reasons Your Check Engine Light is On", category: "Engine" },
  { id: 5, title: "A Guide to Turbocharger Systems and Potential Failures", category: "Engine" },
  { id: 6, title: "How to Troubleshoot Low Oil Pressure in Your Vehicle", category: "Engine" },
  { id: 7, title: "Testing And Replacing Faulty Automotive Sensors", category: "Sensors" },
  { id: 8, title: "The Role of Oxygen Sensors in Modern Vehicles", category: "Sensors" },
  { id: 9, title: "How to Clean Your Mass Airflow Sensor for Better Performance", category: "Sensors" },
  { id: 10, title: "Understanding Crankshaft and Camshaft Position Sensors", category: "Sensors" },
  { id: 11, title: "Diagnosing and Fixing Tire Pressure Monitoring System (TPMS) Issues", category: "Sensors" },
  { id: 12, title: "Why You Shouldn't Ignore a Faulty Coolant Temperature Sensor", category: "Sensors" },
  { id: 13, title: "Top 10 Most Common OBD2 Codes and What They Mean", category: "OBD2" },
  { id: 14, title: "A Beginner's Guide to Using an OBD2 Scanner", category: "OBD2" },
  { id: 15, title: "Understanding OBD2 Live Data and Freeze Frame Information", category: "OBD2" },
  { id: 16, title: "How to Properly Clear OBD2 Codes After a Repair", category: "OBD2" },
  { id: 17, title: "The Best Bluetooth OBD2 Scanners for Your Smartphone", category: "OBD2" },
  { id: 18, title: "What is OBD3 and How Will It Change Vehicle Diagnostics?", category: "OBD2" },
  { id: 19, title: "What to Do When Your Dashboard Lights Up Like a Christmas Tree", category: "Alerts" },
  { id: 20, title: "A Guide to Your Car's Most Important Dashboard Warning Lights", category: "Alerts" },
  { id: 21, title: "Decoding Your ABS and Traction Control Warning Lights", category: "Alerts" },
  { id: 22, title: "Why Your Car's Battery and Alternator Lights Are Important", category: "Alerts" },
  { id: 23, title: "The Meaning Behind a Blinking Oil Pressure Light", category: "Alerts" },
  { id: 24, title: "How to React When the Check Engine Light Starts Flashing", category: "Alerts" },
  { id: 25, title: "The Top Car Diagnostic Apps for Android and iOS", category: "Apps" },
  { id: 26, title: "How Car Diagnostic Apps Can Save You Money on Repairs", category: "Apps" },
  { id: 27, title: "Using Apps to Track Your Vehicle Maintenance Schedule", category: "Apps" },
  { id: 28, title: "A Comparison of the Best Features in Car Diagnostic Apps", category: "Apps" },
  { id: 29, "title": "The Future of Car Diagnostics is in Your Pocket", "category": "Apps" },
  { id: 30, "title": "How to Connect Your Car to a Diagnostic App: A Simple Guide", "category": "Apps" },
  { id: 31, "title": "Essential DIY Car Maintenance Tips for Every Owner", "category": "Maintenance" },
  { id: 32, "title": "A Complete Seasonal Car Maintenance Checklist", "category": "Maintenance" },
  { id: 33, "title": "How to Check and Change Your Car's Essential Fluids", "category": "Maintenance" },
  { id: 34, "title": "The Importance of Regular Brake System Inspections", "category": "Maintenance" },
  { id: 35, "title": "A Simple Guide to Rotating Your Tires for Longer Life", "category": "Maintenance" },
  { id: 36, "title": "When and Why You Should Replace Your Car's Battery", "category": "Maintenance" },
  { id: 37, "title": "Easy Ways to Maximize Your Car's Fuel Economy", "category": "Fuel" },
  { id: 38, "title": "Troubleshooting Common Fuel System Problems", "category": "Fuel" },
  { id: 39, "title": "How to Know If You Have a Clogged Fuel Filter", "category": "Fuel" },
  { id: 40, "title": "Understanding the Differences Between Gasoline Grades", "category": "Fuel" },
  { id: 41, "title": "The Role of the Fuel Pump in Your Vehicle", "category": "Fuel" },
  { id: 42, "title": "Diagnosing a Malfunctioning Fuel Injector", "category": "Fuel" },
  { id: 43, "title": "A Guide to Electric Vehicle (EV) Battery Health and Maintenance", "category": "EVs" },
  { id: 44, "title": "Everything You Need to Know About EV Charging at Home", "category": "EVs" },
  { id: 45, "title": "How Regenerative Braking Works in Electric Vehicles", "category": "EVs" },
  { id: 46, "title": "Common Maintenance Tasks for Your Electric Vehicle", "category": "EVs" },
  { id: 47, "title": "Understanding EV Range and How to Maximize It", "category": "EVs" },
  { id: 48, "title": "The Difference Between AC and DC Fast Charging", "category": "EVs" },
  { id: 49, "title": "The Future of Automotive Technology: AI Diagnostics", "category": "Trends" },
  { id: 50, "title": "Exploring the Latest Innovations in Connected Car Technology", "category": "Trends" },
  { id: 51, "title": "How Over-the-Air (OTA) Updates Are Changing Car Ownership", "category": "Trends" },
  { id: 52, "title": "The Rise of Autonomous Driving and Its Safety Features", "category": "Trends" },
  { id: 53, "title": "Vehicle-to-Everything (V2X) Communication Explained", "category": "Trends" },
  { id: 54, "title": "The Role of Big Data in the Modern Automotive Industry", "category": "Trends" }
];


const articleTopicsToGenerate = allArticleTopics; 

const articlesFilePath = path.join(process.cwd(), 'src', 'lib', 'articles.json');
let cachedArticles: FullArticle[] | null = null;
let generationPromise: Promise<FullArticle[]> | null = null;

async function generateAndCacheArticles(): Promise<FullArticle[]> {
  const googleApiKey = process.env.GOOGLE_API_KEY;
  const pexelsApiKey = process.env.PEXELS_API_KEY;

  if (!googleApiKey || !pexelsApiKey) {
    const errorMsg = "Required API keys are not set in environment variables. Please create a .env.local file and set GOOGLE_API_KEY and PEXELS_API_KEY.";
    console.error(errorMsg);
    return [{
      id: 0,
      title: "Configuration Error",
      category: "Alerts",
      slug: "configuration-error",
      content: `# Configuration Error\n\n${errorMsg}\n\nPlease refer to the Setup page for instructions.`,
      summary: errorMsg,
      imageUrl: 'https://placehold.co/600x400.png',
      imageHint: 'error'
    }];
  }

  console.log("Generating new articles and fetching images. This may take a while...");
  const generatedArticles: FullArticle[] = [];

  for (const topic of articleTopicsToGenerate) {
    // Stagger API calls to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`- Processing topic: "${topic.title}"`);
    
    let articleContent = {
        summary: "Could not generate article summary.",
        content: `# ${topic.title}\n\nThere was an error generating this article. Please check the server logs.`,
    };
    let imageUrl = 'https://placehold.co/600x400.png';
    let imageHint = topic.category.toLowerCase();

    try {
        console.log(`  - Generating article content...`);
        const generatedData = await generateArticle({ topic: topic.title });
        if (generatedData) {
            articleContent = generatedData;
        }
    } catch (e) {
        console.error(`  - Failed to generate article content for topic: ${topic.title}`, e);
    }

    try {
        const imageQuery = `${topic.title} ${topic.category} car diagnostics`;
        console.log(`  - Fetching image from Pexels with query: "${imageQuery}"`);
        const fetchedImageUrl = await getImageForQuery(imageQuery);
        if (fetchedImageUrl) {
            imageUrl = fetchedImageUrl;
        } else {
             console.warn(`  - Using placeholder image for: "${topic.title}"`);
        }
    } catch(e) {
        console.error(`  - Failed to fetch image for topic: ${topic.title}`, e);
    }
    
    const slug = `${slugify(topic.title)}-${topic.id}`;

    generatedArticles.push({
      id: topic.id,
      title: topic.title,
      category: topic.category,
      summary: articleContent.summary,
      content: articleContent.content,
      imageUrl,
      imageHint,
      slug,
    });
  }

  try {
    await fs.writeFile(articlesFilePath, JSON.stringify(generatedArticles, null, 2));
    console.log(`Successfully saved ${generatedArticles.length} generated articles to cache file: ${articlesFilePath}`);
  } catch (error) {
    console.error("Fatal error: Failed to write articles cache file:", error);
  }
  
  return generatedArticles;
}

async function loadArticles(): Promise<FullArticle[]> {
  if (cachedArticles) {
    return cachedArticles;
  }
  
  try {
    const data = await fs.readFile(articlesFilePath, 'utf-8');
    const articlesFromFile: FullArticle[] = JSON.parse(data);
    
    if (articlesFromFile && articlesFromFile.length > 0) {
      console.log(`Loaded ${articlesFromFile.length} articles from file cache.`);
      cachedArticles = articlesFromFile;
      return cachedArticles;
    }
  } catch (error) {
    console.log("Article cache not found or is invalid. Will attempt to generate new content.");
  }

  const newArticles = await generateAndCacheArticles();
  cachedArticles = newArticles;
  return newArticles;
}

let articlesPromise: Promise<FullArticle[]> | null = null;

export async function getArticles(): Promise<FullArticle[]> {
  if (!articlesPromise) {
    articlesPromise = loadArticles();
  }
  return articlesPromise;
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
