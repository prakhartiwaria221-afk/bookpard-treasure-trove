import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Sparkles, Library, BookMarked } from "lucide-react";
import heroImage from "@/assets/hero-books.png";

export const Hero = () => {
  const scrollToBooks = () => {
    const booksSection = document.getElementById("books-section");
    booksSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-card to-muted">
      {/* Library Side Accents */}
      <div className="absolute left-0 top-0 bottom-0 w-2 book-spine-accent" />
      <div className="absolute right-0 top-0 bottom-0 w-2 book-spine-accent" />

      {/* Decorative Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-[10%] w-32 h-32 rounded-full bg-primary opacity-[0.05] blur-3xl animate-gentle-float" />
        <div className="absolute top-32 right-[15%] w-40 h-40 rounded-full bg-secondary opacity-[0.04] blur-3xl animate-gentle-float" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-20 left-[20%] w-28 h-28 rounded-full bg-accent opacity-[0.06] blur-3xl animate-gentle-float" style={{ animationDelay: "4s" }} />

        {/* Floating icons */}
        <BookOpen className="absolute top-16 left-[15%] h-6 w-6 text-primary animate-gentle-float opacity-20" />
        <Library className="absolute top-28 right-[20%] h-7 w-7 text-secondary animate-book-float opacity-15" />
        <Sparkles className="absolute bottom-32 right-[25%] h-5 w-5 text-secondary animate-gentle-float opacity-20" style={{ animationDelay: "0.5s" }} />
        <BookMarked className="absolute bottom-24 left-[10%] h-5 w-5 text-primary animate-sparkle opacity-15" />

        {/* Dust particles */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-secondary/30 animate-dust-float"
            style={{
              left: `${15 + i * 18}%`,
              animationDelay: `${i * 3}s`,
              animationDuration: `${15 + i * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 btn-vintage text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg">
              <Library className="h-4 w-4" />
              <span className="tracking-wide">📚 Classic Collection</span>
              <Sparkles className="h-4 w-4" />
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold leading-tight tracking-tight">
              <span className="block mb-2 text-foreground">Discover Your Next</span>
              <span className="text-vintage-gradient">Great Read</span>
            </h1>
            
            {/* Ornamental Divider */}
            <div className="flex items-center gap-2">
              <div className="h-0.5 w-12 bg-gradient-to-r from-primary to-secondary rounded" />
              <BookOpen className="h-5 w-5 text-secondary" />
              <div className="h-0.5 w-12 bg-gradient-to-r from-secondary to-primary rounded" />
            </div>
            
            {/* Subheading */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg font-inter leading-relaxed">
              Explore our curated collection of <span className="font-bold text-primary">timeless classics</span> and 
              <span className="font-semibold text-secondary"> modern bestsellers</span>. Your literary journey starts at <span className="font-semibold text-accent">BookPard</span>.
            </p>

            {/* Feature highlights */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold border border-primary/30">
                <Sparkles className="h-4 w-4" />
                Special Deals
              </div>
              <div className="flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-semibold border border-secondary/30">
                <BookMarked className="h-4 w-4" />
                Free Shipping
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                size="lg"
                onClick={scrollToBooks}
                className="btn-vintage text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Browse Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.location.href = "/sell"}
                className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white transition-all duration-300 font-semibold"
              >
                Sell Your Books
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-in">
            {/* Frame */}
            <div className="relative p-1.5 rounded-xl shadow-2xl border-leather">
              <div className="bg-background rounded-lg overflow-hidden">
                <div className="relative">
                  <img
                    src={heroImage}
                    alt="Book Collection"
                    className="w-full h-[400px] md:h-[500px] object-cover"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-primary/5" />
                </div>
              </div>
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-primary to-accent rounded-xl p-6 shadow-2xl animate-gentle-float border-2 border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-secondary" />
                <p className="text-sm text-secondary font-medium tracking-wide">Curated Selection</p>
              </div>
              <p className="text-4xl font-playfair font-bold text-white">1000+</p>
              <p className="text-xs text-white/80 mt-1 tracking-wide">Books Available</p>
            </div>
            
            {/* Ornament Badge */}
            <div className="absolute -top-4 -right-4 bg-card rounded-full p-4 shadow-xl border-4 border-secondary animate-warm-glow">
              <BookOpen className="h-8 w-8 text-primary" />
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
