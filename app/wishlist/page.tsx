"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { formatMoney } from "@/lib/products";
import { useCatalogProducts } from "@/lib/use-catalog-products";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items);
  const toggleItem = useWishlistStore((state) => state.toggleItem);
  const addItem = useCartStore((state) => state.addItem);
  const products = useCatalogProducts();
  const savedProducts = products.filter((product) => items.includes(product.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="mb-8">
        <div className="text-[10px] uppercase tracking-[0.35em] text-[#666]">Wishlist</div>
        <h1 className="mt-3 font-display text-5xl md:text-7xl">SAVED PIECES</h1>
      </div>

      {savedProducts.length === 0 ? (
        <div className="border border-[#080808]/10 bg-white p-12 text-center">
          <div className="text-[10px] uppercase tracking-[0.35em] text-[#666]">No saved items</div>
          <p className="mt-3 text-sm text-[#444]">Your favorites will appear here when you save them.</p>
          <Link href="/shop" className="mt-5 inline-flex border border-[#080808] bg-[#080808] px-5 py-3 text-[10px] uppercase tracking-[0.28em] text-[#f4f2ed]">
            Browse The Shop
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {savedProducts.map((product) => (
            <div key={product.id} className="border border-[#080808]/10 bg-white p-4">
              <img src={product.images[0]} alt={product.name} className="h-80 w-full object-cover" />
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-medium">{product.name}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#666]">{product.category}</div>
                </div>
                <button type="button" onClick={() => toggleItem(product.id)} aria-label="Remove from wishlist">
                  <Heart size={16} fill="currentColor" />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-base">{formatMoney(product.price)}</div>
                <button
                  type="button"
                  onClick={() => addItem({ id: product.id, slug: product.slug, name: product.name, price: product.price, color: product.colors[0], size: product.sizes[0], image: product.images[0], quantity: 1 })}
                  className="flex items-center gap-2 border border-[#080808] bg-[#080808] px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-[#f4f2ed]"
                >
                  <ShoppingBag size={13} />
                  Move to Bag
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
