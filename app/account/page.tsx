import Link from "next/link";
import { signOutAction } from "@/app/actions/auth";
import { getCurrentProfile, requireUser } from "@/lib/auth";

export default async function AccountPage() {
  const user = await requireUser();
  const profile = await getCurrentProfile();

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Account</h1>
      <div className="mt-6 rounded border border-ink/10 bg-white p-6 shadow-soft">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-semibold text-ink/55">Email</dt>
            <dd className="mt-1">{profile?.email ?? user.email}</dd>
          </div>
          <div>
            <dt className="text-sm font-semibold text-ink/55">Role</dt>
            <dd className="mt-1 capitalize">{profile?.role ?? "customer"}</dd>
          </div>
          <div>
            <dt className="text-sm font-semibold text-ink/55">User ID</dt>
            <dd className="mt-1 break-all text-sm">{user.id}</dd>
          </div>
        </dl>
        <div className="mt-6 grid gap-3 border-t border-ink/10 pt-6 sm:grid-cols-3">
          <div className="rounded bg-mist p-4">
            <h2 className="font-semibold">Orders</h2>
            <p className="mt-1 text-sm text-ink/65">Ready for future order history.</p>
          </div>
          <div className="rounded bg-mist p-4">
            <h2 className="font-semibold">Addresses</h2>
            <p className="mt-1 text-sm text-ink/65">Prepared for saved delivery details.</p>
          </div>
          <div className="rounded bg-mist p-4">
            <h2 className="font-semibold">Wishlist</h2>
            <p className="mt-1 text-sm text-ink/65">Prepared for saved products.</p>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          {profile?.role === "admin" ? (
            <Link href="/admin/products" className="rounded bg-leaf px-4 py-3 font-semibold text-white">
              Manage products
            </Link>
          ) : null}
          <form action={signOutAction}>
            <button className="rounded border border-ink/15 px-4 py-3 font-semibold">Sign out</button>
          </form>
        </div>
      </div>
    </section>
  );
}
