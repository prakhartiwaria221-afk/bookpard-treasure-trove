import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Sparkles, Star, Flag, Gift } from "lucide-react";
import heroImage from "@/assets/hero-books.png";

export const Hero = () => {
  const scrollToBooks = () => {
    const booksSection = document.getElementById("books-section");
    booksSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(24,100%,95%)] via-white to-[hsl(120,60%,95%)] dark:from-[hsl(220,30%,10%)] dark:via-[hsl(220,25%,12%)] dark:to-[hsl(220,30%,8%)]">
      {/* Tricolor Accent Lines */}
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-[hsl(24,100%,50%)] via-white to-[hsl(120,60%,30%)]" />
      <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-b from-[hsl(24,100%,50%)] via-white to-[hsl(120,60%,30%)]" />

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Corner Tricolor Accents */}
        <div className="absolute top-8 left-8 w-24 h-24 border-l-4 border-t-4 border-[hsl(24,100%,50%)] rounded-tl-lg opacity-60" />
        <div className="absolute top-8 right-8 w-24 h-24 border-r-4 border-t-4 border-[hsl(120,60%,30%)] rounded-tr-lg opacity-60" />
        <div className="absolute bottom-8 left-8 w-24 h-24 border-l-4 border-b-4 border-[hsl(120,60%,30%)] rounded-bl-lg opacity-60" />
        <div className="absolute bottom-8 right-8 w-24 h-24 border-r-4 border-b-4 border-[hsl(24,100%,50%)] rounded-br-lg opacity-60" />
        
        {/* Floating Stars and Flags */}
        <Star className="absolute top-16 left-[15%] h-5 w-5 text-[hsl(24,100%,50%)] animate-sparkle opacity-60" />
        <Flag className="absolute top-28 right-[20%] h-6 w-6 text-[hsl(120,60%,30%)] animate-flag-wave opacity-50" />
        <Star className="absolute bottom-32 right-[25%] h-5 w-5 text-[hsl(210,80%,45%)] animate-sparkle opacity-50" style={{ animationDelay: "0.5s" }} />
        <Sparkles className="absolute bottom-24 left-[10%] h-6 w-6 text-[hsl(24,100%,55%)] animate-pulse opacity-40" />
        
        {/* Ashoka Chakra decorations */}
        <div className="absolute top-20 right-[10%] text-3xl text-[hsl(210,80%,45%)] opacity-20 animate-chakra-spin">☸</div>
        <div className="absolute bottom-40 left-[5%] text-2xl text-[hsl(210,80%,45%)] opacity-15 animate-chakra-spin" style={{ animationDirection: "reverse" }}>☸</div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6 animate-fade-in">
            {/* Republic Day Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[hsl(24,100%,50%)] via-white to-[hsl(120,60%,30%)] text-[hsl(24,100%,25%)] px-5 py-2.5 rounded-full text-sm font-bold shadow-lg border border-[hsl(210,80%,45%)/30]">
              <span className="text-lg">🇮🇳</span>
              <span className="tracking-wide">Republic Day 2026</span>
              <span className="text-lg">🇮🇳</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold leading-tight tracking-tight">
              <span className="block mb-2 text-foreground">Celebrate Freedom with</span>
              <span className="text-tricolor-gradient">Amazing Books</span>
            </h1>
            
            {/* Decorative Line with Ashoka Chakra */}
            <div className="flex items-center gap-4">
              <div className="h-1 w-12 bg-gradient-to-r from-[hsl(24,100%,50%)] to-transparent rounded" />
              <div className="text-2xl text-[hsl(210,80%,45%)] animate-chakra-spin">☸</div>
              <div className="h-1 w-12 bg-gradient-to-l from-[hsl(120,60%,30%)] to-transparent rounded" />
            </div>
            
            {/* Subheading */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg font-inter leading-relaxed">
              Honor the spirit of the Constitution with our special <span className="font-bold text-primary">26% OFF</span> on all books! 
              Discover knowledge, embrace wisdom at <span className="font-semibold text-secondary">BookPard</span>.
            </p>

            {/* Offer highlights */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-[hsl(24,100%,50%)/10] dark:bg-[hsl(24,100%,50%)/20] text-primary px-4 py-2 rounded-full text-sm font-semibold border border-[hsl(24,100%,50%)/30]">
                <Gift className="h-4 w-4" />
                26% OFF All Books
              </div>
              <div className="flex items-center gap-2 bg-[hsl(120,60%,30%)/10] dark:bg-[hsl(120,60%,30%)/20] text-secondary px-4 py-2 rounded-full text-sm font-semibold border border-[hsl(120,60%,30%)/30]">
                <Star className="h-4 w-4" />
                Free Shipping
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                size="lg"
                onClick={scrollToBooks}
                className="bg-gradient-to-r from-[hsl(24,100%,50%)] to-[hsl(24,100%,45%)] hover:from-[hsl(24,100%,55%)] hover:to-[hsl(24,100%,50%)] text-white font-semibold shadow-lg shadow-[hsl(24,100%,50%)/30] transition-all duration-300 hover:scale-105"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Shop Republic Day Sale
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.location.href = "/sell"}
                className="border-2 border-[hsl(120,60%,30%)] text-[hsl(120,60%,30%)] hover:bg-[hsl(120,60%,30%)] hover:text-white transition-all duration-300 font-semibold dark:border-[hsl(120,55%,40%)] dark:text-[hsl(120,55%,40%)] dark:hover:bg-[hsl(120,55%,40%)]"
              >
                Sell Your Books
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-in">
            {/* Tricolor Frame */}
            <div className="relative p-1 bg-gradient-to-b from-[hsl(24,100%,50%)] via-white to-[hsl(120,60%,30%)] rounded-xl shadow-2xl">
              <div className="bg-background rounded-lg overflow-hidden">
                <div className="relative">
                  <img
                    src={heroImage}
                    alt="Republic Day Book Collection - 26% OFF Sale"
                    className="w-full h-[400px] md:h-[500px] object-cover"
                  />
                  {/* Patriotic Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-[hsl(24,100%,50%)/10]" />
                </div>
              </div>
            </div>
            
            {/* Floating Discount Badge */}
            <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-[hsl(24,100%,50%)] to-[hsl(24,100%,40%)] rounded-xl p-6 shadow-2xl animate-gentle-float border-2 border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Flag className="h-4 w-4 text-white" />
                <p className="text-sm text-white/90 font-medium tracking-wide">Republic Day Special</p>
              </div>
              <p className="text-4xl font-playfair font-bold text-white">26% OFF</p>
              <p className="text-xs text-white/80 mt-1 tracking-wide">On all books • Limited time</p>
            </div>
            
            {/* Ashoka Chakra Badge */}
            <div className="absolute -top-4 -right-4 bg-white dark:bg-card rounded-full p-4 shadow-xl border-4 border-[hsl(210,80%,45%)]">
              <div className="text-3xl text-[hsl(210,80%,45%)] animate-chakra-spin">☸</div>
            </div>

            {/* Free shipping badge */}
            <div className="absolute top-8 -right-2 bg-[hsl(120,60%,30%)] text-white px-4 py-2 rounded-l-full shadow-lg flex items-center gap-2">
              <Gift className="h-4 w-4" />
              <span className="text-sm font-bold">Free Shipping!</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background via-background/80 to-transparent" />
      
      {/* Decorative Tricolor Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[hsl(24,100%,50%)] via-white to-[hsl(120,60%,30%)]" />
    </section>
  );
};
