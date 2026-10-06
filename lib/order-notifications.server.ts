import "server-only";

import type { StoreOrder } from "@/lib/order-types";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] ?? character);
}

async function sendOrderEmail(order: StoreOrder) {
  const apiKey = process.env.RESEND_API_KEY ?? process.env.RESEND_KEY;
  const from = process.env.RESEND_FROM;
  const to = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!apiKey || !from || !to) return "not-configured" as const;

  const itemRows = order.items.map((item) =>
    `<li>${item.quantity} × ${escapeHtml(item.name)} (${escapeHtml(item.color)} / ${escapeHtml(item.size)})</li>`,
  ).join("");
  const address = [order.shippingAddress.address, order.shippingAddress.city, order.shippingAddress.postalCode, order.shippingAddress.country]
    .map(escapeHtml)
    .join(", ");
  const html = `<h1>New order ${escapeHtml(order.orderNumber)}</h1><p>Payment status: ${escapeHtml(order.paymentStatus)}</p><p>Customer: ${escapeHtml(order.customer.name)} · ${escapeHtml(order.customer.email)} · ${escapeHtml(order.customer.phone)}</p><ul>${itemRows}</ul><p>Total: ${new Intl.NumberFormat("en-US", { style: "currency", currency: order.currency }).format(order.total)}</p><p>Ship to: ${address}</p>`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject: `New order ${order.orderNumber} · ${order.customer.name}`, html }),
      signal: AbortSignal.timeout(10000),
    });
    return response.ok ? "sent" as const : "failed" as const;
  } catch {
    return "failed" as const;
  }
}

async function sendOrderSms(order: StoreOrder) {
  const apiKey = process.env.TERMII_API_KEY;
  const to = process.env.ADMIN_PHONE;
  if (!apiKey || !to) return "not-configured" as const;

  const itemCount = order.items.reduce((total, item) => total + item.quantity, 0);
  const amount = new Intl.NumberFormat("en-US", { style: "currency", currency: order.currency }).format(order.total);

  try {
    const response = await fetch("https://api.ng.termii.com/api/sms/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to,
        from: process.env.TERMII_SENDER_ID || "TeesAffairs",
        sms: `Paid order ${order.orderNumber}: ${order.customer.name}, ${itemCount} item(s), ${amount}.`,
        type: "plain",
        channel: "generic",
        api_key: apiKey,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return "failed" as const;
    const result = await response.json() as { code?: string };
    return !result.code || result.code.toLowerCase() === "ok" ? "sent" as const : "failed" as const;
  } catch {
    return "failed" as const;
  }
}

export async function sendOrderNotifications(order: StoreOrder) {
  const [email, sms] = await Promise.all([sendOrderEmail(order), sendOrderSms(order)]);
  return { email, sms };
}
