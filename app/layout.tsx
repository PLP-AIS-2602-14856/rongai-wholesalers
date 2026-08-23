import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingBag, UserRound } from "lucide-react";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { CartIndicator } from "@/components/cart-indicator";
import { getCurrentProfile } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Rongai Wholesalers",
  description: "A Supabase-backed e-commerce storefront for Rongai Wholesalers."
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const profile = await getCurrentProfile();

  return (
    <html lang="en">
      <body>
        <CartProvider>
          <header className="sticky top-0 z-40 border-b border-ink/10 bg-white/95 backdrop-blur">
            <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
              <Link href="/" className="flex items-center gap-2 font-semibold tracking-normal">
                <span className="grid size-9 place-items-center rounded bg-leaf text-white">
                  <ShoppingBag size={19} aria-hidden />
                </span>
                <span>Rongai Wholesalers</span>
              </Link>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Link className="rounded px-3 py-2 hover:bg-mist focus-ring" href="/products">
                  Products
                </Link>
                {profile?.role === "admin" ? (
                  <Link className="rounded px-3 py-2 hover:bg-mist focus-ring" href="/admin/products">
                    Admin
                  </Link>
                ) : null}
                <Link className="rounded px-3 py-2 hover:bg-mist focus-ring" href="/account" aria-label="Account">
                  <UserRound size={20} aria-hidden />
                </Link>
                <Link className="rounded px-3 py-2 hover:bg-mist focus-ring" href="/cart" aria-label="Shopping cart">
                  <CartIndicator />
                </Link>
              </div>
            </nav>
          </header>
          <main>{children}</main>
          <footer className="border-t border-ink/10 bg-white">
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-ink/65 sm:px-6 lg:px-8">
              <p className="font-medium text-ink">Rongai Wholesalers</p>
              <p>Supabase-powered catalog with local cart and admin product management.</p>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
