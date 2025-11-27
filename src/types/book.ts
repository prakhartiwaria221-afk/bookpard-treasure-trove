export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  price: number;
  oldPrice: number;
  image: string;
  condition: "new" | "old";
  description?: string;
}

export interface CartItem extends Book {
  quantity: number;
}

export type SortOption = "price-low" | "price-high" | "name";
export type FilterCondition = "all" | "new" | "old";
