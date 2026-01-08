import { useState } from "react";
import { Book } from "@/types/book";
import { BookCard } from "@/components/BookCard";
import { Sparkles, Trophy, Star, TrendingUp, Clock, ChevronDown, ChevronUp, Library } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookSectionProps {
  title: string;
  books: Book[];
  onAddToCart: (book: Book) => void;
  icon?: "sparkles" | "trophy" | "star" | "trending" | "clock" | "library";
  variant?: "default" | "featured" | "new";
}

const iconMap = {
  sparkles: Sparkles,
  trophy: Trophy,
  star: Star,
  trending: TrendingUp,
  clock: Clock,
  library: Library,
};

export const BookSection = ({
  title,
  books,
  onAddToCart,
  icon = "sparkles",
  variant = "default",
}: BookSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = iconMap[icon];

  if (books.length === 0) return null;

  const variantStyles = {
    default: "bg-card/50",
    featured: "bg-gradient-to-r from-newyear-midnight/10 via-newyear-gold/10 to-newyear-midnight/10",
    new: "bg-gradient-to-r from-confetti-purple/10 via-confetti-pink/10 to-confetti-orange/10",
  };

  const displayedBooks = isExpanded ? books : books.slice(0, 4);

  return (
    <section className={`rounded-2xl p-6 mb-8 ${variantStyles[variant]} border border-border/50 backdrop-blur-sm`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-gradient-to-br from-newyear-gold to-newyear-champagne shadow-lg">
          <Icon className="h-5 w-5 text-newyear-midnight" />
        </div>
        <h3 className="text-xl font-bold text-foreground tracking-tight">
          {title}
        </h3>
        <div className="h-px flex-1 bg-gradient-to-r from-newyear-gold/50 to-transparent" />
        <span className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
          {books.length} {books.length === 1 ? "book" : "books"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {displayedBooks.map((book) => (
          <BookCard key={book.id} book={book} onAddToCart={onAddToCart} />
        ))}
      </div>

      {books.length > 4 && (
        <div className="mt-4 text-center">
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-muted-foreground hover:text-foreground gap-2"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                +{books.length - 4} more books in this section
              </>
            )}
          </Button>
        </div>
      )}
    </section>
  );
};
