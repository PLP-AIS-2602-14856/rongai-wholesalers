"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { CartItem, Product } from "@/lib/types";

type CartContextValue = {
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const value = useMemo<CartContextValue>(() => {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return {
      items,
      totalQuantity,
      subtotal,
      addProduct(product) {
        setItems((current) => {
          const existing = current.find((item) => item.product.id === product.id);
          if (existing) {
            return current.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
          }
          return [...current, { product, quantity: 1 }];
        });
      },
      removeProduct(id) {
        setItems((current) => current.filter((item) => item.product.id !== id));
      },
      increaseQuantity(id) {
        setItems((current) => current.map((item) => (item.product.id === id ? { ...item, quantity: item.quantity + 1 } : item)));
      },
      decreaseQuantity(id) {
        setItems((current) =>
          current
            .map((item) => (item.product.id === id ? { ...item, quantity: Math.max(item.quantity - 1, 0) } : item))
            .filter((item) => item.quantity > 0)
        );
      },
      clearCart() {
        setItems([]);
      }
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider.");
  return context;
}
