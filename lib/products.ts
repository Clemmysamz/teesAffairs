import { PRODUCTS, collectionList, type Product } from "@/data/storefront";

export const formatMoney = (value: number, currency: "USD" | "NGN" = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);

export const getProductBySlug = (slug: string, products: Product[] = PRODUCTS) => products.find((product) => product.slug === slug);

export const getProductsByCollection = (slug: string, products: Product[] = PRODUCTS) =>
  products.filter((product) => product.collection === slug);

export const getCollectionMeta = (slug: string) =>
  collectionList.find((collection) => collection.slug === slug) ?? collectionList[0];

export const getFeaturedProducts = (products: Product[] = PRODUCTS) => products.filter((product) => product.featured).slice(0, 6);

export const getNewArrivals = (products: Product[] = PRODUCTS) => products.filter((product) => product.newArrival).slice(0, 4);

export const getBestSellers = (products: Product[] = PRODUCTS) => [...products].sort((a, b) => b.rating - a.rating).slice(0, 6);

export const searchProducts = (query: string, products: Product[] = PRODUCTS) => {
  const cleaned = query.trim().toLowerCase();
  if (!cleaned) return products;

  return products.filter((product) => {
    const haystack = [
      product.name,
      product.description,
      product.category,
      product.collection,
      ...(product.tags ?? []),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(cleaned);
  });
};

export const filterProducts = ({
  products,
  category,
  size,
  color,
  price,
  inStock,
  sort,
}: {
  products: Product[];
  category: string;
  size: string;
  color: string;
  price: string;
  inStock: boolean;
  sort: string;
}) => {
  let filtered = [...products];

  if (category && category !== "all") {
    filtered = filtered.filter((product) => product.category.toLowerCase() === category.toLowerCase());
  }

  if (size && size !== "all") {
    filtered = filtered.filter((product) => product.sizes.includes(size));
  }

  if (color && color !== "all") {
    filtered = filtered.filter((product) => product.colors.some((item) => item.toLowerCase() === color.toLowerCase()));
  }

  if (price === "under-100") {
    filtered = filtered.filter((product) => product.price < 100);
  }
  if (price === "100-150") {
    filtered = filtered.filter((product) => product.price >= 100 && product.price <= 150);
  }
  if (price === "150-plus") {
    filtered = filtered.filter((product) => product.price > 150);
  }

  if (inStock) {
    filtered = filtered.filter((product) => product.stock > 0);
  }

  switch (sort) {
    case "price-low":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      filtered.sort((a, b) => Number(b.newArrival) - Number(a.newArrival));
      break;
    case "bestselling":
      filtered.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    default:
      filtered.sort((a, b) => Number(b.featured) - Number(a.featured));
      break;
  }

  return filtered;
};

export const getProductCategories = (products: Product[] = PRODUCTS) =>
  Array.from(new Set(products.map((product) => product.category))).sort();

export const getProductColors = (products: Product[] = PRODUCTS) =>
  Array.from(new Set(products.flatMap((product) => product.colors))).sort();

export const getProductSizes = (products: Product[] = PRODUCTS) =>
  Array.from(new Set(products.flatMap((product) => product.sizes))).sort();
