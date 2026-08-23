import { notFound } from "next/navigation";
import { ProductForm } from "@/components/product-form";
import { requireAdmin } from "@/lib/auth";
import { getAdminProductById } from "@/lib/products";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  const product = await getAdminProductById(id);
  if (!product) notFound();

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Edit product</h1>
      <p className="mt-2 text-ink/65">Updates are server-validated and revalidate storefront pages.</p>
      <div className="mt-6">
        <ProductForm product={product} />
      </div>
    </section>
  );
}
