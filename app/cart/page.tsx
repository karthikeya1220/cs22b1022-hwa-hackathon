"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { CartLine } from "@/components/cart/CartLine";
import { formatPrice, PRODUCT } from "@/lib/product";

export default function CartPage() {
  const { items, count, subtotalCents, clear } = useCart();
  const freeShipThreshold = 7500;
  const shippingCents =
    items.length === 0 || subtotalCents >= freeShipThreshold ? 0 : 600;
  const totalCents = subtotalCents + shippingCents;

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-clay">
            Cart
          </p>
          <h1 className="mt-2 font-display text-3xl tracking-tight text-charcoal sm:text-4xl">
            Your selection
          </h1>
        </div>
        <p className="text-sm text-muted">
          {count} item{count === 1 ? "" : "s"}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <div className="h-20 w-20 rounded-full border-2 border-dashed border-line" />
          <h2 className="mt-6 font-display text-2xl text-charcoal">
            Nothing here yet
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            ROLLOVER ONE comes in Clay, Sage, and Charcoal — pick the finish
            that disappears into your room.
          </p>
          <Link
            href="/#product"
            className="mt-8 rounded-full bg-charcoal px-7 py-3.5 text-sm text-ivory transition hover:bg-clay"
          >
            Shop ROLLOVER ONE
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <ul className="divide-y divide-line border-y border-line">
              {items.map((item) => (
                <li key={item.variantId} className="py-6">
                  <CartLine item={item} />
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <Link
                href="/#product"
                className="text-sm text-muted underline-offset-4 transition hover:text-charcoal hover:underline"
              >
                ← Keep shopping
              </Link>
              <button
                type="button"
                onClick={clear}
                className="text-xs text-muted underline-offset-4 transition hover:text-clay hover:underline"
              >
                Clear cart
              </button>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-line bg-white/50 p-6 lg:sticky lg:top-24">
            <h2 className="font-display text-lg tracking-wide text-charcoal">
              Order summary
            </h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="tabular-nums text-charcoal">
                  {formatPrice(subtotalCents)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Shipping</dt>
                <dd className="tabular-nums text-charcoal">
                  {shippingCents === 0 ? "Free" : formatPrice(shippingCents)}
                </dd>
              </div>
              {shippingCents > 0 && (
                <p className="text-xs text-muted">
                  Free shipping over {formatPrice(freeShipThreshold)} — add{" "}
                  {formatPrice(freeShipThreshold - subtotalCents)} more.
                </p>
              )}
              <div className="flex justify-between border-t border-line pt-3">
                <dt className="font-medium text-charcoal">Total</dt>
                <dd className="font-medium tabular-nums text-charcoal">
                  {formatPrice(totalCents)}
                </dd>
              </div>
            </dl>

            <Link
              href="/checkout"
              className="mt-6 block rounded-full bg-charcoal px-6 py-3.5 text-center text-sm font-medium text-ivory transition hover:bg-clay"
            >
              Proceed to checkout
            </Link>
            <p className="mt-3 text-center text-xs leading-relaxed text-muted">
              Simulated checkout — no real payment is processed.
            </p>
            <p className="mt-4 border-t border-line pt-4 text-xs text-muted">
              {PRODUCT.name} · 30-day calm guarantee · Free returns
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
