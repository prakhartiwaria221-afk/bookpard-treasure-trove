import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PriceWatchButtonProps {
  bookId?: string;
  listingId?: string;
  currentPrice: number;
  className?: string;
}

export function PriceWatchButton({
  bookId,
  listingId,
  currentPrice,
  className,
}: PriceWatchButtonProps) {
  const [isWatching, setIsWatching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [watchId, setWatchId] = useState<string | null>(null);

  useEffect(() => {
    checkWatchStatus();
  }, [bookId, listingId]);

  const checkWatchStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    let query = supabase
      .from("price_watches")
      .select("id")
      .eq("user_id", user.id)
      .eq("is_active", true);

    if (bookId) {
      query = query.eq("book_id", bookId);
    } else if (listingId) {
      query = query.eq("listing_id", listingId);
    }

    const { data, error } = await query.maybeSingle();

    if (!error && data) {
      setIsWatching(true);
      setWatchId(data.id);
    }
    setLoading(false);
  };

  const toggleWatch = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please log in to set price alerts");
      return;
    }

    setLoading(true);

    if (isWatching && watchId) {
      // Remove watch
      const { error } = await supabase
        .from("price_watches")
        .delete()
        .eq("id", watchId);

      if (error) {
        toast.error("Failed to remove price watch");
      } else {
        setIsWatching(false);
        setWatchId(null);
        toast.success("Price alert removed");
      }
    } else {
      // Add watch
      const { data, error } = await supabase
        .from("price_watches")
        .insert({
          user_id: user.id,
          book_id: bookId || null,
          listing_id: listingId || null,
          target_price: Math.floor(currentPrice * 0.9), // Alert on 10% drop
          notify_any_drop: true,
          is_active: true,
        })
        .select("id")
        .single();

      if (error) {
        toast.error("Failed to set price watch");
      } else {
        setIsWatching(true);
        setWatchId(data.id);
        toast.success("You'll be notified when the price drops!");
      }
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <Button variant="ghost" size="icon" disabled className={className}>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  return (
    <Button
      variant={isWatching ? "secondary" : "ghost"}
      size="icon"
      onClick={toggleWatch}
      className={className}
      title={isWatching ? "Remove price alert" : "Get price drop alerts"}
    >
      {isWatching ? (
        <BellOff className="h-4 w-4 text-primary" />
      ) : (
        <Bell className="h-4 w-4" />
      )}
    </Button>
  );
}
