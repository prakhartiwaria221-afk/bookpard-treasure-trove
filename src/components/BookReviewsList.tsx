import { useEffect, useState } from "react";
import { StarRating } from "@/components/StarRating";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { User, Loader2 } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  user_id: string;
}

interface BookReviewsListProps {
  bookId: string;
  refreshKey?: number;
}

export const BookReviewsList = ({ bookId, refreshKey }: BookReviewsListProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      
      // Fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("book_reviews")
        .select("*")
        .eq("book_id", bookId)
        .order("created_at", { ascending: false });

      if (reviewsError) {
        console.error("Error fetching reviews:", reviewsError);
      } else {
        setReviews(reviewsData || []);
        
        // Calculate average rating
        if (reviewsData && reviewsData.length > 0) {
          const avg = reviewsData.reduce((sum, r) => sum + r.rating, 0) / reviewsData.length;
          setAvgRating(Math.round(avg * 10) / 10);
          setTotalReviews(reviewsData.length);
        } else {
          setAvgRating(0);
          setTotalReviews(0);
        }
      }
      
      setLoading(false);
    };

    fetchReviews();
  }, [bookId, refreshKey]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-950/50 to-stone-900/50 rounded-lg border border-amber-700/30">
        <div className="text-center">
          <span className="text-3xl font-bold text-amber-300">{avgRating}</span>
          <span className="text-lg text-amber-400">/5</span>
        </div>
        <div>
          <StarRating rating={avgRating} size="md" />
          <p className="text-sm text-muted-foreground mt-1">
            Based on {totalReviews} review{totalReviews !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">
          No reviews yet. Be the first to review this book!
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-4 bg-stone-900/50 rounded-lg border border-amber-700/20"
            >
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-amber-200" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <StarRating rating={review.rating} size="sm" />
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  {review.review_text && (
                    <p className="text-sm text-foreground/80 mt-2 whitespace-pre-wrap">
                      {review.review_text}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
