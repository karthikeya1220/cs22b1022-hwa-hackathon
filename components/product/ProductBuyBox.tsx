"use client";

import { useState } from "react";
import { FinishSelector } from "@/components/product/FinishSelector";
import { ProductVisual } from "@/components/product/ProductVisual";
import { PRODUCT, formatPrice, getFinish } from "@/lib/product";
import { useCart } from "@/lib/cart-context";

export function ProductBuyBox() {
  const [finishId, setFinishId] = useState<string>(PRODUCT.finishes[0].id);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const finish = getFinish(finishId) ?? PRODUCT.finishes[0];
  const lineTotal = PRODUCT.price * qty;

  return (
    <div id="product" className="scroll-mt-24">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <ProductVisual
          finishHex={finish.hex}
          finishName={finish.name}
          className="lg:sticky lg:top-24 lg:self-start lg:min-h-[520px]"
        />

        <div className="lg:pt-2">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-clay">
            The enrichment device
          </p>
          <h1 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight text-charcoal sm:text-5xl">
            {PRODUCT.name}
          </h1>
          <p className="mt-3 text-lg text-muted">{PRODUCT.tagline}</p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-3xl text-charcoal">
              {formatPrice(PRODUCT.price)}
            </span>
            <span className="text-sm text-muted">
              or 4 × {formatPrice(Math.round(PRODUCT.price / 4))} — demo only
            </span>
          </div>

          <p className="mt-5 max-w-md leading-relaxed text-charcoal-soft">
            {PRODUCT.description}
          </p>

          <div className="mt-8 space-y-6 border-t border-line pt-7">
            <FinishSelector
              finishes={PRODUCT.finishes}
              value={finishId}
              onChange={setFinishId}
            />

            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label
                  htmlFor="qty"
                  className="text-xs font-medium uppercase tracking-[0.2em] text-muted"
                >
                  Quantity
                </label>
                <div className="mt-2 inline-flex items-center rounded-full border border-line bg-white/60">
                  <button
                    type="button"
                    className="h-11 w-11 text-lg text-charcoal transition hover:text-clay disabled:opacity-30"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span
                    id="qty"
                    className="w-10 text-center text-sm font-medium tabular-nums text-charcoal"
                    aria-live="polite"
                  >
                    {qty}
                  </span>
                  <button
                    type="button"
                    className="h-11 w-11 text-lg text-charcoal transition hover:text-clay disabled:opacity-30"
                    onClick={() => setQty((q) => Math.min(10, q + 1))}
                    disabled={qty >= 10}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <p className="pb-2 text-sm text-muted">
                Line total{" "}
                <span className="font-medium text-charcoal">
                  {formatPrice(lineTotal)}
                </span>
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => addItem(finish.id, qty)}
                className="flex-1 rounded-full bg-charcoal px-8 py-4 text-sm font-medium tracking-wide text-ivory transition hover:bg-clay focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
              >
                Add to cart — {formatPrice(lineTotal)}
              </button>
            </div>

            <p className="text-xs leading-relaxed text-muted">
              Ships in 2–4 days · 30-day calm guarantee · Checkout is a
              simulated demo — no real payment is processed.
            </p>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-4 border-t border-line pt-7 text-sm">
            <div>
              <dt className="text-muted">Modes</dt>
              <dd className="mt-1 font-medium text-charcoal">
                Lick · Roll · Puzzle
              </dd>
            </div>
            <div>
              <dt className="text-muted">Care</dt>
              <dd className="mt-1 font-medium text-charcoal">
                Dishwasher-safe inserts
              </dd>
            </div>
            <div>
              <dt className="text-muted">Base</dt>
              <dd className="mt-1 font-medium text-charcoal">
                Weighted, quiet-grip
              </dd>
            </div>
            <div>
              <dt className="text-muted">Size</dt>
              <dd className="mt-1 font-medium text-charcoal">
                Ø 22 cm · 1.4 kg
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
