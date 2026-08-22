import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { getCategories, getProducts } from "@/lib/products";

export default async function HomePage() {
  const [{ products, error }, categories] = await Promise.all([getProducts({ pageSize: 8, sort: "rating" }), getCategories()]);

  return (
    <>
      <section className="bg-mist">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-normal text-clay">Supabase-backed storefront</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-normal text-ink sm:text-5xl">Rongai Wholesalers</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-ink/70">
              Browse a durable local product catalog imported from Fake Store API and served from Supabase for normal shopping.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link className="focus-ring inline-flex min-h-11 items-center gap-2 rounded bg-leaf px-5 py-3 font-semibold text-white" href="/products">
                Shop products <ArrowRight size={18} aria-hidden />
              </Link>
              <Link className="focus-ring inline-flex min-h-11 items-center rounded border border-ink/15 bg-white px-5 py-3 font-semibold" href="/account">
                My account
              </Link>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded border border-ink/10 bg-white p-5 shadow-soft">
              <Truck className="text-leaf" aria-hidden />
              <h2 className="mt-3 text-lg font-semibold">Fast catalog browsing</h2>
              <p className="mt-2 text-sm leading-6 text-ink/65">Products are read from Supabase after import, so storefront pages do not depend on Fake Store API uptime.</p>
            </div>
            <div className="rounded border border-ink/10 bg-white p-5 shadow-soft">
              <ShieldCheck className="text-leaf" aria-hidden />
              <h2 className="mt-3 text-lg font-semibold">Admin-controlled changes</h2>
              <p className="mt-2 text-sm leading-6 text-ink/65">Product CRUD and synchronization are enforced on the server and through RLS policies.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-clay">{categories.length} categories</p>
            <h2 className="mt-2 text-2xl font-bold">Featured products</h2>
          </div>
          <Link href="/products" className="font-semibold text-leaf hover:text-leaf/80">
            View all
          </Link>
        </div>
        {error ? <p className="mt-6 rounded border border-clay/30 bg-clay/10 p-4 text-clay">{error}</p> : null}
        {products.length === 0 && !error ? (
          <p className="mt-6 rounded border border-ink/10 bg-white p-5 text-ink/65">No products yet. An administrator can run product synchronization.</p>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
