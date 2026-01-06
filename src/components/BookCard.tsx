import { Book } from "@/types/book";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Sun } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface BookCardProps {
  book: Book;
  onAddToCart: (book: Book) => void;
}

// Makar Sankranti category icons/emojis mapping
const getCategoryDecoration = (category: string) => {
  const decorations: Record<string, { emoji: string; color: string }> = {
    Fiction: { emoji: "📚", color: "bg-sankranti-sky text-white" },
    "Non-Fiction": { emoji: "📖", color: "bg-sankranti-saffron text-white" },
    Mystery: { emoji: "🔍", color: "bg-kite-purple text-white" },
    Romance: { emoji: "💝", color: "bg-kite-pink text-white" },
    Horror: { emoji: "👻", color: "bg-gray-800 text-white" },
    Fantasy: { emoji: "✨", color: "bg-sankranti-yellow text-black" },
    "Children's": { emoji: "🪁", color: "bg-kite-red text-white" },
    Educational: { emoji: "🎓", color: "bg-sankranti-sky-dark text-white" },
    Biography: { emoji: "⭐", color: "bg-sankranti-saffron-dark text-white" },
    "Self-Help": { emoji: "🌟", color: "bg-kite-green text-white" },
  };
  return decorations[category] || { emoji: "📕", color: "bg-sankranti-saffron text-white" };
};

export const BookCard = ({ book, onAddToCart }: BookCardProps) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const discount = Math.round(((book.oldPrice - book.price) / book.oldPrice) * 100);
  const categoryDecor = getCategoryDecoration(book.category);

  const handleBuyNow = () => {
    addToCart(book);
    toast.success(`${book.title} added to cart!`);
    navigate("/checkout");
  };

  return (
    <div className="group relative bg-card rounded-2xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 hover:-translate-y-1 border border-border/50">
      {/* Sankranti Corner Decoration */}
      <div className="absolute -top-1 -right-1 z-10">
        <div className="w-16 h-16 overflow-hidden">
          <div className="absolute top-2 right-[-30px] w-[100px] bg-gradient-to-r from-sankranti-saffron to-sankranti-yellow text-white text-xs font-bold py-1 rotate-45 text-center shadow-lg">
            🪁 2026
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
        
        {/* Saffron overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-sankranti-saffron/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount > 0 && (
            <Badge className="bg-sankranti-saffron text-white font-bold shadow-lg animate-pulse">
              <Sun className="w-3 h-3 mr-1" />
              {discount}% OFF
            </Badge>
          )}
          {book.condition === "old" && (
            <Badge className="bg-sankranti-yellow text-black shadow-lg">
              🪁 Pre-loved
            </Badge>
          )}
        </div>


        {/* Bottom decorative ribbon */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-sankranti-saffron via-sankranti-yellow to-sankranti-sky" />
      </div>

      {/* Book Info */}
      <div className="p-5 space-y-3 relative">
        {/* Subtle sun decoration */}
        <div className="absolute top-2 right-2 text-sankranti-saffron/30 text-2xl">☀️</div>
        
        <div>
          <Badge 
            className={`text-xs mb-2 ${categoryDecor.color} shadow-sm hover:scale-105 transition-transform`}
          >
            <span className="mr-1">{categoryDecor.emoji}</span>
            {book.category}
          </Badge>
          <h3 className="font-bold text-foreground line-clamp-2 group-hover:text-sankranti-saffron transition-colors">
            {book.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{book.author}</p>
        </div>

        {/* Pricing with Sankranti styling */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-sankranti-saffron">₹{book.price}</span>
          <span className="text-sm text-muted-foreground line-through">₹{book.oldPrice}</span>
          <span className="text-xs text-sankranti-saffron-dark font-semibold ml-auto">🪁 Free Gift</span>
        </div>

        {/* Actions with Sankranti gradient */}
        <div className="flex gap-2">
          <Button
            onClick={() => onAddToCart(book)}
            className="flex-1 bg-gradient-to-r from-sankranti-saffron to-sankranti-saffron-dark hover:from-sankranti-saffron-dark hover:to-sankranti-saffron text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
          <Button
            variant="outline"
            onClick={handleBuyNow}
            className="border-sankranti-sky text-sankranti-sky hover:bg-sankranti-sky hover:text-white transition-all hover:scale-105"
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
};