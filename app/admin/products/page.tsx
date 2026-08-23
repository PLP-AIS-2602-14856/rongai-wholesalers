import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getProducts } from "@/lib/products";
import { SyncProductsButton } from "@/components/sync-products-button";
import { archiveProductAction } from "@/app/actions/products";

export default async function AdminProductsPage() {
  await requireAdmin();
  const { products, error } = await getProducts({ includeArchived: true, pageSize: 100 });

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-3xl font-bold">Product admin</h1>
          <p className="mt-2 text-ink/65">Create, update, archive, and synchronize Supabase products.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <SyncProductsButton />
          <Link href="/admin/products/new" className="focus-ring inline-flex min-h-11 items-center gap-2 rounded bg-clay px-4 py-2 font-semibold text-white">
            <Plus size={18} aria-hidden /> New product
          </Link>
        </div>
      </div>
      {error ? <p className="mt-6 rounded border border-clay/30 bg-clay/10 p-4 text-clay">{error}</p> : null}
      <div className="mt-6 overflow-hidden rounded border border-ink/10 bg-white shadow-soft">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-mist text-ink/70">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-ink/10">
                <td className="p-3 font-medium">{product.title}</td>
                <td className="p-3">{product.category}</td>
                <td className="p-3">KES {product.price.toFixed(2)}</td>
                <td className="p-3">{product.archivedAt ? "Archived" : product.isPublished ? "Published" : "Draft"}</td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <Link className="grid size-10 place-items-center rounded border border-ink/15 hover:bg-mist" href={`/admin/products/${product.id}/edit`} aria-label={`Edit ${product.title}`}>
                      <Pencil size={17} aria-hidden />
                    </Link>
                    {!product.archivedAt ? (
                      <form action={archiveProductAction} className="flex gap-2">
                        <input type="hidden" name="id" value={product.id} />
                        <input type="hidden" name="confirmation" value="ARCHIVE" />
                        <button className="rounded border border-clay px-3 py-2 text-clay hover:bg-clay/10" type="submit">
                          Archive
                        </button>
                      </form>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 ? (
              <tr>
                <td className="p-5 text-ink/65" colSpan={5}>
                  No products yet. Run synchronization or create one manually.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
