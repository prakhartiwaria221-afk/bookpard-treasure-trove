import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Book } from "@/types/book";
import { booksData } from "@/data/books";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, User, Search } from "lucide-react";

interface SearchSuggestionsProps {
  query: string;
  isVisible: boolean;
  onSelect: (book: Book) => void;
  onClose: () => void;
}

export const SearchSuggestions = ({ query, isVisible, onSelect, onClose }: SearchSuggestionsProps) => {
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [suggestions, setSuggestions] = useState<Book[]>([]);
  const navigate = useNavigate();

  // Fetch books from database
  useEffect(() => {
    const fetchBooks = async () => {
      const { data: adminBooks } = await supabase.from("books").select("*");
      const { data: userListings } = await supabase.rpc("get_public_user_listings");

      const dbBooks: Book[] = [
        ...(adminBooks?.map((book) => ({
          id: book.id,
          title: book.title,
          author: book.author,
          category: book.category,
          price: book.price,
          oldPrice: book.old_price,
          image: book.image_url,
          condition: book.condition as "new" | "old",
          description: book.description || "",
        })) || []),
        ...(userListings?.map((listing) => ({
          id: listing.id,
          title: listing.title,
          author: listing.author,
          category: listing.category,
          price: listing.price,
          oldPrice: listing.price,
          image: listing.image_url || "/placeholder.svg",
          condition: listing.condition as "new" | "old",
          description: listing.description || "",
        })) || []),
      ];

      setAllBooks([...booksData, ...dbBooks]);
    };

    fetchBooks();
  }, []);

  // Filter suggestions based on query
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const searchLower = query.toLowerCase();
    const filtered = allBooks.filter((book) => {
      return (
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower) ||
        book.category.toLowerCase().includes(searchLower)
      );
    });

    // Limit to 6 suggestions
    setSuggestions(filtered.slice(0, 6));
  }, [query, allBooks]);

  const handleSelectBook = (book: Book) => {
    onSelect(book);
    onClose();
    // Scroll to books section on homepage
    const booksSection = document.getElementById("books-section");
    if (booksSection) {
      booksSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!isVisible || !query.trim() || suggestions.length === 0) {
    return null;
  }

  // Group by unique authors found
  const matchedAuthors = [...new Set(
    suggestions
      .filter((b) => b.author.toLowerCase().includes(query.toLowerCase()))
      .map((b) => b.author)
  )].slice(0, 2);

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden animate-fade-in">
      {/* Author suggestions */}
      {matchedAuthors.length > 0 && (
        <div className="p-2 border-b border-border">
          <p className="text-xs text-muted-foreground px-2 py-1">Authors</p>
          {matchedAuthors.map((author) => (
            <button
              key={author}
              onClick={() => {
                onSelect({ author } as Book);
                onClose();
              }}
              className="w-full flex items-center gap-2 px-2 py-2 hover:bg-muted rounded-md transition-colors text-left"
            >
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{author}</span>
            </button>
          ))}
        </div>
      )}

      {/* Book suggestions */}
      <div className="p-2">
        <p className="text-xs text-muted-foreground px-2 py-1">Books</p>
        {suggestions.map((book) => (
          <button
            key={book.id}
            onClick={() => handleSelectBook(book)}
            className="w-full flex items-center gap-3 px-2 py-2 hover:bg-muted rounded-md transition-colors text-left"
          >
            <div className="h-10 w-8 rounded overflow-hidden bg-muted flex-shrink-0">
              <img
                src={book.image}
                alt={book.title}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{book.title}</p>
              <p className="text-xs text-muted-foreground truncate">by {book.author}</p>
            </div>
            <span className="text-sm font-semibold text-primary">₹{book.price}</span>
          </button>
        ))}
      </div>

      {/* View all results */}
      <button
        onClick={() => {
          onClose();
          const booksSection = document.getElementById("books-section");
          if (booksSection) {
            booksSection.scrollIntoView({ behavior: "smooth" });
          }
        }}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-muted/50 hover:bg-muted transition-colors border-t border-border"
      >
        <Search className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          View all results for "<span className="text-foreground font-medium">{query}</span>"
        </span>
      </button>
    </div>
  );
};
