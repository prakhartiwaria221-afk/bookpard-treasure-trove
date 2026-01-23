import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Bell, AlertTriangle, Check, Trash2, Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface InventoryAlert {
  id: string;
  listing_id: string;
  alert_type: string;
  is_read: boolean;
  created_at: string;
  listing?: {
    title: string;
    stock_quantity: number;
    low_stock_threshold: number;
  };
}

export function InventoryAlerts() {
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("inventory_alerts")
      .select(`
        *,
        user_listings (title, stock_quantity, low_stock_threshold)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching alerts:", error);
    } else {
      const mappedAlerts = (data || []).map((alert: any) => ({
        ...alert,
        listing: alert.user_listings,
      }));
      setAlerts(mappedAlerts);
    }
    setLoading(false);
  };

  const markAsRead = async (alertId: string) => {
    const { error } = await supabase
      .from("inventory_alerts")
      .update({ is_read: true })
      .eq("id", alertId);

    if (error) {
      toast.error("Failed to mark alert as read");
    } else {
      setAlerts(alerts.map(a => 
        a.id === alertId ? { ...a, is_read: true } : a
      ));
    }
  };

  const deleteAlert = async (alertId: string) => {
    const { error } = await supabase
      .from("inventory_alerts")
      .delete()
      .eq("id", alertId);

    if (error) {
      toast.error("Failed to delete alert");
    } else {
      setAlerts(alerts.filter(a => a.id !== alertId));
      toast.success("Alert dismissed");
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = alerts.filter(a => !a.is_read).map(a => a.id);
    if (unreadIds.length === 0) return;

    const { error } = await supabase
      .from("inventory_alerts")
      .update({ is_read: true })
      .in("id", unreadIds);

    if (error) {
      toast.error("Failed to mark alerts as read");
    } else {
      setAlerts(alerts.map(a => ({ ...a, is_read: true })));
      toast.success("All alerts marked as read");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const unreadCount = alerts.filter(a => !a.is_read).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Inventory Alerts</h3>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount} new
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            <Check className="h-4 w-4 mr-1" />
            Mark all read
          </Button>
        )}
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No inventory alerts</p>
          <p className="text-sm">You'll be notified when stock runs low</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                alert.is_read
                  ? "bg-muted/20 border-border"
                  : "bg-destructive/5 border-destructive/20"
              }`}
            >
              <AlertTriangle
                className={`h-5 w-5 mt-0.5 ${
                  alert.is_read ? "text-muted-foreground" : "text-destructive"
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">
                  Low Stock Alert
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  "{alert.listing?.title || "Unknown book"}" has only{" "}
                  <span className="font-semibold text-destructive">
                    {alert.listing?.stock_quantity || 0}
                  </span>{" "}
                  items left
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(alert.created_at).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="flex gap-2">
                {!alert.is_read && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => markAsRead(alert.id)}
                    className="h-8 w-8"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteAlert(alert.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
