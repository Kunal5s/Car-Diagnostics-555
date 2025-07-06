
'use server';

import type { FullArticle, ArticleTopic } from './definitions';
import { slugify } from "./utils";
import { generateArticle } from "@/ai/flows/generate-article";
import { supabase } from './supabase';
import { getImageForQuery } from './unsplash';

const allArticleTopics: Omit<ArticleTopic, 'slug'>[] = [
  { id: 1, title: "Advanced Methods for Diagnosing Common Engine Performance Issues Today", category: "Engine" },
  { id: 2, title: "A Step-by-Step Guide for Safely Resolving Engine Overheating", category: "Engine" },
  { id: 3, title: "Understanding When to Replace Your Car's Critical Timing Belt", category: "Engine" },
  { id: 4, title: "The Top Five Reasons Your Car's Check Engine Light is On", category: "Engine" },
  { id: 5, title: "Modern Diagnostic Techniques for Advanced Turbocharger System Problems", category: "Engine" },
  { id: 6, title: "Troubleshooting and Fixing Low Oil Pressure Problems in Your Vehicle", category: "Engine" },
  { id: 7, title: "A Complete Guide to Testing and Replacing Faulty Automotive Sensors", category: "Sensors" },
  { id: 8, title: "The Essential Role and Function of Oxygen Sensors in Modern Vehicles", category: "Sensors" },
  { id: 9, title: "How to Properly Clean Your Mass Airflow Sensor for Better Performance", category: "Sensors" },
  { id: 10, title: "The Relationship Between Crankshaft and Camshaft Position Sensors", category: "Sensors" },
  { id: 11, title: "A Guide to Diagnosing and Fixing Issues With Your Car's TPMS", category: "Sensors" },
  { id: 12, title: "The Critical Importance of a Functioning Coolant Temperature Sensor", category: "Sensors" },
  { id: 13, title: "The Top 10 Most Common OBD2 Diagnostic Codes and What They Mean", category: "OBD2" },
  { id: 14, title: "A Beginner's Guide to Using OBD2 Scanners for Car Diagnostics", category: "OBD2" },
  { id: 15, title: "A Guide to Using Advanced OBD2 Live Data and Freeze Frame Analysis", category: "OBD2" },
  { id: 16, title: "The Proper Procedure for How to Clear OBD2 Codes After a Car Repair", category: "OBD2" },
  { id: 17, title: "Using Modern Bluetooth OBD2 Scanners With Your Smartphone", category: "OBD2" },
  { id: 18, title: "What is OBD3 and How Will It Change Car Diagnostics in the Future?", category: "OBD2" },
  { id: 19, title: "What to Do When Your Car's Dashboard Warning Lights Come On", category: "Alerts" },
  { id: 20, title: "A Deep Dive into Your Car's Most Important Dashboard Warning Alerts", category: "Alerts" },
  { id: 21, title: "A Detailed Guide to Decoding Your Car's ABS and Traction Control Lights", category: "Alerts" },
  { id: 22, title: "A Guide to Understanding Why Your Car's Battery and Alternator Lights Matter", category: "Alerts" },
  { id: 23, title: "A Guide to Understanding the Meaning Behind Your Vehicle's Oil Pressure Light", category: "Alerts" },
  { id: 24, title: "A Driver's Guide on How to Respond to a Flashing Check Engine Light", category: "Alerts" },
  { id: 25, title: "A Guide to the Top Car Diagnostic Mobile Apps for Android and iOS", category: "Apps" },
  { id: 26, title: "A Guide to How Modern Car Diagnostic Apps Can Save You Money", category: "Apps" },
  { id: 27, title: "A Guide to Using Car Apps to Track Maintenance and Vehicle Health", category: "Apps" },
  { id: 28, title: "A Comparison of the Best Features of Modern Car Diagnostic Apps", category: "Apps" },
  { id: 29, title: "The Future of Car Diagnostics is in Your Pocket: Trends and Innovations", category: "Apps" },
  { id: 30, title: "A Step-by-Step Guide on How to Connect Your Car to a Diagnostic App", category: "Apps" },
  { id: 31, title: "A Guide to Essential DIY Car Maintenance Tips for Every Car Owner", category: "Maintenance" },
  { id: 32, title: "A Complete Seasonal Car Maintenance Checklist for Modern Vehicles", category: "Maintenance" },
  { id: 33, title: "A Guide to How to Check and Change Your Car's Essential Fluids", category: "Maintenance" },
  { id: 34, title: "A Guide to the Importance of Regular Brake System Inspection Maintenance", category: "Maintenance" },
  { id: 35, title: "A Guide to Rotating Your Car's Tires for Maximum Longevity", category: "Maintenance" },
  { id: 36, title: "A Guide to Knowing When and Why You Should Replace Your Car's Battery", category: "Maintenance" },
  { id: 37, title: "A Guide to Simple Ways to Maximize Your Car's Fuel Economy", category: "Fuel" },
  { id: 38, title: "A Guide to Troubleshooting the Most Common Fuel System Problems in Cars", category: "Fuel" },
  { id: 39, title: "An Essential Guide on How to Know if You Have a Clogged Fuel Filter", category: "Fuel" },
  { id: 40, title: "A Guide to Understanding the Differences Between Gasoline Grades and Octane Ratings", category: "Fuel" },
  { id: 41, title: "A Guide to Understanding the Role of the Fuel Pump in Your Vehicle", category: "Fuel" },
  { id: 42, title: "A Guide to Diagnosing a Malfunctioning or Failing Modern Fuel Injector", category: "Fuel" },
  { id: 43, title: "A Complete Guide to Electric Vehicle Battery Health Maintenance", category: "EVs" },
  { id: 44, title: "Everything You Need to Know About EV Home Charging", category: "EVs" },
  { id: 45, title: "How Regenerative Braking Works In Modern Electric Vehicles Today", category: "EVs" },
  { id: 46, title: "Common and Important Maintenance Tasks For Your Electric Vehicle", category: "EVs" },
  { id: 47, title: "Understanding Electric Vehicle Range and How to Maximise It", category: "EVs" },
  { id: 48, title: "The Key Differences Between AC and DC Fast Charging", category: "EVs" },
  { id: 49, title: "The Future of Automotive Technology and AI Car Diagnostics", category: "Trends" },
  { id: 50, title: "Exploring the Latest Innovations in Connected Car Technologies", category: "Trends" },
  { id: 51, title: "How Over-the-Air Updates Are Changing Modern Car Ownership", category: "Trends" },
  { id: 52, title: "The Inevitable Rise of Autonomous Driving and Its Safety", category: "Trends" },
  { id: 53, title: "Vehicle-to-Everything (V2X) Communication and the Future of Driving", category: "Trends" },
  { id: 54, title: "Understanding the Role of Big Data In Modern Vehicles", category: "Trends" }
];

