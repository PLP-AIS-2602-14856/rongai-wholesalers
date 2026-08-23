import { ProductCard } from "@/components/product-card";
import { ProductFilters } from "@/components/product-filters";
import { getCategories, getProducts, PAGE_SIZE } from "@/lib/products";
import type { SortOption } from "@/lib/types";

type Props = {
  searchParams: Promise<{ q?: string; sort?: SortOption; page?: string }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page ?? "1");
  const [{ products, count, error }, categories] = await Promise.all([
    getProducts({ search: params.q, sort: params.sort, page }),
    getCategories()
  ]);
  const totalPages = Math.max(Math.ceil(count / PAGE_SIZE), 1);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="mt-2 text-ink/65">Search, filter, and sort the Supabase product catalog.</p>
      </div>
      <ProductFilters categories={categories} search={params.q} sort={params.sort} />
      {error ? <p className="mt-6 rounded border border-clay/30 bg-clay/10 p-4 text-clay">{error}</p> : null}
      {products.length === 0 && !error ? (
        <p className="mt-6 rounded border border-ink/10 bg-white p-5 text-ink/65">No products match your filters.</p>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      <div className="mt-8 flex items-center justify-between text-sm">
        <span>
          Page {Math.min(page, totalPages)} of {totalPages}
        </span>
        <div className="flex gap-2">
          {page > 1 ? <a className="rounded border border-ink/15 px-3 py-2" href={`/products?page=${page - 1}`}>Previous</a> : null}
          {page < totalPages ? <a className="rounded border border-ink/15 px-3 py-2" href={`/products?page=${page + 1}`}>Next</a> : null}
        </div>
      </div>
    </section>
  );
}
