"use client";

import { useActionState } from "react";
import { createProductAction, updateProductAction } from "@/app/actions/products";
import type { Product } from "@/lib/types";

export function ProductForm({ product }: { product?: Product }) {
  const action = product ? updateProductAction : createProductAction;
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="grid gap-4 rounded border border-ink/10 bg-white p-5 shadow-soft">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium">
          Title
          <input name="title" required defaultValue={product?.title} className="focus-ring mt-1 min-h-11 w-full rounded border border-ink/15 px-3" />
        </label>
        <label className="text-sm font-medium">
          Slug
          <input name="slug" required defaultValue={product?.slug} className="focus-ring mt-1 min-h-11 w-full rounded border border-ink/15 px-3" />
        </label>
        <label className="text-sm font-medium">
          Price
          <input name="price" type="number" min="0" step="0.01" required defaultValue={product?.price ?? 0} className="focus-ring mt-1 min-h-11 w-full rounded border border-ink/15 px-3" />
        </label>
        <label className="text-sm font-medium">
          Category
          <input name="category" required defaultValue={product?.category} className="focus-ring mt-1 min-h-11 w-full rounded border border-ink/15 px-3" />
        </label>
        <label className="text-sm font-medium md:col-span-2">
          Image URL
          <input name="imageUrl" type="url" required defaultValue={product?.imageUrl} className="focus-ring mt-1 min-h-11 w-full rounded border border-ink/15 px-3" />
        </label>
        <label className="text-sm font-medium">
          Rating
          <input name="rating" type="number" min="0" max="5" step="0.01" required defaultValue={product?.rating ?? 0} className="focus-ring mt-1 min-h-11 w-full rounded border border-ink/15 px-3" />
        </label>
        <label className="text-sm font-medium">
          Rating count
          <input name="ratingCount" type="number" min="0" step="1" required defaultValue={product?.ratingCount ?? 0} className="focus-ring mt-1 min-h-11 w-full rounded border border-ink/15 px-3" />
        </label>
      </div>
      <label className="text-sm font-medium">
        Description
        <textarea name="description" required defaultValue={product?.description} rows={5} className="focus-ring mt-1 w-full rounded border border-ink/15 p-3" />
      </label>
      <label className="inline-flex items-center gap-2 text-sm font-medium">
        <input name="isPublished" type="checkbox" defaultChecked={product?.isPublished ?? true} className="size-4 accent-leaf" />
        Published
      </label>
      {state?.error ? <p className="rounded border border-clay/30 bg-clay/10 p-3 text-sm text-clay">{state.error}</p> : null}
      <button disabled={pending} className="focus-ring w-fit rounded bg-leaf px-5 py-3 font-semibold text-white disabled:opacity-60">
        {pending ? "Saving..." : product ? "Update product" : "Create product"}
      </button>
    </form>
  );
}
