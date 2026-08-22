import Image from "next/image";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { getProductBySlug } from "@/lib/products";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div className="relative aspect-square rounded border border-ink/10 bg-white shadow-soft">
        <Image src={product.imageUrl} alt={product.title} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain p-10" />
      </div>
      <div className="flex flex-col justify-center">
        <p className="text-sm font-semibold uppercase tracking-normal text-clay">{product.category}</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{product.title}</h1>
        <p className="mt-4 flex items-center gap-2 text-ink/70">
          <Star size={18} className="fill-maize text-maize" aria-hidden />
          {product.rating.toFixed(1)} rating from {product.ratingCount} reviews
        </p>
        <p className="mt-6 text-3xl font-bold">KES {product.price.toFixed(2)}</p>
        <p className="mt-6 leading-8 text-ink/72">{product.description}</p>
        <AddToCartButton product={product} className="mt-8 w-full sm:w-auto" />
      </div>
    </section>
  );
}
