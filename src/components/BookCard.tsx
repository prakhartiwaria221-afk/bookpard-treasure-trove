import { Book } from "@/types/book";
import { Button } from "@/components/ui/button";
import { ShoppingCart, BookOpen, Sparkles, Flag, Gift } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { StarRating } from "@/components/StarRating";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface BookCardProps {
  book: Book;
  onAddToCart: (book: Book) => void;
  onClick?: () => void;
}

export const BookCard = ({ book, onAddToCart, onClick }: BookCardProps) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  // Republic Day Special: 26% OFF on all books
  const republicDayDiscount = 26;
  const discountedPrice = Math.round(book.price * (1 - republicDayDiscount / 100));
  const originalDiscount = Math.round(((book.oldPrice - book.price) / book.oldPrice) * 100);
  
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    const fetchRating = async () => {
      const { data, error } = await supabase
        .from("book_reviews")
        .select("rating")
        .eq("book_id", book.id);

      if (!error && data && data.length > 0) {
        const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
        setAvgRating(Math.round(avg * 10) / 10);
        setReviewCount(data.length);
      }
    };

    fetchRating();
  }, [book.id]);

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Add with discounted price
    const discountedBook = { ...book, price: discountedPrice };
    addToCart(discountedBook);
    toast.success(`${book.title} added to cart with Republic Day discount!`);
    navigate("/checkout");
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Add with discounted price
    const discountedBook = { ...book, price: discountedPrice };
    onAddToCart(discountedBook);
  };

  return (
    <div 
      onClick={onClick}
      className="group relative bg-card dark:bg-card rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-[hsl(24,100%,50%)/30] cursor-pointer">
      
      {/* Tricolor Top Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[hsl(24,100%,50%)] via-white to-[hsl(120,60%,30%)]" />

      {/* Republic Day Badge - Top Left */}
      <div className="absolute top-3 left-3 z-10">
        <div className="p-1.5 bg-gradient-to-br from-[hsl(24,100%,50%)] to-[hsl(24,100%,40%)] rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300 flex items-center gap-1">
          <Flag className="h-3.5 w-3.5 text-white" />
        </div>
      </div>

      {/* Book Image */}
      <div className="relative aspect-[3/4] overflow-hidden m-2 rounded-lg">
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        
        {/* Republic Day Discount Badge */}
        <div className="absolute top-2 right-2 z-10">
          <div className="relative bg-gradient-to-br from-[hsl(24,100%,50%)] to-[hsl(24,100%,40%)] text-white px-3 py-1.5 rounded-lg shadow-lg offer-badge">
            <div className="flex items-center gap-1">
              <span className="text-lg">🇮🇳</span>
              <span className="text-sm font-bold">{republicDayDiscount}% OFF</span>
            </div>
          </div>
        </div>

        {/* Free Shipping Tag */}
        <div className="absolute bottom-2 left-2 z-10">
          <Badge className="bg-[hsl(120,60%,30%)] text-white border-0 text-xs flex items-center gap-1">
            <Gift className="h-3 w-3" />
            Free Shipping
          </Badge>
        </div>

        {/* Condition Badge */}
        {book.condition === "old" && (
          <div className="absolute top-2 left-12 z-10">
            <Badge className="bg-secondary/90 text-secondary-foreground border-0 text-xs">
              Pre-loved
            </Badge>
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="p-4 pt-2 space-y-3 relative">
        <div>
          {/* Category Badge */}
          <Badge className="text-xs mb-2 bg-primary/10 text-primary border border-primary/20">
            {book.category}
          </Badge>
          
          {/* Title */}
          <h3 className="font-playfair font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-tight">
            {book.title}
          </h3>
          
          {/* Author */}
          <p className="text-sm text-muted-foreground mt-1">{book.author}</p>
          
          {/* Rating */}
          {reviewCount > 0 && (
            <div className="mt-1">
              <StarRating 
                rating={avgRating} 
                size="sm" 
                showCount 
                reviewCount={reviewCount} 
              />
            </div>
          )}
        </div>

        {/* Decorative Divider */}
        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-gradient-to-r from-[hsl(24,100%,50%)/30] to-transparent" />
          <div className="text-sm text-[hsl(210,80%,45%)]">☸</div>
          <div className="h-px flex-1 bg-gradient-to-l from-[hsl(120,60%,30%)/30] to-transparent" />
        </div>

        {/* Pricing with Republic Day Offer */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-playfair font-bold text-primary">
              ₹{discountedPrice}
            </span>
            <span className="text-sm text-muted-foreground line-through">₹{book.price}</span>
            {book.oldPrice > book.price && (
              <span className="text-xs text-muted-foreground line-through">₹{book.oldPrice}</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-[hsl(120,60%,30%)] dark:text-[hsl(120,55%,45%)]">
            <Sparkles className="h-3 w-3" />
            <span>Republic Day Special Price!</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-1">
          <Button
            onClick={handleAddToCartClick}
            className="flex-1 bg-gradient-to-r from-[hsl(24,100%,50%)] to-[hsl(24,100%,45%)] hover:from-[hsl(24,100%,55%)] hover:to-[hsl(24,100%,50%)] text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
          <Button
            variant="outline"
            onClick={handleBuyNow}
            className="border-2 border-[hsl(120,60%,30%)] text-[hsl(120,60%,30%)] hover:bg-[hsl(120,60%,30%)] hover:text-white transition-all dark:border-[hsl(120,55%,40%)] dark:text-[hsl(120,55%,40%)] dark:hover:bg-[hsl(120,55%,40%)]"
          >
            Buy Now
          </Button>
        </div>
      </div>

      {/* Bottom Tricolor Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[hsl(24,100%,50%)] via-white to-[hsl(120,60%,30%)]" />
    </div>
  );
};
