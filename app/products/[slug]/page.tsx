"use client";

import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { Heart, Minus, Plus, ShieldCheck, ShoppingBag, Star, Truck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { formatMoney, getProductBySlug } from "@/lib/products";
import { useCatalogProducts } from "@/lib/use-catalog-products";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ slug: string; image: string } | null>(null);
  const [colorSelection, setColorSelection] = useState<{ slug: string; color: string } | null>(null);
  const [sizeSelection, setSizeSelection] = useState<{ slug: string; size: string } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const products = useCatalogProducts();

  useEffect(() => {
    void params.then((value) => {
      setSlug(value.slug);
    });
  }, [params]);

  const product = useMemo(() => (slug ? getProductBySlug(slug, products) : undefined), [slug, products]);
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setOpen);
  const { toggleItem, items } = useWishlistStore();
  const liked = product ? items.includes(product.id) : false;

  if (!product) {
    return null;
  }

  const selectedColor = colorSelection?.slug === product.slug ? colorSelection.color : product.colors[0];
  const selectedSize = sizeSelection?.slug === product.slug ? sizeSelection.size : product.sizes[0];
  const similar = products.filter((item) => item.collection === product.collection && item.slug !== product.slug).slice(0, 3);

  const handleAddToBag = () => {
    if (!selectedColor || !selectedSize) return;
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      color: selectedColor,
      size: selectedSize,
      image: product.images[0],
      quantity,
    });
    setCartOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="mb-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#666]">
        <Link href="/shop">Shop</Link>
        <span>/</span>
        <Link href={`/collections/${product.collection}`}>{product.collection.replace("-", " ")}</Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-[80px_1fr]">
            <div className="flex flex-col gap-3">
              {product.images.map((image) => (
                <button key={image} type="button" onClick={() => setSelectedImage({ slug: product.slug, image })} className="border border-[#080808]/10 bg-white p-1">
                  <img src={image} alt={product.name} className="h-20 w-full object-cover" />
                </button>
              ))}
            </div>
            <div className="overflow-hidden border border-[#080808]/10 bg-white">
              <img src={selectedImage?.slug === product.slug ? selectedImage.image : product.images[0]} alt={product.name} className="h-full w-full object-cover" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 md:p-8">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-[0.3em] text-[#666]">{product.category}</div>
            <button type="button" onClick={() => toggleItem(product.id)} className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#080808]">
              <Heart size={15} fill={liked ? "currentColor" : "none"} />
              {liked ? "Saved" : "Wishlist"}
            </button>
          </div>

          <h1 className="font-display text-5xl leading-none md:text-6xl">{product.name}</h1>
          <div className="mt-4 flex items-center gap-2 text-sm text-[#4a4a4a]">
            <Star size={14} className="fill-current text-[#080808]" />
            {product.rating} <span>({product.reviewCount} reviews)</span>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <div className="text-2xl font-medium">{formatMoney(product.price)}</div>
            {product.compareAtPrice ? <div className="text-base text-[#6f6f6f] line-through">{formatMoney(product.compareAtPrice)}</div> : null}
          </div>

          <p className="mt-5 text-base leading-relaxed text-[#4c4c4c]">{product.description}</p>

          <div className="mt-6 space-y-5">
            <div>
              <div className="mb-2 text-[10px] uppercase tracking-[0.28em] text-[#666]">Color</div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setColorSelection({ slug: product.slug, color })}
                    className={`border px-3 py-2 text-[10px] uppercase tracking-[0.2em] ${selectedColor === color ? "border-[#080808] bg-[#080808] text-[#f4f2ed]" : "border-[#080808]/15 bg-transparent text-[#080808]"}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-[#666]">
                <span>Size</span>
                <Link href="/size-guide" className="underline underline-offset-4">Size Guide</Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSizeSelection({ slug: product.slug, size })}
                    className={`border px-3 py-2 text-[10px] uppercase tracking-[0.2em] ${selectedSize === size ? "border-[#080808] bg-[#080808] text-[#f4f2ed]" : "border-[#080808]/15 bg-transparent text-[#080808]"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 border-y border-[#080808]/10 py-4">
            <div className="flex items-center gap-2 border border-[#080808]/10">
              <button type="button" onClick={() => setQuantity((quantity) => Math.max(1, quantity - 1))} className="p-2"><Minus size={14} /></button>
              <span className="min-w-8 text-center text-sm">{quantity}</span>
              <button type="button" onClick={() => setQuantity((quantity) => quantity + 1)} className="p-2"><Plus size={14} /></button>
            </div>
            <div className="flex-1">
              <button type="button" onClick={handleAddToBag} className="flex w-full items-center justify-center gap-2 border border-[#080808] bg-[#080808] px-4 py-3 text-[10px] uppercase tracking-[0.28em] text-[#f4f2ed] transition hover:bg-[#f4f2ed] hover:text-[#080808]">
                <ShoppingBag size={15} />
                Add to Bag
              </button>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button type="button" className="flex-1 border border-[#080808] px-4 py-3 text-[10px] uppercase tracking-[0.28em] text-[#080808] transition hover:bg-[#080808] hover:text-[#f4f2ed]">
              Buy It Now
            </button>
          </div>

          <div className="mt-8 space-y-4 border-t border-[#080808]/10 pt-6 text-sm text-[#4a4a4a]">
            <div className="flex items-center gap-3"><ShieldCheck size={16} /> In stock and ready to ship</div>
            <div className="flex items-center gap-3"><Truck size={16} /> Free shipping over $150</div>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-[#080808]/10 pt-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-[#666]">Details</div>
            <p className="mt-3 text-sm text-[#444]">{product.description}</p>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-[#666]">Materials</div>
            <p className="mt-3 text-sm text-[#444]">{product.material}</p>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-[#666]">Care</div>
            <p className="mt-3 text-sm text-[#444]">{product.care}</p>
          </div>
        </div>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-[#666]">Fit</div>
            <p className="mt-3 text-sm text-[#444]">{product.fit}</p>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-[#666]">Shipping & Returns</div>
            <p className="mt-3 text-sm text-[#444]">Free shipping on orders over $150. Easy returns within 30 days.</p>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <div className="mb-6 flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#666]">You May Also Like</div>
        </div>
        <div className="product-grid grid grid-cols-2 gap-4 md:grid-cols-3">
          {similar.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
