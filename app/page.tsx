import { PRODUCT, formatPrice } from "@/lib/product";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <section className="animate-fade-up py-16 sm:py-24">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-clay">
          Single product launch
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.05] tracking-tight text-charcoal sm:text-6xl">
          {PRODUCT.name}
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
          {PRODUCT.tagline} {PRODUCT.description}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#product"
            className="rounded-full bg-charcoal px-7 py-3.5 text-sm tracking-wide text-ivory transition hover:bg-clay"
          >
            Explore the ONE
          </a>
          <span className="text-sm text-muted">
            From {formatPrice(PRODUCT.price)}
          </span>
        </div>
      </section>

      <section id="product" className="border-t border-line py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="aspect-square rounded-3xl border border-line bg-ivory-deep p-10">
              <div className="flex h-full items-center justify-center rounded-2xl border border-line/60 bg-white/40">
                <div className="text-center">
                  <div className="mx-auto h-28 w-28 rounded-full border-[10px] border-clay/80 bg-ivory shadow-inner" />
                  <p className="mt-6 font-display tracking-[0.2em] text-charcoal">
                    ROLLOVER ONE
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">
                    Product visual — Phase 2
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="font-display text-3xl text-charcoal sm:text-4xl">
              Built for focus, not frenzy
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              ONE rotates through licking, rolling, and puzzle modes so your dog
              works for food and play in a single, considered object.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-charcoal-soft">
              <li className="flex gap-3">
                <span className="text-clay">—</span> Three enrichment modes, one
                footprint
              </li>
              <li className="flex gap-3">
                <span className="text-clay">—</span> Dishwasher-safe inserts
              </li>
              <li className="flex gap-3">
                <span className="text-clay">—</span> Quiet, weighted base for
                calmer sessions
              </li>
            </ul>
            <p className="mt-8 text-sm text-muted">
              Finishes &amp; buy box arrive in Phase 2. Cart shell is live now.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
