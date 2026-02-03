import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Sparkles, Library, BookMarked, Bookmark } from "lucide-react";
import heroImage from "@/assets/hero-books.png";

export const Hero = () => {
  const scrollToBooks = () => {
    const booksSection = document.getElementById("books-section");
    booksSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(35,30%,97%)] via-[hsl(40,35%,95%)] to-[hsl(35,25%,92%)] dark:from-[hsl(25,25%,8%)] dark:via-[hsl(25,20%,12%)] dark:to-[hsl(25,25%,10%)]">
      {/* Decorative Book Spine Accents */}
      <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-b from-[hsl(15,65%,35%)] via-[hsl(38,60%,45%)] to-[hsl(15,65%,35%)]" />
      <div className="absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-b from-[hsl(38,60%,45%)] via-[hsl(15,65%,35%)] to-[hsl(38,60%,45%)]" />

      {/* Decorative Elements - Floating Books & Dust */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Corner Ornamental Frames */}
        <div className="absolute top-8 left-8 w-24 h-24 border-l-4 border-t-4 border-[hsl(38,60%,45%)] rounded-tl-lg opacity-40" />
        <div className="absolute top-8 right-8 w-24 h-24 border-r-4 border-t-4 border-[hsl(15,65%,35%)] rounded-tr-lg opacity-40" />
        <div className="absolute bottom-8 left-8 w-24 h-24 border-l-4 border-b-4 border-[hsl(15,65%,35%)] rounded-bl-lg opacity-40" />
        <div className="absolute bottom-8 right-8 w-24 h-24 border-r-4 border-b-4 border-[hsl(38,60%,45%)] rounded-br-lg opacity-40" />
        
        {/* Floating Book Icons */}
        <BookMarked className="absolute top-16 left-[15%] h-6 w-6 text-[hsl(15,65%,35%)] animate-gentle-float opacity-30" />
        <Library className="absolute top-28 right-[20%] h-7 w-7 text-[hsl(38,60%,45%)] animate-book-float opacity-25" />
        <Bookmark className="absolute bottom-32 right-[25%] h-5 w-5 text-[hsl(25,55%,40%)] animate-gentle-float opacity-30" style={{ animationDelay: "0.5s" }} />
        <Sparkles className="absolute bottom-24 left-[10%] h-5 w-5 text-[hsl(38,60%,45%)] animate-sparkle opacity-25" />
        
        {/* Dust particles effect */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[hsl(38,60%,45%)] rounded-full opacity-20 animate-dust-float" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-[hsl(15,65%,35%)] rounded-full opacity-15 animate-dust-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6 animate-fade-in">
            {/* Library Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[hsl(15,65%,35%)] to-[hsl(25,55%,40%)] text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg">
              <Library className="h-4 w-4" />
              <span className="tracking-wide">Classic Book Collection</span>
              <BookOpen className="h-4 w-4" />
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold leading-tight tracking-tight">
              <span className="block mb-2 text-foreground">Discover Timeless</span>
              <span className="text-vintage-gradient">Literary Treasures</span>
            </h1>
            
            {/* Decorative Divider */}
            <div className="flex items-center gap-4">
              <div className="h-1 w-16 bg-gradient-to-r from-[hsl(15,65%,35%)] to-transparent rounded" />
              <BookOpen className="h-5 w-5 text-[hsl(38,60%,45%)]" />
              <div className="h-1 w-16 bg-gradient-to-l from-[hsl(38,60%,45%)] to-transparent rounded" />
            </div>
            
            {/* Subheading */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg font-inter leading-relaxed">
              Explore our curated collection of <span className="font-bold text-primary">rare finds</span> and 
              <span className="font-semibold text-secondary"> beloved classics</span>. Every book has a story waiting to be discovered at <span className="font-semibold text-primary">BookPard</span>.
            </p>

            {/* Feature highlights */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-primary/10 dark:bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold border border-primary/30">
                <Sparkles className="h-4 w-4" />
                Curated Selection
              </div>
              <div className="flex items-center gap-2 bg-secondary/10 dark:bg-secondary/20 text-secondary px-4 py-2 rounded-full text-sm font-semibold border border-secondary/30">
                <BookMarked className="h-4 w-4" />
                Free Shipping
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                size="lg"
                onClick={scrollToBooks}
                className="bg-gradient-to-r from-[hsl(15,65%,35%)] to-[hsl(25,55%,40%)] hover:from-[hsl(15,60%,40%)] hover:to-[hsl(25,50%,45%)] text-white font-semibold shadow-lg shadow-[hsl(15,65%,35%)/30] transition-all duration-300 hover:scale-105"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Browse Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.location.href = "/sell"}
                className="border-2 border-[hsl(38,60%,45%)] text-[hsl(38,60%,45%)] hover:bg-[hsl(38,60%,45%)] hover:text-white transition-all duration-300 font-semibold dark:border-[hsl(40,55%,50%)] dark:text-[hsl(40,55%,50%)] dark:hover:bg-[hsl(40,55%,50%)]"
              >
                Sell Your Books
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-in">
            {/* Leather Book Frame */}
            <div className="relative p-1.5 bg-gradient-to-b from-[hsl(15,65%,35%)] via-[hsl(25,55%,40%)] to-[hsl(15,65%,35%)] rounded-xl shadow-2xl">
              <div className="bg-background rounded-lg overflow-hidden">
                <div className="relative">
                  <img
                    src={heroImage}
                    alt="Classic Book Collection"
                    className="w-full h-[400px] md:h-[500px] object-cover"
                  />
                  {/* Warm Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-[hsl(38,60%,45%)/10]" />
                </div>
              </div>
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-[hsl(15,65%,35%)] to-[hsl(15,70%,25%)] rounded-xl p-6 shadow-2xl animate-gentle-float border-2 border-[hsl(38,60%,45%)/30]">
              <div className="flex items-center gap-2 mb-1">
                <Library className="h-4 w-4 text-[hsl(38,60%,45%)]" />
                <p className="text-sm text-[hsl(38,60%,45%)] font-medium tracking-wide">Vintage Collection</p>
              </div>
              <p className="text-4xl font-playfair font-bold text-white">1000+</p>
              <p className="text-xs text-white/80 mt-1 tracking-wide">Books Available</p>
            </div>
            
            {/* Ornament Badge */}
            <div className="absolute -top-4 -right-4 bg-card dark:bg-card rounded-full p-4 shadow-xl border-4 border-[hsl(38,60%,45%)]">
              <BookOpen className="h-8 w-8 text-[hsl(15,65%,35%)]" />
            </div>

            {/* Bestseller Tag */}
            <div className="absolute top-8 -right-2 bg-[hsl(38,60%,45%)] text-white px-4 py-2 rounded-l-full shadow-lg flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-bold">Bestsellers!</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background via-background/80 to-transparent" />
      
      {/* Decorative Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[hsl(15,65%,35%)] via-[hsl(38,60%,45%)] to-[hsl(15,65%,35%)]" />
    </section>
  );
};
