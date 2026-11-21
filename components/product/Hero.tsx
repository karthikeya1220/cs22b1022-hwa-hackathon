"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PRODUCT, formatPrice } from "@/lib/product";
import { ProductFrame } from "@/components/three/ProductFrame";
import { Tilt } from "@/components/motion/Tilt";
import { EASE } from "@/components/motion/Reveal";

const stats: [string, string][] = [
  ["3", "enrichment modes"],
  ["1", "object, not a toy bin"],
  ["22", "cm footprint"],
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

      <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-5 pt-8 pb-14 sm:px-8 sm:pt-12 sm:pb-16 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12 lg:pt-14 lg:pb-24">
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
            className="mt-3 font-display text-4xl leading-[1.02] tracking-tight text-charcoal sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Enrichment that
            <span className="block text-clay">wears them out.</span>
          </motion.h1>

          <motion.p
            {...line(2)}
            className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {PRODUCT.name} turns mealtime and play into calm, focused work —
            one considered object instead of a bin of toys.
          </motion.p>

          <motion.div
            {...line(3)}
            className="mt-7 flex flex-wrap items-center gap-4"
          >
            <a
              href="#product"
              className="rounded-full bg-charcoal px-7 py-3.5 text-sm font-medium tracking-wide text-ivory shadow-[0_12px_32px_-14px_rgba(28,26,23,0.5)] transition hover:bg-clay hover:shadow-[0_16px_36px_-14px_rgba(196,92,62,0.55)] active:scale-[0.99] sm:px-8 sm:py-4"
            >
              Shop ROLLOVER ONE
            </a>
            <span className="text-sm text-muted">
              From {formatPrice(PRODUCT.price)} · Three finishes
            </span>
          </motion.div>

          {/* compact stat row — keeps mobile hero short so the product appears sooner */}
          <motion.dl
            {...line(4)}
            className="mt-7 flex flex-wrap gap-2 sm:mt-10 sm:gap-4"
          >
            {stats.map(([n, label]) => (
              <div
                key={label}
                className="min-w-[7.5rem] flex-1 rounded-xl border border-line bg-white/55 px-3 py-3 backdrop-blur-sm sm:min-w-0 sm:rounded-2xl sm:px-4 sm:py-4"
              >
                <dt className="sr-only">{label}</dt>
                <dd>
                  <span className="font-display text-2xl text-charcoal sm:text-3xl">
                    {n}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-muted sm:text-xs">
                    {label}
                  </span>
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* product stage — larger launch moment */}
        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.94, y: 28 }}
          animate={reduced ? undefined : { opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.05, ease: EASE, delay: 0.22 }}
          className="relative mx-auto w-full max-w-md sm:max-w-lg lg:max-w-none"
        >
          <Tilt enabled max={6} scale={1.02}>
            <ProductFrame
              stage="hero"
              finish={finish}
              frameClassName="min-h-[300px] sm:min-h-[440px] lg:min-h-[560px] shadow-[0_48px_90px_-40px_rgba(28,26,23,0.4)]"
            />
          </Tilt>

          {/* floating meta chip — short so it never wraps mid-token */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.7 }}
            className="absolute -bottom-3 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-full border border-line bg-ivory/95 px-5 py-2 text-xs tracking-wide text-charcoal shadow-sm backdrop-blur sm:block"
          >
            Ø 22 cm · 1.4 kg · Three modes
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
