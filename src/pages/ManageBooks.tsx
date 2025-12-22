import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Trash2, BookPlus, Package } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  condition: string;
  price: number;
  old_price: number;
  image_url: string;
  description: string | null;
};

export default function ManageBooks() {
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);

  // Form states for adding books
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("new");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!loading && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchBooks();
    }
  }, [isAdmin]);

  const fetchBooks = async () => {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch books");
      console.error(error);
    } else {
      setBooks(data || []);
    }
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase.from("books").insert({
      title,
      author,
      category,
      condition,
      price: parseInt(price),
      old_price: parseInt(oldPrice),
      image_url: imageUrl,
      description: description || null,
      created_by: user?.id || null,
    });

    if (error) {
      toast.error("Failed to add book");
      console.error(error);
    } else {
      toast.success("Book added successfully!");
      setTitle("");
      setAuthor("");
      setCategory("");
      setCondition("new");
      setPrice("");
      setOldPrice("");
      setImageUrl("");
      setDescription("");
      fetchBooks();
    }
  };

  const handleDeleteBook = async (id: string) => {
    const { error } = await supabase.from("books").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete book");
      console.error(error);
    } else {
      toast.success("Book deleted successfully!");
      fetchBooks();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemCount={0} onSearchChange={() => {}} />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8 animate-fade-in">
            Manage Books
          </h1>

          <Tabs defaultValue="add-books" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="add-books" className="flex items-center gap-2">
                <BookPlus className="h-4 w-4" />
                Add Books
              </TabsTrigger>
              <TabsTrigger value="inventory" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Inventory
              </TabsTrigger>
            </TabsList>

            {/* Add Books Tab */}
            <TabsContent value="add-books">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Book</CardTitle>
                  <CardDescription>
                    Add books to the main inventory that will be available for purchase
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddBook} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Book Title *</Label>
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="author">Author *</Label>
                        <Input
                          id="author"
                          value={author}
                          onChange={(e) => setAuthor(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Input
                          id="category"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          placeholder="e.g., Fiction, Mystery, Romance"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="condition">Condition *</Label>
                        <Select value={condition} onValueChange={setCondition}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="old">Old</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="price">Price (₹) *</Label>
                        <Input
                          id="price"
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="oldPrice">Original Price (₹) *</Label>
                        <Input
                          id="oldPrice"
                          type="number"
                          value={oldPrice}
                          onChange={(e) => setOldPrice(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="imageUrl">Image URL *</Label>
                      <Input
                        id="imageUrl"
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/book-cover.jpg"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Optional book description"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary to-coral-dark hover:opacity-90"
                    >
                      Add Book to Inventory
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Inventory Tab */}
            <TabsContent value="inventory">
              <Card>
                <CardHeader>
                  <CardTitle>Book Inventory</CardTitle>
                  <CardDescription>
                    Manage all books in your inventory ({books.length} books)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {books.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No books in inventory. Add your first book!
                      </p>
                    ) : (
                      books.map((book) => (
                        <div
                          key={book.id}
                          className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <img
                            src={book.image_url}
                            alt={book.title}
                            className="w-16 h-20 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h3 className="font-bold text-foreground">{book.title}</h3>
                            <p className="text-sm text-muted-foreground">{book.author}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                                {book.category}
                              </span>
                              <span className="text-xs px-2 py-1 rounded-full bg-muted">
                                {book.condition}
                              </span>
                              <span className="text-sm font-bold text-primary">₹{book.price}</span>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteBook(book.id)}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}