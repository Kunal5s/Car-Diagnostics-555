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

export interface ArticleTopic {
  id: number;
  title: string;
  category: string;
}

export interface FullArticle extends ArticleTopic {
  summary: string;
  content: string;
  imageUrl: string;
  imageHint: string;
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
    color: 'bg-blue-600',
    iconColor: 'text-white',
  },
  {
    name: 'Sensors',
    description: 'Automotive sensors & monitoring',
    icon: Cpu,
    href: '/category/sensors',
    color: 'bg-cyan-600',
    iconColor: 'text-white',
  },
  {
    name: 'OBD2',
    description: 'OBD2 diagnostics & scanning',
    icon: Wrench,
    href: '/category/obd2',
    color: 'bg-violet-600',
    iconColor: 'text-white',
  },
  {
    name: 'Alerts',
    description: 'Warning systems & alerts',
    icon: AlertTriangle,
    href: '/category/alerts',
    color: 'bg-red-600',
    iconColor: 'text-white',
  },
  {
    name: 'Apps',
    description: 'Diagnostic mobile apps',
    icon: Smartphone,
    href: '/category/apps',
    color: 'bg-emerald-600',
    iconColor: 'text-white',
  },
  {
    name: 'Maintenance',
    description: 'Vehicle maintenance tips',
    icon: Cog,
    href: '/category/maintenance',
    color: 'bg-sky-600',
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
    color: 'bg-pink-600',
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
