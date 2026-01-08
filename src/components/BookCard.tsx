import { Book } from "@/types/book";
import { Button } from "@/components/ui/button";
import { ShoppingCart, BookOpen, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface BookCardProps {
  book: Book;
  onAddToCart: (book: Book) => void;
}

export const BookCard = ({ book, onAddToCart }: BookCardProps) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const discount = Math.round(((book.oldPrice - book.price) / book.oldPrice) * 100);

  const handleBuyNow = () => {
    addToCart(book);
    toast.success(`${book.title} added to cart!`);
    navigate("/checkout");
  };

  return (
    <div className="group relative bg-gradient-to-br from-amber-950/95 via-stone-900/95 to-amber-950/95 rounded-xl overflow-hidden shadow-xl shadow-amber-950/30 hover:shadow-2xl hover:shadow-amber-900/40 transition-all duration-300 hover:-translate-y-1 border border-amber-700/40">
      {/* Vintage Paper Texture */}
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')]" />

      {/* Corner Flourishes */}
      <div className="absolute top-1.5 left-1.5 w-6 h-6 border-l-2 border-t-2 border-amber-600/40 rounded-tl pointer-events-none" />
      <div className="absolute top-1.5 right-1.5 w-6 h-6 border-r-2 border-t-2 border-amber-600/40 rounded-tr pointer-events-none" />
      <div className="absolute bottom-1.5 left-1.5 w-6 h-6 border-l-2 border-b-2 border-amber-600/40 rounded-bl pointer-events-none" />
      <div className="absolute bottom-1.5 right-1.5 w-6 h-6 border-r-2 border-b-2 border-amber-600/40 rounded-br pointer-events-none" />

      {/* Vintage Corner Badge */}
      <div className="absolute top-3 left-3 z-10">
        <div className="p-1.5 bg-gradient-to-br from-amber-700 to-amber-900 rounded-lg shadow-lg border border-amber-600/50 group-hover:scale-110 transition-transform duration-300">
          <BookOpen className="h-3.5 w-3.5 text-amber-200" />
        </div>
      </div>

      {/* Book Image with Vintage Frame */}
      <div className="relative aspect-[3/4] overflow-hidden m-2 rounded-lg border border-amber-700/30">
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Warm Vintage Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-amber-950/60 via-transparent to-amber-900/20" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-amber-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Discount Badge - Vintage Seal */}
        {discount > 0 && (
          <div className="absolute top-2 right-2 z-10">
            <div className="relative bg-gradient-to-br from-amber-700 to-amber-900 text-amber-100 px-3 py-1.5 rounded-lg shadow-lg border border-amber-500/50">
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-amber-400 animate-pulse" />
              <span className="text-sm font-bold">{discount}% OFF</span>
            </div>
          </div>
        )}

        {/* Condition Badge */}
        {book.condition === "old" && (
          <div className="absolute top-2 left-10 z-10">
            <Badge className="bg-stone-800/90 text-amber-200 border border-amber-600/40 text-xs">
              ✦ Pre-loved
            </Badge>
          </div>
        )}

        {/* Bottom Gold Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-600/60 to-transparent" />
      </div>

      {/* Book Info - Vintage Typography */}
      <div className="p-4 pt-2 space-y-3 relative">
        {/* Decorative Sparkle */}
        <Sparkles className="absolute top-2 right-3 h-3 w-3 text-amber-500/30 animate-pulse" />
        
        <div>
          {/* Category Badge - Vintage Style */}
          <Badge className="text-xs mb-2 bg-gradient-to-r from-amber-800/80 to-stone-800/80 text-amber-200 border border-amber-600/40 shadow-sm">
            {book.category}
          </Badge>
          
          {/* Title - Elegant Font */}
          <h3 className="font-playfair font-bold text-amber-50 line-clamp-2 group-hover:text-amber-300 transition-colors leading-tight">
            {book.title}
          </h3>
          
          {/* Author */}
          <p className="text-sm text-amber-200/60 mt-1 font-inter">{book.author}</p>
        </div>

        {/* Decorative Divider */}
        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-gradient-to-r from-amber-700/40 to-transparent" />
          <Sparkles className="h-2.5 w-2.5 text-amber-500/40" />
          <div className="h-px flex-1 bg-gradient-to-l from-amber-700/40 to-transparent" />
        </div>

        {/* Pricing - Vintage Gold */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-playfair font-bold bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">
            ₹{book.price}
          </span>
          <span className="text-sm text-amber-400/50 line-through">₹{book.oldPrice}</span>
        </div>

        {/* Action Buttons - Vintage Style */}
        <div className="flex gap-2 pt-1">
          <Button
            onClick={() => onAddToCart(book)}
            className="flex-1 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-amber-50 shadow-lg shadow-amber-900/40 hover:shadow-xl transition-all hover:scale-[1.02] border border-amber-600/50 font-medium"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
          <Button
            variant="outline"
            onClick={handleBuyNow}
            className="border-2 border-amber-600/50 text-amber-200 hover:bg-amber-800/40 hover:text-amber-100 hover:border-amber-500 transition-all bg-transparent"
          >
            Buy Now
          </Button>
        </div>
      </div>

      {/* Bottom Decorative Border */}
      <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-amber-600/30 to-transparent" />
    </div>
  );
};
