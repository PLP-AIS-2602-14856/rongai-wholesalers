import Link from "next/link";

export default function ProductNotFound() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">Product not found</h1>
      <p className="mt-3 text-ink/65">The product may be unpublished, archived, or missing.</p>
      <Link className="mt-6 inline-flex rounded bg-leaf px-5 py-3 font-semibold text-white" href="/products">
        Browse products
      </Link>
    </section>
  );
}
