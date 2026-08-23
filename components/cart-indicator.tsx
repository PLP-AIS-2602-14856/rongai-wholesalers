"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart-provider";

export function CartIndicator() {
  const { totalQuantity } = useCart();

  return (
    <span className="relative inline-flex">
      <ShoppingCart size={20} aria-hidden />
      {totalQuantity > 0 ? (
        <span className="absolute -right-2 -top-2 grid min-h-5 min-w-5 place-items-center rounded-full bg-clay px-1 text-xs font-semibold text-white">
          {totalQuantity}
        </span>
      ) : null}
    </span>
  );
}
