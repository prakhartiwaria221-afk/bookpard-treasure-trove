import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Package, Calendar, CreditCard } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import type { Json } from "@/integrations/supabase/types";

interface OrderItem {
  id: string;
  title: string;
  author: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  items: Json;
  total_price: number;
  status: string;
  payment_method: string;
  created_at: string;
  delivery_address: string | null;
}

const parseOrderItems = (items: Json): OrderItem[] => {
  if (Array.isArray(items)) {
    return items.map((item: any) => ({
      id: item.id || "",
      title: item.title || "",
      author: item.author || "",
      price: item.price || 0,
      quantity: item.quantity || 1,
      image: item.image || "/placeholder.svg",
    }));
  }
  return [];
};

export default function Orders() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
    } else {
      setOrders((data || []) as Order[]);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "delivered":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "processing":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
          <Package className="h-8 w-8 text-primary" />
          My Orders
        </h1>

        {orders.length === 0 ? (
          <Card className="border-border/40 shadow-[var(--shadow-soft)]">
            <CardContent className="py-16 text-center">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">
                Start browsing our collection to find your next great read!
              </p>
              <Link 
                to="/" 
                className="inline-flex items-center justify-center px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Browse Books
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="border-border/40 shadow-[var(--shadow-soft)] overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-border/40">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(order.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <CreditCard className="h-4 w-4" />
                          {order.payment_method}
                        </span>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} border`}>
                      {order.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    {parseOrderItems(order.items).map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-16 h-20 object-cover rounded-md bg-muted"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground truncate">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.author}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-primary">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-border/40 flex justify-between items-center">
                    <span className="text-muted-foreground">Total</span>
                    <span className="text-xl font-bold text-primary">₹{order.total_price}</span>
                  </div>

                  {order.delivery_address && (
                    <div className="mt-4 p-3 bg-muted/30 rounded-md">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Delivery Address:</span> {order.delivery_address}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
