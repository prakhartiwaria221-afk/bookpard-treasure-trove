import { BadgeCheck, Star, Clock, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface SellerBadgeProps {
  isVerified?: boolean;
  avgRating?: number | null;
  totalRatings?: number;
  totalSales?: number;
  responseRate?: number | null;
  size?: "sm" | "md" | "lg";
  showDetails?: boolean;
}

export const SellerBadge = ({
  isVerified = false,
  avgRating = null,
  totalRatings = 0,
  totalSales = 0,
  responseRate = null,
  size = "md",
  showDetails = false,
}: SellerBadgeProps) => {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  const getTrustLevel = () => {
    let score = 0;
    if (isVerified) score += 30;
    if (avgRating && avgRating >= 4) score += 25;
    if (totalSales >= 10) score += 20;
    if (responseRate && responseRate >= 80) score += 15;
    if (totalRatings >= 5) score += 10;

    if (score >= 80) return { label: "Top Seller", color: "from-amber-500 to-yellow-400" };
    if (score >= 50) return { label: "Trusted", color: "from-green-500 to-emerald-400" };
    if (score >= 20) return { label: "Rising", color: "from-blue-500 to-cyan-400" };
    return { label: "New Seller", color: "from-gray-500 to-slate-400" };
  };

  const trustLevel = getTrustLevel();

  if (!showDetails) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            className={cn(
              "bg-gradient-to-r text-white border-0 cursor-help",
              trustLevel.color,
              sizeClasses[size]
            )}
          >
            {isVerified && <BadgeCheck className="h-3 w-3 mr-1" />}
            {trustLevel.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="bg-stone-900 border-amber-700/40">
          <div className="space-y-1 text-xs">
            {isVerified && (
              <p className="flex items-center gap-1 text-green-400">
                <BadgeCheck className="h-3 w-3" /> Verified Seller
              </p>
            )}
            {avgRating !== null && (
              <p className="flex items-center gap-1">
                <Star className="h-3 w-3 text-amber-400" />
                {avgRating.toFixed(1)} ({totalRatings} ratings)
              </p>
            )}
            <p className="text-muted-foreground">{totalSales} sales</p>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge
        className={cn(
          "bg-gradient-to-r text-white border-0",
          trustLevel.color,
          sizeClasses[size]
        )}
      >
        {isVerified && <BadgeCheck className="h-3 w-3 mr-1" />}
        {trustLevel.label}
      </Badge>

      {avgRating !== null && avgRating > 0 && (
        <Badge variant="outline" className="border-amber-600/40 text-amber-200">
          <Star className="h-3 w-3 mr-1 fill-amber-400 text-amber-400" />
          {avgRating.toFixed(1)}
        </Badge>
      )}

      {totalSales > 0 && (
        <Badge variant="outline" className="border-amber-600/40 text-amber-200">
          {totalSales} sold
        </Badge>
      )}

      {responseRate !== null && responseRate > 0 && (
        <Badge variant="outline" className="border-amber-600/40 text-amber-200">
          <MessageCircle className="h-3 w-3 mr-1" />
          {responseRate.toFixed(0)}% response
        </Badge>
      )}
    </div>
  );
};
