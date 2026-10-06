import { NextResponse } from "next/server";
import { sendOrderNotifications } from "@/lib/order-notifications.server";
import { getOrderByPaymentReference, updateOrderNotifications, updateOrderPaymentStatus } from "@/lib/order-store.server";
import { toKobo } from "@/lib/currency";

export const runtime = "nodejs";

function redirectToCheckout(request: Request, values: Record<string, string>) {
  const url = new URL("/checkout/success", request.url);
  for (const [key, value] of Object.entries(values)) url.searchParams.set(key, value);
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const reference = url.searchParams.get("reference") ?? url.searchParams.get("trxref");
  const transactionReference = url.searchParams.get("trxref");
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!reference || (transactionReference && transactionReference !== reference)) {
    return redirectToCheckout(request, { payment: "failed" });
  }

  const order = await getOrderByPaymentReference(reference);
  if (!order) return redirectToCheckout(request, { payment: "failed" });
  if (!secretKey) return redirectToCheckout(request, { payment: "review", order: order.orderNumber });

  try {
    const verificationResponse = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    const verification = await verificationResponse.json() as {
      status?: boolean;
      data?: { status?: string; reference?: string; amount?: number; currency?: string };
    };

    if (!verificationResponse.ok || !verification.status || !verification.data) {
      return redirectToCheckout(request, { payment: "review", order: order.orderNumber });
    }

    const payment = verification.data;
    const validTransaction = payment.reference === reference && payment.currency === order.currency && payment.amount === toKobo(order.total);
    if (!validTransaction) {
      return redirectToCheckout(request, { payment: "review", order: order.orderNumber });
    }

    if (payment.status !== "success") {
      await updateOrderPaymentStatus(order.id, "failed");
      await updateOrderNotifications(order.id, { email: "not-sent", sms: "not-sent" });
      return redirectToCheckout(request, { payment: "failed", order: order.orderNumber });
    }

    const paymentUpdate = await updateOrderPaymentStatus(order.id, "paid");
    if (paymentUpdate?.newlyPaid) {
      const notifications = await sendOrderNotifications(paymentUpdate.order);
      await updateOrderNotifications(order.id, notifications);
    }

    return redirectToCheckout(request, { payment: "success", order: order.orderNumber });
  } catch {
    return redirectToCheckout(request, { payment: "review", order: order.orderNumber });
  }
}
