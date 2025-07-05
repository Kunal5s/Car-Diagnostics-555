import Link from "next/link";
import type { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArticleGrid } from "@/components/article-grid";
import { categoryDetails } from "@/lib/definitions";
import { CategoryCard } from "@/components/category-card";
import {
  Car,
  Truck,
  Zap,
  Caravan,
  ScanLine,
  Smartphone,
  ShieldCheck,
  Lightbulb,
  PlugZap,
  BrainCircuit,
  FileText,
  Wrench,
  ChevronRight,
  Star,
} from "lucide-react";
import { MotionWrapper } from "@/components/motion-wrapper";
import { MotionGrid } from "@/components/motion-grid";
import { getHomepageTopics } from "@/lib/data";


export const metadata: Metadata = {
  description: "Detect engine problems instantly with Car Diagnostics BrainAi. Get smart analysis, vehicle health reports, and expert-written articles on maintenance and repair.",
  keywords: ["AI car diagnostics", "OBD2 error codes", "engine fault scan", "vehicle health report", "car diagnostics tool", "Car Diagnostics BrainAi"],
};

const howItWorksSteps = [
  {
    icon: Smartphone,
    title: "Describe the Issue",
    description: "Use our AI chat to describe your car's symptoms in simple terms.",
  },
  {
    icon: BrainCircuit,
    title: "AI Analysis",
    description: "Our AI analyzes the problem and provides potential causes and solutions.",
  },
  {
    icon: FileText,
    title: "Instant Report",
    description: "Get a detailed, easy-to-understand vehicle health report in seconds.",
  },
  {
    icon: Wrench,
    title: "Explore Articles",
    description: "Browse our expert knowledge base for detailed guides and DIY tips.",
  },
];

const supportedVehicles = [
  { icon: Car, name: "SUVs & Sedans" },
  { icon: Truck, name: "Trucks" },
  { icon: Caravan, name: "Pickups" },
  { icon: Zap, name: "EVs" },
];

const features = [
  {
    icon: ScanLine,
    title: "AI Fault Scanning",
    description: "Our advanced AI goes beyond standard checks to find hidden problems.",
  },
  {
    icon: Smartphone,
    title: "Mobile-Friendly",
    description: "Access your diagnostics report anytime, anywhere, on any device.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Private",
    description: "Your vehicle data is encrypted and handled with utmost privacy.",
  },
  {
    icon: Lightbulb,
    title: "Smart Fixes",
    description: "Get cost estimates and DIY guides for recommended repairs.",
  },
  {
    icon: PlugZap,
    title: "OBD2 Compatibility",
    description: "Works with most cars manufactured after 1996.",
  },
];

const testimonials = [
  {
    name: "Sarah J.",
    review: "Car Diagnostics BrainAi helped me identify a sensor issue my mechanic missed. Saved me over $500 on needless repairs!",
    rating: 5,
  },
  {
    name: "Mike T.",
    review: "As someone who knows nothing about cars, Car Diagnostics BrainAi is a lifesaver. The reports are so easy to understand.",
    rating: 5,
  },
  {
    name: "Carlos R.",
    review: "I was quoted $1,000 for a repair. The AI found the real, much cheaper problem. This tool is a must-have for any car owner.",
    rating: 5,
  },
];

const faqItems = [
  {
    question: "What is Car Diagnostics BrainAi?",
    answer: "Car Diagnostics BrainAi is an intelligent tool that helps you diagnose vehicle problems quickly and accurately. It analyzes symptoms, explains complex fault codes in simple terms, and provides easy-to-understand reports and repair suggestions.",
  },
  {
    question: "How does the content get generated?",
    answer: "Our system uses advanced AI, powered by Google's Gemini models, to write detailed, expert-level articles on a wide range of automotive topics. We then use the Pexels API to automatically find a relevant, high-quality image for each article.",
  },
  {
    question: "Do I need special tools to use the site?",
    answer: "No tools are required to browse our extensive library of AI-generated articles. To enable the automatic content generation, you simply need to provide your own free API keys from Google and Pexels in the settings.",
  },
  {
    question: "Is my vehicle compatible?",
    answer: "Our knowledge base covers most cars, trucks, and SUVs manufactured after 1996, including gasoline, diesel, and electric vehicles. The information is designed to be broadly applicable.",
  },
  {
    question: "How accurate are the AI diagnostics articles?",
    answer: "Our AI uses a massive automotive database to generate highly accurate and helpful articles. It provides reliable insights to help you understand your car's health better, but should always be used as a guide alongside advice from a professional mechanic.",
  },
];


