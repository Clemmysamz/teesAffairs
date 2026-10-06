import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import { PRODUCTS, type Product } from "@/data/storefront";

const catalogPath = path.join(process.cwd(), "data", "admin-products.json");

type StoredCatalog = {
  additions: Product[];
  overrides: Product[];
  deletedIds: string[];
};

async function readStoredCatalog(): Promise<StoredCatalog> {
  try {
    const contents = await fs.readFile(catalogPath, "utf8");
    const stored: unknown = JSON.parse(contents);
    if (Array.isArray(stored)) {
      return { additions: stored as Product[], overrides: [], deletedIds: [] };
    }
    if (stored && typeof stored === "object") {
      const catalog = stored as Partial<StoredCatalog>;
      return {
        additions: Array.isArray(catalog.additions) ? catalog.additions : [],
        overrides: Array.isArray(catalog.overrides) ? catalog.overrides : [],
        deletedIds: Array.isArray(catalog.deletedIds) ? catalog.deletedIds : [],
      };
    }
    return { additions: [], overrides: [], deletedIds: [] };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return { additions: [], overrides: [], deletedIds: [] };
    }
    throw error;
  }
}

async function writeStoredCatalog(catalog: StoredCatalog): Promise<void> {
  await fs.mkdir(path.dirname(catalogPath), { recursive: true });
  await fs.writeFile(catalogPath, JSON.stringify(catalog, null, 2), "utf8");
}

export async function getStoredProducts(): Promise<Product[]> {
  const catalog = await readStoredCatalog();
  return [...catalog.additions, ...catalog.overrides];
}

export async function getCatalogProducts(): Promise<Product[]> {
  const catalog = await readStoredCatalog();
  const deletedIds = new Set(catalog.deletedIds);
  const overrides = new Map(catalog.overrides.map((product) => [product.id, product]));
  const seeded = PRODUCTS
    .filter((product) => !deletedIds.has(product.id))
    .map((product) => overrides.get(product.id) ?? product);
  const additions = catalog.additions.filter((product) => !deletedIds.has(product.id));
  return [...seeded, ...additions];
}

export async function saveCatalogProduct(product: Product): Promise<void> {
  const catalog = await readStoredCatalog();
  const isSeededProduct = PRODUCTS.some((item) => item.id === product.id);
  const target = isSeededProduct ? catalog.overrides : catalog.additions;
  const otherProducts = target.filter((item) => item.id !== product.id);

  if (isSeededProduct) catalog.overrides = [...otherProducts, product];
  else catalog.additions = [...otherProducts, product];

  catalog.deletedIds = catalog.deletedIds.filter((id) => id !== product.id);
  await writeStoredCatalog(catalog);
}

export async function deleteCatalogProduct(productId: string): Promise<void> {
  const catalog = await readStoredCatalog();
  const isSeededProduct = PRODUCTS.some((product) => product.id === productId);

  catalog.additions = catalog.additions.filter((product) => product.id !== productId);
  catalog.overrides = catalog.overrides.filter((product) => product.id !== productId);
  if (isSeededProduct && !catalog.deletedIds.includes(productId)) {
    catalog.deletedIds.push(productId);
  }

  await writeStoredCatalog(catalog);
}
