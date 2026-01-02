import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Trash2, Edit, Package, ShoppingCart, BookPlus, ArrowLeft } from "lucide-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";

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

type Order = {
  id: string;
  user_id: string | null;
  items: any[];
  total_price: number;
  payment_method: string;
  delivery_address: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  status: string;
  created_at: string;
};

export default function AdminDashboard() {
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

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
      fetchOrders();
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

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch orders");
      console.error(error);
    } else {
      // Cast items from Json to array
      const ordersWithItems = (data || []).map(order => ({
        ...order,
        items: Array.isArray(order.items) ? order.items : []
      }));
      setOrders(ordersWithItems);
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

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      toast.error("Failed to update order status");
      console.error(error);
    } else {
      toast.success("Order status updated!");
      fetchOrders();
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
      {/* Back Button Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">Admin Dashboard</h1>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">

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
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Orders
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
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDeleteBook(book.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>All Orders</CardTitle>
                  <CardDescription>
                    View and manage all customer orders ({orders.length} orders)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No orders yet.
                      </p>
                    ) : (
                      orders.map((order) => (
                        <div
                          key={order.id}
                          className="p-4 border border-border rounded-lg space-y-3"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Order ID: {order.id.slice(0, 8)}...
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Date: {new Date(order.created_at).toLocaleDateString()}
                              </p>
                              <p className="font-bold text-lg text-primary mt-1">
                                ₹{order.total_price}
                              </p>
                            </div>
                            <div className="text-right">
                              <Select
                                value={order.status}
                                onValueChange={(value) =>
                                  handleUpdateOrderStatus(order.id, value)
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="processing">Processing</SelectItem>
                                  <SelectItem value="shipped">Shipped</SelectItem>
                                  <SelectItem value="delivered">Delivered</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="text-sm space-y-1">
                            <p>
                              <span className="text-muted-foreground">Payment:</span>{" "}
                              {order.payment_method}
                            </p>
                            {order.contact_email && (
                              <p>
                                <span className="text-muted-foreground">Email:</span>{" "}
                                {order.contact_email}
                              </p>
                            )}
                            {order.contact_phone && (
                              <p>
                                <span className="text-muted-foreground">Phone:</span>{" "}
                                {order.contact_phone}
                              </p>
                            )}
                            {order.delivery_address && (
                              <p>
                                <span className="text-muted-foreground">Address:</span>{" "}
                                {order.delivery_address}
                              </p>
                            )}
                          </div>

                          <div className="pt-2 border-t border-border">
                            <p className="text-sm font-medium mb-2">Items:</p>
                            <div className="space-y-1">
                              {order.items.map((item: any, idx: number) => (
                                <p key={idx} className="text-sm text-muted-foreground">
                                  {item.title} x{item.quantity} - ₹{item.price * item.quantity}
                                </p>
                              ))}
                            </div>
                          </div>
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
