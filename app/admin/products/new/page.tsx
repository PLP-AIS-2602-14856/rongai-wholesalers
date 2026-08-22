import { ProductForm } from "@/components/product-form";
import { requireAdmin } from "@/lib/auth";

export default async function NewProductPage() {
  await requireAdmin();

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Create product</h1>
      <p className="mt-2 text-ink/65">Server validation and RLS protect product creation.</p>
      <div className="mt-6">
        <ProductForm />
      </div>
    </section>
  );
}
