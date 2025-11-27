import { categories } from "@/data/books";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-[var(--shadow-card)]">
      <h3 className="text-lg font-bold text-foreground mb-4">Categories</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedCategory === category
                ? "bg-gradient-to-r from-primary to-coral-dark text-primary-foreground shadow-[var(--shadow-soft)] scale-105"
                : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};
