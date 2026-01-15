import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import { toast } from "sonner";
import { ArrowLeft, Crown, Sparkles, TrendingUp, Clock, Trash2, Plus, Loader2 } from "lucide-react";

type Book = {
  id: string;
  title: string;
  author: string;
  image_url: string;
};

type FeaturedBook = {
  id: string;
  book_id: string;
  feature_type: string;
  title: string | null;
  description: string | null;
  is_active: boolean;
  start_date: string;
  end_date: string | null;
  book: Book;
};

const featureTypes = [
  { value: "book_of_week", label: "Book of the Week", icon: Crown },
  { value: "staff_pick", label: "Staff Pick", icon: Sparkles },
  { value: "trending", label: "Trending", icon: TrendingUp },
  { value: "new_arrival", label: "New Arrival", icon: Clock },
];

export default function ManageFeaturedBooks() {
  const { isAdmin, loading: authLoading } = useAdmin();
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [featuredBooks, setFeaturedBooks] = useState<FeaturedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [selectedBook, setSelectedBook] = useState("");
  const [featureType, setFeatureType] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchBooks();
      fetchFeaturedBooks();
    }
  }, [isAdmin]);

  const fetchBooks = async () => {
    const { data, error } = await supabase
      .from("books")
      .select("id, title, author, image_url")
      .order("title");

    if (error) {
      console.error("Error fetching books:", error);
    } else {
      setBooks(data || []);
    }
  };

  const fetchFeaturedBooks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("featured_books")
      .select(`
        id,
        book_id,
        feature_type,
        title,
        description,
        is_active,
        start_date,
        end_date,
        book:books!inner(id, title, author, image_url)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching featured books:", error);
    } else {
      setFeaturedBooks((data as any) || []);
    }
    setLoading(false);
  };

  const handleAddFeatured = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBook || !featureType) {
      toast.error("Please select a book and feature type");
      return;
    }

    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase.from("featured_books").insert({
        book_id: selectedBook,
        feature_type: featureType,
        title: customTitle.trim() || null,
        description: description.trim() || null,
        created_by: user?.id,
      });

      if (error) {
        if (error.code === "23505") {
          toast.error("This book is already featured in this category");
        } else {
          throw error;
        }
        return;
      }

      toast.success("Book featured successfully!");
      setSelectedBook("");
      setFeatureType("");
      setCustomTitle("");
      setDescription("");
      fetchFeaturedBooks();
    } catch (error) {
      console.error("Error adding featured book:", error);
      toast.error("Failed to feature book");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from("featured_books")
      .update({ is_active: isActive })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      fetchFeaturedBooks();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("featured_books")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to remove featured book");
    } else {
      toast.success("Featured book removed");
      fetchFeaturedBooks();
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">
            Manage Featured Books
          </h1>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Add Featured Book Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Feature a Book
              </CardTitle>
              <CardDescription>
                Select a book to highlight in special sections on the homepage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddFeatured} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Select Book</Label>
                    <Select value={selectedBook} onValueChange={setSelectedBook}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a book..." />
                      </SelectTrigger>
                      <SelectContent>
                        {books.map((book) => (
                          <SelectItem key={book.id} value={book.id}>
                            {book.title} - {book.author}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Feature Type</Label>
                    <Select value={featureType} onValueChange={setFeatureType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose type..." />
                      </SelectTrigger>
                      <SelectContent>
                        {featureTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="h-4 w-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Custom Title (optional)</Label>
                  <Input
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="e.g., Our Pick This Week!"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description (optional)</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Why is this book featured?"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting || !selectedBook || !featureType}
                  className="w-full"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Featured Book
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Current Featured Books */}
          <Card>
            <CardHeader>
              <CardTitle>Current Featured Books</CardTitle>
              <CardDescription>
                {featuredBooks.length} books currently featured
              </CardDescription>
            </CardHeader>
            <CardContent>
              {featuredBooks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No featured books yet. Add one above!
                </p>
              ) : (
                <div className="space-y-4">
                  {featuredBooks.map((featured) => {
                    const typeConfig = featureTypes.find(
                      (t) => t.value === featured.feature_type
                    );
                    const Icon = typeConfig?.icon || Sparkles;

                    return (
                      <div
                        key={featured.id}
                        className="flex items-center gap-4 p-4 border border-border rounded-lg"
                      >
                        <img
                          src={featured.book.image_url}
                          alt={featured.book.title}
                          className="w-16 h-20 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className="h-4 w-4 text-primary" />
                            <span className="text-xs text-primary">
                              {typeConfig?.label}
                            </span>
                          </div>
                          <h3 className="font-semibold text-foreground truncate">
                            {featured.book.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {featured.book.author}
                          </p>
                          {featured.title && (
                            <p className="text-xs text-muted-foreground mt-1">
                              "{featured.title}"
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={featured.is_active}
                              onCheckedChange={(checked) =>
                                handleToggleActive(featured.id, checked)
                              }
                            />
                            <Label className="text-xs">
                              {featured.is_active ? "Active" : "Hidden"}
                            </Label>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(featured.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
