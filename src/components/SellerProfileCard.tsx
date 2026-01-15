import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SellerBadge } from "@/components/SellerBadge";
import { StarRating } from "@/components/StarRating";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { User, MapPin, Calendar, Package } from "lucide-react";

interface SellerProfile {
  id: string;
  user_id: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  is_verified: boolean;
  total_sales: number;
  response_rate: number | null;
  avg_rating: number | null;
  total_ratings: number;
  joined_at: string;
  last_active_at: string;
}

interface SellerProfileCardProps {
  userId: string;
  compact?: boolean;
}

export const SellerProfileCard = ({
  userId,
  compact = false,
}: SellerProfileCardProps) => {
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("seller_profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching seller profile:", error);
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <Card className="bg-stone-900/50 border-amber-700/30 animate-pulse">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-amber-800/30" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-amber-800/30 rounded" />
              <div className="h-3 w-20 bg-amber-800/30 rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="bg-stone-900/50 border-amber-700/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-amber-800/50 text-amber-200">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-amber-200">Private Seller</p>
              <p className="text-xs text-muted-foreground">New to platform</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-stone-900/30 rounded-lg border border-amber-700/20">
        <Avatar className="h-10 w-10">
          <AvatarImage src={profile.avatar_url || undefined} />
          <AvatarFallback className="bg-gradient-to-br from-amber-700 to-amber-900 text-amber-200">
            {profile.display_name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-amber-100 truncate">
              {profile.display_name}
            </span>
            <SellerBadge
              isVerified={profile.is_verified}
              avgRating={profile.avg_rating}
              totalRatings={profile.total_ratings}
              totalSales={profile.total_sales}
              responseRate={profile.response_rate}
              size="sm"
            />
          </div>
          {profile.avg_rating && (
            <StarRating rating={profile.avg_rating} size="sm" />
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-amber-950/80 via-stone-900/80 to-amber-950/80 border-amber-700/40">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-amber-100">Seller Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile.avatar_url || undefined} />
            <AvatarFallback className="bg-gradient-to-br from-amber-700 to-amber-900 text-amber-200 text-xl">
              {profile.display_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-amber-50">
              {profile.display_name}
            </h3>
            <SellerBadge
              isVerified={profile.is_verified}
              avgRating={profile.avg_rating}
              totalRatings={profile.total_ratings}
              totalSales={profile.total_sales}
              responseRate={profile.response_rate}
              showDetails
            />
          </div>
        </div>

        {profile.bio && (
          <p className="text-sm text-amber-200/70">{profile.bio}</p>
        )}

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-amber-200/60">
            <Calendar className="h-4 w-4" />
            Joined {formatDistanceToNow(new Date(profile.joined_at), { addSuffix: true })}
          </div>
          <div className="flex items-center gap-2 text-amber-200/60">
            <Package className="h-4 w-4" />
            {profile.total_sales} sales
          </div>
        </div>

        {profile.avg_rating !== null && profile.avg_rating > 0 && (
          <div className="pt-2 border-t border-amber-700/30">
            <div className="flex items-center justify-between">
              <span className="text-sm text-amber-200/60">Seller Rating</span>
              <div className="flex items-center gap-2">
                <StarRating rating={profile.avg_rating} size="sm" />
                <span className="text-sm text-amber-200">
                  ({profile.total_ratings} reviews)
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
