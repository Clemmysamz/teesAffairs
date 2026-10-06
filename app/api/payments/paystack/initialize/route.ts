import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createOrder } from "@/lib/order-store.server";
import { preparePricedOrder } from "@/lib/order-pricing.server";
import type { StoreOrder } from "@/lib/order-types";
import { toKobo, USD_TO_NGN_RATE, usdToNgn } from "@/lib/currency";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) return NextResponse.json({ error: "Paystack is not configured on this store." }, { status: 503 });

  try {
    const requestBody: unknown = await request.json();
    const prepared = await preparePricedOrder(requestBody);
    if ("error" in prepared) return NextResponse.json({ error: prepared.error }, { status: prepared.status });
    const checkout = prepared.value;
    if (checkout.shippingAddress.country !== "Nigeria") {
      return NextResponse.json({ error: "Paystack checkout is currently available for Nigeria only." }, { status: 400 });
    }

    const rate = USD_TO_NGN_RATE;

    const subtotal = usdToNgn(checkout.subtotal);
    const shipping = usdToNgn(checkout.shipping);
    const discount = usdToNgn(checkout.discount);
    const total = subtotal + shipping - discount;
    const reference = `TEE-${randomUUID().replaceAll("-", "").toUpperCase()}`;
    const orderId = randomUUID();
    const orderNumber = `VER-${new Date().getFullYear()}-${randomUUID().slice(0, 6).toUpperCase()}`;
    const appUrl = process.env.APP_URL || new URL(request.url).origin;

    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: { Authorization: `Bearer ${secretKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        email: checkout.customer.email,
        amount: toKobo(total),
        currency: "NGN",
        reference,
        callback_url: new URL("/api/payments/paystack/callback", appUrl).toString(),
        metadata: {
          order_id: orderId,
          order_number: orderNumber,
          customer_name: checkout.customer.name,
          customer_phone: checkout.customer.phone,
          item_count: checkout.items.reduce((count, item) => count + item.quantity, 0),
        },
      }),
      signal: AbortSignal.timeout(15000),
    });
    const paystackResult = await paystackResponse.json() as {
      status?: boolean;
      message?: string;
      data?: { authorization_url?: string; reference?: string };
    };
    const authorizationUrl = paystackResult.data?.authorization_url;
    if (!paystackResponse.ok || !paystackResult.status || !authorizationUrl || paystackResult.data?.reference !== reference) {
      return NextResponse.json({ error: paystackResult.message ?? "Paystack could not start this payment." }, { status: 502 });
    }

    const order: StoreOrder = {
      id: orderId,
      orderNumber,
      createdAt: new Date().toISOString(),
      status: "new",
      paymentStatus: "pending",
      paymentReference: reference,
      exchangeRate: rate,
      customer: checkout.customer,
      shippingAddress: checkout.shippingAddress,
      items: checkout.items,
      subtotal,
      shipping,
      discount,
      total,
      currency: "NGN",
      notifications: { email: "pending", sms: "pending" },
    };
    await createOrder(order);

    return NextResponse.json({ authorizationUrl, orderNumber });
  } catch {
    return NextResponse.json({ error: "Payment could not be initialized. Please try again." }, { status: 500 });
  }
}
