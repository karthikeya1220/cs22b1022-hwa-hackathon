import { PRODUCT, getFinish } from "@/lib/product";
import { orderTotals } from "@/lib/pricing";
import { redisGet, redisSet } from "@/lib/upstash";

const ORDER_TTL_SECONDS = 60 * 60 * 24 * 30;

export type PublicOrderItem = {
  name: string;
  finish: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
};

export type PublicReceipt = {
  id: string;
  status: "confirmed";
  createdAt: string;
  items: PublicOrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  payment: {
    mode: "simulated";
    status: "not_charged";
  };
};

type StoredOrder = PublicReceipt & {
  customer: {
    email: string;
    name: string;
    phone?: string;
    address: string;
    city: string;
    postal: string;
    country: string;
  };
};

export type CreateOrderInput = {
  paymentMode?: string;
  customer?: {
    email?: unknown;
    name?: unknown;
    phone?: unknown;
    address?: unknown;
    city?: unknown;
    postal?: unknown;
    country?: unknown;
  };
  items?: Array<{ variantId?: unknown; qty?: unknown }>;
};

export type CreateOrderResult =
  | { ok: true; receipt: PublicReceipt }
  | { ok: false; status: 400 | 500 | 503; error: string };

function str(v: unknown, max = 200): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  if (!t || t.length > max) return null;
  return t;
}

function createOrderId(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 8; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `ROL-${out}`;
}

function toPublicReceipt(stored: StoredOrder): PublicReceipt {
  return {
    id: stored.id,
    status: stored.status,
    createdAt: stored.createdAt,
    items: stored.items,
    subtotal: stored.subtotal,
    shipping: stored.shipping,
    total: stored.total,
    payment: stored.payment,
  };
}

export function validateCreateOrder(input: CreateOrderInput):
  | {
      ok: true;
      value: {
        customer: StoredOrder["customer"];
        items: { variantId: string; qty: number }[];
      };
    }
  | { ok: false; error: string } {
  if (input.paymentMode !== "simulated") {
    return {
      ok: false,
      error: 'paymentMode must be "simulated" for this demo store.',
    };
  }

  const c = input.customer ?? {};
  const email = str(c.email, 254);
  const name = str(c.name, 120);
  const address = str(c.address, 200);
  const city = str(c.city, 100);
  const postal = str(c.postal, 32);
  const country = str(c.country, 100);
  const phoneRaw = c.phone;
  const phone =
    phoneRaw === undefined || phoneRaw === null || phoneRaw === ""
      ? undefined
      : (str(phoneRaw, 32) ?? undefined);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "A valid customer email is required." };
  }
  if (!name) return { ok: false, error: "Customer name is required." };
  if (!address) return { ok: false, error: "Customer address is required." };
  if (!city) return { ok: false, error: "Customer city is required." };
  if (!postal) return { ok: false, error: "Customer postal code is required." };
  if (!country) return { ok: false, error: "Customer country is required." };
  if (phoneRaw !== undefined && phoneRaw !== null && phoneRaw !== "" && !phone) {
    return { ok: false, error: "Customer phone is invalid." };
  }

  if (!Array.isArray(input.items) || input.items.length === 0) {
    return { ok: false, error: "Order items are required." };
  }
  if (input.items.length > 10) {
    return { ok: false, error: "Too many line items." };
  }

  const items: { variantId: string; qty: number }[] = [];
  const seen = new Set<string>();
  for (const raw of input.items) {
    const variantId = str(raw?.variantId, 40);
    const qty = raw?.qty;
    if (!variantId) return { ok: false, error: "Invalid item variant." };
    if (!getFinish(variantId)) {
      return { ok: false, error: `Unknown finish: ${variantId}` };
    }
    if (
      typeof qty !== "number" ||
      !Number.isInteger(qty) ||
      qty < 1 ||
      qty > 10
    ) {
      return {
        ok: false,
        error: "Item quantity must be an integer from 1 to 10.",
      };
    }
    if (seen.has(variantId)) {
      return { ok: false, error: "Duplicate line items are not allowed." };
    }
    seen.add(variantId);
    items.push({ variantId, qty });
  }

  return {
    ok: true,
    value: {
      customer: {
        email,
        name,
        phone,
        address,
        city,
        postal,
        country,
      },
      items,
    },
  };
}

export async function createOrder(
  input: CreateOrderInput,
): Promise<CreateOrderResult> {
  const validated = validateCreateOrder(input);
  if (!validated.ok) {
    return { ok: false, status: 400, error: validated.error };
  }

  const lineItems: PublicOrderItem[] = validated.value.items.map((i) => {
    const finish = getFinish(i.variantId)!;
    return {
      name: PRODUCT.name,
      finish: finish.name,
      qty: i.qty,
      unitPrice: PRODUCT.price,
      lineTotal: PRODUCT.price * i.qty,
    };
  });

  const subtotal = lineItems.reduce((s, i) => s + i.lineTotal, 0);
  const itemCount = lineItems.reduce((s, i) => s + i.qty, 0);
  const { shipping, total } = orderTotals(subtotal, itemCount);

  const stored: StoredOrder = {
    id: createOrderId(),
    status: "confirmed",
    createdAt: new Date().toISOString(),
    items: lineItems,
    subtotal,
    shipping,
    total,
    payment: {
      mode: "simulated",
      status: "not_charged",
    },
    customer: validated.value.customer,
  };

  try {
    await redisSet(
      `order:${stored.id}`,
      JSON.stringify(stored),
      ORDER_TTL_SECONDS,
    );
  } catch {
    return {
      ok: false,
      status: 503,
      error: "Order storage is unavailable. Please try again shortly.",
    };
  }

  return { ok: true, receipt: toPublicReceipt(stored) };
}

export async function getPublicReceipt(
  id: string,
): Promise<PublicReceipt | null> {
  if (!/^ROL-[A-Z0-9]{8}$/.test(id)) return null;
  try {
    const raw = await redisGet(`order:${id}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredOrder;
    if (!parsed || parsed.id !== id) return null;
    return toPublicReceipt(parsed);
  } catch {
    return null;
  }
}
