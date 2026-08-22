"use server";

import { revalidatePath } from "next/cache";
import { fetchFakeStoreProducts } from "@/lib/fake-store-api";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { toProductInsert } from "@/lib/products";
import type { Database } from "@/lib/database.types";
import type { ProductInput, SyncSummary } from "@/lib/types";
import type { SupabaseClient } from "@supabase/supabase-js";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

function canSyncOverwrite(existing: ProductRow) {
  if (!existing.synced_at) return true;
  return new Date(existing.updated_at).getTime() <= new Date(existing.synced_at).getTime() + 1000;
}

export async function runProductSyncForAdmin(supabase: SupabaseClient<Database>, adminId: string): Promise<SyncSummary> {
  const errors: string[] = [];
  let products: ProductInput[] = [];

  try {
    products = await fetchFakeStoreProducts();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch Fake Store products.";
    await supabase.from("product_sync_runs").insert({
      status: "error",
      fetched_count: 0,
      upserted_count: 0,
      error_count: 1,
      details: { errors: [message] },
      created_by: adminId
    });
    return { fetched: 0, upserted: 0, errors: [message] };
  }

  const externalIds = products.map((product) => product.externalId).filter((id): id is number => typeof id === "number");
  const { data: existingProducts } = await supabase
    .from("products")
    .select("id,external_id,title,slug,description,price,category,image_url,rating,rating_count,is_published,archived_at,synced_at,created_at,updated_at")
    .in("external_id", externalIds);

  const existingByExternalId = new Map((existingProducts ?? []).map((product) => [product.external_id, product]));
  const rows = products
    .filter((product) => {
      const existing = existingByExternalId.get(product.externalId ?? null);
      return !existing || canSyncOverwrite(existing);
    })
    .map((product) => ({
      ...toProductInsert(product),
      synced_at: new Date().toISOString()
    }));

  if (rows.length > 0) {
    const { error } = await supabase.from("products").upsert(rows, { onConflict: "external_id" });
    if (error) errors.push(error.message);
  }

  const status = errors.length > 0 ? "partial" : "success";
  await supabase.from("product_sync_runs").insert({
    status,
    fetched_count: products.length,
    upserted_count: errors.length > 0 ? 0 : rows.length,
    error_count: errors.length,
    details: { skippedBecauseLocallyEdited: products.length - rows.length, errors },
    created_by: adminId
  });

  revalidatePath("/");
  revalidatePath("/products");
  return { fetched: products.length, upserted: errors.length > 0 ? 0 : rows.length, errors };
}

export async function syncProductsAction(): Promise<SyncSummary> {
  const admin = await requireAdmin();
  const supabase = await createClient();
  return runProductSyncForAdmin(supabase, admin.id);
}
