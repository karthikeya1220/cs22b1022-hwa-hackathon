import { ProductBuyBox } from "@/components/product/ProductBuyBox";
import { HowItWorks } from "@/components/product/HowItWorks";
import { Benefits } from "@/components/product/Benefits";
import { Specs } from "@/components/product/Specs";
import { FinalCta } from "@/components/product/FinalCta";
import { PRODUCT, formatPrice } from "@/lib/product";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,92,62,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(212,196,168,0.35),transparent_50%)]" />
        <div className="relative mx-auto max-w-6xl px-5 pt-14 pb-16 sm:px-8 sm:pt-20 sm:pb-20">
          <div className="animate-fade-up max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-clay">
              Premium dog enrichment
            </p>
            <h1 className="mt-4 font-display text-5xl leading-[1.02] tracking-tight text-charcoal sm:text-6xl md:text-7xl">
              Enrichment that
              <span className="block text-clay">wears them out.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              {PRODUCT.name} turns mealtime and play into calm, focused work —
              one considered object instead of a bin of toys.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#product"
                className="rounded-full bg-charcoal px-8 py-4 text-sm font-medium tracking-wide text-ivory transition hover:bg-clay"
              >
                Shop ROLLOVER ONE
              </a>
              <span className="text-sm text-muted">
                From {formatPrice(PRODUCT.price)} · Free returns
              </span>
            </div>
          </div>

          <div className="mt-14 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {[
              ["3", "enrichment modes"],
              ["1", "object, not a toy bin"],
              ["30", "day calm guarantee"],
            ].map(([n, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-line bg-white/50 px-4 py-5 backdrop-blur-sm"
              >
                <p className="font-display text-3xl text-charcoal">{n}</p>
                <p className="mt-1 text-xs leading-snug text-muted">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <ProductBuyBox />
      </div>

      <HowItWorks />
      <Benefits />
      <Specs />
      <FinalCta />
    </>
  );
}
