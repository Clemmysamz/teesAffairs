"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCartStore } from "@/store/cart-store";

export function CheckoutSuccessContent({ order, payment }: { order?: string; payment?: string }) {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (payment === "success") clearCart();
  }, [clearCart, payment]);

  const isPaid = payment === "success";
  const hasFailed = payment === "failed";
  const needsReview = payment === "review";
  const heading = isPaid ? "PAYMENT CONFIRMED." : hasFailed ? "PAYMENT NOT COMPLETED." : needsReview ? "PAYMENT UNDER REVIEW." : "ORDER RECEIVED.";
  const description = isPaid
    ? "Paystack verified your payment. Your order is now being prepared."
    : hasFailed
      ? "The payment was not completed. Your cart is still available so you can try again."
      : needsReview
        ? "We could not verify the payment yet. Your order remains pending; please contact support before retrying."
        : "Your order has been saved, but payment is still pending for this destination.";

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 md:px-6">
      <div className="border border-[#080808]/10 bg-white p-8 text-center md:p-12">
        <div className="text-[10px] uppercase tracking-[0.35em] text-[#666]">{isPaid ? "Paid order" : hasFailed ? "Payment status" : "Order status"}</div>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl">{heading}</h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-[#444]">{description}</p>
        {order ? <div className="mt-8 inline-flex border border-[#080808] bg-[#080808] px-5 py-3 text-[10px] uppercase tracking-[0.28em] text-[#f4f2ed]">Order #{order}</div> : null}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {hasFailed ? <Link href="/checkout" className="border border-[#080808] bg-[#080808] px-5 py-3 text-[10px] uppercase tracking-[0.28em] text-[#f4f2ed]">Try payment again</Link> : null}
          <Link href="/shop" className="border border-[#080808] px-5 py-3 text-[10px] uppercase tracking-[0.28em] text-[#080808]">Continue shopping</Link>
        </div>
      </div>
    </div>
  );
}
