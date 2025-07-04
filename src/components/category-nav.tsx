"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { categories } from "@/lib/definitions";

interface CategoryNavProps {
  categories: string[];
  className?: string;
}

export function CategoryNav({ categories, className }: CategoryNavProps) {
  const pathname = usePathname();

  const getActiveCategory = () => {
    if (pathname.startsWith('/category/')) {
        return pathname.split('/')[2] || 'all';
    }
    if (pathname === '/blog' || pathname === '/') {
        return 'all';
    }
    return 'all'; // Default to all for other pages like articles
  };

  const activeCategory = getActiveCategory();

  return (
    <nav className={cn("-mb-px flex space-x-2 overflow-x-auto whitespace-nowrap scrollbar-hide", className)}>
      {categories.map((category) => {
        const href =
          category === "All"
            ? `/blog`
            : `/category/${category.toLowerCase()}`;

        const isActive = activeCategory === category.toLowerCase();

        return (
          <Link href={href} key={category} passHref>
            <Button
              variant="ghost"
              className={cn(
                "whitespace-nowrap rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium text-muted-foreground hover:text-primary",
                isActive && "border-primary text-primary"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {category}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}
