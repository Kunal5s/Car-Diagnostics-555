import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface ArticleGridSkeletonProps {
    count?: number;
}

export function ArticleGridSkeleton({ count = 6 }: ArticleGridSkeletonProps) {
    return (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(count)].map((_, i) => (
                <Card key={i} className="flex h-full flex-col">
                    <CardHeader className="p-0">
                        <Skeleton className="h-48 w-full" />
                    </CardHeader>
                    <CardContent className="flex-grow p-6 space-y-3">
                        <Skeleton className="h-4 w-1/4" />
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-full" />
                          <Skeleton className="h-5 w-5/6" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                         <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                        <Skeleton className="h-5 w-24" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
