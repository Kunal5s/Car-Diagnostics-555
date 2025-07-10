
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
  // Engine (10 articles)
  { id: 1, title: "Diagnosing Common Car Engine Performance Issues For Beginners", category: "Engine" },
  { id: 2, title: "Your Step-by-Step Guide to Resolving Car Engine Overheating", category: "Engine" },
  { id: 3, title: "How to Know When to Replace Your Timing Belt", category: "Engine" },
  { id: 4, title: "Top Five Reasons Your Car's Check Engine Light Is On", category: "Engine" },
  { id: 5, title: "Advanced Turbocharger System Diagnostic Techniques For Modern Cars", category: "Engine" },
  { id: 6, title: "Troubleshooting Low Oil Pressure Problems In Your Vehicle", category: "Engine" },
  { id: 55, title: "Understanding Engine Sludge and How to Prevent It Properly", category: "Engine" },
  { id: 56, title: "A Detailed Guide to the PCV Valve System", category: "Engine" },
  { id: 57, title: "How to Perform a Cylinder Compression Test at Home", category: "Engine" },
  { id: 58, title: "The Importance of Your Engine's Serpentine Belt System", category: "Engine" },

  // Sensors (10 articles)
  { id: 7, title: "A Complete Guide To Testing And Replacing Faulty Sensors", category: "Sensors" },
  { id: 8, title: "The Essential Role of Oxygen Sensors In Modern Vehicles", category: "Sensors" },
  { id: 9, title: "How to Clean Your Mass Airflow Sensor For Performance", category: "Sensors" },
  { id: 10, title: "Crankshaft and Camshaft Position Sensors And Engine Timing", category: "Sensors" },
  { id: 11, title: "Diagnosing Issues With Your Car's Tire Pressure Sensors", category: "Sensors" },
  { id: 12, title: "The Importance of Functioning Coolant Temperature Sensor Today", category: "Sensors" },
  { id: 59, title: "How to Test a Throttle Position Sensor (TPS)", category: "Sensors" },
  { id: 60, title: "Understanding Knock Sensors and Their Role in Engine Health", category: "Sensors" },
  { id: 61, title: "Diagnosing a Faulty Manifold Absolute Pressure (MAP) Sensor", category: "Sensors" },
  { id: 62, title: "The Function of Wheel Speed Sensors in Safety Systems", category: "Sensors" },

  // OBD2 (10 articles)
  { id: 13, title: "Top 10 Most Common OBD2 Codes and What They Mean", category: "OBD2" },
  { id: 14, title: "A Beginner's Guide to Using OBD2 Scanners Properly", category: "OBD2" },
  { id: 15, title: "Guide to Advanced OBD2 Live Data And Freeze Frame", category: "OBD2" },
  { id: 16, title: "How to Clear OBD2 Codes After A Car Repair", category: "OBD2" },
  { id: 17, title: "Using Bluetooth OBD2 Scanners With Your Smartphone Apps", category: "OBD2" },
  { id: 18, title: "What is OBD3 And How Will It Change Diagnostics", category: "OBD2" },
  { id: 63, title: "Understanding OBD2 Readiness Monitors for Emissions Testing", category: "OBD2" },
  { id: 64, title: "How to Interpret Short and Long Term Fuel Trims", category: "OBD2" },
  { id: 65, title: "The Difference Between Generic and Manufacturer-Specific OBD2 Codes", category: "OBD2" },
  { id: 66, title: "Diagnosing EVAP System Leaks Using an OBD2 Scanner", category: "OBD2" },

  // Alerts (10 articles)
  { id: 19, title: "What to Do When Your Dashboard Warning Lights On", category: "Alerts" },
  { id: 20, title: "Understanding Your Car's Most Important Dashboard Warning Alerts", category: "Alerts" },
  { id: 21, title: "Decoding Your Car's ABS And Traction Control Lights", category: "Alerts" },
  { id: 22, title: "Why Your Car's Battery And Alternator Lights Matter", category: "Alerts" },
  { id: 23, title: "The Meaning Behind Your Vehicle's Oil Pressure Light", category: "Alerts" },
  { id: 24, title: "How to Respond to a Flashing Check Engine Light", category: "Alerts" },
  { id: 67, title: "What Your Car's Power Steering Warning Light Means", category: "Alerts" },
  { id: 68, title: "Understanding the Airbag (SRS) Warning Light on Dash", category: "Alerts" },
  { id: 69, title: "The Difference Between Service Engine and Check Engine Lights", category: "Alerts" },
  { id: 70, title: "Why You Should Never Ignore a Brake Warning Light", category: "Alerts" },

  // Apps (10 articles)
  { id: 25, title: "Top Car Diagnostic Mobile Apps For Android And iOS", category: "Apps" },
  { id: 26, title: "How Modern Car Diagnostic Apps Can Save You Money", category: "Apps" },
  { id: 27, title: "Using Car Apps to Track Maintenance and Vehicle Health", category: "Apps" },
  { id: 28, title: "Comparing The Best Features of Modern Car Diagnostic Apps", category: "Apps" },
  { id: 29, title: "The Future of Car Diagnostics Is In Your Pocket", category: "Apps" },
  { id: 30, title: "How to Connect Your Car to A Diagnostic App", category: "Apps" },
  { id: 71, title: "Using Diagnostic Apps to Customize Your Car's Hidden Features", category: "Apps" },
  { id: 72, title: "How AI is Making Car Diagnostic Apps Smarter", category: "Apps" },
  { id: 73, title: "The Security Risks of Using Wireless OBD2 Adapters", category: "Apps" },
  { id: 74, title: "How to Choose the Right OBD2 Adapter for You", category: "Apps" },

  // Maintenance (10 articles)
  { id: 31, title: "Essential DIY Car Maintenance Tips For Every Car Owner", category: "Maintenance" },
  { id: 32, title: "A Complete Seasonal Car Maintenance Checklist For Vehicles", category: "Maintenance" },
  { id: 33, title: "How to Check And Change Your Car's Essential Fluids", category: "Maintenance" },
  { id: 34, title: "The Importance of Regular Brake System Inspection Maintenance", category: "Maintenance" },
  { id: 35, title: "A Simple Guide to Rotating Your Tires For Longevity", category: "Maintenance" },
  { id: 36, title: "When And Why You Should Replace Your Car's Battery", category: "Maintenance" },
  { id: 75, title: "A Guide to Changing Your Own Spark Plugs", category: "Maintenance" },
  { id: 76, title: "How to Properly Detail Your Car's Interior at Home", category: "Maintenance" },
  { id: 77, title: "Understanding and Changing Your Car's Fuses For Dummies", category: "Maintenance" },
  { id: 78, title: "A Guide to Safely Jacking Up Your Vehicle", category: "Maintenance" },

  // Fuel (10 articles)
  { id: 37, title: "Simple Ways to Maximize Your Car's Fuel Economy Now", category: "Fuel" },
  { id: 38, title: "Troubleshooting The Most Common Fuel System Problems Cars", category: "Fuel" },
  { id: 39, title: "How To Know If You Have A Clogged Filter", category: "Fuel" },
  { id: 40, title: "Understanding The Differences Between Gasoline Grades And Ratings", category: "Fuel" },
  { id: 41, title: "The Role of The Fuel Pump In Your Vehicle", category: "Fuel" },
  { id: 42, title: "Diagnosing A Malfunctioning Or Failing Modern Fuel Injector", category: "Fuel" },
  { id: 79, title: "The Pros and Cons of Using Fuel System Cleaners", category: "Fuel" },
  { id: 80, title: "What is an EVAP System and How it Works", category: "Fuel" },
  { id: 81, title: "How to Diagnose and Fix a Fuel Gauge Problem", category: "Fuel" },
  { id: 82, title: "Why Your Car Smells Like Gas and What to Do", category: "Fuel" },

  // EVs (10 articles)
  { id: 43, title: "A Guide to Electric Vehicle Battery Health Maintenance", category: "EVs" },
  { id: 44, title: "Everything You Need to Know About EV Home Charging", category: "EVs" },
  { id: 45, title: "How Regenerative Braking Works In Modern Electric Vehicles", category: "EVs" },
  { id: 46, title: "Common Maintenance Tasks For Your New Electric Vehicle", category: "EVs" },
  { id: 47, title: "Understanding EV Range And How to Maximize It Now", category: "EVs" },
  { id: 48, title: "The Differences Between AC And DC Fast Charging Explained", category: "EVs" },
  { id: 83, title: "Understanding EV Charging Speeds and Different Connector Types", category: "EVs" },
  { id: 84, title: "How EV Battery Preconditioning Works in Cold Weather", category: "EVs" },
  { id: 85, title: "The Lifespan of an Electric Vehicle Battery Explained", category: "EVs" },
  { id: 86, title: "What to Know Before Buying a Used Electric Vehicle", category: "EVs" },

  // Trends (10 articles)
  { id: 49, title: "The Future of Automotive Technology and AI Car Diagnostics", category: "Trends" },
  { id: 50, "title": "Exploring Latest Innovations In Today's Connected Car Technologies", "category": "Trends" },
  { id: 51, "title": "How Over-the-Air Updates Are Changing Modern Car Ownership", "category": "Trends" },
  { id: 52, "title": "The Rise of Autonomous Driving And Its Safety Features", "category": "Trends" },
  { id: 53, "title": "Vehicle-to-Everything Communication and The Future of Driving", category: "Trends" },
  { id: 54, "title": "Understanding The Role of Big Data In Modern Vehicles", category: "Trends" },
  { id: 87, title: "The Impact of AI on the Future of Car Manufacturing", category: "Trends" },
  { id: 88, title: "The Rise of Subscription Services in Modern Vehicles", category: "Trends" },
  { id: 89, title: "Understanding the Software-Defined Vehicle (SDV) of the Future", category: "Trends" },
  { id: 90, title: "How Augmented Reality will Change Automotive Repair Forever", category: "Trends" }
];
