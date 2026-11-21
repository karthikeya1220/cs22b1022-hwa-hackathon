"use client";

import Link from "next/link";
import { PRODUCT, formatPrice, getFinish } from "@/lib/product";
import { useCart } from "@/lib/cart-context";
import {
  FREE_SHIPPING_THRESHOLD,
  orderTotals,
  shippingCents,
} from "@/lib/pricing";

export function OrderSummary({ submitLabel }: { submitLabel?: string }) {
  const { items, count, subtotalCents } = useCart();
  const { shipping, total } = orderTotals(subtotalCents, count);

  if (items.length === 0) {
    return (
      <aside className="h-fit rounded-2xl border border-line bg-white/50 p-6">
        <h2 className="font-display text-lg tracking-wide text-charcoal">
          Order summary
        </h2>
        <p className="mt-4 text-sm text-muted">Your cart is empty.</p>
        <Link
          href="/#product"
          className="mt-5 inline-block rounded-full border border-line px-5 py-2.5 text-sm text-charcoal transition hover:border-charcoal"
        >
          Shop ROLLOVER ONE
        </Link>
      </aside>
    );
  }

  return (
    <aside className="h-fit rounded-2xl border border-line bg-white/50 p-6 lg:sticky lg:top-24">
      <h2 className="font-display text-lg tracking-wide text-charcoal">
        Order summary
      </h2>

      <ul className="mt-5 space-y-4">
        {items.map((item) => {
          const finish = getFinish(item.variantId);
          return (
            <li key={item.variantId} className="flex gap-3">
              <div
                className="h-12 w-12 shrink-0 rounded-lg border border-line"
                style={{
                  background: `radial-gradient(circle at 35% 30%, color-mix(in srgb, ${finish?.hex ?? "#c45c3e"} 70%, white), ${finish?.hex ?? "#c45c3e"})`,
                }}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-charcoal">
                  {PRODUCT.name}
                </p>
                <p className="text-xs text-muted">
                  {finish?.name} · Qty {item.qty}
                </p>
              </div>
              <p className="text-sm tabular-nums text-charcoal">
                {formatPrice(PRODUCT.price * item.qty)}
              </p>
            </li>
          );
        })}
      </ul>

      <dl className="mt-6 space-y-3 border-t border-line pt-5 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd className="tabular-nums text-charcoal">
            {formatPrice(subtotalCents)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Shipping</dt>
          <dd className="tabular-nums text-charcoal">
            {shipping === 0 ? "Free" : formatPrice(shipping)}
          </dd>
        </div>
        <div className="flex justify-between border-t border-line pt-3">
          <dt className="font-medium text-charcoal">Total</dt>
          <dd className="font-medium tabular-nums text-charcoal">
            {formatPrice(total)}
          </dd>
        </div>
      </dl>

      {shippingCents(subtotalCents, count) > 0 && (
        <p className="mt-3 text-xs text-muted">
          Free shipping over {formatPrice(FREE_SHIPPING_THRESHOLD)}.
        </p>
      )}

      <div className="mt-5 rounded-xl border border-clay/30 bg-clay-soft/30 p-3">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-clay-deep">
          Simulated payment
        </p>
        <p className="mt-1 text-xs leading-relaxed text-charcoal-soft">
          Demo checkout only — no card is collected and no charge is made.
        </p>
      </div>

      {submitLabel ? (
        <p className="mt-4 text-center text-xs text-muted">{submitLabel}</p>
      ) : null}
    </aside>
  );
}
