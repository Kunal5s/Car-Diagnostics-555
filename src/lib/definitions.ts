
import {
  Car,
  Cog,
  Fuel,
  Cpu,
  AlertTriangle,
  Smartphone,
  Wrench,
  Zap,
  type LucideIcon,
  BookMarked,
} from 'lucide-react';

export interface ArticleTopic {
  id: number;
  title: string;
  category: string;
}

export interface FullArticle extends ArticleTopic {
  slug: string;
  summary: string;
  content: string;
  imageUrl: string;
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
    color: 'bg-blue-600/10',
    iconColor: 'text-blue-600',
  },
  {
    name: 'Sensors',
    description: 'Automotive sensors & monitoring',
    icon: Cpu,
    href: '/category/sensors',
    color: 'bg-cyan-600/10',
    iconColor: 'text-cyan-600',
  },
  {
    name: 'OBD2',
    description: 'OBD2 diagnostics & scanning',
    icon: Wrench,
    href: '/category/obd2',
    color: 'bg-violet-600/10',
    iconColor: 'text-violet-600',
  },
  {
    name: 'Alerts',
    description: 'Warning systems & alerts',
    icon: AlertTriangle,
    href: '/category/alerts',
    color: 'bg-red-600/10',
    iconColor: 'text-red-600',
  },
  {
    name: 'Apps',
    description: 'Diagnostic mobile apps',
    icon: Smartphone,
    href: '/category/apps',
    color: 'bg-emerald-600/10',
    iconColor: 'text-emerald-600',
  },
  {
    name: 'Maintenance',
    description: 'Vehicle maintenance tips',
    icon: Cog,
    href: '/category/maintenance',
    color: 'bg-sky-600/10',
    iconColor: 'text-sky-600',
  },
  {
    name: 'Fuel',
    description: 'Fuel systems & efficiency',
    icon: Fuel,
    href: '/category/fuel',
    color: 'bg-orange-500/10',
    iconColor: 'text-orange-500',
  },
  {
    name: 'EVs',
    description: 'Electric vehicle technology',
    icon: Zap,
    href: '/category/evs',
    color: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
  },
  {
    name: 'Trends',
    description: 'Future of auto technology',
    icon: BookMarked,
    href: '/category/trends',
    color: 'bg-pink-500/10',
    iconColor: 'text-pink-500',
  }
];

export const categories = [
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

// This list provides all potential topics for the cron job to generate.
export const allArticleTopics: ArticleTopic[] = [
  // Engine
  { id: 1, title: "Diagnosing Common Car Engine Performance Issues For Beginners", category: "Engine" },
  { id: 2, title: "Your Step-by-Step Guide to Resolving Car Engine Overheating", category: "Engine" },
  { id: 3, title: "How to Know When to Replace Your Timing Belt", category: "Engine" },
  { id: 4, title: "Top Five Reasons Your Car's Check Engine Light Is On", category: "Engine" },
  { id: 5, title: "Advanced Turbocharger System Diagnostic Techniques For Modern Cars", category: "Engine" },
  // Sensors
  { id: 7, title: "A Complete Guide To Testing And Replacing Faulty Sensors", category: "Sensors" },
  { id: 8, title: "The Essential Role of Oxygen Sensors In Modern Vehicles", category: "Sensors" },
  { id: 9, title: "How to Clean Your Mass Airflow Sensor For Performance", category: "Sensors" },
  { id: 10, title: "Crankshaft and Camshaft Position Sensors And Engine Timing", category: "Sensors" },
  // OBD2
  { id: 13, title: "Top 10 Most Common OBD2 Codes and What They Mean", category: "OBD2" },
  { id: 14, title: "A Beginner's Guide to Using OBD2 Scanners Properly", category: "OBD2" },
  { id: 15, title: "Guide to Advanced OBD2 Live Data And Freeze Frame", category: "OBD2" },
  { id: 16, title: "How to Clear OBD2 Codes After A Car Repair", category: "OBD2" },
  // Alerts
  { id: 19, title: "What to Do When Your Dashboard Warning Lights On", category: "Alerts" },
  { id: 20, title: "Understanding Your Car's Most Important Dashboard Warning Alerts", category: "Alerts" },
  { id: 21, title: "Decoding Your Car's ABS And Traction Control Lights", category: "Alerts" },
  { id: 22, title: "Why Your Car's Battery And Alternator Lights Matter", category: "Alerts" },
  // Apps
  { id: 25, title: "Top Car Diagnostic Mobile Apps For Android And iOS", category: "Apps" },
  { id: 26, title: "How Modern Car Diagnostic Apps Can Save You Money", category: "Apps" },
  { id: 27, title: "Using Car Apps to Track Maintenance and Vehicle Health", category: "Apps" },
  { id: 28, title: "Comparing The Best Features of Modern Car Diagnostic Apps", category: "Apps" },
  // Maintenance
  { id: 31, title: "Essential DIY Car Maintenance Tips For Every Car Owner", category: "Maintenance" },
  { id: 32, title: "A Complete Seasonal Car Maintenance Checklist For Vehicles", category: "Maintenance" },
  { id: 33, title: "How to Check And Change Your Car's Essential Fluids", category: "Maintenance" },
  { id: 34, title: "The Importance of Regular Brake System Inspection Maintenance", category: "Maintenance" },
  // Fuel
  { id: 37, title: "Simple Ways to Maximize Your Car's Fuel Economy Now", category: "Fuel" },
  { id: 38, title: "Troubleshooting The Most Common Fuel System Problems Cars", category: "Fuel" },
  { id: 39, title: "How To Know If You Have A Clogged Filter", category: "Fuel" },
  { id: 40, title: "Understanding The Differences Between Gasoline Grades And Ratings", category: "Fuel" },
  // EVs
  { id: 43, title: "A Guide to Electric Vehicle Battery Health Maintenance", category: "EVs" },
  { id: 44, title: "Everything You Need to Know About EV Home Charging", category: "EVs" },
  { id: 45, title: "How Regenerative Braking Works In Modern Electric Vehicles", category: "EVs" },
  { id: 46, title: "Common Maintenance Tasks For Your New Electric Vehicle", category: "EVs" },
  // Trends
  { id: 49, title: "The Future of Automotive Technology and AI Car Diagnostics", category: "Trends" },
  { id: 50, "title": "Exploring Latest Innovations In Today's Connected Car Technologies", "category": "Trends" },
  { id: 51, "title": "How Over-the-Air Updates Are Changing Modern Car Ownership", "category": "Trends" },
  { id: 52, "title": "The Rise of Autonomous Driving And Its Safety Features", "category": "Trends" },
];
