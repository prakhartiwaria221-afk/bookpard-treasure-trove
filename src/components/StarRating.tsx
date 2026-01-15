import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showCount?: boolean;
  reviewCount?: number;
  className?: string;
}

export const StarRating = ({
  rating,
  maxRating = 5,
  size = "md",
  interactive = false,
  onRatingChange,
  showCount = false,
  reviewCount = 0,
  className,
}: StarRatingProps) => {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const handleClick = (index: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex">
        {Array.from({ length: maxRating }).map((_, index) => {
          const filled = index < Math.floor(rating);
          const partial = index === Math.floor(rating) && rating % 1 > 0;
          
          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => handleClick(index)}
              className={cn(
                "relative transition-transform",
                interactive && "hover:scale-110 cursor-pointer",
                !interactive && "cursor-default"
              )}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  "transition-colors",
                  filled || partial
                    ? "fill-amber-400 text-amber-400"
                    : "fill-transparent text-amber-400/40"
                )}
              />
              {partial && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${(rating % 1) * 100}%` }}
                >
                  <Star
                    className={cn(
                      sizeClasses[size],
                      "fill-amber-400 text-amber-400"
                    )}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>
      {showCount && (
        <span className="text-sm text-muted-foreground ml-1">
          ({reviewCount})
        </span>
      )}
    </div>
  );
};
