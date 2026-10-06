"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { popularSearches, recentSearches } from "@/data/storefront";
import { searchProducts } from "@/lib/products";
import { useCatalogProducts } from "@/lib/use-catalog-products";

function SearchContent() {
  const params = useSearchParams();
  const initialQuery = params.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const products = useCatalogProducts();

  const results = useMemo(() => searchProducts(query, products), [query, products]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="mb-8">
        <div className="text-[10px] uppercase tracking-[0.35em] text-[#666]">Search</div>
        <h1 className="mt-3 font-display text-5xl md:text-7xl">FIND YOUR PIECE.</h1>
      </div>

      <div className="mb-10 flex max-w-2xl flex-col gap-3">
        <input
          aria-label="Search products"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search products, categories, or tags..."
          className="border border-[#080808]/10 bg-white px-4 py-3 text-base text-[#080808] outline-none focus:border-[#080808]"
        />
      </div>

      {!query ? (
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <div className="mb-3 text-[10px] uppercase tracking-[0.3em] text-[#666]">Recent searches</div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((term) => (
                <button key={term} type="button" onClick={() => setQuery(term)} className="border border-[#080808]/15 px-3 py-2 text-[10px] uppercase tracking-[0.2em]">
                  {term}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-3 text-[10px] uppercase tracking-[0.3em] text-[#666]">Popular searches</div>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button key={term} type="button" onClick={() => setQuery(term)} className="border border-[#080808]/15 px-3 py-2 text-[10px] uppercase tracking-[0.2em]">
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : results.length ? (
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
          {results.map((product) => (
            <Link key={product.id} href={`/products/${product.slug}`} className="border border-[#080808]/10 bg-white p-3 transition hover:border-[#080808]">
              <img src={product.images[0]} alt={product.name} className="h-72 w-full object-cover" />
              <div className="mt-3 text-sm font-medium">{product.name}</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#666]">{product.category}</div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="border border-[#080808]/10 bg-white p-12 text-center">
          <div className="text-[10px] uppercase tracking-[0.35em] text-[#666]">No results</div>
          <p className="mt-3 text-sm text-[#3e3e3e]">There are no products matching “{query}”. Try a different search.</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-12 md:px-6"><div className="text-[10px] uppercase tracking-[0.35em] text-[#666]">Search</div></div>}>
      <SearchContent />
    </Suspense>
  );
}
