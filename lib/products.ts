import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import type { Category, Product, ProductFilters, ProductInput } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];

export const PAGE_SIZE = 12;

export function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    externalId: row.external_id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    price: Number(row.price),
    category: row.category,
    imageUrl: row.image_url,
    rating: Number(row.rating),
    ratingCount: row.rating_count,
    isPublished: row.is_published,
    archivedAt: row.archived_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function toProductInsert(input: ProductInput): ProductInsert {
  return {
    external_id: input.externalId ?? null,
    title: input.title,
    slug: input.slug,
    description: input.description,
    price: input.price,
    category: input.category,
    image_url: input.imageUrl,
    rating: input.rating,
    rating_count: input.ratingCount,
    is_published: input.isPublished ?? true
  };
}

const PRODUCT_SELECT =
  "id,external_id,title,slug,description,price,category,image_url,rating,rating_count,is_published,archived_at,synced_at,created_at,updated_at" as const;

export async function getProducts(filters: ProductFilters = {}) {
  const supabase = await createClient();
  const page = Math.max(filters.page ?? 1, 1);
  const pageSize = filters.pageSize ?? PAGE_SIZE;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from("products").select(PRODUCT_SELECT, { count: "exact" });

  if (!filters.includeArchived) query = query.is("archived_at", null).eq("is_published", true);
  if (filters.category) query = query.eq("category", filters.category);
  if (filters.search) {
    const term = filters.search.trim();
    query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%,category.ilike.%${term}%`);
  }

  switch (filters.sort) {
    case "price-asc":
      query = query.order("price", { ascending: true });
      break;
    case "price-desc":
      query = query.order("price", { ascending: false });
      break;
    case "rating":
      query = query.order("rating", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data, error, count } = await query.range(from, to);
  if (error) return { products: [], count: 0, error: error.message };

  return { products: data.map(mapProduct), count: count ?? 0, error: null };
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .is("archived_at", null)
    .maybeSingle();

  if (error || !data || !data.is_published) return null;
  return mapProduct(data);
}

export async function getAdminProductById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select(PRODUCT_SELECT).eq("id", id).maybeSingle();
  if (error || !data) return null;
  return mapProduct(data);
}

export async function getCategories(): Promise<Category[]> {
  const { products } = await getProducts({ pageSize: 100 });
  const counts = products.reduce<Record<string, number>>((acc, product) => {
    acc[product.category] = (acc[product.category] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function upsertImportedProducts(
  supabase: SupabaseClient<Database>,
  products: ProductInput[]
): Promise<{ upserted: number; errors: string[] }> {
  const rows = products.map((product) => ({
    ...toProductInsert(product),
    synced_at: new Date().toISOString()
  }));

  const { error } = await supabase.from("products").upsert(rows, {
    onConflict: "external_id",
    ignoreDuplicates: false
  });

  if (error) return { upserted: 0, errors: [formatDatabaseError(error)] };
  return { upserted: rows.length, errors: [] };
}

export function toProductUpdate(input: ProductInput): ProductUpdate {
  return toProductInsert(input);
}

export function formatDatabaseError(error: PostgrestError) {
  if (error.code === "23505") return "A product with that slug or external ID already exists.";
  if (error.code === "42501") return "You are not authorized to change products.";
  return error.message;
}
