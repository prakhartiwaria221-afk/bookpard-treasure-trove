import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Sparkles, Library, BookMarked, Palette, Droplets } from "lucide-react";
import heroImage from "@/assets/hero-books.png";

export const Hero = () => {
  const scrollToBooks = () => {
    const booksSection = document.getElementById("books-section");
    booksSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-card to-muted">
      {/* Rainbow Side Accents */}
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-[hsl(var(--holi-pink))] via-[hsl(var(--holi-green))] to-[hsl(var(--holi-purple))]" />
      <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-b from-[hsl(var(--holi-yellow))] via-[hsl(var(--holi-blue))] to-[hsl(var(--holi-orange))]" />

      {/* Color Powder Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Color splash blobs */}
        <div className="absolute top-10 left-[10%] w-32 h-32 rounded-full bg-[hsl(var(--holi-pink))] opacity-[0.07] blur-3xl animate-color-float" />
        <div className="absolute top-32 right-[15%] w-40 h-40 rounded-full bg-[hsl(var(--holi-yellow))] opacity-[0.06] blur-3xl animate-color-float" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-20 left-[20%] w-28 h-28 rounded-full bg-[hsl(var(--holi-purple))] opacity-[0.08] blur-3xl animate-color-float" style={{ animationDelay: "4s" }} />
        <div className="absolute bottom-10 right-[25%] w-36 h-36 rounded-full bg-[hsl(var(--holi-green))] opacity-[0.06] blur-3xl animate-color-float" style={{ animationDelay: "3s" }} />
        <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full bg-[hsl(var(--holi-orange))] opacity-[0.05] blur-3xl animate-color-float" style={{ animationDelay: "1s" }} />

        {/* Floating icons */}
        <Palette className="absolute top-16 left-[15%] h-6 w-6 text-[hsl(var(--holi-pink))] animate-gentle-float opacity-30" />
        <Droplets className="absolute top-28 right-[20%] h-7 w-7 text-[hsl(var(--holi-blue))] animate-book-float opacity-25" />
        <Sparkles className="absolute bottom-32 right-[25%] h-5 w-5 text-[hsl(var(--holi-yellow))] animate-gentle-float opacity-30" style={{ animationDelay: "0.5s" }} />
        <Palette className="absolute bottom-24 left-[10%] h-5 w-5 text-[hsl(var(--holi-green))] animate-sparkle opacity-25" />

        {/* Color rain drops */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full animate-color-rain"
            style={{
              left: `${10 + i * 12}%`,
              backgroundColor: [
                'hsl(var(--holi-pink))',
                'hsl(var(--holi-yellow))',
                'hsl(var(--holi-purple))',
                'hsl(var(--holi-green))',
                'hsl(var(--holi-blue))',
                'hsl(var(--holi-orange))',
                'hsl(var(--holi-red))',
                'hsl(var(--holi-magenta))',
              ][i],
              opacity: 0.4,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${6 + i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6 animate-fade-in">
            {/* Holi Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[hsl(var(--holi-pink))] via-[hsl(var(--holi-purple))] to-[hsl(var(--holi-blue))] text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg">
              <Palette className="h-4 w-4" />
              <span className="tracking-wide">🎨 Holi Special Collection</span>
              <Droplets className="h-4 w-4" />
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold leading-tight tracking-tight">
              <span className="block mb-2 text-foreground">Splash Into</span>
              <span className="text-holi-gradient">Colorful Reads!</span>
            </h1>
            
            {/* Rainbow Divider */}
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 bg-[hsl(var(--holi-pink))] rounded" />
              <div className="h-1 w-8 bg-[hsl(var(--holi-orange))] rounded" />
              <div className="h-1 w-8 bg-[hsl(var(--holi-yellow))] rounded" />
              <Palette className="h-5 w-5 text-[hsl(var(--holi-green))]" />
              <div className="h-1 w-8 bg-[hsl(var(--holi-green))] rounded" />
              <div className="h-1 w-8 bg-[hsl(var(--holi-blue))] rounded" />
              <div className="h-1 w-8 bg-[hsl(var(--holi-purple))] rounded" />
            </div>
            
            {/* Subheading */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg font-inter leading-relaxed">
              Celebrate the festival of colors with our <span className="font-bold text-[hsl(var(--holi-pink))]">vibrant collection</span> of 
              <span className="font-semibold text-[hsl(var(--holi-purple))]"> amazing books</span>. Add color to your reading life at <span className="font-semibold text-[hsl(var(--holi-blue))]">BookPard</span>! 🌈
            </p>

            {/* Feature highlights */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-[hsl(var(--holi-pink))]/10 text-[hsl(var(--holi-pink))] px-4 py-2 rounded-full text-sm font-semibold border border-[hsl(var(--holi-pink))]/30 animate-rainbow-border">
                <Sparkles className="h-4 w-4" />
                Holi Special Deals
              </div>
              <div className="flex items-center gap-2 bg-[hsl(var(--holi-green))]/10 text-[hsl(var(--holi-green))] px-4 py-2 rounded-full text-sm font-semibold border border-[hsl(var(--holi-green))]/30">
                <BookMarked className="h-4 w-4" />
                Free Shipping
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                size="lg"
                onClick={scrollToBooks}
                className="bg-gradient-to-r from-[hsl(var(--holi-pink))] via-[hsl(var(--holi-purple))] to-[hsl(var(--holi-blue))] hover:opacity-90 text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105 holi-powder-burst"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Browse Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.location.href = "/sell"}
                className="border-2 border-[hsl(var(--holi-orange))] text-[hsl(var(--holi-orange))] hover:bg-[hsl(var(--holi-orange))] hover:text-white transition-all duration-300 font-semibold"
              >
                Sell Your Books
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-in">
            {/* Rainbow Frame */}
            <div className="relative p-1.5 rounded-xl shadow-2xl card-holi-border holi-powder-burst" style={{ animationDuration: '6s' }}>
              <div className="bg-background rounded-lg overflow-hidden">
                <div className="relative">
                  <img
                    src={heroImage}
                    alt="Holi Book Collection"
                    className="w-full h-[400px] md:h-[500px] object-cover"
                  />
                  {/* Color Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-[hsl(var(--holi-pink))]/5" />
                </div>
              </div>
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-[hsl(var(--holi-purple))] to-[hsl(var(--holi-blue))] rounded-xl p-6 shadow-2xl animate-gentle-float border-2 border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Palette className="h-4 w-4 text-[hsl(var(--holi-yellow))]" />
                <p className="text-sm text-[hsl(var(--holi-yellow))] font-medium tracking-wide">Festival Special</p>
              </div>
              <p className="text-4xl font-playfair font-bold text-white">1000+</p>
              <p className="text-xs text-white/80 mt-1 tracking-wide">Books Available</p>
            </div>
            
            {/* Ornament Badge */}
            <div className="absolute -top-4 -right-4 bg-card rounded-full p-4 shadow-xl border-4 border-[hsl(var(--holi-yellow))] animate-rainbow-border">
              <BookOpen className="h-8 w-8 text-[hsl(var(--holi-pink))]" />
            </div>

            {/* Holi Tag */}
            <div className="absolute top-8 -right-2 bg-gradient-to-r from-[hsl(var(--holi-orange))] to-[hsl(var(--holi-yellow))] text-white px-4 py-2 rounded-l-full shadow-lg flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-bold">Holi Sale! 🎨</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background via-background/80 to-transparent" />
      
      {/* Rainbow Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[hsl(var(--holi-pink))] via-[hsl(var(--holi-yellow))] via-[hsl(var(--holi-green))] via-[hsl(var(--holi-blue))] to-[hsl(var(--holi-purple))]" />
    </section>
  );
};
