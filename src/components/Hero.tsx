import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, PartyPopper } from "lucide-react";
import heroImage from "@/assets/hero-books.png";

export const Hero = () => {
  const scrollToBooks = () => {
    const booksSection = document.getElementById("books-section");
    booksSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-[var(--gradient-hero)]">
      {/* New Year Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Sparkles className="absolute top-10 left-[10%] h-6 w-6 text-newyear-gold/40 animate-sparkle" style={{ animationDelay: "0s" }} />
        <Sparkles className="absolute top-20 right-[15%] h-4 w-4 text-primary/30 animate-sparkle" style={{ animationDelay: "0.5s" }} />
        <Sparkles className="absolute top-40 left-[25%] h-5 w-5 text-sparkle/50 animate-sparkle" style={{ animationDelay: "1s" }} />
        <Sparkles className="absolute bottom-32 right-[20%] h-6 w-6 text-newyear-gold/30 animate-sparkle" style={{ animationDelay: "1.5s" }} />
        <Sparkles className="absolute bottom-20 left-[5%] h-4 w-4 text-confetti-purple/30 animate-sparkle" style={{ animationDelay: "2s" }} />
        <PartyPopper className="absolute top-16 right-[8%] h-8 w-8 text-confetti-pink/25 rotate-12" />
        <PartyPopper className="absolute bottom-24 left-[12%] h-6 w-6 text-newyear-gold/25 -rotate-12" />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary-foreground px-4 py-2 rounded-full text-sm font-semibold">
              <Sparkles className="h-4 w-4" />
              🎉 New Year Book Sale!
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Discover Your Next
              <span className="text-primary"> Favorite Book</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg">
              Buy new books, find great deals on used books, and sell your old books at BookPard. 
              Books for everyone, from kids to adults.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={scrollToBooks}
                className="bg-gradient-to-r from-primary to-newyear-midnight-dark hover:opacity-90 shadow-[var(--shadow-hover)] transition-all duration-300 hover:scale-105 celebration-glow"
              >
                Browse Books
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.location.href = "/sell"}
                className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground transition-all duration-300"
              >
                Sell Your Books
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-in">
            <div className="relative rounded-3xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-shadow duration-300">
              <img
                src={heroImage}
                alt="Stack of colorful books"
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            
            {/* Floating Badge - New Year styled */}
            <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl p-6 shadow-[var(--shadow-card)] animate-scale-in border-2 border-newyear-gold/30">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-newyear-gold" />
                <p className="text-sm text-muted-foreground">New Year Special</p>
              </div>
              <p className="text-2xl font-bold text-primary">20% Off</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};