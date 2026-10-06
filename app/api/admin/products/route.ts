import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { collectionList } from "@/data/storefront";
import { ADMIN_SESSION_COOKIE, isAdminSessionValid } from "@/lib/admin-auth.server";
import { deleteCatalogProduct, getCatalogProducts, saveCatalogProduct } from "@/lib/product-catalog.server";

export const runtime = "nodejs";

const productSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10).max(2000),
  price: z.number().finite().positive(),
  compareAtPrice: z.number().finite().positive().optional(),
  category: z.string().trim().min(2).max(60),
  collection: z.string().refine((value) => collectionList.some((item) => item.slug === value), "Choose a valid collection."),
  colors: z.array(z.string().trim().min(1).max(40)).min(1).max(12),
  sizes: z.array(z.string().trim().min(1).max(24)).min(1).max(16),
  stock: z.number().int().min(0).max(100000),
  sku: z.string().trim().max(80).optional(),
  material: z.string().trim().min(2).max(300),
  care: z.string().trim().min(2).max(500),
  fit: z.string().trim().min(2).max(500),
  featured: z.boolean(),
  newArrival: z.boolean(),
  sale: z.boolean(),
  tags: z.array(z.string().trim().min(1).max(32)).max(20),
  rating: z.number().min(0).max(5).default(5),
  reviewCount: z.number().int().min(0).default(0),
});
const updateSchema = productSchema.extend({ id: z.string().min(1) });

const imageTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/avif", ".avif"],
]);
const maxImageBytes = 5 * 1024 * 1024;

async function isAuthorized() {
  const cookieStore = await cookies();
  return isAdminSessionValid(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}

function makeSlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getImageFiles(formData: FormData) {
  return formData.getAll("images").filter((value): value is File => value instanceof File && value.size > 0);
}

function validateImageFiles(files: File[]) {
  if (files.length > 5) return "Upload no more than 5 product images.";
  if (files.some((file) => !imageTypes.has(file.type) || file.size > maxImageBytes)) {
    return "Images must be JPEG, PNG, WebP, or AVIF and no larger than 5 MB each.";
  }
  return null;
}

async function saveUploadedImages(files: File[]) {
  const uploadDirectory = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDirectory, { recursive: true });
  const imageUrls: string[] = [];

  for (const file of files) {
    const filename = `${randomUUID()}${imageTypes.get(file.type)}`;
    await fs.writeFile(path.join(uploadDirectory, filename), Buffer.from(await file.arrayBuffer()));
    imageUrls.push(`/uploads/${filename}`);
  }

  return imageUrls;
}

async function removeUnusedUploads(imageUrls: string[], remainingProducts: Awaited<ReturnType<typeof getCatalogProducts>>) {
  const stillUsed = new Set(remainingProducts.flatMap((product) => product.images));
  await Promise.all(imageUrls
    .filter((imageUrl) => imageUrl.startsWith("/uploads/") && !stillUsed.has(imageUrl))
    .map((imageUrl) => fs.rm(path.join(process.cwd(), "public", imageUrl.slice(1)), { force: true })));
}

export async function POST(request: Request) {
  if (!await isAuthorized()) {
    return NextResponse.json({ error: "Sign in to create products." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const payload = formData.get("product");
    if (typeof payload !== "string") {
      return NextResponse.json({ error: "Product details are required." }, { status: 400 });
    }

    const parsed = productSchema.safeParse(JSON.parse(payload));
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Check the product details." }, { status: 400 });
    }

    const files = getImageFiles(formData);
    if (files.length < 1) {
      return NextResponse.json({ error: "Upload between 1 and 5 product images." }, { status: 400 });
    }
    const imageError = validateImageFiles(files);
    if (imageError) return NextResponse.json({ error: imageError }, { status: 400 });

    const existingProducts = await getCatalogProducts();
    const baseSlug = makeSlug(parsed.data.name) || "product";
    const existingSlugs = new Set(existingProducts.map((product) => product.slug));
    let slug = baseSlug;
    let suffix = 2;
    while (existingSlugs.has(slug)) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    const imageUrls = await saveUploadedImages(files);

    const id = `p-${randomUUID()}`;
    const product = {
      ...parsed.data,
      id,
      slug,
      sku: parsed.data.sku || `ADM-${id.slice(-8).toUpperCase()}`,
      images: imageUrls,
      hoverImage: imageUrls[1],
      rating: parsed.data.rating,
      reviewCount: parsed.data.reviewCount,
    };

    await saveCatalogProduct(product);
    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Product could not be saved. Please try again." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!await isAuthorized()) {
    return NextResponse.json({ error: "Sign in to edit products." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const payload = formData.get("product");
    if (typeof payload !== "string") {
      return NextResponse.json({ error: "Product details are required." }, { status: 400 });
    }

    const parsed = updateSchema.safeParse(JSON.parse(payload));
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Check the product details." }, { status: 400 });
    }

    const existingProduct = (await getCatalogProducts()).find((product) => product.id === parsed.data.id);
    if (!existingProduct) return NextResponse.json({ error: "Product not found." }, { status: 404 });

    const files = getImageFiles(formData);
    const imageError = validateImageFiles(files);
    if (imageError) return NextResponse.json({ error: imageError }, { status: 400 });

    const { id, ...details } = parsed.data;
    const newImages = files.length ? await saveUploadedImages(files) : existingProduct.images;
    const updatedProduct = {
      ...existingProduct,
      ...details,
      id,
      slug: existingProduct.slug,
      sku: details.sku || existingProduct.sku,
      images: newImages,
      hoverImage: files.length ? newImages[1] : existingProduct.hoverImage,
    };

    await saveCatalogProduct(updatedProduct);
    if (files.length) await removeUnusedUploads(existingProduct.images, await getCatalogProducts());
    return NextResponse.json({ product: updatedProduct });
  } catch {
    return NextResponse.json({ error: "Product could not be updated. Please try again." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!await isAuthorized()) {
    return NextResponse.json({ error: "Sign in to delete products." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { id?: unknown };
    const parsed = z.object({ id: z.string().min(1) }).safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "A product ID is required." }, { status: 400 });

    const product = (await getCatalogProducts()).find((item) => item.id === parsed.data.id);
    if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });

    await deleteCatalogProduct(product.id);
    await removeUnusedUploads(product.images, await getCatalogProducts());
    return NextResponse.json({ deleted: true, id: product.id });
  } catch {
    return NextResponse.json({ error: "Product could not be deleted. Please try again." }, { status: 500 });
  }
}
