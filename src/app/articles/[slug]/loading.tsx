import { TrendingUp } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col items-center justify-center text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full bg-primary/10 p-4 text-primary">
          <TrendingUp className="h-10 w-10 animate-pulse" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-primary md:text-3xl">
          Loading Fresh Article
        </h1>
        <p className="max-w-md text-muted-foreground">
          Our AI is writing a unique, high-quality article just for you. This might take a few seconds...
        </p>
      </div>
    </div>
  );
}
