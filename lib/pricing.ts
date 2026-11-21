import { PRODUCT } from "@/lib/product";

export const FREE_SHIPPING_THRESHOLD = 7500;
export const SHIPPING_CENTS = 600;

export function shippingCents(subtotalCents: number, itemCount: number): number {
  if (itemCount <= 0 || subtotalCents <= 0) return 0;
  if (subtotalCents >= FREE_SHIPPING_THRESHOLD) return 0;
  return SHIPPING_CENTS;
}

export function orderTotals(
  subtotalCents: number,
  itemCount: number,
): { shipping: number; total: number } {
  const shipping = shippingCents(subtotalCents, itemCount);
  return { shipping, total: subtotalCents + shipping };
}

export function lineSubtotal(qty: number): number {
  return PRODUCT.price * qty;
}
