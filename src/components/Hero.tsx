import { Button } from "@/components/ui/button";
import { ArrowRight, Sun } from "lucide-react";
import heroImage from "@/assets/hero-books.png";

export const Hero = () => {
  const scrollToBooks = () => {
    const booksSection = document.getElementById("books-section");
    booksSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-[var(--gradient-hero)]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating Kites */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`kite-${i}`}
            className="absolute animate-kite-sway"
            style={{
              left: `${10 + i * 15}%`,
              top: `${15 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.4}s`,
            }}
          >
            <svg
              width={24 + (i % 3) * 8}
              height={30 + (i % 3) * 10}
              viewBox="0 0 40 50"
              className="opacity-30"
              style={{
                fill: i % 4 === 0 ? 'hsl(var(--kite-red))' : 
                      i % 4 === 1 ? 'hsl(var(--kite-blue))' :
                      i % 4 === 2 ? 'hsl(var(--kite-green))' : 'hsl(var(--kite-purple))',
              }}
            >
              <path d="M20 0 L40 20 L20 50 L0 20 Z" />
            </svg>
          </div>
        ))}
        
        {/* Sun elements */}
        <Sun className="absolute top-10 left-[10%] h-8 w-8 text-sankranti-saffron/40 animate-sun-pulse" style={{ animationDelay: "0s" }} />
        <Sun className="absolute top-20 right-[15%] h-6 w-6 text-sun-glow/30 animate-sun-pulse" style={{ animationDelay: "0.5s" }} />
        <Sun className="absolute bottom-32 right-[20%] h-8 w-8 text-sankranti-yellow/40 animate-sun-pulse" style={{ animationDelay: "1s" }} />
        <Sun className="absolute bottom-20 left-[5%] h-5 w-5 text-sankranti-saffron/30 animate-sun-pulse" style={{ animationDelay: "1.5s" }} />
        
        {/* More floating kites */}
        <div className="absolute top-16 right-[8%] h-10 w-10 animate-gentle-float" style={{ animationDelay: "0.5s" }}>
          <svg viewBox="0 0 40 50" className="w-full h-full opacity-25" fill="hsl(var(--kite-pink))">
            <path d="M20 0 L40 20 L20 50 L0 20 Z" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6 animate-fade-in">
            {/* Sankranti Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-sankranti-saffron/20 to-sankranti-sky/20 backdrop-blur-sm text-foreground px-5 py-2.5 rounded-full text-sm font-semibold border border-sankranti-saffron/30 shadow-lg shadow-sankranti-saffron/10">
              <Sun className="h-4 w-4 text-sankranti-saffron animate-sun-pulse" />
              <span className="font-dancing text-base">🪁 Makar Sankranti 2026!</span>
              <div className="h-4 w-4 animate-kite-sway">
                <svg viewBox="0 0 16 20" className="w-full h-full" fill="hsl(var(--kite-red))">
                  <path d="M8 0L16 10L8 20L0 10L8 0Z" />
                </svg>
              </div>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-foreground leading-tight">
              <span className="block mb-2">Discover Your Next</span>
              <span className="text-gold-shimmer">Favorite Book</span>
            </h1>
            
            {/* Subheading */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg font-inter leading-relaxed">
              Celebrate Makar Sankranti with amazing deals! Buy new books, find treasures among used books, 
              and sell your old books at <span className="font-semibold text-primary">BookPard</span>.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                size="lg"
                onClick={scrollToBooks}
                className="bg-gradient-to-r from-sankranti-saffron to-sankranti-saffron-dark hover:from-sankranti-saffron-light hover:to-sankranti-saffron text-white font-bold shadow-lg shadow-sankranti-saffron/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-sankranti-saffron/50 animate-pulse-glow"
              >
                <Sun className="mr-2 h-5 w-5" />
                Browse Books
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.location.href = "/sell"}
                className="border-2 border-sankranti-sky text-sankranti-sky hover:bg-sankranti-sky hover:text-white transition-all duration-300 font-semibold"
              >
                Sell Your Books
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-in">
            <div className="relative rounded-3xl overflow-hidden shadow-[var(--shadow-celebration)] hover:shadow-xl transition-shadow duration-300">
              <img
                src={heroImage}
                alt="Stack of colorful books - Makar Sankranti 2026 Sale"
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sankranti-saffron/20 via-transparent to-sankranti-sky/10" />
              
              {/* Decorative corner elements */}
              <Sun className="absolute top-4 right-4 h-8 w-8 text-sun-glow/60 animate-sun-pulse" />
              <div className="absolute bottom-16 left-4 h-6 w-6 animate-kite-sway">
                <svg viewBox="0 0 16 20" className="w-full h-full opacity-50" fill="hsl(var(--kite-blue))">
                  <path d="M8 0L16 10L8 20L0 10L8 0Z" />
                </svg>
              </div>
            </div>
            
            {/* Floating Discount Badge */}
            <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl p-6 shadow-[var(--shadow-celebration)] animate-gentle-float border-2 border-sankranti-saffron/40">
              <div className="flex items-center gap-2 mb-1">
                <Sun className="h-5 w-5 text-sankranti-saffron" />
                <p className="text-sm text-muted-foreground font-medium">Sankranti 2026!</p>
              </div>
              <p className="text-3xl font-playfair font-bold text-gold-shimmer">20% Off</p>
              <p className="text-xs text-muted-foreground mt-1">On selected books</p>
            </div>
            
            {/* Additional floating kite badge */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-br from-kite-red to-sankranti-saffron rounded-full p-4 shadow-lg animate-bounce-slow">
              <svg viewBox="0 0 24 30" className="h-6 w-6" fill="white">
                <path d="M12 0L24 12L12 30L0 12L12 0Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};