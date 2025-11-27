import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-books.jpg";

export const Hero = () => {
  const scrollToBooks = () => {
    const booksSection = document.getElementById("books-section");
    booksSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-peach/30 to-coral-light/20">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6 animate-fade-in">
            <div className="inline-block bg-secondary/20 text-secondary-foreground px-4 py-2 rounded-full text-sm font-semibold">
              📚 New & Affordable Books
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
                className="bg-gradient-to-r from-primary to-coral-dark hover:opacity-90 shadow-[var(--shadow-hover)] transition-all duration-300 hover:scale-105"
              >
                Browse Books
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.location.href = "/sell"}
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
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
            
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl p-6 shadow-[var(--shadow-card)] animate-scale-in">
              <p className="text-sm text-muted-foreground">Special Offer</p>
              <p className="text-2xl font-bold text-primary">Up to 50% Off</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
