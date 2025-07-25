"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface CategoryNavProps {
  categories: string[];
  className?: string;
}

export function CategoryNav({ categories, className }: CategoryNavProps) {
  const pathname = usePathname();

  const getActiveCategory = () => {
    if (pathname.startsWith('/category/')) {
        return pathname.split('/')[2] || '';
    }
    return ''; // No active category for non-category pages
  };

  const activeCategory = getActiveCategory();

  return (
    <nav className={cn("flex space-x-2 overflow-x-auto whitespace-nowrap scrollbar-hide py-3", className)}>
      {categories.map((category) => {
        const href = `/category/${category.toLowerCase()}`;
        const isActive = activeCategory === category.toLowerCase();

        return (
          <Link href={href} key={category} passHref>
            <Button
              variant={isActive ? "default" : "outline"}
              size="default"
              className={cn(
                "whitespace-nowrap rounded-lg shadow-sm",
                !isActive && "bg-card hover:bg-accent hover:text-accent-foreground"
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
