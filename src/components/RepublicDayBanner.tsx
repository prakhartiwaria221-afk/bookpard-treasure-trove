import { useState, useEffect } from "react";
import { X, Flag, Star, Gift, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";

export const RepublicDayBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const republicDay = new Date("2026-01-26");
    const today = new Date();
    const timeDiff = republicDay.getTime() - today.getTime();
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    setDaysLeft(days > 0 ? days : 0);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[hsl(24,100%,50%)] via-white to-[hsl(120,60%,30%)]">
      {/* Tricolor stripe overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full stripe-tricolor" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-4 text-center">
          {/* Left decoration */}
          <div className="hidden sm:flex items-center gap-2">
            <Flag className="h-5 w-5 text-[hsl(24,100%,30%)] animate-flag-wave" />
            <Star className="h-4 w-4 text-[hsl(120,60%,25%)] animate-sparkle" />
          </div>

          {/* Main content */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇮🇳</span>
              <span className="font-bold text-[hsl(24,100%,25%)] text-sm sm:text-base">
                Republic Day Sale!
              </span>
            </div>

            <div className="hidden sm:block h-4 w-px bg-[hsl(120,60%,30%)]" />

            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-[hsl(24,100%,40%)]" />
              <span className="text-[hsl(120,60%,20%)] font-semibold text-sm">
                Up to 26% OFF on all books
              </span>
            </div>

            {daysLeft > 0 && daysLeft <= 7 && (
              <>
                <div className="hidden sm:block h-4 w-px bg-[hsl(24,100%,50%)]" />
                <div className="flex items-center gap-1 bg-[hsl(24,100%,45%)] text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                  <Percent className="h-3 w-3" />
                  {daysLeft === 0 ? "TODAY!" : `${daysLeft} days left`}
                </div>
              </>
            )}
          </div>

          {/* Right decoration */}
          <div className="hidden sm:flex items-center gap-2">
            <Star className="h-4 w-4 text-[hsl(24,100%,45%)] animate-sparkle" style={{ animationDelay: "0.5s" }} />
            <Flag className="h-5 w-5 text-[hsl(120,60%,30%)] animate-flag-wave" style={{ animationDelay: "0.3s" }} />
          </div>
        </div>

        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsVisible(false)}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-[hsl(220,20%,30%)] hover:bg-white/30"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Ashoka Chakra decoration */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:block">
        <div className="w-8 h-8 text-[hsl(210,80%,45%)] animate-chakra-spin text-2xl flex items-center justify-center">
          ☸
        </div>
      </div>
      <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden md:block">
        <div className="w-8 h-8 text-[hsl(210,80%,45%)] animate-chakra-spin text-2xl flex items-center justify-center" style={{ animationDirection: "reverse" }}>
          ☸
        </div>
      </div>
    </div>
  );
};
