import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { CategoryInfo } from '@/lib/definitions';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  category: CategoryInfo;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const { name, description, icon: Icon, href, color, iconColor } = category;
  return (
    <Card className="group flex h-full flex-col text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card">
        <CardContent className="flex flex-grow flex-col items-center p-6">
            <div className={cn("mb-4 flex h-14 w-14 items-center justify-center rounded-lg", color)}>
                <Icon className={cn("h-7 w-7 transition-transform duration-300 group-hover:scale-110", iconColor)} />
            </div>
            <h3 className="mb-2 text-lg font-bold text-primary">{name}</h3>
            <p className="mb-4 flex-grow text-sm text-muted-foreground">{description}</p>
            <div className="mt-auto pt-4">
              <Button asChild variant="link" className="p-0 text-primary">
                  <Link href={href}>
                      Explore Articles <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
              </Button>
            </div>
        </CardContent>
    </Card>
  );
}
