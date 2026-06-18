import { Sun, Sparkles, Tag } from "lucide-react";

export const HoliBanner = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[hsl(42,100%,55%)] via-[hsl(25,95%,60%)] to-[hsl(12,90%,60%)] text-white shadow-[var(--shadow-soft)]">
      <div className="container mx-auto px-4 py-2.5 flex items-center justify-center gap-3 text-sm md:text-base font-semibold">
        <Sun className="h-5 w-5 animate-gentle-float" />
        <span className="tracking-wide">
          ☀️ Summer Sale — Flat <span className="font-extrabold">30% OFF</span> on every book!
        </span>
        <span className="hidden sm:inline-flex items-center gap-1 bg-white/20 backdrop-blur px-2.5 py-0.5 rounded-full text-xs">
          <Tag className="h-3 w-3" /> Code: SUMMER30
        </span>
        <Sparkles className="h-4 w-4 animate-sparkle" />
      </div>
    </div>
  );
};
