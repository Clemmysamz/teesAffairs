"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { filterProducts, getProductCategories, getProductColors, getProductSizes } from "@/lib/products";
import { useCatalogProducts } from "@/lib/use-catalog-products";

export default function ShopPage() {
  const products = useCatalogProducts();
  const [category, setCategory] = useState("all");
  const [size, setSize] = useState("all");
  const [color, setColor] = useState("all");
  const [price, setPrice] = useState("all");
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState("featured");

  const filteredProducts = useMemo(
    () =>
      filterProducts({
        products,
        category,
        size,
        color,
        price,
        inStock,
        sort,
      }),
    [products, category, size, color, price, inStock, sort],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="mb-10">
        <div className="text-[10px] uppercase tracking-[0.35em] text-[#666]">Shop</div>
        <h1 className="mt-3 font-display text-5xl md:text-7xl">SHOP</h1>
        <p className="mt-3 max-w-2xl text-lg text-[#4d4d4d]">Contemporary pieces designed for everyday distinction.</p>
      </div>

      <div className="mb-8 flex flex-col gap-4 border border-[#080808]/10 bg-white p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-3">
          <label className="text-[10px] uppercase tracking-[0.28em] text-[#666]">
            Filter
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 block w-full border border-[#080808]/10 bg-[#f4f2ed] px-3 py-2 text-xs text-[#080808]">
              <option value="all">Category</option>
              {getProductCategories(products).map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>

          <label className="text-[10px] uppercase tracking-[0.28em] text-[#666]">
            Size
            <select value={size} onChange={(event) => setSize(event.target.value)} className="mt-2 block w-full border border-[#080808]/10 bg-[#f4f2ed] px-3 py-2 text-xs text-[#080808]">
              <option value="all">All Sizes</option>
              {getProductSizes(products).map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>

          <label className="text-[10px] uppercase tracking-[0.28em] text-[#666]">
            Color
            <select value={color} onChange={(event) => setColor(event.target.value)} className="mt-2 block w-full border border-[#080808]/10 bg-[#f4f2ed] px-3 py-2 text-xs text-[#080808]">
              <option value="all">All Colors</option>
              {getProductColors(products).map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>

          <label className="text-[10px] uppercase tracking-[0.28em] text-[#666]">
            Price
            <select value={price} onChange={(event) => setPrice(event.target.value)} className="mt-2 block w-full border border-[#080808]/10 bg-[#f4f2ed] px-3 py-2 text-xs text-[#080808]">
              <option value="all">All Prices</option>
              <option value="under-100">Under $100</option>
              <option value="100-150">$100 - $150</option>
              <option value="150-plus">$150+</option>
            </select>
          </label>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#666]">
            <input type="checkbox" checked={inStock} onChange={() => setInStock((current) => !current)} />
            In Stock
          </label>
          <label className="text-[10px] uppercase tracking-[0.28em] text-[#666]">
            Sort By
            <select value={sort} onChange={(event) => setSort(event.target.value)} className="mt-2 block border border-[#080808]/10 bg-[#f4f2ed] px-3 py-2 text-xs text-[#080808]">
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="bestselling">Best Selling</option>
            </select>
          </label>
        </div>
      </div>

      <div className="product-grid grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.length ? (
          filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          <div className="col-span-full border border-[#080808]/10 bg-white p-12 text-center">
            <div className="text-[10px] uppercase tracking-[0.35em] text-[#666]">No products found</div>
            <p className="mt-3 text-sm text-[#404040]">Try another filter combination to discover more Tees Affairs essentials.</p>
          </div>
        )}
      </div>
    </div>
  );
}
