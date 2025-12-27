import { useState, useEffect, useRef, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Trash2, BookPlus, Package, Pencil, Upload, Image, BookOpen, Eye, Search, X, ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

type AllBook = {
  id: string;
  title: string;
  author: string;
  category: string;
  condition: string;
  price: number;
  old_price: number | null;
  image_url: string;
  description: string | null;
  source: 'admin' | 'user';
  created_at: string | null;
};

export default function ManageBooks() {
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [allBooks, setAllBooks] = useState<AllBook[]>([]);

  // Form states for adding books
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("new");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit modal states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editCondition, setEditCondition] = useState("new");
  const [editPrice, setEditPrice] = useState("");
  const [editOldPrice, setEditOldPrice] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editUploading, setEditUploading] = useState(false);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Search and filter states for Book Details tab
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterCondition, setFilterCondition] = useState("all");
  const [filterSource, setFilterSource] = useState("all");

  // Get unique categories from allBooks
  const categories = useMemo(() => {
    const cats = [...new Set(allBooks.map(book => book.category))];
    return cats.sort();
  }, [allBooks]);

  // Filtered books based on search and filters
  const filteredBooks = useMemo(() => {
    return allBooks.filter(book => {
      // Search filter
      const matchesSearch = searchQuery === "" || 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter
      const matchesCategory = filterCategory === "all" || book.category === filterCategory;
      
      // Condition filter
      const matchesCondition = filterCondition === "all" || book.condition === filterCondition;
      
      // Source filter
      const matchesSource = filterSource === "all" || book.source === filterSource;
      
      return matchesSearch && matchesCategory && matchesCondition && matchesSource;
    });
  }, [allBooks, searchQuery, filterCategory, filterCondition, filterSource]);

  const clearFilters = () => {
    setSearchQuery("");
    setFilterCategory("all");
    setFilterCondition("all");
    setFilterSource("all");
  };

  const hasActiveFilters = searchQuery !== "" || filterCategory !== "all" || filterCondition !== "all" || filterSource !== "all";

  useEffect(() => {
    if (!loading && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchBooks();
      fetchAllBooks();
    }
  }, [isAdmin]);

  // Real-time subscription for all books
  useEffect(() => {
    if (!isAdmin) return;

    const booksChannel = supabase
      .channel('all-books-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'books' },
        () => {
          fetchBooks();
          fetchAllBooks();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_listings' },
        () => {
          fetchAllBooks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(booksChannel);
    };
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

  const fetchAllBooks = async () => {
    // Fetch admin books
    const { data: adminBooks, error: adminError } = await supabase
      .from("books")
      .select("*")
      .order("created_at", { ascending: false });

    if (adminError) {
      console.error("Failed to fetch admin books:", adminError);
    }

    // Fetch user listings (active ones)
    const { data: userBooks, error: userError } = await supabase
      .from("user_listings")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (userError) {
      console.error("Failed to fetch user listings:", userError);
    }

    // Combine both sources
    const combined: AllBook[] = [
      ...(adminBooks || []).map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        category: book.category,
        condition: book.condition,
        price: book.price,
        old_price: book.old_price,
        image_url: book.image_url,
        description: book.description,
        source: 'admin' as const,
        created_at: book.created_at,
      })),
      ...(userBooks || []).map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        category: book.category,
        condition: book.condition,
        price: book.price,
        old_price: null,
        image_url: book.image_url || '/placeholder.svg',
        description: book.description,
        source: 'user' as const,
        created_at: book.created_at,
      })),
    ];

    // Sort by created_at
    combined.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });

    setAllBooks(combined);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `books/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('book-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      toast.error('Failed to upload image');
      return null;
    }

    const { data } = supabase.storage
      .from('book-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      let finalImageUrl = imageUrl;
      
      // Upload image if file is selected
      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (!uploadedUrl) {
          setUploading(false);
          return;
        }
        finalImageUrl = uploadedUrl;
      }

      if (!finalImageUrl) {
        toast.error("Please provide an image URL or upload an image");
        setUploading(false);
        return;
      }
      
      const { error } = await supabase.from("books").insert({
        title,
        author,
        category,
        condition,
        price: parseInt(price),
        old_price: parseInt(oldPrice),
        image_url: finalImageUrl,
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
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchBooks();
      }
    } finally {
      setUploading(false);
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

  const openEditDialog = (book: Book) => {
    setEditingBook(book);
    setEditTitle(book.title);
    setEditAuthor(book.author);
    setEditCategory(book.category);
    setEditCondition(book.condition);
    setEditPrice(book.price.toString());
    setEditOldPrice(book.old_price.toString());
    setEditImageUrl(book.image_url);
    setEditDescription(book.description || "");
    setEditDialogOpen(true);
  };

  const handleEditBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;
    setEditUploading(true);

    try {
      let finalImageUrl = editImageUrl;
      
      // Upload new image if file is selected
      if (editImageFile) {
        const uploadedUrl = await uploadImage(editImageFile);
        if (!uploadedUrl) {
          setEditUploading(false);
          return;
        }
        finalImageUrl = uploadedUrl;
      }

      const { error } = await supabase
        .from("books")
        .update({
          title: editTitle,
          author: editAuthor,
          category: editCategory,
          condition: editCondition,
          price: parseInt(editPrice),
          old_price: parseInt(editOldPrice),
          image_url: finalImageUrl,
          description: editDescription || null,
        })
        .eq("id", editingBook.id);

      if (error) {
        toast.error("Failed to update book");
        console.error(error);
      } else {
        toast.success("Book updated successfully!");
        setEditDialogOpen(false);
        setEditingBook(null);
        setEditImageFile(null);
        if (editFileInputRef.current) editFileInputRef.current.value = "";
        fetchBooks();
      }
    } finally {
      setEditUploading(false);
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
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="hover:bg-primary/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-4xl font-bold text-foreground animate-fade-in">
              Manage Books
            </h1>
          </div>

          <Tabs defaultValue="add-books" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="add-books" className="flex items-center gap-2">
                <BookPlus className="h-4 w-4" />
                Add Books
              </TabsTrigger>
              <TabsTrigger value="inventory" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Inventory
              </TabsTrigger>
              <TabsTrigger value="book-details" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Book Details
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

                    <div className="space-y-4">
                      <Label>Book Image *</Label>
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2"
                          >
                            <Upload className="h-4 w-4" />
                            Upload Image
                          </Button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setImageFile(file);
                                setImageUrl("");
                              }
                            }}
                            className="hidden"
                          />
                          {imageFile && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Image className="h-4 w-4" />
                              {imageFile.name}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">or</span>
                        </div>
                        <Input
                          id="imageUrl"
                          type="url"
                          value={imageUrl}
                          onChange={(e) => {
                            setImageUrl(e.target.value);
                            setImageFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                          placeholder="Enter image URL"
                          disabled={!!imageFile}
                        />
                      </div>
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
                      disabled={uploading}
                      className="w-full bg-gradient-to-r from-primary to-coral-dark hover:opacity-90"
                    >
                      {uploading ? "Adding..." : "Add Book to Inventory"}
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
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg";
                            }}
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
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => openEditDialog(book)}
                              className="text-primary hover:bg-primary/10"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Book</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{book.title}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteBook(book.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Book Details Tab */}
            <TabsContent value="book-details">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    All Book Details
                  </CardTitle>
                  <CardDescription>
                    View complete details and pricing of all {allBooks.length} books on your website (updates in real-time)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Search and Filter Controls */}
                  <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by title or author..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-10"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-3">
                      <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={filterCondition} onValueChange={setFilterCondition}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Conditions</SelectItem>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="old">Used</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={filterSource} onValueChange={setFilterSource}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Sources</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="user">User Listing</SelectItem>
                        </SelectContent>
                      </Select>

                      {hasActiveFilters && (
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="h-10">
                          <X className="h-4 w-4 mr-1" />
                          Clear Filters
                        </Button>
                      )}
                    </div>

                    {/* Results count */}
                    <p className="text-sm text-muted-foreground">
                      Showing {filteredBooks.length} of {allBooks.length} books
                    </p>
                  </div>

                  {allBooks.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No books available. Add your first book!
                    </p>
                  ) : filteredBooks.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No books match your search criteria. Try adjusting your filters.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredBooks.map((book) => (
                        <Card key={`${book.source}-${book.id}`} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="relative">
                            <img
                              src={book.image_url}
                              alt={book.title}
                              className="w-full h-48 object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg";
                              }}
                            />
                            <div className="absolute top-2 left-2">
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                book.source === 'admin' 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-secondary text-secondary-foreground'
                              }`}>
                                {book.source === 'admin' ? 'Admin' : 'User Listing'}
                              </span>
                            </div>
                            <div className="absolute top-2 right-2 flex gap-1">
                              <span className="text-xs px-2 py-1 rounded-full bg-background/90 text-foreground font-medium">
                                {book.condition === "new" ? "New" : "Used"}
                              </span>
                            </div>
                          </div>
                          <CardContent className="p-4 space-y-3">
                            <div>
                              <h3 className="font-bold text-foreground text-lg line-clamp-1">{book.title}</h3>
                              <p className="text-sm text-muted-foreground">by {book.author}</p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                                {book.category}
                              </span>
                            </div>

                            <div className="border-t border-border pt-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-xs text-muted-foreground">Selling Price</p>
                                  <p className="text-xl font-bold text-primary">₹{book.price}</p>
                                </div>
                                {book.old_price && (
                                  <div className="text-right">
                                    <p className="text-xs text-muted-foreground">Original Price</p>
                                    <p className="text-lg text-muted-foreground line-through">₹{book.old_price}</p>
                                  </div>
                                )}
                              </div>
                              {book.old_price && book.old_price > book.price && (
                                <p className="text-xs text-green-600 mt-1">
                                  {Math.round(((book.old_price - book.price) / book.old_price) * 100)}% off
                                </p>
                              )}
                            </div>

                            {book.description && (
                              <div className="border-t border-border pt-3">
                                <p className="text-xs text-muted-foreground mb-1">Description</p>
                                <p className="text-sm text-foreground line-clamp-2">{book.description}</p>
                              </div>
                            )}

                            {book.source === 'admin' && (
                              <div className="flex gap-2 pt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const adminBook = books.find(b => b.id === book.id);
                                    if (adminBook) openEditDialog(adminBook);
                                  }}
                                  className="flex-1"
                                >
                                  <Pencil className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-destructive hover:bg-destructive/10"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Book</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "{book.title}"? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteBook(book.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Edit Book Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
            <DialogDescription>
              Update the book details below
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditBook} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editTitle">Book Title *</Label>
                <Input
                  id="editTitle"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editAuthor">Author *</Label>
                <Input
                  id="editAuthor"
                  value={editAuthor}
                  onChange={(e) => setEditAuthor(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editCategory">Category *</Label>
                <Input
                  id="editCategory"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  placeholder="e.g., Fiction, Mystery, Romance"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editCondition">Condition *</Label>
                <Select value={editCondition} onValueChange={setEditCondition}>
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
                <Label htmlFor="editPrice">Price (₹) *</Label>
                <Input
                  id="editPrice"
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editOldPrice">Original Price (₹) *</Label>
                <Input
                  id="editOldPrice"
                  type="number"
                  value={editOldPrice}
                  onChange={(e) => setEditOldPrice(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Book Image</Label>
              {editImageUrl && !editImageFile && (
                <div className="mb-2">
                  <img 
                    src={editImageUrl} 
                    alt="Current cover" 
                    className="w-20 h-24 object-cover rounded border"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Current image</p>
                </div>
              )}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => editFileInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload New Image
                  </Button>
                  <input
                    ref={editFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setEditImageFile(file);
                      }
                    }}
                    className="hidden"
                  />
                  {editImageFile && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Image className="h-4 w-4" />
                      {editImageFile.name}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">or update URL</span>
                </div>
                <Input
                  id="editImageUrl"
                  type="url"
                  value={editImageUrl}
                  onChange={(e) => {
                    setEditImageUrl(e.target.value);
                    setEditImageFile(null);
                    if (editFileInputRef.current) editFileInputRef.current.value = "";
                  }}
                  placeholder="Enter image URL"
                  disabled={!!editImageFile}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="editDescription">Description</Label>
              <Input
                id="editDescription"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Optional book description"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={editUploading}
                className="bg-gradient-to-r from-primary to-coral-dark hover:opacity-90"
              >
                {editUploading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