export default async function HomePage() {
  const trendingTopics = await getHomepageTopics();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <MotionWrapper>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
              AI Car Diagnostics Made Easy with BrainAi
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto mb-8">
              Detect engine problems instantly using artificial intelligence. Fast, reliable, and always available.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/blog">Explore Our Articles</Link>
            </Button>
          </MotionWrapper>
        </div>
      </section>

      {/* Trending Articles Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <MotionWrapper>
            <h2 className="mb-8 text-center text-3xl font-extrabold tracking-tight text-primary lg:text-4xl">
              From Our Knowledge Base
            </h2>
          </MotionWrapper>
          <ArticleGrid topics={trendingTopics} />
          <MotionWrapper className="text-center mt-8">
            <Button asChild variant="outline">
              <Link href="/blog">
                Explore All Articles <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </MotionWrapper>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
          <MotionWrapper className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">How It Works</h2>
            <p className="text-muted-foreground mt-2">A simple, 4-step process to a healthy car.</p>
          </MotionWrapper>
          <MotionGrid className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {howItWorksSteps.map((step) => (
              <div key={step.title} className="text-center flex flex-col items-center">
                <div className="bg-primary/10 text-primary rounded-full p-4 mb-4">
                  <step.icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            ))}
          </MotionGrid>
        </div>
      </section>
      
      {/* Explore Categories Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <MotionWrapper className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Explore Automotive Categories</h2>
            <p className="text-muted-foreground mt-2">Find articles and advice on specific car systems and topics.</p>
          </MotionWrapper>
          <MotionGrid className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {categoryDetails.map((category) => (
              <CategoryCard key={category.name} category={category} />
            ))}
          </MotionGrid>
        </div>
      </section>

      {/* Real-Time Error Code Example Section */}
      <MotionWrapper className="bg-secondary/50 py-12">
        <div className="container mx-auto px-4 text-center">
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2">Real-Time Error Code Diagnostics</p>
            <div className="bg-card inline-flex items-center gap-4 p-4 rounded-lg shadow-md border">
                <span className="font-mono text-destructive font-bold text-lg">P0171</span>
                <span className="text-foreground text-lg">System Too Lean (Bank 1)</span>
            </div>
        </div>
      </MotionWrapper>

      {/* Supported Vehicle Types */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <MotionWrapper className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Works With Your Vehicle</h2>
            <p className="text-muted-foreground mt-2">We support a wide range of vehicle types manufactured after 1996.</p>
          </MotionWrapper>
          <MotionGrid className="flex justify-center items-center gap-8 md:gap-16 flex-wrap">
            {supportedVehicles.map((vehicle) => (
              <div key={vehicle.name} className="flex flex-col items-center gap-2 text-muted-foreground">
                <vehicle.icon className="h-12 w-12" />
                <span className="font-medium">{vehicle.name}</span>
              </div>
            ))}
          </MotionGrid>
        </div>
      </section>

      {/* BrainAi Features Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <MotionWrapper className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Why Choose Car Diagnostics BrainAi?</h2>
            <p className="text-primary-foreground/80 mt-2">Unlock powerful features for complete peace of mind.</p>
          </MotionWrapper>
          <MotionGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-4">
                 <div className="bg-primary-foreground/20 rounded-lg p-3">
                    <feature.icon className="h-6 w-6" />
                 </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                  <p className="text-primary-foreground/80 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </MotionGrid>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <MotionWrapper className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Loved by Car Owners</h2>
            <p className="text-muted-foreground mt-2">See what our users are saying about BrainAi.</p>
          </MotionWrapper>
          <MotionGrid className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-foreground mb-4">"{testimonial.review}"</p>
                  <p className="font-semibold text-muted-foreground">- {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </MotionGrid>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-4 max-w-3xl">
          <MotionWrapper className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Frequently Asked Questions</h2>
          </MotionWrapper>
          <MotionWrapper>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item) => (
                <AccordionItem key={item.question} value={item.question}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </MotionWrapper>
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <MotionWrapper className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-2">Get Weekly Car Health Tips</h2>
          <p className="text-primary-foreground/80 mb-6">Join our newsletter for maintenance advice and product updates.</p>
          <form className="flex max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-card text-card-foreground rounded-r-none border-r-0"
              aria-label="Email for newsletter"
            />
            <Button type="submit" variant="secondary" className="rounded-l-none">
              Subscribe
            </Button>
          </form>
        </div>
      </MotionWrapper>
    </div>
  );
}
