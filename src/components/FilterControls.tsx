import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortOption, FilterCondition } from "@/types/book";

interface FilterControlsProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  filterCondition: FilterCondition;
  onConditionChange: (condition: FilterCondition) => void;
}

export const FilterControls = ({
  sortBy,
  onSortChange,
  filterCondition,
  onConditionChange,
}: FilterControlsProps) => {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-[var(--shadow-card)]">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Sort By Price</label>
          <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
            <SelectTrigger className="bg-muted/50 border-border">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name">Name: A to Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Book Condition</label>
          <Select
            value={filterCondition}
            onValueChange={(value) => onConditionChange(value as FilterCondition)}
          >
            <SelectTrigger className="bg-muted/50 border-border">
              <SelectValue placeholder="Filter by condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Books</SelectItem>
              <SelectItem value="new">New Books Only</SelectItem>
              <SelectItem value="old">Used Books Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
