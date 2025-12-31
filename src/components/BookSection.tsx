import { Book } from "@/types/book";
import { BookCard } from "@/components/BookCard";
import { Sparkles, Trophy, Star, TrendingUp, Clock } from "lucide-react";

interface BookSectionProps {
  title: string;
  books: Book[];
  onAddToCart: (book: Book) => void;
  icon?: "sparkles" | "trophy" | "star" | "trending" | "clock";
  variant?: "default" | "featured" | "new";
}

const iconMap = {
  sparkles: Sparkles,
  trophy: Trophy,
  star: Star,
  trending: TrendingUp,
  clock: Clock,
};

export const BookSection = ({
  title,
  books,
  onAddToCart,
  icon = "sparkles",
  variant = "default",
}: BookSectionProps) => {
  const Icon = iconMap[icon];

  if (books.length === 0) return null;

  const variantStyles = {
    default: "bg-card/50",
    featured: "bg-gradient-to-r from-newyear-midnight/10 via-newyear-gold/10 to-newyear-midnight/10",
    new: "bg-gradient-to-r from-confetti-purple/10 via-confetti-pink/10 to-confetti-orange/10",
  };

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
        {books.slice(0, 4).map((book) => (
          <BookCard key={book.id} book={book} onAddToCart={onAddToCart} />
        ))}
      </div>

      {books.length > 4 && (
        <div className="mt-4 text-center">
          <span className="text-sm text-muted-foreground">
            +{books.length - 4} more books in this section
          </span>
        </div>
      )}
    </section>
  );
};
