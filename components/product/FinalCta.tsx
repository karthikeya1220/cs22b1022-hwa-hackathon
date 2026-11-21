import Link from "next/link";
import { PRODUCT, formatPrice } from "@/lib/product";

export function FinalCta() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="rounded-3xl border border-line bg-gradient-to-br from-ivory-deep via-ivory to-clay-soft/30 px-7 py-12 text-center sm:px-14">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-clay">
            Ready when they are
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl leading-tight tracking-tight text-charcoal sm:text-4xl">
            Bring home the one that ends the toy clutter
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted">
            {PRODUCT.name} from {formatPrice(PRODUCT.price)} · Three finishes ·
            Simulated checkout for this demo storefront.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="#product"
              className="rounded-full bg-charcoal px-8 py-3.5 text-sm tracking-wide text-ivory transition hover:bg-clay"
            >
              Choose your finish
            </Link>
            <Link
              href="/cart"
              className="rounded-full border border-charcoal/20 bg-white/60 px-8 py-3.5 text-sm tracking-wide text-charcoal transition hover:border-charcoal"
            >
              View cart
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
