import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { CategoryFilter } from "@/components/CategoryFilter";
import { FilterControls } from "@/components/FilterControls";
import { BookCard } from "@/components/BookCard";
import { useCart } from "@/hooks/useCart";
import { booksData } from "@/data/books";
import { SortOption, FilterCondition, Book } from "@/types/book";
import { toast } from "sonner";

const Index = () => {
  const { addToCart, totalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Books");
  const [sortBy, setSortBy] = useState<SortOption>("price-low");
  const [filterCondition, setFilterCondition] = useState<FilterCondition>("all");

  const filteredAndSortedBooks = useMemo(() => {
    let filtered = [...booksData];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "All Books") {
      if (selectedCategory === "New Books") {
        filtered = filtered.filter((book) => book.condition === "new");
      } else if (selectedCategory === "Old Books") {
        filtered = filtered.filter((book) => book.condition === "old");
      } else {
        filtered = filtered.filter((book) => book.category === selectedCategory);
      }
    }

    // Condition filter
    if (filterCondition !== "all") {
      filtered = filtered.filter((book) => book.condition === filterCondition);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, sortBy, filterCondition]);

  const handleAddToCart = (book: Book) => {
    addToCart(book);
    toast.success(`${book.title} added to cart!`, {
      description: "Check your cart to proceed to checkout.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemCount={totalItems} onSearchChange={setSearchQuery} />
      <Hero />
      
      <main className="container mx-auto px-4 py-12" id="books-section">
        {/* Filters */}
        <div className="space-y-6 mb-8 animate-fade-in">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          <FilterControls
            sortBy={sortBy}
            onSortChange={setSortBy}
            filterCondition={filterCondition}
            onConditionChange={setFilterCondition}
          />
        </div>

        {/* Books Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            {selectedCategory === "All Books" ? "All Books" : selectedCategory}
            <span className="text-muted-foreground font-normal ml-2">
              ({filteredAndSortedBooks.length} books)
            </span>
          </h2>
        </div>

        {filteredAndSortedBooks.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <p className="text-xl text-muted-foreground">No books found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
            {filteredAndSortedBooks.map((book) => (
              <BookCard key={book.id} book={book} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-foreground mb-4">About BookPard</h3>
              <p className="text-muted-foreground text-sm">
                Your trusted marketplace for buying and selling books. Affordable prices for all age groups.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
                <li><a href="/" className="hover:text-primary transition-colors">Books</a></li>
                <li><a href="/sell" className="hover:text-primary transition-colors">Sell Books</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-4">Contact Us</h3>
              <p className="text-muted-foreground text-sm">
                Email: prakhartiwaria221@gmail.com<br />
                Phone: +919111415672
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2024 BookPard. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
