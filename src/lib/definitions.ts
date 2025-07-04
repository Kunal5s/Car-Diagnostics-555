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
import { slugify } from './utils';

export interface Article {
  id: number;
  title: string;
  category: string;
  summary: string;
  content: string;
  imageUrl: string;
  slug: string;
  generatedAt?: number;
}

export interface ArticleTopic {
  id: number;
  title: string;
  category: string;
  slug: string;
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

const topics: Omit<ArticleTopic, 'slug'>[] = [
  // Engine (6 articles)
  { id: 1, title: "Resolving Common Engine Performance Issues in Modern Vehicles", category: "Engine" },
  { id: 2, title: "A Comprehensive Guide to Fixing an Overheating Engine", category: "Engine" },
  { id: 3, title: "Understanding the Importance of Regular Timing Belt Replacement", category: "Engine" },
  { id: 4, title: "What to Do When Your Check Engine Light Appears", category: "Engine" },
  { id: 5, title: "Advanced Diagnostic Techniques for Modern Turbocharger Systems", category: "Engine" },
  { id: 6, title: "How to Troubleshoot and Fix Low Engine Oil Pressure", category: "Engine" },
  // Sensors (6 articles)
  { id: 7, title: "A Complete Guide to Testing and Replacing Automotive Sensors", category: "Sensors" },
  { id: 8, title: "The Critical Role of Oxygen Sensors in Fuel Efficiency", category: "Sensors" },
  { id: 9, title: "Improving Engine Performance by Cleaning the Mass Airflow Sensor", category: "Sensors" },
  { id: 10, title: "Diagnosing Faulty Crankshaft and Camshaft Position Sensors", category: "Sensors" },
  { id: 11, title: "How to Address Common Issues in Tire Pressure Monitoring", category: "Sensors" },
  { id: 12, title: "Why a Functioning Coolant Temperature Sensor is Essential", category: "Sensors" },
  // OBD2 (6 articles)
  { id: 13, title: "Decoding the Top Ten Most Common OBD2 Diagnostic Codes", category: "OBD2" },
  { id: 14, title: "How to Properly Use an OBD2 Scanner for Diagnostics", category: "OBD2" },
  { id: 15, title: "Analyzing Live Data with an Advanced OBD2 Scan Tool", category: "OBD2" },
  { id: 16, title: "The Correct Procedure for Clearing OBD2 Codes Post-Repair", category: "OBD2" },
  { id: 17, title: "Connecting Bluetooth OBD2 Scanners to Smartphone Applications", category: "OBD2" },
  { id: 18, title: "Exploring the Future of Automotive Diagnostics with OBD3", category: "OBD2" },
  // Alerts (6 articles)
  { id: 19, title: "A Guide to Understanding Your Dashboard Warning Lights", category: "Alerts" },
  { id: 20, title: "Interpreting Your Car's Most Important Warning System Alerts", category: "Alerts" },
  { id: 21, title: "Troubleshooting Your Vehicle's ABS and Traction Control Lights", category: "Alerts" },
  { id: 22, title: "What Your Car's Battery and Alternator Lights Indicate", category: "Alerts" },
  { id: 23, title: "The Serious Implications of the Oil Pressure Warning Light", category: "Alerts" },
  { id: 24, title: "Immediate Actions to Take for a Flashing Engine Light", category: "Alerts" },
  // Apps (6 articles)
  { id: 25, title: "Reviewing the Best Car Diagnostic Apps for Mobile Devices", category: "Apps" },
  { id: 26, title: "How Diagnostic Car Apps Can Help You Save Money", category: "Apps" },
  { id: 27, title: "Tracking Vehicle Health and Maintenance with Mobile Apps", category: "Apps" },
  { id: 28, title: "A Feature Comparison of Leading Car Diagnostic Applications", category: "Apps" },
  { id: 29, title: "The Evolution of Car Diagnostics Through Mobile Technology", category: "Apps" },
  { id: 30, title: "Step-by-Step Guide to Connecting Your Car with Apps", category: "Apps" },
  // Maintenance (6 articles)
  { id: 31, title: "Top DIY Car Maintenance Tasks for Every Vehicle Owner", category: "Maintenance" },
  { id: 32, title: "Your Ultimate Seasonal Car Maintenance and Inspection Checklist", category: "Maintenance" },
  { id: 33, title: "A Guide to Checking and Replacing Your Car's Fluids", category: "Maintenance" },
  { id: 34, title: "The Importance of Routine Brake System Inspection and Care", category: "Maintenance" },
  { id: 35, title: "How to Rotate Your Tires for Maximum Tread Life", category: "Maintenance" },
  { id: 36, title: "Knowing When It Is Time to Replace Your Battery", category: "Maintenance" },
  // Fuel (6 articles)
  { id: 37, title: "Effective Techniques for Maximizing Your Vehicle's Fuel Economy", category: "Fuel" },
  { id: 38, title: "A Guide to Troubleshooting Common Fuel System Issues", category: "Fuel" },
  { id: 39, title: "Signs and Symptoms of a Clogged Vehicle Fuel Filter", category: "Fuel" },
  { id: 40, title: "Understanding Gasoline Grades and Their Effect on Performance", category: "Fuel" },
  { id: 41, title: "The Function and Failure Signs of a Fuel Pump", category: "Fuel" },
  { id: 42, title: "Diagnosing and Cleaning Your Modern Vehicle's Fuel Injectors", category: "Fuel" },
  // EVs (6 articles)
  { id: 43, title: "Maximizing the Lifespan of Your Electric Vehicle's Battery", category: "EVs" },
  { id: 44, title: "A Complete Guide to Electric Vehicle Charging at Home", category: "EVs" },
  { id: 45, title: "How Regenerative Braking Improves Electric Vehicle Efficiency", category: "EVs" },
  { id: 46, title: "Essential Maintenance Differences for Electric vs. Gas Cars", category: "EVs" },
  { id: 47, title: "Understanding and Extending Your Electric Vehicle's Driving Range", category: "EVs" },
  { id: 48, title: "The Key Differences Between AC and DC EV Charging", category: "EVs" },
  // Trends (6 articles)
  { id: 49, title: "The Impact of AI on the Future of Diagnostics", category: "Trends" },
  { id: 50, title: "Exploring the Newest Innovations in Connected Car Technology", category: "Trends" },
  { id: 51, title: "How Over-the-Air Software Updates are Revolutionizing Cars", category: "Trends" },
  { id: 52, title: "The Advancement of Autonomous Driving and Safety Protocols", category: "Trends" },
  { id: 53, title: "How V2X Communication is Making Roads Safer for Everyone", category: "Trends" },
  { id: 54, title: "The Role of Big Data Analytics in Modern Vehicles", category: "Trends" }
];

export const allArticleTopics: ArticleTopic[] = topics.map(topic => ({
  ...topic,
  slug: `${slugify(topic.title)}-${topic.id}`
}));
