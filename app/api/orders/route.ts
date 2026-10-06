import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createOrder } from "@/lib/order-store.server";
import type { StoreOrder } from "@/lib/order-types";
import { preparePricedOrder } from "@/lib/order-pricing.server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const requestBody: unknown = await request.json();
    const prepared = await preparePricedOrder(requestBody);
    if ("error" in prepared) return NextResponse.json({ error: prepared.error }, { status: prepared.status });
    const checkout = prepared.value;
    if (checkout.shippingAddress.country === "Nigeria") {
      return NextResponse.json({ error: "Use Paystack checkout for Nigerian orders." }, { status: 400 });
    }
    const orderId = randomUUID();
    const orderNumber = `VER-${new Date().getFullYear()}-${randomUUID().slice(0, 6).toUpperCase()}`;
    const order: StoreOrder = {
      id: orderId,
      orderNumber,
      createdAt: new Date().toISOString(),
      status: "new",
      paymentStatus: "pending",
      customer: checkout.customer,
      shippingAddress: checkout.shippingAddress,
      items: checkout.items,
      subtotal: checkout.subtotal,
      shipping: checkout.shipping,
      discount: checkout.discount,
      total: checkout.total,
      currency: "USD",
      notifications: { email: "not-configured", sms: "not-configured" },
    };

    await createOrder(order);
    return NextResponse.json({ order }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "We couldn't save your order. Please try again." }, { status: 500 });
  }
}
