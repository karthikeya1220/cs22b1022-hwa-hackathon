import { NextResponse } from "next/server";
import { createOrder, type CreateOrderInput } from "@/lib/orders";
import { isUpstashConfigured } from "@/lib/upstash";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isUpstashConfigured()) {
    return NextResponse.json(
      {
        error:
          "Order storage is not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const result = await createOrder(body as CreateOrderInput);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  // Public receipt only — never include customer fields in the response.
  return NextResponse.json(result.receipt, { status: 201 });
}
