"use client";

import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/Reveal";

const benefits = [
  {
    title: "Wears them out indoors",
    body: "Mental work tires a dog faster than a lap around the block — rain or no rain.",
  },
  {
    title: "Slows mealtime",
    body: "Turns a thirty-second bolt-down into ten minutes of focused foraging.",
  },
  {
    title: "One object, not a bin",
    body: "Designed to live in the room you actually use — not a toy graveyard under the sofa.",
  },
  {
    title: "Quiet by design",
    body: "Weighted base and soft-touch shell keep sessions from becoming a rolling racket.",
  },
];

export function Benefits() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-clay">
              Why ONE
            </p>
            <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight text-charcoal sm:text-4xl">
              Enrichment that fits a modern home
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-muted">
              Built for dogs who need a job, and people who want their living
              room back.
            </p>
          </Reveal>

          <StaggerGroup className="grid gap-4 sm:grid-cols-2">
            {benefits.map((b) => (
              <StaggerItem key={b.title}>
                <article className="group h-full rounded-2xl border border-line bg-ivory-deep/40 p-6 transition duration-300 hover:-translate-y-0.5 hover:border-charcoal/20 hover:bg-white/70 hover:shadow-[0_16px_40px_-28px_rgba(28,26,23,0.35)]">
                  <h3 className="font-display text-lg text-charcoal">
                    {b.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {b.body}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
