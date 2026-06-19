import { Leaf, Sparkles, BookMarked } from "lucide-react";

export const HoliBanner = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[hsl(150,55%,32%)] via-[hsl(95,45%,42%)] to-[hsl(140,50%,38%)] text-white shadow-[var(--shadow-soft)]">
      <div className="container mx-auto px-4 py-2.5 flex items-center justify-center gap-3 text-sm md:text-base font-semibold">
        <Leaf className="h-5 w-5 animate-gentle-float" />
        <span className="tracking-wide">
          🌿 New: Build your <span className="font-extrabold">Reading Shelf</span> — save books to read later!
        </span>
        <span className="hidden sm:inline-flex items-center gap-1 bg-white/20 backdrop-blur px-2.5 py-0.5 rounded-full text-xs">
          <BookMarked className="h-3 w-3" /> Try /my-shelf
        </span>
        <Sparkles className="h-4 w-4 animate-sparkle" />
      </div>
    </div>
  );
};
