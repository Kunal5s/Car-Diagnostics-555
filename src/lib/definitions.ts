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

export interface Article {
  id: number;
  title: string;
  category: string;
  summary: string;
  content: string;
  imageUrl: string;
  slug: string;
}

export interface ArticleTopic {
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

export const allArticleTopics: ArticleTopic[] = [
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
