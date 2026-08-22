export type SortOption = "newest" | "price-asc" | "price-desc" | "rating";

export type Product = {
  id: string;
  externalId: number | null;
  title: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  rating: number;
  ratingCount: number;
  isPublished: boolean;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProductInput = {
  externalId?: number | null;
  title: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  rating: number;
  ratingCount: number;
  isPublished?: boolean;
};

export type Category = {
  name: string;
  count: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Profile = {
  id: string;
  email: string | null;
  fullName: string | null;
  role: "customer" | "admin";
};

export type ProductFilters = {
  search?: string;
  category?: string;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
  includeArchived?: boolean;
};

export type SyncSummary = {
  fetched: number;
  upserted: number;
  errors: string[];
};
