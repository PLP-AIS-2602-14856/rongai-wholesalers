"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { productFormSchema } from "@/lib/schemas";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDatabaseError, getAdminProductById, toProductInsert, toProductUpdate } from "@/lib/products";

type ActionState = { error?: string; success?: string };

function parseProductForm(formData: FormData) {
  return productFormSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    price: formData.get("price"),
    category: formData.get("category"),
    imageUrl: formData.get("imageUrl"),
    rating: formData.get("rating"),
    ratingCount: formData.get("ratingCount"),
    isPublished: formData.get("isPublished") === "on"
  });
}

export async function createProductAction(_prev: ActionState | null, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = parseProductForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid product." };

  const supabase = await createClient();
  const { error } = await supabase.from("products").insert(toProductInsert(parsed.data));
  if (error) return { error: formatDatabaseError(error) };

  revalidatePath("/");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function updateProductAction(_prev: ActionState | null, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing product ID." };

  const parsed = parseProductForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid product." };

  const supabase = await createClient();
  const { error } = await supabase.from("products").update(toProductUpdate(parsed.data)).eq("id", id);
  if (error) return { error: formatDatabaseError(error) };

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/products/${parsed.data.slug}`);
  redirect("/admin/products");
}

export async function archiveProductAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const confirmation = String(formData.get("confirmation") ?? "");
  if (!id || confirmation !== "ARCHIVE") redirect("/admin/products");

  const product = await getAdminProductById(id);
  if (!product) redirect("/admin/products");

  const supabase = await createClient();
  await supabase.from("products").update({ archived_at: new Date().toISOString(), is_published: false }).eq("id", id);

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/products/${product.slug}`);
  redirect("/admin/products");
}
