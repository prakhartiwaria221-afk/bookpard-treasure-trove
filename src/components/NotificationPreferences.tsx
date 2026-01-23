import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Bell, Mail, Tag, Package, Megaphone, Loader2 } from "lucide-react";

interface NotificationPreference {
  id: string;
  email_order_updates: boolean;
  email_price_drops: boolean;
  email_back_in_stock: boolean;
  email_promotions: boolean;
}

export function NotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreference | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("notification_preferences")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching preferences:", error);
    }

    if (data) {
      setPreferences(data as NotificationPreference);
    } else {
      // Create default preferences
      const { data: newPrefs, error: insertError } = await supabase
        .from("notification_preferences")
        .insert({
          user_id: user.id,
          email_order_updates: true,
          email_price_drops: true,
          email_back_in_stock: true,
          email_promotions: false,
        })
        .select()
        .single();

      if (!insertError && newPrefs) {
        setPreferences(newPrefs as NotificationPreference);
      }
    }
    setLoading(false);
  };

  const handleToggle = async (key: keyof NotificationPreference) => {
    if (!preferences || key === "id") return;

    const newValue = !preferences[key];
    setPreferences({ ...preferences, [key]: newValue });

    setSaving(true);
    const { error } = await supabase
      .from("notification_preferences")
      .update({ [key]: newValue, updated_at: new Date().toISOString() })
      .eq("id", preferences.id);

    if (error) {
      console.error("Error updating preferences:", error);
      toast.error("Failed to update preferences");
      setPreferences({ ...preferences, [key]: !newValue });
    } else {
      toast.success("Preferences updated");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Please log in to manage notification preferences</p>
      </div>
    );
  }

  const notificationOptions = [
    {
      key: "email_order_updates" as const,
      label: "Order Updates",
      description: "Get notified about order status changes and delivery updates",
      icon: Package,
    },
    {
      key: "email_price_drops" as const,
      label: "Price Drop Alerts",
      description: "Receive alerts when books on your watchlist drop in price",
      icon: Tag,
    },
    {
      key: "email_back_in_stock" as const,
      label: "Back in Stock",
      description: "Get notified when out-of-stock books become available",
      icon: Bell,
    },
    {
      key: "email_promotions" as const,
      label: "Promotions & Offers",
      description: "Receive news about special offers and promotions",
      icon: Megaphone,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Mail className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Email Notifications</h3>
      </div>

      <div className="space-y-4">
        {notificationOptions.map((option) => (
          <div
            key={option.key}
            className="flex items-start justify-between p-4 bg-muted/30 rounded-lg border border-border"
          >
            <div className="flex items-start gap-3">
              <option.icon className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <Label
                  htmlFor={option.key}
                  className="text-sm font-medium text-foreground cursor-pointer"
                >
                  {option.label}
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  {option.description}
                </p>
              </div>
            </div>
            <Switch
              id={option.key}
              checked={preferences[option.key]}
              onCheckedChange={() => handleToggle(option.key)}
              disabled={saving}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
