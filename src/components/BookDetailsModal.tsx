import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book } from "@/types/book";
import { StarRating } from "@/components/StarRating";
import { BookReviewForm } from "@/components/BookReviewForm";
import { BookReviewsList } from "@/components/BookReviewsList";
import { ShoppingCart, BookOpen, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BookDetailsModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (book: Book) => void;
}

export const BookDetailsModal = ({
  book,
  isOpen,
  onClose,
  onAddToCart,
}: BookDetailsModalProps) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userReview, setUserReview] = useState<{
    id: string;
    rating: number;
    review_text: string | null;
  } | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);

      if (user && book) {
        // Check if user has already reviewed this book
        const { data } = await supabase
          .from("book_reviews")
          .select("id, rating, review_text")
          .eq("book_id", book.id)
          .eq("user_id", user.id)
          .maybeSingle();

        setUserReview(data);
      }
    };

    if (isOpen && book) {
      checkAuth();
      fetchRating();
    }
  }, [isOpen, book, refreshKey]);

  const fetchRating = async () => {
    if (!book) return;

    const { data, error } = await supabase
      .from("book_reviews")
      .select("rating")
      .eq("book_id", book.id);

    if (!error && data && data.length > 0) {
      const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
      setAvgRating(Math.round(avg * 10) / 10);
      setTotalReviews(data.length);
    } else {
      setAvgRating(0);
      setTotalReviews(0);
    }
  };

  const handleReviewSubmitted = () => {
    setRefreshKey((prev) => prev + 1);
  };

  if (!book) return null;

  const discount = Math.round(((book.oldPrice - book.price) / book.oldPrice) * 100);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-amber-950/95 via-stone-900/95 to-amber-950/95 border-amber-700/40">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-50">
            <BookOpen className="h-5 w-5 text-amber-400" />
            Book Details
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Book Image */}
          <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-amber-700/30">
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-full object-cover"
            />
            {discount > 0 && (
              <div className="absolute top-2 right-2">
                <div className="bg-gradient-to-br from-amber-700 to-amber-900 text-amber-100 px-3 py-1.5 rounded-lg shadow-lg border border-amber-500/50">
                  <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-amber-400 animate-pulse" />
                  <span className="text-sm font-bold">{discount}% OFF</span>
                </div>
              </div>
            )}
          </div>

          {/* Book Info */}
          <div className="space-y-4">
            <div>
              <Badge className="mb-2 bg-gradient-to-r from-amber-800/80 to-stone-800/80 text-amber-200 border border-amber-600/40">
                {book.category}
              </Badge>
              <h2 className="text-2xl font-playfair font-bold text-amber-50">
                {book.title}
              </h2>
              <p className="text-amber-200/60">{book.author}</p>
            </div>

            {/* Rating Display */}
            <div className="flex items-center gap-2">
              <StarRating
                rating={avgRating}
                showCount
                reviewCount={totalReviews}
              />
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-playfair font-bold bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">
                ₹{book.price}
              </span>
              <span className="text-lg text-amber-400/50 line-through">
                ₹{book.oldPrice}
              </span>
            </div>

            {/* Condition */}
            <Badge
              variant="outline"
              className="border-amber-600/40 text-amber-200"
            >
              {book.condition === "new" ? "Brand New" : "✦ Pre-loved"}
            </Badge>

            {/* Description */}
            {book.description && (
              <p className="text-sm text-amber-200/70">{book.description}</p>
            )}

            {/* Action Button */}
            <Button
              onClick={() => onAddToCart(book)}
              className="w-full bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-amber-50 shadow-lg"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Reviews Section */}
        <Tabs defaultValue="reviews" className="mt-6">
          <TabsList className="grid w-full grid-cols-2 bg-stone-900/50">
            <TabsTrigger value="reviews">Reviews ({totalReviews})</TabsTrigger>
            <TabsTrigger value="write-review">
              {userReview ? "Edit Review" : "Write Review"}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="reviews" className="mt-4">
            <BookReviewsList bookId={book.id} refreshKey={refreshKey} />
          </TabsContent>
          <TabsContent value="write-review" className="mt-4">
            {isLoggedIn ? (
              <BookReviewForm
                bookId={book.id}
                onReviewSubmitted={handleReviewSubmitted}
                existingReview={userReview || undefined}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Please sign in to write a review
                </p>
                <Button
                  variant="outline"
                  className="mt-4 border-amber-600/50 text-amber-200 hover:bg-amber-800/40"
                  onClick={() => (window.location.href = "/auth")}
                >
                  Sign In
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
