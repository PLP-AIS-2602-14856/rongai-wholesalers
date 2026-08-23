import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="flex h-full flex-col rounded border border-ink/10 bg-white shadow-soft">
      <Link href={`/products/${product.slug}`} className="group block">
        <div className="relative aspect-square overflow-hidden rounded-t bg-mist">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-8 transition duration-200 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-normal text-clay">{product.category}</p>
          <Link href={`/products/${product.slug}`} className="mt-1 line-clamp-2 text-base font-semibold hover:text-leaf">
            {product.title}
          </Link>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-bold">KES {product.price.toFixed(2)}</p>
            <p className="flex items-center gap-1 text-sm text-ink/60">
              <Star size={15} className="fill-maize text-maize" aria-hidden />
              {product.rating.toFixed(1)} ({product.ratingCount})
            </p>
          </div>
          <AddToCartButton product={product} className="px-3 text-sm" />
        </div>
      </div>
    </article>
  );
}
