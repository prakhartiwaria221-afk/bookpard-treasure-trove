import { Book } from "@/types/book";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Gift, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BookCardProps {
  book: Book;
  onAddToCart: (book: Book) => void;
}

// Christmas category icons/emojis mapping
const getCategoryDecoration = (category: string) => {
  const decorations: Record<string, { emoji: string; color: string }> = {
    Fiction: { emoji: "📚", color: "bg-christmas-red text-white" },
    "Non-Fiction": { emoji: "📖", color: "bg-christmas-green text-white" },
    Mystery: { emoji: "🔍", color: "bg-purple-600 text-white" },
    Romance: { emoji: "💝", color: "bg-pink-500 text-white" },
    Horror: { emoji: "👻", color: "bg-gray-800 text-white" },
    Fantasy: { emoji: "✨", color: "bg-christmas-gold text-black" },
    "Children's": { emoji: "🎄", color: "bg-christmas-green text-white" },
    Educational: { emoji: "🎓", color: "bg-blue-600 text-white" },
    Biography: { emoji: "⭐", color: "bg-christmas-gold text-black" },
    "Self-Help": { emoji: "🌟", color: "bg-christmas-red text-white" },
  };
  return decorations[category] || { emoji: "📕", color: "bg-christmas-red text-white" };
};

export const BookCard = ({ book, onAddToCart }: BookCardProps) => {
  const discount = Math.round(((book.oldPrice - book.price) / book.oldPrice) * 100);
  const categoryDecor = getCategoryDecoration(book.category);

  return (
    <div className="group relative bg-card rounded-2xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 hover:-translate-y-1 border border-border/50">
      {/* Christmas Corner Decoration */}
      <div className="absolute -top-1 -right-1 z-10">
        <div className="w-16 h-16 overflow-hidden">
          <div className="absolute top-2 right-[-30px] w-[100px] bg-gradient-to-r from-christmas-red to-christmas-red-light text-white text-xs font-bold py-1 rotate-45 text-center shadow-lg">
            🎄 GIFT
          </div>
        </div>
      </div>

      {/* Book Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Sparkle overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-christmas-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount > 0 && (
            <Badge className="bg-christmas-red text-white font-bold shadow-lg animate-pulse">
              <Gift className="w-3 h-3 mr-1" />
              {discount}% OFF
            </Badge>
          )}
          {book.condition === "old" && (
            <Badge className="bg-christmas-green text-white shadow-lg">
              <Sparkles className="w-3 h-3 mr-1" />
              Pre-loved
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-christmas-red hover:text-white hover:scale-110 shadow-lg">
          <Heart className="h-4 w-4" />
        </button>

        {/* Bottom decorative ribbon */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-christmas-red via-christmas-gold to-christmas-green" />
      </div>

      {/* Book Info */}
      <div className="p-5 space-y-3 relative">
        {/* Subtle snowflake decoration */}
        <div className="absolute top-2 right-2 text-christmas-gold/30 text-2xl">❄</div>
        
        <div>
          <Badge 
            className={`text-xs mb-2 ${categoryDecor.color} shadow-sm hover:scale-105 transition-transform`}
          >
            <span className="mr-1">{categoryDecor.emoji}</span>
            {book.category}
          </Badge>
          <h3 className="font-bold text-foreground line-clamp-2 group-hover:text-christmas-red transition-colors">
            {book.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{book.author}</p>
        </div>

        {/* Pricing with Christmas styling */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-christmas-red">₹{book.price}</span>
          <span className="text-sm text-muted-foreground line-through">₹{book.oldPrice}</span>
          <span className="text-xs text-christmas-green font-semibold ml-auto">🎁 Free Gift Wrap</span>
        </div>

        {/* Actions with Christmas gradient */}
        <div className="flex gap-2">
          <Button
            onClick={() => onAddToCart(book)}
            className="flex-1 bg-gradient-to-r from-christmas-red to-christmas-red-dark hover:from-christmas-red-dark hover:to-christmas-red text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
          <Button
            variant="outline"
            className="border-christmas-green text-christmas-green hover:bg-christmas-green hover:text-white transition-all hover:scale-105"
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
};
