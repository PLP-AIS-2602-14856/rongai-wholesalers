import Link from "next/link";
import { Search } from "lucide-react";
import type { Category, SortOption } from "@/lib/types";

export function ProductFilters({
  categories,
  selectedCategory,
  search,
  sort
}: {
  categories: Category[];
  selectedCategory?: string;
  search?: string;
  sort?: SortOption;
}) {
  return (
    <div className="rounded border border-ink/10 bg-white p-4 shadow-soft">
      <form className="grid gap-3 md:grid-cols-[1fr_180px]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/45" size={18} aria-hidden />
          <input
            name="q"
            defaultValue={search}
            placeholder="Search products"
            className="focus-ring min-h-11 w-full rounded border border-ink/15 bg-white pl-10 pr-3"
          />
        </label>
        <select name="sort" defaultValue={sort ?? "newest"} className="focus-ring min-h-11 rounded border border-ink/15 bg-white px-3">
          <option value="newest">Newest</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="rating">Top rated</option>
        </select>
      </form>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link className={`rounded px-3 py-2 text-sm ${!selectedCategory ? "bg-leaf text-white" : "bg-mist hover:bg-ink/10"}`} href="/products">
          All
        </Link>
        {categories.map((category) => (
          <Link
            key={category.name}
            href={`/categories/${encodeURIComponent(category.name)}`}
            className={`rounded px-3 py-2 text-sm ${
              selectedCategory === category.name ? "bg-leaf text-white" : "bg-mist hover:bg-ink/10"
            }`}
          >
            {category.name} ({category.count})
          </Link>
        ))}
      </div>
    </div>
  );
}
