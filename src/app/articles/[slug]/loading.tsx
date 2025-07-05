import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumbs } from "@/components/breadcrumbs";

export default function Loading() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: 'Loading Article...' },
  ];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <article>
        <Breadcrumbs items={breadcrumbItems} />
        <header className="mb-8">
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-6 w-3/4" />
        </header>
        <Skeleton className="relative mb-8 h-64 w-full rounded-lg md:h-96" />
        <div className="space-y-6">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
            <br />
            <Skeleton className="h-8 w-1/2 mb-4" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
             <br />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/6" />
        </div>
      </article>
    </div>
  );
}
