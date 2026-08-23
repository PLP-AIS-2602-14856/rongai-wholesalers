"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart-provider";

export default function CartPage() {
  const { items, subtotal, totalQuantity, increaseQuantity, decreaseQuantity, removeProduct, clearCart } = useCart();

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Shopping cart</h1>
      {items.length === 0 ? (
        <div className="mt-6 rounded border border-ink/10 bg-white p-8 text-center shadow-soft">
          <p className="text-ink/65">Your cart is empty.</p>
          <Link href="/products" className="mt-5 inline-flex rounded bg-leaf px-5 py-3 font-semibold text-white">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {items.map((item) => (
              <article key={item.product.id} className="grid gap-4 rounded border border-ink/10 bg-white p-4 shadow-soft sm:grid-cols-[96px_1fr_auto]">
                <div className="relative aspect-square rounded bg-mist">
                  <Image src={item.product.imageUrl} alt={item.product.title} fill sizes="96px" className="object-contain p-3" />
                </div>
                <div>
                  <Link href={`/products/${item.product.slug}`} className="font-semibold hover:text-leaf">
                    {item.product.title}
                  </Link>
                  <p className="mt-1 text-sm text-ink/60">{item.product.category}</p>
                  <p className="mt-3 font-bold">KES {item.product.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                  <div className="flex h-10 items-center rounded border border-ink/15">
                    <button aria-label="Decrease quantity" className="grid size-10 place-items-center" onClick={() => decreaseQuantity(item.product.id)}>
                      <Minus size={16} aria-hidden />
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button aria-label="Increase quantity" className="grid size-10 place-items-center" onClick={() => increaseQuantity(item.product.id)}>
                      <Plus size={16} aria-hidden />
                    </button>
                  </div>
                  <button className="grid size-10 place-items-center rounded text-clay hover:bg-clay/10" aria-label="Remove item" onClick={() => removeProduct(item.product.id)}>
                    <Trash2 size={18} aria-hidden />
                  </button>
                </div>
              </article>
            ))}
          </div>
          <aside className="h-fit rounded border border-ink/10 bg-white p-5 shadow-soft">
            <h2 className="text-lg font-semibold">Summary</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Total quantity</span>
                <span>{totalQuantity}</span>
              </div>
              <div className="flex justify-between text-base font-bold">
                <span>Subtotal</span>
                <span>KES {subtotal.toFixed(2)}</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-ink/60">Checkout and payments are intentionally not implemented yet.</p>
            <button onClick={clearCart} className="mt-5 w-full rounded border border-clay px-4 py-3 font-semibold text-clay hover:bg-clay/10">
              Clear cart
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}
