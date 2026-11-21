"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PRODUCT, formatPrice } from "@/lib/product";
import { ProductStage } from "@/components/product/ProductStage";
import { Tilt } from "@/components/motion/Tilt";
import { EASE } from "@/components/motion/Reveal";

const stats: [string, string][] = [
  ["3", "enrichment modes"],
  ["1", "object, not a toy bin"],
  ["30", "day calm guarantee"],
];

export function Hero() {
  const reduced = useReducedMotion();
  const finish = PRODUCT.finishes[0];

  const line = (i: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, ease: EASE, delay: 0.15 + i * 0.12 },
        };

  return (
    <section className="relative overflow-hidden border-b border-line">
      {/* soft ambient washes */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at top right, rgba(196,92,62,0.14), transparent 55%), radial-gradient(ellipse at bottom left, rgba(212,196,168,0.4), transparent 50%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pt-12 pb-16 sm:px-8 sm:pt-16 sm:pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:pt-16 lg:pb-24">
        {/* copy */}
        <div className="max-w-xl">
          <motion.p
            {...line(0)}
            className="text-xs font-medium uppercase tracking-[0.28em] text-clay"
          >
            Premium dog enrichment
          </motion.p>

          <motion.h1
            {...line(1)}
            className="mt-4 font-display text-5xl leading-[1.02] tracking-tight text-charcoal sm:text-6xl md:text-7xl"
          >
            Enrichment that
            <span className="block text-clay">wears them out.</span>
          </motion.h1>

          <motion.p
            {...line(2)}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted"
          >
            {PRODUCT.name} turns mealtime and play into calm, focused work —
            one considered object instead of a bin of toys.
          </motion.p>

          <motion.div
            {...line(3)}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#product"
              className="rounded-full bg-charcoal px-8 py-4 text-sm font-medium tracking-wide text-ivory shadow-[0_12px_32px_-14px_rgba(28,26,23,0.5)] transition hover:bg-clay hover:shadow-[0_16px_36px_-14px_rgba(196,92,62,0.55)] active:scale-[0.99]"
            >
              Shop ROLLOVER ONE
            </a>
            <span className="text-sm text-muted">
              From {formatPrice(PRODUCT.price)} · Free returns
            </span>
          </motion.div>

          <motion.dl
            {...line(4)}
            className="mt-12 grid max-w-lg grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4"
          >
            {stats.map(([n, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-line bg-white/55 px-4 py-5 backdrop-blur-sm"
              >
                <dt className="sr-only">{label}</dt>
                <dd>
                  <span className="font-display text-3xl text-charcoal">
                    {n}
                  </span>
                  <span className="mt-1 block text-xs leading-snug text-muted">
                    {label}
                  </span>
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* product stage */}
        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.96, y: 24 }}
          animate={reduced ? undefined : { opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.25 }}
          className="relative mx-auto w-full max-w-lg lg:max-w-none"
        >
          <Tilt enabled max={6} scale={1.02}>
            <ProductStage
              finish={finish}
              frameClassName="min-h-[360px] sm:min-h-[480px] lg:min-h-[540px] shadow-[0_40px_80px_-40px_rgba(28,26,23,0.35)]"
            />
          </Tilt>

          {/* floating meta chip */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.7 }}
            className="absolute -bottom-3 left-1/2 hidden -translate-x-1/2 rounded-full border border-line bg-ivory/95 px-5 py-2 text-xs tracking-wide text-charcoal shadow-sm backdrop-blur sm:block"
          >
            Ø 22 cm · 1.4 kg · Lick · Roll · Puzzle
          </motion.div>
        </motion.div>
      </div>

      {/* scroll cue */}
      {!reduced && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
          aria-hidden
        >
          <span className="text-[10px] uppercase tracking-[0.22em] text-muted">
            Scroll
          </span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-8 w-px bg-gradient-to-b from-charcoal/40 to-transparent"
          />
        </motion.div>
      )}
    </section>
  );
}
