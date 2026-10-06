"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatMoney } from "@/lib/products";
import { useCartStore } from "@/store/cart-store";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const changeSize = useCartStore((state) => state.changeSize);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= 150 ? 0 : 24;
  const discount = 0;
  const total = subtotal + shipping - discount;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="mb-8">
        <div className="text-[10px] uppercase tracking-[0.35em] text-[#666]">Cart</div>
        <h1 className="mt-3 font-display text-5xl md:text-7xl">YOUR BAG</h1>
      </div>

      {items.length === 0 ? (
        <div className="border border-[#080808]/10 bg-white p-12 text-center">
          <div className="text-[10px] uppercase tracking-[0.35em] text-[#666]">Your bag is empty</div>
          <p className="mt-3 text-sm text-[#444]">Add pieces from your wardrobe and continue to checkout when ready.</p>
          <Link href="/shop" className="mt-5 inline-flex border border-[#080808] bg-[#080808] px-5 py-3 text-[10px] uppercase tracking-[0.28em] text-[#f4f2ed]">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            {items.map((item) => (
              <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4 border border-[#080808]/10 bg-white p-4">
                <img src={item.image} alt={item.name} className="h-36 w-28 object-cover" />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-medium">{item.name}</div>
                      <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#666]">{item.color} / {item.size}</div>
                    </div>
                    <button type="button" onClick={() => removeItem(item.id)} className="p-1 text-[#080808]/60">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 border border-[#080808]/10">
                      <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2"><Minus size={12} /></button>
                      <span className="min-w-6 text-center text-sm">{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2"><Plus size={12} /></button>
                    </div>
                    <div className="text-lg">{formatMoney(item.price * item.quantity)}</div>
                  </div>

                  <div className="mt-4">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#666]">Size</label>
                    <select value={item.size} onChange={(event) => changeSize(item.id, event.target.value)} className="mt-2 block border border-[#080808]/10 bg-[#f4f2ed] px-3 py-2 text-xs text-[#080808]">
                      {['XS', 'S', 'M', 'L', 'XL', '30', '32', '34', '36', '38'].map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit border border-[#080808]/10 bg-white p-6">
            <div className="mb-4 text-[10px] uppercase tracking-[0.35em] text-[#666]">Summary</div>
            <div className="space-y-3 text-sm text-[#3d3d3d]">
              <div className="flex items-center justify-between"><span>Subtotal</span><span>{formatMoney(subtotal)}</span></div>
              <div className="flex items-center justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatMoney(shipping)}</span></div>
              <div className="flex items-center justify-between"><span>Discount</span><span>-{formatMoney(discount)}</span></div>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-[#080808]/10 pt-4 text-lg font-medium">
              <span>Total</span>
              <span>{formatMoney(total)}</span>
            </div>
            <Link href="/checkout" className="mt-6 flex w-full items-center justify-center bg-[#080808] px-4 py-3 text-[10px] uppercase tracking-[0.28em] text-[#f4f2ed]">
              Proceed to Checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
