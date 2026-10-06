"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { formatMoney } from "@/lib/products";
import { getCartSummary, useCartStore } from "@/store/cart-store";

export function CartDrawer() {
  const open = useCartStore((state) => state.open);
  const items = useCartStore((state) => state.items);
  const setOpen = useCartStore((state) => state.setOpen);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const changeSize = useCartStore((state) => state.changeSize);
  const promoInput = useCartStore((state) => state.promoInput);
  const setPromoInput = useCartStore((state) => state.setPromoInput);
  const appliedPromo = useCartStore((state) => state.appliedPromo);
  const applyPromo = useCartStore((state) => state.applyPromo);
  const clearPromo = useCartStore((state) => state.clearPromo);
  const summary = useMemo(() => getCartSummary(useCartStore.getState()), [items, appliedPromo]);
  const [message, setMessage] = useState("");

  const handleApplyPromo = () => {
    const result = applyPromo(promoInput);
    setMessage(result.message);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-[#080808]/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            onClick={(event) => event.stopPropagation()}
            className="ml-auto flex h-full w-full max-w-md flex-col bg-[#f4f2ed] p-5 text-[#080808]"
          >
            <div className="mb-4 flex items-center justify-between border-b border-[#080808]/10 pb-4">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em]">
                <ShoppingBag size={15} />
                Bag ({items.reduce((sum, item) => sum + item.quantity, 0)})
              </div>
              <button type="button" aria-label="Close cart" onClick={() => setOpen(false)} className="p-1">
                <X size={18} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <div className="mb-3 text-[11px] uppercase tracking-[0.3em] text-[#555]">Your bag is empty</div>
                <p className="mb-6 max-w-xs text-sm text-[#5d5d5d]">Add signature layers, everyday essentials, and finishing pieces to build your Tees Affairs uniform.</p>
                <Link href="/shop" onClick={() => setOpen(false)} className="border border-[#080808] bg-[#080808] px-5 py-3 text-[10px] uppercase tracking-[0.28em] text-[#f4f2ed]">
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3 border-b border-[#080808]/10 pb-4">
                      <img src={item.image} alt={item.name} className="h-28 w-20 object-cover" />
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-medium">{item.name}</div>
                            <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#5f5f5f]">{item.color} / {item.size}</div>
                          </div>
                          <button type="button" onClick={() => removeItem(item.id)} className="p-1 text-[#080808]/60 hover:text-[#080808]" aria-label={`Remove ${item.name}`}>
                            <Trash2 size={15} />
                          </button>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-2 border border-[#080808]/10">
                            <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2">
                              <Minus size={12} />
                            </button>
                            <span className="min-w-6 text-center text-sm">{item.quantity}</span>
                            <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2">
                              <Plus size={12} />
                            </button>
                          </div>
                          <div className="text-sm">{formatMoney(item.price * item.quantity)}</div>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <label className="text-[10px] uppercase tracking-[0.2em] text-[#5f5f5f]">Size</label>
                          <select
                            value={item.size}
                            onChange={(event) => changeSize(item.id, event.target.value)}
                            className="border border-[#080808]/10 bg-white px-2 py-1 text-xs"
                          >
                            {["XS", "S", "M", "L", "XL", "30", "32", "34", "36", "38"].map((size) => (
                              <option key={size} value={size}>{size}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 border-t border-[#080808]/10 pt-4">
                  <div className="mb-3 flex gap-2">
                    <input
                      aria-label="Promo code"
                      value={promoInput}
                      onChange={(event) => setPromoInput(event.target.value)}
                      placeholder="Promo code"
                      className="flex-1 border border-[#080808]/10 bg-white px-3 py-2 text-sm outline-none"
                    />
                    <button type="button" onClick={handleApplyPromo} className="border border-[#080808] bg-[#080808] px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-[#f4f2ed]">
                      Apply
                    </button>
                  </div>
                  {message ? <div className="mb-3 text-xs text-[#4b4b4b]">{message}</div> : null}
                  {appliedPromo ? (
                    <button type="button" onClick={clearPromo} className="mb-3 text-[9px] uppercase tracking-[0.22em] text-[#080808] underline">
                      Remove promo
                    </button>
                  ) : null}

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between"><span>Subtotal</span><span>{formatMoney(summary.subtotal)}</span></div>
                    <div className="flex items-center justify-between"><span>Shipping</span><span>{summary.shipping === 0 ? "Free" : formatMoney(summary.shipping)}</span></div>
                    <div className="flex items-center justify-between"><span>Discount</span><span>-{formatMoney(summary.discount)}</span></div>
                    <div className="mt-3 flex items-center justify-between border-t border-[#080808]/10 pt-3 text-base font-medium">
                      <span>Total</span>
                      <span>{formatMoney(summary.total)}</span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    onClick={() => setOpen(false)}
                    className="mt-5 flex w-full items-center justify-center bg-[#080808] px-4 py-3 text-[10px] uppercase tracking-[0.28em] text-[#f4f2ed] transition hover:bg-[#f4f2ed] hover:text-[#080808] hover:border hover:border-[#080808]"
                  >
                    Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
