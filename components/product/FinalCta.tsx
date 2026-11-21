"use client";

import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { PRODUCT, formatPrice } from "@/lib/product";

export function FinalCta() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-ivory-deep via-ivory to-clay-soft/30 px-7 py-12 text-center shadow-[0_30px_60px_-40px_rgba(28,26,23,0.3)] sm:px-14">
            {/* ghost disc */}
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-20"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, #e8c4b8, #c45c3e 60%, #a34830)",
                filter: "blur(2px)",
              }}
              aria-hidden
            />

            <p className="text-xs font-medium uppercase tracking-[0.28em] text-clay">
              Ready when they are
            </p>
            <h2 className="relative mx-auto mt-4 max-w-2xl font-display text-3xl leading-tight tracking-tight text-charcoal sm:text-4xl">
              Bring home the one that ends the toy clutter
            </h2>
            <p className="relative mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted">
              {PRODUCT.name} from {formatPrice(PRODUCT.price)} · Three finishes
              · Simulated checkout for this demo storefront.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="#product"
                className="rounded-full bg-charcoal px-8 py-3.5 text-sm tracking-wide text-ivory transition hover:bg-clay active:scale-[0.99]"
              >
                Choose your finish
              </Link>
              <Link
                href="/cart"
                className="rounded-full border border-charcoal/20 bg-white/60 px-8 py-3.5 text-sm tracking-wide text-charcoal transition hover:border-charcoal active:scale-[0.99]"
              >
                View cart
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
