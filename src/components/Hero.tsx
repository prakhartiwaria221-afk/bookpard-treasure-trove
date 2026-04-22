import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Sparkles, Library, BookMarked, Star, TrendingUp, Shield, Truck } from "lucide-react";
import heroImage from "@/assets/hero-library.jpg";

export const Hero = () => {
  const scrollToBooks = () => {
    const booksSection = document.getElementById("books-section");
    booksSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-card to-muted min-h-[85vh] flex items-center">
      {/* Full-width background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Cozy Library"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/75 to-background/40 dark:from-background/98 dark:via-background/85 dark:to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Library Side Accents */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 book-spine-accent" />
      <div className="absolute right-0 top-0 bottom-0 w-1.5 book-spine-accent" />

      {/* Decorative Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-[10%] w-32 h-32 rounded-full bg-primary opacity-[0.08] blur-3xl animate-gentle-float" />
        <div className="absolute top-32 right-[15%] w-40 h-40 rounded-full bg-secondary opacity-[0.06] blur-3xl animate-gentle-float" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-20 left-[20%] w-28 h-28 rounded-full bg-accent opacity-[0.08] blur-3xl animate-gentle-float" style={{ animationDelay: "4s" }} />

        {/* Floating icons */}
        <BookOpen className="absolute top-16 left-[15%] h-6 w-6 text-primary animate-gentle-float opacity-20" />
        <Library className="absolute top-28 right-[20%] h-7 w-7 text-secondary animate-book-float opacity-15" />
        <Sparkles className="absolute bottom-32 right-[25%] h-5 w-5 text-secondary animate-gentle-float opacity-20" style={{ animationDelay: "0.5s" }} />
        <BookMarked className="absolute bottom-24 left-[10%] h-5 w-5 text-primary animate-sparkle opacity-15" />

        {/* Dust particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-secondary/40 animate-dust-float"
            style={{
              left: `${10 + i * 12}%`,
              animationDelay: `${i * 2.5}s`,
              animationDuration: `${12 + i * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-2xl space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 btn-vintage text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg">
            <Library className="h-4 w-4" />
            <span className="tracking-wide">📚 India's Trusted Book Store</span>
            <Sparkles className="h-4 w-4" />
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-playfair font-bold leading-tight tracking-tight">
            <span className="block mb-2 text-foreground">Discover Your Next</span>
            <span className="text-vintage-gradient">Great Read</span>
          </h1>

          {/* Ornamental Divider */}
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-16 bg-gradient-to-r from-primary to-secondary rounded" />
            <BookOpen className="h-5 w-5 text-secondary" />
            <div className="h-0.5 w-16 bg-gradient-to-r from-secondary to-primary rounded" />
          </div>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-lg font-inter leading-relaxed">
            Explore our curated collection of <span className="font-bold text-primary">timeless classics</span> and
            <span className="font-semibold text-secondary"> modern bestsellers</span>. Buy, sell & discover at <span className="font-bold text-accent">BookPard</span>.
          </p>

          {/* Feature highlights */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold border border-primary/30 backdrop-blur-sm">
              <Shield className="h-4 w-4" />
              Secure Payments
            </div>
            <div className="flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-semibold border border-secondary/30 backdrop-blur-sm">
              <Truck className="h-4 w-4" />
              Free Shipping
            </div>
            <div className="flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-semibold border border-accent/30 backdrop-blur-sm">
              <Star className="h-4 w-4" />
              Best Prices
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <Button
              size="lg"
              onClick={scrollToBooks}
              className="btn-vintage text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105 text-lg px-8 py-6"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Browse Collection
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.location.href = "/sell"}
              className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white transition-all duration-300 font-semibold text-lg px-8 py-6 backdrop-blur-sm"
            >
              Sell Your Books
            </Button>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap gap-8 pt-4">
            <div className="text-center">
              <p className="text-3xl font-playfair font-bold text-primary">1000+</p>
              <p className="text-xs text-muted-foreground tracking-wide">Books Available</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-playfair font-bold text-secondary">500+</p>
              <p className="text-xs text-muted-foreground tracking-wide">Happy Readers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-playfair font-bold text-accent">4.8★</p>
              <p className="text-xs text-muted-foreground tracking-wide">Average Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background via-background/80 to-transparent" />

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
    </section>
  );
};
