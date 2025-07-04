import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ArticleGridSkeleton } from "@/components/article-grid-skeleton";
import { MotionWrapper } from "@/components/motion-wrapper";

export default function Loading() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "..." },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <MotionWrapper>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-3/4 lg:h-12 lg:w-1/2 mx-auto" />
          <Skeleton className="h-6 w-full max-w-2xl mx-auto mt-4" />
        </div>
      </MotionWrapper>
      <ArticleGridSkeleton />
    </div>
  );
}
