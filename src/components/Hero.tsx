import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-books.png";

export const Hero = () => {
  const scrollToBooks = () => {
    const booksSection = document.getElementById("books-section");
    booksSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-amber-950 via-stone-900 to-amber-950">
      {/* Vintage Paper Texture Overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')]" />
      
      {/* Elegant Gold Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Corner Flourishes */}
        <div className="absolute top-8 left-8 w-24 h-24 border-l-2 border-t-2 border-amber-600/30 rounded-tl-lg" />
        <div className="absolute top-8 right-8 w-24 h-24 border-r-2 border-t-2 border-amber-600/30 rounded-tr-lg" />
        <div className="absolute bottom-8 left-8 w-24 h-24 border-l-2 border-b-2 border-amber-600/30 rounded-bl-lg" />
        <div className="absolute bottom-8 right-8 w-24 h-24 border-r-2 border-b-2 border-amber-600/30 rounded-br-lg" />
        
        {/* Floating Gold Sparkles */}
        <Sparkles className="absolute top-16 left-[15%] h-5 w-5 text-amber-500/40 animate-pulse" style={{ animationDelay: "0s" }} />
        <Sparkles className="absolute top-28 right-[20%] h-4 w-4 text-amber-400/30 animate-pulse" style={{ animationDelay: "0.7s" }} />
        <Sparkles className="absolute bottom-32 right-[25%] h-5 w-5 text-amber-500/35 animate-pulse" style={{ animationDelay: "1.2s" }} />
        <Sparkles className="absolute bottom-24 left-[10%] h-4 w-4 text-amber-400/25 animate-pulse" style={{ animationDelay: "1.8s" }} />
        
        {/* Decorative Book Icons */}
        <BookOpen className="absolute top-20 right-[10%] h-8 w-8 text-amber-700/20 rotate-12" />
        <BookOpen className="absolute bottom-40 left-[5%] h-6 w-6 text-amber-700/15 -rotate-6" />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6 animate-fade-in">
            {/* Vintage Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-900/60 to-stone-800/60 backdrop-blur-sm text-amber-100 px-5 py-2.5 rounded-sm text-sm font-medium border border-amber-600/40 shadow-lg">
              <BookOpen className="h-4 w-4 text-amber-400" />
              <span className="font-serif tracking-wide">✦ Makar Sankranti 2026 ✦</span>
            </div>
            
            {/* Main Heading - Elegant Typography */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-amber-50 leading-tight tracking-tight">
              <span className="block mb-2">Discover Timeless</span>
              <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">Literary Treasures</span>
            </h1>
            
            {/* Decorative Line */}
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-600/60" />
              <Sparkles className="h-4 w-4 text-amber-500" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-600/60" />
            </div>
            
            {/* Subheading */}
            <p className="text-lg md:text-xl text-amber-100/80 max-w-lg font-inter leading-relaxed">
              Celebrate the harvest festival with curated collections. From rare vintage editions to beloved classics, 
              find your next treasure at <span className="font-semibold text-amber-400">BookPard</span>.
            </p>
            
            {/* CTA Buttons - Vintage Style */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                size="lg"
                onClick={scrollToBooks}
                className="bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-amber-50 font-semibold shadow-lg shadow-amber-900/50 transition-all duration-300 hover:scale-105 border border-amber-600/50"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Explore Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.location.href = "/sell"}
                className="border-2 border-amber-600/60 text-amber-200 hover:bg-amber-800/30 hover:text-amber-100 hover:border-amber-500 transition-all duration-300 font-semibold bg-transparent"
              >
                Sell Your Books
              </Button>
            </div>
          </div>

          {/* Hero Image - Vintage Frame */}
          <div className="relative animate-fade-in">
            {/* Ornate Frame */}
            <div className="relative p-3 bg-gradient-to-br from-amber-800/40 via-stone-800/40 to-amber-900/40 rounded-lg border-2 border-amber-700/50 shadow-2xl shadow-amber-950/50">
              {/* Inner Frame Border */}
              <div className="absolute inset-3 border border-amber-600/30 rounded pointer-events-none" />
              
              <div className="relative rounded overflow-hidden">
                <img
                  src={heroImage}
                  alt="Collection of vintage leather-bound books with gold embossing - Makar Sankranti 2026 Sale"
                  className="w-full h-[400px] md:h-[500px] object-cover"
                />
                {/* Warm Vintage Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-amber-950/40 via-transparent to-amber-900/20" />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-amber-800/10 to-amber-950/30" />
              </div>
              
              {/* Corner Accents */}
              <div className="absolute top-1 left-1 w-6 h-6 border-l-2 border-t-2 border-amber-500/60 rounded-tl" />
              <div className="absolute top-1 right-1 w-6 h-6 border-r-2 border-t-2 border-amber-500/60 rounded-tr" />
              <div className="absolute bottom-1 left-1 w-6 h-6 border-l-2 border-b-2 border-amber-500/60 rounded-bl" />
              <div className="absolute bottom-1 right-1 w-6 h-6 border-r-2 border-b-2 border-amber-500/60 rounded-br" />
            </div>
            
            {/* Floating Discount Badge - Vintage Seal Style */}
            <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-amber-900 to-stone-900 rounded-lg p-6 shadow-2xl shadow-amber-950/60 animate-gentle-float border border-amber-700/50">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <p className="text-sm text-amber-200/80 font-medium tracking-wide">Sankranti Special</p>
              </div>
              <p className="text-3xl font-playfair font-bold bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">20% Off</p>
              <p className="text-xs text-amber-300/60 mt-1 tracking-wide">On selected editions</p>
            </div>
            
            {/* Decorative Seal Badge */}
            <div className="absolute -top-3 -right-3 bg-gradient-to-br from-amber-700 to-amber-900 rounded-full p-4 shadow-lg border-2 border-amber-600/50 animate-bounce-slow">
              <BookOpen className="h-5 w-5 text-amber-200" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background via-background/80 to-transparent" />
      
      {/* Decorative Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-700/40 to-transparent" />
    </section>
  );
};