"use client";

import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useRef } from "react";
import { ProductVisual } from "@/components/product/ProductVisual";
import { PRODUCT, getFinish } from "@/lib/product";
import { EASE } from "@/components/motion/Reveal";

type ModeId = "lick" | "roll" | "puzzle";

const MODES: {
  id: ModeId;
  label: string;
  n: string;
  body: string;
}[] = [
  {
    id: "lick",
    label: "Lick",
    n: "01",
    body: "Add kibble or soft treats into the center well. The soft silicone surface invites calm licking — the first beat of the ritual.",
  },
  {
    id: "roll",
    label: "Roll",
    n: "02",
    body: "Your dog rolls the weighted body across the floor. Movement releases kibble from the treat track in short, satisfying bursts.",
  },
  {
    id: "puzzle",
    label: "Puzzle",
    n: "03",
    body: "Adjust the treat gate to raise the challenge. Focused problem-solving drops arousal — sessions end in a calmer dog.",
  },
];

const RITUAL = [
  {
    n: "01",
    title: "Load",
    body: "Add kibble or soft treats into the center well. Adjust difficulty with the simple treat gate.",
  },
  {
    n: "02",
    title: "Engage",
    body: "Your dog licks, rolls, and solves — three modes on one footprint, without a toy explosion.",
  },
  {
    n: "03",
    title: "Settle",
    body: "Focused work drops arousal. Sessions end in a calmer dog and a quieter room.",
  },
];

export function ModeStory() {
  const [mode, setMode] = useState<ModeId>("lick");
  const finish = PRODUCT.finishes[0];
  const reduced = useReducedMotion();
  const storyRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: storyRef,
    offset: ["start end", "end start"],
  });

  const productY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const productScale = useTransform(scrollYProgress, [0, 0.4, 0.7, 1], [0.96, 1.02, 1.02, 0.98]);
  const glow = useTransform(scrollYProgress, [0, 0.5, 1], [0.35, 0.55, 0.4]);

  const active = MODES.find((m) => m.id === mode) ?? MODES[0];

  return (
    <section id="how" className="scroll-mt-24 border-t border-line bg-white/30">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-clay">
            How it works
          </p>
          <h2 className="mt-3 font-display text-3xl tracking-tight text-charcoal sm:text-4xl">
            Three modes. One calm ritual.
          </h2>
          <p className="mt-4 max-w-lg leading-relaxed text-muted">
            Same object throughout — explore how ONE moves from load to settle
            without leaving the room.
          </p>
        </div>

        {/* Mode explorer */}
        <div
          ref={storyRef}
          className="mt-12 grid items-center gap-8 lg:grid-cols-[1fr_1fr] lg:gap-14"
        >
          {/* product — continuous object */}
          <div className="relative order-1 lg:order-2">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-line bg-gradient-to-br from-white/70 via-ivory to-sand/30 shadow-[0_36px_70px_-40px_rgba(28,26,23,0.3)]">
              <motion.div
                style={reduced ? undefined : { y: productY, scale: productScale }}
                className="relative"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mode}
                    initial={reduced ? false : { opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduced ? undefined : { opacity: 0, scale: 1.01 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    <ProductVisual
                      finishHex={finish.hex}
                      finishName={finish.name}
                      mode={mode}
                      bare
                      className="min-h-[320px] sm:min-h-[400px]"
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* mode label */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <p className="font-display text-sm tracking-[0.2em] text-charcoal">
                  {active.label.toUpperCase()}
                </p>
                <span className="rounded-full border border-line bg-white/80 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-muted backdrop-blur">
                  {active.n} / 03
                </span>
              </div>
            </div>
          </div>

          {/* tabs + copy */}
          <div className="order-2 lg:order-1">
            <div
              role="tablist"
              aria-label="Enrichment modes"
              className="flex flex-wrap gap-2"
            >
              {MODES.map((m) => {
                const selected = m.id === mode;
                return (
                  <button
                    key={m.id}
                    role="tab"
                    type="button"
                    aria-selected={selected}
                    aria-controls={`mode-panel-${m.id}`}
                    id={`mode-tab-${m.id}`}
                    onClick={() => setMode(m.id)}
                    onKeyDown={(e) => {
                      const idx = MODES.findIndex((x) => x.id === mode);
                      if (e.key === "ArrowRight") {
                        e.preventDefault();
                        setMode(MODES[(idx + 1) % MODES.length].id);
                      } else if (e.key === "ArrowLeft") {
                        e.preventDefault();
                        setMode(
                          MODES[(idx - 1 + MODES.length) % MODES.length].id,
                        );
                      }
                    }}
                    className={`relative rounded-full px-5 py-2.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay ${
                      selected
                        ? "text-ivory"
                        : "border border-line bg-white/60 text-charcoal hover:border-charcoal/30 hover:bg-white"
                    }`}
                  >
                    {selected && (
                      <motion.span
                        layoutId="mode-pill"
                        className="absolute inset-0 rounded-full bg-charcoal"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        aria-hidden
                      />
                    )}
                    <span className="relative z-10">
                      {m.n} · {m.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                id={`mode-panel-${active.id}`}
                role="tabpanel"
                aria-labelledby={`mode-tab-${active.id}`}
                tabIndex={0}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="mt-7 rounded-2xl border border-line bg-ivory/70 p-6 sm:p-7"
              >
                <p className="font-display text-2xl text-charcoal">
                  {active.label}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                  {active.body}
                </p>
                <p className="mt-4 text-xs uppercase tracking-[0.16em] text-clay">
                  Lick · Roll · Puzzle — three modes, one footprint
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Scroll ritual — Load → Engage → Settle */}
        <div className="mt-16 border-t border-line pt-12 sm:mt-20">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted">
            The ritual
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {RITUAL.map((s, i) => (
              <motion.article
                key={s.n}
                initial={reduced ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.7, ease: EASE, delay: i * 0.1 }}
                className="group relative rounded-2xl border border-line bg-ivory/80 p-7 transition hover:border-charcoal/20 hover:bg-white/70"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-clay/30 bg-clay/10 font-display text-xs text-clay">
                    {s.n}
                  </span>
                  <div
                    className="h-px flex-1 bg-gradient-to-r from-line to-transparent"
                    aria-hidden
                  />
                </div>
                <h3 className="mt-4 font-display text-2xl text-charcoal">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {s.body}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
