"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import type { Product } from "@/lib/types";

export function AddToCartButton({ product, className = "" }: { product: Product; className?: string }) {
  const { addProduct } = useCart();

  return (
    <button
      type="button"
      onClick={() => addProduct(product)}
      className={`focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded bg-leaf px-4 py-2 font-semibold text-white hover:bg-leaf/90 ${className}`}
    >
      <ShoppingCart size={18} aria-hidden />
      Add to cart
    </button>
  );
}