const topicsWithSlugs: ArticleTopic[] = allArticleTopics.map(topic => ({
  ...topic,
  slug: `${slugify(topic.title)}-${topic.id}`
}));

function seededShuffle(array: any[], seed: number) {
  let currentIndex = array.length, temporaryValue, randomIndex;
  const random = () => {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
  while (0 !== currentIndex) {
    randomIndex = Math.floor(random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

export async function getAllTopics(): Promise<ArticleTopic[]> {
  return topicsWithSlugs;
}

export async function getHomepageTopics(): Promise<ArticleTopic[]> {
  const now = new Date();
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  const shuffledTopics = seededShuffle([...topicsWithSlugs], seed);
  return shuffledTopics.slice(0, 6);
}

export async function getTopicsByCategory(categoryName: string): Promise<ArticleTopic[]> {
  const lowerCategoryName = categoryName.toLowerCase();
  return topicsWithSlugs.filter(topic => topic.category.toLowerCase() === lowerCategoryName);
}
  
export async function getArticleBySlug(slug: string): Promise<FullArticle | undefined> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      const { data: cachedArticle, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .gte('generated_at', today.toISOString())
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error("Supabase select error:", error);
      }
      
      if (cachedArticle) {
        console.log(`Serving article "${slug}" from Supabase cache.`);
        return cachedArticle as FullArticle;
      }
    } catch (e) {
      console.error("Error fetching from Supabase:", e);
    }
    
    console.log(`Cache miss for article "${slug}". Generating new article...`);
    
    const topicInfo = topicsWithSlugs.find(p => p.slug === slug);
    if (!topicInfo) {
      return undefined;
    }

    try {
      const generatedData = await generateArticle({ topic: topicInfo.title });
      
      let imageUrl: string | null = null;
      try {
        console.log(`Fetching image for article: "${topicInfo.title}"`);
        imageUrl = await getImageForQuery(topicInfo.title);
      } catch (e) {
        console.error(`Failed to fetch image for article "${topicInfo.title}"`, e);
      }
      
      const newArticle: FullArticle = {
        ...topicInfo,
        summary: generatedData.summary,
        content: generatedData.content,
        imageUrl: imageUrl || `https://placehold.co/1200x600/334155/ffffff?text=${encodeURIComponent(topicInfo.title)}`
      };

      try {
        const { id, ...articleToInsert } = newArticle;
        
        const { error: upsertError } = await supabase
          .from('articles')
          .upsert(
            { 
              ...articleToInsert,
              generated_at: new Date().toISOString(),
            },
            { onConflict: 'slug' } 
          );
        
        if (upsertError) {
          console.error("Supabase upsert error:", upsertError);
        } else {
          console.log(`Successfully cached article "${slug}" to Supabase.`);
        }
      } catch(e) {
        console.error("Error saving to Supabase:", e);
      }

      return newArticle;

    } catch (e) {
      console.error(`Failed to generate article for slug "${slug}". This is likely due to a missing or invalid GOOGLE_API_KEY.`, e);
      
      const errorArticle: FullArticle = {
        ...topicInfo,
        summary: "An error occurred while generating this article.",
        content: `# Article Generation Failed\n\nWe were unable to generate this article at this time. This is usually due to one of two reasons:\n\n1.  **Missing API Key:** The \`GOOGLE_API_KEY\` has not been set up on the hosting environment.\n2.  **API Error:** There was a temporary issue with the generative AI service.\n\nPlease check your configuration in the README and try again later.`,
        imageUrl: `https://placehold.co/1200x600/f87171/ffffff?text=Generation+Error`
      };
      return errorArticle;
    }
}

export async function getAllArticles(): Promise<ArticleTopic[]> {
    return topicsWithSlugs;
}
