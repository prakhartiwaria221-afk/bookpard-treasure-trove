import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Trash2, Package, ShoppingCart, ArrowLeft, Users, IndianRupee, TrendingUp, UserPlus, UserMinus, Loader2 } from "lucide-react";
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

type AdminUser = {
  user_id: string;
  email: string;
  role: string;
  created_at: string;
};

export default function AdminDashboard() {
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [removingAdminId, setRemovingAdminId] = useState<string | null>(null);

  // Analytics
  const totalBooks = books.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total_price, 0);
  const pendingOrders = orders.filter(o => o.status === "pending").length;

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
      fetchAdminUsers();
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
      const ordersWithItems = (data || []).map(order => ({
        ...order,
        items: Array.isArray(order.items) ? order.items : []
      }));
      setOrders(ordersWithItems);
    }
  };

  const fetchAdminUsers = async () => {
    const { data, error } = await supabase.rpc("get_admin_users");

    if (error) {
      console.error("Failed to fetch admin users:", error);
    } else {
      setAdminUsers(data || []);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;

    setAddingAdmin(true);
    try {
      const { data: userId, error: lookupError } = await supabase.rpc("get_user_id_by_email", {
        _email: newAdminEmail.trim()
      });

      if (lookupError || !userId) {
        toast.error("User not found. Make sure the email is registered.");
        setAddingAdmin(false);
        return;
      }

      const existingAdmin = adminUsers.find(a => a.user_id === userId);
      if (existingAdmin) {
        toast.error("This user is already an admin.");
        setAddingAdmin(false);
        return;
      }

      const { error: insertError } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: "admin" });

      if (insertError) {
        toast.error("Failed to add admin role");
        console.error(insertError);
      } else {
        toast.success("Admin added successfully!");
        setNewAdminEmail("");
        fetchAdminUsers();
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setAddingAdmin(false);
    }
  };

  const handleRemoveAdmin = async (userId: string) => {
    setRemovingAdminId(userId);
    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", "admin");

      if (error) {
        toast.error("Failed to remove admin role");
        console.error(error);
      } else {
        toast.success("Admin role removed!");
        fetchAdminUsers();
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setRemovingAdminId(null);
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
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Books</p>
                    <p className="text-3xl font-bold text-foreground">{totalBooks}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-3xl font-bold text-foreground">{totalOrders}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-3xl font-bold text-foreground">₹{totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <IndianRupee className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Orders</p>
                    <p className="text-3xl font-bold text-foreground">{pendingOrders}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-orange-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="inventory" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="inventory" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Inventory</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
            </TabsList>

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
                        No books in inventory.
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

            {/* Users Tab */}
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage admin users and their roles ({adminUsers.length} admins)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Add Admin Form */}
                  <form onSubmit={handleAddAdmin} className="flex gap-3">
                    <div className="flex-1">
                      <Input
                        type="email"
                        placeholder="Enter user email to make admin..."
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" disabled={addingAdmin} className="shrink-0">
                      {addingAdmin ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add Admin
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Admin Users List */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-foreground">Current Admins</h3>
                    {adminUsers.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No admin users found.
                      </p>
                    ) : (
                      adminUsers.map((admin) => (
                        <div
                          key={admin.user_id}
                          className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                              <Users className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{admin.email}</p>
                              <p className="text-xs text-muted-foreground">
                                Admin since {new Date(admin.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveAdmin(admin.user_id)}
                            disabled={removingAdminId === admin.user_id}
                            className="text-destructive hover:text-destructive"
                          >
                            {removingAdminId === admin.user_id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <UserMinus className="h-4 w-4 mr-2" />
                                Remove
                              </>
                            )}
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
