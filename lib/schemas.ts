import { z } from "zod";

export const slugSchema = z
  .string()
  .min(2, "Slug must be at least 2 characters.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only.");

export const productFormSchema = z.object({
  title: z.string().trim().min(2, "Title is required.").max(180),
  slug: slugSchema,
  description: z.string().trim().min(10, "Description should be at least 10 characters."),
  price: z.coerce.number().min(0, "Price cannot be negative."),
  category: z.string().trim().min(2, "Category is required.").max(80),
  imageUrl: z.string().trim().url("Enter a valid image URL."),
  rating: z.coerce.number().min(0).max(5),
  ratingCount: z.coerce.number().int().min(0),
  isPublished: z.coerce.boolean().default(true)
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}
