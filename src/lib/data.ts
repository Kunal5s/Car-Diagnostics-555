import { slugify } from "./utils";
import {
  Car,
  Cog,
  Fuel,
  Cpu,
  AlertTriangle,
  Smartphone,
  Wrench,
  Zap,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import { generateArticle } from "@/ai/flows/generate-article";
import { getImageForQuery } from "./pexels";

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

export interface CategoryInfo {
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: string;
  iconColor: string;
}

export const categoryDetails: CategoryInfo[] = [
  {
    name: 'Engine',
    description: 'Engine diagnostics & performance',
    icon: Car,
    href: '/category/engine',
    color: 'bg-green-500',
    iconColor: 'text-white',
  },
  {
    name: 'Sensors',
    description: 'Automotive sensors & monitoring',
    icon: Cpu,
    href: '/category/sensors',
    color: 'bg-blue-500',
    iconColor: 'text-white',
  },
  {
    name: 'OBD2',
    description: 'OBD2 diagnostics & scanning',
    icon: Wrench,
    href: '/category/obd2',
    color: 'bg-purple-500',
    iconColor: 'text-white',
  },
  {
    name: 'Alerts',
    description: 'Warning systems & alerts',
    icon: AlertTriangle,
    href: '/category/alerts',
    color: 'bg-red-500',
    iconColor: 'text-white',
  },
  {
    name: 'Apps',
    description: 'Diagnostic mobile apps',
    icon: Smartphone,
    href: '/category/apps',
    color: 'bg-indigo-500',
    iconColor: 'text-white',
  },
  {
    name: 'Maintenance',
    description: 'Vehicle maintenance tips',
    icon: Cog,
    href: '/category/maintenance',
    color: 'bg-teal-500',
    iconColor: 'text-white',
  },
  {
    name: 'Fuel',
    description: 'Fuel systems & efficiency',
    icon: Fuel,
    href: '/category/fuel',
    color: 'bg-orange-500',
    iconColor: 'text-white',
  },
  {
    name: 'EVs',
    description: 'Electric vehicle technology',
    icon: Zap,
    href: '/category/evs',
    color: 'bg-amber-500',
    iconColor: 'text-white',
  },
  {
    name: 'Trends',
    description: 'Latest automotive trends',
    icon: TrendingUp,
    href: '/category/trends',
    color: 'bg-pink-500',
    iconColor: 'text-white',
  },
];

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
  { id: 21, title: "How Regenerative Braking Works In An Electric Vehicle System", category: "EVs" },
  { id: 16, title: "Advanced OBD2 Diagnostics: Understanding Live Data And Freeze Frame Information", category: "OBD2" },
];

let cachedArticles: Article[] | null = null;

export async function getArticles(): Promise<Article[]> {
  if (cachedArticles) {
    return cachedArticles;
  }

  console.log("Generating articles and fetching images for the first time...");

  const articles: Article[] = await Promise.all(
    articleTopics.map(async (topic) => {
      try {
        const [{ summary, content }, imageUrl] = await Promise.all([
          generateArticle({ topic: topic.title }),
          getImageForQuery(topic.category)
        ]);

        return {
          id: topic.id,
          title: topic.title,
          category: topic.category,
          summary,
          content,
          imageUrl,
          slug: `${slugify(topic.title)}-${topic.id}`
        };
      } catch (e) {
        console.error(`Failed to generate article for topic: ${topic.title}`, e);
        // Return a fallback article so the site doesn't crash
        return {
          id: topic.id,
          title: topic.title,
          category: topic.category,
          summary: "Could not load article summary.",
          content: "There was an error generating this article. Please try again later.",
          imageUrl: 'https://placehold.co/600x400.png',
          slug: `${slugify(topic.title)}-${topic.id}`
        };
      }
    })
  );

  cachedArticles = articles;
  console.log("Finished generating articles and fetching images.");
  return articles;
}


export const categories = [
  "All",
  "Engine",
  "Sensors",
  "OBD2",
  "Alerts",
  "Apps",
  "Maintenance",
  "Fuel",
  "EVs",
  "Trends",
];
