import { ProductCard } from "@/components/product-card";
import { ProductFilters } from "@/components/product-filters";
import { getCategories, getProducts } from "@/lib/products";
import type { SortOption } from "@/lib/types";

type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ q?: string; sort?: SortOption }>;
};

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const query = await searchParams;
  const selectedCategory = decodeURIComponent(category);
  const [{ products, error }, categories] = await Promise.all([
    getProducts({ category: selectedCategory, search: query.q, sort: query.sort }),
    getCategories()
  ]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{selectedCategory}</h1>
        <p className="mt-2 text-ink/65">Category results from Supabase.</p>
      </div>
      <ProductFilters categories={categories} selectedCategory={selectedCategory} search={query.q} sort={query.sort} />
      {error ? <p className="mt-6 rounded border border-clay/30 bg-clay/10 p-4 text-clay">{error}</p> : null}
      {products.length === 0 && !error ? (
        <p className="mt-6 rounded border border-ink/10 bg-white p-5 text-ink/65">No products found in this category.</p>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
