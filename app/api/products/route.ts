import { NextResponse } from "next/server";
import { getCatalogProducts } from "@/lib/product-catalog.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const products = await getCatalogProducts();
  return NextResponse.json({ products }, { headers: { "Cache-Control": "no-store" } });
}
