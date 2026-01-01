import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, PartyPopper, Star, Gift } from "lucide-react";
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
        {/* Floating Stars */}
        {[...Array(8)].map((_, i) => (
          <Star
            key={`star-${i}`}
            className="absolute text-newyear-gold/30 fill-newyear-gold/20 animate-twinkle-star"
            style={{
              left: `${10 + i * 12}%`,
              top: `${15 + (i % 3) * 25}%`,
              width: `${12 + (i % 4) * 6}px`,
              height: `${12 + (i % 4) * 6}px`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
        
        {/* Sparkles */}
        <Sparkles className="absolute top-10 left-[10%] h-8 w-8 text-newyear-gold/50 animate-sparkle" style={{ animationDelay: "0s" }} />
        <Sparkles className="absolute top-20 right-[15%] h-6 w-6 text-primary/40 animate-sparkle" style={{ animationDelay: "0.5s" }} />
        <Sparkles className="absolute top-40 left-[25%] h-7 w-7 text-sparkle/60 animate-sparkle" style={{ animationDelay: "1s" }} />
        <Sparkles className="absolute bottom-32 right-[20%] h-8 w-8 text-newyear-gold/40 animate-sparkle" style={{ animationDelay: "1.5s" }} />
        <Sparkles className="absolute bottom-20 left-[5%] h-5 w-5 text-confetti-purple/40 animate-sparkle" style={{ animationDelay: "2s" }} />
        <Sparkles className="absolute top-1/2 right-[5%] h-6 w-6 text-confetti-pink/40 animate-sparkle" style={{ animationDelay: "2.5s" }} />
        
        {/* Party Poppers */}
        <PartyPopper className="absolute top-16 right-[8%] h-10 w-10 text-confetti-pink/30 rotate-12 animate-gentle-float" />
        <PartyPopper className="absolute bottom-24 left-[12%] h-8 w-8 text-newyear-gold/30 -rotate-12 animate-gentle-float" style={{ animationDelay: "1s" }} />
        
        {/* Gifts */}
        <Gift className="absolute bottom-16 right-[30%] h-7 w-7 text-confetti-purple/25 animate-bounce-slow" style={{ animationDelay: "0.5s" }} />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6 animate-fade-in">
            {/* New Year Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-newyear-gold/20 to-confetti-pink/20 backdrop-blur-sm text-foreground px-5 py-2.5 rounded-full text-sm font-semibold border border-newyear-gold/30 shadow-lg shadow-newyear-gold/10">
              <PartyPopper className="h-4 w-4 text-newyear-gold animate-bounce-slow" />
              <span className="font-dancing text-base">🎉 New Year 2026 Special!</span>
              <Sparkles className="h-4 w-4 text-confetti-pink animate-sparkle" />
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-foreground leading-tight">
              <span className="block mb-2">Discover Your Next</span>
              <span className="text-gold-shimmer">Favorite Book</span>
            </h1>
            
            {/* Subheading */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg font-inter leading-relaxed">
              Celebrate 2026 with amazing deals! Buy new books, find treasures among used books, 
              and sell your old books at <span className="font-semibold text-primary">BookPard</span>.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                size="lg"
                onClick={scrollToBooks}
                className="bg-gradient-to-r from-newyear-gold to-newyear-gold-dark hover:from-newyear-gold-light hover:to-newyear-gold text-newyear-midnight-dark font-bold shadow-lg shadow-newyear-gold/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-newyear-gold/50 animate-pulse-glow"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Browse Books
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.location.href = "/sell"}
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-semibold"
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
                alt="Stack of colorful books - New Year 2026 Sale"
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-newyear-midnight/30 via-transparent to-newyear-gold/10" />
              
              {/* Decorative corner sparkles */}
              <Sparkles className="absolute top-4 right-4 h-8 w-8 text-newyear-gold/60 animate-sparkle" />
              <Star className="absolute bottom-16 left-4 h-6 w-6 text-newyear-gold/50 fill-newyear-gold/30 animate-twinkle-star" />
            </div>
            
            {/* Floating New Year Discount Badge */}
            <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl p-6 shadow-[var(--shadow-celebration)] animate-gentle-float border-2 border-newyear-gold/40">
              <div className="flex items-center gap-2 mb-1">
                <PartyPopper className="h-5 w-5 text-newyear-gold" />
                <p className="text-sm text-muted-foreground font-medium">New Year 2026!</p>
              </div>
              <p className="text-3xl font-playfair font-bold text-gold-shimmer">20% Off</p>
              <p className="text-xs text-muted-foreground mt-1">On selected books</p>
            </div>
            
            {/* Additional floating badge */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-br from-confetti-pink to-confetti-purple rounded-full p-4 shadow-lg animate-bounce-slow">
              <Gift className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};