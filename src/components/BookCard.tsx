import { Book } from "@/types/book";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BookCardProps {
  book: Book;
  onAddToCart: (book: Book) => void;
}

export const BookCard = ({ book, onAddToCart }: BookCardProps) => {
  const discount = Math.round(((book.oldPrice - book.price) / book.oldPrice) * 100);

  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 hover:-translate-y-1">
      {/* Book Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount > 0 && (
            <Badge className="bg-destructive text-destructive-foreground font-bold">
              {discount}% OFF
            </Badge>
          )}
          {book.condition === "old" && (
            <Badge className="bg-secondary text-secondary-foreground">
              Used
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary hover:text-primary-foreground">
          <Heart className="h-4 w-4" />
        </button>
      </div>

      {/* Book Info */}
      <div className="p-5 space-y-3">
        <div>
          <Badge variant="outline" className="text-xs mb-2">
            {book.category}
          </Badge>
          <h3 className="font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {book.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{book.author}</p>
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">₹{book.price}</span>
          <span className="text-sm text-muted-foreground line-through">₹{book.oldPrice}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={() => onAddToCart(book)}
            className="flex-1 bg-gradient-to-r from-primary to-coral-dark hover:opacity-90 transition-opacity"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
};
