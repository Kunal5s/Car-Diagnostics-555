"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface CategoryNavProps {
  categories: string[];
}

export function CategoryNav({ categories }: CategoryNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = pathname.startsWith('/category/') ? pathname.split('/')[2] : 'All';

  return (
    <div className="border-b">
      <div className="container mx-auto">
        <nav className="-mb-px flex space-x-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {categories.map((category) => {
            const href =
              category === "All"
                ? `/${searchParams.size > 0 ? `?${searchParams.toString()}` : ''}`
                : `/category/${category.toLowerCase()}${searchParams.size > 0 ? `?${searchParams.toString()}` : ''}`;

            const isActive =
              currentCategory.toLowerCase() === category.toLowerCase();

            return (
              <Link href={href} key={category} passHref>
                <Button
                  variant="ghost"
                  className={cn(
                    "whitespace-nowrap rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium text-muted-foreground hover:text-primary",
                    isActive &&
                      "border-primary text-primary"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {category}
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
