import { CheckoutSuccessContent } from "@/components/checkout-success-content";
import { getOrderByOrderNumber } from "@/lib/order-store.server";

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ order?: string; payment?: string }> }) {
  const { order, payment } = await searchParams;
  const savedOrder = order ? await getOrderByOrderNumber(order) : null;
  const verifiedPayment = savedOrder?.paymentStatus === "paid"
    ? "success"
    : savedOrder?.paymentStatus === "failed"
      ? "failed"
      : payment === "review"
        ? "review"
        : "pending";

  return <CheckoutSuccessContent order={savedOrder?.orderNumber} payment={verifiedPayment} />;
}
