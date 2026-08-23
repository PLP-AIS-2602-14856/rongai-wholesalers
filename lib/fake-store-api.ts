import { z } from "zod";
import { slugify } from "@/lib/schemas";
import type { ProductInput } from "@/lib/types";

const fakeStoreProductSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  price: z.number().nonnegative(),
  description: z.string().default(""),
  category: z.string().min(1),
  image: z.string().url(),
  rating: z
    .object({
      rate: z.number().min(0).max(5).default(0),
      count: z.number().int().nonnegative().default(0)
    })
    .default({ rate: 0, count: 0 })
});

const fakeStoreProductsSchema = z.array(fakeStoreProductSchema);
type FakeStoreProduct = z.infer<typeof fakeStoreProductSchema>;

const API_BASE = "https://fakestoreapi.com";
const TIMEOUT_MS = 8_000;

async function fetchJson(url: string, init?: RequestInit): Promise<unknown> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...init?.headers
      },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Fake Store API returned ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Fake Store API request timed out.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function toProductInput(product: FakeStoreProduct): ProductInput {
  return {
    externalId: product.id,
    title: product.title,
    slug: `${slugify(product.title)}-${product.id}`,
    description: product.description,
    price: product.price,
    category: product.category,
    imageUrl: product.image,
    rating: product.rating.rate,
    ratingCount: product.rating.count,
    isPublished: true
  };
}

export async function fetchFakeStoreProducts(): Promise<ProductInput[]> {
  const json = await fetchJson(`${API_BASE}/products`);
  const parsed = fakeStoreProductsSchema.safeParse(json);

  if (!parsed.success) {
    throw new Error("Fake Store API returned an invalid products payload.");
  }

  return parsed.data.map(toProductInput);
}

export async function fetchFakeStoreProduct(id: number): Promise<ProductInput> {
  const json = await fetchJson(`${API_BASE}/products/${id}`);
  const parsed = fakeStoreProductSchema.safeParse(json);

  if (!parsed.success) {
    throw new Error("Fake Store API returned an invalid product payload.");
  }

  return toProductInput(parsed.data);
}
