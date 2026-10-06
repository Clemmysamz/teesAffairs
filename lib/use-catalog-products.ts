"use client";

import { useEffect, useState } from "react";
import { PRODUCTS, type Product } from "@/data/storefront";

export function useCatalogProducts() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  useEffect(() => {
    let cancelled = false;

    void fetch("/api/products", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return null;
        return (await response.json()) as { products?: Product[] };
      })
      .then((data) => {
        if (!cancelled && data?.products) setProducts(data.products);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  return products;
}
