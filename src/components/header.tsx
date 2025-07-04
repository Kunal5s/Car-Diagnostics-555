import Link from "next/link";
import { Car } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Car className="h-6 w-6 text-primary" />
          <span className="font-bold">CarDiagnosticsBrainAI</span>
        </Link>
      </div>
    </header>
  );
}
