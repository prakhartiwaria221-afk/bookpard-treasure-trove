import { categories } from "@/data/books";
import { BookOpen, Sparkles } from "lucide-react";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="relative bg-gradient-to-br from-amber-950/90 via-stone-900/95 to-amber-950/90 rounded-xl p-6 shadow-2xl shadow-amber-950/30 border border-amber-700/40 overflow-hidden">
      {/* Vintage Paper Texture */}
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')]" />
      
      {/* Corner Flourishes */}
      <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-amber-600/30 rounded-tl pointer-events-none" />
      <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-amber-600/30 rounded-tr pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-amber-600/30 rounded-bl pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-amber-600/30 rounded-br pointer-events-none" />
      
      {/* Decorative Sparkles */}
      <Sparkles className="absolute top-4 right-12 h-3 w-3 text-amber-500/30 animate-pulse" />
      <Sparkles className="absolute bottom-4 left-12 h-3 w-3 text-amber-400/25 animate-pulse" style={{ animationDelay: "0.5s" }} />
      
      {/* Header with Icon */}
      <div className="relative flex items-center gap-3 mb-5">
        <div className="p-2 bg-gradient-to-br from-amber-700 to-amber-900 rounded-lg shadow-lg border border-amber-600/50">
          <BookOpen className="h-4 w-4 text-amber-200" />
        </div>
        <h3 className="text-lg font-playfair font-bold text-amber-50 tracking-wide">Categories</h3>
        <div className="flex items-center gap-2 ml-2">
          <div className="h-px w-8 bg-gradient-to-r from-amber-600/40 to-transparent" />
          <Sparkles className="h-3 w-3 text-amber-500/50" />
          <div className="h-px w-8 bg-gradient-to-l from-amber-600/40 to-transparent" />
        </div>
      </div>
      
      {/* Category Buttons */}
      <div className="relative flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border ${
              selectedCategory === category
                ? "bg-gradient-to-r from-amber-700 to-amber-800 text-amber-50 border-amber-500/60 shadow-lg shadow-amber-900/40 scale-105"
                : "bg-stone-800/50 text-amber-200/70 border-amber-700/30 hover:bg-amber-900/40 hover:text-amber-100 hover:border-amber-600/50"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      
      {/* Bottom Decorative Line */}
      <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-amber-700/30 to-transparent" />
    </div>
  );
};
