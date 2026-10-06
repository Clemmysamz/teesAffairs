import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ADMIN_SESSION_COOKIE, isAdminSessionValid } from "@/lib/admin-auth.server";
import { getOrders, updateOrderStatus } from "@/lib/order-store.server";

export const runtime = "nodejs";

async function isAuthorized() {
  const cookieStore = await cookies();
  return isAdminSessionValid(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}

export async function GET() {
  if (!await isAuthorized()) return NextResponse.json({ error: "Admin access required." }, { status: 401 });
  const orders = await getOrders();
  return NextResponse.json({ orders }, { headers: { "Cache-Control": "no-store" } });
}

export async function PATCH(request: Request) {
  if (!await isAuthorized()) return NextResponse.json({ error: "Admin access required." }, { status: 401 });

  try {
    const body: unknown = await request.json();
    const parsed = z.object({
      id: z.string().min(1),
      status: z.enum(["new", "processing", "fulfilled", "cancelled"]),
    }).safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid order update." }, { status: 400 });

    const order = await updateOrderStatus(parsed.data.id, parsed.data.status);
    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "Order could not be updated." }, { status: 400 });
  }
}
