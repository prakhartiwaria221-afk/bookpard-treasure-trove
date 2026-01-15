import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/StarRating";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface BookReviewFormProps {
  bookId: string;
  onReviewSubmitted?: () => void;
  existingReview?: {
    id: string;
    rating: number;
    review_text: string | null;
  };
}

export const BookReviewForm = ({
  bookId,
  onReviewSubmitted,
  existingReview,
}: BookReviewFormProps) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [reviewText, setReviewText] = useState(existingReview?.review_text || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please sign in to submit a review");
        return;
      }

      if (existingReview) {
        // Update existing review
        const { error } = await supabase
          .from("book_reviews")
          .update({
            rating,
            review_text: reviewText.trim() || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingReview.id);

        if (error) throw error;
        toast.success("Review updated successfully!");
      } else {
        // Create new review
        const { error } = await supabase
          .from("book_reviews")
          .insert({
            book_id: bookId,
            user_id: user.id,
            rating,
            review_text: reviewText.trim() || null,
          });

        if (error) {
          if (error.code === "23505") {
            toast.error("You have already reviewed this book");
          } else {
            throw error;
          }
          return;
        }
        toast.success("Review submitted successfully!");
      }

      setRating(0);
      setReviewText("");
      onReviewSubmitted?.();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Your Rating
        </label>
        <StarRating
          rating={rating}
          size="lg"
          interactive
          onRatingChange={setRating}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Your Review (optional)
        </label>
        <Textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Share your thoughts about this book..."
          className="min-h-[100px] bg-background border-border"
          maxLength={1000}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {reviewText.length}/1000 characters
        </p>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || rating === 0}
        className="w-full bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : existingReview ? (
          "Update Review"
        ) : (
          "Submit Review"
        )}
      </Button>
    </form>
  );
};
