import "server-only";

import { z } from "zod";
import type { OrderItem } from "@/lib/order-types";
import { getCatalogProducts } from "@/lib/product-catalog.server";

export const checkoutPayloadSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2).max(120),
    email: z.email(),
    phone: z.string().trim().min(7).max(25).regex(/^[+0-9()\-\s]+$/),
  }),
  shippingAddress: z.object({
    address: z.string().trim().min(4).max(240),
    city: z.string().trim().min(2).max(100),
    postalCode: z.string().trim().min(2).max(24),
    country: z.string().trim().min(2).max(80),
  }),
  items: z.array(z.object({
    productId: z.string().min(1),
    color: z.string().min(1).max(40),
    size: z.string().min(1).max(24),
    quantity: z.number().int().min(1).max(50),
  })).min(1).max(50),
  promoCode: z.string().trim().max(40).optional(),
});

const discountCodes: Record<string, number> = {
  TEESAFAIRS10: 0.1,
  VERANO10: 0.1,
  WELCOME15: 0.15,
};

export async function preparePricedOrder(input: unknown) {
  const parsed = checkoutPayloadSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your order details.", status: 400 as const };
  }

  const catalog = await getCatalogProducts();
  const items: OrderItem[] = [];
  for (const requestedItem of parsed.data.items) {
    const product = catalog.find((entry) => entry.id === requestedItem.productId);
    if (!product) return { error: "A product in your cart is no longer available.", status: 400 as const };
    if (!product.colors.includes(requestedItem.color) || !product.sizes.includes(requestedItem.size)) {
      return { error: `${product.name} has an invalid color or size selection.`, status: 400 as const };
    }
    if (requestedItem.quantity > product.stock) {
      return { error: `${product.name} does not have enough stock for this quantity.`, status: 400 as const };
    }

    items.push({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0],
      color: requestedItem.color,
      size: requestedItem.size,
      quantity: requestedItem.quantity,
      unitPrice: product.price,
    });
  }

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shipping = subtotal >= 150 ? 0 : 24;
  const discountRate = parsed.data.promoCode ? discountCodes[parsed.data.promoCode.toUpperCase()] ?? 0 : 0;
  const discount = subtotal * discountRate;

  return {
    value: {
      ...parsed.data,
      items,
      subtotal,
      shipping,
      discount,
      total: subtotal + shipping - discount,
    },
  } as const;
}
