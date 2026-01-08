import { useState, useMemo, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { CategoryFilter } from "@/components/CategoryFilter";
import { FilterControls } from "@/components/FilterControls";
import { BookCard } from "@/components/BookCard";
import { BookSection } from "@/components/BookSection";
import { SankrantiBanner } from "@/components/SankrantiBanner";
import { KiteEffect } from "@/components/KiteEffect";
import { useCart } from "@/hooks/useCart";
import { booksData, bookCollections } from "@/data/books";
import { SortOption, FilterCondition, Book } from "@/types/book";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useFireworks } from "@/contexts/FireworksContext";
import { Sun, Heart } from "lucide-react";

const Index = () => {
  const { addToCart, totalItems } = useCart();
  const { triggerFireworks } = useFireworks();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Books");
  const [sortBy, setSortBy] = useState<SortOption>("price-low");
  const [filterCondition, setFilterCondition] = useState<FilterCondition>("all");
  const [userListings, setUserListings] = useState<Book[]>([]);
  const [adminBooks, setAdminBooks] = useState<Book[]>([]);
  const [showKites, setShowKites] = useState(true);

  // Auto-hide kites after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowKites(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch admin books from database
  useEffect(() => {
    const fetchAdminBooks = async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*");

      if (error) {
        console.error("Error fetching books:", error);
        return;
      }

      if (data) {
        const mappedBooks: Book[] = data.map((book) => ({
          id: book.id,
          title: book.title,
          author: book.author,
          category: book.category,
          price: book.price,
          oldPrice: book.old_price,
          image: book.image_url,
          condition: (book.condition === "new" ? "new" : "old") as "new" | "old",
          description: book.description || "",
        }));
        setAdminBooks(mappedBooks);
      }
    };

    fetchAdminBooks();
  }, []);

  // Fetch user listings from database using secure function (excludes contact info)
  useEffect(() => {
    const fetchUserListings = async () => {
      const { data, error } = await supabase
        .rpc("get_public_user_listings");

      if (error) {
        console.error("Error fetching user listings:", error);
        return;
      }

      if (data) {
        const mappedListings: Book[] = data.map((listing) => ({
          id: listing.id || "",
          title: listing.title || "",
          author: listing.author || "",
          category: listing.category || "",
          price: listing.price || 0,
          oldPrice: listing.price || 0,
          image: listing.image_url || "/placeholder.svg",
          condition: (listing.condition === "excellent" ? "new" : "old") as "new" | "old",
          description: listing.description || "",
        }));
        setUserListings(mappedListings);
      }
    };

    fetchUserListings();
  }, []);

  // Combine static books with admin books and user listings
  const allBooks = useMemo(() => {
    return [...booksData, ...adminBooks, ...userListings];
  }, [adminBooks, userListings]);

  const filteredAndSortedBooks = useMemo(() => {
    let filtered = [...allBooks];

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
      } else if (selectedCategory === "Collection") {
        // For Collection, include books that belong to any defined collection
        filtered = filtered.filter((book) => {
          const titleLower = book.title.toLowerCase();
          const authorLower = book.author.toLowerCase();
          return bookCollections.some((collection) =>
            collection.keywords.some((keyword) =>
              titleLower.includes(keyword) || authorLower.includes(keyword)
            )
          );
        });
      } else {
        // Case-insensitive category matching
        filtered = filtered.filter(
          (book) => book.category.toLowerCase() === selectedCategory.toLowerCase()
        );
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
  }, [searchQuery, selectedCategory, sortBy, filterCondition, allBooks]);

  // Categorized book sections - works for both All Books and specific categories
  const bookSections = useMemo(() => {
    // Use filtered books based on current category selection
    const baseBooks = filteredAndSortedBooks;
    const baseAdminBooks = adminBooks.filter((book) => {
      if (selectedCategory === "All Books") return true;
      if (selectedCategory === "New Books") return book.condition === "new";
      if (selectedCategory === "Old Books") return book.condition === "old";
      if (selectedCategory === "Collection") {
        const titleLower = book.title.toLowerCase();
        const authorLower = book.author.toLowerCase();
        return bookCollections.some((collection) =>
          collection.keywords.some((keyword) =>
            titleLower.includes(keyword) || authorLower.includes(keyword)
          )
        );
      }
      return book.category.toLowerCase() === selectedCategory.toLowerCase();
    });
    const baseUserListings = userListings.filter((book) => {
      if (selectedCategory === "All Books") return true;
      if (selectedCategory === "New Books") return book.condition === "new";
      if (selectedCategory === "Old Books") return book.condition === "old";
      if (selectedCategory === "Collection") {
        const titleLower = book.title.toLowerCase();
        const authorLower = book.author.toLowerCase();
        return bookCollections.some((collection) =>
          collection.keywords.some((keyword) =>
            titleLower.includes(keyword) || authorLower.includes(keyword)
          )
        );
      }
      return book.category.toLowerCase() === selectedCategory.toLowerCase();
    });

    // Collection groups - group books by their collection
    const collectionGroups = bookCollections.map((collection) => {
      const booksInCollection = baseBooks.filter((book) => {
        const titleLower = book.title.toLowerCase();
        const authorLower = book.author.toLowerCase();
        return collection.keywords.some((keyword) =>
          titleLower.includes(keyword) || authorLower.includes(keyword)
        );
      });
      // Sort books within collection by title for proper ordering (Part 1, Part 2, etc.)
      booksInCollection.sort((a, b) => a.title.localeCompare(b.title));
      return {
        ...collection,
        books: booksInCollection,
      };
    }).filter((collection) => collection.books.length > 0);

    // Popular Series - Books that are part of a series (Harry Potter, etc.)
    const popularSeries = baseBooks.filter(
      (book) =>
        book.title.toLowerCase().includes("harry potter") ||
        book.title.toLowerCase().includes("toy story") ||
        book.title.toLowerCase().includes("cars") ||
        book.title.toLowerCase().includes("orient express") ||
        book.title.toLowerCase().includes("collection")
    );

    // Bestsellers - Books with highest discount (oldPrice - price)
    const bestsellers = [...baseBooks]
      .filter((book) => book.oldPrice && book.oldPrice > book.price)
      .sort((a, b) => (b.oldPrice! - b.price) - (a.oldPrice! - a.price))
      .slice(0, 8);

    // Best Authors - Premium authors
    const bestAuthors = baseBooks.filter(
      (book) =>
        book.author.toLowerCase().includes("j.k. rowling") ||
        book.author.toLowerCase().includes("agatha christie") ||
        book.author.toLowerCase().includes("stephen king") ||
        book.author.toLowerCase().includes("margaret atwood") ||
        book.author.toLowerCase().includes("nicholas sparks") ||
        book.author.toLowerCase().includes("disney")
    );

    // Top Selling - Sort by lowest price (most affordable = likely top selling)
    const topSelling = [...baseBooks]
      .sort((a, b) => a.price - b.price)
      .slice(0, 8);

    // New Arrivals - Admin books and user listings (database entries are new)
    const newArrivals = [...baseAdminBooks, ...baseUserListings].slice(0, 8);

    return {
      collectionGroups,
      popularSeries,
      bestsellers,
      bestAuthors,
      topSelling,
      newArrivals,
    };
  }, [filteredAndSortedBooks, adminBooks, userListings, selectedCategory]);

  const handleAddToCart = (book: Book) => {
    addToCart(book);
    triggerFireworks("low");
    toast.success(`${book.title} added to cart!`, {
      description: "Check your cart to proceed to checkout.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Kite Effect */}
      {showKites && <KiteEffect />}
      
      {/* Sankranti Banner - Fixed at very top */}
      <div className="fixed top-0 left-0 right-0 z-[60]">
        <SankrantiBanner />
      </div>
      
      {/* Main content with adjusted padding */}
      <div className="pt-10">
        <Navbar cartItemCount={totalItems} onSearchChange={setSearchQuery} />
        
        <div className="pt-20 md:pt-24">
          <Hero />
          
          <main className="container mx-auto px-4 py-12 scroll-mt-32" id="books-section">
            {/* Sankranti Section Header */}
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center gap-3 mb-4">
                <Sun className="h-8 w-8 text-sankranti-saffron animate-sun-pulse" />
                <h2 className="text-3xl md:text-4xl font-playfair font-bold text-festive-gradient">
                  Makar Sankranti 2026 Book Collection
                </h2>
                <div className="h-8 w-8 animate-kite-sway">
                  <svg viewBox="0 0 24 30" className="w-full h-full" fill="hsl(var(--kite-red))">
                    <path d="M12 0L24 12L12 30L0 12L12 0Z" />
                  </svg>
                </div>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Celebrate Sankranti with amazing reads! Explore our curated collection of books at special festive prices.
              </p>
            </div>

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

            {/* Category Title */}
            {!searchQuery && (
              <div className="mb-6 flex items-center gap-3">
                <Sun className="h-6 w-6 text-sankranti-saffron" />
                <h2 className="text-2xl font-playfair font-bold text-foreground">
                  {selectedCategory}
                  <span className="text-muted-foreground font-inter font-normal text-base ml-2">
                    ({filteredAndSortedBooks.length} books)
                  </span>
                </h2>
              </div>
            )}

            {/* Search Results - only show grid */}
            {searchQuery && (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-playfair font-bold text-foreground">
                    Search Results
                    <span className="text-muted-foreground font-inter font-normal text-base ml-2">
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
              </>
            )}

            {/* Show Collection Groups when Collection category is selected */}
            {!searchQuery && selectedCategory === "Collection" && filteredAndSortedBooks.length > 0 && (
              <div className="animate-fade-in space-y-6">
                {bookSections.collectionGroups.map((collection) => (
                  <BookSection
                    key={collection.id}
                    title={`📚 ${collection.name}`}
                    books={collection.books}
                    onAddToCart={handleAddToCart}
                    icon="library"
                    variant="featured"
                  />
                ))}
              </div>
            )}

            {/* Show organized sections for all categories (not during search, not Collection) */}
            {!searchQuery && selectedCategory !== "Collection" && filteredAndSortedBooks.length > 0 && (
              <div className="animate-fade-in space-y-4">
                {/* New Arrivals Section */}
                {bookSections.newArrivals.length > 0 && (
                  <BookSection
                    title="✨ New Arrivals"
                    books={bookSections.newArrivals}
                    onAddToCart={handleAddToCart}
                    icon="clock"
                    variant="new"
                  />
                )}

                {/* Popular Series */}
                {bookSections.popularSeries.length > 0 && (
                  <BookSection
                    title="🪁 Popular Series"
                    books={bookSections.popularSeries}
                    onAddToCart={handleAddToCart}
                    icon="sparkles"
                    variant="featured"
                  />
                )}

                {/* Bestsellers */}
                {bookSections.bestsellers.length > 0 && (
                  <BookSection
                    title="🏆 Bestsellers"
                    books={bookSections.bestsellers}
                    onAddToCart={handleAddToCart}
                    icon="trophy"
                    variant="default"
                  />
                )}

                {/* Best Authors */}
                {bookSections.bestAuthors.length > 0 && (
                  <BookSection
                    title="⭐ Best Authors"
                    books={bookSections.bestAuthors}
                    onAddToCart={handleAddToCart}
                    icon="star"
                    variant="featured"
                  />
                )}

                {/* Top Selling */}
                {bookSections.topSelling.length > 0 && (
                  <BookSection
                    title="📈 Top Selling"
                    books={bookSections.topSelling}
                    onAddToCart={handleAddToCart}
                    icon="trending"
                    variant="default"
                  />
                )}
              </div>
            )}

            {/* Empty state */}
            {!searchQuery && filteredAndSortedBooks.length === 0 && (
              <div className="text-center py-16 animate-fade-in">
                <p className="text-xl text-muted-foreground">No books found in this category.</p>
              </div>
            )}
          </main>

          {/* Footer - Sankranti Themed */}
          <footer className="relative bg-gradient-to-b from-card to-sankranti-saffron/10 dark:to-sankranti-saffron-dark/20 border-t border-sankranti-saffron/20 mt-16 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 pointer-events-none">
              <Sun className="absolute top-8 left-[10%] h-4 w-4 text-sankranti-saffron/20 animate-sun-pulse" />
              <Sun className="absolute top-12 right-[15%] h-3 w-3 text-sun-glow/25 animate-sun-pulse" style={{ animationDelay: "0.5s" }} />
              <div className="absolute bottom-20 left-[20%] h-4 w-4 animate-kite-sway" style={{ animationDelay: "1s" }}>
                <svg viewBox="0 0 16 20" className="w-full h-full opacity-15" fill="hsl(var(--kite-blue))">
                  <path d="M8 0L16 10L8 20L0 10L8 0Z" />
                </svg>
              </div>
            </div>
            
            <div className="container mx-auto px-4 py-12 relative z-10">
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h3 className="font-playfair font-bold text-foreground mb-4 flex items-center gap-2">
                    <Sun className="h-4 w-4 text-sankranti-saffron" />
                    About BookPard
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Your trusted marketplace for buying and selling books. Celebrate Makar Sankranti 2026 with amazing deals on books for all ages!
                  </p>
                </div>
                <div>
                  <h3 className="font-playfair font-bold text-foreground mb-4 flex items-center gap-2">
                    <div className="h-4 w-4">
                      <svg viewBox="0 0 16 20" className="w-full h-full" fill="hsl(var(--sankranti-saffron))">
                        <path d="M8 0L16 10L8 20L0 10L8 0Z" />
                      </svg>
                    </div>
                    Quick Links
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="/" className="hover:text-sankranti-saffron transition-colors">Home</a></li>
                    <li><a href="/#books-section" className="hover:text-sankranti-saffron transition-colors">Books</a></li>
                    <li><a href="/sell" className="hover:text-sankranti-saffron transition-colors">Sell Books</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-playfair font-bold text-foreground mb-4 flex items-center gap-2">
                    <Heart className="h-4 w-4 text-kite-pink" />
                    Contact Us
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Email: prakhartiwaria221@gmail.com<br />
                    Phone: +919111415672
                  </p>
                </div>
              </div>
              
              {/* Sankranti Footer Message */}
              <div className="mt-8 pt-8 border-t border-sankranti-saffron/20 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sun className="h-4 w-4 text-sankranti-saffron" />
                  <span className="font-dancing text-lg text-sankranti-saffron">Happy Makar Sankranti 2026!</span>
                  <div className="h-4 w-4 animate-kite-sway">
                    <svg viewBox="0 0 16 20" className="w-full h-full" fill="hsl(var(--kite-red))">
                      <path d="M8 0L16 10L8 20L0 10L8 0Z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  © 2026 BookPard. All rights reserved. Made with <Heart className="inline h-3 w-3 text-kite-pink fill-kite-pink" /> for book lovers.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Index;