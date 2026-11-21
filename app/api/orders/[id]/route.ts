import { NextResponse } from "next/server";
import { getPublicReceipt } from "@/lib/orders";
import { isUpstashConfigured } from "@/lib/upstash";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;

  if (!isUpstashConfigured()) {
    return NextResponse.json(
      { error: "Order storage is not configured." },
      { status: 503 },
    );
  }

  const receipt = await getPublicReceipt(id);
  if (!receipt) {
    return NextResponse.json(
      { error: "Order not found." },
      { status: 404 },
    );
  }

  // Public receipt only — customer PII is never returned.
  return NextResponse.json(receipt, { status: 200 });
}
