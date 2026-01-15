import { useEffect, useState } from "react";
import { Book } from "@/types/book";
import { BookCard } from "@/components/BookCard";
import { supabase } from "@/integrations/supabase/client";
import { Crown, Sparkles, TrendingUp, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface FeaturedBook {
  id: string;
  book_id: string;
  feature_type: string;
  title: string | null;
  description: string | null;
  book: {
    id: string;
    title: string;
    author: string;
    category: string;
    price: number;
    old_price: number;
    image_url: string;
    condition: string;
    description: string | null;
  };
}

interface FeaturedBooksSectionProps {
  onAddToCart: (book: Book) => void;
  onBookClick?: (book: Book) => void;
}

const featureTypeConfig = {
  book_of_week: {
    icon: Crown,
    label: "📚 Book of the Week",
    gradient: "from-amber-600 to-yellow-500",
  },
  staff_pick: {
    icon: Sparkles,
    label: "✨ Staff Picks",
    gradient: "from-purple-600 to-pink-500",
  },
  trending: {
    icon: TrendingUp,
    label: "🔥 Trending Now",
    gradient: "from-red-600 to-orange-500",
  },
  new_arrival: {
    icon: Clock,
    label: "🆕 New Arrivals",
    gradient: "from-green-600 to-teal-500",
  },
};

export const FeaturedBooksSection = ({
  onAddToCart,
  onBookClick,
}: FeaturedBooksSectionProps) => {
  const [featuredGroups, setFeaturedGroups] = useState<
    Record<string, FeaturedBook[]>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      const { data, error } = await supabase
        .from("featured_books")
        .select(`
          id,
          book_id,
          feature_type,
          title,
          description,
          book:books!inner(
            id,
            title,
            author,
            category,
            price,
            old_price,
            image_url,
            condition,
            description
          )
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching featured books:", error);
      } else if (data) {
        // Group by feature type
        const groups: Record<string, FeaturedBook[]> = {};
        data.forEach((item: any) => {
          if (!groups[item.feature_type]) {
            groups[item.feature_type] = [];
          }
          groups[item.feature_type].push(item);
        });
        setFeaturedGroups(groups);
      }
      setLoading(false);
    };

    fetchFeaturedBooks();
  }, []);

  const mapToBook = (featured: FeaturedBook): Book => ({
    id: featured.book.id,
    title: featured.book.title,
    author: featured.book.author,
    category: featured.book.category,
    price: featured.book.price,
    oldPrice: featured.book.old_price,
    image: featured.book.image_url,
    condition: featured.book.condition === "new" ? "new" : "old",
    description: featured.book.description || "",
  });

  if (loading) {
    return (
      <div className="space-y-8">
        {[1, 2].map((i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((j) => (
                <Skeleton key={j} className="h-80 rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const featureTypes = Object.keys(featuredGroups);
  if (featureTypes.length === 0) return null;

  return (
    <div className="space-y-10">
      {featureTypes.map((type) => {
        const config = featureTypeConfig[type as keyof typeof featureTypeConfig];
        if (!config) return null;

        const books = featuredGroups[type];
        const Icon = config.icon;

        return (
          <section key={type} className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg bg-gradient-to-r ${config.gradient} shadow-lg`}
              >
                <Icon className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-playfair font-bold text-foreground">
                {config.label}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {books.slice(0, 4).map((featured) => {
                const book = mapToBook(featured);
                return (
                  <div
                    key={featured.id}
                    onClick={() => onBookClick?.(book)}
                    className="cursor-pointer"
                  >
                    <BookCard book={book} onAddToCart={onAddToCart} />
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
};
